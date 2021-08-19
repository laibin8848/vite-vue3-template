import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'

// let loadingInstance = null

const service = axios.create({
  baseURL: process.env.NODE_ENV == 'development' ? '' : 'https://www.fastmock.site/mock/ffa301b26eb93d926172ac233be9425c',
  timeout: 5000,
  withCredentials: true
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // loadingInstance = ElLoading.service({})
    config.headers['x-access-token'] = sessionStorage.getItem('accessToken')
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    // loadingInstance.close()
    const res = response.data
    if (res.code !== 'E000') {
      if(res.code == 401) {
        //redirect to login
        return
      }
      ElMessage.error(res.message)
    } else {
      return res
    }
  },
  (error) => {
    ElMessage.error('出错了!')
    return Promise.reject(error)
  }
)

export default service
