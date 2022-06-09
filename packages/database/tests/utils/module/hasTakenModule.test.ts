import { hasTakenModule } from '@utils'

it('Returns true if module is in modulesDone', () => {
  const modulesDone = ['CS1010']
  const modulesDoing = ['MA2001']
  const res = hasTakenModule(modulesDone, modulesDoing, 'CS1010')
  expect(res).toEqual(true)
})

it('Returns true if module is in modulesDoing', () => {
  const modulesDone = ['CS1010']
  const modulesDoing = ['MA2001']
  const res = hasTakenModule(modulesDone, modulesDoing, 'MA2001')
  expect(res).toEqual(true)
})

it('Returns false if module is neither in modulesDone nor in modulesDoing', () => {
  const modulesDone = ['CS1010']
  const modulesDoing = ['MA2001']
  const res = hasTakenModule(modulesDone, modulesDoing, 'PC1201')
  expect(res).toEqual(false)
})
