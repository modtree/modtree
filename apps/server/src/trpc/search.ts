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
        path: '/search/modules/{search}',
      },
    },
    input: z.object({
      search: z.string(),
    }),
    output: z.array(entities.Module),
    async resolve({ input }) {
      if (!input) return []
      return api.moduleCondensedRepo
        .find({
          where: [{ moduleCode: Like(`${input.search.toUpperCase()}%`) }],
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
        path: '/search/modules-condensed/{search}',
      },
    },
    input: z.object({
      search: z.string(),
    }),
    output: z.array(entities.ModuleCondensed),
    async resolve({ input }) {
      if (!input) return []
      return api.moduleCondensedRepo.find({
        where: [{ moduleCode: Like(`${input.search.toUpperCase()}%`) }],
        take: 4,
      })
    },
  })
