const fs = require('fs')
const assert = require('assert')
const { sum } = require('lodash')
const file = fs.readFileSync('2022/07.txt', 'utf-8').trim()

const example = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`

const parse = (input) =>
  input.split('\n').reduce((accum, line) => {
    if (line.startsWith('$ ')) {
      accum.push([line.slice(2)])
    } else {
      accum[accum.length - 1].push(line)
    }
    return accum
  }, [])

/*
  {
    parent: dir,
    name: ''

    // if dir
    files: [],
    // if file
    size: 0
  }
*/
const inferDirs = (cmds) => {
  const root = {
    parent: null,
    files: [],
    name: '/',
  }
  let pwd = root

  cmds.forEach(([cmd, ...results]) => {
    if (cmd.startsWith('cd ')) {
      assert(results.length === 0)

      const dest = cmd.slice(3)
      if (dest === '/') {
        pwd = root
      } else if (dest === '..') {
        pwd = pwd.parent ?? root
      } else {
        const match = pwd.files.find((file) => file.name === dest)
        assert(match)
        pwd = match
      }
    } else if (cmd === 'ls') {
      results.forEach((line) => {
        const [first, name] = line.split(' ')
        if (first === 'dir') {
          pwd.files.push({
            parent: pwd,
            name,
            files: [],
          })
        } else {
          const size = parseInt(first)
          pwd.files.push({
            parent: pwd,
            name,
            size,
          })
        }
      })
    }
  })

  return root
}

const draw = (node, indent = '') => {
  const type = node.files ? 'dir' : 'file'
  const size = node.size ? `, size=${node.size}` : ''
  console.log(`${indent}- ${node.name} (${type}${size})`)
  if (node.files) {
    node.files.forEach((file) => draw(file, indent + '  '))
  }
}

const inferSize = (node) => {
  if (node.size) {
    return node.size
  } else {
    const size = sum(node.files.map(inferSize))
    node.size = size
    return size
  }
}

const flatten = (node, list = []) => {
  list.push({
    name: node.name,
    type: node.files ? 'dir' : 'file',
    size: node.size,
  })
  if (node.files) node.files.forEach((file) => flatten(file, list))
  return list
}

const part1 = (input) => {
  const root = inferDirs(parse(input))
  // draw(root)
  inferSize(root)
  return sum(
    flatten(root).flatMap(({ type, size }) =>
      type === 'dir' && size <= 100000 ? [size] : []
    )
  )
}

const total = 70_000_000
const needed = 30_000_000
const part2 = (input) => {
  const root = inferDirs(parse(input))
  inferSize(root)

  const available = total - root.size
  const toFree = needed - available

  return flatten(root)
    .filter(({ type, size }) => type === 'dir' && size >= toFree)
    .map(({ size }) => size)
    .sort((a, b) => a - b)[0]
}

assert.equal(part1(example), 95437)
console.log(part1(file))

assert.equal(part2(example), 24933642)
console.log(part2(file))
