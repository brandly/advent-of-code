const fs = require('fs')
const assert = require('assert')
const { uniqBy, sortBy } = require('lodash')

const input = fs.readFileSync(`${__dirname}/20.txt`, 'utf-8')
const parse = input => input.split('\n').map(line => line.split(''))
const view = maze =>
  maze
    .map(line => line.map(v => (typeof v === 'number' ? v % 10 : v)).join(''))
    .join('\n')

const get = (maze, { x, y }) => {
  const theRow = maze.find((row, theY) => y === theY)
  return theRow ? theRow.find((value, theX) => theX === x) : null
}

const set = (maze, { x, y }, value) => {
  maze[y][x] = value
}

// this should probably be more simple
const getPortals = maze => {
  const withCoords = maze.flatMap((row, y) =>
    row.map((value, x) => [value, { x, y }])
  )
  const halves = withCoords.filter(([value, _]) => isPortal(value))

  const nameToCoords = halves
    .map(([value, coords]) => {
      // find their better half
      const b = halves.find(
        ([other, otherCoords]) =>
          Math.abs(coords.x - otherCoords.x) <= 1 &&
          Math.abs(coords.y - otherCoords.y) <= 1 &&
          !isSame(coords, otherCoords)
      )

      const a = [value, coords]
      return [a, b]
    })
    .map(sortPortalPair)
    // we don't care about the letter coords. get the entrance/exit
    .reduce((output, { a, b }) => {
      const key = `${a[0]}${b[0]}`
      if (!(key in output)) {
        output[key] = []
      }
      output[key].push(a[1])
      output[key].push(b[1])
      return output
    }, {})

  return Object.entries(nameToCoords)
    .map(([name, coordList]) => {
      return [name, uniqBy(coordList, encode)]
    })
    .reduce((output, [name, coordList]) => {
      const portalCoords = coordList
        .flatMap(coords => getNeighbors(maze, coords))
        .filter(([value, _]) => isOpen(value) || typeof value === 'number')
        .map(([value, coords]) => coords)

      if (name === 'AA') {
        output.start = portalCoords[0]
      } else if (name === 'ZZ') {
        output.goal = portalCoords[0]
      } else {
        const [a, b] = portalCoords
        output[encode(a)] = b
        output[encode(b)] = a
      }
      return output
    }, {})
}

const getNeighbors = (maze, { x, y }) =>
  [
    // above
    { x, y: y - 1 },
    //right
    { x: x + 1, y },
    // below
    { x, y: y + 1 },
    //left
    { x: x - 1, y }
  ].map(coords => [get(maze, coords), coords])

const encode = ({ x, y }) => `${x},${y}`
const isSame = (a, b) => a.x === b.x && a.y === b.y
const isOpen = c => c === '.'
const sortPortalPair = ([a, b]) => {
  if (a[1].x < b[1].x || a[1].y < b[1].y) {
    return { a, b }
  } else {
    return { a: b, b: a }
  }
}

class Donut {
  constructor(maze) {
    this.maze = maze
    this.portals = getPortals(maze)
  }

  getNeighbors(coords) {
    return getNeighbors(this.maze, coords)
  }

  getAvailable({ x, y }) {
    return this.getNeighbors({ x, y })
      .map(([cell, coords]) => {
        if (cell === '#') {
          return null
        }

        if (isPortal(cell)) {
          const destCoords = this.portals[encode({ x, y })]
          if (!destCoords) return null
          const destCell = get(this.maze, destCoords)
          return isOpen(destCell) ? [destCell, destCoords] : null
        }

        if (typeof cell === 'number') {
          return null
        }

        return [cell, coords]
      })
      .filter(Boolean)
  }

  minSteps() {
    const { start } = this.portals
    let positions = [{ steps: 0, coords: start }]
    set(this.maze, start, 0)

    while (positions.length) {
      positions = sortBy(positions, p => -p.steps)
      const next = positions.pop()
      const available = this.getAvailable(next.coords)
      for (let i = 0; i < available.length; i++) {
        const coords = available[i][1]
        set(this.maze, coords, next.steps + 1)
        if (isSame(coords, this.portals.goal)) {
          return next.steps + 1
        }
        positions.push({
          coords,
          steps: next.steps + 1
        })
      }
    }
    throw new Error('Unable to find goal')
  }
}

const isPortal = c => c >= 'A' && c <= 'Z'

// const maze = parse(input)
// console.log(view(maze))
// console.log(getNeighbors(maze, { x: 2, y: 3 }))
// const donut = new Donut(maze)
// console.log(donut)

const part1 = input => {
  const donut = new Donut(parse(input))
  return donut.minSteps()
}

{
  const example = `         A
         A
  #######.#########
  #######.........#
  #######.#######.#
  #######.#######.#
  #######.#######.#
  #####  B    ###.#
BC...##  C    ###.#
  ##.##       ###.#
  ##...DE  F  ###.#
  #####    G  ###.#
  #########.#####.#
DE..#######...###.#
  #.#########.###.#
FG..#########.....#
  ###########.#####
             Z
             Z       `
  assert.equal(part1(example), 23)
}

