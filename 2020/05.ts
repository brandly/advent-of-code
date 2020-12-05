const assert = require('assert')
const fs = require('fs')
const file = fs.readFileSync('2020/05.txt', 'utf-8').trim()
const { range } = require('lodash')

const findSeat = (line: string) => {
  let row = range(0, 128)
  let column = range(0, 8)

  line.split('').forEach((char) => {
    switch (char) {
      case 'F': {
        row = row.splice(0, Math.ceil(row.length / 2))
        break
      }
      case 'B': {
        row = row.splice(Math.ceil(row.length / 2))
        break
      }
      case 'R': {
        column = column.splice(Math.ceil(column.length / 2))
        break
      }
      case 'L': {
        column = column.splice(0, Math.ceil(column.length / 2))
        break
      }
      default:
        throw new Error(`Unexpected char "${char}"`)
    }
  })

  assert.equal(row.length, 1)
  assert.equal(column.length, 1)
  return { row: row[0], column: column[0] }
}

const seatId = ({ row, column }) => row * 8 + column

const part1 = (str) => {
  const ids = str.split('\n').map((line) => seatId(findSeat(line)))
  return Math.max.apply(Math, ids)
}

console.log(part1(file))

{
  assert.deepEqual(findSeat('FBFBBFFRLR'), { row: 44, column: 5 })
  assert.equal(seatId({ row: 44, column: 5 }), 357)
}

const part2 = (str) => {
  const columnCount = 8,
    rowCount = 128
  const plane = range(0, columnCount).map(() =>
    // every seat init to false
    range(0, rowCount).map(() => false)
  )
  str.split('\n').forEach((line) => {
    const { row, column } = findSeat(line)
    plane[column][row] = true
  })

  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      if (
        plane[column][row] === false &&
        plane[column][row + 1] === true &&
        plane[column][row - 1] === true
      ) {
        return seatId({ column, row })
      }
    }
  }
}

console.log(part2(file))
