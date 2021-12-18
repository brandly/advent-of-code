const fs = require('fs')
const assert = require('assert')
const { range, sum, min, every } = require('lodash')
const file = fs.readFileSync('2021/14.txt', 'utf-8').trim()

const createNode = (char) => ({ char })
const fromStr = (str) => {
  const chars = str.split('')
  const head = createNode(chars[0])
  let prev = head
  for (let i = 1; i < chars.length; i++) {
    const node = createNode(chars[i])
    prev.next = node
    prev = node
  }
  return head
}

const parse = (input) => {
  const [template, rules] = input.split('\n\n')
  return {
    template: fromStr(template),
    rules: rules
      .split('\n')
      .map((line) => line.split(' -> '))
      .reduce((out, [key, val]) => {
        out[key] = val
        return out
      }, {}),
  }
}

const step = (chain, rules) => {
  let current = chain
  while (current.next) {
    const { next } = current
    const pair = current.char + next.char

    if (pair in rules) {
      const node = createNode(rules[pair])
      current.next = node
      node.next = next
    }
    current = next
  }
}

const countChain = (chain, result = {}) => {
  const { char } = chain
  if (char in result) result[char]++
  else result[char] = 1
  return chain.next ? countChain(chain.next, result) : result
}

const diffAfterIterations = (input, iterations) => {
  const { template, rules } = parse(input)

  const chain = template
  for (let i = 0; i < iterations; i++) {
    console.log('iterating', i)
    step(chain, rules)
  }

  const sorted = Object.values(countChain(chain)).sort((a, b) => {
    if (a < b) return 1
    if (a > b) return -1
    return 0
  })

  return sorted[0] - sorted[sorted.length - 1]
}
const part1 = (input) => diffAfterIterations(input, 10)
const part2 = (input) => diffAfterIterations(input, 40)

{
  const example = `NNCB\n\nCH -> B\nHH -> N\nCB -> H\nNH -> C\nHB -> C\nHC -> B\nHN -> C\nNN -> C\nBH -> H\nNC -> B\nNB -> B\nBN -> B\nBB -> N\nBC -> B\nCC -> N\nCN -> C`
  assert.equal(part1(example), 1588)
  assert.equal(part2(example), 2188189693529)
}

// console.log(part1(file))
