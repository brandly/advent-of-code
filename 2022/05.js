const fs = require('fs')
const { sum, range } = require('lodash')
const assert = require('assert')
const file = fs.readFileSync('2022/05.txt', 'utf-8')

// taken from 03.js
const groupBy4 = (accum, elf) => {
  const last = accum[accum.length - 1]
  if (last && last.length < 4) {
    last.push(elf)
  } else {
    accum.push([elf])
  }
  return accum
}

const example = `    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`

const moveLine = /move (\d+) from (\d+) to (\d+)/
const parse = (input) => {
  const [initialStr, movesStr] = input.split('\n\n')

  const initialSplits = initialStr
    .split('\n')
    .map((line) => line.split('').reduce(groupBy4, []))

  const initial = initialSplits
    .flatMap((line) => line.map((str, index) => ({ str: str.join(''), index })))
    .filter(({ str }) => str[0] === '[' && str[2] === ']')
    .reverse()
    .reduce((accum, { str, index }) => {
      const id = str[1]
      if (!Array.isArray(accum[index])) accum[index] = []
      accum[index].push(id)
      return accum
    }, [])

  const moves = movesStr
    .trim()
    .split('\n')
    .map((line) => {
      const [_, count, start, destination] = moveLine.exec(line)

      return {
        count: parseInt(count),
        // want 0-index
        start: parseInt(start) - 1,
        destination: parseInt(destination) - 1,
      }
    })

  return {
    initial,
    moves,
  }
}

assert.deepEqual(
  {
    initial: [['Z', 'N'], ['M', 'C', 'D'], ['P']],
    moves: [
      { count: 1, start: 1, destination: 0 },
      { count: 3, start: 0, destination: 2 },
      { count: 2, start: 1, destination: 0 },
      { count: 1, start: 0, destination: 1 },
    ],
  },
  parse(example)
)

const part1 = (input) => {
  const { moves, initial } = parse(input)
  return moves
    .reduce((stacks, { count, start, destination }) => {
      for (; count > 0; count--) {
        const crate = stacks[start].pop()
        stacks[destination].push(crate)
      }
      return stacks
    }, initial)
    .map((stack) => stack[stack.length - 1])
    .join('')
}

assert.equal(part1(example), 'CMZ')
console.log(part1(file))

const draw = (stacks) => {
  const height =
    Math.max.apply(
      Math,
      stacks.map((stack) => stack.length)
    ) - 1

  for (let y = height; y >= 0; y--) {
    console.log(stacks.map((stack) => stack[y] || ' ').join(' '))
  }
}

const part2 = (input) => {
  const { moves, initial } = parse(input)
  return moves
    .reduce((stacks, { count, start, destination }) => {
      const sliceIndex = stacks[start].length - count
      const crates = stacks[start].slice(sliceIndex)

      stacks[start] = stacks[start].slice(0, sliceIndex)
      stacks[destination] = stacks[destination].concat(crates)
      // console.log(draw(stacks))
      return stacks
    }, initial)
    .map((stack) => stack[stack.length - 1])
    .join('')
}
assert.equal(part2(example), 'MCD')
console.log(part2(file))
