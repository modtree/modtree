import {
  AuthProvider,
  Degree,
  Graph,
  supportedAuthProviders,
  User,
} from '@modtree/types'
import { emptyInit } from '@modtree/utils'
import { DataSource } from 'typeorm'

import { BaseApi } from './base'
import frontendSetupConfig from './frontend-setup.json'
import initializeUserConfig from './initialize-user.json'

/** read default config */
const c =
  process.env['NODE_ENV'] === 'production'
    ? initializeUserConfig.production
    : initializeUserConfig.development

export class Api extends BaseApi {
  constructor(db: DataSource) {
    super(db)
  }

  /**
   * Creates a functional User entity, with a default degree and a
   * default graph.
   *
   * It only takes auth0 id and email, since those are the only two
   * asked for at user sign-up
   *
   * @param {string} authZeroId
   * @param {string} email
   * @returns {Promise<User>}
   */
  async initializeUser(authZeroId: string, email: string): Promise<User> {
    const user = this.userRepo.initialize({
      authZeroId,
      email,
      ...c.user,
    })
    const degree = this.degreeRepo.initialize({
      ...emptyInit.Degree,
      ...c.degree,
    })
    const graph = Promise.all([user, degree]).then(([user, degree]) =>
      this.graphRepo.initialize({
        ...emptyInit.Graph,
        userId: user.id,
        degreeId: degree.id,
      })
    )
    const updatedUser = Promise.all([user, degree, graph]).then(
      ([user, degree, graph]) => {
        /** add the degree to the user */
        user.savedDegrees.push(degree)
        user.mainDegree = degree
        /** add the graph to the user */
        user.savedGraphs.push(graph)
        user.mainGraph = graph
        /** save and return the user */
        return this.userRepo.save(user)
      }
    )
    return updatedUser
  }

  /**
   * Setups up a functional User entity, with a default degree and a
   * default graph.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  async setupUser(user: User): Promise<User> {
    /** initialize degree */
    const degree = this.degreeRepo.initialize({
      ...emptyInit.Degree,
      ...c.degree,
    })

    /** initialize graph */
    const graph = degree.then((degree) =>
      this.graphRepo.initialize({
        ...emptyInit.Graph,
        userId: user.id,
        degreeId: degree.id,
      })
    )

    /** write to the user and save */
    const updateUser = Promise.all([degree, graph]).then(([degree, graph]) => {
      /** add degree to the user */
      user.savedDegrees = [...(user.savedDegrees || []), degree]
      user.mainDegree = degree
      /** add the graph to the user */
      user.savedGraphs = [...(user.savedGraphs || []), graph]
      user.mainGraph = graph
      /** save and return the user */
      return this.userRepo.save(user)
    })

