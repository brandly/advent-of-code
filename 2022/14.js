const fs = require('fs')
const assert = require('assert')
const { sum, identity, min, max, zip, range } = require('lodash')
const file = fs.readFileSync('2022/14.txt', 'utf-8').trim()

const example = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`

const encode = ({ x, y }) => `${x},${y}`
const decode = (pair) => {
  const [x, y] = pair.split(',').map((n) => parseInt(n))
  return { x, y }
}

const parse = (input) =>
  input.split('\n').map((line) => line.split(' -> ').map(decode))

const expand = (a, b) => {
  if (a.x === b.x) {
    const line = [a.y, b.y]
    return range(min(line), max(line) + 1).map((y) => ({ x: a.x, y }))
  }
  if (a.y === b.y) {
    const line = [a.x, b.x]
    return range(min(line), max(line) + 1).map((x) => ({ x, y: a.y }))
  }
}

const toCave = (input) =>
  new Set(
    parse(input)
      .flatMap((path) =>
        path.flatMap((coords, i) =>
          i === 0 ? [] : expand(coords, path[i - 1])
        )
      )
      .map(encode)
  )

const getMaxY = (cave) =>
  max(
    Array.from(cave)
      .map(decode)
      .map(({ y }) => y)
  )

const getPossibilities = (sand) => [
  { x: sand.x, y: sand.y + 1 },
  { x: sand.x - 1, y: sand.y + 1 },
  { x: sand.x + 1, y: sand.y + 1 },
]

const part1 = (input) => {
  let cave = toCave(input)

  const rockCount = cave.size
  const abyssY = getMaxY(cave)

  let sand = decode('500,0')
  while (true) {
    const possibilities = getPossibilities(sand)
    const next = possibilities.find((p) => !cave.has(encode(p)))
    if (next === undefined) {
      cave.add(encode(sand))
      sand = decode('500,0')
      continue
    } else if (next.y >= abyssY) {
      break
    } else {
      sand = next
    }
  }

  return cave.size - rockCount
}

assert.equal(part1(example), 24)
console.log(part1(file))

const part2 = (input) => {
  let cave = toCave(input)
  const floorY = getMaxY(cave) + 2
  const rockCount = cave.size

  let sand = decode('500,0')
  while (!cave.has(encode(sand))) {
    const possibilities = getPossibilities(sand)
    const next = possibilities.find((p) => !cave.has(encode(p)) && p.y < floorY)
    if (next === undefined) {
      cave.add(encode(sand))
      sand = decode('500,0')
    } else {
      sand = next
    }
  }

  return cave.size - rockCount
}

assert.equal(part2(example), 93)
console.log(part2(file))
