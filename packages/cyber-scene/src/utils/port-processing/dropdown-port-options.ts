import _ from 'lodash';
import getNodeCategory from '../../types/get-node-category';
import { getPortUUID } from '../common';

/**
 * 根据角色生成端口
 * @param nodeInfo 节点角色和id信息
 * @param sceneData 场景数据
 * @returns
 */
let options: Array<any>;

export function getOptions(
  nodeInfo: { id: string; role: number; image_type: string },
  sceneData?: any,
  linkNodeList?: any,
  all?: string,
) {
  const { type: NODE_TYPE } = getNodeCategory(
    nodeInfo.role,
    nodeInfo.image_type,
  );

  let _linkNodeList = linkNodeList || [];

  // 实体设备
  if (nodeInfo.image_type === 'entity') {
    options = [...getPort(sceneData)];
    return isAvailableOptions(_linkNodeList, options);
  }

  // 简易型网关，根据配置界面的光口和电口的数量生成，默认配置为 四个电口单位是E,光口为0单位是sfp
  else if (
    NODE_TYPE === 'switcher' ||
    NODE_TYPE === 'router' ||
    NODE_TYPE === 'firewall'
  ) {
    options = [...getPort(sceneData)];
    return isAvailableOptions(_linkNodeList, options);
  }

  // 虚拟机和容器型的网关
  else if (
    [
      'vrouter',
      'crouter',
      'vswitcher',
      'cswitcher',
      'vfirewall',
      'cfirewall',
      'build_in_router',
      'dyrouter',
      'dyswitcher',
      'dyfirewall',
    ].includes(NODE_TYPE)
  ) {
    options = [...getPort(sceneData)];
    return isAvailableOptions(_linkNodeList, options);
  }

  // 外部网络
  else if (NODE_TYPE === 'network') {
    let name = sceneData.basicConfig?.name;
    options = getPort_internet(nodeInfo.id, name, sceneData);
    return isAvailableOptions(_linkNodeList, options);
  }

  // 终端节点
  else if (['server', 'vserver', 'cserver', 'npc'].includes(NODE_TYPE)) {
    options = getPort(sceneData);
    return isAvailableOptions(_linkNodeList, options);
  }
}
/**
 * 获取端口数据
 * @param sceneData 场景数据
 * @returns
 */
export function getPort(sceneData: any) {
  let options: {
    label: any;
    value: any;
    disabled: boolean;
    usable: boolean;
  }[] = [];
  sceneData?.networkConfig?.network.forEach((port: any) => {
    options.push({
      label: port.name,
      value: port.id,
      disabled: false,
      usable: port.usable,
    });
  });
  return options;
}

/**
 * 生成外部网络的端口
 * 遍历network，取到所有的portId数据，取最后一个portId的值index,与network的length长度进行比较
 * 如果index > length，则从小到大生成index小于length的portId
 * 如果index <= length,则生成index为 length +1 的port
 * @param nodeId
 * @param name
 * @param sceneData
 * @returns
 */
export function getPort_internet(nodeId: string, name: number, sceneData: any) {
  let lastIndex = null;
  let options: any[] = [];
  let len = sceneData.networkConfig?.network.length || 0;
  let portIds = sceneData.networkConfig?.network
    .map((item: any) => {
      let idArr = item.id.split('_');
      return parseInt(idArr[idArr.length - 1]);
    })
    .sort();
  lastIndex = portIds[portIds.length - 1];
  // @ts-ignore
  if (lastIndex && lastIndex > len) {
    let temp = [];
    for (let i = 1; i < len + 1; i++) {
      if (portIds.length) {
        if (!portIds.includes(i)) {
          temp.push(i);
        }
      }
    }
    options = [
      {
        label: name,
        value: getPortUUID(nodeId, temp[0]),
        disabled: false,
      },
    ];
  } else {
    options = [
      {
        label: name,
        value: getPortUUID(nodeId, len + 1),
        disabled: false,
      },
    ];
  }
  return options;
}

/**
 * 生成外部网络的端口
 * @param nodeId
 * @param name
 * @returns
 */
export function getPortList_internet(
  nodeId: string,
  name: number,
  linkNodeList: any,
) {
  let len = linkNodeList ? linkNodeList.length : 0;
  let options = [];
  for (let i = 0; i < len; i++) {
    options.push({
      isInternet: true,
      label: name,
      value: getPortUUID(nodeId, i + 1),
      disabled: false,
    });
  }

  return options;
}

/**
 * 判断端口是否已用
 */
export function isAvailableOptions(linkNodeList: Array<any>, options: any) {
  const linkNodeIds = linkNodeList.map((item) => item.id);
  let _options = [];
  _options = options.map(
    (item: { value: any; label: any; usable: boolean }) => {
      let disabled = false;
      if (linkNodeIds.includes(item.value) || !item.usable) {
        disabled = true;
      }
      return {
        ...item,
        disabled,
      };
    },
  );
  return _options;
}
