import _ from 'lodash';
import getNodeCategory from '../../types/get-node-category';
// @ts-ignore
import { request } from '@cyber/helper';
import sceneStore from '../../store/scene-store';
import { getPortUUID } from '../common';
import SceneStore from '../../store/scene-store';
import { getNodeIdByPortId } from '../port-processing/port-generation';
import PageStatus from '../../pages/store/page-status';

/**
 * 根据角色值转换成接口定义的type值
 */
let type: any = {
  3: 0, // 外部网络
  22: 1, // 交换机
  21: 2, // 路由器
  23: 3, // 防火墙
  4: 4, // 终端
  7: 4, // 仿真节点
  1: 1,
};

// category 字段枚举值
enum category {
  operatingSystem = 1, // 操作系统
  applicationSystem = 2, // 应用系统
  networkEquipment = 3, // 网络设备
  securityEquipment = 4, // 安防设备
  layer = 5, // 层节点
}

/**
 * 拖拽节点后新增config配置
 * @param id 节点id
 * @param data 靶标数据
 * @param menubar 用户自定义菜单项配置，默认为[]
 * @param image 图标
 * @param area 当前层的id
 */
export async function targetToElement(
  id: any,
  data: any,
  menubar: any,
  image: string,
  area?: string, // 当前层的id
) {
  const typeData =
    data.image_type === 'vm'
      ? data.ext_vm
      : data.image_type === 'container'
      ? data.ext_docker
      : {};
  const init_support = typeData?.init_support;
  const quick_create_params = getQuickCreateParams(
    typeData?.quick_create_params,
  );
  const quick_create_support = typeData?.quick_create_support;
  const TYPE = getNodeCategory(
    data.role,
    data.image_type,
    data.is_internal,
  ).type;
  const netCardNum = data.role === 4 || data.role === 7 ? 1 : 0;
  const console_config = getConsoleConfig(data);
  let platform = data.ext_vm?.ext_info?.ext_dynamips?.platform;
  const port_infos =
    (platform &&
      sceneStore.state.dynamicsData?.filter(
        (item: any) => item.platform == platform,
      )[0]?.port_infos) ||
    [];
  const flavor = data.ext_vm?.ext_info?.ext_dynamips?.flavor;
  return {
    applicationConfig: {},
    basicConfig: {
      area_id: area,
      title: data.title,
      name: data.label, // 设备名称
      type: type[data.role], // 设备类型
      icon: image, // 设备图标
      logoData: data.logoData, // base64图片
      icon3: '',
      category: data.category,
      category2: data.category2,
      category3: data.category3,
      system_language: data.ext_system_info?.language, // 系统语言
      system_architecture: data.ext_system_info?.system_architecture, // 系统架构
      parent_system_type: data.ext_system_info?.parent_system_type, // 二级系统类型
      system_type: data.ext_system_info?.system_type, // 三级系统类型
      image: data.mirror || data.default_launch_image_name || data.name, // 靶标新增default_launch_image_name字段
      platform: data.ext_vm?.ext_info?.ext_dynamips?.platform, // dynamips节点匹配端口数
      role: data.role, // 角色信息
      image_type: data.image_type, // 镜像类型 'vm'||'container'||'entity'
      image_uuid: data.image_uuid, // 靶标id，用于查询快照
      netCardNum: netCardNum, // 网卡数量
      cpu: data.ext_vm?.cpu || 0,
      ram: typeData?.ram || 0,
      disk: typeData?.disk || 0,
      ...flavor,
      is_build_in: data.is_internal, // 是否内置镜像
      init_support: init_support, // 是否支持cloud-init
      // 电口数量
      electrical: {
        count: data.image_type === 'simple' ? 4 : 0,
        unit: 'E',
      },
      // 光口数量
      light: {
        count: 0,
        unit: 'sfp',
      },
      // wan口数量
      wan: {
        count: getWanNum(data, port_infos),
        unit:
          TYPE === 'build_in_router' || data.image_type === 'dynamips'
            ? 'sfp'
            : 'E',
      },
      // lan口数量
      lan: {
        count: getLanNum(data),
        unit: 'E',
      },
      roles: [], // 角色信息
      process_message: '', // 场景启动后节点的错误信息
      quick_create_params: quick_create_params, // 快速构建参数
      quick_create_support: quick_create_support, // 是否支持快速构建
      ospfRouterId: '', // 核心路由器ospf协议的routerId字段
      ripLoopback: '', // 核心路由器rip协议的loopback字段
      iso_attach_filename:
        data.image_type == 'vm' && data.ext_vm?.iso_attach
          ? data.ext_vm?.iso_attach_filename
          : undefined, // 虚拟机ISO挂载
      iso_tmpdir_uuid:
        data.image_type == 'vm' && data.ext_vm?.iso_attach
          ? data.ext_vm?.iso_tmpdir_uuid
          : undefined, // 虚拟机ISO挂载
      virtual_usbs: [], // USB仿真
      entity_usbs: [], // 实体USB
      docker_params: {
        environment_str: data.ext_image_info?.meta_data?.environment_str,
        tty: data.ext_image_info?.meta_data?.tty,
        interactive: data.ext_image_info?.meta_data?.interactive,
        host_config_ex_str: data.ext_image_info?.meta_data?.host_config_ex_str,
        options: data.ext_image_info?.meta_data?.options, // 高级选项开关
        image_source: data.ext_image_info?.image_source, // 判断是否展示高级选项开关
      },
    },
    // 网络配置数据
    networkConfig: {
      network: generatePort(id, data, TYPE, netCardNum, port_infos) || [], // 网络配置中的端口信息
      address:
        (data.role === 22 && data.image_type === 'simple') || data.role === 1
          ? `192.168.${
              sceneStore.state.targetNum.switcher +
              PageStatus.state.anotherLayerNodeCount +
              1
            }.0/24`
          : '', // 地址段
      gateway:
        (data.role === 22 && data.image_type === 'simple') || data.role === 1
          ? `192.168.${
              sceneStore.state.targetNum.switcher +
              PageStatus.state.anotherLayerNodeCount +
              1
            }.254`
          : '', // 网关
      DNS:
        (data.role === 22 && data.image_type === 'simple') || data.role === 1
          ? [{ dns: '8.8.8.8' }, { dns: '114.114.114.114' }]
          : [], // DNS
      vlanId: null, // VLan ID
      dhcp: true, // DHCP
      addressRange: [], // 地址范围
      console_config: console_config, // console协议
    },
    // 其他配置
    otherConfig: {
      order: [],
      file: '',
      node_command: '',
    },
    // 路由配置
    routerConfig: {
      routerConfig: [], // 静态路由表
      route: {
        OSPF: [],
        BGP: [],
        RIP: [],
      },
    },
    throughConfig: {},
    // 数据采集数据
    cpcollection: {
      elements: {
        [id]: await getCommonProbesFunc(
          init_support,
          menubar,
          data.ext_system_info?.system_type,
          id,
          PageStatus.state.showMenu,
        ),
      },
    },
    // 流量发生数据
    cpFlow: undefined,
    // 实装设备协议采集配置
    snmp_config:
      data.image_type === 'entity' ? packageSnmp(data.ext_entity) : undefined,
    mib_data: data.image_type === 'entity' ? [] : undefined, // mib解析树
  };
}

