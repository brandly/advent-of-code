const fs = require('fs')
const assert = require('assert')
const { minBy, maxBy, range } = require('lodash')
const { Program } = require('./02.js')

const parse = input => input.split(',').map(v => parseInt(v))

const encode = ([x, y]) => `${x},${y}`
const decode = str => str.split(',').map(v => parseInt(v))

class Robot {
  constructor(instructions) {
    this.coords = [0, 0]
    this.panels = {}
    this.program = new Program(instructions)
    this.facing = 0 // up
  }

  get(coords) {
    return this.panels[encode(coords)] || 0
  }

  set(coords, color) {
    this.panels[encode(coords)] = color
  }

  turn(direction) {
    // 0 means it should turn left 90 degrees, and
    // 1 means it should turn right 90 degrees.
    if (direction === 0) {
      let attempt = this.facing - 1
      this.facing = attempt < 0 ? 3 : attempt
    } else if (direction === 1) {
      this.facing = (this.facing + 1) % 4
    } else {
      throw new Error(`Unexpected direction: ${direction}`)
    }
  }

  stepForward() {
    const [x, y] = this.coords
    switch (this.facing) {
      // up
      case 0: {
        this.coords = [x, y + 1]
        break
      }
      // right
      case 1: {
        this.coords = [x + 1, y]
        break
      }
      // down
      case 2: {
        this.coords = [x, y - 1]
        break
      }
      // left
      case 3: {
        this.coords = [x - 1, y]
        break
      }
      default: {
        throw new Error(`Unexpected facing: ${this.facing}`)
      }
    }
  }

  paint() {
    const currentColor = this.get(this.coords)
    this.program.send(currentColor)

    while (this.program.outputs.length < 2 && !this.program.halted()) {
      this.program.step()
    }

    if (!this.program.halted()) {
      const [newColor, direction] = this.program.consumeOutputs()
      this.set(this.coords, newColor)
      this.turn(direction)
      this.stepForward()
    }
  }

  paintToCompletion() {
    while (!this.program.halted()) {
      this.paint()
    }

    return this.panels
  }
}

const input = fs
  .readFileSync(`${__dirname}/11.txt`)
  .toString()
  .trim()

{
  let robot = new Robot(parse(input))
  console.log(Object.keys(robot.paintToCompletion()).length)
}

const view = panels => {
  const paintedCoords = Object.keys(panels).map(key => decode(key))

  const minX = minBy(paintedCoords.map(([x, _]) => x))
  const maxX = maxBy(paintedCoords.map(([x, _]) => x))

  const minY = minBy(paintedCoords.map(([_, y]) => y))
  const maxY = maxBy(paintedCoords.map(([_, y]) => y))

  const toDraw = range(minY, maxY + 1)
    .reverse()
    .map(y => range(minX, maxX + 1).map(x => panels[encode([x, y])] || 0))

  return toDraw
    .map(row => row.map(v => (v === 1 ? '■' : ' ')).join(''))
    .join('\n')
}

{
  let robot = new Robot(parse(input))
  // start on a white panel
  robot.set(robot.coords, 1)
  let panels = robot.paintToCompletion()
  console.log(view(panels))
}
