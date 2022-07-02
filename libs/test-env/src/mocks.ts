import { Module } from '@modtree/entity'
import { DataSource, EntityTarget } from 'typeorm'

function getMockDb(): any {
  const db: any = new DataSource({
    database: 'mock',
    type: 'postgres',
  })
  db.getMetadata = <T>(e: EntityTarget<T>) => {
    if (e === Module) {
      return {
        relations: [],
      }
    }
    return {
      relations: [],
    }
  }
  return db
}

export const db = getMockDb()