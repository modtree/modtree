import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { api } from '../main'
import { createRouter } from './router'

export const degree = createRouter()
  /**
   * create and save a degree
   */
  .mutation('create', {
    input: z.object({
      title: z.string().min(1),
      moduleCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    async resolve({ input }) {
      return api.degreeRepo
        .initialize(input.title, input.moduleCodes)
        .then(flatten.degree)
    },
  })

  /**
   * hard-delete a degree
   */
  .query('delete', {
    input: z.string().uuid(),
    async resolve({ input }) {
      return api.degreeRepo.delete(input)
    },
  })

  /**
   * modifies a degree
   */
  .mutation('update', {
    input: z.object({
      degreeId: z.string().uuid(),
      title: z.string().min(1),
      moduleCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    async resolve({ input }) {
      return api.degreeRepo
        .findOneById(input.degreeId)
        .then((degree) =>
          api.degreeRepo.update(degree, input.title, input.moduleCodes)
        )
        .then(flatten.degree)
    },
  })
