import { DataSource } from 'typeorm'

function getMockDb(): DataSource {
  const db = new DataSource({
    database: 'mock',
    type: 'postgres',
  }) as any
  db.manager = {
    whereInIds: () => {},
    connection: { getMetadata: () => {} },
  }
  db.getMetadata = () => ({
    relations: [],
  })
  db.createQueryBuilder = () => ({
    whereInIds: () => {},
  })
  return db
}

export const db = getMockDb() as any
