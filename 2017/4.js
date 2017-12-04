const fs = require('fs')
const assert = require('assert')

const input = fs.readFileSync('./4.txt', 'utf-8')
  .trim()
  .split('\n')

const isValid = passphrase => {
  const words = passphrase.split(' ')
  const s = {}
  for (var i = 0; i < words.length; i++) {
    if (s[words[i]]) return false
    s[words[i]] = true
  }
  return true
}

console.log(input.filter(isValid).length)

const isValid2 = passphrase => {
  const words = passphrase.split(' ')
  const s = {}
  for (var i = 0; i < words.length; i++) {
    const word = words[i].split('').sort().join('')
    if (s[word]) return false
    s[word] = true
  }
  return true
}

console.log(input.filter(isValid2).length)
