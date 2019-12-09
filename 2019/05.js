const fs = require('fs')
const assert = require('assert')
const { sum } = require('lodash')

const { programWithOutputs } = require('./02.js')

const parse = input => input.split(',').map(v => parseInt(v))
const run = (instructions, inputs) =>
  programWithOutputs(parse(instructions), inputs)

{
  const outputsInputs = '3,0,4,0,99'
  for (let i = 0; i < 100; i++) {
    let [_, outputs] = run(outputsInputs, [i])
    assert.equal(outputs[0], i)
  }
}

assert.deepEqual(run('1002,4,3,4,33', [5]), [[1002, 4, 3, 4, 99], []])

const input = fs.readFileSync(`${__dirname}/05.txt`).toString()

const part1 = (instructions, inputs) => {
  let [_, outputs] = run(instructions, inputs)
  return outputs[outputs.length - 1]
}

console.log(part1(input, [1]))

// equal to 8
//   position
assert.equal(part1('3,9,8,9,10,9,4,9,99,-1,8', [8]), 1)
assert.equal(part1('3,9,8,9,10,9,4,9,99,-1,8', [12]), 0)
//   immediate
assert.equal(part1('3,3,1108,-1,8,3,4,3,99', [8]), 1)
assert.equal(part1('3,3,1108,-1,8,3,4,3,99', [12]), 0)

// less than 8
//   position
assert.equal(part1('3,9,7,9,10,9,4,9,99,-1,8', [2]), 1)
assert.equal(part1('3,9,7,9,10,9,4,9,99,-1,8', [12]), 0)
//   immediate
assert.equal(part1('3,3,1107,-1,8,3,4,3,99', [2]), 1)
assert.equal(part1('3,3,1107,-1,8,3,4,3,99', [12]), 0)

// non-zero
//   position
assert.equal(part1('3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', [2]), 1)
assert.equal(part1('3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', [0]), 0)
//   immediate
assert.equal(part1('3,3,1105,-1,9,1101,0,0,12,4,12,99,1', [2]), 1)
assert.equal(part1('3,3,1105,-1,9,1101,0,0,12,4,12,99,1', [0]), 0)

console.log(part1(input, [5]))
