const assert = require('assert')
const fs = require('fs')
const { sum } = require('lodash')

const parse = input =>
  input.split('\n').map(line =>
    // lol
    line
      .slice(1, line.length - 1)
      .split(', ')
      .map(val => val.split('='))
      .reduce((out, [key, val]) => {
        out[key] = parseInt(val)
        return out
      }, {})
  )

const viewXYZ = ({ x, y, z }) => `<x=${x}, y=${y}, z=${z}>`
const viewSimple = positions => positions.map(pos => viewXYZ(pos)).join('\n')

const sumAbsoluteValues = coords =>
  sum(Object.keys(coords).map(axis => Math.abs(coords[axis])))

class Moon {
  constructor(position) {
    this.position = position
    this.velocity = { x: 0, y: 0, z: 0 }
  }

  gravity(neighbor) {
    Object.keys(this.velocity).forEach(axis => {
      if (neighbor.position[axis] > this.position[axis]) {
        this.velocity[axis]++
      } else if (neighbor.position[axis] < this.position[axis]) {
        this.velocity[axis]--
      }
    })
  }

  advancePosition() {
    Object.keys(this.velocity).forEach(axis => {
      this.position[axis] += this.velocity[axis]
    })
  }

  energy() {
    const potential = sumAbsoluteValues(this.position)
    const kinetic = sumAbsoluteValues(this.velocity)
    return potential * kinetic
  }
}

class SolarSystem {
  constructor(moonPositions) {
    this.moons = moonPositions.map(position => new Moon(position))
  }

  step() {
    for (let i = 0; i < this.moons.length; i++) {
      for (let j = 0; j < this.moons.length; j++) {
        this.moons[i].gravity(this.moons[j])
      }
    }
    this.moons.forEach(moon => {
      moon.advancePosition()
    })
  }

  totalEnergy() {
    return sum(this.moons.map(m => m.energy()))
  }
}

{
  const example =
    '<x=-1, y=0, z=2>\n<x=2, y=-10, z=-7>\n<x=4, y=-8, z=8>\n<x=3, y=5, z=-1>'
  assert.equal(viewSimple(parse(example)), example)

  const system = new SolarSystem(parse(example))
  for (let i = 0; i < 10; i++) {
    system.step()
  }

  assert.deepEqual(system.moons.map(({ position }) => position), [
    { x: 2, y: 1, z: -3 },
    { x: 1, y: -8, z: 0 },
    { x: 3, y: -6, z: 1 },
    { x: 2, y: 0, z: 4 }
  ])
  assert.deepEqual(system.moons.map(({ velocity }) => velocity), [
    { x: -3, y: -2, z: 1 },
    { x: -1, y: 1, z: 3 },
    { x: 3, y: 2, z: -3 },
    { x: 1, y: -1, z: -1 }
  ])

  assert.equal(system.totalEnergy(), 179)
}

{
  const example =
    '<x=-8, y=-10, z=0>\n<x=5, y=5, z=10>\n<x=2, y=-7, z=3>\n<x=9, y=-8, z=-3>'

  const system = new SolarSystem(parse(example))
  for (let i = 0; i < 100; i++) {
    system.step()
  }
  assert.equal(system.totalEnergy(), 1940)
}

{
  const input = fs.readFileSync(`${__dirname}/12.txt`, 'utf-8').trim()
  const system = new SolarSystem(parse(input))

  for (let i = 0; i < 1000; i++) {
    system.step()
  }
  console.log(system.totalEnergy())
}

const view = sys =>
  [
    'pos=',
    viewSimple(sys.moons.map(({ position }) => position)),
    'vel=',
    viewSimple(sys.moons.map(({ velocity }) => velocity)),
    ''
  ].join('\n')

const findDuplicateState = input => {
  const system = new SolarSystem(parse(input))
  const seen = {}
  for (let i = 0; ; i++) {
    system.step()
    let key = view(system)
    if (seen[key]) {
      return i
    }
    seen[key] = true
  }
}

{
  const example =
    '<x=-1, y=0, z=2>\n<x=2, y=-10, z=-7>\n<x=4, y=-8, z=8>\n<x=3, y=5, z=-1>'
  assert.equal(findDuplicateState(example), 2772)
}

// TODO: find a more efficient way to simulate the universe :(
{
  const example =
    '<x=-8, y=-10, z=0>\n<x=5, y=5, z=10>\n<x=2, y=-7, z=3>\n<x=9, y=-8, z=-3>'
  assert.equal(findDuplicateState(example), 4686774924)
}
