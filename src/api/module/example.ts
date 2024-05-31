import api from '@/api'

const exampleAPI = {
  getExample() {
    return api.get({ url: `/example` })
  }
}

export default exampleAPI