    /** send it */
    return updateUser
  }

  /**
   * Handles a user logging in.
   *
   * If the user already exists in database, then return that
   * user's data
   *
   * If not, then initialize a full user (empty degree, empty graph),
   * and return that newly created user instead.
   *
   * @param {string} provider
   * @param {string} providerId
   * @param {string} email
   */
  async userLogin2(
    email: string,
    provider: string,
    providerId: string
  ): Promise<User> {
    const getByEmail = () =>
      this.userRepo.findOneByEmail(email).then((user) => {
        this.userRepo.setProviderId(user, provider, providerId)
        return this.userRepo.save(user)
      })
    const getByProvider = () => {
      /**
       * note that this breaks even the catch, since it's not
       * a rejected Promise but a synchronous throw.
       */
      if (supportedAuthProviders.every((s) => s !== provider)) {
        throw new Error('User.find: unsupported provider')
      }
      return this.userRepo.findOneByProviderId(
        provider as AuthProvider,
        providerId
      )
    }
    const initializeUser = async () => {
      return this.userRepo
        .initialize2(email, provider, providerId)
        .then((user) => this.setupUser(user))
    }

    /**
     * on user login, first try to get by email
     * this prevents people from using different providers and ending up with
     * two accounts of the same email.
     */
    return (
      getByEmail()
        /**
         * If email not found, do an attempt to try to look for provider id.
         * By right, this should fail if email is already not found, but maybe
         * the user changed their provider-side email.
         */
        .catch(() => getByProvider())
        /**
         * If all fails, create a new user. The fact that userLogin is called
         * means the user has successfully authenticated.
         */
        .catch(() => initializeUser())
    )
  }

  /**
   * Handles a user logging in.
   *
   * If the auth0 id already exists in database, then return that
   * user's data
   *
   * If not, then initialize a full user (empty degree, empty graph),
   * and return that newly created user instead.
   *
   * @param {string} authZeroId
   * @param {string} email
   * @returns {Promise<User>}
   */
  async userLogin(authZeroId: string, email: string): Promise<User> {
    return this.userRepo.findOneByAuthZeroId(authZeroId).catch(() => {
      return this.initializeUser(authZeroId, email)
    })
  }

  /**
   * sets up database state for frontend testing
   * do run the postgres.sh script at root to restore the database to a
   * modules-only state first.
   */
  async frontendSetup() {
    const c = frontendSetupConfig
    const user1 = this.initializeUser(c.user1.authZeroId, c.user1.email)
    const user2 = this.initializeUser(c.user2.authZeroId, c.user2.email)
    const user3 = this.initializeUser(c.user3.authZeroId, c.user3.email)
    const degree1 = user1.then((user) => {
      const degree = user.savedDegrees[0]
      degree.title = 'Data Analytics'
      degree.modules = []
      return this.degreeRepo.insertModules(degree, c.degree1.moduleCodes)
    })
    const degree2 = user2.then((user) => {
      const degree = user.savedDegrees[0]
      degree.title = c.degree2.title
      return this.degreeRepo.save(degree)
    })
    const degree3 = user3.then((user) => {
      const degree = user.savedDegrees[0]
      degree.title = c.degree3.title
      return this.degreeRepo.save(degree)
    })
    return Promise.all([user1, user2, user3, degree1, degree2, degree3])
  }

  /**
   * sets up database for endpoint response generation
   * do run /scripts/migrate.sh to restore the database to a
   * modules-only state first.
   */
  async autoSetup(data: any) {
    // setup user and degree
    let u1: User = await this.userRepo.initialize(data.user1)
    let u2: User = await this.userRepo.initialize(data.user2)
    let d1: Degree = await this.degreeRepo.initialize(data.degree1)
    let d2: Degree = await this.degreeRepo.initialize(data.degree2)

    // setup graphs
    let g1: Graph = await this.graphRepo.initialize({
      ...data.graph1,
      userId: u1.id,
      degreeId: d1.id,
    })
    let g2: Graph = await this.graphRepo.initialize({
      ...data.graph2,
      userId: u2.id,
      degreeId: d2.id,
    })

    // insert degrees and graphs
    // user1: {
    //    savedDegrees: [d1],
    //    savedGraphs: [g1],
    // }
    u1 = await this.userRepo.insertDegrees(u1, [d1.id])
    u1 = await this.userRepo.insertGraphs(u1, [g1.id])
    u2 = await this.userRepo.insertDegrees(u2, [d2.id])
    u2 = await this.userRepo.insertGraphs(u2, [g2.id])

    // set main degrees and graphs
    // user1: {
    //    mainDegree: d1,
    //    savedDegrees: [d1],
    //    mainGraph: g1,
    //    savedGraphs: [g1],
    // }
    u1 = await this.userRepo.setMainDegree(u1, d1.id)
    u1 = await this.userRepo.setMainGraph(u1, g1.id)
    u2 = await this.userRepo.setMainDegree(u2, d2.id)
    u2 = await this.userRepo.setMainGraph(u2, g2.id)

    // fix fake nodes data
    // nodes[0] is CS1010S
    // nodes[1] is MA2001
    const nodes = data.nodes
    nodes[0].data = await this.moduleRepo.findByCode('CS1010S')
    nodes[1].data = await this.moduleRepo.findByCode('MA2001')

    // add in flow nodes and edges
    g1 = await this.graphRepo.updateFrontendProps(g1, {
      flowNodes: nodes,
      flowEdges: data.edges,
    })
    g2 = await this.graphRepo.updateFrontendProps(g2, {
      flowNodes: nodes,
      flowEdges: data.edges,
    })

    return { u1, u2, d1, d2, g1, g2 }
  }
}
