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

export class BaseRepo2<T> extends Repository<T> {
  relations: Relations
  protected repo: Repository<T>
  constructor(entity: EntityTarget<T>, db: DataSource) {
    super(entity, db.manager)
    this.repo = new Repository(entity, db.manager)
    this.relations = getRelations(this)
  }
}
