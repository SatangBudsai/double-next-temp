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
        name: 'code',
        type: 'Body',
        schema: z.string()
      },
      {
        name: 'code2',
        type: 'Body',
        schema: z.string()
      },
      {
        name: 'testQuery',
        type: 'Query',
        schema: z.any()
      }
    ],
    response: z.any()
  }
])