/**
 * 生成port,规则如下
 * 终端节点
 * 简易型网关
 * 虚拟机、容器型网关
 * 外部网络
 */
/**
 *
 * @param id 节点id
 * @param data 靶标数据
 * @param TYPE 靶标节点分类值
 * @param max_port_number 网卡数量，终端节点时传入
 * @param port_infos dynamips 节点需要生成端口数据
 */
function generatePort(
  id: string,
  data: any,
  TYPE: string,
  max_port_number?: any,
  port_infos?: any,
) {
  // 实体设备
  if (data.image_type === 'entity') {
    return getNetwork_entity(id, data);
  }
  // 角色为终端时，虚拟机型取ext_vm里的access_protocols
  if (TYPE == 'vserver') {
    return getNetwork_Terminal_Vm(id, data, max_port_number);
  }
  // 角色为终端时, 容器型取ext_docker里的access_protocols
  if (TYPE == 'cserver') {
    return getNetwork_Terminal_Container(id, data, max_port_number);
  }
  // 仿真节点
  if (TYPE === 'npc') {
    return getNetwork_Terminal_Npc(id, max_port_number);
  }
  // 角色为网关时,且为镜像设备时
  if ([21, 22, 23, 1].includes(data.role) && data.image_type != 'entity') {
    return getNetwork_gateway(id, data, data.is_internal, port_infos);
  }
  // 外部网络默认端口
  if ([3].includes(data.role)) {
    return getNetwork_Internet(id, data);
  }
}

