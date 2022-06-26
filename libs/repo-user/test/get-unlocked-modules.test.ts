import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { User, Module } from '@modtree/entity'

const dbName = oneUp(__filename)
const db = getSource(dbName)
beforeAll(() =>
  setup(db)
    .then(() =>
      Repo.User.initialize({
        ...init.user1,
        modulesDone: ['CS1010'],
      })
    )
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

async function getUnlockedModules(user: User, moduleCode: string) {
  return Repo.User.getUnlockedModules(user, moduleCode)
}

it('returns an array of modules', async () => {
  await getUnlockedModules(t.user!, 'CS2100').then((modules) => {
    expect(modules).toBeArrayOf(Module)
  })
})

it('gets correct modules', async () => {
  // Get unlocked modules for CS2100
  await getUnlockedModules(t.user!, 'CS2100').then((modules) => {
    const codes = modules.map(flatten.module)
    expect(codes).toIncludeSameMembers(['CS2106', 'CS3210', 'CS3237'])
  })
})

it('does not modify User', async () => {
  // Also loads relations
  await Repo.User.findOneById(t.user!.id).then((res) => {
    const modulesDoneCodes = res.modulesDone.map(flatten.module)
    expect(modulesDoneCodes).toEqual(['CS1010'])
  })
})

it('returns empty array if module in User.modulesDone', async () => {
  // Get unlocked modules for CS1010, which is in User.modulesDone
  await getUnlockedModules(t.user!, 'CS1010').then((modules) => {
    expect(modules).toStrictEqual([])
  })
})
