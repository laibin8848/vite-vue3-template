import defaultSetting from '@/config';

const { title, fixedHeader, sideBarLogo, showSettings } = defaultSetting.default;

const settingsModule = {
  namespaced: true,
  state: {
    title,
    fixedHeader,
    sideBarLogo,
    showSettings,
    tableHeight: 600,

  },
  mutations: {
    setTableHeight: (state, height) => {
      state.tableHeight = height;
    },

  },
  actions: {},
};

export default settingsModule;
