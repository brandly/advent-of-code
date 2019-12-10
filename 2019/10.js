const fs = require('fs')
const assert = require('assert')
const { range, flatten, every, maxBy } = require('lodash')

const parse = input =>
  input
    .split('\n')
    .map(line => line.split('').map(char => (char === '#' ? true : false)))

const map = (board, fn) =>
  board.map((row, y) => row.map((val, x) => fn(val, [x, y])))

const toList = board =>
  flatten(board.map((row, y) => row.map((val, x) => [val, [x, y]])))

const getAsteroids = board =>
  toList(board).flatMap(([val, coords]) => (val ? [coords] : []))

const get = (board, [x, y]) => {
  const row = board[y]
  return row ? row[x] : false
}

const view = (board, toCount) =>
  map(board, (val, coords) => toCount(val, coords, board))
    .map(line => line.join(''))
    .join('\n')

const getSlope = ([xa, ya], [xb, yb]) => (ya - yb) / (xa - xb)

const lineOfSight = ([xa, ya], [xb, yb]) => {
  const slope = getSlope([xa, ya], [xb, yb])
  const fn = x => slope * (x - xa) + ya
  const vals = inclusiveRange(xa, xb)
  return vals.map(v => [v, fn(v)])
}

const inclusiveRange = (a, b) => (a < b ? range(a, b + 1) : range(b, a + 1))

const canSee = (board, a, b) => {
  // cannot see self
  if (a[0] === b[0] && a[1] === b[1]) return false
  const line =
    a[0] === b[0] // vertical line
      ? inclusiveRange(a[1], b[1]).map(y => [a[0], y])
      : lineOfSight(a, b)
  // trim the edges because we want to see what's in between them
  const inBetween = line.slice(1, line.length - 1)
  return every(inBetween, coord => !get(board, coord))
}

const viewCounts = (input, extra = 0) => {
  const counts = getCounts(input)
  const columnWidth =
    maxBy(toList(counts).map(([val, coords]) => val)).toString().length + extra

  const pad = val => {
    while (val.toString().length < columnWidth) {
      val = ' ' + val
    }
    return val
  }
  const terminal = pad('.')
  return view(counts, val => (val ? pad(val) : terminal))
}
const getCounts = input => {
  const board = parse(input)
  const asteroids = getAsteroids(board)
  return map(board, (val, from) =>
    val ? asteroids.filter(to => canSee(board, from, to)).length : 0
  )
}

const part1 = input => {
  const counts = getCounts(input)
  return maxBy(toList(counts), ([count, _]) => count)
}

// lots of examples, so you gotta specify which to run
let chosenOne = process.argv[2]
if (chosenOne === '0') {
  const example = `.#..#
.....
#####
....#
...##`

  const board = parse(example)
  assert.equal(example, view(board, val => (val ? '#' : '.')))
  assert.deepEqual(lineOfSight([1, 8], [3, 6]), [[1, 8], [2, 7], [3, 6]])
  assert.deepEqual(lineOfSight([3, 4], [1, 0]), [[1, 0], [2, 2], [3, 4]])
  assert.deepEqual(getAsteroids(board), [
    [1, 0],
    [4, 0],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [4, 3],
    [3, 4],
    [4, 4]
  ])

  assert.equal(canSee(board, [1, 0], [3, 4]), false)
  assert.equal(canSee(board, [0, 2], [4, 2]), false)
  assert.equal(canSee(board, [4, 0], [4, 4]), false)
  assert.equal(canSee(board, [4, 4], [4, 0]), false)
  assert.equal(canSee(board, [4, 4], [4, 2]), false)
  const viewedCounts = `.7..7
.....
67775
....7
...87`
  assert.equal(viewCounts(example), viewedCounts)
  assert.deepEqual(part1(example), [8, [3, 4]])
} else if (chosenOne === '1') {
  const example = `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`
  console.log(viewCounts(example, 1))
  const board = parse(example)
  assert.equal(canSee(board, [1, 8], [8, 8]), false)
  assert.equal(canSee(board, [1, 8], [3, 6]), false)
  assert.deepEqual(part1(example), [33, [5, 8]])
} else if (chosenOne === '2') {
  const example = `#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`
  console.log(viewCounts(example, 1))
  assert.deepEqual(part1(example), [35, [1, 2]])
} else if (chosenOne === '3') {
  const example = `.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`
  console.log(viewCounts(example, 1))
  assert.deepEqual(part1(example), [41, [6, 3]])
} else if (chosenOne === '4') {
  const example = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`
  console.log(viewCounts(example, 1))
  assert.deepEqual(part1(example), [210, [11, 13]])
}

const input = fs
  .readFileSync(`${__dirname}/10.txt`)
  .toString()
  .trim()

console.log(part1(input))
