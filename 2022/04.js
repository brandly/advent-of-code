const fs = require('fs')
const { sum, range } = require('lodash')
const assert = require('assert')
const file = fs.readFileSync('2022/04.txt', 'utf-8').trim()

const example = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`

const parse = (input) =>
  input
    .split('\n')
    .map((line) =>
      line.split(',').map((range) => range.split('-').map((n) => parseInt(n)))
    )
    .map((pair) => pair.map(([start, end]) => new Set(range(start, end + 1))))

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function difference(setA, setB) {
  const _difference = new Set(setA)
  for (const elem of setB) {
    _difference.delete(elem)
  }
  return _difference
}
function intersection(setA, setB) {
  const _intersection = new Set()
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}

const part1 = (input) =>
  parse(input).filter(
    ([a, b]) => difference(a, b).size === 0 || difference(b, a).size === 0
  ).length

assert.equal(part1(example), 2)
console.log(part1(file))

const part2 = (input) =>
  parse(input).filter(([a, b]) => intersection(a, b).size > 0).length

assert.equal(part2(example), 4)
console.log(part2(file))
