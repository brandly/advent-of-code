const fs = require('fs')
const assert = require('assert')
const { sortBy, range, minBy, maxBy, identity } = require('lodash')
const { Program, programWithOutputs } = require('./02.js')

const input = fs.readFileSync(`${__dirname}/15.txt`, 'utf-8').trim()
const parse = input => input.split(',').map(v => parseInt(v))

const status = {
  wall: 0,
  moved: 1,
  goal: 2
}
const compass = {
  north: 1,
  south: 2,
  west: 3,
  east: 4
}

class Droid {
  constructor(instructions, coords = [0, 0]) {
    this.p = new Program(instructions, [])
    this.coords = coords
  }

  send(direction) {
    this.p.send(direction)
    while (!this.p.outputs.length) {
      this.p.step()
    }
    const response = this.p.consumeOutputs()[0]
    if (response !== status.wall) {
      this.coords = coordsWithDirection(this.coords, direction)
    }
    return response
  }

  clone() {
    const d = new Droid([])
    d.p = this.p.clone()
    d.coords = this.coords.slice(0)
    return d
  }
}

function coordsWithDirection([x, y], direction) {
  switch (direction) {
    case compass.north:
      return [x, y + 1]
    case compass.south:
      return [x, y - 1]
    case compass.east:
      return [x + 1, y]
    case compass.west:
      return [x - 1, y]
    default:
      throw new Error(`Unexpected direction: ${direction}`)
  }
}

assert.deepEqual(coordsWithDirection([0, 0], compass.north), [0, 1])
assert.deepEqual(coordsWithDirection([0, 0], compass.south), [0, -1])
assert.deepEqual(coordsWithDirection([0, 0], compass.east), [1, 0])
assert.deepEqual(coordsWithDirection([0, 0], compass.west), [-1, 0])

class Layout {
  constructor() {
    this.rows = []
  }

  set([x, y], value) {
    if (!(y in this.rows)) {
      this.rows[y] = []
    }
    this.rows[y][x] = value
  }

  get([x, y]) {
    const row = this.rows[y] || []
    return x in row ? row[x] : null
  }

  withCoords() {
    const minX = minBy(
      this.rows.map((row, i) => minBy(Object.keys(row).map(v => parseInt(v))))
    )
    const maxX = maxBy(
      this.rows.map((row, i) => maxBy(Object.keys(row).map(v => parseInt(v))))
    )

    const minY = minBy(Object.keys(this.rows).map(v => parseInt(v)))
    const maxY = maxBy(Object.keys(this.rows).map(v => parseInt(v)))

    return range(minY, maxY + 1)
      .map(y => range(minX, maxX + 1).map(x => [this.get([x, y]), [x, y]]))
      .reverse()
  }

  view() {
    const toDraw = this.withCoords().map(row =>
      row.map(([v, _]) => (v === null ? '?' : v))
    )

    return toDraw
      .map(row => row.map(v => (typeof v === 'number' ? '.' : v)).join(''))
      .join('\n')
  }

  map(fn) {
    const output = []
    this.toList().forEach(row => {
      row
    })
  }
}

{
  const l = new Layout()
  l.set([0, 0], 0)
  assert.equal(l.get([0, 0]), 0)
  l.set([-1, 0], -1)
  assert.equal(l.get([-1, 0]), -1)
  l.set([3, 4], 8)
  assert.equal(l.get([3, 4]), 8)
  l.set([-30, 1200], 4)
  assert.equal(l.get([-30, 1200]), 4)
  assert.equal(l.get([3, 4]), 8)
}

const GOAL = '☆'
const surrounding = (layout, { steps, droid }) => {
  const output = []
  let goal = null

  for (let i = 1; i <= 4; i++) {
    const destination = coordsWithDirection(droid.coords, i)
    if (layout.get(destination) === null) {
      const clone = droid.clone()
      const result = clone.send(i)

      if (result === status.wall) {
        layout.set(destination, '#')
      } else {
        if (result === status.goal) {
          goal = { coords: destination, steps: steps + 1 }
          layout.set(destination, GOAL)
        } else {
          layout.set(destination, steps + 1)
        }
        output.push({ steps: steps + 1, droid: clone })
      }
    }
  }
  return { positions: output, goal }
}

class Flood {
  constructor(droid, layout = new Layout()) {
    this.layout = layout
    this.layout.set(droid.coords, 0)
    this.positions = [
      {
        steps: 0,
        droid
      }
    ]
    this.goal = null
    this.maxSteps = 0
  }

  step(config) {
    this.positions = sortBy(this.positions, p => -p.steps)
    let closest = this.positions.pop()
    const result = surrounding(this.layout, closest, config)
    if (result.goal) {
      this.goal = result.goal
    }
    this.maxSteps = maxBy(
      result.positions.map(p => p.steps).concat(this.maxSteps)
    )
    this.positions = this.positions.concat(result.positions)
  }

  complete(config) {
    while (this.positions.length) {
      this.step(config)
    }

    return this
  }
}

const part1 = input => {
  const droid = new Droid(parse(input))
  const flood = new Flood(droid)
  return flood.complete().goal.steps
}

console.log(part1(input))

const getNeighbors = (layout, coords) =>
  range(1, 5).flatMap(direction => {
    const destination = coordsWithDirection(coords, direction)
    const value = layout.get(destination)
    if (typeof value === 'number') {
      layout.set(destination, 'O')
      return [destination]
    }
    return []
  })

const part2 = input => {
  const droid = new Droid(parse(input))
  const flood = new Flood(droid).complete()

  const { layout } = flood
  let positions = [{ steps: 0, coords: flood.goal.coords }]
  let maxSteps = 0

  // dijkstra round 2
  while (positions.length) {
    positions = sortBy(positions, p => -p.steps)
    const next = positions.pop()
    maxSteps = Math.max(maxSteps, next.steps)
    positions = positions.concat(
      getNeighbors(layout, next.coords).map(coords => ({
        coords,
        steps: next.steps + 1
      }))
    )
  }

  return maxSteps
}

console.log(part2(input))
