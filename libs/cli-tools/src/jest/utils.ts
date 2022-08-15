import { resolve } from 'path'
import { rootDir } from '../utils'
import { readFileSync } from 'fs'
import { z } from 'zod'

const testsJsonSchema = z.object({
  jestProjects: z.record(z.string()),
  aliases: z.record(z.string()),
  groups: z.record(
    z.object({
      tests: z.array(z.string()),
      pattern: z.string().optional(),
      args: z.array(z.string()).optional(),
    })
  ),
})

type TestsJson = z.infer<typeof testsJsonSchema>

/**
 * read tests.json from workspace root
 *
 * @returns {TestsJson}
 */
export function getTestsJson(): TestsJson {
  const raw = JSON.parse(readFileSync(resolve(rootDir, 'tests.json'), 'utf8'))
  const res = testsJsonSchema.safeParse(raw)
  if (res.success) {
    return res.data
  } else {
    console.error(res.error.issues)
    throw new Error('Bad tests.json schema.')
  }
}
