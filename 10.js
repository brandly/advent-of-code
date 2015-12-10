'use strict'
const input = '1321131112'

function lookAndSay (str) {
  return str.split('').reduce((store, char, index, list) => {
    if (char === store.char) {
      store.streak += 1
    } else {
      if (store.char !== null) {
        store.runs.push({
          char: store.char,
          len: store.streak
        })
      }
      store.char = char
      store.streak = 1
    }
    // dirty
    if (index === (list.length - 1)) {
      store.runs.push({
        char: store.char,
        len: store.streak
      })
    }
    return store
  }, {
    streak: 0,
    char: null,
    runs: []
  }).runs.map((run, i) => {
    return run.len + run.char
  }).join('')
}

const part1Count = 40
const part2Count = 50 // not fast, ~7.5 seconds on my machine

let val = input
for (var i = 0; i < part2Count; i++) {
  val = lookAndSay(val)
}
console.log(val.length)
