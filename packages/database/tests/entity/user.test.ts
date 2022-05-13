import { setup } from '../setup'
import { endpoint } from '../../src/data-source'
import { save } from '../../src/functions/user'
import { container, AppDataSource } from '../../src/data-source'
import { User } from '../../src/entity'

beforeAll(async () => {
  await setup()
})

jest.setTimeout(20000)

test('canTakeModule is successful', async () => {
  // currently adds Khang
  await save()

  const res = await endpoint(
    async () =>
      await container(async () => {
        // find user
        const repo = AppDataSource.getRepository(User)
        const user = await repo.findOne({
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
