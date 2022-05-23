import { container, endpoint, getSource } from '../../src/data-source'
import { Module, User } from '../../src/entity'
import { ModuleRepository, UserRepository } from '../../src/repository'
import { Init } from '../../types/modtree'
import { init } from '../init'
import { setup, importChecks, teardown } from '../environment'

const dbName = 'test_user_eligibleModules'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, User],
  repositories: [ModuleRepository(db), UserRepository(db)],
})

jest.setTimeout(20000)

describe('User.eligibleModules', () => {
  let user: User
  it('Saves a user', async () => {
    const props: Init.UserProps = init.emptyUser
    props.modulesDone.push('MA2001')
    props.modulesDoing.push('MA2219')
    await UserRepository(db).initialize(props)
    const res = await endpoint(db, () =>
      container(db, async () => {
        return await UserRepository(db).findOneByUsername(props.username)
      })
    )
    expect(res).toBeDefined()
    if (!res) return
    user = res
  })

  it('Adds only all post-requisites of modules done', async () => {
    // Get eligible modules
    const eligibleModules = await container(db, async () => {
      return await UserRepository(db).eligibleModules(user)
    })
    expect(eligibleModules).toBeDefined()
    if (!eligibleModules) return
    // Get fulfillRequirements of MA2001 (the only module done)
    const modules = await endpoint(db, () =>
      container(db, async () => {
        // find user
        return await ModuleRepository(db).findByCodes(['MA2001'])
      })
    )
    expect(modules).toBeDefined()
    if (!modules) return
    expect(modules).toBeInstanceOf(Array)
    expect(modules.length).toEqual(1)
    const module = modules[0]
    // Compare module codes
    const eligibleModuleCodes = eligibleModules.map((one: Module) => one.moduleCode)
    expect(eligibleModuleCodes.sort()).toEqual(module.fulfillRequirements.sort())
    expect(eligibleModuleCodes.length).toEqual(module.fulfillRequirements.length)
  })
})
