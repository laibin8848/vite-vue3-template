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
            if(Object.keys(moduleExport.store.state).length > 0){
              store.registerModule(`${moduleExport.MN}_Store`, moduleExport.store)
            }
          }).catch(err => {
            console.log('模块加载失败', err)
            reslove(null)
          })
        }))
      })

    Promise.all(promises).then(res=> {
      let mlist = []
      mlist = res.filter(item=> item !== null)
      store.dispatch('permissionModule/setPermissonRoutes', mlist)
    })
  }
}
export default moduleLoader
