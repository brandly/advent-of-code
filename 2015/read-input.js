const fs = require('fs')

module.exports = function(number) {
  return fs
    .readFileSync(__dirname + '/' + number + '-input.txt')
    .toString()
    .trim()
}
