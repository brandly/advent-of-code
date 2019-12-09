const fs = require('fs')
const assert = require('assert')
const input = fs.readFileSync(`${__dirname}/9.txt`, 'utf-8')

class Parser {
  constructor(input) {
    this._input = input.trim()
    this._tokens = []
    this._index = 0
    this._garbageCount = 0
  }

  countGarbage() {
    this.ast()
    return this._garbageCount
  }

  ast() {
    if (this._tokens.length) return this._tokens

    while (this._index < this._input.length) {
      this._tokens.push(this._parseToken(1))
    }

    // EOF?
    return this._tokens.filter(Boolean)
  }

  _parseToken(score) {
    const char = this._consume()

    switch (char) {
      case '<':
        return this._parseGarbage()
        break
      case '{':
        return this._parseGroup(score)
        break
      default:
        throw new Error(`Unexecter char ${char}`)
    }
  }

  _parseGroup(score) {
    const kids = []

    while (this._peek() !== '}') {
      switch (this._peek()) {
        case '<':
        case '{':
          kids.push(this._parseToken(score + 1))
          break
        case ',':
          this._consume()
          break
        default:
          throw new Error(`Unexecter char ${this._peek()}`)
      }
    }

    // '}'
    this._consume()

    return {
      score,
      kids: kids.filter(Boolean)
    }
  }

  _peek() {
    return this._input[this._index]
  }

  _consume() {
    const char = this._input[this._index]
    this._index += 1
    return char
  }

  _parseGarbage() {
    let char = this._consume()
    let ignore = false
    while (char) {
      if (ignore) {
        ignore = false
      } else {
        switch (char) {
          case '!':
            ignore = true
            break
          case '>':
            return
          default:
            this._garbageCount += 1
            break
        }
      }
      char = this._consume()
    }
  }
}

assert.deepEqual(new Parser('<>').ast(), [])
assert.deepEqual(new Parser('<random characters>').ast(), [])
assert.deepEqual(new Parser('<<<<>').ast(), [])
assert.deepEqual(new Parser('<{!>}>').ast(), [])
assert.deepEqual(new Parser('<!!>').ast(), [])
assert.deepEqual(new Parser('<!!!>>').ast(), [])
assert.deepEqual(new Parser('<{o"i!a,<{i<a>').ast(), [])

const nested = new Parser('{{{}}}').ast()
assert.deepEqual(nested, [
  {
    score: 1,
    kids: [{ score: 2, kids: [{ score: 3, kids: [] }] }]
  }
])

const totalScore = ast =>
  ast.reduce((total, group) => {
    return total + group.score + totalScore(group.kids)
  }, 0)

assert.equal(totalScore(nested), 6)

const parser = new Parser(input)
console.log({
  part1: totalScore(parser.ast()),
  part2: parser.countGarbage()
})
