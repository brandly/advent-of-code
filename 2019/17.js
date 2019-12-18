const assert = require('assert')
const fs = require('fs')
const { flatten } = require('lodash')
const { Program } = require('./02')

const parse = input => input.split(',').map(v => parseInt(v))
const input = fs.readFileSync(`${__dirname}/17.txt`, 'utf-8').trim()

const get = (view, { x, y }) => {
  const row = view[y] || []
  return row[x] || ''
}

const withCoords = view =>
  view.map((row, y) => row.map((value, x) => [value, { x, y }]))

const whereValue = (view, predicate) =>
  flatten(withCoords(view)).filter(([value, _]) => predicate(value))

const neighbors = (view, { x, y }) =>
  [
    // above
    { x, y: y - 1 },
    //right
    { x: x + 1, y },
    // below
    { x, y: y + 1 },
    //left
    { x: x - 1, y }
  ].map(coords => [get(view, coords), coords])

const getIntersections = view => {
  const scaffolds = whereValue(view, v => v === '#')

  return scaffolds
    .filter(
      ([_, coords]) =>
        neighbors(view, coords).filter(([value, _]) => value === '#').length ===
        4
    )
    .map(([_, coords]) => coords)
}

const sumAlignmentParams = view =>
  getIntersections(view)
    .map(({ x, y }) => x * y)
    .reduce((a, b) => a + b, 0)

{
  const example = `..#..........\n..#..........\n#######...###\n#.#...#...#.#\n#############\n..#...#...#..\n..#####...^..`
    .split('\n')
    .map(line => line.split(''))
  assert.equal(sumAlignmentParams(example), 76)
}

const part1 = input => {
  const p = new Program(parse(input))
  while (!p.halted()) {
    p.step()
  }

  const cameraView = p
    .consumeOutputs()
    .map(num => {
      if (num === 10) return '\n'
      return String.fromCharCode(num)
    })
    .join('')
    .trim()
    .split('\n')
    .map(line => line.split(''))

  return sumAlignmentParams(cameraView)
}

console.log(part1(input))
