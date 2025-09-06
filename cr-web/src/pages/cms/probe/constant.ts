// 操作系统类型
import { gettext } from '@/lang';
export const OSTYPELISTS = [
  {
    value: 0,
    label: 'Linux',
  },
  {
    value: 1,
    label: 'Windows',
  },
];
//探针脚本类型
export const SCRIPTTYPELISTS = [
  {
    value: 0,
    label: 'shell',
  },
  {
    value: 1,
    label: 'python',
  },
  {
    value: 2,
    label: 'bat',
  },
];
// 探针运行状态
export const PROBESTATUS = [
  {
    value: 0,
    label: gettext('event_list.stop'),
  },
  {
    value: 1,
    label: gettext('event_list.stop'),
  },
  {
    value: 2,
    label: gettext('event_list.stop'),
  },
];
// 探针类型
export const PROBESTYPES = [
  {
    value: 0,
    label: gettext('probes.infoClass'),
  },
  {
    value: 1,
    label: gettext('probes.eventClass'),
  },
  {
    value: 2,
    label: gettext('probes.logClass'),
  },
];
// 适用系统
export const APPLICABLESYSTEMS = [
  {
    value: 0,
    label: 'Windows',
  },
  {
    value: 1,
    label: 'Unix',
  },
  {
    value: 2,
    label: 'Linux',
  },
  {
    value: 3,
    label: 'BSD',
  },
  {
    value: 4,
    label: 'Other',
  },
];
// 参数类型
export const PARAMTYPES = [
  {
    value: 'Number',
    label: 'Number',
  },
  {
    value: 'String',
    label: 'String',
  },
  {
    value: 'Bool',
    label: 'Bool',
  },
  {
    value: 'IP',
    label: 'IP',
  },
];
