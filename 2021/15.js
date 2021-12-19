const fs = require('fs')
const assert = require('assert')
const { range, sum, min, every, minBy } = require('lodash')
const file = fs.readFileSync('2021/15.txt', 'utf-8').trim()

const parse = (input) =>
  input.split('\n').map((line, y) =>
    line.split('').map((cost, x) => ({
      coords: { x, y },
      visited: false,
      cost: parseInt(cost),
      min: Infinity,
    }))
  )

const part1 = (input) => {
  const cave = parse(input)

  const getUnvisitedNeighbors = ({ x, y }) =>
    [
      { x, y: y - 1 },
      { x, y: y + 1 },
      { x: x + 1, y },
      { x: x - 1, y },
    ]
      .filter(
        ({ x, y }) => cave[y] && cave[y][x] && cave[y][x].visited === false
      )
      .map(({ x, y }) => cave[y][x])

  const maxY = cave.length - 1
  const maxX = cave[0].length - 1

  // dijkstra
  let current = cave[0][0]
  current.min = 0
  while (current) {
    const neighbors = getUnvisitedNeighbors(current.coords)
    neighbors.forEach((node) => {
      node.min = Math.min(node.min, current.min + node.cost)
    })
    current.visited = true
    if (current.coords.x === maxX && current.coords.y === maxY) {
      console.log('break!')
      break
    }
    current = minBy(
      cave.flatMap((n) => n).filter(({ visited }) => visited === false),
      ({ min }) => min
    )
  }

  return cave[maxY][maxX].min
}

{
  const example =
    '1163751742\n1381373672\n2136511328\n3694931569\n7463417111\n1319128137\n1359912421\n3125421639\n1293138521\n2311944581'
  assert.equal(part1(example), 40)
}
console.log(part1(file))
