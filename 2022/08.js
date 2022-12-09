const fs = require('fs')
const assert = require('assert')
const { range, every, identity } = require('lodash')
const file = fs.readFileSync('2022/08.txt', 'utf-8').trim()

const example = `30373
25512
65332
33549
35390`

const parse = (input) =>
  input.split('\n').map((line, y) => line.split('').map((n) => parseInt(n)))

const part1 = (input) => {
  const trees = parse(input)

  return trees
    .map((row, y) =>
      row.map(
        (tree, x) =>
          // from left
          every(range(0, x).map((x_) => trees[y][x_] < tree)) ||
          // from right
          every(range(row.length - 1, x).map((x_) => trees[y][x_] < tree)) ||
          // from top
          every(range(0, y).map((y_) => trees[y_][x] < tree)) ||
          // from bottom
          every(range(trees.length - 1, y).map((y_) => trees[y_][x] < tree)) ||
          false
      )
    )
    .flatMap(identity)
    .filter(Boolean).length
}

const view = (trees) => {
  let count = 0
  for (let i = 0; i < trees.length; i++) {
    if (trees[i]) count++
    if (!trees[i]) {
      count++ // we can see this tree
      break
    }
  }
  return count
}

const part2 = (input) => {
  const trees = parse(input)

  return trees
    .map((row, y) =>
      row.map((tree, x) => {
        const left = range(0, x)
          .map((x_) => trees[y][x_] < tree)
          .reverse()
        const right = range(row.length - 1, x)
          .map((x_) => trees[y][x_] < tree)
          .reverse()
        const up = range(0, y)
          .map((y_) => trees[y_][x] < tree)
          .reverse()
        const down = range(trees.length - 1, y)
          .map((y_) => trees[y_][x] < tree)
          .reverse()

        return [left, right, up, down].map(view).reduce((a, b) => a * b, 1)
      })
    )
    .flatMap(identity)
    .sort((a, b) => b - a)[0]
}

assert.equal(part1(example), 21)
console.log(part1(file))

assert.equal(part2(example), 8)
console.log(part2(file))
