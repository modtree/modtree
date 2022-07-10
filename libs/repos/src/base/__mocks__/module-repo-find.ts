import { Module } from '@modtree/types'
import { DeepPartial } from 'typeorm'
import json from '../../../../../references/modules.json'

const coerce = <T>(e: DeepPartial<T>): T => {
  const a = Object.assign(new Module(), e) as unknown as T
  return a
}

export const moduleRepoFind = json.map(coerce<Module>)
