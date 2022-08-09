import type { DataSource } from 'typeorm'

export type Config = {
  maxRetries: number
  intervalInMilliseconds: number
  dataSource: DataSource
  name: string
}

export type RunServer = (_: DataSource) => Promise<void>
