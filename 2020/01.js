const fs = require('fs')

const file = fs.readFileSync('01.txt', 'utf-8')
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

const triplets = numbers.flatMap((first) =>
  pairs.map(([second, third]) => [first, second, third])
)

{
  const match = triplets.find(
    ([first, second, third]) => first + second + third === 2020
  )
  console.log(match[0] * match[1] * match[2])
}
