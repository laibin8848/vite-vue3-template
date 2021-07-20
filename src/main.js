import { createApp } from 'vue'

import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn';

import { key, store } from './store/index'
import router from './router/index'
import App from './App.vue'
import '@/styles/index.scss'
import '@/permission'
import 'element-plus/lib/theme-chalk/index.css'

//测试，添加插件化模块机制
import loadModule from '@/utils/loadModule'
const moduleList = []//['test2','test']
const promises = []
moduleList.forEach(module => {
  promises.push(new Promise(reslove=> {
    loadModule(module).then(moduleExport => {
      // 注册路由
      if(moduleExport.routes){
        moduleExport.routes.map(item => router.addRoute(item))
      }
      reslove(moduleExport.routes[0])
    }).catch(err => {
      console.log('模块加载失败', err)
    })
  }))
})
Promise.all(promises).then(res=> {
  store.dispatch('permissionModule/setPermissonRoutes', res)
})

// store.dispatch('permissionModule/getPermissonRoutes')

const app = createApp(App).use(store, key).use(router).use(ElementPlus, {locale: locale})

router.isReady().then(() => app.mount('#app'))

router.onError((err) => { console.error(err); })
