import _ from 'lodash';
import sceneStore from '../../../store/scene-store';
import PageStatus from '../../../pages/store/page-status';
import {
  getNodeNameByPortId,
  getPortNameByPortId,
} from '../../port-processing/port-generation';
import { GROUP_TYPE, LAYER_TYPE } from '../../../types/role';

// 数据转换模板
const ext_scene_config_data_template = {
  plugins: {
    cpcloud: {
      element_ports: {},
      elements: {},
      scene: {
        dns_nameservers: [],
      },
    },
    cpcollection: {
      element_ports: {},
      elements: {},
      scene: {
        enable_flow_collect: false,
        enable_flow_mirror: false,
      },
    },
    cpflow: {
      element_ports: {},
      elements: {},
      scene: {},
    },
  },
  topology: {
    area_id: '',
    areas: [] as any[],
    connections: [] as any[],
    node_connections: [] as any[],
    elements: [] as any[],
    pieces: [] as any[],
    scene: {
      display_context: '',
      description: '',
      name: '',
      file: '',
      type: '', // 场景保存类型  4为模板
    },
  },
};

/**
 * 将x6 toJSON方法返回的数据处理成接口格式数据
 * @param data
 * @param sceneId
 * @param area_id 层id
 * @param title
 * @param removeEid
 * @param sceneType
 */
