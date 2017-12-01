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

assert.equal(captcha([1, 1, 2, 2]), 3)
assert.equal(captcha([1, 1, 1, 1]), 4)
assert.equal(captcha([1, 2, 3, 4]), 0)
assert.equal(captcha([9, 1, 2, 1, 2, 1, 2, 9]), 9)

console.log(captcha(input))

function captcha2 (nums) {
  return nums.reduce((matches, value, index, list) => {
    const nextIndex = (list.length / 2 + index) % list.length
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

assert.equal(captcha2([1, 2, 1, 2]), 6)
assert.equal(captcha2([1, 2, 2, 1]), 0)
assert.equal(captcha2([1, 2, 3, 4, 2, 5]), 4)
assert.equal(captcha2([1, 2, 3, 1, 2, 3]), 12)
assert.equal(captcha2([1, 2, 1, 3, 1, 4, 1, 5]), 4)

console.log(captcha2(input))
