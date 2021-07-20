import { createRouter, createWebHashHistory } from 'vue-router';
import { store } from '@/store';
import layout from '@/layout/index.vue';

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
        meta: { title: '信息汇总' }
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
        path: '/groups/list',
        name: 'GroupsList',
        component: () => import(/* webpackChunkName: "GroupsList" */ '@/views/Groups/list.vue'),
        meta: { title: '分组管理' },
        children: []
      },
      {
        path: '/role/list',
        name: 'RoleList',
        component: () => import(/* webpackChunkName: "RoleList" */ '@/views/Role/list.vue'),
        meta: { title: '角色列表' },
        children: []
      },
      {
        path: '/permisson/list',
        name: 'permissonList',
        component: () => import(/* webpackChunkName: "PermissonList" */ '@/views/Permisson/list.vue'),
        meta: { title: '权限列表' },
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

export const asyncRoutes = [];

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({
    top: 0,
  }),
  routes: constantRoutes,
});

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
