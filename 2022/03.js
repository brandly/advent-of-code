const fs = require('fs')
const { sum } = require('lodash')
const assert = require('assert')
const file = fs.readFileSync('2022/03.txt', 'utf-8').trim()

const example = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`

const parse = (input) => input.split('\n')

const priority = (item) => {
  const offset = item === item.toLowerCase() ? 96 : 38
  return item.charCodeAt(0) - offset
}

const part1 = (input) =>
  sum(
    parse(input)
      .map((line) => {
        const mid = line.length / 2
        return [line.slice(0, mid), line.slice(mid)]
      })
      .map((sack) => sack[0].split('').find((item) => sack[1].includes(item)))
      .map(priority)
  )

assert.equal(part1(example), 157)
console.log(part1(file))

const groupBy3 = (accum, elf) => {
  const last = accum[accum.length - 1]
  if (last && last.length < 3) {
    last.push(elf)
  } else {
    accum.push([elf])
  }
  return accum
}

const part2 = (input) =>
  sum(
    parse(input)
      .reduce(groupBy3, [])
      .map(([a, b, c]) =>
        a.split('').find((item) => b.includes(item) && c.includes(item))
      )
      .map(priority)
  )

assert.equal(part2(example), 70)
console.log(part2(file))
