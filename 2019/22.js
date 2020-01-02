const fs = require('fs')
const assert = require('assert')
const { range, reverse } = require('lodash')

const createDeck = n => range(0, n)
const view = deck => deck.join(' ')

const waterfall = (start, fns) => {
  let out = start
  for (let i = 0; i < fns.length; i++) {
    out = fns[i](out)
  }
  return out
}

const dealIntoNewStack = deck => reverse(deck)
const dealWithIncrement = n => deck => {
  let result = deck.slice(0)
  for (let o = 0, i = 0; i < deck.length; i++, o = (o + n) % deck.length) {
    result[o] = deck[i]
  }
  return result
}
const cutNCards = n => deck => deck.slice(n).concat(deck.slice(0, n))

{
  const result = waterfall(createDeck(10), [
    dealWithIncrement(7),
    dealIntoNewStack,
    dealIntoNewStack
  ])
  assert.deepEqual(result, [0, 3, 6, 9, 2, 5, 8, 1, 4, 7])
}

{
  const result = waterfall(createDeck(10), [
    cutNCards(6),
    dealWithIncrement(7),
    dealIntoNewStack
  ])
  assert.deepEqual(result, [3, 0, 7, 4, 1, 8, 5, 2, 9, 6])
}

{
  const result = waterfall(createDeck(10), [
    dealWithIncrement(7),
    dealWithIncrement(9),
    cutNCards(-2)
  ])
  assert.deepEqual(result, [6, 3, 0, 7, 4, 1, 8, 5, 2, 9])
}

{
  const result = waterfall(createDeck(10), [
    dealIntoNewStack,
    cutNCards(-2),
    dealWithIncrement(7),
    cutNCards(8),
    cutNCards(-4),
    dealWithIncrement(7),
    cutNCards(3),
    dealWithIncrement(9),
    dealWithIncrement(3),
    cutNCards(-1)
  ])
  assert.deepEqual(result, [9, 2, 5, 8, 1, 4, 7, 0, 3, 6])
}

const input = fs.readFileSync(`${__dirname}/22.txt`, 'utf-8').trim()

const parse = input =>
  input.split('\n').map(line => {
    if (line.startsWith('cut')) {
      const cut = parseInt(line.slice(4))
      return cutNCards(cut)
    }
    if (line.startsWith('deal with increment')) {
      const increment = parseInt(line.slice(20))
      return dealWithIncrement(increment)
    }
    if (line === 'deal into new stack') {
      return dealIntoNewStack
    }
    throw new Error(`Unexpected line: ${line}`)
  })

console.log(waterfall(createDeck(10007), parse(input)).indexOf(2019))
