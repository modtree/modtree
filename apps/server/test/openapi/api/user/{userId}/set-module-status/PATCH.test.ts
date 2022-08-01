import { init, postman } from '../../../../../utils'
import { ModuleStatus } from '@modtree/types'

let userId: string

it('create a user', async () => {
  return postman.post('/user', init.User).then((res) => {
    expect(res.status).toBe(200)
    userId = res.data.data.id
  })
})

it('set module status', async () => {
  return postman
    .patch(`/user/${userId}/set-module-status`, {
      moduleCodes: ['CS1010'],
      status: ModuleStatus.DONE,
    })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
