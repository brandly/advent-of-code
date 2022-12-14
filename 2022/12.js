const fs = require('fs')
const assert = require('assert')
const { sum, identity, minBy } = require('lodash')
const file = fs.readFileSync('2022/12.txt', 'utf-8').trim()

const example = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`

const parse = (input) =>
  input
    .split('\n')
    .map((line) => line.split(''))
    .flatMap((row, y) =>
      row.map((height, x) => ({
        x,
        y,
        dist: Infinity,
        prev: undefined,
        height,
      }))
    )

const draw = (land, sequence) => {
  const copy = land.map((row) =>
    row.map((c) => {
      const index = sequence.indexOf(c)
      if (index !== -1) {
        const next = sequence[index + 1]
        if (!next) return 'E'
        if (next.x > c.x) return '>'
        if (next.x < c.x) return '<'
        if (next.y > c.y) return 'v'
        if (next.y < c.y) return '^'
      }
      if (c.height === 'S') return 'S'
      return '.'
    })
  )
  console.log(sequence.map(({ x, y }) => ({ x, y })))
  console.log(copy.map((line) => line.join('')).join('\n'))
}

const dijsktra = (land, start, isTarget, canClimb) => {
  let Q = [...land]
  start.dist = 0

  while (Q.length) {
    let u = minBy(Q, (q) => q.dist)
    // found target
    if (isTarget(u)) {
      if (!u.prev) throw Error(`Unreachable`)
      const sequence = []

      while (u && u !== start) {
        sequence.push(u)
        u = u.prev
      }
      sequence.reverse()
      // draw(land, sequence)
      return sequence
    }
    Q = Q.filter((q) => q !== u)

    const n = neighbors(u, Q, canClimb)
    n.forEach((v) => {
      const alt = u.dist + 1
      if (alt < v.dist) {
        v.dist = alt
        v.prev = u
      }
    })
  }
  return null
}

const encode = ([x, y]) => `${x}$$${y}`
const neighbors = (u, Q, canClimb) => {
  const coords = new Set(
    [
      [u.x, u.y + 1],
      [u.x, u.y - 1],
      [u.x + 1, u.y],
      [u.x - 1, u.y],
    ].map(encode)
  )
  return Q.filter((q) => coords.has(encode([q.x, q.y])) && canClimb(u, q))
}
const convert = (h) => (h === 'S' ? 'a' : h === 'E' ? 'z' : h)
const charPlusOne = (c) => String.fromCharCode(c.charCodeAt(0) + 1)

const part1 = (input) => {
  const land = parse(input)
  const start = land.find(({ height }) => height === 'S')
  return dijsktra(
    land,
    start,
    (u) => u.height === 'E',
    (u, q) => convert(q.height) <= charPlusOne(convert(u.height))
  ).length
}

assert.equal(part1(example), 31)
console.log(part1(file))

const part2 = (input) => {
  const land = parse(input)
  const start = land.find((c) => c.height === 'E')
  return dijsktra(
    land,
    start,
    (u) => u.height === 'a',
    (u, q) => charPlusOne(convert(q.height)) >= convert(u.height)
  ).length
}

assert.equal(part2(example), 29)
console.log(part2(file))
