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

export class BaseRepo<Entity> {
  protected relations: Relations
  protected repo: Repository<Entity>
  create: Repository<Entity>['create']
  save: Repository<Entity>['save']
  find: Repository<Entity>['find']
  findOneOrFail: Repository<Entity>['findOneOrFail']
  createQueryBuilder: Repository<Entity>['createQueryBuilder']
  constructor(entity: EntityTarget<Entity>, db: DataSource) {
    this.repo = new Repository(entity, db.manager)
    /** mock relations */
    const relations = getRelations(entity)
    db.manager.connection.getMetadata = () => {
      return { relations } as EntityMetadata
    }
    this.relations = getRelations(entity)
    /** full inheriance */
    this.create = this.repo.create.bind(this.repo)
    this.save = this.repo.save.bind(this.repo)
    this.find = this.repo.find.bind(this.repo)
    this.findOneOrFail = this.repo.findOneOrFail.bind(this.repo)
    this.createQueryBuilder = this.repo.createQueryBuilder.bind(this.repo)
  }
}
