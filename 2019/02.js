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
  }

  send(inputs) {
    this.inputs = this.inputs.concat(inputs)
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

  step() {
    let [op, modes] = this.readOp()
    switch (op) {
      case 1: {
        let [a, b, out] = programValues(this.tape, this.index, modes)
        this.tape[out] = a + b
        this.index += 4
        break
      }
      case 2: {
        let [a, b, out] = programValues(this.tape, this.index, modes)
        this.tape[out] = a * b
        this.index += 4
        break
      }
      case 3: {
        let input = this.nextInput()
        let address = this.tape[this.index + 1]
        this.tape[address] = input
        this.index += 2
        break
      }
      case 4: {
        this.outputs.push(readTape(this.tape, this.index + 1, modes[0]))
        this.index += 2
        break
      }
      case 5: {
        let param = readTape(this.tape, this.index + 1, modes[0])
        if (param !== 0) {
          this.index = readTape(this.tape, this.index + 2, modes[1])
        } else {
          this.index += 3
        }
        break
      }
      case 6: {
        let param = readTape(this.tape, this.index + 1, modes[0])
        if (param === 0) {
          this.index = readTape(this.tape, this.index + 2, modes[1])
        } else {
          this.index += 3
        }
        break
      }
      case 7: {
        let [first, second, third] = programValues(this.tape, this.index, modes)
        this.tape[third] = first < second ? 1 : 0
        this.index += 4
        break
      }
      case 8: {
        let [first, second, third] = programValues(this.tape, this.index, modes)
        this.tape[third] = first === second ? 1 : 0
        this.index += 4
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

  return [p.tape, p.outputs]
}

const program = instructions => {
  let [tape, _] = programWithOutputs(instructions)
  return tape
}

module.exports = { program, programWithOutputs, Program }

const programValues = (tape, index, modes = []) => [
  readTape(tape, index + 1, modes[0]),
  readTape(tape, index + 2, modes[1]),
  tape[index + 3]
]

const readTape = (tape, index, mode = 0) => {
  switch (mode) {
    case 0:
      return tape[tape[index]]
    case 1:
      return tape[index]
  }
}

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
