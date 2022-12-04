const fs = require('fs')
const assert = require('assert')
const { sum, some } = require('lodash')

const file = fs.readFileSync('2019/14.txt', 'utf-8').trim()

const example = `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`

const parseChemical = (str) => {
  const [num, chem] = str.split(' ')
  return { num: parseInt(num), chem }
}

const parse = (input) =>
  input.split('\n').map((line) => {
    const [inputs, output] = line.split(' => ')
    return {
      input: inputs.split(', ').map(parseChemical),
      output: parseChemical(output),
    }
  })

{
  const parsed = parse(example)
  assert.deepEqual(parsed[0], {
    input: [
      {
        num: 10,
        chem: 'ORE',
      },
    ],
    output: {
      num: 10,
      chem: 'A',
    },
  })

  assert.deepEqual(parsed[2], {
    input: [
      {
        num: 7,
        chem: 'A',
      },
      {
        num: 1,
        chem: 'B',
      },
    ],
    output: {
      num: 1,
      chem: 'C',
    },
  })
}

const part1 = (input) => {
  const reactions = parse(input)

  // holds counts of what we have, negative values represent needs
  const bag = { FUEL: -1 }
  let looping = true

  while (looping) {
    looping = false
    for (const [chem, num] of Object.entries(bag)) {
      if (chem === 'ORE' || num >= 0) continue

      looping = true
      // really want to .find() but also want to guard against finding multiple solutions
      const reactionsForChem = reactions.filter((r) => r.output.chem === chem)
      assert(
        reactionsForChem.length === 1,
        `Unexpected ${reactionsForChem.length} reactions "${JSON.stringify(
          reactionsForChem
        )}" for value "${JSON.stringify({ chem, num })}"`
      )

      const reaction = reactionsForChem[0]

      bag[reaction.output.chem] += reaction.output.num

      reaction.input.forEach((r) => {
        if (r.chem in bag) {
          bag[r.chem] -= r.num
        } else {
          bag[r.chem] = -r.num
        }
      })
    }
  }

  // value in `bag` is ORE because we don't have it, that's how much we need
  return -bag['ORE']
}

assert.equal(part1(example), 31)
assert.equal(
  part1(`9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`),
  165
)

assert.equal(
  part1(`157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`),
  13312
)

assert.equal(
  part1(`2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`),
  180697
)
console.log(part1(file))
