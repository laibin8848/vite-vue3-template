import { createApp } from 'vue'

import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn';

import { key, store } from './store/index'
import router from './router/index'
import App from './App.vue'
import '@/styles/index.scss'
import '@/permission'
import 'element-plus/lib/theme-chalk/index.css'


store.dispatch('permissionModule/getPermissonRoutes')

// import moduleLoader from '@/plugins/moduleLoader'
// app.use(moduleLoader, {router: router, store: store})

//hack dynamic module load
setTimeout(()=> {
  const app = createApp(App).use(store, key).use(router).use(ElementPlus, {size: 'small', locale: locale})
  router.isReady().then(() => app.mount('#app'))
}, 500)

router.onError((err) => { console.error(err); })
