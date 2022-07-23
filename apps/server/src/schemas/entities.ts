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
 * NUSMods types in zod
 */
const Attributes = z.object({
  year: z.boolean().optional(),
  su: z.boolean().optional(),
  grsu: z.boolean().optional(),
  ssgf: z.boolean().optional(),
  sfs: z.boolean().optional(),
  lab: z.boolean().optional(),
  ism: z.boolean().optional(),
  urop: z.boolean().optional(),
  fyp: z.boolean().optional(),
  mpes1: z.boolean().optional(),
  mpes2: z.boolean().optional(),
})
const WeekRange = z.object({
  start: z.number(),
  end: z.number(),
  weekInterval: z.number().optional(),
  weeks: z.array(z.number()).optional(),
})
const SemesterData = z.object({
  semester: z.number(),
  rawLesson: z.object({
    classNo: z.number(),
    dayText: z.string(),
    endTime: z.string(),
    lessonType: z.string(),
    startTime: z.string(),
    venue: z.string(),
    weeks: z.number().or(WeekRange),
    size: z.number(),
  }),
  examDate: z.string().optional(),
  examDuration: z.number().optional(),
})

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

const Module = z.object({
  id: base.id,
  moduleCode: base.moduleCode,
  title: z.string(),
  prerequisite: z.string(),
  corequisite: z.string(),
  preclusion: z.string(),
  fulfillRequirements: base.moduleCodeArray,
  prereqTree,
})

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
  Module,
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
    attributes: Attributes,
    prerequisite: z.string(),
    corequisite: z.string(),
    preclusion: z.string(),
    fulfillRequirements: z.array(z.string().regex(validModuleRegex)),
    semesterData: z.array(SemesterData),
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
    id: z.string().uuid(),
    title: z.string(),
    user: z.string().uuid(),
    degree: z.object({
      id: z.string().uuid(),
      title: z.string(),
    }),
    modulesPlaced: z.array(z.string().regex(validModuleRegex)),
    modulesHidden: z.array(z.string().regex(validModuleRegex)),
    /** irrelevant optional props are left out */
    flowNodes: z.array(
      z.object({
        id: z.string(),
        position: z.object({
          x: z.number(),
          y: z.number(),
        }),
        data: Module,
        className: z.string().optional(),
        selected: z.boolean().optional(),
      })
    ),
    /** irrelevant optional props are left out */
    flowEdges: z.array(
      z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
      })
    ),
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
