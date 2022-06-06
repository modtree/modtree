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

/**
 * to be used in setting up server tests
 * tests are included inside too
 */
export class Create {
  /**
   * sends a tested post request to create a user
   * @param {InitProps.User} props
   * @returns {Promise<User>}
   */
  static async User(props: InitProps.User): Promise<User> {
    return server.post('user/create', props).then((res) => {
      const user: User = res.data
      expect(typeof user.id).toBe('string')
      expect(user.id.length).toBeGreaterThan(0)
      return user
    })
  }
}

/**
 * to be used in tearing down server tests
 * tests are included inside too
 */
export class Delete {
  /**
   * sends a tested delete request to delete a user
   * @param {string} id
   */
  static async User(id: string) {
    return server.delete(`user/delete/${id}`).then((res) => {
      expect(res.data).toMatchObject({ deleteResult: { raw: [], affected: 1 } })
    })
  }
}
