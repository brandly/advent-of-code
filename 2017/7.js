const fs = require('fs')
const assert = require('assert')
const { memoize, groupBy } = require('lodash')
const input = fs.readFileSync('./7.txt', 'utf-8')
  .trim()

const parse = str => {
  // Node {
  //   id :: string
  //   weight :: number
  //   kids :: [id]
  // }
  const lines = str.split('\n')
  const nodes = lines.map(line => {
    const [idAndWeight, potentialKids] = line.split(' -> ')
    const kids = potentialKids ? potentialKids.split(', ') : []
    const [id, almostWeight] = idAndWeight.slice(0, idAndWeight.length - 1).split(' (')

    return {
      id,
      kids,
      weight: parseInt(almostWeight, 10)
    }
  })
  return nodes
}

const example = parse(`pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`)

const findBottom = nodes => {
  const allKids = nodes.reduce((s, n) => s.concat(n.kids), [])
  const isKid = node => allKids.includes(node.id)
  return nodes.find(n => !isKid(n))
}

assert.equal(findBottom(example).id, 'tknk')

const parsedInput = parse(input)
console.log(findBottom(parsedInput).id)

const idealWeight = nodes => {
  const getNodeById = memoize(id => nodes.find(n => n.id === id))
  const weightOfId = id => getNodeById(id).weight

  const bottom = findBottom(nodes)
  const { kids } = bottom

  const weightOfTower = t =>
    t.weight + t.kids.reduce((weight, id) => {
      return weight + weightOfTower(getNodeById(id))
    }, 0)

  const findProblem = (t, parent) => {
    const towerWeights = t.kids.map(id =>
      ({ weight: weightOfTower(getNodeById(id)), tower: getNodeById(id) })
    )
    const grouped = groupBy(towerWeights, 'weight')

    if (Object.keys(grouped).length === 1) {
      return {
        problem: t,
        parent
      }
    } else {
      const weight = Object.keys(grouped).find(key => grouped[key].length === 1)
      return findProblem(grouped[weight][0].tower, t)
    }
  }

  const { problem, parent } = findProblem(bottom)
  const weights = parent.kids.map(id => weightOfTower(getNodeById(id)))
  const grouped = groupBy(weights)
  const desired = parseInt(Object.keys(groupBy(weights)).find(key => grouped[key].length !== 1), 10)
  const real = parseInt(Object.keys(groupBy(weights)).find(key => grouped[key].length === 1), 10)
  return problem.weight - (real - desired)
}

assert.equal(idealWeight(example), 60)
console.log(idealWeight(parsedInput))
