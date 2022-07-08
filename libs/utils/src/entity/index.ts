import { ModtreeApiResponse } from '@modtree/types'
import { Degree, Graph, Module, ModuleCondensed, User } from '@modtree/types'

/** flattens TypeORM entities */
export const flatten = {
  /**
   * flattens a module to its module code
   *
   * @param {Module | ModuleCondensed} module
   * @returns {string} module code
   */
  module(module: Module | ModuleCondensed): string {
    const keys = Object.keys(module)
    if (!keys.includes('moduleCode')) {
      throw new Error("Can't flatten a module without a module code.")
    }
    return module.moduleCode
  },

  /**
   * flattens a user to response shape
   *
   * @param {User} user
   * @returns {ModtreeApiResponse.User}
   */
  user(user: User): ModtreeApiResponse.User {
    return {
      ...user,
      modulesDoing: user.modulesDoing.map(flatten.module),
      modulesDone: user.modulesDone.map(flatten.module),
      savedDegrees: user.savedDegrees.map((d) => d.id),
      savedGraphs: user.savedGraphs.map((g) => g.id),
      // in case no degree yet
      mainDegree: user.mainDegree ? user.mainDegree.id : '',
      // in case no graph yet
      mainGraph: user.mainGraph ? user.mainGraph.id : '',
    }
  },

  /**
   * flattens a user to response shape
   *
   * @param {User} user
   * @returns {ModtreeApiResponse.User}
   */
  userFull(user: User): ModtreeApiResponse.UserFull {
    return {
      ...user,
      savedGraphs: user.savedGraphs.map((g) => g.id),
      // in case no graph yet
      mainGraph: user.mainGraph ? user.mainGraph.id : '',
    }
  },

  /**
   * flattens a graph to response shape
   *
   * @param {Graph} graph
   * @returns {ModtreeApiResponse.Graph}
   */
  graph(graph: Graph): ModtreeApiResponse.Graph {
    return {
      ...graph,
      id: graph.id,
      user: graph.user.id,
      degree: graph.degree.id,
      modulesHidden: graph.modulesHidden.map(flatten.module),
      modulesPlaced: graph.modulesPlaced.map(flatten.module),
    }
  },

  /**
   * flattens a degree to response shape
   *
   * @param {Degree} degree
   * @returns {ModtreeApiResponse.Degree}
   */
  degree(degree: Degree): ModtreeApiResponse.Degree {
    return { ...degree, modules: degree.modules.map(flatten.module) }
  },
}
