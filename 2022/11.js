const fs = require('fs')
const assert = require('assert')
const { sum, identity } = require('lodash')
const file = fs.readFileSync('2022/11.txt', 'utf-8').trim()

const example = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`

const getFn = (op) => {
  switch (op) {
    case '*':
      return (a, b) => a * b
    case '+':
      return (a, b) => a + b
    default:
      throw Error(`Unexpected op "${op}"`)
  }
}

const getOperation = (str) => {
  const [a, op, b] = str.split(' ')
  const bigA = a === 'old' ? undefined : parseInt(a)
  const bigB = b === 'old' ? undefined : parseInt(b)
  const fn = getFn(op)

  return (old) => fn(bigA ?? old, bigB ?? old)
}

const parse = (input) =>
  input.split('\n\n').map((monkey) => {
    const lines = monkey.split('\n').map((line) => line.trim())
    assert(lines[0].startsWith('Monkey '))

    const ifTrue = parseInt(lines[4].split('If true: throw to monkey ')[1])
    const ifFalse = parseInt(lines[5].split('If false: throw to monkey ')[1])
    return {
      items: lines[1]
        .split('Starting items: ')[1]
        .split(', ')
        .map((n) => parseInt(n)),

      operation: getOperation(lines[2].split('Operation: new = ')[1]),
      divisibleBy: parseInt(lines[3].split('Test: divisible by ')[1]),
      ifTrue,
      ifFalse,
      inspectionCount: 0,
    }
  })

const verbose = (...args) => {
  // console.log.apply(console, args)
}

const summary = (monkeys) => {
  console.log(
    monkeys
      .map(({ items }, i) => `Monkey ${i}: ${items.join(', ')}`)
      .join('\n') + '\n'
  )
}

function lcm(numbers) {
  const smallest = [...numbers].sort((a, b) => a - b)[0]
  let result = smallest
  let found = false

  while (!found) {
    found = numbers.every((number) => result % number === 0)

    if (!found) {
      result += smallest
    }
  }

  return result
}

const simulate = (monkeys, rounds, calming) => {
  const inspections = monkeys.map(() => 0)
  const factor = lcm(monkeys.map((m) => m.divisibleBy))

  for (let round = 0; round < rounds; round++) {
    monkeys.forEach((monkey, i) => {
      verbose(`Monkey ${i}`)
      monkey.items.forEach((item) => {
        verbose(`  Monkey inspects an item with a worry level of ${item}.`)
        inspections[i]++
        item = monkey.operation(item)
        verbose(`    Worry level is now ${item}`)
        item = calming(item)
        verbose(
          `    Monkey gets bored with item. Worry level is divided by 3 to ${item}.`
        )
        const result = item % monkey.divisibleBy === 0
        verbose(
          `    Current worry level is ${result ? '' : 'not '}divisible by ${
            monkey.divisibleBy
          }.`
        )
        const destination = result ? monkey.ifTrue : monkey.ifFalse
        verbose(
          `    Item with worry level ${item} is thrown to monkey ${destination}.`
        )

        monkeys[destination].items.push(item % factor)
      })
      // threw them all
      monkey.items = []
    })

    // summary(monkeys)
  }
  const [one, two] = inspections.sort((a, b) => b - a)
  return one * two
}

const part1 = (input) => {
  let monkeys = parse(input)
  return simulate(monkeys, 20, (n) => Math.floor(n / 3))
}

const part2 = (input) => {
  let monkeys = parse(input)
  return simulate(monkeys, 10_000, identity)
}

assert.equal(part1(example), 10605)
console.log(part1(file))

assert.equal(part2(example), 2713310158)
console.log(part2(file))
