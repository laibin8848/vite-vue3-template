import router, { constantRoutes, asyncRoutes } from '@/router';

const permissionModule = {
  namespaced: true,
  state: {
    roles: [], // 用户包含的权限集合
    routes: constantRoutes, // 所有路由集合
    menuList:[1,2],
    showDialog:false
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    setRoutes: (state, routes) => {
      state.routes = constantRoutes.concat(routes);
    },
    setMenuList:(state,menuList)=>{
      state.menuList = menuList;
    },
    setShowDialog:(state,type)=>{
      state.showDialog = type;
    }
  },
  actions: {
    // 暂且放过异步接口请求，动态添加路由
    getPermissonRoutes({ commit }) {
      // api request
      const accessedRoutes = asyncRoutes;
      // 动态添加路由  vue-router4.x 暂时没有addRoutes

      for (const item of accessedRoutes) {
        router.addRoute(item);
      }
      router.options.routes = constantRoutes.concat(asyncRoutes);
      commit('setRoutes', accessedRoutes);
    },
    setPermissonRoutes({ commit }, data) {
      commit('setRoutes', data);
    },
  },
  getters: {
    getAccessRoutes(state) {
      return state.routes;
    },

  },
};

export default permissionModule;
