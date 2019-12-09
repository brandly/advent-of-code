const fs = require('fs')
const rawInput = fs.readFileSync(`${__dirname}/8.txt`, 'utf-8').trim()

// polyfill lol
Object.values = obj => Object.keys(obj).map(key => obj[key])

const parse = str =>
  str.split('\n').map(line => {
    const tokens = line.split(' ')
    return {
      key: tokens[0],
      op: tokens[1],
      amount: parseInt(tokens[2], 10),
      cond: {
        key: tokens[4],
        op: tokens[5],
        amount: parseInt(tokens[6])
      }
    }
  })

const compare = (op, a, b) => {
  switch (op) {
    case '==':
      return a === b
    case '!=':
      return a !== b
    case '>=':
      return a >= b
    case '<=':
      return a <= b
    case '>':
      return a > b
    case '<':
      return a < b
    default:
      throw new Error(`Unexpected op ${op}`)
  }
}

const input = parse(rawInput)
const registers = {}
const get = key => registers[key] || 0
const apply = (op, key, amount) => {
  const val = get(key)
  switch (op) {
    case 'inc':
      registers[key] = val + amount
      break
    case 'dec':
      registers[key] = val - amount
      break
    default:
      throw new Error(`Unexpected apply op ${op}`)
  }
}

const maxes = []
input.forEach(({ key, op, amount, cond }) => {
  if (compare(cond.op, get(cond.key), cond.amount)) {
    apply(op, key, amount)
    maxes.push(Math.max.apply(Math, Object.values(registers)))
  }
})

const part1 = Math.max.apply(Math, Object.values(registers))
const part2 = Math.max.apply(Math, maxes)

console.log({ part1, part2 })
