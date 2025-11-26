import _ from 'lodash';
import sceneStore from '../../store/scene-store';
import { getPortUUID } from '../common';
import { setPortArgs } from '../../pages/scene/painter/node/config';
import { updatePortUsable } from '../connection/connection-rule';
// 端口类型
const PORT_TYPE = ['electrical', 'light', 'wan', 'lan'];

/**
 * 将当前端口数据进行分类（电口、光口），并返回分类后的下标序号组成的数组
 * @param network
 */
export function getPortsIndexList(network: any, type: string) {
  const allPortId = network?.map((port: any) => port.id);
  // 将当前所有的端口类型分类，电口--光口
  let typePortId = allPortId.filter((item: any) => item.includes(type)) || [];
  // 获取到数量改变之前的端口数据
  return typePortId
    ?.map((port: any) => port.split(type + '_')[1])
    .sort((a: any, b: any) => {
      return a - b;
    });
}

/**
 *
 * @param count 当前类型最新的端口数量
 * @param type 类型，电口|光口|wan|lan
 * @param nodeId 节点id
 * @param unit 单位
 * @param network 已经存在的所有端口
 * @param edges 拓扑连线信息
 * @param console_config 直接接入协议
 * @param is_build_in_router 是否是核心路由器，核心路由器时name为eth+序号
 * @param connect_mode 是否需要加 VLAN——mode下拉框 核心路由器、交换机（虚拟机、容器）、路由器（虚拟机、容器）
 * 返回 生成后最新的端口和删除的端口
 * @param is_dynamips dynamips的靶标需要设置指定的端口名称
 * @param nameArr 端口名称列表，针对于dynamips
 */
export function generatePorts(
  count: number,
  type: any,
  nodeId: string,
  unit: string,
  network: Array<any>,
  edges: any,
  console_config: any,
  is_build_in_router?: boolean,
  connect_mode?: boolean,
  is_dynamips?: boolean,
  nameArr?: any,
) {
  let network_port = _.cloneDeep(network);
  if (type) {
    // 获取到数量改变之前的端口数据
    let oldPortIdArr = getPortsIndexList(network, type);
    // 新增端口,并且排序 非dynamips
    if (!is_dynamips && oldPortIdArr.length < count) {
      let addCount = count - oldPortIdArr.length;
      let toBeAddPortIds = getPortIndex(oldPortIdArr, addCount);
      if (toBeAddPortIds.length) {
        for (let i = 0; i < toBeAddPortIds.length; i++) {
          let _prefix = unit + '0/' + toBeAddPortIds[i];
          let name = ['wan', 'lan'].includes(type)
            ? is_build_in_router
              ? _prefix + ` (eth${toBeAddPortIds[i]})`
              : _prefix + (type === 'wan' ? ' (WAN)' : ' (LAN)')
            : _prefix;
          network_port.push({
            id: getPortUUID(nodeId, toBeAddPortIds[i], type),
            nat: false,
            name: name,
            egress: null,
            ingress: null,
            delay: null,
            loss: null,
            access_modes: [],
            firewall_rules: [],
            connect_mode: connect_mode ? 'access' : null,
            port_connect_net_cidr: null,
            usable: true,
          });
        }
      }
    }
    if (is_dynamips) {
      let new_network_port = [];
      for (let i = 0; i < count; i++) {
        new_network_port.push({
          id: getPortUUID(nodeId, i + 1, type),
          nat: false,
          name: nameArr[i],
          egress: null,
          ingress: null,
          access_modes: [],
          firewall_rules: [],
          ip: network_port[i]?.ip || '',
          usable: true,
        });
      }
      network_port = new_network_port;
    }

    // 删除端口, 先删除没有连线的
    let toBeDeletedPortsArr: any[] = [];
    if (!is_dynamips && oldPortIdArr.length > count) {
      toBeDeletedPortsArr = changeNetworkNum(
        network.filter((item) => item.id.includes(type)),
        edges,
        oldPortIdArr.length - count,
      );
      network_port = _.compact(
        network_port.map((port) => {
          if (!toBeDeletedPortsArr.some((item: any) => item === port.id)) {
            return port;
          }
        }),
      );
    }
    if (
      network_port.length &&
      console_config &&
      Object.keys(console_config).length
    ) {
      if (
        !network_port[0].access_modes?.some(
          (item: any) => item.protocol == 'console' || item.protocol == 'COM',
        )
      ) {
        network_port[0].access_modes?.unshift(console_config);
      }
    }
    return {
      total: sortByPortId(network_port),
      deleted: toBeDeletedPortsArr,
    };
  }
}

