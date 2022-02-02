module.exports = [
  {
    name: 'where-am-i',
    slackChannelId: 'C01VD3VJYDA',
    dateFormat: 'W',
    datePrefix: 'Week ',
    dateFunc: (delta) => ({ weeks: delta }),
    messageFilter: m => m.emojis.length === 5,
    numPeriods: 6,
  },
  {
    name: 'wordle',
    slackChannelId: 'C02UJRCQG4A',
    dateFormat: 'd LLL',
    datePrefix: '',
    dateFunc: (delta) => ({ days: delta }),
    numPeriods: 10,
    messageFilter: m => m.emojis.length >= 5,
    emojiFilter: e => e.match(/square/)
  }
];
