const fs = require('fs')
const assert = require('assert')
const file = fs.readFileSync('2022/06.txt', 'utf-8')

const marker = (input, distinct) => {
  const chars = []
  for (let i = 0; i < input.length; i++) {
    chars.push(input[i])
    if (chars.length > distinct) chars.shift()
    if (new Set(chars).size === distinct) return i + 1
  }
}

const part1 = (input) => marker(input, 4)

assert.equal(part1('mjqjpqmgbljsphdztnvjfqwrcgsmlb'), 7)
assert.equal(part1('bvwbjplbgvbhsrlpgdmjqwftvncz'), 5)
assert.equal(part1('nppdvjthqldpwncqszvftbrmjlhg'), 6)
assert.equal(part1('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'), 10)
assert.equal(part1('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'), 11)
console.log(part1(file))

const part2 = (input) => marker(input, 14)
console.log(part2(file))
