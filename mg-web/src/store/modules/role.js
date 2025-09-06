const state = {
  currentTab: 'message',
  roleResourceId: '',
  firstStepFormValue: {},
  permissonList: [],
};
const mutations = {
  setCurrentTab: (state, payload) => {
    state.currentTab = payload.tabKey;
  },
  getRoleResourceId: (state, payload) => {
    state.roleResourceId = payload.resource_id;
  },
  setfirstStepFormValue: (state, payload) => {
    state.firstStepFormValue = payload.firstStepFormValue;
  },
  setPermissonList: (state, payload) => {
    state.permissonList = payload.allPermissonList;
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
