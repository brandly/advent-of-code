const fs = require('fs')
const assert = require('assert')
const { range, sum, min, every } = require('lodash')
const file = fs.readFileSync('2021/09.txt', 'utf-8').trim()

const parse = (file) =>
  file.split('\n').map((line) => line.split('').map((n) => parseInt(n)))

const part1 = (input) => {
  const map = parse(input)
  const getNeighbors = (x, y) =>
    [
      map[y + 1] && map[y + 1][x],
      map[y - 1] && map[y - 1][x],
      map[y][x + 1],
      map[y][x - 1],
    ].filter((val) => val !== undefined)

  const lowPointHeights = []
  map.forEach((row, y) => {
    row.forEach((me, x) => {
      const neighbors = getNeighbors(x, y)
      const isLowPoint = every(neighbors, (pal) => pal > me)
      if (isLowPoint) {
        lowPointHeights.push(me)
      }
    })
  })
  return sum(lowPointHeights.map((height) => height + 1))
}

const getNeighborCoords = (map, x, y) =>
  [
    { x, y: y + 1 },
    { x, y: y - 1 },
    { x: x + 1, y },
    { x: x - 1, y },
  ].filter(
    (coords) =>
      map[coords.y] !== undefined && map[coords.y][coords.x] !== undefined
  )

const rollDown = (map, x, y) => {
  const value = map[y][x]
  if (value === 9) return null
  const neighbors = getNeighborCoords(map, x, y)
  const isLowPoint = every(
    neighbors,
    (coords) => map[coords.y][coords.x] > value
  )
  if (isLowPoint) {
    return { x, y }
  } else {
    const below = neighbors.find((coords) => map[coords.y][coords.x] < value)
    return rollDown(map, below.x, below.y)
  }
}

const encode = (x, y) => `${x},${y}`

const part2 = (input) => {
  const map = parse(input)

  const basins = {}
  const add = (x, y) => {
    const key = encode(x, y)
    if (key in basins) {
      basins[key]++
    } else {
      basins[key] = 1
    }
  }

  map.forEach((row, y) => {
    row.forEach((me, x) => {
      const bottom = rollDown(map, x, y)
      if (bottom !== null) {
        add(bottom.x, bottom.y)
      }
    })
  })

  return Object.values(basins)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1)
}

{
  const example = `2199943210\n3987894921\n9856789892\n8767896789\n9899965678`
  assert.equal(part1(example), 15)
  assert.equal(part2(example), 1134)
}

console.log(part1(file))
console.log(part2(file))
