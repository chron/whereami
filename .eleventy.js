const { DateTime } = require('luxon');
var EmojiConvertor = require('emoji-js');
require('dotenv').config();

var emojiConvertor = new EmojiConvertor();
emojiConvertor.replace_mode = 'unified';
emojiConvertor.allow_native = true;

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css');

  eleventyConfig.addFilter('debug', function(input) {
    return JSON.stringify(input, null, 2);
  });

  eleventyConfig.addFilter('tsToDate', function(input) {
    return DateTime.fromSeconds(parseFloat(input)).toFormat('dd LLL');
  });

  eleventyConfig.addShortcode('parseEmoji', function(emoji, input) {
    const bareName = input.replace(/:/g, '');

    if (emoji[bareName]) {
      return `<img class="emoji" src="${emoji[bareName]}" alt="${bareName}">`;
    } else {
      return emojiConvertor.replace_colons(input)
    }
  });
}
