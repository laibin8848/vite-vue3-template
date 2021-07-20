const tabModule = {
  namespaced: true,
  state: {
    tabsOption:[{route:'/home',title:'信息汇总',name: 'home',}],
    currentIndex:'/home',
    breadcrumbList:[]
  },
  mutations: {
    ADD_TAB: (state, data) => {
      state.tabsOption.push(data);
    },
    DELETE_TAB: (state, route) => {
      const index=state.tabsOption.findIndex(tab=>tab.route===route)
        state.tabsOption.splice(index,1);
      },
    SET_TAB: (state, index) => {
        state.currentIndex=index;
    },
    CLEAR_TAB: (state) => {
        // 初始化tab
        state.tabsOption=[{route:'/home',title:'信息汇总',name:'home'}];
    },
  },
  actions: {
  },
  getters: {
    getCurrentIndex(state) {
      return state.currentIndex;
    },
    getTabsOption(state) {
      return state.tabsOption;
    }
  },
};

export default tabModule;
