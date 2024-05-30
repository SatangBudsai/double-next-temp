import { makeApi } from '@zodios/core'
import { request } from 'http'
import { z } from 'zod'

export const userApi = makeApi([
  {
    method: 'get',
    path: '/users',
    response: z.any()
  },
  {
    method: 'post',
    path: '/users',
    parameters: [
      {
        name: 'payload',
        type: 'Body',
        schema: z.object({
          code: z.string()
        })
      }
    ],
    response: z.any()
  }
])