export const x6ToExternal = (
  data: any,
  sceneId?: string,
  area_id?: string,
  title?: string,
  removeEid?: boolean,
  sceneType?: string,
) => {
  let ext_data = {
    scene_config: {},
    roles: _.cloneDeep(sceneStore.state.assets),
    type: 0,
    id: sceneId || undefined,
  };
  let getSceneId = sceneId || sceneStore.state.importSceneId || undefined;
  let ext_scene_config = _.cloneDeep(ext_scene_config_data_template);
  // 遍历画布中的元素
  data?.cells?.forEach((cell: any) => {
    // 节点类型
    if (cell.shape === 'rect') {
      const { base_elements, plugins_elements, cpcollection, cpFlow, ports } =
        singleNodeToExternalNode(
          cell,
          undefined,
          undefined,
          undefined,
          area_id,
          removeEid,
        );
      // topology-elements 数据
      ext_scene_config.topology.elements.push(base_elements);
      // 插件数据
      Object.assign(
        ext_scene_config.plugins.cpcloud.elements,
        plugins_elements,
      );
      // @ts-ignore
      Object.assign(
        ext_scene_config.plugins.cpcloud.element_ports,
        ports.element_ports,
      );

      // 流量发生
      if (!_.isEmpty(cpFlow)) {
        Object.assign(
          ext_scene_config.plugins.cpflow.elements,
          cpFlow.elements,
        );
      }
      // 数据采集
      if (!_.isEmpty(cpcollection)) {
        Object.assign(
          ext_scene_config.plugins.cpcollection.elements,
          cpcollection.elements,
        );
      }
    }
    // 连线
    if (cell.shape === 'edge') {
      // 层节点连线
      if (
        cell.source.port?.indexOf('layer') >= 0 ||
        cell.target.port?.indexOf('layer') >= 0
      ) {
        ext_scene_config.topology.node_connections.push({
          id: cell.id,
          source: cell.source.port,
          target: cell.target.port,
          vertices: cell.vertices, // 路径点
          type: getEdgeType(cell.router, cell.connector),
          display_context: getEdgeDisplayContext(cell, false),
        });
      } else {
        let sourceName = getNodeNameByPortId(cell.source.port);
        let sourcePortName = getPortNameByPortId(cell.source.port);
        let targetName = getNodeNameByPortId(cell.target.port);
        let targetPortName = getPortNameByPortId(cell.target.port);
        let upperEdgeData = cell.data?.upperEdgeData; // 有值代表是上层的连线

        ext_scene_config.topology.connections.push({
          id: cell.id,
          source: cell.source.port,
          target: cell.target.port,
          // 根据network取端口名称
          name: JSON.stringify({
            source: sourcePortName,
            target: targetPortName,
          }),
          unidirectional: false,
          vertices: upperEdgeData ? upperEdgeData.vertices : cell.vertices, // 路径点
          type: upperEdgeData
            ? upperEdgeData.type
            : getEdgeType(cell.router, cell.connector),
          display_context: getEdgeDisplayContext(cell, false),
          // 存储连线两端节点的名称
          info: JSON.stringify({
            source: sourceName,
            target: targetName,
          }),
        });
      }
    }
    // 文字标签
    if (cell.shape === 'text-block') {
      ext_scene_config.topology.pieces.push({
        area: '',
        type: 'text',
        position2: JSON.stringify(cell.position),
        description: cell.attrs.label.text,
        id: cell.id,
      });
    }
    // 区块
    if (cell.shape === 'html') {
      let position2 = {
        origin: cell.position,
        width: cell.size.width,
        height: cell.size.height,
      };
      ext_scene_config.topology.areas.push({
        position2: JSON.stringify(position2),
        id: cell.id,
        name: cell.attrs?.label?.text,
        display_context: getBlockDisplayContext(cell),
        type: GROUP_TYPE,
        area: cell.parent || area_id,
      });
    }
    // 层节点
    if (cell.shape === 'image') {
      let position2 = {
        origin: cell.position,
        width: cell.size.width,
        height: cell.size.height,
      };
      ext_scene_config.topology.areas.push({
        position2: JSON.stringify(position2),
        id: cell.id,
        name: cell.attrs?.text?.text?.trim()?.replace(/\s*/g, ''),
        area: cell.parent || area_id,
        type: LAYER_TYPE, // 类型为1的时候，是层节点
      });
    }
  });
  // 更新跨层连线的info字段
  sceneStore.state.crossLevelConnection?.forEach((edge) => {
    let origin = (edge.info && JSON.parse(edge.info)) || {
      source: '',
      target: '',
    };
    let sourceName = getNodeNameByPortId(edge.source);
    let targetName = getNodeNameByPortId(edge.target);
    edge.info = JSON.stringify({
      source: sourceName || origin.source,
      target: targetName || origin.target,
    });
  });
  // TODO
  ext_scene_config.topology.node_connections = [
    ...ext_scene_config.topology.node_connections,
    ...sceneStore.state.crossLevelNodeConnection,
  ];
  // TODO
  ext_scene_config.topology.connections = [
    ...ext_scene_config.topology.connections,
    ...sceneStore.state.crossLevelConnection,
  ];

  // @ts-ignore
  ext_scene_config.topology.area_id = PageStatus.state.currentTreeLevelId || '';
  // 赋值基础配置数据
  if (!_.isEmpty(sceneStore.state.basicConfig)) {
    let save_display_context = {};
    if (!PageStatus.state.currentTreeLevelId) {
      save_display_context = {
        ...sceneStore.state.basicConfig,
        graphTranslate: sceneStore.state.graph.translate(),
        graphZoom: sceneStore.state.graph.zoom(),
      };
    } else {
      // 组装新的display_context
      save_display_context = {
        ...sceneStore.state.basicConfig,
        graphTranslate: sceneStore.state.outDisplayContext?.graphTranslate,
        graphZoom: sceneStore.state.outDisplayContext?.graphZoom,
      };
    }
    ext_scene_config.topology.scene.display_context =
      JSON.stringify(save_display_context);
    ext_scene_config.plugins.cpcloud.scene.dns_nameservers =
      sceneStore.state.basicConfig.dns_nameservers;
    ext_scene_config.plugins.cpcollection.scene.enable_flow_collect =
      sceneStore.state.basicConfig.enable_flow_collect;
    ext_scene_config.plugins.cpcollection.scene.enable_flow_mirror =
      sceneStore.state.basicConfig.enable_flow_mirror;
  }
  if (PageStatus.state.menubar.length != 0) {
    if (!PageStatus.state.menubar.includes('flow')) {
      // @ts-ignore
      delete ext_scene_config.plugins.cpflow;
    }
    if (!PageStatus.state.menubar.includes('probe')) {
      // @ts-ignore
      delete ext_scene_config.plugins.cpcollection;
    }
  }
  // 若流量集合和流量发生 不存在值，将key全部删除
  if (!isHasFlow(ext_scene_config)) {
    // @ts-ignore
    delete ext_scene_config.plugins.cpflow;
  }
  if (!isHasCollection(ext_scene_config)) {
    ext_scene_config.plugins.cpcollection = {
      element_ports: {},
      elements: {},
      scene: {
        enable_flow_collect: sceneStore.state.basicConfig.enable_flow_collect,
        enable_flow_mirror: sceneStore.state.basicConfig.enable_flow_mirror,
      },
    };
  }
  // removeProperty(ext_scene_config);
  ext_data.scene_config = ext_scene_config;
  // console.log('导出的数据', ext_data);
  return ext_data;
};
// 过滤对象中为null/undefined的属性值
function removeProperty(obj: any) {
  if (!obj || _.isEmpty(obj)) return;
  const keys = Object.keys(obj);
  for (let key of keys) {
    const val = obj[key];
    if (
      typeof val === 'undefined' ||
      ((typeof val === 'object' || typeof val === 'string') && !val)
    ) {
      // 如属性值为null或undefined，则将该属性删除
      delete obj[key];
    } else if (typeof val === 'object') {
      // 属性值为对象，递归调用
      removeProperty(obj[key]);
      // if (Object.keys(obj[key]).length === 0) {
      //   // 如某属性的值为不包含任何属性的独享，则将该属性删除
      //   delete obj[key];
      // }
    }
  }
}

