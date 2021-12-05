const fs = require('fs')
const assert = require('assert')
const { range } = require('lodash')
const file = fs.readFileSync('2021/05.txt', 'utf-8').trim()

const parseCoords = (str) => {
  const [x, y] = str.split(',').map((n) => parseInt(n))
  return { x, y }
}

const parse = (input) => {
  return input.split('\n').map((row) => {
    const [start, end] = row.split(' -> ')
    return {
      start: parseCoords(start),
      end: parseCoords(end),
    }
  })
}

const encode = (x, y) => `${x},${y}`

const part1 = (input) => {
  const lines = parse(input)

  const result = {}
  const insert = (x, y) => {
    const key = encode(x, y)
    if (result[key]) result[key]++
    else result[key] = 1
  }
  lines.forEach(({ start, end }) => {
    // vertical
    if (start.x === end.x) {
      const x = start.x
      const [lowY, highY] =
        start.y < end.y ? [start.y, end.y] : [end.y, start.y]
      for (let y = lowY; y <= highY; y++) {
        insert(x, y)
      }
    }

    // horizontal
    if (start.y === end.y) {
      const y = start.y
      const [lowX, highX] =
        start.x < end.x ? [start.x, end.x] : [end.x, start.x]
      for (let x = lowX; x <= highX; x++) {
        insert(x, y)
      }
    }
  })

  return Object.values(result).filter((n) => n >= 2).length
}

{
  const example =
    '0,9 -> 5,9\n8,0 -> 0,8\n9,4 -> 3,4\n2,2 -> 2,1\n7,0 -> 7,4\n6,4 -> 2,0\n0,9 -> 2,9\n3,4 -> 1,4\n0,0 -> 8,8\n5,5 -> 8,2'
  assert.equal(part1(example), 5)
}

console.log(part1(file))

const part2 = (input) => {
  const lines = parse(input)

  const result = {}
  const insert = (x, y) => {
    const key = encode(x, y)
    if (result[key]) result[key]++
    else result[key] = 1
  }
  lines.forEach(({ start, end }, index) => {
    // console.debug(print(result))
    // console.debug('line', index, { start, end })
    const [lowX, highX] = start.x < end.x ? [start.x, end.x] : [end.x, start.x]
    const [lowY, highY] = start.y < end.y ? [start.y, end.y] : [end.y, start.y]
    // vertical
    if (start.x === end.x) {
      const x = start.x
      for (let y = lowY; y <= highY; y++) {
        insert(x, y)
      }
      return
    }

    // horizontal
    if (start.y === end.y) {
      const y = start.y
      for (let x = lowX; x <= highX; x++) {
        insert(x, y)
      }
      return
    }

    // diagonal
    const step = (x, y) => {
      if (start.x < end.x) x++
      else x--

      if (start.y < end.y) y++
      else y--
      return [x, y]
    }
    for (
      let x = start.x, y = start.y;
      x >= lowX && x <= highX, y >= lowY && y <= highY;
      [x, y] = step(x, y)
    ) {
      insert(x, y)
    }
  })

  // console.debug(print(result))

  return Object.values(result).filter((n) => n >= 2).length
}

const print = (result) =>
  range(0, 10)
    .map((y) =>
      range(0, 10)
        .map((x) => {
          const key = encode(x, y)
          const val = result[key]
          return val || '.'
        })
        .join('')
    )
    .join('\n')

{
  const example =
    '0,9 -> 5,9\n8,0 -> 0,8\n9,4 -> 3,4\n2,2 -> 2,1\n7,0 -> 7,4\n6,4 -> 2,0\n0,9 -> 2,9\n3,4 -> 1,4\n0,0 -> 8,8\n5,5 -> 8,2'
  assert.equal(part2(example), 12)
}

console.log(part2(file))
