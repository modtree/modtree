import { getSource } from '@src/data-source'
import { setup, teardown, t, Repo } from '@environment'
import { oneUp } from '@utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

it('getPostReqs == fulfillRequirements for single mod', async () => {
  const modulesDone = ['MA2001']
  expect.assertions(2)
  await Repo.Module.getPostReqs(modulesDone)
    .then((res) => {
      expect(res).toBeInstanceOf(Array)
      t.postReqsCodes = res
    })
    .then(() =>
      Repo.Module.findOneBy({
        moduleCode: 'MA2001',
      })
    )
    .then((mod) => {
      expect(t.postReqsCodes.sort()).toStrictEqual(
        mod.fulfillRequirements.sort()
      )
    })
})

it('getPostReqs == union of fulfillRequirements for multiple mods', async () => {
  const modulesDone = ['MA2001', 'CS1010']
  expect.assertions(2)
  await Repo.Module.getPostReqs(modulesDone)
    .then((res) => {
      expect(res).toBeInstanceOf(Array)
      t.postReqsCodes = res
    })
    .then(() => Repo.Module.findByCodes(modulesDone))
    .then((mods) => {
      const combined = mods[0].fulfillRequirements.concat(
        mods[1].fulfillRequirements
      )
      const postReqs = Array.from(new Set(combined))
      expect(t.postReqsCodes.sort()).toStrictEqual(postReqs.sort())
    })
})

it('Returns empty array for modules with no post reqs', async () => {
  const modulesDone = ['CP2106']
  expect.assertions(2)
  await Repo.Module.getPostReqs(modulesDone).then((res) => {
    expect(res).toBeInstanceOf(Array)
    expect(res.length).toEqual(0)
  })
})