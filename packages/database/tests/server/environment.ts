import axios from 'axios'
import { Agent } from 'http'
import { DeleteResult } from 'typeorm'
import { ResponseProps } from '../../types/api-response'
import { InitProps } from '../../types/init-props'

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
  private static async request<T extends keyof ResponseProps>(
    entity: T,
    props: InitProps[T]
  ): Promise<ResponseProps[T]> {
    return server.post(`${entity.toLowerCase()}/create`, props).then((res) => {
      expect(typeof res.data.id).toBe('string')
      expect(res.data.id.length).toBeGreaterThan(0)
      return res.data
    })
  }

  /**
   * sends a tested post request to create a user
   *
   * @param {InitProps['User']} props
   * @returns {Promise<User>}
   */
  static async User(props: InitProps['User']): Promise<ResponseProps['User']> {
    return Create.request('User', props)
  }

  /**
   * sends a tested post request to create a degree
   *
   * @param {InitProps['Degree']} props
   * @returns {Promise<Degree>}
   */
  static async Degree(
    props: InitProps['Degree']
  ): Promise<ResponseProps['Degree']> {
    return Create.request('Degree', props)
  }

  /**
   * sends a tested post request to create a degree
   *
   * @param {InitProps['Graph']} props
   * @returns {Promise<Graph>}
   */
  static async Graph(
    props: InitProps['Graph']
  ): Promise<ResponseProps['Graph']> {
    return Create.request('Graph', props)
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
  private static async request<T extends keyof ResponseProps>(
    entity: T,
    id: string
  ): Promise<DeleteResult> {
    return server.delete(`${entity.toLowerCase()}/delete/${id}`).then((res) => {
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
    return Delete.request('User', id)
  }

  /**
   * sends a tested delete request to delete a degree
   *
   * @param {string} id
   * @returns {Promise<DeleteResult>}
   */
  static async Degree(id: string): Promise<DeleteResult> {
    return Delete.request('Degree', id)
  }

  /**
   * sends a tested delete request to delete a graph
   *
   * @param {string} id
   * @returns {Promise<DeleteResult>}
   */
  static async Graph(id: string): Promise<DeleteResult> {
    return Delete.request('Graph', id)
  }
}

export const t: any = {}
