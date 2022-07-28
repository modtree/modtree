import { ModuleNode } from './module-node'
import type { ModuleNodeProps } from 'types'
import { FlowNodeState } from '@modtree/types'
import { NodeProps, NodeTypes } from 'react-flow-renderer'
import { ComponentType } from 'react'

type NodeDef = {
  type: FlowNodeState
  moduleCode?: string
  title?: string
}

const nodes: NodeDef[] = [
  { type: 'done', moduleCode: 'text-emerald-500 opacity-80' },
  { type: 'doing', moduleCode: 'text-black opacity-100' },
  { type: 'cannotTake', moduleCode: 'text-red-400 opacity-100' },
  { type: 'planned', moduleCode: 'text-gray-400 opacity-100' },
  { type: 'suggested', moduleCode: 'text-gray-400 opacity-50' },
]

function coloredNode(
  type: FlowNodeState,
  title?: string,
  moduleCode?: string
): ComponentType<NodeProps> {
  const node = (props: ModuleNodeProps) => {
    const data = { ...props.data, className: { title, moduleCode } }
    const final = { ...props, data }
    return <ModuleNode {...final} />
  }
  node.displayName = `node-${type}`
  return node
}

export const moduleNodes = nodes.reduce(
  (acc, node) => ({
    ...acc,
    [node.type]: coloredNode(node.type, node.title, node.moduleCode),
  }),
  {} as NodeTypes
)
