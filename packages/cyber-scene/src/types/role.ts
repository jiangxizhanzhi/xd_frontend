import t from '../utils/i18n';
/**
 * role值对应的类型
 *   3 => 外部网络
 *   22 => 交换机
 *   21 => 路由器
 *   23 => 防火墙
 *   4 => 终端
 *   7 => 仿真节点
 *   1 => 二层交换机,
 */
export enum ROLE {
  network = 3,
  switch = 22,
  router = 21,
  firewall = 23,
  terminal = 4,
  npc = 7,
  simpleSwitch = 1,
}
// 根据靶标的role值匹配对应的类型名称(实装设备单独判断)
export function nodeTypeName(role: number, image_type: string, shape: string) {
  if (shape == 'image') {
    return t('target.layer');
  }
  if (role == ROLE['network']) {
    return t('target.externalNetwork');
  }
  if (role == ROLE['switch']) {
    return t('target.switches');
  }
  if (role == ROLE['router']) {
    return t('target.router');
  }
  if (role == ROLE['firewall']) {
    return t('target.firewall');
  }
  if (role == ROLE['terminal']) {
    return t('target.terminal');
  }
  if (role == ROLE['npc']) {
    return t('target.npcName');
  }
  if (role == ROLE['simpleSwitch']) {
    return t('target.switches');
  }
  if (image_type == 'entity') {
    return t('target.entity');
  }
}
export const LAYER_TYPE = 1; // 区块分为普通区块和层节点两种类型，type 0是普通区块 1是层节点
export const GROUP_TYPE = 0; // 区块分为普通区块和层节点两种类型，type 0是普通区块 1是层节点
