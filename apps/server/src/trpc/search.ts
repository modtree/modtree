import { Like } from 'typeorm'
import { z } from 'zod'
import { api } from '../main'
import { entities } from '../schemas/entities'
import { createRouter } from './router'

export const search = createRouter()
  /**
   * search for modules
   */
  .query('modules', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/search/modules/{query}',
        tags: ['Module'],
        summary: 'Search modules based on a prefix',
      },
    },
    input: z.object({
      query: z.string(),
    }),
    output: z.array(entities.Module),
    async resolve({ input }) {
      if (!input) return []
      return api.moduleCondensedRepo
        .find({
          where: [{ moduleCode: Like(`${input.query.toUpperCase()}%`) }],
          take: 4,
        })
        .then((r) =>
          Promise.all(r.map((m) => api.moduleRepo.findByCode(m.moduleCode)))
        )
    },
  })

  /**
   * search for modules condensed
   */
  .query('modules-condensed', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/search/modules-condensed/{query}',
        tags: ['Module'],
        summary: 'Search modules condensed based on a prefix',
      },
    },
    input: z.object({
      query: z.string(),
    }),
    output: z.array(entities.ModuleCondensed),
    async resolve({ input }) {
      if (!input) return []
      return api.moduleCondensedRepo.find({
        where: [{ moduleCode: Like(`${input.query.toUpperCase()}%`) }],
        take: 4,
      })
    },
  })