/**
 * 将编辑器内部单个节点的业务数据转换成接口类型的数据
 * @param cell 节点实例
 * @param type 类型 single-update时为拓扑更新时单节点数据转换
 * @param mpSceneId
 * @param position
 * @param area_id 层id
 * @param removeEid
 */
export function singleNodeToExternalNode(
  cell: any,
  type?: string,
  mpSceneId?: string,
  position?: any,
  area_id?: string,
  removeEid?: boolean,
) {
  const {
    basicConfig,
    cpFlow,
    cpcollection,
    networkConfig,
    otherConfig,
    routerConfig,
    throughConfig,
    snmp_config,
    mib_data,
  } = cell.data;
  // 处理端口数据
  const ports = getPorts(networkConfig.network, routerConfig?.route);
  // 整合topology.elements数据
  let base_elements = get_base_elements(
    cell,
    basicConfig,
    otherConfig,
    ports,
    position,
    cell.parent || area_id, // 有直接区块取直接区块的id
    removeEid,
  );
  // 整合plugins.elements数据
  let plugins_elements = get_plugins_elements(
    cell.id,
    basicConfig,
    networkConfig,
    routerConfig,
    snmp_config,
    mib_data,
  );

  // 过滤为空和undefined的数据
  for (let elementId in cpFlow?.elements) {
    if (!cpFlow.elements[elementId]) {
      delete cpFlow?.elements[elementId];
    }
  }
  // 过滤为空和undefined的数据
  for (let elementId in cpcollection?.elements) {
    if (!cpcollection.elements[elementId]) {
      delete cpcollection?.elements[elementId];
    }
  }
  if (type === 'single-update') {
    let updateData = _.cloneDeep(ext_scene_config_data_template);
    // @ts-ignore
    delete updateData.plugins.cpflow;
    // @ts-ignore
    delete updateData.plugins.cpcollection;
    // topology-elements 数据
    updateData.topology.elements.push(base_elements);
    // 插件数据
    Object.assign(updateData.plugins.cpcloud.elements, plugins_elements);
    Object.assign(
      updateData.plugins.cpcloud.element_ports,
      ports.element_ports,
    );
    return {
      update: updateData,
      id: mpSceneId,
      mp_scene_id: mpSceneId,
    };
  } else {
    return {
      base_elements,
      plugins_elements,
      cpcollection,
      cpFlow,
      ports,
    };
  }
}

/**
 * 获取连线类型
 * @param router edge.router
 * @param connector edge.connector
 * @return 'fold'-- 折线 'straight' --- 直线 'smooth' --- 曲线
 */
export function getEdgeType(router: any, connector: any) {
  if (router && router.name === 'orth') {
    return 'fold';
  } else {
    if (connector && connector.name === 'smooth') {
      return 'smooth';
    } else {
      return 'straight';
    }
  }
}

