import { User, Degree, Graph, Relations, Module } from '@modtree/types'
import { DataSource, EntityTarget } from 'typeorm'
import { Repository } from './mock-typeorm'
import mockRelations from './relations.json'
import moduleFindJson from '../../../../../references/modules.json'

// const moduleFindJson: any[] = []
const moduleFindOutput: Module[] = moduleFindJson.map((j) =>
  Object.assign(new Module(), j)
)

export class BaseRepo<T> extends Repository<T> {
  relations: Relations
  constructor(entity: EntityTarget<T>, db: DataSource) {
    super(entity, db.manager)
    switch (entity) {
      case Degree:
        this.relations = mockRelations.degree
        break
      case User:
        this.relations = mockRelations.user
        break
      case Graph:
        this.relations = mockRelations.graph
        break
      default:
        this.relations = {}
    }
  }
}
