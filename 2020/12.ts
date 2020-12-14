const assert = require('assert')
const fs = require('fs')
const { sum, sortBy, takeWhile } = require('lodash')
const file = fs.readFileSync('2020/12.txt', 'utf-8')
type Direction = 'N' | 'S' | 'E' | 'W'
type Action = Direction | 'L' | 'R' | 'F'
type Step = { action: Action; num: number }
const parse = (str: string): Step[] =>
  str
    .trim()
    .split('\n')
    .map((line) => {
      const [_, action, num] = /^(\D+)(\d+)$/.exec(line)
      return { action: action as Action, num: parseInt(num) }
    })

const part1 = (str) => {
  const steps = parse(str)
  let facing = [1, 0]
  let coords = [0, 0]

  steps.forEach(({ action, num }) => {
    switch (action) {
      case 'N': {
        coords = [coords[0], coords[1] + num]
        break
      }
      case 'S': {
        coords = [coords[0], coords[1] - num]
        break
      }
      case 'E': {
        coords = [coords[0] + num, coords[1]]
        break
      }
      case 'W': {
        coords = [coords[0] - num, coords[1]]
        break
      }
      case 'L': {
        while (num) {
          if (facing[0] === 1) {
            facing = [0, 1]
          } else if (facing[1] === 1) {
            facing = [-1, 0]
          } else if (facing[0] === -1) {
            facing = [0, -1]
          } else if (facing[1] === -1) {
            facing = [1, 0]
          } else {
            throw new Error()
          }
          num -= 90
        }
        break
      }
      case 'R': {
        while (num) {
          if (facing[0] === 1) {
            facing = [0, -1]
          } else if (facing[1] === -1) {
            facing = [-1, 0]
          } else if (facing[0] === -1) {
            facing = [0, 1]
          } else if (facing[1] === 1) {
            facing = [1, 0]
          } else {
            throw new Error()
          }
          num -= 90
        }
        break
      }
      case 'F': {
        coords = [coords[0] + facing[0] * num, coords[1] + facing[1] * num]
        break
      }
    }
  })
  return Math.abs(coords[0]) + Math.abs(coords[1])
}

console.log(part1(file))

const part2 = (str) => {
  const steps = parse(str)
  let facing = [1, 0]
  let coords = [0, 0]
  let waypoint = [10, 1]

  steps.forEach(({ action, num }) => {
    switch (action) {
      case 'N': {
        waypoint = [waypoint[0], waypoint[1] + num]
        break
      }
      case 'S': {
        waypoint = [waypoint[0], waypoint[1] - num]
        break
      }
      case 'E': {
        waypoint = [waypoint[0] + num, waypoint[1]]
        break
      }
      case 'W': {
        waypoint = [waypoint[0] - num, waypoint[1]]
        break
      }
      case 'L': {
        while (num) {
          const [x, y] = waypoint
          waypoint = [-y, x]
          num -= 90
        }
        break
      }
      case 'R': {
        while (num) {
          const [x, y] = waypoint
          waypoint = [y, -x]
          num -= 90
        }
        break
      }
      case 'F': {
        coords = [coords[0] + waypoint[0] * num, coords[1] + waypoint[1] * num]
        break
      }
    }
  })
  return Math.abs(coords[0]) + Math.abs(coords[1])
}

console.log(part2(file))

{
  const example = `F10
N3
F7
R90
F11`
  assert.equal(part1(example), 25)
  assert.equal(part2(example), 286)
}
