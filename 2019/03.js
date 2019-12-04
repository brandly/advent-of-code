const fs = require('fs')
const assert = require('assert')
const { sortBy } = require('lodash')

const fromLine = line =>
  line.split(',').map(instruction => {
    const dir = instruction[0]
    const len = parseInt(instruction.slice(1))
    return { dir, len }
  })

const [first, second] = fs
  .readFileSync('./2019/03.txt')
  .toString()
  .trim()
  .split('\n')
  .map(fromLine)

const toPath = steps => {
  let coords = [0, 0]
  let path = []

  steps.forEach(({ dir, len }) => {
    for (let i = 0; i < len; i++) {
      coords = coordsWithStep(coords, dir)
      path.push(coords)
    }
  })

  return path
}

const coordsWithStep = (coords, dir) => {
  let [x, y] = coords
  switch (dir) {
    case 'D':
      return [x, y - 1]
    case 'U':
      return [x, y + 1]
    case 'L':
      return [x - 1, y]
    case 'R':
      return [x + 1, y]
  }
}

const cross = (a, b) => {
  const encode = ([x, y]) => `${x},${y}`
  const set = new Set(a.map(encode))
  return b.filter(item => set.has(encode(item)))
}

const manhattan = ([x, y], [x2, y2]) => Math.abs(x - x2) + Math.abs(y - y2)

const part1 = (first, second) => {
  const distances = cross(toPath(first), toPath(second)).map(coords =>
    manhattan([0, 0], coords)
  )
  return sortBy(distances)[0]
}

assert(part1(fromLine('R8,U5,L5,D3'), fromLine('U7,R6,D4,L4')) === 6)
assert(
  part1(
    fromLine('R75,D30,R83,U83,L12,D49,R71,U7,L72'),
    fromLine('U62,R66,U55,R34,D71,R55,D58,R83')
  ) === 159
)
assert(
  part1(
    fromLine('R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'),
    fromLine('U98,R91,D20,R16,D67,R40,U7,R15,U6,R7')
  ) === 135
)
console.log(part1(first, second))

const toPathCounts = steps => {
  let coords = [0, 0]
  let path = []
  let count = 0
  steps.forEach(({ dir, len }) => {
    for (let i = 0; i < len; i++) {
      coords = coordsWithStep(coords, dir)
      count += 1
      path.push({ coords, count })
    }
  })

  return path
}

const cross2 = (first, second) => {
  const encode = ({ coords }) => `${coords[0]},${coords[1]}`
  const set = second.reduce((out, val) => {
    out[encode(val)] = val
    return out
  })
  return first.flatMap(val =>
    encode(val) in set ? [[val, set[encode(val)]]] : []
  )
}

const part2 = (first, second) => {
  let forFirst = toPathCounts(first)
  let forSecond = toPathCounts(second)
  let intersections = cross2(forFirst, forSecond)
  let sortedCounts = sortBy(intersections.map(([a, b]) => a.count + b.count))
  return sortedCounts[0]
}

assert(part2(fromLine('R8,U5,L5,D3'), fromLine('U7,R6,D4,L4')) === 30)
assert(
  part2(
    fromLine('R75,D30,R83,U83,L12,D49,R71,U7,L72'),
    fromLine('U62,R66,U55,R34,D71,R55,D58,R83')
  ) === 610
)
assert(
  part2(
    fromLine('R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'),
    fromLine('U98,R91,D20,R16,D67,R40,U7,R15,U6,R7')
  ) === 410
)

console.log(part2(first, second))
