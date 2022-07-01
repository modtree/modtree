import { Degree, Graph, Module, ModuleCondensed, User } from '@modtree/entity'
import { sql } from '@modtree/sql'
import { config } from '@modtree/typeorm-config'
import { InitProps, ModtreeApiResponse, Repositories } from '@modtree/types'
import axios from 'axios'
import { Agent } from 'http'
import { DataSource, DeleteResult } from 'typeorm'
import {
  ModuleRepository,
  ModuleCondensedRepository,
} from '@modtree/repo-module'
import { DegreeRepository } from '@modtree/repo-degree'
import { ModuleFullRepository } from '@modtree/repo-module-full'
import { GraphRepository } from '@modtree/repo-graph'
import { UserRepository } from '@modtree/repo-user'
import { Api } from '@modtree/repo-api'

/**
 * imports custom matcher types
 */
import './matcher-types'

type SetupOptions = {
  initialize?: boolean
  restore?: boolean
}

/**
 * initialize with default db
 */
let Repo: Repositories
let api: Api

/**
 * pre-test setup
 *
 * @param {DataSource} db
 * @param {SetupOptions} _opts
 * @returns {Promise<void>}
 */
export async function setup(
  db: DataSource,
  _opts?: SetupOptions
): Promise<void> {
  const opts = { initialize: true, restore: true }
  Object.assign(opts, _opts)
  const startConnection = () =>
    db.initialize().then((db) => {
      /**
       * overwrite default db with the setup function's db parameter
       */
      api = new Api(db)
      Repo = {
        ModuleFull: new ModuleFullRepository(db),
        User: new UserRepository(db),
        Degree: new DegreeRepository(db),
        Graph: new GraphRepository(db),
        Module: new ModuleRepository(db),
        ModuleCondensed: new ModuleCondensedRepository(db),
      }
    })
  if (db.options.database === undefined) return
  if (opts.restore) {
    await sql.restoreFromFile(
      db.options.database.toString(),
      config.restoreSource
    )
  }
  // by default, initialize a new connection
  if (!opts) {
    return startConnection()
  }
  // else, read the config
  if (opts.initialize) {
    return startConnection()
  }
  return
}

/**
 * post-test teardown
 *
 * @param {DataSource} db
 */
export async function teardown(db: DataSource, dropDatabase: boolean = false) {
  if (db.options.database === undefined) return
  if (db.isInitialized) {
    await db.destroy()
  }
  if (dropDatabase) {
    await sql.dropDatabase(db.options.database.toString())
  }
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
  modules: Module[]
  modulesCondensed: ModuleCondensed[]
  combinedModuleCodes: string[]
  postReqsCodes: string[]
  postReqs: string[]
  moduleCodes: string[]
  suggestedModulesCodes: string[]
  count: number
  arrayOfArrays: string[][]
}

export const t: Partial<TestProps> = {}
export { Repo, api }

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
  /* eslint-disable @typescript-eslint/no-explicit-any */
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
      expect(res.data).toMatchObject({
        deleteResult: { raw: [], affected: 1 },
      })
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
