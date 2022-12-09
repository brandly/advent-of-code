const fs = require('fs')
const assert = require('assert')
const { range, every, identity } = require('lodash')
const file = fs.readFileSync('2022/09.txt', 'utf-8').trim()

const example = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`

const parse = (input) =>
  input.split('\n').map((line) => {
    const [dir, num] = line.split(' ')
    return { dir, num: parseInt(num) }
  })

const create = () => ({ x: 0, y: 0 })

const move = (dir, { x, y }) => {
  switch (dir) {
    case 'R':
      return { x: x + 1, y }
    case 'L':
      return { x: x - 1, y }
    case 'U':
      return { x, y: y + 1 }
    case 'D':
      return { x, y: y - 1 }
    default:
      throw Error(`Unexpected dir ${dir}`)
  }
}

const chase = (head, tail) => {
  const diff = { x: head.x - tail.x, y: head.y - tail.y }
  const abs = { x: Math.abs(diff.x), y: Math.abs(diff.y) }
  const unit = {
    x: diff.x === 0 ? 0 : diff.x / abs.x,
    y: diff.y === 0 ? 0 : diff.y / abs.y,
  }

  if (abs.x < 2 && abs.y < 2) {
    return tail
  } else {
    return { x: tail.x + unit.x, y: tail.y + unit.y }
  }
}

const part1 = (input) => {
  const instructions = parse(input)

  const log = new Set()
  const addLog = ({ x, y }) => {
    log.add(`${x},${y}`)
  }

  instructions.reduce(
    ({ head, tail }, { dir, num }) => {
      for (let i = 0; i < num; i++) {
        head = move(dir, head)
        tail = chase(head, tail)
        addLog(tail)
      }
      return { head, tail }
    },
    {
      head: create(),
      tail: create(),
    }
  )

  return log.size
}

const encode = ({ x, y }) => `${x},${y}`
const decode = (str) => {
  const [x, y] = str.split(',').map((n) => parseInt(n))
  return { x, y }
}

const draw = (knots, size = { x: 10, y: 10 }) => {
  const xs = knots.map(({ x }) => x)
  const ys = knots.map(({ y }) => -y)

  const outxs = range(
    Math.min.apply(Math, [...xs, -size.x]),
    Math.max.apply(Math, [...xs, size.x]) + 1
  )
  const outys = range(
    Math.min.apply(Math, [...ys, -size.y]),
    Math.max.apply(Math, [...ys, size.y]) + 1
  )

  const lookup = knots.reduce((acc, knot, k) => {
    const key = encode(knot)
    if (!(key in acc)) acc[key] = { knot, k }
    return acc
  }, {})
  outys.forEach((y) => {
    const chars = outxs.map((x) => {
      const knot = lookup[encode({ x, y: -y })]
      return knot ? (knot.k === 0 ? 'H' : knot.k) : '.'
    })
    console.log(chars.join(''))
  })
  console.log('\n')
}

const write = (...args) =>
  console.log(
    args
      .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
      .join(' ')
  )

const part2 = (input) => {
  const instructions = parse(input)

  const log = new Set()
  const addLog = (coords) => {
    log.add(encode(coords))
  }

  instructions.reduce(
    (knots, { dir, num }) => {
      // write(`== ${dir} ${num} ==`)
      for (let i = 0; i < num; i++) {
        knots.forEach((knot, k) => {
          knots[k] = k === 0 ? move(dir, knot) : chase(knots[k - 1], knot)
        })
        addLog(knots[knots.length - 1])
      }
      // draw(knots)
      return knots
    },
    range(0, 10).map(() => create())
  )

  return log.size
}

assert.equal(part1(example), 13)
console.log(part1(file))

const biggerExample = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`

assert.equal(part2(example), 1)
assert.equal(part2(biggerExample), 36)
console.log(part2(file))
