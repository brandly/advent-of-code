const fs = require('fs')
const assert = require('assert')
const { sum } = require('lodash')

const example = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'
const input = fs
  .readFileSync(`${__dirname}/08.txt`)
  .toString()
  .trim()

const parse = input => input.split(' ').map(v => parseInt(v))

class Parser {
  constructor(input) {
    this.input = input
    this.index = 0
  }

  parseNode() {
    const { input } = this

    const kidCount = input[this.index]
    const metaCount = input[this.index + 1]
    this.index += 2

    const children = []
    for (let i = 0; i < kidCount; i++) {
      children.push(this.parseNode())
    }

    const metadata = []
    for (let i = 0; i < metaCount; i++, this.index++) {
      metadata.push(input[this.index])
    }

    return {
      children,
      metadata
    }
  }
}

const walkTree = (node, fn) => {
  fn(node)
  node.children.forEach(n => walkTree(n, fn))
}

const part1 = input => {
  let p = new Parser(parse(input))
  let node = p.parseNode()

  let total = 0
  walkTree(node, ({ metadata }) => {
    metadata.forEach(v => (total += v))
  })

  return total
}

assert.equal(part1(example), 138)
console.log(part1(input))

const score = node => {
  if (node.children.length === 0) {
    return sum(node.metadata)
  } else {
    let kidScores = node.metadata
      .map(meta => node.children[meta - 1])
      .filter(Boolean)
      .map(node => score(node))
    return sum(kidScores)
  }
}

const part2 = input => {
  let p = new Parser(parse(input))
  return score(p.parseNode())
}

assert.equal(part2(example), 66)
console.log(part2(input))
