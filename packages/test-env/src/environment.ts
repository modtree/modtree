import axios from 'axios'
import { Agent } from 'http'
import { DeleteResult, DataSource, Repository } from 'typeorm'
import { ModtreeApiResponse, InitProps, Repositories } from '@modtree/types'
import { config } from '@modtree/typeorm-config'
import { sql } from '@modtree/sql'
import { User, Graph, Degree } from '@modtree/entity'

type SetupOptions = {
  initialize: boolean
}

const Repo: Repositories = {}
/**
 * pre-test setup
 *
 * @param {DataSource} db
 * @param {SetupOptions} opts
 * @returns {Promise<void>}
 */
export async function setup(
  db: DataSource,
  opts?: SetupOptions
): Promise<void> {
  if (db.options.database === undefined) return
  await sql
    .restoreFromFile(db.options.database.toString(), config.restoreSource)
    .then(async () => {
      // by default, initialize a new connection
      if (!opts) {
        return db.initialize()
      }
      // else, read the config
      if (opts.initialize) {
        return db.initialize()
      }
    })
}

/**
 * post-test teardown
 *
 * @param {DataSource} db
 */
export async function teardown(db: DataSource) {
  if (db.options.database === undefined) return
  const drop = sql.dropDatabase(db.options.database.toString())
  if (db.isInitialized) {
    return db.destroy().then(() => drop)
  }
  return drop
}

type ImportCheckProps = { entities?: any[]; repositories?: Repository<any>[] }
/**
 * check imports before every test
 *
 * @param {ImportCheckProps} props
 */
export function importChecks(props: ImportCheckProps) {
  const entities = props.entities || []
  const repositories = props.repositories || []
  test('imports are all defined', () => {
    entities.forEach((e) => {
      expect(e).toBeDefined()
    })
    repositories.forEach((e) => {
      expect(e).toBeDefined()
    })
  })
}

type TestProps = {
  user: User
  user1: User
  user2: User
  degree: Degree
  degree1: Degree
  degree2: Degree
  graph: Graph
  graph1: Graph
  graph2: Graph
  userId: string
  userId1: string
  userId2: string
  degreeId: string
  degreeId1: string
  degreeId2: string
  graphId: string
  graphId1: string
  graphId2: string
  combinedModuleCodes: string[]
  postReqsCodes: string[]
  postReqs: string[]
  moduleCodes: string[]
  suggestedModulesCodes: string[]
}

export const t: Partial<TestProps> = {}
export { Repo }

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
  // TODO: find some other way than to overload the *** out of this function
  private static async request(
    entity: 'User',
    props: InitProps['User']
  ): Promise<ModtreeApiResponse.User>
  private static async request(
    entity: 'Degree',
    props: InitProps['Degree']
  ): Promise<ModtreeApiResponse.Degree>
  private static async request(
    entity: 'Graph',
    props: InitProps['Graph']
  ): Promise<ModtreeApiResponse.Graph>
  private static async request(
    entity: 'Module',
    props: InitProps['Module']
  ): Promise<ModtreeApiResponse.Module>
  private static async request(
    entity: 'ModuleCondensed',
    props: InitProps['ModuleCondensed']
  ): Promise<ModtreeApiResponse.ModuleCondensed>
  private static async request(entity: string, props: any): Promise<any> {
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
  static async User(
    props: InitProps['User']
  ): Promise<ModtreeApiResponse.User> {
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
  ): Promise<ModtreeApiResponse.Degree> {
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
  ): Promise<ModtreeApiResponse.Graph> {
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
  private static async request(entity: string, id: any): Promise<DeleteResult> {
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
