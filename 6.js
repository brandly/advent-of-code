'use strict'
const fs = require('fs')
const input = fs.readFileSync('./6-input.txt').toString().trim()

function num (x) {
  return parseInt(x, 10)
}

function range (len) {
  const result = []
  for (let i = 0; i < len; i++) {
    result.push(null)
  }
  return result
}

class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

const lineRegex = /([a-z ]*)([0-9]*),([0-9]*)([a-z ]*)([0-9,]*),([0-9]*)/

const transformations = input.split('\n').map((line => {
  const matches = lineRegex.exec(line)

  return {
    action: matches[1].trim(),
    start: new Point(num(matches[2]), num(matches[3])),
    end: new Point(num(matches[5]), num(matches[6]))
  }
}))

class Board {
  constructor (width, height, initial) {
    this.width = width
    this.height = height

    this._board = range(width).map(() => {
      return range(height).map(() => {
        return initial
      })
    })
  }

  applyToRange (pointA, pointB, action) {
    const minX = Math.min(pointA.x, pointB.x)
    const maxX = Math.max(pointA.x, pointB.x)

    const minY = Math.min(pointA.y, pointB.y)
    const maxY = Math.max(pointA.y, pointB.y)

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        this._board[x][y] = action(this._board[x][y])
      }
    }
  }
}

const actionFnMap = {
  'turn on': function () {
    return true
  },
  'turn off': function () {
    return false
  },
  'toggle': function (current) {
    return !current
  }
}

const board = new Board(1000, 1000, false)

transformations.forEach((transform) => {
  const action = actionFnMap[transform.action]
  board.applyToRange(transform.start, transform.end, action)
})

let totalLightsOn = 0
board.applyToRange(new Point(0, 0), new Point(999, 999), (isOn) => {
  if (isOn) {
    totalLightsOn += 1
  }
})

// Part 1
console.log(totalLightsOn)

const actionFnMap2 = {
  'turn on': function (current) {
    return current + 1
  },
  'turn off': function (current) {
    return Math.max(current - 1, 0)
  },
  'toggle': function (current) {
    return current + 2
  }
}

const board2 = new Board(1000, 1000, 0)

transformations.forEach((transform) => {
  const action = actionFnMap2[transform.action]
  board2.applyToRange(transform.start, transform.end, action)
})

let totalLightsOn2 = 0
board2.applyToRange(new Point(0, 0), new Point(999, 999), (value) => {
  totalLightsOn2 += value
})

// Part 2
console.log(totalLightsOn2)
