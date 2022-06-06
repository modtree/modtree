import axios from 'axios'
import { Agent } from 'http'
import { DeleteResult } from 'typeorm'
import { User, Degree, Graph, Base } from '../../src/entity'
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
   * a standardized request for entity creation
   *
   * @param {string} entity route
   * @param {typeof InitProps} props
   * @returns {Promise<T>}
   */
  private static async request<T extends Base>(
    entity: string,
    props: typeof InitProps
  ): Promise<T> {
    return server.post(`${entity}/create`, props).then((res) => {
      const entity: T = res.data
      expect(typeof entity.id).toBe('string')
      expect(entity.id.length).toBeGreaterThan(0)
      return entity
    })
  }

  /**
   * sends a tested post request to create a user
   *
   * @param {InitProps.User} props
   * @returns {Promise<User>}
   */
  static async User(props: InitProps.User): Promise<User> {
    return Create.request('user', props)
  }

  /**
   * sends a tested post request to create a degree
   *
   * @param {InitProps.Degree} props
   * @returns {Promise<Degree>}
   */
  static async Degree(props: InitProps.Degree): Promise<Degree> {
    return Create.request('degree', props)
  }

  /**
   * sends a tested post request to create a degree
   *
   * @param {InitProps.Graph} props
   * @returns {Promise<Graph>}
   */
  static async Graph(props: InitProps.Graph): Promise<Graph> {
    return Create.request('graph', props)
  }
}

/**
 * to be used in tearing down server tests
 * tests are included inside too
 */
export class Delete {
  /**
   * a standardized request for entity deletions
   *
   * @param {string} entity route
   * @param {string} id of entity
   * @returns {Promise<DeleteResult>}
   */
  private static async request(
    entity: string,
    id: string
  ): Promise<DeleteResult> {
    return server.delete(`${entity}/delete/${id}`).then((res) => {
      expect(res.data).toMatchObject({ deleteResult: { raw: [], affected: 1 } })
      return res.data
    })
  }

  /**
   * sends a tested delete request to delete a user
   *
   * @param {string} id
   * @returns {Promise<DeleteResult>}
   */
  static async User(id: string): Promise<DeleteResult> {
    return Delete.request('user', id)
  }

  /**
   * sends a tested delete request to delete a degree
   *
   * @param {string} id
   * @returns {Promise<DeleteResult>}
   */
  static async Degree(id: string): Promise<DeleteResult> {
    return Delete.request('degree', id)
  }

  /**
   * sends a tested delete request to delete a graph
   *
   * @param {string} id
   * @returns {Promise<DeleteResult>}
   */
  static async Graph(id: string): Promise<DeleteResult> {
    return Delete.request('graph', id)
  }
}
