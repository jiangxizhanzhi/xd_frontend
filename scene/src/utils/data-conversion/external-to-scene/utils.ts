import _ from 'lodash';
/**
 * 判断是否已连线
 * @param connections
 * @param portId
 */
export function isLinkedToNode(connections: any, portId: any) {
  let isLinked = false;
  connections?.forEach((connection: any) => {
    if (connection.source === portId || connection.target === portId) {
      isLinked = true;
    }
  });
  return isLinked;
}

export function isJSON(str: any) {
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

/**
 * 获取节点位置
 * @param position2 x，y的序列化信息
 * @param center 画布中心点位置
 * @param originNode 原节点数据
 */
export function getPosition2(
  position2: string,
  center?: any,
  originNode?: any,
) {
  let node_position;
  if (!position2 && !originNode) {
    if (!center) {
      center = {
        x: '',
        y: '',
      };
    }
    node_position = JSON.stringify(center);
  } else if (position2) {
    node_position = position2;
  } else if (originNode) {
    node_position = JSON.stringify({
      x: originNode.x || 0,
      y: originNode.y || 0,
    });
  }
  let position = {
    x: 0,
    y: 0,
  };
  if (!_.isEmpty(node_position) && isJSON(node_position)) {
    if (node_position && JSON.parse(node_position)) {
      let newPos = transfer10(JSON.parse(node_position));
      position.x = newPos.x || 0;
      position.y = newPos.y || 0;
    }
  }
  return position;
}

export function transfer10(pos: { x: any; y: any }) {
  return {
    x: Math.floor(pos?.x / 20) * 20,
    y: Math.floor(pos?.y / 20) * 20,
  };
}

/**
 * 围绕中心点随机分布位置
 * @param center
 */
export function getRandomPosition(center: any) {
  // 随机出相距中心点的位置
  let x = randomNum(-center.x + 200, center.x - 200);
  let y = randomNum(-center.y + 200, center.y - 200);

  // 若x轴离中心点超过200，重新随机, 控制节点在中心点周围
  while (Math.abs(x) > 400) {
    x = randomNum(-center.x + 200, center.x - 200);
  }

  return { x: center.x + x, y: center.y + y };
}

/**
 * 生成从minNum到maxNum的随机数
 */
export function randomNum(minNum: any, maxNum: any) {
  switch (arguments.length) {
    case 1:
      return parseInt(String(Math.random() * minNum + 1), 10);
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    default:
      return 0;
  }
}

/**
 * 获取节点状态
 * 0：完成 1：报错 2：加载中
 * @param node
 */
export function getNodeStatus(node: any) {
  switch (node.process_status) {
    case 4:
      return 0;
    case 5:
      return 1;
    case undefined:
      return 0;
    default:
      return 2;
  }
}

interface NodeType {
  id: string;
  x?: number;
  y?: number;
  label: Array<string>;
  image: string;
  role: string;
  image_type: string;
  linkNodeList: Array<any>;
  status: number;
  links: Array<string>;
  children: Array<NodeType>;
  parent?: NodeType | undefined;
  empty?: Array<number>;
}

/**
 * 获取随机位置
 * @param points
 * @param connection
 * @param node
 * @param center
 */
function getNodePosition(
  points: Array<NodeType>,
  connection: Array<any>,
  node: Array<any>,
  center: any,
) {
  points.forEach((el) => {
    el.links = [];
    el.linkNodeList.forEach((item) => {
      let n = getNodeLinks(item.id, connection, node);
      if (n) {
        el.links.push(n as string);
      }
    });
  });

  const arrToTree = (points: Array<NodeType>) => {
    points = points.sort((a, b) => b.links.length - a.links.length);
    let curLength = 0;
    let treeArr: Array<Array<NodeType>> = [];
    let root = null;
    for (let i = 0; i < points.length; i++) {
      if (points[i].links?.length !== curLength) {
        treeArr.push([]);
        curLength = points[i].links?.length as number;
      }
      treeArr[treeArr.length - 1].push(points[i]);
    }
    root = treeArr[0][0];
    return addChild(root as NodeType);
  };

  const addChild = (node: NodeType) => {
    if (!node.links.length) return node;
    for (let i = 0; i < node.links.length; i++) {
      if (node.links[i] == node.parent?.id) {
        continue;
      }
      let cur = points.find((el) => el.id === node.links[i]) as NodeType;
      cur.parent = node;
      addChild(cur);
      node.children.push(cur);
    }
    return node;
  };

  const getPosition = (root: NodeType) => {
    let result: Array<NodeType> = [];
    let posMap = {
      1: 3,
      2: 4,
      3: 1,
      4: 2,
    };

    const _getPos = (root: NodeType) => {
      if (!root.parent) {
        root.x = center.x;
        root.y = center.y;
        root.empty = [2, 4, 1, 3];
      } else {
        let empty = root.parent.empty?.shift();
        root.empty = [2, 4, 1, 3].filter(
          (el) => el !== posMap[empty as 1 | 2 | 3 | 4],
        );
        let dis = root.children.length > 0 ? 300 : 150;
        switch (empty) {
          case 1:
            root.x = root.parent.x;
            root.y = (root.parent.y as number) - dis;
            break;
          case 2:
            root.x = (root.parent.x as number) + dis;
            root.y = root.parent.y;
            break;
          case 3:
            root.x = root.parent.x;
            root.y = (root.parent.y as number) + dis;
            break;
          case 4:
            root.x = (root.parent.x as number) - dis;
            root.y = root.parent.y;
            break;
          default:
            // throw new Error('no empty space');
            break;
        }
      }
      result.push(root);
      for (let i = 0; i < root.children.length; i++) {
        _getPos(root.children[i]);
      }
    };
    _getPos(root);
    return result;
  };

  let root = arrToTree(points);
  points = getPosition(root);
  points.forEach((el) => {
    delete el.empty;
    delete el.parent;
    // @ts-ignore
    delete el.children;
    // @ts-ignore
    delete el.links;
  });
  return points;
}

/**
 * 根据连线关系获取所连线的节点id
 * @param port
 * @param connections
 * @param node
 */
function getNodeLinks(
  port: string,
  connections: Array<any>,
  node: Array<any>,
): boolean | string {
  let isLinked = false;
  connections?.forEach((connection: any) => {
    if (connection.source == port) {
      isLinked = getNodeByPort(node, connection.target);
      return;
    } else if (connection.target == port) {
      isLinked = getNodeByPort(node, connection.source);
      return;
    }
  });
  return isLinked;
}

/**
 * 根据port获取node
 * @param data
 * @param port
 */
function getNodeByPort(data: Array<any>, port: string) {
  let node: any;
  data.forEach((el) => {
    if (el.ports?.some((p: any) => p.id == port)) {
      node = el;
      return;
    }
  });
  return node ? node.id : false;
}

/**
 * 判断是否为有效连线
 * @param edge
 * @param node
 */
function isEffectiveEdge(edge: any, node: any) {
  let target = node.some((el: any) => {
    return el.ports?.some((p: any) => p.id === edge.target);
  });
  let source = node.some((el: any) => {
    return el.ports?.some((p: any) => p.id === edge.source);
  });
  return target && source;
}
/**
 * 其他方法
 * 获取虚拟防火墙的rules
 */
export function getRules(data: any) {
  let rules: any[] = [];
  data?.forEach((item: any) => {
    rules.push({
      protocol: item.protocol,
      action: item.action,
      direction: item.direction, // 上/下/双向
      source_ip_address: item.source_ip_address,
      source_port: item.source_port,
      destination_ip_address: item.destination_ip_address,
      destination_port: item.destination_port,
    });
  });
  return rules;
}

/**
 * 获取路由器配置的Routers
 */
export function getRouters(data: any) {
  let routers: any[] = [];
  data?.forEach((item: any) => {
    routers.push({
      destination: item.destination,
      nexthop: item.nexthop,
      nexthop_port_id: item.hasOwnProperty('nexthop_port_id')
        ? item.nexthop_port_id
        : '',
    });
  });
  return routers;
}

/**
 * 获取虚拟交换机的DNS
 */
export function getDNS(data: any) {
  let DNS: any[] = [];
  data?.forEach((item: any) => {
    DNS.push({
      dns: item,
    });
  });
  return DNS;
}

/**
 * 获取虚拟交换机的addressRange
 */
export function getAddressRange(data: any) {
  let addressRange: any[] = [];
  data?.forEach((item: any) => {
    addressRange.push({
      startIp: item.start,
      endIp: item.end,
    });
  });
  return addressRange;
}

/**
 * 获取终端节点的access
 */
export function getAccess(data: any) {
  let access: any[] = [];
  data?.forEach((item: any) => {
    access.push({
      protocol: item.protocol,
      port: item.port,
      desc: item.desc,
      username: item.username,
      password: item.password,
      proxy: item.proxy,
    });
  });
  return access;
}

/**
 * 获取终端节点network
 * @param data 拓扑端口数据
 * @param plugin 插件节点数据
 * @param ports 插件端口数据
 */
export function getNetwork(data: any, plugin: any, ports: any) {
  let network: any[] = [];
  data?.forEach((item: any) => {
    network.push({
      id: item.id,
      name: item.name,
      ip: item.ip,
      egress: item.egress,
      ingress: item.ingress,
      access_modes: ports[item.id]?.access_modes,
      firewall_rules: ports[item.id]?.firewall_rules,
      mac_addr: item.mac_addr,
      conn_to_ext_net: ports[item.id]?.conn_to_ext_net, // 连接至外网
      entity_access_type: ports[item.id]?.entity_access_type,
      entity_switch_name: ports[item.id]?.entity_switch_name,
      entity_switch_port: ports[item.id]?.entity_switch_port,
      entity_port: ports[item.id]?.entity_port,
      connect_mode: ports[item.id]?.connect_mode,
    });
  });
  return network;
}

/**
 * 获取核心路由器的OSPF和bgp
 * @param data 拓扑端口数据
 * @param plugin 插件节点数据
 * @param ports 插件端口数据
 */
export function getRoute(data: any, plugin: any, ports: any) {
  let BGP: any[] = [];
  let OSPF: any[] = [];
  data?.forEach((item: any) => {
    if (ports[item.id]?.ospf_ip && ports[item.id]?.ospf_area) {
      OSPF.push({
        ospfIp: ports[item.id]?.ospf_ip,
        ospfArea: ports[item.id]?.ospf_area,
        portId: item.id,
      });
    }
    if (
      ports[item.id]?.bgp_as &&
      ports[item.id]?.bgp_ip &&
      ports[item.id]?.bgp_peer &&
      ports[item.id]?.bgp_peer_as
    ) {
      BGP.push({
        bgpAs: ports[item.id]?.bgp_as,
        bgpIp: ports[item.id]?.bgp_ip,
        bgpPeer: ports[item.id]?.bgp_peer,
        bgpPeerAs: ports[item.id]?.bgp_peer_as,
        portId: item.id,
      });
    }
  });
  return {
    BGP,
    OSPF,
  };
}
