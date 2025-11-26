// @ts-ignore
import SceneEditor from './pages/scene/index';
// style
import './style/index.scss';
import './assets/iconfont/font_2647558_upnhwlj5na.js';
// import './assets/iconfont/font_2776302_ch8hg2apwtl.js';
// import './assets/iconfont/font_3187907_5yf0zgir9fv.js';

const SceneEditorPlugin = {
  install: (Vue) => {
    Vue.component('SceneEditor', SceneEditor);
  },
};

export { SceneEditor, SceneEditorPlugin };
