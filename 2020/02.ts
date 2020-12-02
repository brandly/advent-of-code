const fs = require('fs')
const assert = require('assert')

const file = fs.readFileSync('2020/02.txt', 'utf-8')

type Line = {
  password: string
  policy: Policy
}

const parse = (str) => {
  const lines: string[] = str.trim().split('\n')
  return lines.map((line) => {
    const [policy, password] = line.split(': ')
    return {
      password,
      policy: parsePolicy(policy),
    }
  })
}

type Policy = {
  letter: string
  min: number
  max: number
}

const parsePolicy = (str: string): Policy => {
  const [range, letter] = str.split(' ')
  assert(letter.length === 1)
  const [min, max] = range.split('-').map((n) => parseInt(n))
  return { letter, min, max }
}

const validate = ({ password, policy }: Line) => {
  const matches = password
    .split('')
    .filter((letter) => letter === policy.letter)
  return matches.length >= policy.min && matches.length <= policy.max
}

const part1 = (str) => {
  const list = parse(str)
  return list.filter(validate).length
}

console.log(part1(file))

const validate2 = ({ password, policy }: Line) => {
  const positions = [password[policy.min - 1], password[policy.max - 1]]
  return positions.filter((p) => p === policy.letter).length === 1
}

const part2 = (str) => {
  const list = parse(str)
  return list.filter(validate2).length
}

console.log(part2(file))

{
  const example = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`

  assert.deepEqual(parse(example), [
    {
      password: 'abcde',
      policy: { letter: 'a', min: 1, max: 3 },
    },
    {
      password: 'cdefg',
      policy: { letter: 'b', min: 1, max: 3 },
    },
    {
      password: 'ccccccccc',
      policy: { letter: 'c', min: 2, max: 9 },
    },
  ])

  assert.equal(part1(example), 2)
  assert.equal(part2(example), 1)
}
