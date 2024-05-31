import { AxiosRequestConfig } from 'axios'

export type ApiType = {
  config?: AxiosRequestConfig | undefined
  urlBase?: string
  url: string
}
