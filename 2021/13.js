const fs = require('fs')
const assert = require('assert')
const { range, sum, min, every } = require('lodash')
const file = fs.readFileSync('2021/13.txt', 'utf-8').trim()

const parse = (input) => {
  const [dots, folds] = input.split('\n\n')
  return {
    dots: dots.split('\n').map((row) => {
      const [x, y] = row.split(',').map((n) => parseInt(n))
      return { x, y }
    }),
    folds: folds.split('\n').map((row) => {
      const [axis, n] = row.slice('fold along '.length).split('=')
      return {
        [axis]: parseInt(n),
      }
    }),
  }
}

const applyFold = (dots, fold) => {
  const key = 'y' in fold ? 'y' : 'x'
  const val = fold[key]
  return dots.map((dot) => {
    const distance = dot[key] - val
    return dot[key] < val ? dot : { ...dot, [key]: val - distance }
  })
}

const encode = ({ x, y }) => `${x},${y}`

const part1 = (input) => {
  let { dots, folds } = parse(input)
  return new Set(applyFold(dots, folds[0]).map(encode)).size
}

const part2 = (input) => {
  let { dots, folds } = parse(input)
  dots = folds.reduce(applyFold, dots)

  const thermal = range(0, 6).map(() => range(0, 40).map(() => ' '))
  dots.forEach(({ x, y }) => {
    thermal[y][x] = '#'
  })
  return thermal.map((row) => row.join('')).join('\n')
}

{
  const example = `6,10\n0,14\n9,10\n0,3\n10,4\n4,11\n6,0\n6,12\n4,1\n0,13\n10,12\n3,4\n3,0\n8,4\n1,10\n2,14\n8,10\n9,0\n\nfold along y=7\nfold along x=5`
  assert.equal(part1(example), 17)
}

console.log(part1(file))
console.log(part2(file))
