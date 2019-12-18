const assert = require('assert')
const fs = require('fs')
const { zip } = require('lodash')

const parse = input => input.split('').map(v => parseInt(v))

const basePattern = [0, 1, 0, -1]
const phase = nums =>
  // output is same length as input
  nums.map((_, i) => {
    const pattern = forIndex(basePattern, i, nums.length)
    const sum = zip(nums, pattern)
      .map(([n, p]) => n * p)
      .reduce((a, b) => a + b, 0)
    return Math.abs(sum) % 10
  })

const forIndex = (pattern, index, len) => {
  let output = repeat(pattern, index + 1).slice(1)
  while (output.length < len) {
    output = output.concat(repeat(pattern, index + 1))
  }
  return output.slice(0, len)
}

const repeat = (list, times) =>
  list.flatMap(n => {
    let out = []
    for (let i = 0; i < times; i++) {
      out.push(n)
    }
    return out
  })

assert.deepEqual(repeat([1, 2, 3], 2), [1, 1, 2, 2, 3, 3])
assert.deepEqual(forIndex([1, 2, 3, 4], 0, 4), [2, 3, 4, 1])
assert.deepEqual(forIndex([1, 2, 3, 4], 0, 8), [2, 3, 4, 1, 2, 3, 4, 1])
assert.deepEqual(forIndex([1, 2, 3, 4], 0, 6), [2, 3, 4, 1, 2, 3])
assert.deepEqual(forIndex([0, 1, 2, 3], 1, 8), [0, 1, 1, 2, 2, 3, 3, 0])
assert.deepEqual(forIndex([0, 1, 2, 3], 2, 6), [0, 0, 1, 1, 1, 2])
{
  const example = '12345678'
  let signal = parse(example)

  signal = phase(signal)
  assert.deepEqual(signal, parse('48226158'))

  signal = phase(signal)
  assert.deepEqual(signal, parse('34040438'))

  signal = phase(signal)
  assert.deepEqual(signal, parse('03415518'))

  signal = phase(signal)
  assert.deepEqual(signal, parse('01029498'))
}

const part1 = input => {
  let signal = parse(input)
  for (let i = 0; i < 100; i++) {
    signal = phase(signal)
  }
  return signal.join('').slice(0, 8)
}

assert.deepEqual(part1('80871224585914546619083218645595'), '24176176')
assert.deepEqual(part1('19617804207202209144916044189917'), '73745418')
assert.deepEqual(part1('69317163492948606335995924319873'), '52432133')

const input = fs.readFileSync(`${__dirname}/16.txt`, 'utf-8').trim()
console.log(part1(input))
