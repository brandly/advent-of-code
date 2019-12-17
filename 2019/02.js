const fs = require('fs')
const assert = require('assert')

const nums = fs
  .readFileSync(`${__dirname}/02.txt`)
  .toString()
  .trim()
  .split(',')
  .map(n => parseInt(n))

class Program {
  constructor(tape, inputs = []) {
    this.tape = tape.slice(0)
    this.index = 0
    this.inputs = inputs
    this.outputs = []
    this.inputIndex = 0
    this.relativeBase = 0
  }

  clone() {
    const p = new Program(this.tape, this.inputs)
    p.index = this.index
    p.outputs = this.outputs.slice(0)
    p.inputIndex = this.inputIndex
    p.relativeBase = this.relativeBase
    return p
  }

  send(inputs) {
    this.inputs = this.inputs.concat(inputs)
  }

  consumeOutputs() {
    const { outputs } = this
    this.outputs = []
    return outputs
  }

  nextInput() {
    const next_ = this.inputs[this.inputIndex]

    if (typeof next_ === 'undefined') {
      throw new Error(`Not enough input.`)
    }

    this.inputIndex++
    return next_
  }

  readOp() {
    let val = this.tape[this.index]
    if (val >= 10) {
      let op = val % 10
      let modes = ((val - op) / 100)
        .toString()
        .split('')
        .map(char => parseInt(char))
        .reverse()
      return [op, modes]
    } else {
      return [val, []]
    }
  }

  halted() {
    return this.tape[this.index] === 99
  }

  readTape = (index, mode = 0) => {
    const get = i => {
      if (i < 0) throw new Error('Cannot get negative index')
      return this.tape[i] || 0
    }

    switch (mode) {
      // position mode
      case 0:
        return get(get(index))
      // parameter mode
      case 1:
        return get(index)
      // relative mode
      case 2:
        return get(get(index) + this.relativeBase)
    }
  }

  setTape = (index, value, mode = 0) => {
    let adjusted = mode === 2 ? index + this.relativeBase : index
    if (adjusted < 0) {
      throw new Error(`Cannot set negative index ${adjusted} -> ${value}`)
    }
    this.tape[adjusted] = value
  }

  threeParams = (modes = []) => [
    this.readTape(this.index + 1, modes[0]),
    this.readTape(this.index + 2, modes[1]),
    this.tape[this.index + 3] || 0
  ]

  step() {
    let [op, modes] = this.readOp()
    switch (op) {
      case 1: {
        let [a, b, out] = this.threeParams(modes)
        this.setTape(out, a + b, modes[2])
        this.index += 4
        break
      }
      case 2: {
        let [a, b, out] = this.threeParams(modes)
        this.setTape(out, a * b, modes[2])
        this.index += 4
        break
      }
      case 3: {
        let input = this.nextInput()
        let address = this.tape[this.index + 1]
        this.setTape(address, input, modes[0])
        this.index += 2
        break
      }
      case 4: {
        this.outputs.push(this.readTape(this.index + 1, modes[0]))
        this.index += 2
        break
      }
      case 5: {
        let param = this.readTape(this.index + 1, modes[0])
        if (param !== 0) {
          this.index = this.readTape(this.index + 2, modes[1])
        } else {
          this.index += 3
        }
        break
      }
      case 6: {
        let param = this.readTape(this.index + 1, modes[0])
        if (param === 0) {
          this.index = this.readTape(this.index + 2, modes[1])
        } else {
          this.index += 3
        }
        break
      }
      case 7: {
        let [first, second, third] = this.threeParams(modes)
        this.setTape(third, first < second ? 1 : 0, modes[2])
        this.index += 4
        break
      }
      case 8: {
        let [first, second, third] = this.threeParams(modes)
        this.setTape(third, first === second ? 1 : 0, modes[2])
        this.index += 4
        break
      }
      case 9: {
        this.relativeBase += this.readTape(this.index + 1, modes[0])
        this.index += 2
        break
      }
      default: {
        throw new Error(`Unexpected value ${this.tape[this.index]}`)
      }
    }
  }

  getLastOutput() {
    return this.outputs[this.outputs.length - 1]
  }
}

const programWithOutputs = (instructions, inputs = []) => {
  let p = new Program(instructions, inputs)

  while (!p.halted()) {
    p.step()
  }

  return p
}

const program = instructions => programWithOutputs(instructions).tape

module.exports = { program, programWithOutputs, Program }

assert.deepEqual(program([1, 0, 0, 0, 99]), [2, 0, 0, 0, 99])
assert.deepEqual(program([2, 3, 0, 3, 99]), [2, 3, 0, 6, 99])
assert.deepEqual(program([2, 4, 4, 5, 99, 0]), [2, 4, 4, 5, 99, 9801])
assert.deepEqual(program([1, 1, 1, 4, 99, 5, 6, 0, 99]), [
  30,
  1,
  1,
  4,
  2,
  5,
  6,
  0,
  99
])

const withInputs = (a, b) => {
  const alarm = nums.slice(0)
  alarm[1] = a
  alarm[2] = b
  return program(alarm)[0]
}

if (require.main === module) {
  console.log(withInputs(12, 2))

  {
    for (let a = 0; a <= 99; a++) {
      for (let b = 0; b <= 99; b++) {
        let output = withInputs(a, b)
        if (output === 19690720) {
          console.log(100 * a + b)
        }
      }
    }
  }
}
