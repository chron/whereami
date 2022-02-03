const { DateTime } = require('luxon');

function prevWorkingDay(d) {
  const yesterday = d.minus({ days: 1 });

  if (yesterday.weekday == 6 || yesterday.weekday == 7) {
    return prevWorkingDay(yesterday)
  } else {
    return yesterday;
  }
}

module.exports = [
  {
    name: '#where-am-i',
    slackChannelId: 'C01VD3VJYDA',
    dateFormat: 'W',
    datePrefix: 'Week ',
    dateFunc: (delta) => DateTime.now().setZone('Pacific/Auckland').minus({ weeks: delta }),
    messageFilter: m => m.emojis.length === 5,
    numPeriods: 6,
  },
  {
    name: '#wordle',
    slackChannelId: 'C02UJRCQG4A',
    dateFormat: 'd LLL',
    datePrefix: '',
    dateFunc: (delta) => DateTime.now().setZone('Pacific/Auckland').minus({ days: delta }),
    numPeriods: 10,
    messageFilter: m => m.emojis.length >= 5,
    emojiFilter: e => e.match(/square/)
  },
  {
    name: '#cooldown',
    slackChannelId: 'C014WH4P25N',
    dateFormat: 'd LLL',
    datePrefix: '',
    dateFunc: (delta) => {
      // Daily but excluding weekends
      let d = DateTime.now().setZone('Pacific/Auckland');
      for(let i = 0; i < delta; i++) {
        d = prevWorkingDay(d);
      }
      return d;
    },
    numPeriods: 10,
    messageFilter: m => m.emojis.length > 0,
  },
];
