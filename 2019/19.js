const fs = require('fs')
const assert = require('assert')
const { range } = require('lodash')
const { Program } = require('./02.js')

const input = fs.readFileSync(`${__dirname}/19.txt`, 'utf-8').trim()
const parse = input => input.split(',').map(v => parseInt(v))

const filter = (board, fn) => board.flatMap(row => row.filter(fn))
const view = board => board.map(row => row.join('')).join('\n')

const part1 = input => {
  const size = 50
  const board = range(0, size).map(_ => range(0, size))
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const p = new Program(parse(input))
      p.send([x, y])

      while (!p.outputs.length) {
        p.step()
      }

      board[y][x] = p.consumeOutputs()[0]
    }
  }
  return filter(board, v => v === 1).length
}

console.log(part1(input))

const part2 = input => {
  const board = []
  const get = ({ x, y }) => {
    const p = new Program(parse(input))
    p.send([x, y])
    while (!p.outputs.length) {
      p.step()
    }
    return p.consumeOutputs()[0]
  }

  // looked at the first 50x50. this is the start of the
  // contiguous spotlight.
  const known = { x: 5, y: 4 }

  for (let i = 1; ; i++) {
    // Top of spotlight
    let top = { x: known.x * i, y: known.y * i }
    while (get({ ...top, y: top.y - 1 }) === 1) {
      top = { ...top, y: top.y - 1 }
    }

    let bottom = { ...top, y: top.y + 100 }
    if (get(bottom) === 0) {
      continue
    }

    while (get(bottom) === 1) {
      bottom.y++
    }
    // whoops, overstepped
    bottom.y--
    assert.equal(get(bottom), 1)
    const size = 100

    // go to top
    let guess = { ...bottom, y: bottom.y - (size - 1) }

    // look for top-right corner
    if (get({ ...guess, x: guess.x + (size - 1) })) {
      return guess.x * 10000 + guess.y
    }
  }
}

console.log(part2(input))
