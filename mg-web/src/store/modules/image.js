const state = {
  exportImgCount: 0,
};
const mutations = {
  setExportImgCount(state, payload) {
    state.exportImgCount++;
    if (payload.count === 1) {
      state.exportImgCount = 0;
    }
  },
};
const actions = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
