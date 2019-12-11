const fs = require('fs')
const assert = require('assert')
const { range, flatten, every, maxBy, sortBy } = require('lodash')

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

const destroyAsteroid = (board, [x, y]) => {
  board[y][x] = false
}

const part2 = (input, monitor) => {
  const board = parse(input)

  const asteroids = getAsteroids(board).filter(
    ([x, y]) => !(x === monitor[0] && y === monitor[1])
  )

  const slopeToAsteroid = asteroids.map(coords => [
    getSlope(monitor, coords),
    coords
  ])

  const above = sortBy(
    slopeToAsteroid.filter(([slope, _]) => slope === Infinity),
    ([_, coords]) => coords[1]
  ).reverse()

  const onRight = sortBy(
    slopeToAsteroid.filter(
      ([slope, coords]) => isFinite(slope) && coords[0] > monitor[0]
    ),
    [
      ([slope, coords]) => slope,
      ([slope, coords]) => lineOfSight(monitor, coords).length
    ]
  )

  const below = sortBy(
    slopeToAsteroid.filter(([slope, _]) => slope === -Infinity),
    ([_, coords]) => coords[1]
  )

  const onLeft = sortBy(
    slopeToAsteroid.filter(
      ([slope, coords]) => isFinite(slope) && coords[0] < monitor[0]
    ),
    [
      ([slope, coords]) => slope,
      ([slope, coords]) => lineOfSight(monitor, coords).length
    ]
  )

  let targets = above
    .concat(onRight, below, onLeft)
    .map(([slope, coords]) => ({ slope, coords }))

  const encode = ([x, y]) => `${x},${y}`

  const record = {}
  const hasSeen = coords => record[encode(coords)] || false
  const recordSighting = coords => {
    record[encode(coords)] = true
  }

  let lastSlope = null
  const hits = []
  for (
    let i = 0;
    targets.filter(o => !hasSeen(o.coords)).length;
    i = (i + 1) % targets.length
  ) {
    let target = targets[i]
    if (
      target.slope !== lastSlope &&
      !hasSeen(target.coords) &&
      canSee(board, monitor, target.coords)
    ) {
      hits.push(target.coords)
      recordSighting(target.coords)
      destroyAsteroid(board, target.coords)
      lastSlope = target.slope
    }
  }

  return hits //[hits.length - 1]
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
  //   . 191   .   . 188 193   . 191 195 185   .   .   . 189 194 190 194 196 191 187
  // 198 194   . 197 192 200 196 197 200 199 190 201 199 193 200   .   . 198 198   .
  //   . 190   . 189 192 196 197 196 195   . 192 199 193 194 195 192 197 195   . 191
  //   . 197 198 196   . 194 198 196 199 200 192 198   . 195 200 198 192   . 194   .
  // 197 187 195 188 194   . 197 190   . 191   . 197 194   . 195 188 195   . 195 188
  //   .   . 203 199 191 205 201   .   . 199   . 203 199 201 203 199 198 200 197 192
  // 194 190 199 192 193 193 196 194 199 197 193 199 197 193 200 190 195 195 195 191
  // 203   . 203 197 197 205   .   .   .   . 199 203 202   . 201   . 196   . 196 193
  // 197 192   . 192 194 195 200 196 202 196 197 196 198 194 199 193 195 196 191 195
  // 199 193 205 198 188   . 197 196   . 198 192 197   .   . 200 195 197 192   .   .
  //   .   . 201 186 190 202 196 196   .   . 195 199   . 188 194 194 195 198 194 188
  // 199 200 198 201   . 202 198   . 200 199 199 203   .   .   . 193 195   .   . 192
  //   . 191 198 191 191 193   .   . 198   . 193 195 193 193 196 194   . 198 192 191
  // 201 196   .   .   . 204   . 201 208 198 202(210)203 203 203 195 202   .   .   .
  // 197   . 200 196 196 197 198 194 203 192 197 195   . 196 194 194 196 196 196 194
  //   . 197 202 198 193   . 195   . 200 198 196   . 197 195 195   . 196   . 194 188
  //   .   .   .   . 194 195   . 191 197   . 192 194 195   .   . 188 189 197 194 194
  //   . 198   . 202   . 208 197 200 202 200 203 205 198 201 201 199   . 200 193 197
  // 196   . 201   . 190   . 195 192 199 192 189   . 197 187 196 188   . 196 193 190
  // 202 200 203   . 197 201   . 200 200 193 197   . 199 201   . 197   .   . 200 190
  part2(example, [11, 13]).forEach((coord, i) => console.log(i + 1, coord))
} else if (chosenOne === '5') {
  const example = `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....X...###..
..#.#.....#....##`
  console.log(viewCounts(example, 1))
  // order
  const expected = [
    [8, 1],
    [9, 0],
    [9, 1],
    [10, 0],
    [9, 2],
    [11, 1],
    [12, 1],
    [11, 2],
    [15, 1],
    // --
    [12, 2],
    [13, 2],
    [14, 2],
    [15, 2],
    [12, 3],
    [16, 4],
    [15, 4],
    [10, 4],
    [4, 4],
    // --
    [2, 4],
    [2, 3],
    [0, 2],
    [1, 2],
    [0, 1],
    [1, 1],
    [5, 2],
    [1, 0],
    [5, 1],
    // --
    [6, 1],
    [6, 0],
    [7, 0],
    [8, 0],
    [10, 1],
    [14, 0],
    [16, 1],
    [13, 3],
    [14, 3]
  ]

  part2(example, [8, 3]).forEach((coords, i) => {
    assert.deepEqual(coords, expected[i])
  })
}

const input = fs
  .readFileSync(`${__dirname}/10.txt`)
  .toString()
  .trim()

console.log(part1(input)[0])

const p2 = part2(input, [13, 17])[199]
console.log(p2[0] * 100 + p2[1])
