const assert = require('assert')
const { range } = require('lodash')

const input = '197487-673251'
const [floor, ceiling] = input.split('-').map(v => parseInt(v))

const adjacentMatch = (v) => {
  let chars = v.toString().split('')
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] === chars[i - 1]) return true
  }
  return false
}

const alwaysIncrease = (v) => {
  let chars = v.toString().split('')
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] < chars[i - 1]) return false
  }
  return true
}

assert(adjacentMatch(111111))
assert(alwaysIncrease(111111))
assert(adjacentMatch(223450))
assert(!alwaysIncrease(223450))
assert(!adjacentMatch(123789))
assert(alwaysIncrease(123789))

console.log(range(floor, ceiling + 1).filter(v => adjacentMatch(v) && alwaysIncrease(v)).length)

const adjacentMatchPairs = (v) => {
  let chars = v.toString().split('')
  let count = 0
  let i = 1
  while (i < chars.length) {
    if (chars[i] === chars[i - 1]) {
      if (count === 0) {
        count = 2
      } else {
        count++
      }
    } else if (count > 0 && chars[i] !== chars[i - 1]) {
      if (count === 2) {
        return true
      } else {
        count = 0
      }
    }
    i++
  }
  return count === 2
}

assert(adjacentMatchPairs(112233))
assert(alwaysIncrease(112233))
assert(!adjacentMatchPairs(123444))
assert(alwaysIncrease(123444))
assert(adjacentMatchPairs(111122))
assert(alwaysIncrease(111122))

console.log(range(floor, ceiling + 1).filter(v => adjacentMatchPairs(v) && alwaysIncrease(v)).length)
