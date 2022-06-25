import { log, box } from '.'

const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

beforeEach(() => jest.clearAllMocks())

test('base', () => {
  expect(log).toBeDefined()
})

test('log', () => {
  expect(log.green).toBeInstanceOf(Function)
  log.green('athena')
  expect(consoleSpy).toBeCalledTimes(1)
})

test('box', () => {
  expect(box.green).toBeInstanceOf(Function)
  box.green('athena')
  expect(consoleSpy).toBeCalledTimes(1)
})