/**
 * 取编辑器内部格式数据的部分字段到topology.elements中
 * @param cellCls
 * @param basicConfig 设备信息数据
 * @param otherConfig 其他配置数据
 * @param ports 端口数据
 * @param position
 * @param parent 父级area id
 * @param removeEid
 */
function get_base_elements(
  cellCls: any,
  basicConfig: any,
  otherConfig: any,
  ports: any,
  position?: any,
  parent?: string,
  removeEid?: boolean,
) {
  return {
    area: cellCls.parent || basicConfig.area_id,
    outer_position2: basicConfig.outer_position2,
    display_context: getNodeDisplayContext(cellCls),
    eid: removeEid ? undefined : basicConfig.eid, // 实例id
    id: cellCls.id,
    name: basicConfig.name, // 设备名称
    type: basicConfig.type, // 设备类型
    icon2: basicConfig.icon, // 设备图标
    icon3: basicConfig.icon3, // 设备图标
    system_language: basicConfig.system_language, // 系统语言
    system_architecture: basicConfig.system_architecture, // 系统架构
    system_type: basicConfig.system_type, // 三级系统类型
    max_port_number: basicConfig.netCardNum, // 网卡数量
    cpu: basicConfig.cpu,
    ram: basicConfig.ram,
    disk: basicConfig.disk,
    nvram: basicConfig.nvram,
    init_commands: _.split(otherConfig?.order, ','), // 自定义命令
    ports: ports.ports, // 端口
    file: otherConfig?.file,
    node_command: otherConfig?.node_command,
    // 坐标取整数
    position2: JSON.stringify({
      x: Math.round(position !== undefined ? position.x : cellCls.position.x),
      y: Math.round(position !== undefined ? position.y : cellCls.position.y),
    }),
  };
}

/**
 * 取编辑器内部格式数据的部分字段到plugins.elements中
 * @param id 节点id
 * @param basicConfig 设备信息数据
 * @param networkConfig 网络配置数据
 * @param routerConfig  路由配置数据
 * @param snmp_config
 * @param mib_data
 */
function get_plugins_elements(
  id: string,
  basicConfig: any,
  networkConfig: any,
  routerConfig: any,
  snmp_config: any,
  mib_data: any,
) {
  return {
    [id]: {
      resource_id: basicConfig.resource_id,
      role: basicConfig.role,
      image_type: basicConfig.image_type,
      image_uuid: basicConfig.image_uuid,
      is_build_in: basicConfig.is_build_in,
      image: basicConfig.image,
      platform: basicConfig.platform,
      electric_port_number: basicConfig.electrical.count,
      electric_port_type: basicConfig.electrical.unit,
      optical_port_number: basicConfig.light.count,
      optical_port_type: basicConfig.light.unit,
      init_support: basicConfig.init_support,

      firewall_rules: getRules(basicConfig.rules),
      static_routes: getRoutes(routerConfig.routerConfig),
      category: basicConfig.category,
      category2: basicConfig.category2,
      category3: basicConfig.category3,
      cidr: networkConfig.address,
      gateway: networkConfig.gateway,
      dns_nameservers: getDNS(networkConfig.DNS),
      vlan_id: networkConfig.vlanId === 0 ? undefined : networkConfig.vlanId,
      dhcp: networkConfig.dhcp,
      allocation_pools: getAddressRange(networkConfig.addressRange),
      wan_port_number: basicConfig.wan?.count,
      wan_port_type: basicConfig.wan?.unit,

      lan_port_number: basicConfig.lan?.count,
      lan_port_type: basicConfig.lan?.unit,

      quick_create_params: basicConfig.quick_create_params || [],

      ospf_router_id: basicConfig?.ospfRouterId,
      rip_loopback: basicConfig?.ripLoopback,
      iso_attach_filename: basicConfig?.iso_attach_filename, // 虚拟机ISO挂载
      iso_tmpdir_uuid: basicConfig?.iso_tmpdir_uuid, // 虚拟机ISO挂载
      virtual_usbs: basicConfig?.virtual_usbs, // USB仿真
      entity_usbs: basicConfig?.entity_usbs, // 实体USB
      snmp_config:
        basicConfig.image_type === 'entity' ? snmp_config : undefined, // 实装设备协议采集配置
      mib_data: basicConfig.image_type === 'entity' ? mib_data : undefined, // mib解析树
      docker_params: basicConfig?.docker_params,
    },
  };
}

