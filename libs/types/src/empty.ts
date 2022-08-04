import { GraphFlowNode, IModule } from './entities'

const Module: IModule = {
  id: '',
  moduleCode: '',
  title: '',
  prerequisite: '',
  corequisite: '',
  preclusion: '',
  fulfillRequirements: [],
  prereqTree: '',
}

const FlowNode: GraphFlowNode = {
  id: '',
  position: {
    x: 0,
    y: 0,
  },
  data: Module,
}

const empty = {
  Module,
  FlowNode,
}

export { empty }
