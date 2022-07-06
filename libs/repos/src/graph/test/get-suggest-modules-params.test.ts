import { setup, teardown, t, init, Repo } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const degreeProps = {
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
  title: 'Test Degree',
}

const userProps = {
  ...init.user1,
  modulesDone: ['CS1010', 'CS1231'],
  modulesDoing: ['IT2002', 'CG2111A'],
}

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(userProps),
        Repo.Degree.initialize(degreeProps),
      ])
    )
    .then(([user, degree]) => {
      t.user = user
      return Repo.Graph.initialize({
        title: 'Test Graph',
        userId: user.id,
        degreeId: degree.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: false,
      })
    })
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

it('returns an array of arrays', async () => {
  await Repo.Graph.getSuggestModulesParams(t.graph!, ['CM1102']).then((res) => {
    expect(res).toBeArrayOf(Array)
    // res.forEach((e) => expect(typeof e).toBe('string'))
    t.arrayOfArrays = res
  })
})

it('the array has length of 4', () => {
  expect(t.arrayOfArrays).toHaveLength(4)
})

it('each nested array contains only strings', () => {
  t.arrayOfArrays!.forEach((nestedArr) => {
    nestedArr.forEach((e) => expect(typeof e).toBe('string'))
  })
})

it('1/4: correct modules done', () => {
  const modulesDone = t.arrayOfArrays![0]
  expect(modulesDone).toIncludeSameMembers(userProps.modulesDone)
})

it('2/4: correct modules doing', () => {
  const modulesDoing = t.arrayOfArrays![1]
  expect(modulesDoing).toIncludeSameMembers(userProps.modulesDoing)
})

it('3/4: correct modules selected', () => {
  const modulesSelected = t.arrayOfArrays![2]
  expect(modulesSelected).toIncludeSameMembers(['CM1102'])
})

it('4/4: correct required modules', () => {
  const requiredModules = t.arrayOfArrays![3]
  expect(requiredModules).toIncludeSameMembers(degreeProps.moduleCodes)
})
