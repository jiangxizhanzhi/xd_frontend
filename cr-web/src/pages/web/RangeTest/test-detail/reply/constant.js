import { getI18N } from '@cyber/helper';
const i18n = getI18N();
// 节点实例类型
// 1: 交换机, 2: 路由器, 3: 防火墙, 4: 虚拟机, 5: 容器, 6: 实体设备, 7: Npc, 8: Dynamips
export const VIRTUAL_TYPE = [
  {
    value: 1,
    label: i18n.t('monitorReplay.cloudPlatform.switch'),
  },
  {
    value: 2,
    label: i18n.t('monitorReplay.cloudPlatform.router'),
  },
  {
    value: 3,
    label: i18n.t('monitorReplay.cloudPlatform.firewall'),
  },
  {
    value: 4,
    label: i18n.t('monitorReplay.cloudPlatform.vm'),
  },
  {
    value: 5,
    label: i18n.t('monitorReplay.cloudPlatform.container'),
  },
  {
    value: 6,
    label: i18n.t('monitorReplay.monitorScene.physicalEquipment'),
  },
  {
    value: 7,
    label: i18n.t('monitorReplay.monitorScene.npc'),
  },
  {
    value: 8,
    label: i18n.t('monitorReplay.monitorScene.dynamips'),
  },
];
