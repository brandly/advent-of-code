const assert = require('assert')
const input = 361527

// generate this grid
// figure out coordinate of our input

const coords = input => {
  let num = 1
  let x = 0
  let y = 0
  let steps = 1

  while (num <= input) {
    for (var i = 0; i < steps; i++) {
      x += 1
      num += 1
      if (num === input) return [x, y]
    }

    for (var i = 0; i < steps; i++) {
      y += 1
      num += 1
      if (num === input) return [x, y]
    }

    steps += 1

    for (var i = 0; i < steps; i++) {
      x -= 1
      num += 1
      if (num === input) return [x, y]
    }

    for (var i = 0; i < steps; i++) {
      y -= 1
      num += 1
      if (num === input) return [x, y]
    }

    steps += 1
  }

  return [0, 0]
}

const answer = input =>
  coords(input).reduce((a, b) => {
    return Math.abs(a) + Math.abs(b)
  }, 0)

assert.equal(answer(1), 0)
assert.equal(answer(12), 3)
assert.equal(answer(23), 2)
assert.equal(answer(1024), 31)

console.log(answer(input))

const answer2 = input => {
  let num = 1
  let x = 0
  let y = 0
  let steps = 1
  let _store = {}

  const key = (x, y) => x + '$$' + y
  const store = (x, y, val) => {
    _store[key(x, y)] = val
  }
  const get = (x, y) => _store[key(x, y)]

  const sumOfNeighbors = (x, y) => {
    const neighbors = [
      get(x + 1, y),
      get(x + 1, y  + 1),
      get(x, y  + 1),
      get(x - 1, y  + 1),
      get(x - 1, y),
      get(x - 1, y - 1),
      get(x, y - 1),
      get(x + 1, y - 1)
    ]
    return neighbors.filter(n => n !== undefined).reduce((a, b) => {
      return a + b
    }, 0)
  }

  store(0, 0, 1)

  while (num <= input) {
    for (var i = 0; i < steps; i++) {
      x += 1
      num = sumOfNeighbors(x, y)
      store(x, y, num)
      if (num >= input) return num
    }

    for (var i = 0; i < steps; i++) {
      y += 1
      num = sumOfNeighbors(x, y)
      store(x, y, num)
      if (num >= input) return num
    }

    steps += 1

    for (var i = 0; i < steps; i++) {
      x -= 1
      num = sumOfNeighbors(x, y)
      store(x, y, num)
      if (num >= input) return num
    }

    for (var i = 0; i < steps; i++) {
      y -= 1
      num = sumOfNeighbors(x, y)
      store(x, y, num)
      if (num >= input) return num
    }

    steps += 1
  }

  return [0, 0]
}

console.log(answer2(input))