// 生成外部网络的端口
function getNetwork_Internet(id: string, data: any) {
  let network_default = [];
  for (let i = 1; i < 2; i++) {
    network_default.push({
      id: getPortUUID(id, 1),
      name: data.name,
      ip: '',
      usable: true,
    });
  }
  return network_default;
}

// 生成层节点的端口
export function getNetwork_layerNode(id: string, data: any) {
  let network_default = [];
  for (let i = 1; i < 2; i++) {
    network_default.push({
      id: getPortUUID(id, 1, 'layer'),
    });
  }
  return network_default;
}

/**
 * 生成实体设备的默认网络配置，实体设备不能增删端口
 * @param id 节点ID
 * @param data
 * @returns 实体设备的默认网络配置
 */
function getNetwork_entity(id: string, data: any) {
  let network_default = [];
  if (data.ext_entity_access && Object.keys(data.ext_entity_access).length) {
    let access_protocols = [];
    network_default = data.ext_entity_access?.map(
      (item: any, index: number) => {
        access_protocols = item.access_protocols?.map((itm: any) => {
          return {
            password: itm.password,
            port: itm.port,
            protocol: itm.protocol,
            username: itm.username,
            path: itm.path,
            hostname: itm.hostname,
            proxy: true,
            access_ip: itm.hostname,
            private_key_enable: itm.private_key_enable,
            private_key_path: itm.private_key_path,
          };
        });
        return {
          id: getPortUUID(id, index + 1, 'entity'),
          nat: false,
          name: item.switch_port || item.port_name || '',
          ip: item.ip,
          egress: null,
          ingress: null,
          access_modes: access_protocols || [],
          mac_addr: item.mac,
          entity_access_type: item.access_type,
          entity_switch_name: item.switch_name,
          entity_switch_port: item.switch_port,
          entity_port: item.port_name,
          usable: true,
        };
      },
    );
  }
  return network_default;
}

/**
 * 获取虚拟机型终端节点的默认网络配置
 * @param id
 * @param data
 * @param max_port_number
 * @returns
 */
function getNetwork_Terminal_Vm(
  id: string,
  data: any,
  max_port_number: number,
) {
  let network_default: any[] = [];
  if (data.ext_vm && Object.keys(data.ext_vm).length) {
    let access_protocols =
      data.ext_vm?.access_protocols?.map((itm: any) => {
        return {
          ...itm,
          proxy: true,
        };
      }) || [];
    network_default = portsByMaxPortNumber(
      id,
      max_port_number,
      access_protocols,
    );
  }
  return network_default;
}

/**
 * 获取容器型终端节点的默认网络配置
 * @param id
 * @param data
 * @param max_port_number
 * @returns
 */
export function getNetwork_Terminal_Container(
  id: string,
  data: any,
  max_port_number: number,
) {
  let network_default: any[] = [];
  if (data.ext_docker && Object.keys(data.ext_docker).length) {
    let access_protocols = data.ext_docker?.access_protocols?.map(
      (itm: any) => {
        return {
          ...itm,
          proxy: true,
        };
      },
    );
    network_default = portsByMaxPortNumber(
      id,
      max_port_number,
      access_protocols,
    );
  }
  return network_default;
}

/**
 * 获取NPC仿真节点的默认网络配置
 * @param id
 * @param max_port_number
 * @returns
 */
function getNetwork_Terminal_Npc(id: string, max_port_number: number) {
  let network_default = [];
  if (max_port_number) {
    for (let i = 1; i < max_port_number + 1; i++) {
      network_default.push({
        id: getPortUUID(id, i),
        nat: false,
        name: 'eth0/1',
        ip: '',
        egress: null,
        ingress: null,
        access_modes: [],
        usable: true,
      });
    }
  }
  return network_default;
}

