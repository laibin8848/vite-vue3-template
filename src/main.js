import { createApp } from 'vue'

import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn';

import { key, store } from './store/index'
import router from './router/index'
import App from './App.vue'
import '@/styles/index.scss'
import '@/permission'
import 'element-plus/theme-chalk/index.css'
import * as baseComponents from '@/components/base/'

store.dispatch('permissionModule/getPermissonRoutes')

// import moduleLoader from '@/plugins/moduleLoader'
// app.use(moduleLoader, {router: router, store: store})

//hack dynamic module load
setTimeout(()=> {
  const app = createApp(App).use(store, key).use(router).use(ElementPlus, {size: 'small', locale: locale})
  for(const key in baseComponents) {
    app.component(baseComponents[key].name, baseComponents[key])
  }
  router.isReady().then(() => app.mount('#app'))
}, 500)

router.onError((err) => { console.error(err); })
