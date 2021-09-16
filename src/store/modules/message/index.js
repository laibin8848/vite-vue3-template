const messageModule = {
  namespaced: true,
  state: {
    messageNum: 0
  },
  mutations: {
    UPDATE_MESSAGE: (state, payload) => {
     state.messageNum-=payload.num;
    },
  },
  actions: {
    updateMessageNum({ commit }) {
      commit('UPDATE_MESSAGE',{num:1});
    },

  },
  getters: {
    getMessageNum(state) {
      return state.messageNum
    },
  },
};

export default messageModule;
