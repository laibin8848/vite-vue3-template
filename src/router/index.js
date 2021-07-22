import { createRouter, createWebHashHistory } from 'vue-router';
import { store } from '@/store';
import layout from '@/layout/index.vue';
import { moduleList } from '../module/index.json';

export const constantRoutes = [
  {
    path: '/',
    component: layout,
    redirect: '/home',
    meta: {
      title: '信息汇总',
      icon: 'el-icon-s-home',
    },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home/home.vue'),
        meta: { title: '信息汇总' },
        children: []
      }
    ]
  },
  {
    path: '/user/list',
    component: layout,
    meta: {
      title: '用户权限',
      icon: 'el-icon-user',
    },
    children: [
      {
        path: '/user/list',
        name: 'userList',
        component: () => import(/* webpackChunkName: "UsersList" */ '@/views/Users/list.vue'),
        meta: { title: '用户列表' },
        children: []
      },
      {
        path: '/role/list',
        name: 'RoleList',
        component: () => import(/* webpackChunkName: "RoleList" */ '@/views/Role/list.vue'),
        meta: { title: '角色列表' },
        children: []
      }
    ]
  },
  {
    path: '/dictionary/list',
    component: layout,
    meta: {
      title: '字典管理',
      icon: 'el-icon-copy-document',
    },
    children: [
      {
        path: '/dictionary/list',
        name: 'dictionaryList',
        component: () => import(/* webpackChunkName: "dictionaryList" */ '@/views/Dictionary/list.vue'),
        meta: { title: '字典列表' },
        children: []
      }
    ]
  },
  {
    path: '/menus/list',
    component: layout,
    meta: {
      title: '菜单管理',
      icon: 'el-icon-s-order',
    },
    children: [
      {
        path: '/menus/list',
        name: 'menusList',
        component: () => import(/* webpackChunkName: "menusList" */ '@/views/Menu/list.vue'),
        meta: { title: '菜单列表' },
        children: []
      }
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/noFound',
    name: 'NoFound',
    component: () => import(/* webpackChunkName: "noFound" */ '@/views/noFound.vue'),
    meta: {
      title: '404',
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*', name: 'not-found', component: () => import(/* webpackChunkName: "noFound" */ '@/views/noFound.vue'),
      meta: {
      title: 'not-found',
      hidden: true,
    }
  }
]

export function genModuleRoute({MN, BR, icon, routes}) {
  return {
    path: BR,
    component: layout,
    meta: {
      title: MN,
      icon: icon,
    },
    children: routes
  }
}

function loadDynamicModule() {
  const promises = []
  moduleList.forEach(module => {
    promises.push(new Promise(reslove=> {
      import(`../module/${module}/main.js`).then(moduleExport => {
        if(moduleExport.default.routes){
          const route = genModuleRoute(moduleExport.default)
          router.addRoute(route)
          reslove(route)
        }
        if(Object.keys(moduleExport.default.store.state).length > 0){
          store.registerModule(`${moduleExport.MN}_Store`, moduleExport.default.store)
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

export const asyncRoutes = [];

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({
    top: 0,
  }),
  routes: constantRoutes
});

loadDynamicModule();

router.beforeEach((to, from, next) => {
    const tabsOption = store.getters['tabModule/getTabsOption']
    // 判断当前路由中是否已经入栈
    const flag = tabsOption.findIndex(tab => tab.route === to.fullPath) > -1
    if (!flag && !to.meta.hidden) {
      store.commit('tabModule/ADD_TAB', { route: to.fullPath, title: to.meta.title,name: to.name })
    }
    store.commit('tabModule/SET_TAB', to.fullPath)
  if(sessionStorage.getItem('auth')){
    console.log("has authed");
    next()
  }else if(to.path==='/login'){
    console.log("/login");
    next();
  }else{
    console.log('unauthed into login');
    next({
      path: '/login',
      query: {redirect: to.fullPath}
    })
  }
});

export default router;
