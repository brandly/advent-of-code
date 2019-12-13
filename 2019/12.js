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

const sumAbsoluteValues = c => Math.abs(c.x) + Math.abs(c.y) + Math.abs(c.z)

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

const input = fs.readFileSync(`${__dirname}/12.txt`, 'utf-8').trim()
{
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

const lcm = (a, b) => (a / gcd(a, b)) * b
// euclid
const gcd = (a, b) => {
  while (a != b) {
    if (a > b) {
      a = a - b
    } else {
      b = b - a
    }
  }
  return a
}

const findDuplicateState = input => {
  const system = new SolarSystem(parse(input))
  const seenx = {}
  const seeny = {}
  const seenz = {}
  let repeatx = null
  let repeaty = null
  let repeatz = null
  const getKey = (system, axis) =>
    system.moons
      .flatMap(moon => [moon.position[axis], moon.velocity[axis]])
      .join(',')
  for (let i = 0; !repeatx || !repeaty || !repeatz; i++) {
    system.step()

    if (!repeatx) {
      let key = getKey(system, 'x')
      if (key in seenx) {
        repeatx = i
      }
      seenx[key] = true
    }
    if (!repeaty) {
      let key = getKey(system, 'y')
      if (key in seeny) {
        repeaty = i
      }
      seeny[key] = true
    }
    if (!repeatz) {
      let key = getKey(system, 'z')
      if (key in seenz) {
        repeatz = i
      }
      seenz[key] = true
    }
  }

  return lcm(lcm(repeatx, repeaty), repeatz)
}

{
  const example =
    '<x=-1, y=0, z=2>\n<x=2, y=-10, z=-7>\n<x=4, y=-8, z=8>\n<x=3, y=5, z=-1>'
  assert.equal(findDuplicateState(example), 2772)
}

{
  const example =
    '<x=-8, y=-10, z=0>\n<x=5, y=5, z=10>\n<x=2, y=-7, z=3>\n<x=9, y=-8, z=-3>'
  assert.equal(findDuplicateState(example), 4686774924)
}

{
  console.log(findDuplicateState(input))
}
