const fs = require('fs')
const { sum } = require('lodash')
const assert = require('assert')
const file = fs.readFileSync('2022/01.txt', 'utf-8').trim()

const parse = (file) =>
  file
    .split('\n\n')
    .map((elfLines) => elfLines.split('\n').map((n) => parseInt(n)))

const part1 = (file) => Math.max.apply(Math, parse(file).map(sum))

const example = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

assert.equal(part1(example), 24_000)
console.log(part1(file))

const part2 = (file) =>
  sum(
    parse(file)
      .map(sum)
      .sort((a, b) => b - a)
      .slice(0, 3)
  )

assert.equal(part2(example), 45_000)
console.log(part2(file))
