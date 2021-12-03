const fs = require('fs')
const assert = require('assert')
const file = fs.readFileSync('2021/03.txt', 'utf-8')

const parse = (input) => input.split('\n')

const gamma = (report) => {
  const output = report[0].split('').map(() => 0)
  report.forEach((row) => {
    row.split('').forEach((num, index) => {
      if (num === '1') output[index]++
      else output[index]--
    })
  })
  return output.map((num) => (num > 0 ? '1' : '0')).join('')
}

const bin2dec = (str) => {
  const zeroOnes = str.split('').reverse()
  return zeroOnes.reduce(
    (result, num, index) => result + (num === '1' ? 2 ** index : 0),
    0
  )
}

const part1 = (input) => {
  const parsed = parse(input)
  const gammaRate = gamma(parsed)
  const espilonRate = gammaRate
    .split('')
    .map((n) => (n === '1' ? '0' : '1'))
    .join('')
  return bin2dec(gammaRate) * bin2dec(espilonRate)
}

{
  const example =
    '00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010'
  assert.equal(gamma(parse(example)), '10110')
  assert.equal(part1(example), 198)
}

console.log(part1(file))

const getCounts = (report) => {
  const counts = report[0].split('').map(() => 0)
  report.forEach((row) => {
    row.split('').forEach((num, index) => {
      if (num === '1') counts[index]++
      else counts[index]--
    })
  })
  return counts
}

const oxRating = (report) => {
  let output = report
  for (let i = 0; i < report[0].length, output.length > 1; i++) {
    const counts = getCounts(output)
    output = output.filter(
      (row) =>
        (counts[i] >= 0 && row[i] === '1') || (counts[i] < 0 && row[i] === '0')
    )
  }
  return output[0]
}

const co2Rating = (report) => {
  let output = report
  for (let i = 0; i < report[0].length, output.length > 1; i++) {
    const counts = getCounts(output)
    output = output.filter(
      (row) =>
        (counts[i] < 0 && row[i] === '1') || (counts[i] >= 0 && row[i] === '0')
    )
  }
  return output[0]
}

const part2 = (input) => {
  const parsed = parse(input)
  const ox = oxRating(parsed)
  const co2 = co2Rating(parsed)
  return bin2dec(ox) * bin2dec(co2)
}

{
  const example =
    '00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010'
  assert.equal(oxRating(parse(example)), '10111')
}

console.log(part2(file))
