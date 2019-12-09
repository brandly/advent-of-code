const fs = require('fs')
const assert = require('assert')
const input = fs.readFileSync(`${__dirname}/11.txt`, 'utf-8').trim()

class Cube {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  add(cube) {
    return new Cube(this.x + cube.x, this.y + cube.y, this.z + cube.z)
  }

  step(direction) {
    return this.add(cubeDirections[direction])
  }
}

const cubeDirections = {
  n: new Cube(0, 1, -1),
  ne: new Cube(1, 0, -1),
  se: new Cube(1, -1, 0),
  s: new Cube(0, -1, 1),
  sw: new Cube(-1, 0, 1),
  nw: new Cube(-1, 1, 0)
}

const applySteps = steps =>
  steps
    .split(',')
    .reduce((cube, direction) => cube.step(direction), new Cube(0, 0, 0))

const distance = (a, b) =>
  Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z))

const part1 = steps => {
  const dest = applySteps(steps)
  return distance(new Cube(0, 0, 0), dest)
}

// console.log(applySteps('ne,ne,ne'))
assert.equal(part1('ne,ne,ne'), 3)
assert.equal(part1('ne,ne,sw,sw'), 0)
assert.equal(part1('ne,ne,s,s'), 2)
assert.equal(part1('se,sw,se,sw,sw'), 3)

console.log(part1(input))

const part2 = steps => {
  const home = new Cube(0, 0, 0)
  let max = 0
  steps.split(',').reduce((cube, direction) => {
    const after = cube.step(direction)
    const dist = distance(home, after)
    if (dist > max) max = dist
    return after
  }, home)
  return max
}

console.log(part2(input))
