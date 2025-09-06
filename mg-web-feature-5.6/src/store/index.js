import role from './modules/role';
import { getUserStore } from '@cyber/helper';
import { getUiFrameStore } from '@cyber/ui';
import _ from 'lodash';
import config from './modules/config';
import real from './modules/real';
import image from './modules/image';
import getters from './getters';
import app from './modules/app.js';

const user = _.merge(getUserStore(), getUiFrameStore());

const storeData = {
  getters,
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    role,
    config,
    real,
    image,
    app,
  },
};

export default storeData;
let store;
export const setStore = (s) => {
  store = s;
};
export const getStore = () => {
  return store;
};
