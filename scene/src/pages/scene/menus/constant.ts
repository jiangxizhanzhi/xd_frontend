// @ts-ignore
import t from '../../../utils/i18n';
import { MENU_ENUM } from '../../../types/menu';

export const MENU = [
  {
    show: true,
    data: [
      {
        name: t('menu.menu.makeupTopology'),
        index: MENU_ENUM['topology'],
        icon: 'icon-tuopubianpai',
        value: 'topology',
        show: true,
      },
      {
        name: t('menu.menu.dataCollect'),
        index: MENU_ENUM['probe'],
        icon: 'icon-shujucaiji',
        value: 'probe',
        show: true,
      },
      {
        name: t('menu.menu.generatedTraffic'),
        index: MENU_ENUM['flow'],
        icon: 'icon-liuliangfasheng',
        value: 'flow',
        show: true,
      },
      {
        name: t('menu.menu.roleAssets'),
        index: MENU_ENUM['assets'],
        icon: 'icon-jiaosezichan',
        value: 'assets',
        show: true,
      },
      {
        name: t('menu.menu.warFlog'),
        index: MENU_ENUM['war'],
        icon: 'icon-zhanzhengmiwu',
        value: 'war',
        show: true,
      },
    ],
  },
  {
    show: true,
    data: [
      {
        name: t('menu.menu.shortcut'),
        index: MENU_ENUM['shortcut'],
        icon: 'icon-jingxiang',
        value: 'shortcut',
        show: true,
        id: 15,
      },
      {
        name: t('menu.menu.sceneTemplate'),
        index: MENU_ENUM['sceneTemplate'],
        icon: 'icon-changjingmoban',
        value: 'sceneTemplate',
        show: true,
      },
      {
        name: t('menu.menu.operateSystem'),
        index: MENU_ENUM['operatingSystem'],
        icon: 'icon-web',
        value: 'operatingSystem',
        show: true,
        id: 1,
        targetId: 1,
      },
      {
        name: t('menu.menu.applicationSystem'),
        index: MENU_ENUM['applicationSystem'],
        icon: 'icon-yingyongxitong',
        value: 'applicationSystem',
        show: true,
        id: 2,
        targetId: 2,
      },
      {
        name: t('menu.menu.networkEquipment'),
        index: MENU_ENUM['networkEquipment'],
        icon: 'icon-wangluoshebei',
        value: 'networkEquipment',
        show: true,
        id: 3,
        targetId: 3,
      },
      {
        name: t('menu.menu.securityEquipment'),
        index: MENU_ENUM['securityEquipment'],
        icon: 'icon-anfangshebei',
        value: 'securityEquipment',
        show: true,
        id: 4,
        targetId: 4,
      },
    ],
  },
];

export const SYSTEM_FUN = [
  {
    name: t('menu.menu.screenshot'),
    index: MENU_ENUM['screenshot'],
    icon: 'icon-jietu',
    value: 'screenshot',
    show: true,
  },
  {
    name: t('menu.menu.importConfig'),
    index: MENU_ENUM['importConfiguration'],
    icon: 'icon-daoru',
    value: 'importConfiguration',
    show: true,
  },
  {
    name: t('menu.menu.exportConfig'),
    index: MENU_ENUM['exportConfiguration'],
    icon: 'icon-daochu',
    value: 'exportConfiguration',
    show: true,
  },
  {
    name: t('menu.menu.createTemplate'),
    index: MENU_ENUM['createTemplate'],
    icon: 'icon-xinzeng',
    value: 'createTemplate',
    show: true,
  },
  {
    name: t('menu.menu.basicSetting'),
    index: MENU_ENUM['basicSetting'],
    icon: 'icon-shezhi',
    value: 'basicSetting',
    show: true,
  },
];
