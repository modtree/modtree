import { Relations } from '@modtree/types'
import { DataSource, EntityTarget, Repository } from 'typeorm'
import { getRelations } from './get-relations'

export class BaseRepo<T> extends Repository<T> {
  relations: Relations
  constructor(entity: EntityTarget<T>, db: DataSource) {
    super(entity, db.manager)
    this.relations = getRelations(this)
  }
}

export class BaseRepo2<Entity> {
  protected relations: Relations
  protected repo: Repository<Entity>
  create: Repository<Entity>['create']
  save: Repository<Entity>['save']
  constructor(entity: EntityTarget<Entity>, db: DataSource) {
    this.repo = new Repository(entity, db.manager)
    this.relations = getRelations(this.repo)
    this.create = this.repo.create.bind(this.repo)
    this.save = this.repo.save.bind(this.repo)
  }
}