/**
 * 处理change删除事件
 * 优先删除没连线的
 * 1. 先遍历现有的network配置数据，找出没有连线的端口，按顺序存入数组中->优先级为1，有连线的端口，按顺序存入数组中->优先级为2
 * 2. 监听删除操作，根据删除的优先级执行删除操作， 将所有被删除的数据存入一个新的deleteData数组
 * 3. 将原有的network配置数组执行遍历，剔除掉新的deleteData数组，得到新的数组
 * @param network 现有的所有network数据
 * @param edges topology.edges
 * @param num 删除的数量
 * @returns 经计算后需要删除的端口id组成的数组
 */
export function changeNetworkNum(network: any, edges: any, num: number) {
  let tempDelHighLevel = []; // 优先删除的数组
  let tempDelLowDelLevel: any[] = []; // 次删除的数组
  let deleteData = []; // 最终删除的portId
  const allPortId = network?.map((port: any) => port.id);
  // 遍历现有的network配置数据，找出有连线的端口 -优先级为2
  network?.forEach((port: any) => {
    if (edges && edges.length) {
      edges.forEach((edge: any) => {
        if (port.id === edge.source || port.id === edge.target) {
          tempDelLowDelLevel.push(port.id);
        }
      });
    }
  });
  tempDelHighLevel = tempDelLowDelLevel.length
    ? allPortId.filter(
        (item: any) => !tempDelLowDelLevel.some((temp) => temp == item),
      )
    : allPortId;

  // 如果num小于等于tempDelHighLevel数组长度，只删除tempDelHighLevel里面的ID, 先删除后面的
  if (num <= tempDelHighLevel.length) {
    deleteData = tempDelHighLevel.reverse().slice(0, num);
  } else {
    deleteData = [
      ...tempDelHighLevel,
      ...tempDelLowDelLevel.reverse().slice(0, num - tempDelHighLevel.length),
    ];
  }
  return deleteData;
}

/**
 * 获取所有端口的ip
 * @param network
 */
export function getIpsByNetwork(network: any) {
  if (_.isEmpty(network)) {
    return [];
  }
  let ips: any[] = [];
  network?.forEach((port: any) => {
    if (!ips.includes(port.ip)) {
      ips.push(port.ip);
    }
  });
  return ips;
}

/**
 * 将edges从数组格式转换为map格式
 * @param connections
 * 可用于判断是否是已连接端口
 */
export function edgesToMap(connections: any) {
  let connection_map = new Map();
  connections?.forEach((connection: any) => {
    connection_map.set(connection.source, connection.target);
    connection_map.set(connection.target, connection.source);
  });
  return connection_map;
}

/**
 * 将拓扑结构的连线数组转为原connections格式
 * @param edges
 */
export function topoEdgesToConnections(edges: any) {
  return edges?.map((edge: any) => {
    let labels = edge.getLabels();
    return {
      id: edge.id,
      source: edge.source.port,
      target: edge.target.port,
      name: JSON.stringify({
        source: labels[0]?.attrs?.text?.text,
        target: labels[1]?.attrs?.text?.text,
      }),
    };
  });
}

/**
 * 将network从数组格式转换为map格式
 * @param network
 * 可用于判断某个端口是否还存在
 */
export function networkToMap(network: any) {
  let network_map = new Map();
  network?.forEach((port: any) => {
    network_map.set(port.id, port);
  });
  return network_map;
}

/**
 * 将端口按照电口、光口、wan口、lan口分组，并分别根据id排序
 */
