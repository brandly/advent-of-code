const fs = require('fs')
const assert = require('assert')

const input = fs
  .readFileSync(`${__dirname}/2.txt`, 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split('\t').map(n => parseInt(n, 10)))

const first = input =>
  input
    .map(line => Math.max.apply(Math, line) - Math.min.apply(Math, line))
    .reduce((total, n) => {
      return total + n
    }, 0)

assert.equal(first([[5, 1, 9, 5]]), 8)
assert.equal(first([[7, 5, 3]]), 4)
assert.equal(first([[2, 4, 6, 8]]), 6)
assert.equal(first([[5, 1, 9, 5], [7, 5, 3], [2, 4, 6, 8]]), 18)

console.log(first(input))

const second = input =>
  input
    .map(line => {
      const [a, b] = pairThatDivides(line)
      return a / b
    })
    .reduce((total, n) => {
      return total + n
    }, 0)

// [Int] -> (Int, Int)
const pairThatDivides = line => {
  for (var i = 0; i < line.length; i++) {
    for (var j = i; j < line.length; j++) {
      const big = Math.max(line[i], line[j])
      const lil = Math.min(line[i], line[j])
      if (big !== lil && big % lil === 0) {
        return [big, lil]
      }
    }
  }
}

console.log(second(input))
