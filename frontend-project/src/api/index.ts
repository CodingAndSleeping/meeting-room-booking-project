import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:9527',
  timeout: 3000,
})

instance.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return err
  }
)
instance.interceptors.response.use(
  res => {
    return res
  },
  err => {
    return err.response
  }
)

export default instance
