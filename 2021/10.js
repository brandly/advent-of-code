const fs = require('fs')
const assert = require('assert')
const { range, sum, min, every } = require('lodash')
const file = fs.readFileSync('2021/10.txt', 'utf-8').trim()

const parse = (file) => file.split('\n')

class InvalidClose extends Error {
  constructor(message, character) {
    super(message)
    this.character = character
  }
}

const expected = (opening) => {
  switch (opening) {
    case '(':
      return ')'
    case '{':
      return '}'
    case '[':
      return ']'
    case '<':
      return '>'
    default:
      throw new Error(`Unexpected opening "${opening}""`)
  }
}
const openingSet = new Set('({[<'.split(''))
const isOpening = (char) => openingSet.has(char)

const validateNavigation = (line) => {
  const stack = []
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (isOpening(char)) {
      stack.push(char)
    } else {
      const opening = stack.pop()
      if (expected(opening) !== char) {
        throw new InvalidClose(`Unexpected "${char}"`, char)
      }
    }
  }

  return stack.reverse().map(expected)
}

const table = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const part1 = (input) => {
  const lines = parse(input)
  let score = 0

  for (let i = 0; i < lines.length; i++) {
    try {
      validateNavigation(lines[i])
    } catch (e) {
      if (e instanceof InvalidClose) {
        score += table[e.character]
      }
    }
  }

  return score
}

const points = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}
const scoreClosing = (closing) => {
  let score = 0
  for (let i = 0; i < closing.length; i++) {
    const char = closing[i]
    score *= 5
    score += points[char]
  }
  return score
}

const part2 = (input) => {
  const lines = parse(input)
  const scores = []

  for (let i = 0; i < lines.length; i++) {
    try {
      const closingChars = validateNavigation(lines[i])
      scores.push(scoreClosing(closingChars))
    } catch (e) {
      if (e instanceof InvalidClose) {
        // ignore
      }
    }
  }

  const sorted = scores.sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

{
  const example =
    '[({(<(())[]>[[{[]{<()<>>\n[(()[<>])]({[<{<<[]>>(\n{([(<{}[<>[]}>{[]{[(<()>\n(((({<>}<{<{<>}{[]{[]{}\n[[<[([]))<([[{}[[()]]]\n[{[{({}]{}}([{[{{{}}([]\n{<[[]]>}<{[{[{[]{()[[[]\n[<(<(<(<{}))><([]([]()\n<{([([[(<>()){}]>(<<{{\n<{([{{}}[<[[[<>{}]]]>[]]'
  assert.equal(part1(example), 26397)
  assert.equal(part2(example), 288957)
}

console.log(part1(file))
console.log(part2(file))
