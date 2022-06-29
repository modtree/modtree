import { ModtreeApiResponse } from '@modtree/types'
import { Degree, Graph, Module, ModuleCondensed, User } from '@modtree/entity'

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
   */
  user(user: User) {
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
   * flattens a graph to response shape
   *
   * @param {Graph} graph
   */
  graph(graph: Graph) {
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
   */
  degree(degree: Degree) {
    return { ...degree, modules: degree.modules.map(flatten.module) }
  },
}
