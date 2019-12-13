const fs = require('fs')
const assert = require('assert')
const { Program, programWithOutputs } = require('./02.js')

const input = fs.readFileSync(`${__dirname}/13.txt`, 'utf-8').trim()
const parse = input => input.split(',').map(v => parseInt(v))

const part1 = input => {
  const { outputs } = programWithOutputs(parse(input))

  const screen = []
  for (let i = 0; i < outputs.length; i += 3) {
    let [x, y, tile] = [outputs[i], outputs[i + 1], outputs[i + 2]]

    if (!screen[y]) {
      screen[y] = []
    }
    screen[y][x] = tile
  }

  return screen.flatMap(a => a).filter(v => v === 2).length
}

console.log(part1(input))

const view = screen => screen.map(row => row.map(viewCell).join('')).join('\n')

const viewCell = (v = 0) => {
  // 0 is an empty tile. No game object appears in this tile.
  // 1 is a wall tile. Walls are indestructible barriers.
  // 2 is a block tile. Blocks can be broken by the ball.
  // 3 is a horizontal paddle tile. The paddle is indestructible.
  // 4 is a ball tile. The ball moves diagonally and bounces off objects.
  switch (v) {
    case 0:
      return '  '
    case 1:
      return '⬜️'
    case 2:
      return '🍰'
    case 3:
      return '🎫'
    case 4:
      return '🔵'
    default:
      throw new Error(`Unexpected cell value: ${v}`)
  }
}

const toList = screen =>
  screen.flatMap((row, y) => row.map((value, x) => [value, { x, y }]))

const find = (screen, predicate) => toList(screen).find(predicate)
const paddlePosition = screen => find(screen, ([v, coords]) => v === 3)[1]
const ballPosition = screen => find(screen, ([v, coords]) => v === 4)[1]

class Arcade {
  constructor(instructions, bot) {
    this.instructions = instructions
    this.bot = bot
    this.score = 0
  }

  forFree() {
    // Memory address 0 represents the number of quarters that
    // have been inserted; set it to 2 to play for free.
    this.instructions[0] = 2
    return this
  }

  play() {
    const p = new Program(this.instructions, [])
    const screen = []

    while (!p.halted()) {
      try {
        p.step()
      } catch (e) {
        if (e.message === 'Not enough input.') {
          p.send(this.bot(screen))
        } else {
          throw e
        }
      }
      if (p.outputs.length >= 3) {
        const outputs = p.consumeOutputs()
        for (let i = 0; i < outputs.length; i += 3) {
          let [x, y, tile] = [outputs[i], outputs[i + 1], outputs[i + 2]]

          if (x === -1 && y === 0) {
            this.score = tile
          } else {
            if (!screen[y]) {
              screen[y] = []
            }
            screen[y][x] = tile
          }
        }
      }
    }
    return this
  }
}

const part2 = input => {
  const instructions = parse(input)
  const arcade = new Arcade(instructions, screen => {
    const ball = ballPosition(screen)
    const paddle = paddlePosition(screen)
    // console.log(view(screen), '\n\n')
    if (ball.x > paddle.x) {
      return 1
    } else if (ball.x < paddle.x) {
      return -1
    } else {
      return 0
    }
  })
  return arcade.forFree().play().score
}

console.log(part2(input))
