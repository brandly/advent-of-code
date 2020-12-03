const fs = require('fs')

const file = fs.readFileSync('2020/01.txt', 'utf-8')
const numbers = file
  .trim()
  .split('\n')
  .map((num) => parseInt(num))

const pairs = numbers.flatMap((first) =>
  numbers.map((second) => [first, second])
)

{
  const match = pairs.find(([first, second]) => first + second === 2020)
  console.log(match[0] * match[1])
}

{
  outer: for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < pairs.length; j++) {
      const first = numbers[i]
      const [second, third] = pairs[j]
      if (first + second + third === 2020) {
        console.log(first * second * third)
        break outer
      }
    }
  }
}
