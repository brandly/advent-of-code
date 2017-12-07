const fs = require('fs')
const assert = require('assert')

const input = fs.readFileSync('./5.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(n => parseInt(n, 10))

const stepCount = input => {
  let steps = 0
  let index = 0

  while (index >= 0 && index < input.length) {
    // console.log(`(${index}) : ${input.join(', ')}`)
    let current = index
    let offset = input[index]

    index += offset
    if (offset >= 3) {
      input[current] -= 1
    } else {
      input[current] += 1
    }

    steps += 1
  }

  return steps
}

// assert.equal(stepCount([0, 3,  0,  1, -3]), 5)

console.log(stepCount(input))
