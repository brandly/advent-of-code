from itertools import combinations

with open('02.txt') as f:
    input = [id.strip() for id in f.readlines()]

def part1():
    def letter_counts(str):
        counts = {}
        for char in str:
            if char in counts:
                counts[char] += 1
            else:
                counts[char] = 1
        return counts

    def has_exactly(num, counts):
        return num in counts.values()

    twos = 0
    threes = 0
    for id in input:
        counts = letter_counts(id)
        if has_exactly(2, counts):
            twos += 1
        if has_exactly(3, counts):
            threes += 1

    return twos * threes

print(part1())

def part2():
    def diff_count(a, b):
        count = 0
        for (x, y) in zip(a, b):
            if x != y:
                count += 1
        return count

    for (a, b) in combinations(input, 2):
        if diff_count(a, b) == 1:
            return ''.join([x for (x, y) in zip(a, b) if x == y])

print(part2())
