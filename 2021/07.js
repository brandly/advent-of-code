const fs = require('fs')
const assert = require('assert')
const { range, sum, min } = require('lodash')
const file = fs.readFileSync('2021/07.txt', 'utf-8').trim()

const parse = (input) => input.split(',').map((n) => parseInt(n))

const part1 = (input) => {
  const nums = parse(input)
  const median = nums.sort((a, b) => a - b)[nums.length / 2]
  return sum(nums.map((n) => Math.abs(median - n)))
}

const bang = (n) => (n <= 0 ? n : n + bang(n - 1))

const part2 = (input) => {
  const nums = parse(input)
  // `average` works directly for example but not actual problem hmmm
  // so i check out the numbers close by too
  const average = Math.round(sum(nums) / nums.length)
  const close = range(average - 3, average + 3).map((c) => (
    sum(nums.map((n) => bang(Math.abs(c - n)))),
  ))
  return min(close)
}

{
  const example = '16,1,2,0,4,2,7,1,2,14'
  assert.equal(part1(example), 37)
  assert.equal(part2(example), 168)
}

console.log(part1(file))
console.log(part2(file))
