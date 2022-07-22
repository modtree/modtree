import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { NUSMods } from '@modtree/types'
import { z } from 'zod'
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

const entities = {
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
    modulesDone: z.array(base.moduleCode),
    modulesDoing: z.array(base.moduleCode),
    savedDegrees: z.array(base.id),
    savedGraphs: z.array(base.id),
    mainDegree: base.id,
    mainGraph: base.id,
  }),
  Module: z.object({
    id: base.id,
    moduleCode: base.moduleCode,
    title: z.string(),
    prerequisite: z.string(),
    corequisite: z.string(),
    preclusion: z.string(),
    fulfillRequirements: z.array(base.moduleCode),
    prereqTree,
  }),
}

export default entities
