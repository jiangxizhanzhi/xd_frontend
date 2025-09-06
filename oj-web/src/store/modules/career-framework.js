const state = {
  framework_id: '',
};
const mutations = {
  setFrameworkId: (state, payload) => {
    state.framework_id = payload.framework_id;
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
