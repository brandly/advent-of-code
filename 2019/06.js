const fs = require('fs')
const assert = require('assert')
const { sum, some } = require('lodash')

const example = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`

const parse = input => input.split('\n').map(line => line.split(')'))
const createNode = name => ({ name, children: [] })

const expandTree = (node, map) => {
  if (node.name in map) {
    node.children = map[node.name].map(createNode)
    node.children.forEach(kid => {
      expandTree(kid, map)
    })
  }
}

const buildTree = input => {
  const orbits = parse(input)

  const map = {}
  orbits.forEach(([a, b]) => {
    if (!(a in map)) {
      map[a] = []
    }
    map[a].push(b)
  })

  const root = createNode('COM')
  expandTree(root, map)

  return root
}

const countOrbits = (tree, depth = 0) =>
  depth + sum(tree.children.map(kid => countOrbits(kid, depth + 1)))

assert.equal(countOrbits(buildTree(example)), 42)

const input = fs
  .readFileSync(`${__dirname}/06.txt`)
  .toString()
  .trim()

console.log(countOrbits(buildTree(input)))

const distanceFromRoot = (root, node, depth = 0) => {
  if (root.name === node.name) {
    return depth
  } else if (root.children.length === 0) {
    return null
  } else {
    let inKids = root.children
      .map(kid => distanceFromRoot(kid, node, depth + 1))
      .filter(Boolean)
    return inKids.length ? inKids[0] : null
  }
}

const isInTree = (root, name) =>
  root.name === name || some(root.children, kid => isInTree(kid, name))

const distanceBetween = (root, a, b) => {
  const aMatch = root.children.find(kid => isInTree(kid, a.name))
  const bMatch = root.children.find(kid => isInTree(kid, b.name))

  if (aMatch === bMatch) {
    return distanceBetween(aMatch, a, b)
  } else {
    return distanceFromRoot(root, a) + distanceFromRoot(root, b)
  }
}

{
  const root = buildTree(example)
  assert.equal(distanceFromRoot(root, createNode('K')), 6)
  assert(isInTree(root, 'C'))
  assert(!isInTree(root, 'Z'))

  assert.equal(distanceBetween(root, createNode('I'), createNode('K')), 4)
}

const part2 = input => {
  const orbits = parse(input)
  const root = buildTree(input)

  const youOrbit = orbits.find(([_, moon]) => moon === 'YOU')[0]
  const sanOrbit = orbits.find(([_, moon]) => moon === 'SAN')[0]

  return distanceBetween(root, createNode(youOrbit), createNode(sanOrbit))
}

console.log(part2(input))
