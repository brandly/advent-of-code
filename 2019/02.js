const fs = require('fs')
const assert = require('assert')

const nums = fs
  .readFileSync(`${__dirname}/02.txt`)
  .toString()
  .trim()
  .split(',')
  .map(n => parseInt(n))

const programWithOutputs = (instructions, inputs = []) => {
  let tape = instructions.slice(0)
  // instruction pointer
  let index = 0
  let outputs = []

  let inputIndex = 0
  const nextInput = () => inputs[inputIndex++]

  while (tape[index] !== 99) {
    let [op, modes] = readOp(tape, index)
    switch (op) {
      case 1: {
        let [a, b, out] = programValues(tape, index, modes)
        tape[out] = a + b
        index += 4
        break
      }
      case 2: {
        let [a, b, out] = programValues(tape, index, modes)
        tape[out] = a * b
        index += 4
        break
      }
      case 3: {
        let input = nextInput()
        let address = tape[index + 1]
        tape[address] = input
        index += 2
        break
      }
      case 4: {
        outputs.push(readTape(tape, index + 1, modes[0]))
        index += 2
        break
      }
      default: {
        throw new Error(`Unexpected value ${tape[index]}`)
      }
    }
  }

  return [tape, outputs]
}

const readOp = (tape, index) => {
  let val = tape[index]
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

const program = instructions => {
  let [tape, _] = programWithOutputs(instructions)
  return tape
}

module.exports = { program, programWithOutputs }

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
