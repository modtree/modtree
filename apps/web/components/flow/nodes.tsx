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

function coloredNode(className: {
  title?: string
  moduleCode?: string
}): ComponentType<NodeProps> {
  return (props: ModuleNodeProps) => {
    const final = { ...props, data: { ...props.data, className } }
    return <ModuleNode {...final} />
  }
}

export const moduleNodes = nodes.reduce(
  (acc, node) => ({
    ...acc,
    [node.type]: coloredNode({
      title: node.title,
      moduleCode: node.moduleCode,
    }),
  }),
  {} as NodeTypes
)
