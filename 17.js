const Combinatorics = require('js-combinatorics')
const powerSet = Combinatorics.power

const sum = require('./sum')
const input = require('./read-input')('17')
const containers = input.split('\n').map(i => parseInt(i, 10))

const totalEggnog = 150

const matchingCombos = powerSet(containers).filter(perm => {
  return sum(perm) === totalEggnog
})

console.log(matchingCombos.length)

function smallest (arr) {
  return arr.reduce((prev, current) => {
    return (prev.length < current.length) ? prev : current
  })
}

const smallestLength = smallest(matchingCombos).length
const matchingCombos2 = matchingCombos.filter(combo => {
  return combo.length === smallestLength
})

console.log(matchingCombos2.length)
