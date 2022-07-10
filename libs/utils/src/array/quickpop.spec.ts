import { quickpop } from '.'

const correct: [number[], number, number[], number][] = [
  [[3, 8, 7, 4, 9], 2, [3, 8, 9, 4], 7],
  [[3, 8, 7, 4, 9], 0, [9, 8, 7, 4], 3],
  [[3, 8, 7, 1, 9], 4, [3, 8, 7, 1], 9],
]

const errors: [any[], number, string][] = [
  [[undefined], 0, 'Quickpop somehow popped an undefined element'],
  [[1], 6, 'Out of bounds'],
  [[1], -10, 'Out of bounds'],
]

test.each(correct)(
  'quick-pop %s at index %d works',
  (received, popIndex, expected, returned) => {
    expect(quickpop(received, popIndex)).toEqual(returned)
    expect(received).toEqual(expected)
  }
)

test.each(errors)(
  'quick-pop %s at index %d throws %s',
  (received, popIndex, errorMessage) => {
    expect(() => quickpop(received, popIndex)).toThrow(Error(errorMessage))
  }
)
