# from itertools import groupby

with open('04.txt') as f:
    input = [entry.strip() for entry in f.readlines()]

def group_lines_by_shift():
    input.sort()
    shifts_by_line = []
    shift = []
    for line in input:
        if 'begins shift' in line:
            if len(shift) > 0:
                shifts_by_line.append(shift)
            shift = [line]
        else:
            shift.append(line)
    return shifts_by_line

def get_shifts():
    shift_lines = group_lines_by_shift()
    return [parse_shift(shift) for shift in shift_lines]

def parse_shift(shift):
    def parse_event(line):
        time = get_timestamp_from_line(line)['min']
        return {
            'time': time,
            'awake': 'wakes up' in line
        }

    _, rest = shift.pop(0).split('Guard #')
    id = rest.split(' ').pop(0)

    return {
        'id': int(id),
        'events': [parse_event(line) for line in shift]
    }

def get_timestamp_from_line(line):
    before, _ = line.split('] ')
    time = before.split(' ').pop()
    hours, minutes = time.split(':')
    return { 'min': int(minutes), 'hr': int(hours) }

def time_asleep(shift):
    total = 0
    when_asleep = 0
    for event in shift['events']:
        if event['awake']:
            total += event['time'] - when_asleep
        else:
            when_asleep = event['time']
    return total

def id_to_time_asleep(all_shifts):
    result = {}
    for shift in all_shifts:
        id = shift['id']
        if id not in result:
            result[id] = 0
        result[id] += time_asleep(shift)
    return result

def get_minute_time_map(shifts):
    min_to_times_asleep = {}
    for shift in shifts:
        when_asleep = 0
        for event in shift['events']:
            if event['awake']:
                for minute in range(when_asleep, event['time']):
                    if minute not in min_to_times_asleep:
                        min_to_times_asleep[minute] = 1
                    else:
                        min_to_times_asleep[minute] += 1
            else:
                when_asleep = event['time']
    return min_to_times_asleep

def part1():
    shifts = get_shifts()
    stats = id_to_time_asleep(shifts)
    sleeping_most = max(stats, key=stats.get)
    their_shifts = [shift for shift in shifts if shift['id'] == sleeping_most]

    min_to_times_asleep = get_minute_time_map(their_shifts)

    time_asleep_most = max(min_to_times_asleep, key=min_to_times_asleep.get)
    return sleeping_most * time_asleep_most

print(part1())

def groupby(stuff, get):
    lookup = {}
    for item in stuff:
        id = get(item)
        if id not in lookup:
            lookup[id] = []
        lookup[id].append(item)

    results = []
    for key in lookup.keys():
        results.append((key, lookup[key]))
    return results

def part2():
    shifts = get_shifts()
    the_goods = []
    for id, their_shifts in groupby(shifts, lambda s: s['id']):
        minutes_slept = get_minute_time_map(list(their_shifts))
        if len(minutes_slept):
            time_asleep_most = max(minutes_slept, key=minutes_slept.get)
            the_goods.append({
                'id': id,
                'minute': time_asleep_most,
                'length': minutes_slept[time_asleep_most]
            })

    max_min = max(the_goods, key=lambda x: x['length'])
    return max_min['id'] * max_min['minute']

print(part2())
