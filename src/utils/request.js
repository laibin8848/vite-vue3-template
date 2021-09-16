import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'

// let loadingInstance = null
const service = axios.create({
    baseURL: '',//import.meta.env.MODE == 'production' ? 'http://10.16.153.37:30329/unilever' : '',
    timeout: 50000,
    withCredentials: true
})

// Request interceptors
service.interceptors.request.use(
    (config) => {
      // loadingInstance = ElLoading.service({})
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
        // loadingInstance.close()
        const res = response.data
        if (res.code !== 200) {
            if (res.code == 'E503') {
                //redirect to login
                sessionStorage.removeItem('auth');
                // sessionStorage.removeItem('accessToken');
                window.location.replace('#login');
                return
            } else if (res.code == 'E401') {
                //令牌过期
                sessionStorage.removeItem('auth')
                window.location.replace('#login')
                return
            }
            // ElMessage.error(res.message)
            return res;
        } else {
            return res
        }
    }
)

export default service
