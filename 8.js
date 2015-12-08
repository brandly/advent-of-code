'use strict'
const input = require('./read-input')('8')

const result = input.split('\n').map((line) => {
  return line.length - eval(line).length
}).reduce((previous, current) => {
  return previous + current
}, 0)

console.log(result)
