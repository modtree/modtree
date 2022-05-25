import { ObjectLiteral } from 'typeorm'

export type EntityConstructor<T extends ObjectLiteral> = new () => T
