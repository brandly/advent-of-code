const fs = require('fs')
const assert = require('assert')
const { memoize } = require('lodash')

const input = fs.readFileSync('./13.txt', 'utf-8').trim()
const example = `0: 3
1: 2
4: 4
6: 4`

const parse = input => input.split('\n').reduce((result, line) => {
  const [left, right] = line.split(': ')
  return Object.assign(result, {
    [left]: parseInt(right, 10)
  })
}, {})

assert.deepEqual(parse(example), {
  '0': 3,
  '1': 2,
  '4': 4,
  '6': 4
})

const buildWalls = input => {
  const walls = parse(input)
  const indexesWithWall = Object.keys(walls).map(n => parseInt(n, 10))
  const max = Math.max.apply(Math, indexesWithWall)

  return new Array(max + 1).fill(null).map((val, index) =>
    walls[index] ? {
      range: walls[index],
      security: {
        index: 0,
        direction: 1
      }
    } : val
  )
}

const advanceSecurity = walls => {
  return walls.map(wall => {
    const { range, security = {} } = (wall || {})
    const index = security.index + security.direction

    let direction = security.direction
    if (index === 0 || index === (range - 1)) {
      direction = direction * -1
    }

    return wall ? {
      range,
      security: {
        index,
        direction
      }
    } : null
  })
}

const render = (walls, me) => {
  const indexesWithWall = Object.keys(walls).map(n => parseInt(n, 10))
  const max = Math.max.apply(Math, indexesWithWall)

  for (let i = 0; i < max; i++) {
    const line = walls.map((wall, column) => {
      const itMe = i === 0 && column === me
      if (!wall && i === 0) {
        return itMe ? '(.)' : '...'
      } else if (wall && i < wall.range) {
        const left = itMe ? '(' : '['
        const right = itMe ? ')' : ']'
        const mid = wall.security.index === i ? 'S' : ' '
        return `${left}${mid}${right}`
      } else {
        return '   '
      }
    })

    console.log(line.join(' '))
  }
}

const part1 = walls => {
  // console.log('Initial State', walls.length)
  // render(walls)

  let severity = 0
  for (let me = 0; me < walls.length; me++) {
    // console.log('Picosecond ' + me)

    if (walls[me] && walls[me].security.index === 0) {
      // console.log('hit!')
      severity += walls[me].range * me
    }

    // render(walls, me)
    walls = advanceSecurity(walls)
    // render(walls, me)
  }

  return severity
}

assert.equal(part1(buildWalls(example)), 24)

const inputWalls = buildWalls(input)
console.log(part1(inputWalls))

// y = mx + b
// delay = (2 * wall.range - 2)x + b
// algebra...
// x = (delay + wall.depth) / (2 * wall.range - 2)
// scanners collide when x is an int
const gotCaught = (delay, wall) =>
  Number.isInteger((delay + wall.depth) / (2 * wall.range - 2))

assert.equal(gotCaught(0, { depth: 0, range: 3 }), true)

const part2 = walls => {
  const wallsNoGaps = walls.map((wall, index) => {
    if (!wall) return null

    return {
      depth: index,
      range: wall.range
    }
  }).filter(Boolean)

  const anyCaught = (walls, delay) => {
    for (let i = 0; i < walls.length; i++) {
      if (gotCaught(delay, walls[i])) {
        return true
      }
    }
    return false
  }

  let delay = 0
  while (anyCaught(wallsNoGaps, delay)) {
    delay++
  }

  return delay
}

assert.equal(part2(buildWalls(example)), 10)

console.log(part2(inputWalls))
