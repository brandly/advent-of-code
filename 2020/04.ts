const fs = require('fs')
const assert = require('assert')
const file = fs.readFileSync('2020/04.txt', 'utf-8')

const parse = (str: string) => str.split('\n\n').map(parsePassport)
const parsePassport = (str: string) =>
  str
    .split('\n')
    .flatMap((line) => line.split(' '))
    .map((pair) => pair.split(':'))
    .reduce((out, [field, value]) => {
      out[field] = value
      return out
    }, {})

const required = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
  //'cid'
]
const validPassport = (passport) => {
  const defined = new Set(Object.keys(passport))
  for (let i = 0; i < required.length; i++) {
    if (!defined.has(required[i])) return false
  }
  return true
}

const part1 = (str) => {
  const passports = parse(str)
  return passports.filter(validPassport).length
}

console.log(part1(file))

const validPassport2 = (passport) => {
  const defined = new Set(Object.keys(passport))
  for (let i = 0; i < required.length; i++) {
    const field = required[i]
    if (!defined.has(field)) return false
    if (!validField(field, passport[field])) return false
  }
  return true
}

const validField = (field: string, value: string): boolean => {
  switch (field) {
    case 'byr': {
      if (value.length === 4) {
        const int = parseInt(value)
        if (int >= 1920 && int <= 2002) return true
      }
      return false
      break
    }
    case 'iyr': {
      if (value.length === 4) {
        const int = parseInt(value)
        if (int >= 2010 && int <= 2020) return true
      }
      return false
      break
    }
    case 'eyr': {
      if (value.length === 4) {
        const int = parseInt(value)
        if (int >= 2020 && int <= 2030) return true
      }
      return false
      break
    }
    case 'hgt': {
      const result = /(\d+)(cm|in)/.exec(value)
      // correct structure
      if (!result) return false
      const [_, num, units] = result
      // correct units
      if (units !== 'cm' && units !== 'in') return false
      const int = parseInt(num)
      // is number
      if (Number.isNaN(int)) return false
      // correct ranges
      if (units === 'cm' && int >= 150 && int <= 193) return true
      if (units === 'in' && int >= 59 && int <= 76) return true
      return false
      break
    }
    case 'hcl': {
      const result = /^#[0-9a-f]+$/.exec(value)
      if (!result) return false
      const [str] = result
      // hashtag + 6 chars
      return str.length === 7
      break
    }
    case 'ecl': {
      const ecl = new Set(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'])
      return ecl.has(value)
      break
    }
    case 'pid': {
      if (value.length !== 9) return false
      for (let i = 0; i < value.length; i++) {
        if (value[i] < '0' || value[i] > '9') return false
      }
      return true
      break
    }
    default:
      throw new Error('Unexpected field: ' + field)
  }
}

const part2 = (str) => parse(str).filter(validPassport2).length
console.log(part2(file))

{
  const example = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`
  assert.equal(part1(example), 2)

  const invalids = `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`
  assert.equal(part2(invalids), 0)

  const valids = `pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`
  assert.equal(part2(valids), 4)
}
