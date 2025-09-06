import {
  getToken,
  setToken,
  removeToken,
  removeJWTToken,
  getJWTToken,
  setJWTToken,
} from '@/utils/auth';
const user = {
  state: {
    user: {},
    token: getToken(),
    jwt_token: getJWTToken(),
  },
  getters: {},

  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token);
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_JWT: (state, jwt_token) => {
      state.jwt_token = jwt_token;
      setJWTToken(jwt_token);
    },
  },

  actions: {
    // remove token
    ResetToken({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        commit('SET_JWT', '');
        removeToken();
        removeJWTToken();
        resolve();
      });
    },
  },
  namespaced: true,
};

export default user;