/**
 * 端口数据包含网络配置中的端口和路由配置中的端口协议配置
 * 将端口数据拆分为两部分，一部分放在topology.elements.ports,另一部分放在plugins.element_ports
 * @param networkConfig 网络配置中端口数据
 * @param routerConfig 路由配置中端口数据
 * @param role 节点角色值
 */
function getPorts(networkConfig: any, routerConfig?: any, role?: any) {
  let ports: any[] = [];
  let element_ports: any = {};
  networkConfig?.forEach((item: any) => {
    if (item.id) {
      let new_access_modes = item.access_modes?.map((item: any) => {
        return {
          ...item,
        };
      });
      ports.push(item);
      element_ports[item.id] = {
        access_modes: new_access_modes,
        entity_access_type: item.entity_access_type,
        entity_switch_name: item.entity_switch_name,
        entity_switch_port: item.entity_switch_port,
        entity_port: item.entity_port,
        // nat: !!item.nat,
        firewall_rules:
          role == 3
            ? undefined
            : item.firewall_rules
            ? item.firewall_rules
            : [],
        connect_mode: item.connect_mode || null,
        logic_network_id: item.logic_network_id,
        resource_id: item?.resource_id,
      };
    }
  });
  // 保存 OSPF
  if (routerConfig && routerConfig.hasOwnProperty('OSPF')) {
    routerConfig.OSPF?.forEach((item: any) => {
      if (item.portId) {
        element_ports[item.portId]['ospf_ip'] = item.ospfIp;
        element_ports[item.portId]['ospf_area'] = item.ospfArea;
      }
    });
  }
  // 保存 BGP
  if (routerConfig && routerConfig.hasOwnProperty('BGP')) {
    routerConfig.BGP?.forEach((item: any) => {
      if (item.portId) {
        element_ports[item.portId]['bgp_as'] = item.bgpAs;
        element_ports[item.portId]['bgp_ip'] = item.bgpIp;
        element_ports[item.portId]['bgp_peer'] = item.bgpPeer;
        element_ports[item.portId]['bgp_peer_as'] = item.bgpPeerAs;
      }
    });
  }
  // 保存 RIP
  if (routerConfig && routerConfig.hasOwnProperty('RIP')) {
    routerConfig.RIP?.forEach((item: any) => {
      if (item.portId) {
        element_ports[item.portId]['rip_ip'] = item.ripIp;
        element_ports[item.portId]['rip_pear'] = item.ripNeighbour;
      }
    });
  }
  return { ports: ports, element_ports: element_ports };
}

/**
 * 获取虚拟防火墙的Rules
 */
function getRules(data: any) {
  let rules: any[] = [];
  data?.forEach((item: any) => {
    rules.push({
      action: item.action,
      direction: item.direction, // 上/下/双向
      destination_port: item.destination_port,
      destination_ip_address: item.destination_ip_address,
      protocol: item.protocol,
      source_port: item.source_port,
      source_ip_address: item.source_ip_address,
    });
  });
  return rules;
}

/**
 * 地址范围
 * @param data
 */
function getAddressRange(data: any) {
  let addressRange: any[] = [];
  data?.forEach((item: any) => {
    addressRange.push({
      start: item.startIp,
      end: item.endIp,
    });
  });
  return addressRange;
}

/**
 * 获取路由器配置的routers
 */
function getRoutes(data: any) {
  let routes: any[] = [];
  data?.forEach((item: any) => {
    routes.push({
      destination: item.destination,
      nexthop: item.nexthop,
      nexthop_port_id: item.hasOwnProperty('nexthop_port_id')
        ? item.nexthop_port_id
        : '',
    });
  });
  return routes;
}

/**
 * 虚拟交换机的DNS
 * @param data
 */
function getDNS(data: any) {
  let dns: any[] = [];
  data?.forEach((item: any) => {
    dns.push(item.dns);
  });
  return dns;
}
/**
 * 判断是否为空，空的话删除key
 */
