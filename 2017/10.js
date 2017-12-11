const fs = require('fs')
const assert = require('assert')
const { range } = require('lodash')

const rawInput =
  fs.readFileSync('./10.txt', 'utf-8')
    .trim()

const exampleIn = [3, 4, 1, 5]

function part1 (sequence, listSize) {
  let currentPosition = 0
  let skipSize = 0

  const { updated } = step({ currentPosition, skipSize, sequence, list: range(listSize) })

  return updated[0] * updated[1]
}

function step ({ currentPosition, skipSize, sequence, list }) {
  const updated = sequence.reduce((list, length) => {
    const sublist = getSublist({ currentPosition, length, list })
    sublist.reverse()
    const newList = applySublist({ list, sublist, currentPosition })

    currentPosition = (currentPosition + length + skipSize) % list.length
    skipSize += 1

    return newList
  }, list)

  return {
    updated,
    currentPosition,
    skipSize
  }
}

assert.deepEqual(
  getSublist({ currentPosition: 0, length: 3, list: range(5) }),
  [0, 1, 2]
)
assert.deepEqual(
  getSublist({ currentPosition: 3, length: 4, list: [2, 1, 0, 3, 4] }),
  [3, 4, 2, 1]
)
function getSublist ({ currentPosition, length, list }) {
  const sublist = []
  for (
    let i = currentPosition, count = 0;
    count < length;
    currentPosition = (currentPosition + 1) % list.length, count++
  ) {
    sublist.push(list[currentPosition])
  }
  return sublist
}

function applySublist ({ list, sublist, currentPosition }) {
  const clone = list.slice()
  while (sublist.length) {
    const val = sublist.shift()
    clone[currentPosition] = val
    currentPosition = (currentPosition + 1) % list.length
  }
  return clone
}

assert.equal(part1(exampleIn, 5), 12)
console.log(part1(rawInput.split(',').map(n => parseInt(n, 10)), 256))

function sparseHash (sequence, listSize) {
  let currentPosition = 0
  let skipSize = 0
  let list = range(listSize)

  for (let i = 0; i < 64; i++) {
    let result = step({ currentPosition, skipSize, sequence, list })

    currentPosition = result.currentPosition
    skipSize = result.skipSize
    list = result.updated
  }

  return list
}

function knotHash (input) {
  const sequence = input.split('')
    .map(char => char.charCodeAt(0))
    .concat([17, 31, 73, 47, 23])
  let sparse = sparseHash(sequence, 256)

  let dense = []
  let block = []
  while (sparse.length) {
    // console.log('sparse', sparse)
    block = sparse.splice(0, 16)
    dense.push(xor(block))
  }

  return toHex(dense)
}

function toHex (list) {
  return list.map(n => {
    const hex = n.toString(16)
    return hex.length === 1 ? ('0' + hex) : hex
  }).join('')
}

assert.equal(toHex([64, 7, 255]), '4007ff')

function xor (list) {
  return list.reduce((a, b) => {
    return a ^ b
  }, 0)
}

assert.equal(xor([65, 27, 9, 1, 4, 3, 40, 50, 91, 7, 6, 0, 2, 5, 68, 22]), 64)
assert.equal(knotHash(''), 'a2582a3a0e66e6e86e3812dcb672a272')
assert.equal(knotHash('1,2,3').length, 32)
assert.equal(knotHash('1,2,3'), '3efbe78a8d82f29979031a4aa0b16a9d')

console.log(knotHash(rawInput))
