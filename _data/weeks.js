const { DateTime } = require('luxon');
const DATE_FORMAT = 'W'; // TODO: Dry that

module.exports = [5,4,3,2,1,0].map(delta => DateTime.now().minus({ weeks: delta }).toFormat(DATE_FORMAT));
