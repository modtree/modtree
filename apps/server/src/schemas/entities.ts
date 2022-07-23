import { z } from 'zod'
import { validModuleRegex } from '@modtree/utils'

/**
 * zod doesn't support recursive types
 * as such, this type is technically incorrect
 */
const prereqTree = z.string().or(
  z.object({
    and: z.array(z.object({})).optional(),
    or: z.array(z.object({})).optional(),
  })
)

/**
 * due to zod-to-json-schema refStrategy not working,
 * we can only use at most one of these "base" properties
 * per entity.
 *
 * we also cannot have nested references for the same reason,
 * e.g. z.array(base.id) is not allowed.
 */
const base = {
  moduleCode: z.string().regex(validModuleRegex),
  moduleCodeArray: z.array(z.string().regex(validModuleRegex)),
  idArray: z.array(z.string().uuid()),
  id: z.string().uuid(),
}

const entities = {
  /** FLATTENED */
  User: z.object({
    id: base.id,
    facebookId: z.string(),
    googleId: z.string(),
    githubId: z.string(),
    displayName: z.string(),
    username: z.string(),
    email: z.string().email(),
    matriculationYear: z.number(),
    graduationYear: z.number(),
    graduationSemester: z.number(),
    modulesDone: base.moduleCodeArray,
    modulesDoing: z.array(z.string().regex(validModuleRegex)),
    savedDegrees: base.idArray,
    savedGraphs: z.array(z.string().uuid()),
    mainDegree: z.string().uuid(),
    mainGraph: z.string().uuid(),
  }),
  Module: z.object({
    id: base.id,
    moduleCode: base.moduleCode,
    title: z.string(),
    prerequisite: z.string(),
    corequisite: z.string(),
    preclusion: z.string(),
    fulfillRequirements: base.moduleCodeArray,
    prereqTree,
  }),
  ModuleCondensed: z.object({
    id: z.string().uuid(),
    moduleCode: base.moduleCode,
    title: z.string(),
  }),
  ModuleFull: z.object({
    id: z.string().uuid(),
    acadYear: z.string(),
    moduleCode: base.moduleCode,
    title: z.string(),
    description: z.string(),
    moduleCredit: z.string(),
    department: z.string(),
    faculty: z.string(),
    aliases: base.moduleCodeArray,
    /** FIXME NUSModuleAttributes */
    attributes: z.object({}),
    prerequisite: z.string(),
    corequisite: z.string(),
    preclusion: z.string(),
    fulfillRequirements: z.array(z.string().regex(validModuleRegex)),
    /** FIXME SemesterData[] */
    semesterData: z.array(z.object({})),
    prereqTree,
    workload: z.string().or(z.array(z.number())),
  }),
  /** FLATTENED */
  Degree: z.object({
    id: base.id,
    title: z.string(),
    modules: base.moduleCodeArray,
  }),
  /** FLATTENED */
  Graph: z.object({
    id: base.id,
    title: z.string(),
    user: z.string().uuid(),
    degree: z.object({
      id: z.string().uuid(),
      title: z.string(),
    }),
    modulesPlaced: base.moduleCodeArray,
    modulesHidden: z.array(z.string().regex(validModuleRegex)),
    /** FIXME GraphFlowNode[] */
    flowNodes: z.array(z.object({})),
    /** FIXME GraphFlowEdge[] */
    flowEdges: z.array(z.object({})),
  }),
}

/**
 * Remove ID and unflatten first layer of entities.
 *
 * FIXME check if the types are correct
 */
const deletedEntities = {
  User: z.object({
    facebookId: z.string(),
    googleId: z.string(),
    githubId: z.string(),
    displayName: z.string(),
    username: z.string(),
    email: z.string().email(),
    matriculationYear: z.number(),
    graduationYear: z.number(),
    graduationSemester: z.number(),
    /** these don't work */
    modulesDone: z.array(entities.Module),
    modulesDoing: z.array(entities.Module),
    savedDegrees: z.array(entities.Degree),
    savedGraphs: z.array(entities.Graph),
    mainDegree: entities.Degree,
    mainGraph: entities.Graph,
  }),
  Degree: z.object({
    id: z.string().uuid(),
    title: z.string(),
    /** these don't work */
    modules: z.array(entities.Module),
  }),
  Graph: z.object({
    id: z.string().uuid(),
    title: z.string(),
    /** these don't work */
    user: entities.User,
    degree: entities.Degree,
    modulesPlaced: z.array(entities.Module),
    modulesHidden: z.array(entities.Module),
    /** end */
    /** FIXME GraphFlowNode[] */
    flowNodes: z.array(z.object({})),
    /** FIXME GraphFlowEdge[] */
    flowEdges: z.array(z.object({})),
  }),
}

export { base, entities, deletedEntities }
