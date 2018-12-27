def parse(str):
    before, after = str.split(' @ ')
    id = before[1:]
    start, size = after.split(': ')
    x, y = start.split(',')
    width, height = size.split('x')
    return {
        'id': id,
        'x': int(x),
        'y': int(y),
        'width': int(width),
        'height': int(height)
    }

with open('03.txt') as f:
    input = [parse(id.strip()) for id in f.readlines()]

def part1():
    fabric = {}
    for claim in input:
        every_x = [claim['x'] + x for x in range(0, claim['width'])]
        every_y = [claim['y'] + y for y in range(0, claim['height'])]
        for x in every_x:
            for y in every_y:
                key = str(x) + 'x' + str(y)
                if key in fabric:
                    fabric[key] += 1
                else:
                    fabric[key] = 1
    return len([val for val in fabric.values() if val > 1])

print(part1())

def part2():
    fabric = {}
    for claim in input:
        every_x = [claim['x'] + x for x in range(0, claim['width'])]
        every_y = [claim['y'] + y for y in range(0, claim['height'])]
        for x in every_x:
            for y in every_y:
                key = str(x) + 'x' + str(y)
                if key not in fabric:
                    fabric[key] = []

                fabric[key].append(claim['id'])

    id_overlaps = {}
    for claim in input:
        id_overlaps[claim['id']] = False

    for key in fabric.keys():
        if len(fabric[key]) > 1:
            for id in fabric[key]:
                id_overlaps[id] = True

    return [id for id in id_overlaps.keys() if id_overlaps[id] == False][0]

print(part2())
