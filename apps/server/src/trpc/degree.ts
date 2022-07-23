import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { api } from '../main'
import { base, entities } from '../schemas/entities'
import { createRouter } from './router'

export const degree = createRouter()
  /**
   * create and save a degree
   */
  .mutation('create', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Degree'],
        method: 'POST',
        path: '/degree',
        summary: 'Create a degree',
      },
    },
    input: z.object({
      title: z.string().min(1),
      moduleCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    output: entities.Degree,
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
    meta: {
      openapi: {
        enabled: true,
        tags: ['Degree'],
        method: 'DELETE',
        path: '/degree/{degreeId}',
        summary: 'Delete a degree',
      },
    },
    input: z.object({
      degreeId: base.id,
    }),
    output: base.deleteResult,
    async resolve({ input }) {
      return api.degreeRepo.delete(input.degreeId)
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
