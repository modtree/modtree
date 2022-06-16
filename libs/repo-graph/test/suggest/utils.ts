import { Graph } from '@modtree/entity'
import { Repo, setup, t } from '@modtree/test-env'
import { DataSource } from 'typeorm'
import { UserRepository } from '@modtree/repo-user'
import { DegreeRepository } from '@modtree/repo-degree'
import { GraphRepository } from '../../src'
import { InitProps } from '@modtree/types'
import { ModuleRepository } from '@modtree/repo-module'

export async function suggest(graph: Graph, modules: string[]) {
  return Repo.Graph!.suggestModules(graph, modules)
}

export async function suggestSetup(
  db: DataSource,
  userProps: InitProps['User'],
  degreeProps: InitProps['Degree']
) {
  return setup(db)
    .then(() => {
      Repo.User = new UserRepository(db)
      Repo.Degree = new DegreeRepository(db)
      Repo.Graph = new GraphRepository(db)
      Repo.Module = new ModuleRepository(db)
      return Promise.all([
        Repo.User!.initialize(userProps),
        Repo.Degree!.initialize(degreeProps),
      ])
    })
    .then(([user, degree]) => {
      t.user = user
      return Repo.Graph!.initialize({
        userId: user.id,
        degreeId: degree.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: false,
      })
    })
    .then((graph) => {
      t.graph = graph
    })
}
