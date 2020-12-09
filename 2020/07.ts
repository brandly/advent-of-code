const assert = require('assert')
const fs = require('fs')
const file = fs.readFileSync('2020/07.txt', 'utf-8').trim()
const { sum } = require('lodash')

const parse = (str) =>
  str.split('\n').map((line) => {
    const [bag, rawContents] = line.split(' bags contain ')
    let contents
    if (rawContents === 'no other bags.') {
      contents = []
    } else {
      contents = rawContents.split(', ').map((inside) => {
        const splits = inside.split(' ')
        return {
          count: parseInt(splits[0]),
          name: splits.splice(1, splits.length - 2).join(' '),
        }
      })
    }
    return { bag, contents }
  })

const allDestinations = (graph, key, set = new Set()) => {
  if (key in graph) {
    graph[key].forEach((name) => {
      if (!set.has(name)) {
        set.add(name)
        allDestinations(graph, name, set)
      }
    })
  }
  return set
}

const part1 = (str) => {
  const rules = parse(str)

  // from bag to containing bag
  const graph = {}
  rules.forEach(({ bag, contents }) => {
    contents.forEach(({ name }) => {
      if (!(name in graph)) {
        graph[name] = new Set()
      }
      graph[name].add(bag)
    })
  })

  return allDestinations(graph, 'shiny gold').size
}

console.log(part1(file))

type Inside = {
  count: number
  name: string
}

const part2 = (str) => {
  const rules = parse(str)
  const rulesMap: Record<string, Inside[]> = rules.reduce(
    (out, { bag, contents }) => {
      out[bag] = contents
      return out
    },
    {}
  )

  const countBags = (name: string) =>
    name in rulesMap
      ? sum(
          rulesMap[name].map(
            (inside) => inside.count + countBags(inside.name) * inside.count
          )
        )
      : 0

  return countBags('shiny gold')
}

console.log(part2(file))

{
  const example = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`
  assert.equal(part1(example), 4)
  assert.equal(part2(example), 32)
}
