import { Zodios, ZodiosOptions } from '@zodios/core'
import { MakeApi } from './make-api'

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

const apiClient = new Zodios(baseURL, MakeApi, options)

export default apiClient
