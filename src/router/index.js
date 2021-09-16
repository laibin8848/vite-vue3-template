import { createRouter, createWebHashHistory } from 'vue-router';
import { store } from '@/store';
import layout from '@/layout/index.vue';
import { moduleList } from '../module/index.json';

export const constantRoutes = [{
        path: '/',
        redirect: '/users/list',
        meta: {
            hidden: true,
            notTab: true
        },
        children: []
    },
    {
        path: '/users/list',
        component: layout,
        meta: {
            title: '系统用户管理',
            icon: 'el-icon-s-order'
        },
        children: [{
            path: '/users/list',
            name: 'usersList',
            component: () => import ( /* webpackChunkName: "usersList" */ '@/views/Users/list.vue'),
            meta: { title: '系统用户管理' },
            children: []
        }]
    },
    {
        path: '/keywords/index',
        component: layout,
        meta: {
            title: '选项管理',
            icon: 'el-icon-s-order'
        },
        children: [
          {
            path: '/keywords/index',
            name: 'keywordsIndex',
            component: () => import ( /* webpackChunkName: "keywordsIndex" */ '@/views/keywords/index.vue'),
            meta: { title: '选项管理',icon: 'el-icon-s-order' },
            children: []
          },
          {
            path: '/keywords/synonyms/index',
            name: 'synonymsIndex',
            component: () => import ( /* webpackChunkName: "synonymsIndex" */ '@/views/keywords/synonyms.vue'),
            meta: { title: '同义词管理',icon: 'el-icon-s-order', hidden: true },
            children: []
          }
        ]
    },
    {
        path: '/products/index',
        component: layout,
        meta: {
            title: '商品管理',
            icon: 'el-icon-s-order'
        },
        children: [{
            path: '/products/index',
            name: 'productsIndex',
            component: () => import ( /* webpackChunkName: "productsIndex" */ '@/views/products/index.vue'),
            meta: { title: '商品管理' },
            children: []
        }]
    },
    {
        path: '/gimmick/index',
        component: layout,
        meta: {
            title: '问题管理',
            icon: 'el-icon-s-order'
        },
        children: [{
            path: '/gimmick/index',
            name: 'gimmickIndex',
            component: () => import ( /* webpackChunkName: "gimmickIndex" */ '@/views/gimmick/index.vue'),
            meta: { title: '问题管理' },
            children: []
        }]
    },
    {
        path: '/login',
        name: '登录',
        component: () => import ( /* webpackChunkName: "login" */ '@/views/Login/index.vue'),
        meta: {
            title: '登录',
            hidden: true,
            notTab: true
        },
    },
    {
        path: '/noFound',
        name: 'NoFound',
        component: () => import ( /* webpackChunkName: "noFound" */ '@/views/noFound.vue'),
        meta: {
            title: '404',
            hidden: true,
            notTab: true
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import ( /* webpackChunkName: "noFound" */ '@/views/noFound.vue'),
        meta: {
            title: 'not-found',
            hidden: true,
            notTab: true
        }
    }
]

export function genModuleRoute({ MN, BR, icon, routes }) {
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
        promises.push(new Promise(reslove => {
            import (`../module/${module}/main.js`).then(moduleExport => {
                if (moduleExport.default.routes) {
                    const route = genModuleRoute(moduleExport.default)
                    router.addRoute(route)
                    reslove(route)
                }
                if (Object.keys(moduleExport.default.store.state).length > 0) {
                    store.registerModule(`${moduleExport.MN}_Store`, moduleExport.default.store)
                }
            }).catch(err => {
                console.log('模块加载失败', err)
                reslove(null)
            })
        }))
    })
    Promise.all(promises).then(res => {
        let mlist = []
        mlist = res.filter(item => item !== null)
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
    const flag = tabsOption.findIndex(tab => tab.route === to.path) > -1
    if (!flag && !to.meta.notTab) {// && !to.meta.hidden
        store.commit('tabModule/ADD_TAB', { route: to.path, title: to.meta.title, name: to.name })
    }
    store.commit('tabModule/SET_TAB', to.path)
    if (sessionStorage.getItem('auth')) {
        if (to.path == '/login') {
            window && (window.location.href = window.location.origin)
        } else {
            next();
        }
    } else if (to.path === '/login') {
        console.log("/login");
        next();
    } else {
        console.log('unauthed into login');
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }
});

export default router;
