import t from '../../../../../utils/i18n';

export const PROBE_NAME = {
  file: t('menu.probe.file'),
  register: t('menu.probe.register'),
};
export const PROBE_TEMPLATE_TABLE = [
  {
    title: t('menu.dialog.probe.collectionColumns')[5],
    prop: 'name',
    width: '30%',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[1],
    prop: 'description',
    width: '30%',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[3],
    prop: 'os_type',
    width: '12%',
    slot: 'os_type',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[4],
    prop: 'probe_counts',
    width: '12%',
  },
  { title: t('global.operation'), slot: 'op', position: 'right' },
];
export const CUSTOM_PROBE_TEMPLATE_TABLE = [
  {
    title: t('menu.dialog.probe.collectionColumns')[0],
    prop: 'name',
    width: '27%',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[1],
    prop: 'desc',
    width: '20%',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[2],
    prop: 'type',
    width: '10%',
    slot: 'type',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[3],
    prop: 'os_type',
    slot: 'os_type',
    width: '30%',
  },
  {
    title: t('global.operation'),
    slot: 'op',
    position: 'right',
    width: '13%',
  },
];
export const CUSTOM_PROBE_TEMPLATE_DETAIL = [
  {
    title: t('menu.dialog.probe.collectionColumns')[0],
    prop: 'name',
    width: '25%',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[1],
    prop: 'description',
    width: '30%',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[2],
    prop: 'probe_category',
    width: '15%',
    slot: 'probe_category',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[3],
    prop: 'os_type',
    slot: 'os_type',
    width: '30%',
  },
];
export const CUSTOM_PROBE_IMPORT_TABLE = [
  {
    title: t('menu.dialog.probe.collectionColumns')[0],
    prop: 'name',
    width: '30%',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[1],
    prop: 'desc',
    width: '25%',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[2],
    prop: 'type',
    width: '10%',
    slot: 'type',
  },
  {
    title: t('menu.dialog.probe.collectionColumns')[3],
    prop: 'os_type',
    width: '35%',
    slot: 'os_type',
  },
];
// 操作系统下拉框
export const SYSTEM_OPTION = [
  // {
  //   label: t('menu.dialog.probe.allSystems'),
  //   value: null,
  // },
  {
    label: 'Windows',
    value: 0,
  },
  {
    label: 'Unix',
    value: 1,
  },
  {
    label: 'Linux',
    value: 2,
  },
  {
    label: 'BSD',
    value: 3,
  },
  {
    label: 'Other',
    value: 4,
  },
];
// 探针类型下拉框
export const PROBE_TYPE_OPTIONS = [
  // {
  //   label: t('menu.dialog.probe.probeType')[3],
  //   value: null,
  // },
  {
    label: t('menu.dialog.probe.probeType')[0],
    value: 0,
  },
  {
    label: t('menu.dialog.probe.probeType')[1],
    value: 1,
  },
  {
    label: t('menu.dialog.probe.probeType')[2],
    value: 2,
  },
];

// 操作系统 映射关系
export enum SYSTEM_TYPE {
  Windows,
  Unix,
  Linux,
  BSD,
  Other,
}

// 探针类型 映射关系 0:信息类 1:事件类 2:日志类
export enum CATEGORY_PROB {
  info,
  event,
  log,
}

export const CATEGORY_PROB_OBJECT = {
  0: t('menu.dialog.probe.probeType')[0],
  1: t('menu.dialog.probe.probeType')[1],
  2: t('menu.dialog.probe.probeType')[2],
};
// 参数类型 映射关系 0:number 1:string 2:bool 3:ip
export enum CATEGORY_PARAMS {
  Number,
  String,
  Bool,
  Ip,
}
