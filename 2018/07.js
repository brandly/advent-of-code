const { sortBy, some } = require('lodash')
const fs = require('fs')
const assert = require('assert')

const example = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`
const input = fs
  .readFileSync(`${__dirname}/07.txt`)
  .toString()
  .trim()

const parse = input => input.split('\n').map(line => [line[5], line[36]])

const buildDependencies = list =>
  list.reduce((store, [a, b]) => {
    if (!(a in store)) {
      store[a] = []
    }
    if (!(b in store)) {
      store[b] = []
    }
    store[b].push(a)
    return store
  }, {})

const createAdvancer = dependencies => {
  let getAvailable = () => {
    let available = Object.entries(dependencies).flatMap(
      ([name, dependencies]) => (dependencies.length === 0 ? [name] : [])
    )

    return sortBy(available)
  }
  let consume = char => {
    dependencies = Object.entries(dependencies).reduce(
      (store, [name, dependencies]) => {
        if (name !== char) {
          store[name] = dependencies.filter(dep => dep !== char)
        }
        return store
      },
      {}
    )
  }

  return [
    () => Object.entries(dependencies).length > 0,
    () => {
      let first = getAvailable()[0]
      consume(first)
      return first
    },
    getAvailable,
    char => {
      const available = getAvailable()
      if (!available.includes(char)) {
        throw new Error(`Expected "${char}" to be available`)
      }
      consume(char)
    }
  ]
}

const part1 = input => {
  const dependencies = buildDependencies(parse(input))
  const [hasMore, advance] = createAdvancer(dependencies)

  let output = ''
  while (hasMore()) {
    output += advance()
  }

  return output
}

assert(part1(example) === 'CABDFE')
console.log(part1(input))

const part2 = (input, { perTask, workers }) => {
  const workerCount = workers
  const dependencies = buildDependencies(parse(input))
  const [hasMore, advance, getAvailable, consume] = createAdvancer(dependencies)

  const next = (available = getAvailable()) => {
    let char = available[0]
    return {
      char,
      time: perTask(char)
    }
  }

  workers = Array(workerCount).fill(null)

  let time = -1
  while (hasMore() || some(workers, w => w !== null)) {
    time += 1
    // advance the clocks
    workers.forEach((w, index) => {
      if (w && w.time <= 1) {
        consume(w.char)
        workers[index] = null
      } else if (w) {
        workers[index] = { char: w.char, time: w.time - 1 }
      }
    })
    // fill available spots
    workers.forEach((w, index) => {
      if (w === null) {
        let workingOn = new Set(
          workers.flatMap(w => (w === null ? [] : [w.char]))
        )
        const available = getAvailable().filter(char => !workingOn.has(char))
        workers[index] = available.length ? next(available) : null
      }
    })
    console.log(`${time}\t` + workers.map(w => (w ? w.char : '.')).join('\t'))
  }

  return time
}

assert.equal(
  part2(example, {
    perTask: char => char.charCodeAt(0) - 64,
    workers: 2
  }),
  15
)

console.log(
  part2(input, {
    perTask: char => char.charCodeAt(0) - 4,
    workers: 5
  })
)
