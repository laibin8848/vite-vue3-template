const tabModule = {
  namespaced: true,
  state: {
    tabsOption:[],
    currentIndex:'/',
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
        state.tabsOption=[];
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
