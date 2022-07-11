import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const moduleRepo = new ModuleRepository(mocks.db)

it('returns correct results', async () => {
  const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
  await Promise.all(
    modulesTested.map((x) =>
      moduleRepo.canTakeModule(['MA2001'], ['MA2219'], x)
    )
  ).then((res) => {
    expect(res).toStrictEqual([true, false, false, true])
  })
})

// it('returns false for modules done', async () => {
//   await canTakeModule(['MA2001'], [], 'MA2001').then((res) =>
//     expect(res).toBe(false)
//   )
// })
//
// it('returns false for modules doing', async () => {
//   await canTakeModule([], ['MA2001'], 'MA2001').then((res) =>
//     expect(res).toBe(false)
//   )
// })
//
// it('Rejects invalid module code', async () => {
//   await canTakeModule(['CM1102'], ['CS1010'], 'NOT_VALID').then((res) => {
//     expect(res).toBe(false)
//   })
// })
