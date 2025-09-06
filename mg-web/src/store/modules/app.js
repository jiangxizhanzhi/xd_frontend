import Cookies from 'js-cookie';
import http from '@/utils/http.js';
import _ from 'lodash';
import { getLanguage } from '@cyber/helper';
const language = getLanguage();
const labelWdithEn = 200;
const labelWidthZh = 130;

const app = {
  state: {
    language: Cookies.get('language'),
    theme: localStorage.getItem('theme') || 'theme-dark',
    isShowRegBtn: false,
    copyright: '',
    sysInfo: '',
    labelWidth: language === 'en-US' ? labelWdithEn : labelWidthZh,
  },
  getters: {},
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      Cookies.set('language', language);
      Cookies.set('django_language', language);
    },
    SET_THEME: (state, theme) => {
      state.theme = theme;
    },
    SET_PUBLIC: (state, info) => {
      state.isShowRegBtn = info;
    },
    SET_COPYRIGHT: (state, info) => {
      state.copyright = info;
    },
    SET_SYS_INFO: (state, payload) => {
      state.sysInfo = payload;
    },
  },
  actions: {
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme);
    },
    setPublic({ commit }, info) {
      commit('SET_PUBLIC', info);
    },
    setCopyright({ commit }, info) {
      commit('SET_COPYRIGHT', info);
    },
    getSystemInfo({ commit }) {
      return new Promise((res, rej) => {
        http
          .apiAxios('get', '/auth/register/')
          .then((resp) => {
            const sysInfo = _.get(resp, 'data', {});
            res(sysInfo);
            commit('SET_SYS_INFO', sysInfo);
          })
          .catch((rej) => {
            commit('SET_SYS_INFO', {
              system_name: '实训',
            });
            res();
          });
      });
    },
  },
  namespaced: true,
};

export default app;
