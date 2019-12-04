'use strict'
const input = require('./read-input')(5)

function contains(list, item) {
  return list.indexOf(item) > -1
}

function vowelCount(str) {
  const allVowels = 'aeiou'

  return str.split('').reduce((previous, current) => {
    if (contains(allVowels, current)) {
      return previous + 1
    } else {
      return previous
    }
  }, 0)
}

function hasRepeatingLetter(str) {
  for (var i = 1; i < str.length; i++) if (str[i] === str[i - 1]) return true
  return false
}

function hasBadSubstrings(str) {
  const bad = ['ab', 'cd', 'pq', 'xy']

  return bad.reduce((alreadyFound, naughty) => {
    if (alreadyFound) return alreadyFound

    return contains(str, naughty)
  }, false)
}

function isNice(str) {
  return (
    vowelCount(str) >= 3 && hasRepeatingLetter(str) && !hasBadSubstrings(str)
  )
}

const result = input.split('\n').filter(isNice).length

console.log(result)

// what a mess
function hasPairOfPairs(str) {
  const end = str.length - 2
  for (var i = 0; i < end; i++) {
    const pair = str.slice(i, i + 2)

    for (var j = i + 2; j < str.length - 1; j++) {
      const otherPair = str.slice(j, j + 2)

      if (pair === otherPair) {
        return true
      }
    }
  }
  return false
}

function hasSandwich(str) {
  for (var i = 2; i < str.length; i++) {
    if (str[i] === str[i - 2]) {
      return true
    }
  }
  return false
}

function isEvenNicer(str) {
  return hasPairOfPairs(str) && hasSandwich(str)
}

const result2 = input.split('\n').filter(isEvenNicer).length

console.log(result2)
