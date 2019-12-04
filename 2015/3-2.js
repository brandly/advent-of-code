'use strict'
const input = require('./read-input')(3)

class Tracker {
  constructor() {
    this._tracker = {}
  }

  trackLocation(x, y) {
    const key = x.toString() + 'x' + y.toString()
    this._tracker[key] = true
  }

  getLocationCount() {
    return Object.keys(this._tracker).length
  }
}

class Santa {
  constructor(tracker) {
    this.x = 0
    this.y = 0
    this.tracker = tracker
  }

  moveByChar(char) {
    switch (char) {
      case '^':
        this.moveUp()
        break

      case '>':
        this.moveRight()
        break

      case 'v':
        this.moveDown()
        break

      case '<':
        this.moveLeft()
        break
    }
  }

  moveUp() {
    this.y += 1
    this._trackLocation()
  }

  moveRight() {
    this.x += 1
    this._trackLocation()
  }

  moveDown() {
    this.y -= 1
    this._trackLocation()
  }

  moveLeft() {
    this.x -= 1
    this._trackLocation()
  }

  _trackLocation() {
    this.tracker.trackLocation(this.x, this.y)
  }
}

const tracker = new Tracker()
const santa = new Santa(tracker)
const roboSanta = new Santa(tracker)

input.split('').forEach((char, i) => {
  if (i % 2 === 0) {
    santa.moveByChar(char)
  } else {
    roboSanta.moveByChar(char)
  }
})

console.log(tracker.getLocationCount())
