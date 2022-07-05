import { log } from '.'

const consoleSpy = jest.spyOn(console, 'debug').mockImplementation(() => {})

beforeEach(() => jest.clearAllMocks())

test('base', () => {
  expect(log).toBeDefined()
})

test('log', () => {
  expect(log.green).toBeInstanceOf(Function)
  log.green('athena')
  expect(consoleSpy).toBeCalledTimes(1)
})
