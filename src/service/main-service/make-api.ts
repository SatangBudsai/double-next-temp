import { makeApi } from '@zodios/core'
import { userApi } from './module/userApi'

export const MakeApi = makeApi([...userApi])
