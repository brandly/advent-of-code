const fs = require('fs')
const assert = require('assert')
const { range, sum, min, every } = require('lodash')
const { SSL_OP_CRYPTOPRO_TLSEXT_BUG } = require('constants')
const file = fs.readFileSync('2021/11.txt', 'utf-8').trim()

const parse = (input) =>
  input.split('\n').map((line) => line.split('').map((n) => parseInt(n)))

const step = (octopuses) => {
  //   console.log(octopuses.map((line) => line.join('')).join('\n'))
  const getNeighbors = (x, y) =>
    [
      { x, y: y + 1 },
      { x, y: y - 1 },
      { x: x + 1, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
      { x: x - 1, y: y - 1 },
      { x: x + 1, y },
      { x: x - 1, y },
    ].filter(
      (coords) =>
        octopuses[coords.y] !== undefined &&
        // intentionally ignoring 0's here. if it's flashed, it can't flash again until next step
        octopuses[coords.y][coords.x]
    )

  octopuses = octopuses.map((row) => row.map((octo) => octo + 1))

  let flashes = 0
  let looping = true
  while (looping) {
    looping = false
    octopuses.forEach((row, y) => {
      row.forEach((octo, x) => {
        if (octo > 9) {
          flashes += 1
          looping = true
          const neighbors = getNeighbors(x, y)
          neighbors.forEach((c) => {
            octopuses[c.y][c.x] += 1
          })
          octopuses[y][x] = 0
        }
      })
    })
  }
  return [octopuses, flashes]
}

const part1 = (input) => {
  let octopuses = parse(input)
  let flashes = 0
  for (let i = 0; i < 100; i++) {
    const [octopuses_, flashes_] = step(octopuses)
    flashes += flashes_
    octopuses = octopuses_
  }
  return flashes
}

const part2 = (input) => {
  let octopuses = parse(input)
  const count = sum(octopuses.flatMap((row) => row.map((_) => 1)))
  for (let i = 0; ; i++) {
    const [octopuses_, flashes_] = step(octopuses)
    if (flashes_ === count) {
      return i + 1
    }
    octopuses = octopuses_
  }
}

{
  const example =
    '5483143223\n2745854711\n5264556173\n6141336146\n6357385478\n4167524645\n2176841721\n6882881134\n4846848554\n5283751526'
  assert.equal(part1(example), 1656)
  assert.equal(part2(example), 195)
}

console.log(part1(file))
console.log(part2(file))
