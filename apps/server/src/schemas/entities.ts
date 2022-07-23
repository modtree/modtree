import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { validModuleRegex } from '@modtree/utils'
import base from './base'

extendZodWithOpenApi(z)

/**
 * prereqTree type
 * zod doesn't support recursive types
 */
const prereqTree = z.string().or(
  z.object({
    and: z.array(z.object({})).optional(),
    or: z.array(z.object({})).optional(),
  })
)

const moduleCode = z.string().regex(validModuleRegex)

const entities = {
  /** FLATTENED */
  User: z.object({
    id: base.id,
    facebookId: z.string(),
    googleId: z.string(),
    githubId: z.string(),
    displayName: z.string(),
    username: z.string(),
    email: base.email,
    matriculationYear: z.number(),
    graduationYear: z.number(),
    graduationSemester: z.number(),
    modulesDone: base.moduleCodeArray,
    modulesDoing: base.moduleCodeArray,
    savedDegrees: z.array(base.id),
    savedGraphs: z.array(base.id),
    mainDegree: base.id,
    mainGraph: base.id,
  }),
  Module: z.object({
    id: base.id,
    moduleCode,
    title: z.string(),
    prerequisite: z.string(),
    corequisite: z.string(),
    preclusion: z.string(),
    fulfillRequirements: z.array(z.string().regex(validModuleRegex)),
    prereqTree,
  }),
  ModuleCondensed: z.object({
    id: base.id,
    moduleCode: base.moduleCode,
    title: z.string(),
  }),
  ModuleFull: z.object({
    id: base.id,
    acadYear: z.string(),
    moduleCode: base.moduleCode,
    title: z.string(),
    description: z.string(),
    moduleCredit: z.string(),
    department: z.string(),
    faculty: z.string(),
    aliases: z.array(base.moduleCode),
    /** FIXME NUSModuleAttributes */
    attributes: z.object({}),
    prerequisite: z.string(),
    corequisite: z.string(),
    preclusion: z.string(),
    fulfillRequirements: z.array(base.moduleCode),
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
    user: base.id,
    degree: z.object({
      id: base.id,
      title: z.string(),
    }),
    title: z.string(),
    modulesPlaced: base.moduleCodeArray,
    modulesHidden: base.moduleCodeArray,
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
    email: base.email,
    matriculationYear: z.number(),
    graduationYear: z.number(),
    graduationSemester: z.number(),
    modulesDone: z.array(entities.Module),
    modulesDoing: z.array(entities.Module),
    savedDegrees: z.array(entities.Degree),
    savedGraphs: z.array(entities.Graph),
    mainDegree: entities.Degree,
    mainGraph: entities.Graph,
  }),
  Degree: z.object({
    id: base.id,
    title: z.string(),
    modules: z.array(entities.Module),
  }),
  Graph: z.object({
    id: base.id,
    user: entities.User,
    degree: entities.Degree,
    title: z.string(),
    modulesPlaced: z.array(entities.Module),
    modulesHidden: z.array(entities.Module),
    /** FIXME GraphFlowNode[] */
    flowNodes: z.array(z.object({})),
    /** FIXME GraphFlowEdge[] */
    flowEdges: z.array(z.object({})),
  }),
}

export { entities, deletedEntities }
