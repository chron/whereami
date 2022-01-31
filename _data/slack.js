const { WebClient } = require('@slack/web-api');
const { DateTime } = require('luxon');
const { sortBy } = require('lodash');
const weeks = require('./weeks');

const IGNORED_SUBTYPES = ['bot_message', 'channel_join', 'channel_leave', 'bot_add'];
const DATE_FORMAT = 'W';
const TOKEN = process.env.SLACK_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL_ID;

async function getMessages(channel) {
  const web = new WebClient(TOKEN);

  // For future:
  // conversations.list to get list of all channels
  // conversations.replies to get thread contents if thread_ts == ts (channel, ts)

  const rawUsers = [];
  for await (const page of web.paginate('users.list', {
    limit: 100,
  })) {
    rawUsers.push(...page.members);
  }
  const users = Object.fromEntries(sortBy(
    rawUsers.map(u => [u.id, u.real_name]),
    u => u[1] // Sort alphabetically
  ));

  const messages = [];

  for await (const page of web.paginate('conversations.history', {
    channel,
    oldest: DateTime.now().minus({ weeks: 6 }).toSeconds(),
    limit: 100 // per page
  })) {
    messages.push(...page.messages.filter(message => {
      if (IGNORED_SUBTYPES.includes(message.subtype)) { return false; }

      return true;
    }).map(message => {
      const { user, ts, text } = message;

      const emojis = text.match(/:\w+:/g) || [];
      const filteredEmojis = emojis.filter(e => !e.match(/skin-tone/));

      return {
        user,
        ts,
        text,
        emojis: filteredEmojis,
      }
    }));
  }

  return { messages, users };
}

function tsToDateString(ts) {
  return DateTime.fromSeconds(parseFloat(ts)).toFormat(DATE_FORMAT);
}

async function byDayAndUser({ messages, users }) {
  return Object.entries(users).map(([uid, name]) => {
    const userMessages = messages.filter(message => message.user === uid);
    const userWeeks = weeks.map(d => {
      return userMessages.find(m => tsToDateString(m.ts) === d && m.emojis.length === 5)
    });

    if (userWeeks.every(d => !d)) { return null; }

    return { name, weeks: userWeeks };
  }).filter(Boolean);
}

module.exports = getMessages(CHANNEL).then(byDayAndUser);
