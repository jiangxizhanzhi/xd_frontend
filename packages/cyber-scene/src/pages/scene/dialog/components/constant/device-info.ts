//@ts-ignore
import t, { i18n } from '../../../../../utils/i18n';
/**
 * 各类下拉框常量
 */
export const PORT_INFO = {
  common: {
    // 核心路由器端口数量
    portsOptions: computedOptions(52),
    // 电口数量
    electricalOptions: computedOptions(48),
    // 电口单位
    electricalUnitOptions: [
      {
        label: 'E',
        value: 'E',
      },
      {
        label: 'FE',
        value: 'FE',
      },
      {
        label: 'GE',
        value: 'GE',
      },
    ],
    // 光口数量
    lightOptions: computedOptions(4),
    // 光口单位
    lightUnitOptions: [
      {
        label: 'sfp',
        value: 'sfp',
      },
      {
        label: 'sfp+',
        value: 'sfp+',
      },
    ],
    // 端口数量
    portOptions: computedOptions(52),
  },
};

export const CATEGORY = {
  1: t('menu.menu.operateSystem'),
  2: t('menu.menu.applicationSystem'),
  3: t('menu.menu.networkEquipment'),
  4: t('menu.menu.securityEquipment'),
};

export const SYSTEM_ARCHITECTURE = {
  '32': '32' + t('target.digit'),
  '64': '64' + t('target.digit'),
  other: t('target.other'),
  null: '',
};

export const LANGUAGE = {
  cn: '中文（简体）',
  tc: '中文（繁體）',
  en: 'English',
  fr: 'Français',
  ru: 'русский',
  ja: '日本語',
  ko: '한국어',
  vi: 'Tiếng Việt',
  ar: 'العربية',
  other: 'Other',
  null: '',
};

export function computedOptions(max: number) {
  let electrical = [];
  for (let i = 0; i <= max; i++) {
    electrical.push({
      key: i,
      value: i,
      disabled: false,
    });
  }
  return electrical;
}
export const ENTITY_ACCESS_TABLE = [
  {
    title: t('menu.dialog.entity')[0],
    slot: 'entity_access_type',
  },
  {
    title: t('menu.dialog.entity')[1],
    slot: 'switch_port',
  },
  {
    title: t('menu.dialog.entity')[2],
    prop: 'entity_port',
  },
  {
    title: t('menu.dialog.entity')[3],
    prop: 'ip',
  },
  {
    title: t('menu.dialog.entity')[4],
    prop: 'mac_addr',
  },
  {
    title: t('menu.dialog.entity')[5],
    slot: 'access_modes',
  },
];
export const ENTITY_ACCESS_PROTOCOL = [
  {
    label: 'http',
    value: 'http',
  },
  {
    label: 'https',
    value: 'https',
  },
  {
    label: 'nc',
    value: 'nc',
  },
  {
    label: 'ssh',
    value: 'ssh',
  },
  {
    label: 'rdp',
    value: 'rdp',
  },
  {
    label: 'telnet',
    value: 'telnet',
  },
];
export const ENTITY_ACCESS_TYPE = {
  remote_address: t('target.entityAccessType')[0],
  device_port: t('target.entityAccessType')[1],
  wireless: t('target.entityAccessType')[2],
  mac_address: t('target.entityAccessType')[3],
  null: '--',
};
export const VIRTUAL_USB_TABLE = [
  {
    label: t('target.nodeName'),
    prop: 'name',
  },
  {
    label: t('global.introduction'),
    prop: 'description',
  },
  {
    label: t('target.capacity'),
    slot: 'capacity',
  },
];
export const ENTITY_USB_TABLE = [
  {
    label: t('target.server'),
    slot: 'host',
    width: 300,
  },
  {
    label: t('global.name'),
    prop: 'name',
    width: 300,
  },
  {
    label: t('target.model'),
    prop: 'model',
  },
  {
    label: t('target.param'),
    prop: 'params',
  },
];
