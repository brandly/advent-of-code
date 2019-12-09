const fs = require('fs')
const assert = require('assert')
const { minBy } = require('lodash')

const nums = fs
  .readFileSync(`${__dirname}/08.txt`)
  .toString()
  .trim()

const parse = input => input.split('').map(n => parseInt(n))

const width = 25
const height = 6

const groupIntoLength = (nums, len) => {
  const help = (remaining, out) => {
    if (remaining.length) {
      return help(remaining.slice(len), out.concat([remaining.slice(0, len)]))
    } else {
      return out
    }
  }

  return help(nums, [])
}

const parseImage = (nums, width, height) => {
  const rows = groupIntoLength(nums, width)
  return groupIntoLength(rows, height)
}

const layerFewest = (layers, fn) => {
  const measured = layers.map(layer => ({ layer, measure: fn(layer) }))
  return minBy(measured, 'measure').layer
}

const count = (layer, fn) => [].concat.apply([], layer).filter(fn).length

const part1 = nums => {
  const fewest = layerFewest(parseImage(parse(nums), 25, 6), layer =>
    count(layer, val => val === 0)
  )

  return count(fewest, val => val === 1) * count(fewest, val => val === 2)
}

console.log(part1(nums))

const pixels = layers => {
  const top = layers[0]

  return top.map((row, y) =>
    row.map((_, x) => layers.map(layer => layer[y][x]))
  )
}

const part2 = (nums, width, height) => {
  const image = parseImage(parse(nums), width, height)
  const thru = pixels(image).map(row => row.map(p => p.find(v => v !== 2)))
  return thru
    .map(row => row.map(v => (v === 0 ? ' ' : '■')).join(''))
    .join('\n')
}

console.log(part2(nums, width, height))
