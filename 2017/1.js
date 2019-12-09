const assert = require('assert')
const fs = require('fs')
const input = fs
  .readFileSync(`${__dirname}/1.txt`, 'utf-8')
  .trim()
  .split('')
  .map(n => parseInt(n, 10))

function makeCaptcha(getNext) {
  return nums =>
    nums
      .reduce((matches, value, index, list) => {
        const nextIndex = getNext(index, list.length)
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

const captcha = makeCaptcha((index, length) =>
  index < length - 1 ? index + 1 : 0
)

assert.equal(captcha([1, 1, 2, 2]), 3)
assert.equal(captcha([1, 1, 1, 1]), 4)
assert.equal(captcha([1, 2, 3, 4]), 0)
assert.equal(captcha([9, 1, 2, 1, 2, 1, 2, 9]), 9)

console.log(captcha(input))

const captcha2 = makeCaptcha((index, length) => (length / 2 + index) % length)

assert.equal(captcha2([1, 2, 1, 2]), 6)
assert.equal(captcha2([1, 2, 2, 1]), 0)
assert.equal(captcha2([1, 2, 3, 4, 2, 5]), 4)
assert.equal(captcha2([1, 2, 3, 1, 2, 3]), 12)
assert.equal(captcha2([1, 2, 1, 3, 1, 4, 1, 5]), 4)

console.log(captcha2(input))
