const fs = require('fs')
const assert = require('assert')
const file = fs.readFileSync('2021/02.txt', 'utf-8')

const parse = (input) =>
  input.split('\n').map((row) => {
    const [dir, num] = row.split(' ')
    return { dir, num: parseInt(num) }
  })

const part1 = (input) => {
  const commands = parse(input)
  let x = 0,
    y = 0
  commands.forEach(({ dir, num }) => {
    switch (dir) {
      case 'forward':
        x += num
        break
      case 'up':
        y -= num
        break
      case 'down':
        y += num
        break
    }
  })
  return x * y
}

{
  const example = 'forward 5\ndown 5\nforward 8\nup 3\ndown 8\nforward 2'
  assert.equal(part1(example), 150)
}

console.log(part1(file))

const part2 = (input) => {
  const commands = parse(input)
  let x = 0,
    y = 0,
    aim = 0
  commands.forEach(({ dir, num }) => {
    switch (dir) {
      case 'forward':
        x += num
        y += aim * num
        break
      case 'up':
        aim -= num
        break
      case 'down':
        aim += num
        break
    }
  })
  return x * y
}

{
  const example = 'forward 5\ndown 5\nforward 8\nup 3\ndown 8\nforward 2'
  assert.equal(part2(example), 900)
}

console.log(part2(file))
