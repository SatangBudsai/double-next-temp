import { makeApi } from '@zodios/core'
import { z } from 'zod'

export const userApi = makeApi([
  {
    method: 'get',
    path: '/users',
    alias: 'getUsers',
    response: z.any()
  }
])
