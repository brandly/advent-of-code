const fs = require('fs')
const assert = require('assert')
const { range, sum, min, every } = require('lodash')
const file = fs.readFileSync('2021/12.txt', 'utf-8').trim()

const parse = (input) => input.split('\n').map((line) => line.split('-'))

const getEdgeMap = (edges) =>
  edges.reduce((map, [a, b]) => {
    const insert = (key, val) => {
      if (key in map) {
        map[key].push(val)
      } else {
        map[key] = [val]
      }
    }
    insert(a, b)
    insert(b, a)
    return map
  }, {})

const isUpperCase = (char) => char.toUpperCase() === char

const explore = (edgeMap, path = [], location = 'start', visited = {}) => {
  if (location === 'end') {
    return [[...path, location]]
  }
  const options = edgeMap[location].filter(
    (option) => isUpperCase(option) || !(option in visited)
  )
  return options.flatMap((option) =>
    explore(edgeMap, [...path, location], option, {
      ...visited,
      [location]: true,
    })
  )
}

const part1 = (input) => {
  const edges = parse(input)
  const edgeMap = getEdgeMap(edges)
  return explore(edgeMap).length
}

const explore2 = (edgeMap, path = [], location = 'start', visited = {}) => {
  const path_ = [...path, location]
  const visited_ = {
    ...visited,
    [location]: (visited[location] || 0) + 1,
  }

  if (location === 'end') {
    return [path_]
  }

  const hasVisitedSmallCaveTwice = !!Object.entries(visited_).find(
    ([key, val]) => key !== 'start' && !isUpperCase(key) && val === 2
  )

  const options = edgeMap[location].filter(
    (option) =>
      option !== 'start' &&
      (isUpperCase(option) ||
        !(option in visited) ||
        (!hasVisitedSmallCaveTwice && visited[option] < 2))
  )

  return options.flatMap((option) => explore2(edgeMap, path_, option, visited_))
}

const part2 = (input) => {
  const edges = parse(input)
  const edgeMap = getEdgeMap(edges)
  return explore2(edgeMap).length
}

{
  const small = `start-A\nstart-b\nA-c\nA-b\nb-d\nA-end\nb-end`
  assert.equal(part1(small), 10)
  assert.equal(part2(small), 36)

  const medium = `dc-end\nHN-start\nstart-kj\ndc-start\ndc-HN\nLN-dc\nHN-end\nkj-sa\nkj-HN\nkj-dc`
  assert.equal(part1(medium), 19)
  assert.equal(part2(medium), 103)
}

console.log(part1(file))
console.log(part2(file))
