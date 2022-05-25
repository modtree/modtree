import { ModuleCondensed } from './ModuleCondensed'
import { Module } from './Module'
import { Degree } from './Degree'
import { User } from './User'
import { DAG } from './DAG'
import { Base } from './Base'

export type ModtreeEntity = Module | ModuleCondensed | Degree | User | DAG
export type ModtreeEntityConstructor =
  | typeof Module
  | typeof ModuleCondensed
  | typeof Degree
  | typeof User
  | typeof DAG

export { Module, ModuleCondensed, Degree, User, DAG, Base }