function sortByPortId(arr: Array<any>) {
  // 将数组分成type 个
  let sortedArr: any[] = [];
  PORT_TYPE.forEach((item) => {
    let arrGroup = arr.filter((port) => port.id.includes(item));
    sortedArr = [
      ...sortedArr,
      ...arrGroup.sort((port1, port2) => {
        return getPortIdx(port1.id) - getPortIdx(port2.id);
      }),
    ];
  });
  // LAN口端口名序号需要加上wan长度
  sortedArr = sortedArr?.map((port, index) => {
    if (port.id.includes('lan') && port.name.includes('0/')) {
      let new_index = port.name.split('0/')[1].split('');
      if (new_index[1] == ' ' || new_index[1] == '(') {
        new_index.splice(0, 1, index + 1);
      }
      if (new_index[2] == ' ' || new_index[2] == '(') {
        new_index.splice(0, 2, index + 1);
      }
      port.name = port.name.split('0/')[0] + '0/' + new_index.join('');
    }
    return port;
  });
  return sortedArr;
}

/**
 * 获取portId的序号
 */
function getPortIdx(portId: string) {
  let splitArr = portId.split('_');
  return parseInt(splitArr[splitArr.length - 1]);
}

/**
 * 计算待生成的端口的下标序号组成的数组
 * 取最后一个portId的值index
 * 如果lastIndex > length，则从小到大生成index小于length的portIndex
 * 如果lastIndex <= length，则生成index为 length +1 的portIndex
 * @param portIds 现有端口数据
 * @param addCount 需要添加的端口个数
 */
export const getPortIndex = (portIds: any, addCount: any) => {
  let lastIndex = [...portIds].pop();
  let DValueArr: any[] = [];
  /**
   * 如果数组长度小于等于最后一个端口的序号值，计算出间隔序号的数组
   *   如果计算后的数组长度大于等于addCount，则直接截取，返回
   *   如果计算后的数组长度小于addCount，则拼接计算的数组+剩余差值数组
   * 如果数组长度大于最后一个端口的序号值，计算出间隔序号的数组
   */
  if (lastIndex && lastIndex > portIds.length) {
    for (let i = 1; i < lastIndex + 1; i++) {
      if (portIds.length) {
        if (!portIds.includes(i.toString())) {
          DValueArr.push(i.toString());
        }
      }
    }
    if (DValueArr.length >= addCount) {
      return DValueArr.slice(0, addCount);
    } else {
      let temp = [];
      for (let i = 1; i < addCount - DValueArr.length + 1; i++) {
        temp.push(lastIndex + i);
      }
      return [...DValueArr, ...temp];
    }
  } else {
    let temp = [];
    for (let i = 1; i < addCount + 1; i++) {
      temp.push(portIds.length + i);
    }
    return temp;
  }
};

export function getConsole(data: any) {
  let console_protocol;
  if (data && data.length) {
    data?.forEach((item: any) => {
      let consoleProtocolIndex = item.access_modes?.findIndex(
        (protocol: any) =>
          protocol?.protocol == 'console' || protocol?.protocol == 'COM',
      );
      if (consoleProtocolIndex >= 0) {
        // if (_.isEmpty(console_config.value)) {
        console_protocol = _.cloneDeep({
          ...item.access_modes[consoleProtocolIndex],
        });
        // }
      }
    });
  }
  return console_protocol;
}
export function getTelnet(data: any) {
  let telnet_protocol;
  if (data && data.length) {
    data?.forEach((item: any) => {
      let telnetProtocolIndex = item.access_modes?.findIndex(
        (protocol: any) => protocol?.protocol == 'telnet',
      );
      if (telnetProtocolIndex >= 0) {
        telnet_protocol = _.cloneDeep({
          ...item.access_modes[telnetProtocolIndex],
          isTelnet: true,
        });
        return;
      }
    });
  }
  if (!telnet_protocol) {
    telnet_protocol = {
      isTelnet: false,
      protocol: 'telnet',
    };
  }
  return telnet_protocol;
}
/**
 * 更新外部网络的端口
 * @param sourceCell
 * @param targetCell
 * @param type 新增或者删除
 * @param edgeCls type为删除时，传入删除的连线实例
 */
