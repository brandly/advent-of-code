function sum (arr) {
  return arr.reduce((previous, current) => {
    return previous + current
  }, 0)
}

module.exports = sum
