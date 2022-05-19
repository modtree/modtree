import { container, endpoint } from '../src/data-source'
import { setup } from './setup'
import { UserRepository } from '../src/repository'
import { init } from './init'

beforeAll(async () => {
  await setup()
})

jest.setTimeout(20000)

test('canTakeModule is successful', async () => {
  const props = init.user1
  props.modulesDone.push('MA2002')
  console.log(props)
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
      return Promise.all(modulesTested.map((x) => user.canTakeModule(x)))
    })
  )
  expect(res).toStrictEqual([true, false, false, true])
})
