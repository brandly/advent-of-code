const fs = require('fs')
const { sum } = require('lodash')
const assert = require('assert')
const file = fs.readFileSync('2022/02.txt', 'utf-8').trim()

const parse = (file) => file.split('\n').map((line) => line.split(' '))

/* The score for a single round is the score for the shape
   you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
   plus the score for the outcome of the round (0 if you lost,
   3 if the round was a draw, and 6 if you won)

   opponent is going to play: A for Rock, B for Paper, and C for Scissors
   you should play in response: X for Rock, Y for Paper, and Z for Scissors
*/
const scoreShape = (me) => {
  // (1 for Rock, 2 for Paper, and 3 for Scissors)
  if (me === 'X') return 1
  if (me === 'Y') return 2
  if (me === 'Z') return 3
  throw Error('Unexpected me ' + me)
}
// (0 if you lost, 3 if the round was a draw, and 6 if you won)
const outcome = (opponent, me) => {
  if (opponent === 'A') {
    if (me === 'X') return 3
    if (me === 'Y') return 6
    if (me === 'Z') return 0
  }
  if (opponent === 'B') {
    if (me === 'X') return 0
    if (me === 'Y') return 3
    if (me === 'Z') return 6
  }
  if (opponent === 'C') {
    if (me === 'X') return 6
    if (me === 'Y') return 0
    if (me === 'Z') return 3
  }
  throw Error(`Unexpected outcome ${opponent} ${me}`)
}
const scoreRound = (opponent, me) => scoreShape(me) + outcome(opponent, me)
const part1 = (file) => sum(parse(file).map(([a, b]) => scoreRound(a, b)))

const example = `A Y
B X
C Z`

assert.equal(part1(example), 15)
console.log(part1(file))

// how the round needs to end:
//  * X means you need to lose,
//  * Y means you need to end the round in a draw, and
//  * Z means you need to win
// you should play in response: X for Rock, Y for Paper, and Z for Scissors
const moveForResult = (opponent, result) => {
  if (opponent === 'A') {
    if (result === 'X') return 'Z'
    if (result === 'Y') return 'X'
    if (result === 'Z') return 'Y'
  }
  if (opponent === 'B') {
    if (result === 'X') return 'X'
    if (result === 'Y') return 'Y'
    if (result === 'Z') return 'Z'
  }
  if (opponent === 'C') {
    if (result === 'X') return 'Y'
    if (result === 'Y') return 'Z'
    if (result === 'Z') return 'X'
  }
  throw Error(`Unexpected moveForResult ${opponent} ${result}`)
}

const part2 = (file) =>
  sum(parse(file).map(([a, b]) => scoreRound(a, moveForResult(a, b))))

assert.equal(part2(example), 12)
console.log(part2(file))
