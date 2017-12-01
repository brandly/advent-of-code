const assert = require('assert')
const fs = require('fs')
const input =
  fs.readFileSync('./1.txt', 'utf-8')
    .trim()
    .split('')
    .map(n => parseInt(n, 10))

function captcha (nums) {
  return nums.reduce((matches, value, index, list) => {
    const nextIndex = index < (list.length - 1) ? index + 1 : 0
    const next = list[nextIndex]

    if (next === value) {
      return matches.concat(value)
    } else {
      return matches
    }
  }, [])
  .reduce((total, val) => {
    return total + val
  }, 0)
}

assert.ok(captcha([1, 1, 2, 2]) === 3)
assert.ok(captcha([1, 1, 1, 1]) === 4)
assert.ok(captcha([1, 2, 3, 4]) === 0)
assert.ok(captcha([9, 1, 2, 1, 2, 1, 2, 9]) === 9)

console.log(captcha(input))
