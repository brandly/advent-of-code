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

const isAsteroid = (board, [x, y]) => {
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
  return every(inBetween, coord => !isAsteroid(board, coord))
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

const getOrderedTargets = (board, monitor) => {
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
      ([slope, _]) => slope,
      ([_, coords]) => lineOfSight(monitor, coords).length
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
      ([slope, _]) => slope,
      ([_, coords]) => lineOfSight(monitor, coords).length
    ]
  )

  const targets = above.concat(onRight, below, onLeft)

  const first = new Asteroid({
    slope: targets[0][0],
    coords: targets[0][1]
  }).loop()

  let current = first
  targets.slice(1).forEach(([slope, coords]) => {
    current = current.insert({ slope, coords })
  })

  return first
}

class Asteroid {
  constructor({ slope, coords }) {
    this.slope = slope
    this.coords = coords
    this._next = null
    this._prev = null
  }

  loop() {
    this._next = this
    this._prev = this
    return this
  }

  next() {
    return this._next
  }
  prev() {
    return this._prev
  }

  destroy() {
    let { _prev, _next } = this
    if (this === _prev && this === _next) return null
    _prev._next = _next
    _next._prev = _prev

    if (_next.slope === this.slope) {
      let n = _next
      // loop thru
      while (n !== _prev) {
        if (n.slope !== this.slope) break
        n = n.next()
      }
      // see if we found a new target
      if (n.slope !== this.slope) {
        _next = n
      }
    }

    return _next
  }

  insert(init) {
    let asteroid = new Asteroid(init)
    asteroid._next = this._next
    asteroid._prev = this

    this._next = asteroid
    asteroid._next._prev = asteroid

    return asteroid
  }
}

const part2 = (input, monitor) => {
  const board = parse(input)
  const hits = []
  let target = getOrderedTargets(board, monitor)
  while (target) {
    hits.push(target.coords)
    target = target.destroy()
  }
  return hits
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
  const knownTargets = {
    '1': [11, 12],
    '2': [12, 1],
    '3': [12, 2],
    '10': [12, 8],
    '20': [16, 0],
    '50': [16, 9],
    '100': [10, 16],
    '199': [9, 6],
    '200': [8, 2],
    '201': [10, 9],
    '299': [11, 1]
  }
  const actualTargets = part2(example, [11, 13])
  Object.entries(knownTargets).forEach(([oneIndex, coord]) => {
    assert.deepEqual(actualTargets[oneIndex - 1], coord)
  })
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
