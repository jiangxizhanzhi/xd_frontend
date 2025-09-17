import { setRouter, setI18N, setStore } from '@cyber/helper';
import elementUi from './element-ui';
import { cyberAntdInstall } from './ant-design';

const { cyberElementInstall, Notification } = elementUi;
// export * from "./utils"
import {
  bus,
  setBreadcrumbTitle,
  setNaviActiveName,
  setFullscreen,
  setState,
  getUiFrameStore,
  addRouteTab,
} from './utils/bus';
import {
  themed,
  setTheme,
  getComputedThemedVar,
  getCurrentTheme,
  setThemeClass,
} from './utils/themes';
import ListenDomChange from './utils/listen-dom';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

import './assets/iconfont';
import './gitlog.js';

import CbBreadcrumb from './components/breadcrumb';
import CbButton from './components/button';
import CbIconfont from './components/iconfont';
import CbNavi from './components/navigation';
import CbLayout from './components/layout';
import CbSearchTable from './components/search-table';
import CbPagination from './components/pagination';
import CbSearchBar from './components/search-bar';
import CbSearchInput from './components/search-input';
import CbFilterCondition from './components/filter-condition';
import CbInnerPage from './components/inner-page';
import CbFormTags from './components/form-tags';
import CbFormBlock from './components/form-block';
import CbFormTitle from './components/form-title';
import CbForm from './components/form';
import CbSelect from './components/select';
import CbScrollbar from './components/scrollbar';
import CbProgress from './components/progress';
import CbMessageBox from './directives/message-box';
import CbDialog from './components/dialog';
import CbLogin from './components/login';
import CbAccordion from './components/accordion';
import CbAuthAccess from './components/auth-access';
import CbAuthOperation from './components/auth-operation';
import CbLabel from './components/label';
import CbTabs from './components/tabs';

import CbEchartBar from './components/echart-bar';
import CbEchartLine from './components/echart-line';
import CbEchartPie from './components/echart-pie';
import CbEchartRadar from './components/echart-radar';

import CbCalendar from './components/calendar';
import CbSteps from './components/steps';
import CbStep from './components/step/index';
import CbButtonGroup from './components/button-group';
import CbScroll from './components/scroll';
import CbUploadFile from './components/upload-file';
import CbUploadImage from './components/upload-image';
import CbChangePassword from './components/change-password';
import CbTag from './components/tag';

import CbImagePreview from './components/image-preview';
import CbJsonViewer from './components/json-viewer';

import CbMarkdown from './components/markdown';
import CbCheckboxGroup from './components/checkbox-group';
import CbRadioGroup from './components/radio-group';
import CbRadioButton from './components/radio-button';
import importDirective from './directives';

import CbBadge from './components/badge';
import CbDropdown from './components/dropdown';
import CbDropdownItem from './components/dropdown-item';
import CbDropdownMenu from './components/dropdown-menu';
import CbTableTransfer from './components/table-transfer';

import CbCountUp from './components/count-up';
import Loading from './components/loading';
import CbInput from './components/input';
import CbDatePicker from './components/date-picker';
import CbPopover from './components/popover';
import CbCascader from './components/cascader';
import CbTooltip from './components/tooltip';
import CbInputNumber from './components/input-number';
import CbDrawer from './components/drawer';

const components = {
  CbButton,
  CbIconfont,
  CbNavi,
  CbLayout,
  CbSearchTable,
  CbPagination,
  CbSearchBar,
  CbSearchInput,
  CbFilterCondition,
  CbInnerPage,
  CbFormTags,
  CbSelect,
  CbFormBlock,
  CbFormTitle,
  CbForm,
  CbProgress,
  CbScrollbar,
  CbDialog,
  CbLogin,
  CbAccordion,
  CbAuthAccess,
  CbAuthOperation,
  CbLabel,
  CbTabs,

  CbEchartBar,
  CbEchartLine,
  CbEchartPie,
  CbEchartRadar,

  CbCalendar,
  CbSteps,
  CbStep,
  CbButtonGroup,
  CbScroll,
  CbUploadFile,
  CbUploadImage,
  CbChangePassword,
  CbTag,

  CbImagePreview,
  CbJsonViewer,
  CbMarkdown,
  CbBreadcrumb,
  CbCheckboxGroup,
  CbRadioGroup,
  CbRadioButton,

  CbBadge,
  CbDropdown,
  CbDropdownItem,
  CbDropdownMenu,
  CbTableTransfer,
  CbCountUp,
  CbInput,
  CbDatePicker,
  CbPopover,
  CbCascader,
  CbTooltip,
  CbInputNumber,
  CbDrawer,
};
const install = function (Vue, opts = {}) {
  opts.store && setStore(opts.store);
  opts.i18n && setI18N(opts.i18n);
  opts.router && setRouter(opts.router);
  cyberElementInstall(Vue, opts);
  cyberAntdInstall(Vue, opts);
  Object.keys(components).forEach((key) => {
    Vue.use(components[key]);
  });
  Vue.use(Loading.directive);
  importDirective(Vue);
  Vue.prototype.$themed = themed;
  Vue.prototype.$confirm = CbMessageBox.confirm;
  Vue.prototype.$closeMsgBox = CbMessageBox.closeMsgBox;
  Vue.prototype.$prompt = CbMessageBox.prompt;
  Vue.prototype.$serverError = CbMessageBox.serverError;
  Vue.prototype.$error = CbMessageBox.error;
  Vue.prototype.$success = CbMessageBox.success;
  Vue.prototype.$info = CbMessageBox.info;
  Vue.prototype.$warning = CbMessageBox.warning;
  Vue.prototype.$message = CbMessageBox;
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$notify = Notification;
};
const localeMessages = {
  'zh-CN': zhCN,
  'en-US': enUS,
};
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue);
// }
const Cyber = {
  ...components,
  CbMessageBox,
  install,
  localeMessages,
  // 公共方法暴露
  setTheme,
  setThemeClass,
  ListenDomChange,
  themed,
  getComputedThemedVar,
  setBreadcrumbTitle,
  setFullscreen,
  setNaviActiveName,
  setState,
  getUiFrameStore,
  getCurrentTheme,
  addRouteTab,
};

export default Cyber;

export {
  bus,
  setTheme,
  setThemeClass,
  CbMessageBox,
  Notification,
  ListenDomChange,
  themed,
  getComputedThemedVar,
  setBreadcrumbTitle,
  setFullscreen,
  setNaviActiveName,
  setState,
  getUiFrameStore,
  getCurrentTheme,
};
