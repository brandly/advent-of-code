with open('05.txt') as f:
    input = f.read().strip()

class Node(object):
    def __init__(self, data, prev, next):
        self.data = data
        self.prev = prev
        self.next = next

class List(object):
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, data):
        node = Node(data, None, None)
        if self.head is None:
            self.head = node
            self.tail = node
        else:
            tail = self.tail
            node.prev = tail
            tail.next = node
            self.tail = node

    def remove(self, node):
        prev = node.prev
        next = node.next

        if prev:
            prev.next = next
        if next:
            next.prev = prev

        node.prev = None
        node.next = None

        if self.head == node:
            self.head = next
        if self.tail == node:
            self.tail = prev

    def to_string(self):
        node = self.head
        str = ''
        while node:
            str += node.data
            node = node.next
        return str

    @staticmethod
    def from_string(str):
        l = List()
        for char in str:
            l.append(char)
        return l

def react(str):
    l = List.from_string(str)
    return react_list(l).to_string()

def react_list(l):
    node = l.head
    while node:
        char = node.data
        next = node.next
        if next is not None and char != next.data and (char.upper() == next.data or char == next.data.upper()):
            prev = node.prev
            following = next.next

            l.remove(node)
            l.remove(next)
            if prev:
                node = prev
            else:
                node = following
        else:
            node = node.next
    return l

example = 'dabAcCaCBAcCcaDA'
assert react(example) == 'dabCBAcaDA'

def part1():
    return len(react(input))

print(part1())

def char_range(c1, c2):
    # https://stackoverflow.com/questions/7001144/range-over-character-in-python
    for c in xrange(ord(c1), ord(c2)+1):
        yield chr(c)

def part2():
    every_len = []
    for char in char_range('a', 'z'):
        l = List.from_string(input)
        node = l.head
        while node:
            if node.data == char or node.data.lower() == char:
                goner = node
                if node.prev:
                    node = node.prev
                else:
                    node = node.next
                l.remove(goner)
            node = node.next
        every_len.append(len(react_list(l).to_string()))

    return min(every_len)

print(part2())
