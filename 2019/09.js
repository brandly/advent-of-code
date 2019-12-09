const fs = require('fs')
const assert = require('assert')
const { programWithOutputs, Program } = require('./02.js')

const parse = input => input.split(',').map(n => parseInt(n))

const run = (operations, inputs) =>
  programWithOutputs(operations, inputs).outputs

{
  let p = new Program(parse('109,19,204,-34'))
  p.relativeBase = 2000
  p.step()
  assert.equal(p.relativeBase, 2019)

  const val = 4432
  p.tape[1985] = val
  p.step()
  assert.equal(p.outputs[0], val)
}

assert.equal(
  run(parse('1102,34915192,34915192,7,4,7,99,0')).toString().length,
  16
)

assert.equal(run(parse('104,1125899906842624,99'))[0], 1125899906842624)

{
  const input = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'
  const output = run(parse(input))
  assert.equal(output.join(','), input)
}

const input = fs
  .readFileSync(`${__dirname}/09.txt`)
  .toString()
  .trim()

console.log(run(parse(input), [1])[0])
console.log(run(parse(input), [2])[0])
