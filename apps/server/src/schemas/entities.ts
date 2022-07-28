import { z } from 'zod'
import { validModuleRegex } from '@modtree/utils'

/**
 * NUSMods types in zod
 */
const NUSMods = {
  Attributes: z
    .object({
      year: z.boolean(),
      su: z.boolean(),
      grsu: z.boolean(),
      ssgf: z.boolean(),
      sfs: z.boolean(),
      lab: z.boolean(),
      ism: z.boolean(),
      urop: z.boolean(),
      fyp: z.boolean(),
      mpes1: z.boolean(),
      mpes2: z.boolean(),
    })
    .partial(),
  WeekRange: z.object({
    start: z.string(),
    end: z.string(),
    weekInterval: z.number().optional(),
    weeks: z.array(z.number()).optional(),
  }),
  SemesterData: z.object({
    semester: z.number(),
    timetable: z.array(
      z.object({
        classNo: z.string(),
        day: z.string(),
        endTime: z.string(),
        lessonType: z.string(),
        startTime: z.string(),
        venue: z.string(),
        weeks: z.array(z.number()).or(
          /* lazy because it references NUSMods.WeekRange */
          z.lazy(() => NUSMods.WeekRange)
        ),
        size: z.number(),
      })
    ),
    examDate: z.string().optional(),
    examDuration: z.number().optional(),
  }),
  PrereqTree: z.string().or(
    z.lazy(() =>
      z.object({
        and: z.array(NUSMods.prereqTree).optional(),
        or: z.array(NUSMods.prereqTree).optional(),
      })
    )
  ),
}

const deleteResult = z.object({
  raw: z.any(),
  affected: z.number().or(z.null()).optional(),
})

const Module = z.object({
  id: z.string().uuid(),
  moduleCode: z.string().regex(validModuleRegex),
  title: z.string(),
  prerequisite: z.string(),
  corequisite: z.string(),
  preclusion: z.string(),
  fulfillRequirements: z.array(z.string().regex(validModuleRegex)),
  prereqTree: NUSMods.PrereqTree,
})

const entities = {
  /** FLATTENED */
  User: z.object({
    id: z.string().uuid(),
    facebookId: z.string(),
    googleId: z.string(),
    githubId: z.string(),
    displayName: z.string(),
    username: z.string(),
    email: z.string().email(),
    matriculationYear: z.number(),
    graduationYear: z.number(),
    graduationSemester: z.number(),
    modulesDone: z.array(z.string().regex(validModuleRegex)),
    modulesDoing: z.array(z.string().regex(validModuleRegex)),
    savedDegrees: z.array(z.string().uuid()),
    savedGraphs: z.array(z.string().uuid()),
    /** allow empty string for CREATE endpoint */
    mainDegree: z.string().uuid().or(z.string()),
    mainGraph: z.string().uuid().or(z.string()),
  }),
  Module,
  ModuleCondensed: z.object({
    id: z.string().uuid(),
    moduleCode: z.string().regex(validModuleRegex),
    title: z.string(),
  }),
  ModuleFull: Module.extend({
    acadYear: z.string(),
    description: z.string(),
    moduleCredit: z.string(),
    department: z.string(),
    faculty: z.string(),
    aliases: z.array(z.string().regex(validModuleRegex)),
    /* empty string */
    attributes: z.string().or(NUSMods.Attributes),
    /* empty string */
    semesterData: z.array(NUSMods.SemesterData),
    workload: z.string().or(z.array(z.number())),
  }),
  /** FLATTENED */
  Degree: z.object({
    id: z.string().uuid(),
    title: z.string(),
    modules: z.array(z.string().regex(validModuleRegex)),
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

export { deleteResult, entities }
