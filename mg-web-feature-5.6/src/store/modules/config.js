// 配置文件的store
const state = {
  configData: {},
};

const mutations = {
  setConfigData: (state, payload) => {
    state.configData = payload.configData;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
