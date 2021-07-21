import loadModule from './loadModule'
import { genModuleRoute } from '@/router/index'
import { moduleList } from '@/module/index.json'

const moduleLoader = {
    install(app, {router, store}) {
      const promises = []
      moduleList.forEach(module => {
        promises.push(new Promise(reslove=> {
          loadModule(module).then(moduleExport => {
            if(moduleExport.routes){
              const route = genModuleRoute(moduleExport)
              router.addRoute(route)
              reslove(route)
            }
          }).catch(err => {
            console.log('模块加载失败', err)
          })
        }))
      })
      Promise.all(promises).then(res=> {
        store.dispatch('permissionModule/setPermissonRoutes', res)
      })
    }
}
export default moduleLoader
