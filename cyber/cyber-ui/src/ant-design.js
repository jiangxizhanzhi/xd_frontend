import AConfigProvider from 'ant-design-vue/lib/config-provider';
import zhCN from 'ant-design-vue/lib/locale/zh_CN';
import enUS from 'ant-design-vue/lib/locale/en_US';
import _ from 'lodash';
_.set(zhCN, 'Pagination.jump_to', '跳转至');

const antLocale = {
  'zh-CN': zhCN,
  'en-US': enUS,
};
const cyberAntdInstall = function (Vue, opts = {}) {
  Vue.prototype.$cbAntLocale = antLocale;
  Vue.component('cb-a-config-provider', AConfigProvider);
};

export { cyberAntdInstall };
