import { ModuleCondensed } from './ModuleCondensed'
import { Module } from './Module'
import { Degree } from './Degree'
import { User } from './User'
import { DAG } from './DAG'

export type ModtreeEntity = Module | ModuleCondensed | Degree | User | DAG

export { Module, ModuleCondensed, Degree, User, DAG }
