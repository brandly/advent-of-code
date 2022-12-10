const fs = require('fs')
const assert = require('assert')
const { sum } = require('lodash')
const file = fs.readFileSync('2022/10.txt', 'utf-8').trim()
const example = fs.readFileSync('2022/10.example', 'utf-8').trim()

const parse = (input) =>
  input
    .split('\n')
    .map((line) => (line === 'noop' ? line : parseInt(line.split(' ')[1])))

const run = (instructions) => {
  const cycles = []

  let cycle = 1
  let X = 1
  let state = 'idle'

  while (instructions.length) {
    const head = instructions[0]

    cycles.push({ cycle, X, state })

    if (typeof head === 'number') {
      if (state === 'idle') {
        state = 'adding'
      } else {
        instructions.shift()
        state = 'idle'
        X += head
      }
    } else if (head === 'noop') {
      instructions.shift()
    } else {
      throw Error(`Unexpected head: ${head}`)
    }

    cycle++
  }

  return cycles
}

const cyclesOfInterest = new Set([20, 60, 100, 140, 180, 220])

const part1 = (input) =>
  sum(
    run(parse(input))
      .filter(({ cycle }) => cyclesOfInterest.has(cycle))
      .map(({ cycle, X }) => cycle * X)
  )

const small = `noop
addx 3
addx -5`

assert.equal(part1(example), 13140)
console.log(part1(file))

const part2 = (input) => {
  const cycles = run(parse(input))
  const CRT = []

  cycles.forEach(({ cycle, X }) => {
    const crtPosition = (cycle - 1) % 40
    const spritePosition = new Set([X - 1, X, X + 1])

    CRT.push(spritePosition.has(crtPosition) ? '#' : '.')
    if (cycle % 40 === 0) CRT.push('\n')
  })

  return CRT.join('').trim()
}

assert.equal(
  part2(example),
  `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`
)
console.log(part2(file))
