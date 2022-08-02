import { AuthProvider, supportedAuthProviders, User } from '@modtree/types'
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
   * Sets up up a functional User entity,
   * with a default degree and a default graph.
   *
   * can also be used to reset a user to a state with:
   * - one graph
   * - one degree
   * - no modules done/doing
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  async setupUser(user: User): Promise<User> {
    /**
     * first clear modules done/doing
     * as graph depends on this
     */
    user.modulesDone = []
    user.modulesDoing = []
    const savedUser = this.userRepo.save(user)

    /** initialize degree */
    const degree = this.degreeRepo.initialize(
      c.degree.title,
      c.degree.moduleCodes
    )

    /** initialize graph */
    const graph = Promise.all([savedUser, degree]).then(([user, degree]) =>
      this.graphRepo.initialize(c.graph.title, user.id, degree.id)
    )

    /** write to the user and save */
    const updateUser = Promise.all([degree, graph]).then(([degree, graph]) => {
      /** add degree to the user */
      user.savedDegrees = [degree]
      user.mainDegree = degree
      /** add the graph to the user */
      user.savedGraphs = [graph]
      user.mainGraph = graph
      /** save and return the user */
      return this.userRepo.save(user)
    })

    /** send it */
    return updateUser
  }
  resetUser = this.setupUser

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
  async userLogin(
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
        .initialize(email, provider, providerId)
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
   * sets up database state for frontend testing
   * do run the postgres.sh script at root to restore the database to a
   * modules-only state first.
   */
  async frontendSetup() {
    const c = frontendSetupConfig
    const user1 = this.setupUser(await this.userRepo.initialize(c.user1.email))
    const user2 = this.setupUser(await this.userRepo.initialize(c.user2.email))
    const user3 = this.setupUser(await this.userRepo.initialize(c.user3.email))
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
}
