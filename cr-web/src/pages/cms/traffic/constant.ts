// 流量分类
import { gettext } from '@/lang';
//背景流量，攻击流量，混合流量
export const TRAFFICATEGORYLISTS = [
  {
    value: 0,
    label: gettext('traffic.staticTraffic'),
  },
  {
    value: 1,
    label: gettext('traffic.dynamicTraffic'),
  },
  {
    value: 2,
    label: gettext('traffic.mixedTraffic'),
  },
];
