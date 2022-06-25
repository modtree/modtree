import { log, box } from '.'

const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

beforeEach(() => jest.clearAllMocks())

test('base', () => {
  expect(log).toBeDefined()
})

test('log', () => {
  expect(log.green).toBeInstanceOf(Function)
  log.green('athena')
  expect(consoleSpy.mock.calls[0][0]).toEqual('\x1b[32mathena\x1b[39m')
})

test('box', () => {
  expect(box.green).toBeInstanceOf(Function)
  box.green('athena')
  expect(consoleSpy.mock.calls[0][0]).toEqual(
    '\x1B[32m┌────────┐\x1B[39m\n\x1B[32m│\x1B[39m athena \x1B[32m│\x1B[39m\n\x1B[32m└────────┘\x1B[39m'
  )
})