/**
 * 获取镜像类型的网关节点的默认网络配置
 * dynamips默认没有端口
 * @param id
 * @param data
 * @param is_internal
 * @param port_infos
 * @returns
 */
export function getNetwork_gateway(
  id: string,
  data: any,
  is_internal?: boolean,
  port_infos?: any,
) {
  let network_default = [];
  let type: { [x: string]: any } = {
    1: { type: 'wan', num: 0 },
    2: { type: 'lan', num: 0 },
  };
  if (
    ['container', 'vm'].includes(data.image_type) &&
    data.ext_gateway &&
    Object.keys(data.ext_gateway).length
  ) {
    // 过滤出wan口和lan口
    let port_configs_filter = data.ext_gateway?.port_configs?.filter(
      (item: any) => !!type[item.port_type],
    );
    let console_configs_filter = data.ext_gateway?.console_config;
    let connect_mode =
      (data.role == 21 || data.role == 22) && data.image_type != 'simple'
        ? 'access'
        : null;
    network_default = port_configs_filter?.map((item: any, index: number) => {
      let access_protocols = _.compact(
        item.access_protocols?.map((protocol: any) => {
          if (
            !(
              protocol &&
              protocol.protocol &&
              (protocol.protocol == 'console' || protocol.protocol == 'COM')
            )
          ) {
            return {
              ...protocol,
              proxy: true,
              desc: protocol.description,
            };
          }
        }) || [],
      );
      if (index == 0) {
        let protocol = {};
        if (
          console_configs_filter &&
          Object.keys(console_configs_filter).length
        ) {
          protocol = {
            ...console_configs_filter,
            desc: console_configs_filter.description || '',
          };
          access_protocols.unshift(protocol);
        }
      }
      // 端口的序号根据wan口 和 lan 口数量区分
      type[item.port_type].num++;
      return {
        id: getPortUUID(
          id,
          type[item.port_type].num,
          type[item.port_type].type,
        ),
        nat: false,
        name: item.port_name || '--',
        ip: item.port_ips,
        egress: null,
        ingress: null,
        delay: null,
        loss: null,
        access_modes: access_protocols || [],
        connect_mode: connect_mode,
        port_connect_net_cidr: null,
        usable: true,
      };
    });
  } else if (data.image_type === 'dynamips') {
    let count = (port_infos?.length && port_infos[0]?.port_num) || 0;
    let portNames = (port_infos?.length && port_infos[0]?.port_names) || [];

    for (let i = 0; i < count; i++) {
      network_default.push({
        id: getPortUUID(id, i + 1, 'wan'),
        nat: false,
        name: portNames[i] || '--',
        ip: '',
        egress: null,
        ingress: null,
        access_modes: data?.ext_vm?.access_protocols || [],
        usable: true,
      });
    }
  } else if (data.image_type === 'simple') {
    // 复制问题
    let electricalInfo = {
      count: data?.electrical?.count || 4,
      unit: data?.electrical?.unit || 'E',
    };
    let lightInfo = {
      count: data?.light?.count || 0,
      unit: data?.light?.unit || 'sfp',
    };
    for (let i = 0; i < electricalInfo.count; i++) {
      network_default.push({
        id: getPortUUID(id, i + 1, 'electrical'),
        nat: false,
        name: `${electricalInfo.unit}0/${i + 1}`,
        egress: null,
        ingress: null,
        access_modes: [],
        firewall_rules: [],
        usable: true,
      });
    }
    for (let i = 0; i < lightInfo.count; i++) {
      network_default.push({
        id: getPortUUID(id, i + 1, 'light'),
        nat: false,
        name: `${lightInfo.unit}0/${i + 1}`,
        egress: null,
        ingress: null,
        access_modes: [],
        firewall_rules: [],
        usable: true,
      });
    }
  }
  return network_default;
}

/**
 * 获取虚拟机和容器型网关节点的WAN口数量
 * @param data 节点的数据
 * @param port_infos
 * @returns WAN口数量
 */
