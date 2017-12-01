'use strict'
const readInput = require('./read-input')

const input = readInput('16').split('\n')
const tickerTape = readInput('16-ticker').split('\n')
const _ = require('lodash')

function matchesExactCount (line, tape) {
  return _.includes(line, tape)
}

function removeColon (str) {
  return str.replace(':', '')
}

function removeComma (str) {
  return str.replace(',', '')
}

const tickerLookup = tickerTape.reduce((store, line) => {
  const splits = line.split(' ')
  store[removeColon(splits[0])] = splits[1]

  return store
}, {})

const possibleFilters = Object.keys(tickerLookup)

const parsedInput = input.map(line => {
  const splits = line.split(' ').map(removeColon).map(removeComma)
  const result = {
    number: splits[1]
  }
  result[splits[2]] = splits[3]
  result[splits[4]] = splits[5]
  result[splits[6]] = splits[7]
  return result
})

const firstResult = parsedInput.filter(line => {
  for (var i = 0; i < possibleFilters.length; i++) {
    const filter = possibleFilters[i]

    if (!!line[filter] && line[filter] !== tickerLookup[filter]) {
      return false
    }
  }
  return true
})[0]

console.log(firstResult.number)

const greaterThan = ['cats', 'trees']
const fewerThan = ['pomeranians', 'goldfish']

const exact = [
  'children',
  'samoyeds',
  'akitas',
  'vizslas',
  'cars',
  'perfumes'
]

const secondResult = parsedInput.filter(line => {
  return compareAndFilter(line, exact, exactComparison)
    && compareAndFilter(line, fewerThan, fewerThanComparison)
    && compareAndFilter(line, greaterThan, greaterThanComparison)
})

console.log(secondResult)

function exactComparison (a, b) {
  return a === b
}

function fewerThanComparison (a, b) {
  return a < b
}

function greaterThanComparison (a, b) {
  return a > b
}

function compareAndFilter (line, list, comparison) {
  for (var i = 0; i < list.length; i++) {
    const filter = list[i]

    if (!!line[filter] && !comparison(line[filter], tickerLookup[filter])) {
      return false
    }
  }
  return true
}

