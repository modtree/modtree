import { container, endpoint } from '../src/data-source'
import { setup } from './setup'
import { UserInitProps } from '../types/modtree'
import { UserRepository } from '../src/repository'

beforeAll(async () => {
  await setup()
})

jest.setTimeout(20000)

test('canTakeModule is successful', async () => {
  const props: UserInitProps = {
    displayName: 'Nguyen Vu Khang',
    username: 'nvkhang',
    modulesDone: ['MA2001'],
    modulesDoing: ['MA2219'],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
  }
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