export const updateNetworkPorts = (
  sourceCell: any,
  targetCell: any,
  type: string,
  edgeCls?: any,
) => {
  // 如果是外部网络连接，需要给外部网络节点新增一个端口
  let cell =
    sourceCell?.data?.basicConfig?.role == 3
      ? sourceCell
      : targetCell?.data?.basicConfig?.role == 3
      ? targetCell
      : null;
  if (!cell) return;
  const ports = cell?.data?.networkConfig?.network;
  let update_ports;
  let size = cell.size()?.size || 40;
  if (type === 'add') {
    let index = getNetworkPortIndex(ports);
    let addPort = {
      id: getPortUUID(cell.id, index),
      name: cell?.data?.basicConfig.name,
      ip: '',
      // nat: false,
      usable: true,
    };
    cell?.addPort({
      ...addPort,
      connected: false,
      group: 'bottom',
      args: {
        x: size ? size / 2 : 20,
        y: size ? size / 2 : 20,
      },
    });
    update_ports = Object.assign({}, cell?.data?.networkConfig, {
      network: [...ports, addPort],
    });
  } else {
    let toDeletedId =
      sourceCell?.data?.basicConfig?.role === 3
        ? edgeCls.source.port
        : edgeCls.target.port;
    cell.removePort({
      id: toDeletedId,
    });
    // ports
    let deletePortIdIndex = ports?.findIndex(
      (item: any) => item.id === toDeletedId,
    );
    ports.splice(deletePortIdIndex, 1);
    update_ports = Object.assign({}, cell?.data?.networkConfig, {
      network: [...ports],
    });
  }
  let update_node = Object.assign(cell?.data, { networkConfig: update_ports });
  cell.setData(update_node);
  cell.hide();
  cell.show();
  return cell;
};

/**
 * 重绘外部网络节点
 * @param update_ports
 * @param cell
 */
const repaintNetworkNode = (update_ports: any, cell: any) => {
  const portsArgsNew = setPortArgs(update_ports.network, 10);
  update_ports.network.forEach((item: any, i: any) => {
    cell.setPortProp(item.id, 'args', portsArgsNew[i]?.args);
  });
  // 连线位置不对，需要重绘一下节点
  cell.hide();
  cell.show();
};

/**
 * 外部网络计算待生成的端口的下标序号
 * @param ports 所有的端口数据
 * 取最后一个portId的值index
 * 如果index > length，则从小到大生成index小于length的portIndex
 * 如果index <= length，则生成index为 length +1 的portIndex
 */
const getNetworkPortIndex = (ports: any) => {
  let index; // 计算端口id所需要的下标序号
  let portIds =
    ports
      ?.map((port: any) => {
        let idArr = port.id.split('_');
        return parseInt(idArr[idArr.length - 1]);
      })
      .sort() || [];
  let lastIndex = portIds[portIds.length - 1] || null;
  if (lastIndex && lastIndex > portIds.length) {
    let temp = [];
    for (let i = 1; i < portIds.length + 1; i++) {
      if (portIds.length) {
        if (!portIds.includes(i)) {
          temp.push(i);
        }
      }
    }
    index = temp[0];
  } else {
    index = ports.length + 1;
  }
  return index;
};

/**
 * 根据节点id，获取该节点的所有连线数据
 * @param nodeId
 * @param connections
 */
export function getEdgesByNodeId(nodeId: string, connections?: Array<any>) {
  let edges: any[] = [];
  connections?.forEach((connection) => {
    let sourceNodeId = getNodeIdByPortId(connection.source);
    let targetNodeId = getNodeIdByPortId(connection.target);
    if (sourceNodeId == nodeId || targetNodeId == nodeId) {
      edges.push(connection);
    }
  });
  return edges;
}
/**
 * 根据端口id获取节点id
 */
export function getNodeIdByPortId(portId: string) {
  if (!portId) return null;
  if (portId.indexOf('_electrical')) {
    portId = portId.replace('_electrical', '');
  }
  if (portId.indexOf('_light')) {
    portId = portId.replace('_light', '');
  }
  if (portId.indexOf('_gateway')) {
    portId = portId.replace('_gateway', '');
  }
  if (portId.indexOf('_wan')) {
    portId = portId.replace('_wan', '');
  }
  if (portId.indexOf('_lan')) {
    portId = portId.replace('_lan', '');
  }
  if (portId.indexOf('_entity')) {
    portId = portId.replace('_entity', '');
  }
  if (portId.indexOf('_layer')) {
    portId = portId.replace('_layer', '');
  }

  let idArr = portId.split('_');
  let nodeId = '';
  idArr.forEach((item, index) => {
    if (index != 0 && index != idArr.length - 1) {
      if (index != idArr.length - 2) {
        nodeId += item + '_';
      } else {
        nodeId += item;
      }
    }
  });
  return nodeId;
}

