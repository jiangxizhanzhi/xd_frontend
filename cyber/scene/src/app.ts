import { IRuntime } from '@cyber/cli';
// @ts-ignore
import CyberUI, { setTheme } from '@cyber/ui';
// @ts-ignore
import { request, ws } from '@cyber/helper';
import './style/index.scss';
import '@cyber/ui/lib/css/index.css';

let runtime: IRuntime = function (Vue) {
  setTheme();
  Vue.use(CyberUI);
  Vue.prototype.$ws = ws;
  Vue.prototype.$request = request;
  return {};
};

export default runtime;
