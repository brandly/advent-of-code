const assert = require('assert')
const fs = require('fs')
const { sum, max, min } = require('lodash')
const file = fs.readFileSync('2020/09.txt', 'utf-8').trim()

const parse = (str) => str.split('\n').map((n) => parseInt(n))

const part1 = (str, preambleLen = 25) => {
  const numbers = parse(str)
  outer: for (let i = preambleLen; i < numbers.length; i++) {
    for (let j = i - preambleLen; j < i; j++) {
      for (let k = j + 1; k < i; k++) {
        if (numbers[j] + numbers[k] === numbers[i]) {
          continue outer
        }
      }
    }
    return numbers[i]
  }
}

console.log(part1(file))

const part2 = (str, preambleLen = 25) => {
  const numbers = parse(str)
  const goal = part1(str, preambleLen)

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 2; j <= numbers.length; j++) {
      const stretch = numbers.slice(i, j)
      if (sum(stretch) === goal) {
        return min(stretch) + max(stretch)
      }
    }
  }
}

console.log(part2(file))

{
  const example = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`
  assert.equal(part1(example, 5), 127)
  assert.equal(part2(example, 5), 62)
}
