const fs = require('fs')
const assert = require('assert')
const { range, sortBy, countBy, sum } = require('lodash')

const parse = value =>
  value.split('\n').map(line => line.split(', ').map(v => parseInt(v)))

const input = fs
  .readFileSync(`${__dirname}/06.txt`)
  .toString()
  .trim()

const manhattan = ([x, y], [x2, y2]) => Math.abs(x - x2) + Math.abs(y - y2)
const max = values => Math.max.apply(Math, values)

const makeBoard = ([width, height]) =>
  range(width + 1).map(_ => range(height + 1))
const mapBoard = (board, map) =>
  board.map((column, x) => column.map((val, y) => map(val, [x, y])))
const filterBoard = (board, filter) =>
  board.flatMap((column, x) => column.filter((val, y) => filter(val, [x, y])))

const sameCoords = ([x, y], [x2, y2]) => x === x2 && y === y2

var currentName = 'a'
let nextChar = () => {
  let result = currentName
  currentName = String.fromCharCode(currentName.charCodeAt(0) + 1)
  return result
}

const withName = coords => ({
  coords,
  name: nextChar()
})

const part1 = input => {
  input = parse(input)

  const maxValues = [
    max(input.map(([x, _]) => x)),
    max(input.map(([_, y]) => y))
  ].map(v => v + 1)

  const namedInputs = input.map(withName)

  let board = mapBoard(makeBoard(maxValues), (_, boardCoords) => {
    let namedDistances = namedInputs.map(({ name, coords }) => ({
      name,
      dist: manhattan(boardCoords, coords)
    }))
    let sorted = sortBy(namedDistances, 'dist')

    return sorted[0].dist === sorted[1].dist ? '.' : sorted[0].name
  })

  const infinite = new Set(
    filterBoard(
      board,
      (name, [x, y]) =>
        x === 0 || x === maxValues[0] || y === 0 || y === maxValues[1]
    )
  )
  const claims = board.flatMap(v => v).filter(name => !infinite.has(name))
  return max(Object.values(countBy(claims)))
}

assert(
  part1(`1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`),
  17
)

// console.log(part1(input))

const part2 = (input, maxDistance) => {
  input = parse(input)

  const maxValues = [
    max(input.map(([x, _]) => x)),
    max(input.map(([_, y]) => y))
  ].map(v => v + 1)

  const namedInputs = input.map(withName)

  let board = mapBoard(makeBoard(maxValues), (_, boardCoords) => {
    let namedDistances = namedInputs.map(({ name, coords }) => ({
      name,
      dist: manhattan(boardCoords, coords)
    }))
    let sorted = sortBy(namedDistances, 'dist')

    let cellLabel = sorted[0].dist === sorted[1].dist ? '.' : sorted[0].name

    return { cellLabel, distance: sum(namedDistances.map(({ dist }) => dist)) }
  })

  const infinite = new Set(
    filterBoard(
      board,
      (name, [x, y]) =>
        x === 0 || x === maxValues[0] || y === 0 || y === maxValues[1]
    )
  )
  return board
    .flatMap(v => v)
    .filter(
      ({ cellLabel, distance }) =>
        !infinite.has(cellLabel) && distance < maxDistance
    ).length
}

assert(
  part2(
    `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`,
    32
  ),
  16
)

console.log(part2(input, 10000))
