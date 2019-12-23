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
      let sum = 0
      for (let j = i; j < nums.length; j++) {
        const repeaterLen = 4 * (i + 1)
        const repeaterIndex = (j + 1) % repeaterLen
        const baseIndex = repeaterIndex / (i + 1)
        if (baseIndex < 1) {
          // 0
          continue
        } else if (baseIndex < 2) {
          // 1
          sum += nums[j]
        } else if (baseIndex < 3) {
          // 0
          continue
        } else {
          // -1
          sum -= nums[j]
        }
      }
      return Math.abs(sum) % 10
    }
  })

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
