'use strict'
const input = require('./read-input')('9')
const Combinatorics = require('js-combinatorics')
const permutations = Combinatorics.permutation

const store = input.split('\n').map((line) => {
  const splits = line.split(' ')
  return {
    a: splits[0],
    b: splits[2],
    value: parseInt(splits[4], 10)
  }
}).reduce((store, dist) => {
  store._list.add(dist.a)
  store._list.add(dist.b)

  // store both directions so it's easier to look up
  store[dist.a + dist.b] = dist.value
  store[dist.b + dist.a] = dist.value

  return store
}, {
  _list: new Set()
})

function lookupDistance (start, dest) {
  return store[start + dest]
}

function sortNumber (a, b) {
  return a - b
}

const perms = permutations(Array.from(store._list)).toArray().map((perm) => {
  return perm.reduce((count, current, i, arr) => {
    if (i === 0) {
      return 0
    } else {
      return count + lookupDistance(arr[i - 1], current)
    }
  }, 0)
}).sort(sortNumber)

// Part 1
console.log(perms[0])

// Part 2
console.log(perms[perms.length - 1])
