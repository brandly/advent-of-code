const fs = require('fs')
const assert = require('assert')
const { every, sum } = require('lodash')
const file = fs.readFileSync('2021/04.txt', 'utf-8')

const parse = (input) => {
  const [numbers, ...boards] = input.trim().split('\n\n')

  return {
    numbers: numbers.split(',').map((n) => parseInt(n)),
    boards: boards.map((board) =>
      board.split('\n').map((row) =>
        row
          .split(/\s+/)
          .filter(Boolean)
          .map((n) => ({ marked: false, num: parseInt(n) }))
      )
    ),
  }
}

const mark = (board, number) =>
  board.map((row) =>
    row.map((cell) => (cell.num === number ? { ...cell, marked: true } : cell))
  )

const isWinner = (board) => {
  for (let i = 0; i < board.length; i++) {
    const row = board[i]
    if (every(row.map((cell) => cell.marked))) return true
  }

  for (let i = 0; i < board.length; i++) {
    const row = board.map((r) => r[i])
    if (every(row.map((cell) => cell.marked))) return true
  }

  return false
}

const score = (board, calledNum) => {
  const unmarked = board
    .flatMap((n) => n)
    .filter((cell) => !cell.marked)
    .map((cell) => cell.num)
  return sum(unmarked) * calledNum
}

const part1 = (input) => {
  let { numbers, boards } = parse(input)

  for (let i = 0; i < numbers.length; i++) {
    const calledNum = numbers[i]
    boards = boards.map((board) => mark(board, calledNum))
    const winner = boards.find(isWinner)
    if (winner) {
      return score(winner, calledNum)
    }
  }
}

{
  const example =
    '7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1\n\n22 13 17 11  0\n  8  2 23  4 24\n21  9 14 16  7\n  6 10  3 18  5\n  1 12 20 15 19\n\n  3 15  0  2 22\n  9 18 13 17  5\n19  8  7 25 23\n20 11 10 24  4\n14 21 16 12  6\n\n14 21 17 24  4\n10 16 15  9 19\n18  8 23 26 20\n22 11 13  6  5\n  2  0 12  3  7'
  assert.equal(part1(example), 4512)
}

console.log(part1(file))

const part2 = (input) => {
  let { numbers, boards } = parse(input)

  for (let i = 0; i < numbers.length; i++) {
    const calledNum = numbers[i]
    boards = boards.map((board) => mark(board, calledNum))

    if (boards.length === 1) {
      if (isWinner(boards[0])) {
        return score(boards[0], calledNum)
      }
    } else {
      boards = boards.filter((board) => !isWinner(board))
    }
  }
}

{
  const example =
    '7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1\n\n22 13 17 11  0\n  8  2 23  4 24\n21  9 14 16  7\n  6 10  3 18  5\n  1 12 20 15 19\n\n  3 15  0  2 22\n  9 18 13 17  5\n19  8  7 25 23\n20 11 10 24  4\n14 21 16 12  6\n\n14 21 17 24  4\n10 16 15  9 19\n18  8 23 26 20\n22 11 13  6  5\n  2  0 12  3  7'
  assert.equal(part2(example), 1924)
}

console.log(part2(file))
