import { User, Degree, Graph, Relations } from '@modtree/types'
import { DataSource, EntityMetadata, EntityTarget } from 'typeorm'
import { Repository } from './mock-typeorm'
import mockRelations from './relations.json'

const getRelations = <T>(entity: EntityTarget<T>) => {
  switch (entity) {
    case Degree:
      return mockRelations.degree
    case User:
      return mockRelations.user
    case Graph:
      return mockRelations.graph
    default:
      return {}
  }
}

export class BaseRepo<T> extends Repository<T> {
  relations: Relations
  constructor(entity: EntityTarget<T>, db: DataSource) {
    const relations = getRelations(entity)
    db.manager.connection.getMetadata = () => {
      return { relations } as EntityMetadata
    }
    super(entity, db.manager)
    this.relations = getRelations(entity)
  }
}
