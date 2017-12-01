const fs = require('fs')

const input = fs.readFileSync('./3-input.txt').toString().trim()

var x = 0
var y = 0
const tracker = {}

function trackPackageAtCurrentLocation () {
  const key = x.toString() + 'x' + y.toString()
  tracker[key] = true
}

function updateCoordsForChar (char) {
  switch (char) {
    case '^':
      y += 1
      break

    case '>':
      x += 1
      break

    case 'v':
      y -= 1
      break

    case '<':
      x -= 1
      break
  }
}

input.split('').forEach(char => {
  updateCoordsForChar(char)
  trackPackageAtCurrentLocation()
})

console.log(Object.keys(tracker).length)
