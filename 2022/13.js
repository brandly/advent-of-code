const fs = require('fs')
const assert = require('assert')
const { sum, identity, minBy, zip } = require('lodash')
const file = fs.readFileSync('2022/13.txt', 'utf-8').trim()

const example = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`

const parse = (input) =>
  input
    .split('\n\n')
    .map((pair) => pair.split('\n').map((uh) => JSON.parse(uh)))

const compare = (a, b) => {
  if (a === undefined) return true
  if (b === undefined) return false
  if (typeof a !== typeof b) {
    if (Array.isArray(a)) {
      return compare(a, [b])
    } else {
      return compare([a], b)
    }
  }
  if (Array.isArray(a) && Array.isArray(b)) return compareLists(a, b)
  assert.equal(typeof a, 'number')
  assert.equal(typeof b, 'number')
  if (a === b) return undefined
  return a < b
}

const compareLists = (a, b) => {
  assert(Array.isArray(a))
  assert(Array.isArray(b))
  for (const [left, right] of zip(a, b)) {
    const result = compare(left, right)
    if (typeof result === 'boolean') return result
  }
  return undefined
}

const part1 = (input) =>
  parse(input)
    .map(([a, b], index) => [compareLists(a, b), index + 1])
    .filter(([result]) => result)
    .map(([_, index]) => index)
    .reduce((a, b) => a + b, 0)

assert.equal(part1(example), 13)
console.log(part1(file))

const dividers = [[[2]], [[6]]]
const encode = JSON.stringify
const dividerSet = new Set(dividers.map((d) => encode(d)))

const organize = (a, b) => {
  const result = compare(a, b)
  if (result === true) return -1
  if (result === false) return 1
  if (result === undefined) return 0
}

const part2 = (input) =>
  parse(input)
    .flatMap(identity)
    .concat(dividers)
    .sort(organize)
    .flatMap((packet, index) =>
      dividerSet.has(encode(packet)) ? [index + 1] : []
    )
    .reduce((a, b) => a * b, 1)

assert.equal(part2(example), 140)
console.log(part2(file))
