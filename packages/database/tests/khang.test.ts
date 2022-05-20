import { container, endpoint } from '../src/data-source'
import { UserRepository } from '../src/repository'
import { Init } from '../types/modtree'
import { init } from './init'
import { setup, importChecks } from './setup'

importChecks({
  repositories: [UserRepository]
})

beforeAll(setup)

jest.setTimeout(20000)

test('canTakeModule is successful', async () => {
  const props: Init.UserProps = init.emptyUser
  props.modulesDone.push('MA2001')
  props.modulesDoing.push('MA2219')
  await UserRepository.initialize(props)
  const res = await endpoint(() =>
    container(async () => {
      // find user
      const user = await UserRepository.findOne({
        where: {
          username: props.username,
        },
      })
      const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
      return Promise.all(
        modulesTested.map((x) => UserRepository.canTakeModule(user, x))
      )
    })
  )
  expect(res).toStrictEqual([true, false, false, true])
})
