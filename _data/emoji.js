const { WebClient } = require('@slack/web-api');
const TOKEN = process.env.SLACK_TOKEN;

const web = new WebClient(TOKEN);

async function getEmoji() {
  const response = await web.emoji.list();

  return response.emoji;
}

module.exports = getEmoji();
