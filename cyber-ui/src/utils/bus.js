import Vue from 'vue';
import { dispatchUiAction } from '@cyber/helper';
import CbMessageBox from '../directives/message-box';

const bus = new Vue();

function setState(key, value) {
  bus.$emit(key, value);
  dispatchUiAction(key, value);
}

function setBreadcrumbTitle(title) {
  setState('breadcrumb_title', title);
}

function setNaviActiveName(name) {
  setState('navi_active_name', name);
}

function setFullscreen(bool) {
  setState('full_screen', bool);
}

function getUiFrameStore() {
  return {
    actions: {
      subFrameRouteChange({ commit }, data) {
        const routeName = _.get(data, 'to.name');
        setNaviActiveName(routeName);
      },
      frameUiAction({ commit }, data) {
        const { key, value } = data;
        if (
          ['breadcrumb_title', 'full_screen', 'theme_change'].includes(data.key)
        ) {
          setState(key, value);
        } else if (data.key === 'show_message') {
          const { method, message } = data.value;
          CbMessageBox[method](message);
        }
      },
      showErrorMsg({ commit }, err) {
        CbMessageBox.serverError(err);
      },
    },
  };
}

export {
  bus,
  setBreadcrumbTitle,
  setNaviActiveName,
  setFullscreen,
  setState,
  getUiFrameStore,
};
