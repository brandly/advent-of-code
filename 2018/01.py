with open('01.txt') as f:
    input = [int(num) for num in f.readlines()]

def part1():
    return sum(input)

def part2():
    seen = {}
    val = 0
    index = 0
    while True:
        val += input[index]
        if val in seen:
            return val
        seen[val] = True
        index = (index + 1) % len(input)

print(part1())
print(part2())
