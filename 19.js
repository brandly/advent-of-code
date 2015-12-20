const input = require('./read-input')('19')
const _ = require('lodash')
const lines = input.split('\n')

const molecule = _.last(lines)
const replacements = lines.slice(0, lines.length - 2).map(line => {
  return line.split(' => ')
})

// const molecule = 'HOH'
// const replacements = [
//   ['H', 'HO'],
//   ['H', 'OH'],
//   ['O', 'HH']
// ]

// http://stackoverflow.com/questions/3410464/how-to-find-all-occurrences-of-one-string-in-another-in-javascript
function getIndicesOf(searchStr, str) {
  var startIndex = 0, searchStrLen = searchStr.length;
  var index, indices = [];

  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

const results = replacements.map(replacement => {
  const indices = getIndicesOf(replacement[0], molecule)

  return indices.map(index => {
    const beforeReplace = molecule.slice(0, index)
    const afterReplace = molecule.slice(index + replacement[0].length, molecule.length)

    return beforeReplace + replacement[1] + afterReplace
  })
})

console.log(_.chain(results).flatten().unique().value().length)
