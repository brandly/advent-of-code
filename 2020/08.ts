const assert = require('assert')
const fs = require('fs')
const file = fs.readFileSync('2020/08.txt', 'utf-8').trim()

type Op = 'acc' | 'jmp' | 'nop'
type Instruction = {
  index: number
  op: Op
  num: number
}

const parse = (str): Instruction[] =>
  str.split('\n').map((line, index) => {
    const [op, num] = line.split(' ')
    return { index, op, num: parseInt(num) }
  })

class Interpreter {
  instructions: Instruction[]
  accumulator: number
  index: number
  constructor(instructions: Instruction[]) {
    this.instructions = instructions
    this.accumulator = 0
    this.index = 0
  }
  advance(): Instruction {
    const instruct = this.instructions[this.index]
    switch (instruct.op) {
      case 'acc': {
        this.accumulator += instruct.num
        this.index += 1
        break
      }
      case 'jmp': {
        this.index += instruct.num
        break
      }
      case 'nop': {
        this.index += 1
        break
      }
      default:
        throw new Error(`Unexpected op "${instruct.op}"`)
    }
    return instruct
  }
}

const part1 = (str) => {
  const instructions = parse(str)
  const interpreter = new Interpreter(instructions)

  let seen = new Set()
  while (!seen.has(interpreter.index)) {
    seen.add(interpreter.advance().index)
  }
  return interpreter.accumulator
}

console.log(part1(file))

const toCompletion = (instructions) => {
  const interpreter = new Interpreter(instructions)

  let seen = new Set()
  while (!seen.has(interpreter.index)) {
    seen.add(interpreter.advance().index)
    if (interpreter.index === instructions.length) {
      return { result: 'complete', interpreter }
    }
  }
  return { result: 'loop', interpreter }
}

const replace = (list, index, item) =>
  list
    .slice(0, index)
    .concat(item)
    .concat(list.slice(index + 1))

const part2 = (str) => {
  const instructions = parse(str)

  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].op === 'acc') {
      continue
    }
    const modified = replace(instructions, i, {
      ...instructions[i],
      op: instructions[i].op === 'nop' ? 'jmp' : 'nop',
    })

    let status
    const { result, interpreter } = toCompletion(modified)
    if (result === 'complete') {
      return interpreter.accumulator
    }
  }
}

console.log(part2(file))

{
  const example = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`
  assert.equal(part1(example), 5)
  assert.equal(part2(example), 8)
}
