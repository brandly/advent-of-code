const fs = require('fs')
const assert = require('assert')
const { range, sum } = require('lodash')
const file = fs.readFileSync('2021/06.txt', 'utf-8').trim()

const parse = (input) => input.split(',').map((n) => parseInt(n))

const part1 = (input, days = 80) => {
  return part2(input, days)
  // let fish = parse(input)

  // for (let i = 0; i < days; i++) {
  //   fish = fish.flatMap((f) => {
  //     if (f === 0) return [6, 8]
  //     else return [f - 1]
  //   })
  //   console.log('after', i, fish.length)
  // }
  // return fish.length
}

const part2 = (input, days = 256) => {
  let fish = parse(input)
  let daysToCount = fish.reduce((out, f) => {
    if (f in out) out[f]++
    else out[f] = 1
    return out
  }, {})

  const insert = (out, key, val) => {
    if (key in out) out[key] += val
    else out[key] = val
    return out
  }
  for (let i = 0; i < days; i++) {
    daysToCount = Object.entries(daysToCount).reduce((out, [key, count]) => {
      const days = parseInt(key)
      if (days === 0) {
        insert(out, 8, count)
        insert(out, 6, count)
      } else {
        insert(out, days - 1, count)
      }
      return out
    }, {})
  }

  return sum(Object.values(daysToCount))
}

{
  const example = '3,4,3,1,2'
  assert.equal(part1(example), 5934)
  assert.equal(part2(example), 26984457539)
}

console.log(part1(file))
console.log(part2(file))
