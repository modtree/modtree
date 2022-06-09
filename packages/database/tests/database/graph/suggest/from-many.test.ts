import { container, getSource } from '@src/data-source'
import { Module } from '@modtree/entity'
import { setup, teardown, Repo, t } from '@environment'
import { InitProps } from '@modtree/types'
import { init } from '@tests/init'
import { oneUp } from '@utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const degreeProps: InitProps['Degree'] = {
  moduleCodes: [
    'CS1010',
    'CS1231',
    'CG2111A', // in modulesDone, should not suggest
    'IT2002', // in modulesDoing, should not suggest
    'CS2030', // unlocks CS2102, CS2104, CS3240, IS2103, IS2102 (5 mods)
    'CS2100', // unlocks CS3210, CS3237, CS2106 (3 mods)
    'CS2040S', // unlocks CS4269, CS5469 (2 mods, alias count as 2)
    'CS2107', // unlocks IS4231, IS5151, IFS4101 (3 mods)
    'CP2106', // unlocks 0 mods
    'CS3234', // unlocks 0 mods
    'CS2109S', // unlocks 0 mods
  ],
  title: 'Custom Degree',
}

const userProps: InitProps['User'] = {
  ...init.emptyUser,
  modulesDone: ['CS1010', 'CG2111A', 'CS1231'],
  modulesDoing: ['IT2002'],
}

jest.setTimeout(30000)

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(userProps),
        Repo.Degree.initialize(degreeProps),
      ])
    )
    .then(([user, degree]) =>
      Repo.Graph.initialize({
        userId: user.id,
        degreeId: degree.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: false,
      })
    )
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

const expected = [
  /* CS1010 unlocks */
  'CS2107',
  'CS2100',
  'CS2030',
  'CP2106',
  'CS2040C',
  'CS2040',
  'CS2030S',
  /* CS1231 unlocks */
  'CS3234',
  'MA2202',
  'MA2202S',
  'MA2214',
  'MA2219',
  'MA3205',
  'CS2109S',
  /* both required to unlock */
  'CS2040S',
]

describe('Graph.suggestModules (from many)', () => {
  it('Suggests post-reqs of the given module which the user is eligible for', async () => {
    const selectedModules = ['CS1010', 'CS1231']
    const res = await container(db, () =>
      Repo.Graph.suggestModules(t.graph, selectedModules)
    )
    expect(res).toBeDefined()
    if (!res) return
    res.forEach((one) => {
      expect(one).toBeInstanceOf(Module)
    })
    t.suggestedModulesCodes = res.map((one) => one.moduleCode)
    const copy = [...t.suggestedModulesCodes]
    expect(copy.sort()).toStrictEqual(expected.sort())
  })

  it('Suggests post-reqs of the given module in our current desired priority', async () => {
    // unlocks 5, 3, 3, 2, 0, 0, 0 mods
    const degreeModules = ['CS2030', 'CS2100', 'CS2107', 'CS2040S', 'CP2106', 'CS2109S', 'CS3234']
    // unlocks 13, 2, 1, 1, 0, 0, 0, 0 mods
    const nonDegreeModules = ['CS2040', 'CS2040C', 'MA2214', 'MA3205', 'CS2030S', 'MA2202', 'MA2202S', 'MA2219']
    const expected = degreeModules.concat(nonDegreeModules)
    expect(t.suggestedModulesCodes).toEqual(expected)
  })
})
