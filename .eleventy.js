const { DateTime } = require('luxon');
var EmojiConvertor = require('emoji-js');
require('dotenv').config();

MANUAL_REPLACEMENTS = {
  ':dance:': '💃🏻',
}

var emojiConvertor = new EmojiConvertor();
emojiConvertor.replace_mode = 'unified';
emojiConvertor.allow_native = true;

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('_redirects');

  eleventyConfig.addFilter('debug', function(input) {
    return JSON.stringify(input, null, 2);
  });

  eleventyConfig.addFilter('tsToDate', function(input) {
    return DateTime.fromSeconds(parseFloat(input)).toFormat('dd LLL');
  });

  eleventyConfig.addShortcode('dateFromPeriodNum', function(channel, input) {
    return channel.dateFunc(input).toFormat(channel.dateFormat);
  });

  eleventyConfig.addShortcode('parseEmoji', function(emoji, input) {
    const bareName = input.replace(/:/g, '');

    let urlOrUnicodeString;

    if (emoji[bareName]) {
      if (emoji[bareName].match(/^alias:/)) {
        let alias = emoji[bareName].replace(/^alias:/, '');
        urlOrUnicodeString = emoji[alias] ?? emojiConvertor.replace_colons(`:${alias}:`)
      } else {
        urlOrUnicodeString = emoji[bareName];
      }
    } else {
      urlOrUnicodeString = emojiConvertor.replace_colons(input);
    }



    if (urlOrUnicodeString.match(/^http/)) {
      return `<img class="emoji" src="${urlOrUnicodeString}" alt="${bareName}">`;
    } else if (urlOrUnicodeString.match(/^:.*:$/)) {
      return MANUAL_REPLACEMENTS[urlOrUnicodeString] ?? urlOrUnicodeString;
    } else {
      return urlOrUnicodeString;
    }
  });
}
