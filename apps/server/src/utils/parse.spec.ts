import { parseCommaSeparatedString } from './parse'

const correct = [
  {
    type: 'one moduleCode',
    input: 'CS1010',
    expected: ['CS1010'],
  },
  {
    type: 'multiple moduleCodes',
    input: 'CS1010, MA2001, EL1101E',
    expected: ['CS1010', 'MA2001', 'EL1101E'],
  },
  {
    type: 'one quoted UUID',
    input: '009c5671-2e9c-4b15-850b-0469f7c8f62f',
    expected: ['009c5671-2e9c-4b15-850b-0469f7c8f62f'],
  },
  {
    type: 'one quoted string',
    input: 'sample',
    expected: ['sample'],
  },
  {
    type: 'trailing comma',
    input: 'MA2001,',
    expected: ['MA2001', ''],
  },
  {
    type: 'undefined input',
    expected: [],
  },
]

test.each(correct)('$type', (props) => {
  const { input, expected } = props
  expect(parseCommaSeparatedString(input as string)).toStrictEqual(expected)
})
