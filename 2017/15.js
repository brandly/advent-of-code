const assert = require('assert')

class Generator {
  constructor (seed, factor) {
    this.last = seed
    this.factor = factor
  }

  next () {
    const next = (this.last * this.factor) % 2147483647
    this.last = next
    return next
  }
}

const exampleA = new Generator(65, 16807)
const exampleB = new Generator(8921, 48271)

assert.equal(exampleA.next(), 1092455)
assert.equal(exampleA.next(), 1181022009)
assert.equal(exampleA.next(), 245556042)
assert.equal(exampleA.next(), 1744312007)
assert.equal(exampleA.next(), 1352636452)

assert.equal(exampleB.next(), 430625591)
assert.equal(exampleB.next(), 1233683848)
assert.equal(exampleB.next(), 1431495498)
assert.equal(exampleB.next(), 137874439)
assert.equal(exampleB.next(), 285222916)

assert.equal((1092455).toString(2), '100001010101101100111')

const binEnd = n => {
  let bin = n.toString(2)
  while (bin.length < 16) {
    bin = '0' + bin
  }
  return bin.slice(-16)
}
const sameBinaryEnd = (a, b) => {
  return binEnd(a) === binEnd(b)
}

const judge = (a, b, rounds) => {
  let count = 0
  for (let i = 0; i < rounds; i++) {
    if (sameBinaryEnd(a.next(), b.next())) {
      count++
    }
  }
  return count
}

// assert.equal(
//   judge(new Generator(65, 16807), new Generator(8921, 48271), 5),
//   1
// )

// assert.equal(
//   judge(new Generator(65, 16807), new Generator(8921, 48271), 40 * 1000 * 1000),
//   588
// )

// took 73 seconds :'(
console.log(judge(new Generator(699, 16807), new Generator(124, 48271), 40 * 1000 * 1000))

class SelectiveGenerator {
  constructor (seed, factor, multiple) {
    this.last = seed
    this.factor = factor
    this.multiple = multiple
  }

  _next () {
    const next = (this.last * this.factor) % 2147483647
    this.last = next
    return next
  }

  next () {
    while ((this._next() % this.multiple) !== 0) {}
    return this.last
  }
}

const selectiveExampleA = new SelectiveGenerator(65, 16807, 4)
const selectiveExampleB = new SelectiveGenerator(8921, 48271, 8)

assert.equal(selectiveExampleA.next(), 1352636452)
assert.equal(selectiveExampleA.next(), 1992081072)
assert.equal(selectiveExampleA.next(), 530830436)
assert.equal(selectiveExampleA.next(), 1980017072)
assert.equal(selectiveExampleA.next(), 740335192)

assert.equal(selectiveExampleB.next(), 1233683848)
assert.equal(selectiveExampleB.next(), 862516352)
assert.equal(selectiveExampleB.next(), 1159784568)
assert.equal(selectiveExampleB.next(), 1616057672)
assert.equal(selectiveExampleB.next(), 412269392)

// 11.36 seconds
// assert.equal(
//   judge(
//     new SelectiveGenerator(65, 16807, 4),
//     new SelectiveGenerator(8921, 48271, 8),
//     5 * 1000 * 1000
//   ),
//   309
// )

// 11.4 seconds
console.log(
  judge(
    new SelectiveGenerator(699, 16807, 4),
    new SelectiveGenerator(124, 48271, 8),
    5 * 1000 * 1000
  )
)
