import axios from 'axios'
import { Agent } from 'http'
import { User } from '../../src/entity'
import type * as InitProps from '../../types/init-props'

export const server = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 60000,
  maxRedirects: 10,
  httpsAgent: new Agent({ keepAlive: true }),
})

export class Mockup {
  static async User(props: InitProps.User): Promise<User> {
    return server.post('user/create', props).then((res) => {
      const user: User = res.data
      expect(typeof user.id).toBe('string')
      expect(user.id.length).toBeGreaterThan(0)
      return user
    })
  }
}
