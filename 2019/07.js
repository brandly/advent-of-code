const fs = require('fs')
const assert = require('assert')
const { some, range, sortBy, every } = require('lodash')
const { permutation } = require('js-combinatorics')

const { programWithOutputs, Program } = require('./02.js')
const max = values => Math.max.apply(Math, values)

const operations = fs
  .readFileSync(`${__dirname}/07.txt`)
  .toString()
  .trim()
  .split(',')
  .map(n => parseInt(n))

const run = (operations, inputs) => {
  let [_, outputs] = programWithOutputs(operations, inputs)
  assert(outputs.length === 1)
  return outputs[0]
}

const part1 = operations => {
  const thrusterSignals = permutation(range(0, 5)).map(settings => {
    let lastOutput = 0
    settings.forEach(phaseSetting => {
      lastOutput = run(operations, [phaseSetting, lastOutput])
    })
    return lastOutput
  })
  return max(thrusterSignals)
}

assert.equal(
  part1([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0]),
  43210
)
assert.equal(
  part1(
    [].concat(
      [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23],
      [101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0]
    )
  ),
  54321
)
assert.equal(
  part1(
    [].concat(
      [3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33],
      [1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0]
    )
  ),
  65210
)

console.log(part1(operations))

const part2 = operations => {
  const thrusterSignals = permutation(range(5, 10)).map(settings => {
    const amps = settings.map((phaseSetting, index) => {
      const inputs = index === 0 ? [phaseSetting, 0] : [phaseSetting]
      return new Program(operations, inputs)
    })

    let i = 0
    while (!amps[amps.length - 1].halted()) {
      const advance = () => {
        // consume the output and send it to the next amp
        let outputs = amps[i].outputs
        amps[i].outputs = []
        i = (i + 1) % amps.length
        amps[i].send(outputs)
      }
      try {
        if (amps[i].halted()) {
          advance()
        }
        while (!amps[i].halted()) {
          amps[i].step()
        }
      } catch (e) {
        advance()
      }
    }

    return amps[amps.length - 1].getLastOutput()
  })
  return max(thrusterSignals)
}

assert.equal(
  part2(
    [].concat(
      [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27],
      [4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5]
    )
  ),
  139629729
)

assert.equal(
  part2(
    [].concat(
      [3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5],
      [55, 1005, 55, 26, 1001, 54, -5, 54, 1105, 1, 12, 1, 53, 54, 53],
      [1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4],
      [53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10]
    )
  ),
  18216
)

console.log(part2(operations))
