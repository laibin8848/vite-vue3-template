import { createStore, useStore as baseUseStore } from 'vuex';

import settingsModule from './modules/Setting/index';
import appModule from './modules/app/index';
import messageModule from './modules/message/index'
import permissionModule from './modules/permission/index';
import tabModule from './modules/tabs/index'

const defaultState = {
  count: 0,
};

export const store = createStore({
  state() {
    return defaultState;
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
  },
  getters: {
    count(state) {
      return state.count;
    },
  },
  modules: {
    settingsModule,
    appModule,
    messageModule,
    permissionModule,
    tabModule
  },
});

export const key = Symbol('yue-management-sys-store');

export function useStore () {
  return baseUseStore(key);
}
