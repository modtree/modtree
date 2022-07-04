import {
  InitDegreeProps,
  InitGraphProps,
  InitModuleCondensedProps,
  InitModuleProps,
  InitUserProps,
} from '@modtree/types'

/**
 * empty User init props
 */
const User: InitUserProps = {
  authZeroId: '',
  email: '',
}

/**
 * empty Degree init props
 */
const Degree: InitDegreeProps = {
  moduleCodes: [],
  title: '',
}

/**
 * empty Graph init props
 */
const Graph: InitGraphProps = {
  userId: '',
  degreeId: '',
  modulesPlacedCodes: [],
  modulesHiddenCodes: [],
  pullAll: false,
}

/**
 * empty Module init props
 */
const Module: InitModuleProps = {
  moduleCode: '',
  title: '',
  description: '',
  prerequisite: '',
  corequisite: '',
  preclusion: '',
  prereqTree: '',
  fulfillRequirements: [],
}

/**
 * empty Module init props
 */
const ModuleCondensed: InitModuleCondensedProps = {
  moduleCode: '',
  title: '',
}

/** empty init props */
export const emptyInit = {
  User,
  Degree,
  Graph,
  Module,
  ModuleCondensed,
}