export function getWanNum(
  data: {
    role: number;
    image_type: string;
    ext_gateway: { port_configs: any[] };
  },
  port_infos?: any,
) {
  if (port_infos && !_.isEmpty(port_infos) && port_infos.length) {
    return port_infos[0]?.port_num;
  }
  if (
    [21, 22, 23].includes(data.role) &&
    ['container', 'vm'].includes(data.image_type)
  ) {
    if (!data.ext_gateway || !data.ext_gateway.port_configs.length) return 0;
    return (
      data.ext_gateway.port_configs?.filter((item: any) => item.port_type == 1)
        ?.length || 0
    );
  } else {
    return 0;
  }
}

/**
 * 复制节点的静态路由表配置
 * @param copyRouterConfig
 * @param id
 */
export function getCopyRouterConfig(copyRouterConfig: any, id: string) {
  if (copyRouterConfig) {
    return {
      // 静态路由表
      routerConfig: copyRouterConfig?.routerConfig?.map((item: any) => {
        let oldId = getNodeIdByPortId(item.nexthop_port_id);
        if (oldId) {
          item.nexthop_port_id = item.nexthop_port_id.replace(oldId, id);
          return {
            ...item,
            nexthop_port_id: item.nexthop_port_id,
          };
        } else {
          return item;
        }
      }),
      route: {
        OSPF: copyRouterConfig?.route?.OSPF?.map((item: any) => {
          let oldId = getNodeIdByPortId(item.portId);
          if (oldId) {
            item.portId = item.portId.replace(oldId, id);
            return {
              ...item,
              portId: item.portId,
            };
          } else {
            return item;
          }
        }),
        BGP: copyRouterConfig?.route?.BGP?.map((item: any) => {
          let oldId = getNodeIdByPortId(item.portId);
          if (oldId) {
            item.portId = item.portId.replace(oldId, id);
            return {
              ...item,
              portId: item.portId,
            };
          } else {
            return item;
          }
        }),
        RIP: copyRouterConfig?.route?.RIP?.map((item: any) => {
          let refreshId = item.portId.split('_');
          refreshId[1] = id;
          return {
            ...item,
            portId: refreshId.join('_'),
          };
        }),
      },
    };
  }
}

/**
 * 获取虚拟机和容器型网关节点的LAN口数量
 * @param data 节点的数据
 * @returns LAN口数量
 */
export function getLanNum(data: {
  role: number;
  image_type: string;
  ext_gateway: { port_configs: any[] };
}) {
  if (
    [21, 22, 23].includes(data.role) &&
    ['container', 'vm'].includes(data.image_type)
  ) {
    if (!data.ext_gateway || !data.ext_gateway.port_configs.length) return 0;
    return (
      data.ext_gateway.port_configs?.filter((item: any) => item.port_type == 2)
        ?.length || 0
    );
  } else {
    return 0;
  }
}

/**
 *
 * @param init_support
 * @param menubar 菜单项，如果为空或者有probe字段，可以进行下一步
 * @param system_type
 * @param id
 * @param showMenu 是否显示左侧菜单
 */
export async function getCommonProbesFunc(
  init_support: boolean,
  menubar: Array<any>,
  system_type: any,
  id: string,
  showMenu: boolean,
) {
  // 有数据采集菜单并且有操作系统类型
  if (
    (_.isEmpty(menubar) || menubar.includes('probe')) &&
    system_type &&
    showMenu
  ) {
    if (!init_support) return;
    let probes = SceneStore.state.commonProbes || (await getCommonProbes());
    return {
      enable_probe_collect: false, // 通用开关默认开启
      edited: false, // 标记是否配置过
      probes,
    };
  }
  return;
}

/**
 * 获取通用探针
 */
export async function getCommonProbes() {
  let data = await request.get(
    '/probes/page/',
    { pageSize: 1000, types: 0 },
    { baseURL: '/api/mp' },
  );
  return packageData(_.get(data.data, 'data.list', []));
}

/**
 * 获取dynamics数据
 */
export async function getDynamicsData() {
  let res = await request.get(
    '/devops/cluster/images/dynamic_image_info',
    undefined,
    { baseURL: '/api/mp' },
  );
  return _.get(res, 'data.data.details', []);
}

