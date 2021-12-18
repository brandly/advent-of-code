const fs = require('fs')
const assert = require('assert')
const { range, sum, min, every } = require('lodash')
const file = fs.readFileSync('2021/14.txt', 'utf-8').trim()

const parse = (input) => {
  const [template, rules] = input.split('\n\n')
  return {
    template,
    rules: rules
      .split('\n')
      .map((line) => line.split(' -> '))
      .reduce((out, [key, val]) => {
        out[key] = val
        return out
      }, {}),
  }
}

const addCount = (obj, pair, count = 1) => {
  if (!(pair in obj)) obj[pair] = 0
  obj[pair] += count
  return obj
}

const countElements = (str) =>
  str.split('').reduce((out, char) => addCount(out, char), {})

const countPairs = (str) =>
  str.split('').reduce((out, char, i, list) => {
    if (i === 0) return out
    const key = list[i - 1] + char
    addCount(out, key)
    return out
  }, {})

const diffAfterIterations = (input, iterations) => {
  let { template, rules } = parse(input)

  let elementCount = countElements(template)
  let pairCounts = countPairs(template)

  for (let i = 0; i < iterations; i++) {
    const result = {}
    Object.entries(pairCounts).forEach(([pair, count]) => {
      if (pair in rules) {
        const middleman = rules[pair]
        const [a, b] = pair.split('')

        addCount(elementCount, middleman, count)

        addCount(result, a + middleman, count)
        addCount(result, middleman + b, count)
      } else {
        addCount(result, pair, count)
      }
    })

    pairCounts = result
  }

  const sorted = Object.values(elementCount).sort((a, b) => {
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

console.log(part1(file))
console.log(part2(file))
