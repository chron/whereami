const { WebClient } = require('@slack/web-api');
const { DateTime } = require('luxon');
const { sortBy } = require('lodash');
const CHANNELS = require('./channels');

const IGNORED_SUBTYPES = ['bot_message', 'channel_join', 'channel_leave', 'bot_add'];
const TOKEN = process.env.SLACK_TOKEN;
const web = new WebClient(TOKEN);

async function getUsers() {
  const rawUsers = [];
  for await (const page of web.paginate('users.list', {
    limit: 100,
  })) {
    rawUsers.push(...page.members);
  }
  const users = sortBy(
    rawUsers.map(u => [u.id, u.real_name]),
    u => u[1]?.toLowerCase() // Sort alphabetically
  );

  return users;
}

// For future:
// conversations.list to get list of all channels
// conversations.replies to get thread contents if thread_ts == ts (channel, ts)

async function getMessages(channel) {
  const messages = [];

  for await (const page of web.paginate('conversations.history', {
    channel: channel.slackChannelId,
    oldest: channel.dateFunc(channel.numPeriods).toSeconds(),
    limit: 100 // per page
  })) {
    messages.push(...page.messages.filter(message => {
      if (IGNORED_SUBTYPES.includes(message.subtype)) { return false; }

      return true;
    }).map(message => {
      const { user, ts, text } = message;

      const emojis = text.match(/:\w+:/g) || [];
      const filteredEmojis = channel.emojiFilter ? emojis.filter(channel.emojiFilter) : emojis;

      return {
        user,
        ts,
        text,
        emojis: filteredEmojis,
      }
    }).filter(m => !channel.messageFilter || channel.messageFilter(m)));
  }

  return messages;
}

function tsToDateString(ts, dateFormat) {
  return DateTime.fromSeconds(parseFloat(ts)).toFormat(dateFormat);
}

async function byPeriodAndUser(channel, messages, users) {
  const periods = new Array(channel.numPeriods)
    .fill(null)
    .map((_, i) => channel.dateFunc(i).toFormat(channel.dateFormat));

  return users.map(([uid, name]) => {
    const userMessages = messages.filter(message => message.user === uid);

    const userPeriods = periods.map(p => {
      return userMessages.find(m => tsToDateString(m.ts, channel.dateFormat) === p)
    });

    if (userPeriods.every(d => !d)) { return null; }

    return { name, periods: userPeriods };
  }).filter(Boolean);
}

module.exports = async function process() {
  const users = await getUsers();

  const channelData = await Promise.all(CHANNELS.map(async channel => {
    const messages = await getMessages(channel);
    const processedMessages = await byPeriodAndUser(channel, messages, users);

    return {
      ...channel,
      userPeriods: processedMessages,
    };
  }));

  return channelData;
}
