const fs = require('fs')
const assert = require('assert')
const file = fs.readFileSync('2021/01.txt', 'utf-8')

const part1 = (input) =>
  input
    .split('\n')
    .map((item) => parseInt(item))
    .filter((item, index, list) =>
      index === 0 ? false : item > list[index - 1]
    ).length

{
  const example = '199\n200\n208\n210\n200\n207\n240\n269\n260\n263'
  assert.equal(part1(example), 7)
}

console.log(part1(file))

const part2 = (input) =>
  input
    .split('\n')
    .map((item) => parseInt(item))
    .filter((item, i, list) => {
      if (i < 3) return false
      return (
        list[i - 2] + list[i - 1] + list[i] >
        list[i - 3] + list[i - 2] + list[i - 1]
      )
    }).length

{
  const example = '199\n200\n208\n210\n200\n207\n240\n269\n260\n263'
  assert.equal(part2(example), 5)
}

console.log(part2(file))
