import t from '../i18n';

const TAB_LIST = [
  { tab: t('target.deviceInfo'), key: 'name' },
  {
    tab: t('target.staticRouterConfig'),
    key: 'routerConfig',
  },
  { tab: t('target.networkConfig'), key: 'network' },
  { tab: t('target.networkConfig'), key: 'DNS' },
  {
    tab: t('target.networkConfig'),
    key: 'addressRange',
  },
  { tab: t('target.networkConfig'), key: 'egress' },
  { tab: t('target.networkConfig'), key: 'ingress' },
  { tab: t('target.networkConfig'), key: 'ip' },
  { tab: t('target.networkConfig'), key: 'gateway' },
  { tab: t('target.networkConfig'), key: 'address' },
  { tab: t('target.networkConfig'), key: 'vlanId' },
  { tab: t('target.routerConfigTab'), key: 'OSPF' },
  { tab: t('target.routerConfigTab'), key: 'BGP' },
  { tab: t('target.routerConfigTab'), key: 'RIP' },
  { tab: t('target.routerConfigTab'), key: 'ripLoopback' },
  { tab: t('target.routerConfigTab'), key: 'nexthop' },
  { tab: t('target.routerConfigTab'), key: 'destination' },
  { tab: t('target.protocolAcquisitionConfig'), key: 'snmp_config' },
];
const TAB = t('target.tab');

let tab_map = new Map();
TAB_LIST.forEach((item) => {
  tab_map.set(item.key, item.tab);
});

/**
 * 拆解表单错误信息，按照tab选项卡分类
 * @param errorArr
 * @param kRouter 是否是核心路由器，如果是核心路由器则需要取第二个错误信息字段
 */
export function errorConversion(errorArr: any, kRouter?: boolean) {
  let tabInfo: any[] = [];
  for (let key in errorArr) {
    let keyArr = key.split('.');
    let tab = kRouter
      ? keyArr.length == 1
        ? key.split('.')[0]
        : keyArr.length == 3
        ? key.split('.')[2]
        : key.split('.')[1]
      : key.split('.')[0];
    if (!tabInfo.includes(tab)) {
      tabInfo.push(tab);
    }
  }
  let errorGather: any[] = [];
  tabInfo.forEach((error) => {
    let getError = tab_map.get(error);
    if (getError) {
      if (!errorGather.includes(getError + TAB)) {
        errorGather.push(getError + TAB);
      }
    }
  });
  if (errorGather.length) {
    return t('global.checkFormFailed') + ' ：' + errorGather.join('、');
  } else {
    return t('global.checkFormFailed');
  }
}
