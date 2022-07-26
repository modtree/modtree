import { z, ZodType } from 'zod'
import { validModuleRegex } from '@modtree/utils'

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
  start: z.string(),
  end: z.string(),
  weekInterval: z.number().optional(),
  weeks: z.array(z.number()).optional(),
})
const SemesterData = z.object({
  semester: z.number(),
  timetable: z.array(
    z.object({
      classNo: z.string(),
      day: z.string(),
      endTime: z.string(),
      lessonType: z.string(),
      startTime: z.string(),
      venue: z.string(),
      weeks: z.array(z.number()).or(WeekRange),
      size: z.number(),
    })
  ),
  examDate: z.string().optional(),
  examDuration: z.number().optional(),
})

/**
 * this type is referenced by prereqTree below
 *
 * required because zod-to-json-schema doesn't support YAML references
 * correctly
 */
const prereqTree: ZodType = z.string().or(
  z.lazy(() =>
    z.object({
      and: z.array(prereqTree).optional(),
      or: z.array(prereqTree).optional(),
    })
  )
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
  deleteResult: z.object({
    raw: z.any(),
    affected: z.number().or(z.null()).optional(),
  }),
}

const Module = z.object({
  id: base.id,
  moduleCode: base.moduleCode,
  title: z.string(),
  prerequisite: z.string(),
  corequisite: z.string(),
  preclusion: z.string(),
  fulfillRequirements: base.moduleCodeArray,
  prereqTree: z.string().or(
    z.lazy(() =>
      z.object({
        and: z.array(prereqTree).optional(),
        or: z.array(prereqTree).optional(),
      })
    )
  ),
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
    /** allow empty string for CREATE endpoint */
    mainDegree: z.string().uuid().or(z.string()),
    mainGraph: z.string().uuid().or(z.string()),
  }),
  Module,
  ModuleCondensed: z.object({
    id: z.string().uuid(),
    moduleCode: base.moduleCode,
    title: z.string(),
  }),
  ModuleFull: Module.extend({
    acadYear: z.string(),
    description: z.string(),
    moduleCredit: z.string(),
    department: z.string(),
    faculty: z.string(),
    /* empty string */
    aliases: z.array(z.string().regex(validModuleRegex)),
    /* empty string */
    attributes: z.string().or(Attributes),
    /* empty string */
    semesterData: z.array(SemesterData),
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

export { base, entities }
