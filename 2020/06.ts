const assert = require('assert')
const fs = require('fs')
const file = fs.readFileSync('2020/06.txt', 'utf-8').trim()
const { range } = require('lodash')

const parse = (str) => str.split('\n\n').map((group) => group.split('\n'))

const part1 = (str) => {
  const groups = parse(str)
  const counts = groups.map(
    (group) => new Set(group.flatMap((answers) => answers.split(''))).size
  )
  return counts.reduce((a, b) => a + b, 0)
}

console.log(part1(file))

const part2 = (str) => {
  const groups = parse(str)
  const counts = groups.map((group) => {
    const totals = {}
    group.forEach((answers) => {
      answers.split('').forEach((yes) => {
        if (!(yes in totals)) {
          totals[yes] = 0
        }
        totals[yes]++
      })
    })

    return Object.keys(totals).filter((key) => totals[key] === group.length)
      .length
  })
  return counts.reduce((a, b) => a + b, 0)
}

console.log(part2(file))

{
  const example = `abc

a
b
c

ab
ac

a
a
a
a

b`
  assert.equal(part1(example), 11)
  assert.equal(part2(example), 6)
}
