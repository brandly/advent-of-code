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

const part2 = input => {
  const offset = parseInt(input.slice(0, 7))
  input = range(0, 10000)
    .map(() => input)
    .join('')
  input = input.slice(offset)
  let signal = parse(input)
  // numbers are only dependent on themselves and every number after them.
  // the offset is large enough that the pattern is just a bunch of 1s.
  // each number is the sum of itself and the numbers after it.
  for (let phase = 0; phase < 100; phase++) {
    const sums = []
    sums[signal.length - 1] = signal[signal.length - 1]
    for (let i = signal.length - 2; i >= 0; i--) {
      sums[i] = sums[i + 1] + signal[i]
    }
    signal = signal.map((_, i) => Math.abs(sums[i]) % 10)
  }
  return signal.join('').slice(0, 8)
}

console.log(part2(input))
