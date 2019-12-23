const assert = require('assert')
const fs = require('fs')
const { zip, range } = require('lodash')

const parse = input => input.split('').map(v => parseInt(v))

const phase = nums =>
  // output is same length as input
  nums.map((_, i) => {
    // just 1s after this point, add up the nums
    if (i + (i + 1) * 2 >= nums.length) {
      const sum = nums.slice(i, i + i + 1).reduce((a, b) => a + b, 0)
      return Math.abs(sum) % 10
    } else {
      const pattern = forIndex(i, nums.length)
      let sum = 0
      for (let j = i; j < nums.length; j++) {
        sum += nums[j] * pattern[j]
      }
      return Math.abs(sum) % 10
    }
  })

const memoize = fn => {
  const brain = {}
  const encode = (a, b) => `${a},${b}`

  return (a, b) => {
    const key = encode(a, b)
    if (key in brain) {
      return brain[key]
    }
    const result = fn(a, b)
    brain[key] = result
    return result
  }
}

const basePattern = [0, 1, 0, -1]
const forIndex = memoize((index, len) => {
  let base = repeat(basePattern, index + 1)
  let output = []
  for (let i = 1; output.length < len; i = (i + 1) % base.length) {
    output.push(base[i])
  }
  return output
})

const repeat = (list, times) =>
  list.flatMap(n => {
    let out = []
    for (let i = 0; i < times; i++) {
      out.push(n)
    }
    return out
  })

assert.deepEqual(repeat([1, 2, 3], 2), [1, 1, 2, 2, 3, 3])

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
