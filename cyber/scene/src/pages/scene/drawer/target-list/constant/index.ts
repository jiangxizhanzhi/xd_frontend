import t from '../../../../../utils/i18n';
/**
 * 靶标列表查询界面
 */

/**
 * 操作系统筛选标签
 */

const TYPE_LISTS_SYSTEM = [
  {
    label: t('menu.drawer.allTypes'),
    value: '',
  },
  {
    label: 'Windows',
    value: 1,
  },
  {
    label: 'Linux',
    value: 2,
  },
  {
    label: 'Unix',
    value: 3,
  },
  {
    label: 'BSD',
    value: 4,
  },
  {
    label: 'Other',
    value: 5,
  },
];

/**
 * 虚拟类型筛选标签
 */
const TYPE_LISTS_VIRTUAL_TYPE = [
  {
    label: t('menu.drawer.allTypes'),
    value: '',
  },
  {
    label: t('menu.drawer.virtualMachine'),
    value: 'VM',
  },
  {
    label: t('menu.drawer.container'),
    value: 'CONTAINER',
  },
  {
    label: t('menu.drawer.entityTarget'),
    value: 'ENTITY',
  },
];

/**
 * 预置类型筛选标签
 */
const TYPE_LISTS_PRESET_TYPE = [
  {
    label: t('menu.drawer.allTargets'),
    value: '',
  },
  {
    label: t('menu.drawer.builtInTarget'),
    value: 1,
  },
  {
    label: t('menu.drawer.customTarget'),
    value: 0,
  },
];
/**
 * Cloud-init筛选标签
 */
const TYPE_LISTS_QUICK_SUPPORT = [
  {
    label: t('menu.drawer.allTypes'),
    value: '',
  },
  {
    label: t('menu.drawer.open'),
    value: true,
  },
  {
    label: t('menu.drawer.close'),
    value: false,
  },
];
/**
 * 网络设备筛选标签
 */
// const TYPE_LISTS_NETWORK_EQUIPMENT = [
//   {
//     label: '全部',
//     value: '',
//   },
//   {
//     label: '交换机',
//     value: '交换机',
//   },
//   {
//     label: '路由器',
//     value: '路由器',
//   },
//   {
//     label: '防火墙',
//     value: '防火墙',
//   },
// ];
/**
 * 标签列表
 */
export const TYPE_CONDITION = {
  common: [
    t('menu.menu.operateSystem'),
    t('menu.menu.virtualType'),
    t('menu.menu.presetType'),
    t('menu.menu.cloudInit'),
  ],
  networkEquipment: [t('menu.menu.networkEquipment')],
};

/**
 * 标签项
 */
export const TYPE_LISTS = {
  common: [
    TYPE_LISTS_SYSTEM,
    TYPE_LISTS_VIRTUAL_TYPE,
    TYPE_LISTS_PRESET_TYPE,
    TYPE_LISTS_QUICK_SUPPORT,
  ],
  networkEquipment: [],
};

export const ENUM_IMAGE_TYPE = {
  vm: t('menu.drawer.virtualMachine'),
  container: t('menu.drawer.container'),
  entity: t('menu.drawer.entityTarget'),
  dynamips: 'dynamips',
};
