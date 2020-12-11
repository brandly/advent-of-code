const assert = require('assert')
const fs = require('fs')
const { some } = require('lodash')
const file = fs.readFileSync('2020/11.txt', 'utf-8')

const parse = (str) =>
  str
    .trim()
    .split('\n')
    .map((s) => s.split(''))

const show = (layout) => layout.map((line) => line.join('')).join('\n')

const Position = {
  empty: 'L',
  occupied: '#',
  floor: '.',
}

const simulate1 = (layout) => {
  const height = layout.length
  const width = layout[0].length
  const neighbors = (x, y) =>
    [
      [x + 1, y],
      [x + 1, y - 1],
      [x, y - 1],
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ]
      .filter(([x, y]) => x >= 0 && x < width && y >= 0 && y < height)
      .map(([x, y]) => layout[y][x])

  return layout.map((row, y) =>
    row.map((location, x) => {
      if (
        location === Position.empty &&
        !some(neighbors(x, y).map((pos) => pos === Position.occupied))
      ) {
        return Position.occupied
      }
      if (
        location === Position.occupied &&
        neighbors(x, y).filter((pos) => pos === Position.occupied).length >= 4
      ) {
        return Position.empty
      }

      return location
    })
  )
}

const occupiedSeatsAtEquilibrium = (str, simulate) => {
  let layout = parse(str)
  let lastTime = str
  while (true) {
    layout = simulate(layout)
    const shown = show(layout)
    if (shown === lastTime) break
    lastTime = shown
  }
  return lastTime.split('').filter((pos) => pos === Position.occupied).length
}

const part1 = (str) => occupiedSeatsAtEquilibrium(str, simulate1)

console.log(part1(file))

const simulate2 = (layout) => {
  const height = layout.length
  const width = layout[0].length
  const findVisible = ([x, y], step) => {
    const [x_, y_] = step(x, y)
    if (!isValid([x_, y_])) return []
    if (layout[y_][x_] === Position.floor) {
      return findVisible([x_, y_], step)
    } else {
      return [x_, y_]
    }
  }
  const isValid = ([x, y]) => x >= 0 && x < width && y >= 0 && y < height
  const neighbors = (x, y) => {
    const coords = [
      findVisible([x, y], (x, y) => [x + 1, y]),
      findVisible([x, y], (x, y) => [x + 1, y - 1]),
      findVisible([x, y], (x, y) => [x, y - 1]),
      findVisible([x, y], (x, y) => [x - 1, y - 1]),
      findVisible([x, y], (x, y) => [x - 1, y]),
      findVisible([x, y], (x, y) => [x - 1, y + 1]),
      findVisible([x, y], (x, y) => [x, y + 1]),
      findVisible([x, y], (x, y) => [x + 1, y + 1]),
    ]
    return coords.filter(isValid).map(([x, y]) => layout[y][x])
  }

  return layout.map((row, y) =>
    row.map((location, x) => {
      if (
        location === Position.empty &&
        !some(neighbors(x, y).map((pos) => pos === Position.occupied))
      ) {
        return Position.occupied
      }
      if (
        location === Position.occupied &&
        neighbors(x, y).filter((pos) => pos === Position.occupied).length >= 5
      ) {
        return Position.empty
      }

      return location
    })
  )
}

const part2 = (str) => occupiedSeatsAtEquilibrium(str, simulate2)
console.log(part2(file))

{
  const example = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`
  const afterOne = show(simulate1(parse(example)))
  const expectedAfterOne = `#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##`
  assert.equal(afterOne, expectedAfterOne)
  const afterTwo = show(simulate1(parse(expectedAfterOne)))
  const expectedAfterTwo = `#.LL.L#.##
#LLLLLL.L#
L.L.L..L..
#LLL.LL.L#
#.LL.LL.LL
#.LLLL#.##
..L.L.....
#LLLLLLLL#
#.LLLLLL.L
#.#LLLL.##`
  assert.equal(afterTwo, expectedAfterTwo)
  assert.equal(part1(example), 37)
  assert.equal(part2(example), 26)
}
