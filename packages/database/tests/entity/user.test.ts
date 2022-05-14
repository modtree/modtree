import { setup } from '../setup'
import { endpoint } from '../../src/data-source'
import { container, AppDataSource } from '../../src/data-source'
import { User } from '../../src/entity'
import { UserProps } from '../../types/modtree'

beforeAll(async () => {
  await setup()
})

jest.setTimeout(20000)

test('canTakeModule is successful', async () => {
  const props: UserProps = {
    displayName: 'Nguyen Vu Khang',
    username: 'nvkhang',
    modulesCompleted: ['MA2001'],
    modulesDoing: ['MA2219'],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
  }
  await User.save(props)

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
