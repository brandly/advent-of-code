'use strict'
const assert = require('assert')
const goal = 34000000

function sumOfFactors (x) {
  let result = 0
  let squareRoot = Math.sqrt(x)
  for (let i = 1; i <= squareRoot; i++) {
    if (x % i === 0) {
      result += i
      const corresponding = x / i
      if (corresponding !== i) {
        result += x / i
      }
    }
  }
  return result
}

function presentsForHouse (number) {
  return sumOfFactors(number) * 10
}

assert.equal(presentsForHouse(1), 10)
assert.equal(presentsForHouse(2), 30)
assert.equal(presentsForHouse(3), 40)
assert.equal(presentsForHouse(4), 70)
assert.equal(presentsForHouse(5), 60)
assert.equal(presentsForHouse(6), 120)
assert.equal(presentsForHouse(7), 80)
assert.equal(presentsForHouse(8), 150)
assert.equal(presentsForHouse(9), 130)

let match = null, i = 1
while (!match) {
  const presents = presentsForHouse(i)

  if (presents >= goal) {
    match = i
  }

  i++
}

console.log('match', match)
