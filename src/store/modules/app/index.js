import Cookies from 'js-cookie';

const appModule = {
  namespaced: true,
  state: {
    sidebar: {
      opened: true,
      withoutAnimation: false,
    },
    device: 'desktop',
  },
  mutations: {
    TOGGLE_SIDEBAR: (state) => {
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
    },
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR');
    },

  },
  getters: {
    getSidebarState(state) {
      return state.sidebar.opened;
    },
    getSidebarAnimation(state) {
      return state.sidebar.withoutAnimation;
    },
    getDeviceState(state) {
      return state.device;
    },
  },
};

export default appModule;
