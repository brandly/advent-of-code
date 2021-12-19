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

const exploreCave = (cave) => {
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
  let unvisited = {}
  const encode = ({ x, y }) => `${x},${y}`
  while (current) {
    const neighbors = getUnvisitedNeighbors(current.coords)
    neighbors.forEach((node) => {
      node.min = Math.min(node.min, current.min + node.cost)
      if (!node.visited) unvisited[encode(node.coords)] = node
    })
    current.visited = true
    delete unvisited[encode(current.coords)]
    if (current.coords.x === maxX && current.coords.y === maxY) {
      // escaped the cave!
      break
    }
    current = minBy(Object.values(unvisited), ({ min }) => min)
    // console.log(
    //   cave
    //     .map((row) =>
    //       row.map((node) => (node.visited ? ' ' : node.cost)).join('')
    //     )
    //     .join('\n')
    // )
  }

  return cave[maxY][maxX].min
}

const part1 = (input) => {
  const cave = parse(input)
  return exploreCave(cave)
}

const cloneCave = (cave) => cave.map((row) => row.map((n) => n))
const higherCost = (cost) => (cost === 9 ? 1 : cost + 1)
const bump = (cost, times) => {
  for (let i = 0; i < times; i++) cost = higherCost(cost)
  return cost
}

const part2 = (input) => {
  const smallCave = parse(input)
  const bigCave = cloneCave(smallCave)

  // 5x height
  for (let i = 1; i < 5; i++) {
    smallCave.forEach((row) => {
      const bigRow = row.map((node, index) => ({
        ...node,
        coords: { ...node.coords, y: bigCave.length },
        cost: bump(node.cost, i),
      }))
      bigCave.push(bigRow)
    })
  }

  // 5x width
  bigCave.forEach((row) => {
    const reference = row.slice()
    for (let i = 1; i < 5; i++) {
      reference.forEach((node) => {
        row.push({
          ...node,
          coords: { ...node.coords, x: row.length },
          cost: bump(node.cost, i),
        })
      })
    }
  })

  return exploreCave(bigCave)
}

{
  const example =
    '1163751742\n1381373672\n2136511328\n3694931569\n7463417111\n1319128137\n1359912421\n3125421639\n1293138521\n2311944581'
  assert.equal(part1(example), 40)
  assert.equal(part2(example), 315)
}
console.log(part1(file))
console.log(part2(file))
