'use strict'
const md5 = require('md5')
const input = 'ckczppom'

function findMatch (query) {
  let match = null

  for (let guess = 0; !match; guess++) {
    const output = md5(input + guess)

    const beginning = output.slice(0, query.length)

    if (beginning === query) {
      match = guess
    }
  }

  return match
}

// Part 1
console.log(findMatch('00000'))

// Part 2
console.log(findMatch('000000'))
