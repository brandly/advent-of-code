const input = require('./read-input')('12')
const inputObject = JSON.parse(input)

// function countUnknown (item) {
//   const type = typeof item

//   if (item instanceof Array) {
//     return sum(arr.map(i => countUnknown(i)))
//   } else if (type === 'object') {
//     return countObject(item)
//   } else if (type === 'number') {
//     return item
//   } else {
//     return 0
//   }
// }

function countObject (obj) {
  const listOfCounts = Object.keys(obj).map((key, i) => {
    return countUnknown(obj[key])
  })

  return sum(listOfCounts)
}

function sum (list) {
  return list.reduce((prev, current) => {
    return prev + current
  }, 0)
}

// Part 1
// console.log(countUnknown(inputObject))

function unknownHasRed (item) {
  const type = typeof item

  if (item instanceof Array) {
    return false
  } else if (type === 'object') {
    return objectHasRed(item)
  } else if (type === 'number') {
    return false
  } else { //string
    return item === 'red'
  }
}

function objectHasRed (obj) {
  return any(Object.keys(obj).map(k => {
    return k === 'red' || obj[k] === 'red'
  }))
}

function any (list) {
  return list.reduce((prev, current) => {
    return prev || current
  }, false)
}

function countUnknown (item) {
  const type = typeof item

  if (unknownHasRed(item)) {
    return 0
  } else {

    if (item instanceof Array) {
      return sum(item.map(i => countUnknown(i)))
    } else if (type === 'object') {
      return countObject(item)
    } else if (type === 'number') {
      return item
    } else {
      return 0
    }
  }

}

console.log(countUnknown(inputObject))