export function getPortIdIndexByPortId(portId: string) {
  if (!portId) return null;
  let splitArr = portId.split('_');
  return splitArr[splitArr.length - 1];
}

/**
 * 根据端口id获取端口名称
 */
export function getPortNameByPortId(portId: string) {
  let node_id = getNodeIdByPortId(portId);
  if (node_id) {
    let network =
      sceneStore.state.graph.getCellById(node_id)?.data?.networkConfig?.network;
    return network?.find((port: any) => port.id === portId)?.name || null;
  }
}

/**
 * 根据端口id获取节点名称
 */
export function getNodeNameByPortId(portId: string) {
  let basicConfig = sceneStore.state.graph.getCellById(
    getNodeIdByPortId(portId),
  )?.data?.basicConfig;
  return basicConfig?.name || null;
}

/**
 * 端口单位同步该节点所有端口
 * 如果表单的单位有修改，则进行如下操作 1. 更新该节点所有的端口名称 2. 更新连线label名称
 */
export function updatePortUnit(
  network: any,
  basic: any,
  nodeFormDataBasicConfig: any,
  _this: any,
) {
  let electrical_unit = basic.electrical.unit;
  let light_unit = basic.light.unit;

  let wan_unit = basic.wan.unit;
  let lan_unit = basic.lan.unit;

  let { unit: old_electrical_unit } = nodeFormDataBasicConfig.electrical;
  let { unit: old_light_unit } = nodeFormDataBasicConfig.light;

  let { unit: old_wan_unit } = nodeFormDataBasicConfig.wan;
  let { unit: old_lan_unit } = nodeFormDataBasicConfig.lan;

  if (
    old_electrical_unit != electrical_unit ||
    old_light_unit != light_unit ||
    old_wan_unit != wan_unit ||
    old_lan_unit != lan_unit
  ) {
    _this.$emit(
      'update-port-name',
      network?.map((port: any) => ({ id: port.id, name: port.name })),
    );
    _this = null;
    nodeFormDataBasicConfig = null;
    basic = null;
  } else {
    _this = null;
    nodeFormDataBasicConfig = null;
    basic = null;
  }
}
// null -> -1
export const transferNull = (network: any) => {
  let new_network = [];
  new_network = network?.map((item: any) => {
    return {
      ...item,
      egress: item.egress === null ? -1 : item.egress,
      ingress: item.ingress === null ? -1 : item.ingress,
      loss: item.loss === null ? -1 : item.loss,
      delay: item.delay === null ? -1 : item.delay,
    };
  });
  return new_network;
};
// 获取与被删除的端口相连线的节点和连线数据
export const getDeletedTargetNodeAndEdge = (
  portId: string,
  topologyEdges: any,
) => {
  if (
    topologyEdges?.some(
      (edge: any) => edge.source === portId || edge.target === portId,
    )
  ) {
    for (let i = 0; i < topologyEdges.length; i++) {
      let item = topologyEdges[i];
      let cell;
      let handleId = '';
      let type;
      //  获取到与当前节点的portid 有关的edges信息
      if (portId == item.source) {
        handleId = item.target;
        type = 'target';
      } else if (portId == item.target) {
        handleId = item.source;
        type = 'source';
      }
      cell =
        sceneStore.state.graph?.getCellById(getNodeIdByPortId(handleId)) ||
        null;
      return {
        node: cell,
        edge: item,
        type: type,
      };
    }
  }
};
// 重置关联端口对端的usable属性值为true
export const clearConnectionPortUsable = (
  portId: string,
  topologyEdges: any,
) => {
  let data = getDeletedTargetNodeAndEdge(portId, topologyEdges);
  if (data) {
    let { node, edge, type } = data;
    updatePortUsable(
      type === 'source' ? node : undefined,
      type === 'target' ? node : undefined,
      type === 'source' ? edge.source : undefined,
      type === 'target' ? edge.target : undefined,
      true,
    );
  }
};
