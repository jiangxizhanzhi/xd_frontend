import getters from './getters';
import app from './modules/app.js';
import { getUserStore } from '@cyber/helper';
import { getUiFrameStore } from '@cyber/ui';
import careerFramework from './modules/career-framework';

let store;

export default {
  state: {},
  getters,
  mutations: {},
  actions: {},
  modules: {
    careerFramework,
    user: getUserStore(getUiFrameStore()),
    app,
  },
};

export const setStore = (s) => {
  store = s;
};
export const getStore = () => {
  return store;
};
