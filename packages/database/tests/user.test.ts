import { container, endpoint } from '../src/data-source'
import { setup } from './setup'
import { Init } from '../types/modtree'
import { UserRepository } from '../src/repository'
import { init } from './init'

beforeAll(async () => {
  await setup()
})

jest.setTimeout(20000)

test('canTakeModule is successful', async () => {
  const props: Init.UserProps = init.user1

  await UserRepository.initialize(props)

  const res = await endpoint(() =>
    container(async () => {
      // find user
      const user = await UserRepository.findOne({
        where: {
          username: 'nvkhang',
        },
      })

      // user is initialized with MA2001 completed
      return await user.canTakeModule('MA2101')
    })
  )

  expect(res).toEqual(true)
})
