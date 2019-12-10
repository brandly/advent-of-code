const assert = require('assert')
const max = values => Math.max.apply(Math, values)

const view = (currentMarble, currentPlayer) => {
  let pointer = currentMarble

  // orient to 0
  while (pointer.points() !== 0) {
    pointer = pointer.next()
  }

  const bag = []
  const prev = pointer.prev()

  do {
    bag.push(pointer)
    pointer = pointer.next()
  } while (prev !== pointer)

  let circle = bag
    .map(marble =>
      marble === currentMarble
        ? `(${marble.points()})`
        : marble.points() < 10
        ? ` ${marble.points()} `
        : ` ${marble.points()} `
    )
    .join('')
  return `[${currentPlayer + 1}] ${circle}`
}

class Marble {
  constructor(num) {
    this.num = num
    this._next = null
    this._prev = null
  }

  loop() {
    this._next = this
    this._prev = this
    return this
  }

  points() {
    return this.num
  }

  next() {
    return this._next
  }
  prev() {
    return this._prev
  }

  remove() {
    const { _prev, _next } = this
    _prev._next = _next
    _next._prev = _prev

    // The marble located immediately clockwise of the marble that was removed
    // becomes the new current marble.
    return _next
  }

  insert(num) {
    let marble = new Marble(num)
    marble._next = this._next
    marble._prev = this

    this._next = marble
    marble._next._prev = marble

    return marble
  }
}

const run = ({ maxMarble, playerCount, debug = false }) => {
  const scores = {}
  for (let i = 0; i < playerCount; i++) {
    scores[i] = 0
  }

  let currentPlayer = -1
  let upcoming = 1

  let zero = new Marble(0).loop()
  let currentMarble = zero

  while (upcoming <= maxMarble) {
    if (debug) console.log(view(currentMarble, currentPlayer))
    if (upcoming % 23 === 0) {
      for (let i = 0; i < 7; i++) currentMarble = currentMarble.prev()
      scores[currentPlayer] += upcoming + currentMarble.points()
      currentMarble = currentMarble.remove()
    } else {
      currentMarble = currentMarble.next()
      currentMarble = currentMarble.insert(upcoming)
    }

    upcoming++
    currentPlayer = (currentPlayer + 1) % playerCount
  }

  if (debug) console.log(view(currentMarble, currentPlayer))
  return max(Object.values(scores))
}

assert.equal(run({ playerCount: 9, maxMarble: 25 }), 32)

assert.equal(run({ playerCount: 10, maxMarble: 1618 }), 8317)
assert.equal(run({ playerCount: 13, maxMarble: 7999 }), 146373)
assert.equal(run({ playerCount: 17, maxMarble: 1104 }), 2764)
assert.equal(run({ playerCount: 21, maxMarble: 6111 }), 54718)
assert.equal(run({ playerCount: 30, maxMarble: 5807 }), 37305)

console.log(run({ playerCount: 458, maxMarble: 71307 }))
console.log(run({ playerCount: 458, maxMarble: 71307 * 100 }))
