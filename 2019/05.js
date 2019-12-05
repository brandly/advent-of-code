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

const part1 = input => {
  let [_, outputs] = run(input, [1])
  return outputs[outputs.length - 1]
}

console.log(part1(input))
