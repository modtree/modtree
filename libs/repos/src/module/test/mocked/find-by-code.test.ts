import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../../base')
jest.mock('../../../module')

const fakeData = {
  module: [{ moduleCode: 'CS1010' }],
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))

it('single code', async () => {
  const received = await moduleRepo.findByCode('CS1010')
  expect(received.moduleCode).toBe('CS1010')
})

it('invalid code', async () => {
  /** This is the mocked error. */
  expect(moduleRepo.findByCode('invalid_code')).rejects.toThrow(
    Error('Invalid module code')
  )
})
