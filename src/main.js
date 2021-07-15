import { createApp } from 'vue'

import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'

import { key, store } from './store/index'
import router from './router/index'
import App from './App.vue'
import '@/styles/index.scss'
// import '@/permission'
import 'element-plus/lib/theme-chalk/index.css'


// store.dispatch('permissionModule/getPermissonRoutes')

// const app =
createApp(App).use(store, key).use(router).use(ElementPlus,{locale}).mount('#app')

// router.isReady().then(() => app.mount('#app'))

router.onError((err) => { console.error(err); })
