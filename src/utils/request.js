import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'

let loadingInstance = null

const service = axios.create({
  baseURL: '',
  timeout: 5000,
  withCredentials: true
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    loadingInstance = ElLoading.service({})
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    loadingInstance.close()
    const res = response.data
    if (res.code !== 200) {
      if(res.code == 401) {
        //redirect to login
        return
      }
      return Promise.reject(new Error(res.message || 'Error'))
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
