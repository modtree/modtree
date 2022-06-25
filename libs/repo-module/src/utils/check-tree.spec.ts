import { db } from '@modtree/typeorm-config'
import { setup, Repo, teardown } from '@modtree/test-env'
import { checkTree } from '.'

beforeAll(() => setup(db, { restore: false }))
afterAll(() => teardown(db))

it('true for mods without pre-reqs', async () => {
  await Repo.Module!.findByCodes(['CS1010', 'MA1301', 'EL1101E']).then(
    (modules) => {
      modules.forEach((module) => {
        expect(checkTree(module.prereqTree, [])).toEqual(true)
      })
    }
  )
})

it('true if pre-reqs are cleared', async () => {
  await Repo.Module!.findOneByOrFail({
    moduleCode: 'CS2040S',
  }).then((module) => {
    expect(checkTree(module.prereqTree, ['CS1231', 'CS1010'])).toEqual(true)
  })
})

it("false if pre-reqs aren't cleared", async () => {
  await Repo.Module!.findOneByOrFail({
    moduleCode: 'CS2040S',
  }).then((module) => {
    expect(checkTree(module.prereqTree, [])).toEqual(false)
  })
})