{
  const example = `                   A
                   A
  #################.#############
  #.#...#...................#.#.#
  #.#.#.###.###.###.#########.#.#
  #.#.#.......#...#.....#.#.#...#
  #.#########.###.#####.#.#.###.#
  #.............#.#.....#.......#
  ###.###########.###.#####.#.#.#
  #.....#        A   C    #.#.#.#
  #######        S   P    #####.#
  #.#...#                 #......VT
  #.#.#.#                 #.#####
  #...#.#               YN....#.#
  #.###.#                 #####.#
DI....#.#                 #.....#
  #####.#                 #.###.#
ZZ......#               QG....#..AS
  ###.###                 #######
JO..#.#.#                 #.....#
  #.#.#.#                 ###.#.#
  #...#..DI             BU....#..LF
  #####.#                 #.#####
YN......#               VT..#....QG
  #.###.#                 #.###.#
  #.#...#                 #.....#
  ###.###    J L     J    #.#.###
  #.....#    O F     P    #.#...#
  #.###.#####.#.#####.#####.###.#
  #...#.#.#...#.....#.....#.#...#
  #.#####.###.###.#.#.#########.#
  #...#.#.....#...#.#.#.#.....#.#
  #.###.#####.###.###.#.#.#######
  #.#.........#...#.............#
  #########.###.###.#############
           B   J   C
           U   P   P   `
  assert.equal(part1(example), 58)
}

console.log(part1(input))

const getEdges = maze => {
  let top, bottom
  for (let y = 0; y < maze.length; y++) {
    let row = maze[y]
    if (!top && row.includes('#')) {
      top = y
    }
    if (top && !row.includes('#')) {
      bottom = y - 1
      break
    }
  }

  let topRow = maze[top]
  let left, right
  for (let x = 0; x < topRow.length; x++) {
    if (!left && topRow[x] === '#') {
      left = x
    }

    right = x
    if (left && topRow[x] === ' ') {
      right = x - 1
      break
    }
  }

  return { top, bottom, left, right }
}

const cloneMaze = maze => maze.map(row => row.map(a => a))

class RecursiveDonut {
  static fromMaze(maze) {
    return new RecursiveDonut(maze, getPortals(maze), getEdges(maze))
  }

  constructor(maze, portals, edges) {
    this.pristineMaze = cloneMaze(maze)
    this.portals = portals
    this.edges = edges
    this.mazeForLevel = { '0': maze }
  }

  isOuter(c) {
    return (
      c.x === this.edges.left ||
      c.x === this.edges.right ||
      c.y === this.edges.top ||
      c.y === this.edges.bottom
    )
  }

  getMaze(level) {
    if (!(level in this.mazeForLevel)) {
      this.mazeForLevel[level] = cloneMaze(this.pristineMaze)
    }
    return this.mazeForLevel[level]
  }

  getAvailable(position) {
    return getNeighbors(this.getMaze(position.level), position.coords)
      .map(([cell, coords]) => {
        if (cell === '#') {
          return null
        }

        if (isPortal(cell)) {
          const destCoords = this.portals[encode(position.coords)]
          if (!destCoords) return null

          const isOuter = this.isOuter(position.coords)

          if (isOuter && position.level === 0) return null
          const newLevel = isOuter ? position.level - 1 : position.level + 1

          const destCell = get(this.getMaze(newLevel), destCoords)
          if (!isOpen(destCell)) return null

          return {
            steps: position.steps + 1,
            coords: destCoords,
            level: newLevel
          }
        }

        if (typeof cell === 'number') {
          return null
        }

        set(this.getMaze(position.level), coords, position.steps + 1)
        return { coords, steps: position.steps + 1, level: position.level }
      })
      .filter(Boolean)
  }

  minSteps() {
    const { start } = this.portals
    set(this.getMaze(0), start, 0)
    let positions = [{ steps: 0, coords: start, level: 0 }]

    while (positions.length) {
      positions = sortBy(positions, p => -p.steps)
      const next = positions.pop()
      const available = this.getAvailable(next)
      for (let i = 0; i < available.length; i++) {
        const { coords } = available[i]
        if (isSame(coords, this.portals.goal)) {
          if (available[i].level === 0) {
            return available[i].steps
          } else {
            continue
          }
        }
        positions.push(available[i])
      }
    }
    throw new Error('Unable to find goal')
  }
}

const part2 = input => {
  const donut = RecursiveDonut.fromMaze(parse(input), 0)
  return donut.minSteps()
}

{
  const example = `             Z L X W       C
             Z P Q B       K
  ###########.#.#.#.#######.###############
  #...#.......#.#.......#.#.......#.#.#...#
  ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###
  #.#...#.#.#...#.#.#...#...#...#.#.......#
  #.###.#######.###.###.#.###.###.#.#######
  #...#.......#.#...#...#.............#...#
  #.#########.#######.#.#######.#######.###
  #...#.#    F       R I       Z    #.#.#.#
  #.###.#    D       E C       H    #.#.#.#
  #.#...#                           #...#.#
  #.###.#                           #.###.#
  #.#....OA                       WB..#.#..ZH
  #.###.#                           #.#.#.#
CJ......#                           #.....#
  #######                           #######
  #.#....CK                         #......IC
  #.###.#                           #.###.#
  #.....#                           #...#.#
  ###.###                           #.#.#.#
XF....#.#                         RF..#.#.#
  #####.#                           #######
  #......CJ                       NM..#...#
  ###.#.#                           #.###.#
RE....#.#                           #......RF
  ###.###        X   X       L      #.#.#.#
  #.....#        F   Q       P      #.#.#.#
  ###.###########.###.#######.#########.###
  #.....#...#.....#.......#...#.....#.#...#
  #####.#.###.#######.#######.###.###.#.#.#
  #.......#.......#.#.#.#.#...#...#...#.#.#
  #####.###.#####.#.#.#.#.###.###.#.###.###
  #.......#.....#.#...#...............#...#
  #############.#.#.###.###################
               A O F   N
               A A D   M    `
  assert.equal(part2(example), 396)
}

console.log(part2(input))
