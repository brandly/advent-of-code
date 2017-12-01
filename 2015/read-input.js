const fs = require('fs')

module.exports = function (number) {
  return fs.readFileSync('./' + number + '-input.txt').toString().trim()
}
