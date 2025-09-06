const state = {
  active: 1,
  firstStepFormValue: {},
  secondStepFormValue: {},
};
const mutations = {
  setActive(state, payload) {
    state.active = payload.active;
  },
  setfirstStepFormValue(state, payload) {
    state.firstStepFormValue = payload.firstStepFormValue;
  },
  setsecondStepFormValue(state, payload) {
    state.secondStepFormValue = payload.secondStepFormValue;
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