/**
 * 重新组装通用探针数据
 */
function packageData(data: any) {
  // 调整通用探针的顺序
  let sortIndex = [
    '001',
    '002',
    '003',
    '004',
    '005',
    '006',
    '007',
    '011',
    '010',
    '008',
    '009',
  ];
  let sortData: any[] = [];
  sortIndex.forEach((index) => {
    data.forEach((item: any) => {
      if (item.id == index) {
        sortData.push({
          common: true,
          desc: item.description,
          id: item.id,
          disabled: false,
          interval: item.interval_sec,
          name: item.name,
          os_type: item.os_type,
          output_format: item.output_format,
          script_type: item.script_type,
          script_url: item.script_url,
          type: item.probe_category,
          collect_path: ['006', '007', '011'].includes(item.id) ? [''] : null,
          open: true,
        });
      }
    });
  });
  return sortData;
}

/**
 * 根据网卡数量生成终端的端口数
 * @param id
 * @param max_port_number
 * @param access_protocols
 * 2022.4.25 拆分协议接入和直接接入，接入方式添加默认有一条console协议数据
 * 2022.5.31 接入方式添加默认有一条console协议数据 ---去掉这个规则
 */
function portsByMaxPortNumber(
  id: string,
  max_port_number: number,
  access_protocols: any,
) {
  let network_default = [];
  if (max_port_number) {
    let new_access_modes: any[] = [];
    for (let i = 1; i < max_port_number + 1; i++) {
      access_protocols?.forEach((protocol: any) => {
        if (
          !(
            protocol &&
            protocol.protocol &&
            (protocol.protocol == 'console' || protocol.protocol == 'COM')
          )
        ) {
          new_access_modes.push({
            ...protocol,
            desc: protocol.description || '',
          });
        }
      });
      let consoleIndex = access_protocols?.findIndex(
        (protocol: any) =>
          protocol &&
          (protocol.protocol == 'console' || protocol.protocol == 'COM'),
      );
      // 如果传入的协议中有console接入协议，则调整console接入协议的顺序为第一条
      if (consoleIndex >= 0) {
        new_access_modes.unshift({
          ...access_protocols[consoleIndex],
          desc: access_protocols[consoleIndex]?.description || '',
        });
      }
      network_default.push({
        id: getPortUUID(id, i),
        nat: false,
        name: 'eth0/1',
        ip: '',
        egress: null,
        ingress: null,
        access_modes: new_access_modes || [],
        usable: true,
      });
    }
  }
  return network_default;
}

/**
 * 获取console协议
 * @param data
 */
function getConsoleConfig(data: any) {
  let _console_config;
  if (
    [21, 22, 23, 1].includes(data.role) &&
    data.image_type != 'entity' &&
    data.ext_gateway
  ) {
    if (data.ext_gateway.hasOwnProperty('console_config')) {
      _console_config = data.ext_gateway.console_config;
      if (
        _console_config &&
        !_.isEmpty(_console_config) &&
        _console_config.hasOwnProperty('protocol')
      ) {
        _console_config['protocol'] = 'console';
      }
    }
  }
  return _console_config;
}

/**
 * 获取快速构建参数并转换数据格式
 */
export function getQuickCreateParams(params: any) {
  if (_.isEmpty(params)) return [];
  let sceneParams: any[] = [];
  params.forEach((param: any) => {
    sceneParams.push({
      uuid: param.installer_uuid,
      name: param.name,
      description: param.description,
      logo: param.logo,
      docker_installer_data: {
        docker_url: param.file,
        start_up_parameter_list: param.settings,
      },
    });
  });
  return sceneParams;
}

function packageSnmp(data: any) {
  return {
    ...data.snmp_config,
    config_switch: false,
    version: data.snmp_version,
  };
}

/**
 * 修改说明
 * 2022.3.30
 * image字段默认为最新快照
 * 修改说明
 * 2022.3.31
 * 靶标接口新加一个default_launch_image_name字段，赋值给场景接口的image字段即可
 * 根据靶标新加的default_launch_image_name字段获取到最新快照
 */
