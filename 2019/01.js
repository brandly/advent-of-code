const fs = require('fs')
const assert = require('assert')

const nums = fs
  .readFileSync(`${__dirname}/01.txt`)
  .toString()
  .trim()
  .split('\n')
  .map(n => parseInt(n))

const fuel = n => Math.floor(n / 3) - 2

const sum = list => list.reduce((a, b) => a + b, 0)

console.log(sum(nums.map(fuel)))

const withFuelWeight = weight => {
  const additional = fuel(weight)

  if (additional > 0) {
    return weight + withFuelWeight(additional)
  } else {
    return weight
  }
}

const part2 = a => withFuelWeight(fuel(a))

assert(part2(14) === 2)
assert(part2(1969) === 966)
assert(part2(100756) === 50346)

console.log(sum(nums.map(part2)))
