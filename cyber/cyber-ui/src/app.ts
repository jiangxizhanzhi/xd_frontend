import CyberUI, { setTheme } from './index.js';
import { getI18N } from '@cyber/helper';
import './theme/index.scss';
// import './style/index.scss'
export default function (Vue: any) {
  const i18n = getI18N();
  Vue.use(CyberUI, { i18n });
  setTheme();
}
