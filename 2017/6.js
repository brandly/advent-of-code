const fs = require('fs')
const assert = require('assert')

const input = fs.readFileSync('./6.txt', 'utf-8')
  .trim()
  .split('\t')
  .map(n => parseInt(n, 10))

const largestIndex = list => {
  let largest = 0
  for (let i = 1; i < list.length; i++) {
    if (list[i] > list[largest]) {
      largest = i
    }
  }
  return largest
}

assert.equal(largestIndex([0, 2, 7, 0]), 2)
assert.equal(largestIndex([0, 2, 2, 0]), 1)

const cycle = list => {
  list = list.slice()

  const i = largestIndex(list)
  let blocks = list[i]

  list[i] = 0
  for (let j = 0; j < blocks; j++) {
    const index = (i + j + 1) % list.length
    list[index] += 1
  }

  return list
}

assert.deepEqual(cycle([0, 2, 7, 0]), [2, 4, 1, 2])
assert.deepEqual(cycle([2, 4, 1, 2]), [3, 1, 2, 3])

const redistributionCount = list => {
  const hash = l => l.join('$')
  const memory = {}
  const add = l => { memory[hash(l)] = true }
  const hasSeen = l => memory[hash(l)] || false
  let count = 0
  while (!hasSeen(list)) {
    add(list)
    list = cycle(list)
    count++
  }
  return count
}

assert.equal(redistributionCount([0, 2, 7, 0]), 5)
console.log(redistributionCount(input))

const sizeOfLoop = list => {
  const hash = l => l.join('$')
  const memory = {}
  const add = (l, i) => { memory[hash(l)] = i }
  const hasSeen = l => memory.hasOwnProperty(hash(l))
  let count = 0
  while (!hasSeen(list)) {
    add(list, count)
    list = cycle(list)
    count++
  }
  return count - memory[hash(list)]
}

assert.equal(sizeOfLoop([0, 2, 7, 0]), 4)
console.log(sizeOfLoop(input))
