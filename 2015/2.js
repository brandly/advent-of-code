function sortNumber(a, b) {
  return a - b
}

function sum(arr) {
  return arr.reduce((previous, current) => {
    return previous + current
  }, 0)
}

const input = require('./read-input')(2)

const dimensions = input.split('\n').map(line => {
  return line.split('x').map(num => {
    return parseInt(num, 10)
  })
})

const sortedSideAreas = dimensions.map(edges => {
  return [edges[0] * edges[1], edges[1] * edges[2], edges[2] * edges[0]].sort(
    sortNumber
  )
})

const requiredWrappings = sortedSideAreas.map(sides => {
  const smallestSide = sides[0]

  const boxArea = sides.reduce((previous, current) => {
    return previous + current * 2
  }, 0)

  return smallestSide + boxArea
})

const totalPaper = sum(requiredWrappings)

// Part 1
console.log(totalPaper)

const ribbonLengths = dimensions.map(sides => {
  sides.sort(sortNumber)

  const smallestSide = sides[0]
  const middleSide = sides[1]

  const ribbonWrapLength = smallestSide * 2 + middleSide * 2

  const ribbonBowLength = sides.reduce((previous, current) => {
    return previous * current
  }, 1)

  return ribbonWrapLength + ribbonBowLength
})

// Part 2
console.log(sum(ribbonLengths))
