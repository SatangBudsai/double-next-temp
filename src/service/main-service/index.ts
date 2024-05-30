import { Zodios, makeApi, ZodiosOptions } from '@zodios/core'
import { userApi } from './userApi'

const baseURL = process.env.NEXT_PUBLIC_SERVICE
if (!baseURL) {
  throw new Error('NEXT_PUBLIC_SERVICE environment variable is not set')
}

const options: ZodiosOptions = {
  axiosConfig: {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN || 'your_token_here'}`
    }
  }
}

export const apiSchema = makeApi([...userApi])

const apiClient = new Zodios(baseURL, apiSchema, options)

export default apiClient
