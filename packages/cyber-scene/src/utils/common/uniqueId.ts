import { v4 as uuidv4 } from 'uuid';

// TODO 靶标角色类型定义
// enum TargetType {
//   SWITCHER = 'switcher'
// }
interface Type {
  type:
    | 'switcher'
    | 'router'
    | 'vrouter'
    | 'crouter'
    | 'network'
    | 'server'
    | 'vserver'
    | 'cserver'
    | 'firewall'
    | 'port';
}

/**
 * 生成 UUID
 */
export function generateUUID() {
  return uuidv4();
}

/**
 * 生成各个分类节点 UUID
 * 分类：五大类 九小类
 * 二层网关 - 简易型 - switcher
 * 三层网关 - 简易型 - router
 *         - 虚拟机 - vrouter
 *         - 容器 - crouter
 * 外部网络 - 简易型 - network
 * 终端节点 - 简易型 - server
 *         - 虚拟机 - vserver
 *         - 容器 - cserver
 * 防火墙 - 简易型 - firewall
 *
 * 特殊端口
 * port - port
 */
export function getCategoryUUID(type: Type) {
  return type.type + '_' + generateUUID();
}

/**
 * 生成端口id
 * @param nodeId 所属节点的id
 * @param index 端口的序号
 * @param type 端口所属的类型,分为两大类，1：终端节点类型 2：光口、电口、wan、lan类型,不传值时默认为终端节点类型
 * @returns
 */
export function getPortUUID(
  nodeId: string,
  index: number,
  type?:
    | 'light'
    | 'electrical'
    | 'gateway'
    | 'wan'
    | 'lan'
    | 'entity'
    | 'layer',
) {
  if (type) {
    return `port_${nodeId}_${type}_${index}`;
  } else {
    return `port_${nodeId}_${index}`;
  }
}
