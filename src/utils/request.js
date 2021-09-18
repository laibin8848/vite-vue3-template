import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
    baseURL: '',//import.meta.env.MODE == 'production' ? 'http://10.16.153.37:30329/unilever' : '',
    timeout: 50000,
    withCredentials: true
})

service.interceptors.request.use(
    (config) => {
      const loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
      let token = '';
      if (loginInfo && loginInfo.token) {
          token = loginInfo.token;
      }
      config.headers['x-access-token'] = token;
      if(config.uploadFile) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      return config
    },
    (error) => {
        Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response) => {
        const res = response.data
        if (res.code !== 'E000') {
            if (res.code == 'E503' || res.code == 'E401') {
              sessionStorage.removeItem('auth');
              window.location.replace('#login');
              return res
            } else {
              ElMessage.error(res.message)
            }
            throw new Error(res.message)
        } else {
            return res
        }
    }
)

export default service
