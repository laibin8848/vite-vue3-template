import { createApp } from 'vue'

import ElementPlus from 'element-plus';

import { key, store } from './store/index'
import router from './router/index'
import App from './App.vue'
import '@/styles/index.scss'
import '@/permission'
import 'element-plus/lib/theme-chalk/index.css'

//测试，添加插件化模块机制
import loadModule from '@/utils/loadModule'
const moduleList = ['test']
moduleList.forEach(module => {
  loadModule(module).then(moduleExport => {
    // 注册路由
    if(moduleExport.routes){
      moduleExport.routes.map(item => router.addRoute(item))
    }
    store.dispatch('permissionModule/setPermissonRoutes', moduleExport.routes)
  }).catch(err => {
    console.log('模块加载失败', err)
  })
})

store.dispatch('permissionModule/getPermissonRoutes')

const app = createApp(App).use(store, key).use(router).use(ElementPlus)

router.isReady().then(() => app.mount('#app'))

router.onError((err) => { console.error(err); })
