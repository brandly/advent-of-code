const fs = require('fs')
const assert = require('assert')
const file = fs.readFileSync('2020/03.txt', 'utf-8')
const parseLines = (str) => str.split('\n').map((line) => line.split(''))

const makeToboggan = (right, down) => (str) => {
  const lines = parseLines(str)
  const width = lines[0].length

  let x = 0
  let trees = 0
  for (let x = 0, y = 0; y < lines.length; y += down, x = (x + right) % width) {
    if (lines[y][x] === '#') {
      trees++
    }
  }
  return trees
}
const part1 = makeToboggan(3, 1)
console.log(part1(file))

const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
]

const part2 = (str) => {
  const trees = slopes.map(([right, down]) => makeToboggan(right, down)(str))
  return trees.reduce((a, b) => a * b, 1)
}
console.log(part2(file))

{
  const example = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`
  assert.equal(part1(example), 7)
  assert.equal(part2(example), 336)
}
