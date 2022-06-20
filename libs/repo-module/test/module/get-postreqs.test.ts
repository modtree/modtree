import { setup, teardown, t, Repo } from '@modtree/test-env'
import { oneUp, unique } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { In } from 'typeorm'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

describe('single query', () => {
  it('returns an array', async () => {
    await Repo.Module!.getPostReqs(['MA2001']).then((res) => {
      expect(res).toBeInstanceOf(Array)
      t.postReqsCodes = res
    })
  })

  it('returns correct modules', async () => {
    await Repo.Module!.findOneByOrFail({
      moduleCode: 'MA2001',
    }).then((module) => {
      expect(t.postReqsCodes).toIncludeSameMembers(module.fulfillRequirements)
    })
  })
})

describe('multi query', () => {
  it('returns an array', async () => {
    await Repo.Module!.getPostReqs(['MA2001', 'CS1010']).then((res) => {
      expect(res).toBeInstanceOf(Array)
      t.postReqsCodes = res
    })
  })

  it('returns correct modules', async () => {
    const codes: string[] = []
    await Repo.Module!.findBy({
      moduleCode: In(['MA2001', 'CS1010']),
    }).then((modules) => {
      modules.forEach((module) => {
        codes.push(...module.fulfillRequirements)
      })
    })
    expect(t.postReqsCodes).toIncludeSameMembers(unique(codes))
  })
})

it('returns [] for modules with no post reqs', async () => {
  await Repo.Module!.getPostReqs(['CP2106']).then((res) => {
    expect(res).toStrictEqual([])
  })
})