function isHasFlow(target: any) {
  const flows = _.get(target, 'plugins.cpflow.elements', {});
  let ishasflow = false;
  if (_.isEmpty(flows)) {
    return ishasflow;
  }
  const keys = Object.keys(flows);
  keys?.forEach((key) => {
    const keysFlows = flows[key]?.flows;
    if (!_.isEmpty(keysFlows)) {
      ishasflow = true;
    }
  });
  return ishasflow;
}

function isHasCollection(target: any) {
  const flows = _.get(target, 'plugins.cpcollection.elements', {});
  let ishascollection = false;
  if (_.isEmpty(flows)) {
    return ishascollection;
  }
  const keys = Object.keys(flows);
  keys?.forEach((key) => {
    const keysCollection = flows[key]?.probes;
    if (!_.isEmpty(keysCollection)) {
      ishascollection = true;
    }
  });
  return ishascollection;
}

// 获取节点的多样化属性配置
export function getNodeDisplayContext(cellCls: any, isCls?: Boolean) {
  let obj = {
    size: isCls ? cellCls.size()?.width : cellCls.size?.width,
    angle: isCls ? cellCls?.getAngle() : cellCls.angle,
    zIndex: isCls ? cellCls?.getZIndex() : cellCls.zIndex,
    text: { ...cellCls?.attrs?.text, opacity: 1 },
  };
  return JSON.stringify(obj);
}

// 获取连线的多样化属性配置
export function getEdgeDisplayContext(cellCls: any, isCls?: Boolean) {
  let obj = {
    line: {
      stroke: cellCls.attrs.line.stroke,
      zIndex: isCls ? cellCls?.getZIndex() : cellCls.zIndex,
      strokeWidth: parseFloat(cellCls.attrs.line.strokeWidth),
      strokeDasharray: cellCls.attrs.line.strokeDasharray,
      animation: cellCls.data?.animation, // 蚂蚁线动效
      animationDirections: cellCls.data?.animationDirections, // 动效的单向和双向
      ...cellCls.data.line,
      opacity: 1,
    },
    labels: {
      body: cellCls.labels &&
        cellCls.labels.length && {
          fill: cellCls.labels[0]?.attrs?.body?.fill,
          refWidth: cellCls.labels[0]?.attrs?.body?.refWidth,
          rx: cellCls.labels[0]?.attrs?.body?.rx,
          ...cellCls.data?.labels?.body,
          opacity: 1,
        },
      text: cellCls.labels &&
        cellCls.labels.length && {
          fill: cellCls.labels[0]?.attrs?.text?.fill,
          fontSize: cellCls.labels[0]?.attrs?.text?.fontSize,
          fontWeight: cellCls.labels[0]?.attrs?.text?.fontWeight,
          ...cellCls.data?.labels?.text,
          opacity: 1,
        },
      positionSource: cellCls?.labels && cellCls?.labels[0]?.position,
      positionTarget: cellCls?.labels && cellCls?.labels[1]?.position,
    },
  };
  return JSON.stringify(obj);
}

// 获取区块的多样性属性配置
function getBlockDisplayContext(cellCls: any) {
  let obj = {
    body: {
      fill: cellCls?.attrs?.body?.fill,
      stroke: cellCls?.attrs?.body?.stroke,
      strokeWidth: cellCls?.attrs?.body?.strokeWidth,
      transform: cellCls.angle,
      rx: cellCls?.attrs?.body?.rx,
      strokeDasharray: cellCls?.attrs?.body?.strokeDasharray,
    },
    label: {
      fontSize: cellCls?.attrs?.label?.fontSize,
      refY: cellCls?.attrs?.label?.refY,
      refX: cellCls?.attrs?.label?.refX,
      // fill: 'var(--neutral9)',
      fill: cellCls?.attrs?.label?.fill,
      transform: cellCls?.attrs?.label?.transform,
      transformOrigin: '-10px -15px',
      fontWeight: cellCls?.attrs?.label?.fontWeight,
    },
    zIndex: cellCls?.zIndex,
    angle: cellCls?.angle,
    animation: cellCls?.data?.animation, // 蚂蚁线动效
    fillPic: cellCls?.data?.fillPic, // 填充图片
  };
  return JSON.stringify(obj);
}
