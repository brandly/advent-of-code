const fs = require('fs')
const assert = require('assert')
const input = fs.readFileSync(`${__dirname}/12.txt`, 'utf-8').trim()

const example = `0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`

const parse = str => {
  str = str.trim()

  return str
    .split('\n')
    .map(line => {
      const [left, right] = line.split(' <-> ')
      return {
        [parseInt(left, 10)]: right.split(',').map(n => parseInt(n, 10))
      }
    })
    .reduce((big, lil) => {
      return Object.assign(big, lil)
    }, {})
}

assert.deepEqual(parse(example), {
  '0': [2],
  '1': [1],
  '2': [0, 3, 4],
  '3': [2, 4],
  '4': [2, 3, 6],
  '5': [6],
  '6': [4, 5]
})

const fillSets = programs => {
  const result = {}

  const pipe = (a, b) => {
    if (!result[a]) result[a] = new Set()
    if (!result[b]) result[b] = new Set()
    result[a].add(b)
    result[b].add(a)
  }

  Object.keys(programs).forEach(id => {
    programs[id].forEach(otherId => {
      pipe(
        id,
        otherId
      )
    })
  })

  return result
}

const part1 = input => {
  const programs = fillSets(parse(input))

  const hits = {}
  const mark = _id => {
    programs[_id].forEach(id => {
      const hasSeen = hits[id] || false
      hits[id] = true
      if (!hasSeen) mark(id)
    })
  }

  mark(0)
  return Object.keys(hits).length
}

assert.equal(part1(example), 6)
console.log(part1(input))

const part2 = input => {
  const programs = fillSets(parse(input))

  const getGroup = id => {
    const hits = {}
    const mark = _id => {
      programs[_id].forEach(id => {
        const hasSeen = hits[id] || false
        hits[id] = true
        if (!hasSeen) mark(id)
      })
    }
    mark(id)
    return Object.keys(hits)
  }

  let count = 0
  while (Object.keys(programs).length) {
    const group = getGroup(Object.keys(programs)[0])
    count++
    group.forEach(id => {
      delete programs[id]
    })
  }

  return count
}

assert.equal(part2(example), 2)

console.log(part2(input))
