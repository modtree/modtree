/**
 * the end goal here is to eventually import all types directly from TypeORM,
 * so this file will not have to exist.
 */

export type EntityConstructor<T> = new () => T
