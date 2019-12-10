const assert = require('assert')
const max = values => Math.max.apply(Math, values)

const view = (game, currentMarble, currentPlayer) => {
  let game_ = game
    .map((num, index) => (index === currentMarble ? `(${num})` : ` ${num} `))
    .join('')

  return `[${currentPlayer + 1}] ${game_}`
}
const run = ({ maxMarble, playerCount, debug = false }) => {
  const scores = {}
  for (let i = 0; i < playerCount; i++) {
    scores[i] = 0
  }

  let currentPlayer = -1
  let currentMarble = 0

  let upcoming = 1
  let game = [0]

  if (debug) console.log(view(game, currentMarble, currentPlayer))
  while (upcoming <= maxMarble) {
    if (upcoming % 23 === 0) {
      let index = currentMarble - 7
      if (index < 0) {
        index += game.length
      }
      scores[currentPlayer] += upcoming + game[index]
      game = game.slice(0, index).concat(game.slice(index + 1))
      currentMarble = index
    } else {
      let insertion = (currentMarble + 1) % game.length

      if (insertion === game.length - 1) {
        game.push(upcoming)
      } else {
        game = game
          .slice(0, insertion + 1)
          .concat(upcoming, game.slice(insertion + 1))
      }
      currentMarble = (insertion + 1) % game.length
    }

    upcoming++
    currentPlayer = (currentPlayer + 1) % playerCount
    if (debug) console.log(view(game, currentMarble, currentPlayer))
  }

  if (debug) console.log(scores)
  return max(Object.values(scores))
}

assert.equal(run({ playerCount: 9, maxMarble: 25 }), 32)
assert.equal(run({ playerCount: 10, maxMarble: 1618 }), 8317)
assert.equal(run({ playerCount: 13, maxMarble: 7999 }), 146373)
assert.equal(run({ playerCount: 17, maxMarble: 1104 }), 2764)
assert.equal(run({ playerCount: 21, maxMarble: 6111 }), 54718)
assert.equal(run({ playerCount: 30, maxMarble: 5807 }), 37305)

console.log(run({ playerCount: 458, maxMarble: 71307 }))
