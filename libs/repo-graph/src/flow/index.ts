import { Module } from '@modtree/entity'
import { GraphFlowNode } from '@modtree/types'
export * from './get-edges'

const origin = { x: 0, y: 0 }

export function nodify(module: Module): GraphFlowNode {
  return {
    id: module.moduleCode,
    position: origin,
    data: module,
    type: 'moduleNode',
  }
}
