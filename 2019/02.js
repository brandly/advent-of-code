const fs = require('fs')
const assert = require('assert')

const nums = fs
  .readFileSync(`${__dirname}/02.txt`)
  .toString()
  .trim()
  .split(',')
  .map(n => parseInt(n))

const program = input => {
  let tape = input.slice(0)
  // instruction pointer
  let index = 0

  while (tape[index] !== 99) {
    switch (tape[index]) {
      case 1: {
        let [a, b, out] = programValues(tape, index)
        tape[out] = a + b
        index += 4
        break
      }
      case 2: {
        let [a, b, out] = programValues(tape, index)
        tape[out] = a * b
        index += 4
        break
      }
      default: {
        throw new Error(`Unexpected value ${tape[index]}`)
      }
    }
  }

  return tape
}

const programValues = (tape, index) => [
  tape[tape[index + 1]],
  tape[tape[index + 2]],
  tape[index + 3]
]

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
