const assert = require('assert')
const fs = require('fs')
const { sum, sortBy, takeWhile } = require('lodash')
const file = fs.readFileSync('2020/10.txt', 'utf-8')

const parse = (str) =>
  str
    .trim()
    .split('\n')
    .map((n) => parseInt(n))

const prepare = (nums) => {
  nums = sortBy(nums)
  return nums.concat(nums[nums.length - 1] + 3)
}
const steps = (nums) => {
  nums = prepare(nums)
  let one = 0,
    two = 0,
    three = 0
  for (let i = 0; i < nums.length; i++) {
    const diff = nums[i] - (nums[i - 1] || 0)
    if (diff === 1) one++
    if (diff === 2) two++
    if (diff === 3) three++
  }
  return { one, two, three }
}

const part1 = (str) => {
  const nums = parse(str)
  const { one, three } = steps(nums)
  return one * three
}
console.log(part1(file))

const part2 = (str) => {
  let nums = parse(str)
  nums = prepare(nums)
  const cache = {}

  const paths = (nums, index = 0) => {
    if (index in cache) return cache[index]
    if (index === nums.length - 1) return 1

    const start = nums[index - 1] || 0
    const answer = sum(
      takeWhile(nums.slice(index), (n) => n - start <= 3).map((n, i) =>
        paths(nums, index + (i + 1))
      )
    )
    cache[index] = answer
    return answer
  }

  return paths(nums)
}

console.log(part2(file))

{
  const example = `16
10
15
5
1
11
7
19
6
12
4
`
  assert.equal(part1(example), 35)
  assert.equal(part2(example), 8)
}
