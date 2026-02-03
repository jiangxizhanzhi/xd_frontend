import _ from 'lodash';
import {
  getAddressRange,
  getDNS,
  getPosition2,
  getRules,
  transfer10,
} from './utils';
import { LAYER_TYPE, ROLE } from '../../../types/role';
import { addNodeConfig } from '../../../pages/scene/painter/node';
import { initEdgeConfig } from '../../../pages/scene/painter/edge';
import sceneStore from '../../../store/scene-store';
import { generateUUID, getImagePromise, isJSON } from '../../common';
import { getNodeIdByPortId } from '../../port-processing/port-generation';
import { addLabelConfig } from '../../../pages/scene/painter/label';
import { addBlockConfig } from '../../../pages/scene/painter/block';
import { setEdgeLabels } from '../../connection/connection-rule';
import { reactive } from '@vue/composition-api';
import {
  getCommonProbesFunc,
  getNetwork_layerNode,
} from '../target-to-element';
import PageStatus from '../../../pages/store/page-status';
import { cyberBus } from '../../event-bus';
import { addLayerNodeConfig } from '../../../pages/scene/painter/layer-node';

/**
 * 外部数据处理
 * 1. 模板拖拽数据处理：替换各个节点id、插件id、根据鼠标位置计算节点位置
 * 2. 导入数据处理：刷新画布
 * @param externalData
 * @param position 鼠标位置，外部导入时传入画布中心点位置
 * @param isImport 是否是导入，除模板拖拽外其他的外部数据传入时为true，当为true时，会清空当前画布，然后重新绘制全部节点；当为false时，即局部渲染绘制节点（适用于模板拖拽）
 * @param sceneStatus 场景的模式
 */
export async function externalToX6(
  externalData: any,
  position: any,
  isImport?: boolean,
  sceneStatus?: any,
) {
  console.time('start');
  if (_.isEmpty(externalData)) return;
  const { roles, scene_config } = externalData;
  const {
    topology = {
      area_id: '',
      areas: [],
      connections: [],
      node_connections: [],
      elements: [],
      pieces: [],
      scene: {},
    },
    plugins = {
      cpcloud: { element_ports: {}, elements: {}, scene: {} },
      cpcollection: { element_ports: {}, elements: {} },
      cpflow: { element_ports: {}, elements: {} },
    },
  } = scene_config;

  const {
    area_id = '',
    areas = [],
    connections = [],
    node_connections = [],
    elements = [],
    pieces = [],
    scene = {},
  } = topology;
  const {
    element_ports: cpcloud_element_ports,
    elements: cpcloud_elements = {},
    scene: cpcloud_scene = {},
  } = plugins?.cpcloud || {};

  const {
    element_ports: cpflow_element_ports = {},
    elements: cpflow_elements = {},
    scene: cpflow_scene = {},
  } = plugins?.cpflow || {}; // 流量发生
  const {
    element_ports: cpcollection_element_ports = {},
    elements: cpcollection_elements = {},
    scene: cpcollection_scene = {},
  } = plugins?.cpcollection || {}; // 数据采集

  let nodes: any[] = []; // 将节点处理成x6格式
  let edges: any[] = []; // 将边处理成x6格式
  let keyOldId = new Map(); // 原节点id和新生成节点id的匹配关系,key值为原节点id
  let keyOldBlockId = new Map(); // 原区块id和新生成区块id的匹配关系,key值为原区块id
  // @ts-ignore
  let differ: { x: number; y: number } = { x: null, y: null }; // 偏移量计算
  let needLayout = false; // 是否需要布局算法布局，当前使用场景为：如果有一个节点没有位置坐标，即使用布局算法

  // 获取当前拓扑下的所有节点id和端口id
  let allIds = [
    ...Object.keys(cpcloud_element_ports || []),
    ...Object.keys(cpcloud_elements || []),
    ...areas.map((area: any) => area.id),
  ];

  // 基础配置，如果是全局导入且scene_config.topology.scene.display_text不为空，则需要重新赋值
  if (isImport) {
    sceneStore.state.basicConfig = reactive({
      active: 'background',
      enable_flow_collect: false,
      enable_flow_mirror: false,
      dns_nameservers: [],
      showLineLabels: false, // 是否展示端口名称
      backgroundList: [
        { key: 'background', value: '' },
        { key: 'background2', value: '' },
        { key: 'background3', value: '' },
      ],
      /**
       * 连线模式
       * true 简易型连线模式
       * false 需要选择端口
       */
      simpleModeToEdge: true,
      graphTranslate: '', // 画布偏移量
      graphZoom: '', // 画布缩放比例
      // 右下方画布工具栏
      showGraphToolbar: true,
      // 右下方节点数量限制信息展示
      showNodeLimitTip: sceneStatus === 'edit',
      layoutType: 'none', // 布局类型
      backgroundType: 'background-image', // 背景类型 background-image || background-color
      backgroundColor: 'var(--bg-color-1)', // 背景色值
      showGrid: true, // 网格
    });
    // sceneStore.state.assets = reactive([]);
    sceneStore.state.targetNum = reactive({
      nodes: 0, // 记录更新当前场景的节点数量
      switcher: 0,
    });
    sceneStore.state.iconPool = new Map(); // 场景图片地址池
    sceneStore.state.iconPoolData = new Map(); // 缓存图片
    // 在全局场景数据store中存入display_context
    if (!_.isEmpty(scene)) {
      if (!_.isEmpty(scene.display_context)) {
        let display_context = isJSON(scene?.display_context)
          ? JSON.parse(scene?.display_context)
          : scene?.display_context;
        sceneStore.setBasicConfig(display_context);
        sceneStore.setOutDisplayContext(display_context);
      }
    }
    sceneStore.state.edgeCount = 0;
  }
  // 记录连线的数量
  sceneStore.setEdgeCount(connections.length);
  // sceneStore.state.crossLevelConnection = []; // 清空跨层连线数据

  // 遍历块数据存入blocks
  areas?.forEach((element: any, index: number) => {
    let blockId = isImport ? element.id : generateUUID();
    if (PageStatus.state.openLayer) {
      blockId = element.id;
    }
    keyOldBlockId.set(element.id, blockId);
    if (element.type == LAYER_TYPE) {
      keyOldId.set(element.id, blockId);
      allIds.push(`port_${blockId}_layer_1`);
    }

    let { origin, width, height } = JSON.parse(element.position2);
    if (PageStatus.state.openLayer) {
      if (
        !sceneStore.state.graph
          .getNodes()
          .map((item: any) => item.id)
          ?.some((val: any) => val == blockId)
      ) {
        differ.x === null &&
          (differ = computedXY(getPosition2(JSON.stringify(origin)), position));
      }
    } else {
      if (!isImport && index === 0) {
        differ = computedXY(getPosition2(JSON.stringify(origin)), position);
      }
    }
    let blockPosition = {
      x: isImport
        ? getPosition2(JSON.stringify(origin), position).x
        : getPosition2(JSON.stringify(origin), position).x - differ.x,
      y: isImport
        ? getPosition2(JSON.stringify(origin), position).y
        : getPosition2(JSON.stringify(origin), position).y - differ.y,
    };
    let block;
    // type 0是普通区块 1是层节点
    if (element.type == LAYER_TYPE) {
      block = addLayerNodeConfig(
        blockId,
        element.name,
        {
          type: element.type,
          basicConfig: { area_id: element.area },
          networkConfig: {
            network: getNetwork_layerNode(blockId, { name: element.name }), // 端口信息
          },
        },
        blockPosition,
        element.icon2,
      );
    } else {
      block = addBlockConfig(
        blockId,
        blockPosition,
        {
          x: blockPosition.x + width,
          y: blockPosition.y + height,
        },
        element.name,
        [],
        undefined,
        element.display_context,
      );
    }
    nodes.push(block);
  });

  // 遍历标签数据存入labels
  pieces?.forEach((element: any) => {
    // 新线id
    let labelId = isImport ? element.id : generateUUID();
    if (PageStatus.state.openLayer) {
      labelId = element.id;
    }
    let position = JSON.parse(element.position2);
    let piece = addLabelConfig(
      labelId,
      position.x,
      position.y,
      element.description,
    );
    nodes.push(piece);
  });

  // 遍历节点数据存入nodes
  for (let index = 0; index < topology?.elements.length; index++) {
    let element = topology?.elements[index];
    let _position2 =
      (element.position2 && JSON.parse(element.position2)) || element.position2;
    element.position2 = JSON.stringify({
      x: Math.round(_position2?.x || 0),
      y: Math.round(_position2?.y || 0),
    });
    let outer_position2 =
      element.outer_position2 &&
      area_id &&
      Object.keys(element.outer_position2)?.length &&
      element.outer_position2[area_id];
    // 新的节点id
    let nodeId;
    if (!isImport) {
      // 模板拖拽时的数据处理，重新生成节点id
      nodeId = PageStatus.state.openLayer ? element.id : generateUUID();
      // 根据nodeId，新增newId属性
      setNewPortId(element.ports, nodeId);
      // 删掉原插件数据，根据新的节点id重新生成
      setPluginsId(element.id, nodeId, cpflow_elements, cpcollection_elements);
      if (PageStatus.state.openLayer) {
        if (
          !sceneStore.state.graph
            .getNodes()
            .map((item: any) => item.id)
            ?.some((val: any) => val == nodeId)
        ) {
          differ.x === null &&
            (differ = computedXY(
              getPosition2(JSON.stringify(_position2)),
              position,
            ));
        }
      } else {
        if (index === 0 && !differ.x) {
          differ = computedXY(getPosition2(element.position2), position);
        }
      }
    } else {
      nodeId = element.id;
    }
    keyOldId.set(element.id, nodeId);
    if (!needLayout && !_position2) {
      // 如果有一个节点没有位置坐标，即需要使用布局算法
      needLayout = true;
    }
    let node_position = element.position2
      ? JSON.parse(element.position2)
      : { x: '', y: '' };
    if (PageStatus.state.openLayer) {
      if (outer_position2 && isJSON(outer_position2)) {
        node_position = JSON.parse(outer_position2);
      }
    }
    let transferNodePosition = transfer10({
      x: Number(node_position.x) - differ.x,
      y: Number(node_position.y) - differ.y,
    });
    let nodePosition = {
      x: isImport ? node_position.x : transferNodePosition.x,
      y: isImport ? node_position.y : transferNodePosition.y,
    };
    // 整合plugins和topology到节点中
    const nodeScene = await getScene(
      element,
      nodeId,
      cpcloud_elements,
      cpcloud_element_ports,
      cpflow_elements,
      cpcollection_elements,
      isImport,
      connections,
    );
    // 组装绘制节点的配置属性数据
    const isUpperNode =
      PageStatus.state.currentTreeLevelId &&
      nodeScene[nodeId].basicConfig?.area_id !=
        PageStatus.state.currentTreeLevelId &&
      !nodes
        .filter((node) => node.shape == 'html')
        ?.some((node) => node.id == nodeScene[nodeId].basicConfig?.area_id);

    let node = addNodeConfig(
      nodeId,
      element.icon2,
      element.name,
      nodeScene[nodeId],
      false,
      nodePosition,
      keyOldBlockId.get(element.area),
      element.display_context,
      isUpperNode,
    );
    // 设置父级区块的children值
    let parentBlockId = keyOldBlockId.get(element.area);
    if (parentBlockId) {
      nodes
        .filter((node) => node.id === parentBlockId)[0]
        .children?.push(nodeId);
    }
    nodes.push(node);
  }

  // 遍历线数据存入edges
  connections?.forEach((connection: any) => {
    if (PageStatus.state.openLayer) {
      // 新线id
      if (
        connection.source.indexOf('port') >= 0 &&
        connection.target.indexOf('port') >= 0
      ) {
        if (
          allIds.includes(connection.source) &&
          allIds.includes(connection.target)
        ) {
          const edgeId = connection.id;
          if (!edges.some((edge) => edge?.id === edgeId)) {
            // 如果连线的两个节点都不属于当前层，则绘制直线，忽略type和vertices属性值
            let isUpperEdge;
            let sourceElement = elements?.find(
              (element: any) =>
                element.id === getNodeIdByPortId(connection.source),
            );
            let targetElement = elements?.find(
              (element: any) =>
                element.id === getNodeIdByPortId(connection.target),
            );
            // area字段不在areas里面且area字段不为当前层
            if (
              !(
                areas?.some((item) => item.id === sourceElement.area) &&
                areas?.some((item) => item.id === targetElement.area)
              ) &&
              sourceElement.area != area_id &&
              targetElement.area != area_id
            ) {
              isUpperEdge = true;
            }
            const edge = getEdge(
              connection,
              edgeId,
              keyOldId,
              differ,
              false,
              isImport,
              isUpperEdge,
            );
            edges.push(edge);
          }
        } else {
          sceneStore.state.crossLevelConnection.push(connection);
        }
      }
    } else {
      // 新线id
      const edgeId = isImport ? connection.id : generateUUID();
      const edge = getEdge(
        connection,
        edgeId,
        keyOldId,
        differ,
        false,
        isImport,
      );
      edges.push(edge);
    }
  });

  // 遍历线数据存入edges
  node_connections?.forEach((connection: any) => {
    // 新线id
    const edgeId = connection.id;
    // const edgeId = isImport ? connection.id : generateUUID();
    if (
      allIds.includes(connection.source) ||
      allIds.includes(connection.target)
    ) {
      if (!edges.some((edge) => edge?.id === edgeId)) {
        const edge = getEdge(
          connection,
          edgeId,
          keyOldId,
          differ,
          true,
          isImport,
        );
        edges.push(edge);
      }
    } else {
      sceneStore.state.crossLevelNodeConnection.push(connection);
    }
  });

  // // 角色资产 && 战争迷雾
  // if (!_.isEmpty(roles) && isImport) {
  //   roles?.forEach((role: any) => {
  //     sceneStore.state.assets.push(reactive(role));
  //   });
  // }

  // 计算交换机数量
  if (!_.isEmpty(scene_config)) {
    sceneStore.state.targetNum.switcher = getSwitcherNum(
      elements,
      cpcloud_elements,
    );
  }
  // 修改是否开启流量采集 路径：plugins.cpcollection.scene.enable_flow_collect的值
  // 修改是否开启流量镜像 路径：plugins.cpcollection.scene.enable_flow_mirror的值
  // 修改是否有dns域名配置 路径：plugins.cpcloud.scene.dns_nameservers的值
  sceneStore.setBasicConfig({
    enable_flow_collect: cpcollection_scene?.enable_flow_collect,
    enable_flow_mirror: cpcollection_scene?.enable_flow_mirror,
    dns_nameservers: cpcloud_scene?.dns_nameservers,
  });
  console.timeEnd('start');
  return {
    nodes,
    edges,
    needLayout,
  };
}

/**
 * 将ws消息数据合并更新到节点的data里面
 * @param wsData
 */
export function wsDataToX6(wsData: any) {
  let {
    scene_element = {},
    scene_element_plugin_data = { cpcloud: {} },
    scene_element_port_plugin_data = { cpcloud: {} },
  } = wsData;
  const nodeScene = getNodeScene(
    scene_element,
    scene_element.id,
    scene_element_plugin_data.cpcloud,
    scene_element_port_plugin_data.cpcloud,
    true,
  );
  return nodeScene;
}

/**
 * 插件数据id修改
 * @param elementId 节点id
 * @param nodeId 新节点id
 * @param cpflow_elements 流量发生数据
 * @param cpcollection_elements 数据采集数据
 */
function setPluginsId(
  elementId: string,
  nodeId: string,
  cpflow_elements: any,
  cpcollection_elements: any,
) {
  if (cpflow_elements) {
    const originCpflow = cpflow_elements ? cpflow_elements[elementId] : {};
    delete cpflow_elements[elementId];
    _.merge(cpflow_elements, { [nodeId]: originCpflow });
  }
  if (cpcollection_elements) {
    const originCpcollection = cpcollection_elements
      ? cpcollection_elements[elementId]
      : {};
    delete cpcollection_elements[elementId];
    _.merge(cpcollection_elements, { [nodeId]: originCpcollection });
  }
}

/**
 *
 * @param elementXY 节点位置
 * @param position 鼠标位置
 */
function computedXY(elementXY: any, position: any) {
  const differX = elementXY.x - position.x;
  const differY = elementXY.y - position.y;

  return {
    x: Math.round(differX),
    y: Math.round(differY),
  };
}

/**
 * 获取节点场景数据
 * @param element 节点数据
 * @param nodeId 新的节点id
 * @param cpcloud_elements 插件内节点数据
 * @param cpcloud_element_ports 插件内端口数据
 * @param cpflow_elements 插件内流量数据
 * @param cpcollection_elements 插件内采集数据
 * @param isImport 是否导入
 * @param connections 连线数据
 */
async function getScene(
  element: any,
  nodeId: string,
  cpcloud_elements: any,
  cpcloud_element_ports: any,
  cpflow_elements: any,
  cpcollection_elements: any,
  isImport?: boolean,
  connections?: Array<any>,
) {
  return {
    [nodeId]: {
      // 基础配置
      basicConfig: {
        area_id: element.area,
        outer_position2: element.outer_position2,
        resource_id: cpcloud_elements[element.id]?.resource_id,
        eid: element?.eid, // 实例id
        role: cpcloud_elements[element.id]?.role,
        image_type: cpcloud_elements[element.id]?.image_type,
        is_build_in: cpcloud_elements[element.id]?.is_build_in,
        name: element?.name, // 设备名称
        type: element?.type, // 设备类型
        icon: element?.icon2, // 设备图标
        icon3: element?.icon3, // 设备图标
        init_support: cpcloud_elements[element.id]?.init_support, // 初始化命令
        image: cpcloud_elements[element.id]?.image, // 选择的快照
        platform: cpcloud_elements[element.id]?.platform, // dynamips
        image_uuid: cpcloud_elements[element.id]?.image_uuid, // 选择的快照
        category: cpcloud_elements[element.id]?.category, // 一级分类
        category2: cpcloud_elements[element.id]?.category2, // 二级分类
        category3: cpcloud_elements[element.id]?.category3, // 三级分类
        system_language: element?.system_language, // 系统语言
        system_architecture: element?.system_architecture, // 系统架构
        system_type: element?.system_type, // 三级系统类型
        netCardNum: element?.max_port_number, // 网卡数量
        cpu: element?.cpu,
        ram: element?.ram,
        disk: element?.disk,
        nvram: element?.nvram,
        // 电口数量
        electrical: {
          count: cpcloud_elements[element.id]?.electric_port_number,
          unit: cpcloud_elements[element.id]?.electric_port_type,
        },
        // 光口数量
        light: {
          count: cpcloud_elements[element.id]?.optical_port_number,
          unit: cpcloud_elements[element.id]?.optical_port_type,
        },
        // WAN口数量
        wan: {
          count: cpcloud_elements[element.id]?.wan_port_number,
          unit: cpcloud_elements[element.id]?.wan_port_type,
        },
        // LAN口数量
        lan: {
          count: cpcloud_elements[element.id]?.lan_port_number,
          unit: cpcloud_elements[element.id]?.lan_port_type,
        },
        // 存储电口、光口、wan口、lan口数量，用于更新拓扑时端口数量的限制, 新增硬盘
        originalCount: {
          electric_port_number:
            cpcloud_elements[element.id]?.electric_port_number,
          optical_port_number:
            cpcloud_elements[element.id]?.optical_port_number,
          wan_port_number: cpcloud_elements[element.id]?.wan_port_number,
          lan_port_number: cpcloud_elements[element.id]?.lan_port_number,
          disk: element?.disk,
          netCardNum: element?.max_port_number,
          portIds: element?.ports?.map((port: any) => port.id),
        },

        // 规则 -> 虚拟防火墙
        rules: getRules(cpcloud_elements[element.id]?.firewall_rules),

        // 靶标进度信息
        process_message: element?.process_message,
        process_status: element?.process_status,
        event_status: element?.event_status,
        event: element?.event,

        quick_create_params:
          cpcloud_elements[element.id]?.quick_create_params || [],
        ospfRouterId: cpcloud_elements[element.id]?.ospf_router_id,
        ripLoopback: cpcloud_elements[element.id]?.rip_loopback,
        iso_attach_filename: cpcloud_elements[element.id]?.iso_attach_filename, // 虚拟机ISO挂载
        iso_tmpdir_uuid: cpcloud_elements[element.id]?.iso_tmpdir_uuid, // 虚拟机ISO挂载
        virtual_usbs: cpcloud_elements[element.id]?.virtual_usbs, // USB仿真
        entity_usbs: cpcloud_elements[element.id]?.entity_usbs, // 实体USB
        docker_params: cpcloud_elements[element.id]?.docker_params,
        vendor: element?.vendor,
        npc_protocol: element?.npc_protocol,
        npc_url: element?.npc_url,
        npc_port: element?.npc_port,
        npc_username: element.npc_username || '',
        npc_password: element.npc_password || '',
      },

      // 路由表配置
      routerConfig: {
        routerConfig: getRouters(
          cpcloud_elements[element.id]?.static_routes,
          element.ports,
          isImport,
        ), // 静态路由表
        // 路由配置
        route:
          cpcloud_elements[element.id]?.role == ROLE['router'] &&
          cpcloud_elements[element.id]?.image_type == 'vm' &&
          cpcloud_elements[element.id]?.is_build_in
            ? getRoute(
                element.ports,
                cpcloud_elements[element.id],
                cpcloud_element_ports,
                '',
                isImport,
              )
            : {},
      },

      // 网络配置
      networkConfig: {
        network: getNetwork(
          element.name,
          element.id,
          element.ports,
          cpcloud_elements[element.id],
          cpcloud_element_ports,
          isImport,
          connections,
          nodeId,
          cpcloud_elements[element.id]?.image_type,
        ), // NET至外网
        address: cpcloud_elements[element.id]?.cidr, // 地址段
        gateway: cpcloud_elements[element.id]?.gateway, // 网关
        DNS: getDNS(cpcloud_elements[element.id]?.dns_nameservers), // DNS
        vlanId: cpcloud_elements[element.id]?.vlan_id, // VLan ID
        dhcp: cpcloud_elements[element.id]?.dhcp, // DHCP
        addressRange: getAddressRange(
          cpcloud_elements[element.id]?.allocation_pools,
        ), // 地址范围
        options: [], //展示用
        options_ports: [], //展示用，端口下拉
      },

      // 应用配置
      applicationConfig: {},

      // 其他配置
      otherConfig: {
        file: element?.file,
        order: _.toString(element?.init_commands), // 自定义命令
        node_command: _.toString(element?.node_command), // 自定义命令
      },

      // 穿透数据
      throughConfig: {},

      // 数据采集
      cpcollection: cpcollection_elements
        ? {
            elements: {
              [nodeId]: await getcpCollection(
                cpcollection_elements,
                nodeId,
                cpcloud_elements[element.id]?.init_support,
                element?.system_type,
              ),
            },
          }
        : {},

      // 流量发生
      cpFlow: cpflow_elements
        ? {
            elements: {
              [nodeId]: getcpflow(cpflow_elements, nodeId),
            },
          }
        : {},

      // 实装设备协议采集配置
      snmp_config:
        cpcloud_elements[element.id]?.image_type === 'entity'
          ? cpcloud_elements[element.id]?.snmp_config
          : undefined,

      // mib解析树
      mib_data:
        cpcloud_elements[element.id]?.image_type === 'entity'
          ? cpcloud_elements[element.id]?.mib_data
          : undefined,
    },
  };
}

/**
 * 整合plugins插件数据和topology数据到节点中
 * @param element topology.elements
 * @param nodeId 节点id
 * @param cpcloud_elements plugins.cpcloud.elements
 * @param cpcloud_element_ports plugins.cpcloud.element_ports
 * @param isImport 是否是全局导入
 */
function getNodeScene(
  element: any,
  nodeId: string,
  cpcloud_elements: any,
  cpcloud_element_ports: any,
  isImport?: boolean,
) {
  return {
    // 基础配置
    basicConfig: {
      resource_id: cpcloud_elements?.resource_id,
      eid: element?.eid, // 实例id
      role: cpcloud_elements?.role,
      image_type: cpcloud_elements?.image_type,
      is_build_in: cpcloud_elements?.is_build_in,
      name: element?.name, // 设备名称
      type: element?.type, // 设备类型
      icon: element?.icon2, // 设备图标
      icon3: element?.icon3, // 设备图标,
      init_support: cpcloud_elements?.init_support, // 初始化命令
      image: cpcloud_elements?.image, // 选择的快照
      platform: cpcloud_elements?.platform, // dynamips
      image_uuid: cpcloud_elements?.image_uuid, // 选择的快照
      category: cpcloud_elements?.category, // 一级分类
      category2: cpcloud_elements?.category2, // 二级分类
      category3: cpcloud_elements?.category3, // 三级分类
      system_language: element?.system_language, // 系统语言
      system_architecture: element?.system_architecture, // 系统架构
      system_type: element?.system_type, // 三级系统类型
      netCardNum: element?.max_port_number, // 网卡数量
      cpu: element?.cpu,
      ram: element?.ram,
      disk: element?.disk,
      nvram: element?.nvram,
      // 电口数量
      electrical: {
        count: cpcloud_elements?.electric_port_number,
        unit: cpcloud_elements?.electric_port_type,
      },
      // 光口数量
      light: {
        count: cpcloud_elements?.optical_port_number,
        unit: cpcloud_elements?.optical_port_type,
      },
      // WAN口数量
      wan: {
        count: cpcloud_elements?.wan_port_number,
        unit: cpcloud_elements?.wan_port_type,
      },
      // LAN口数量
      lan: {
        count: cpcloud_elements?.lan_port_number,
        unit: cpcloud_elements?.lan_port_type,
      },
      // 存储电口、光口、wan口、lan口数量，用于更新拓扑时端口数量的限制   2023-8-21 新增终端节点的网卡
      originalCount: {
        electric_port_number: cpcloud_elements?.electric_port_number,
        optical_port_number: cpcloud_elements?.optical_port_number,
        wan_port_number: cpcloud_elements?.wan_port_number,
        lan_port_number: cpcloud_elements?.lan_port_number,
        disk: element?.disk,
        netCardNum: element?.max_port_number,
        portIds: element?.ports?.map((port: any) => port.id),
      },
      // 规则 -> 虚拟防火墙
      rules: getRules(cpcloud_elements?.firewall_rules),

      // 靶标进度信息
      process_message: element?.process_message,
      event_status: element?.event_status,
      event: element?.event,
      process_status: element?.process_status,
      quick_create_params: cpcloud_elements?.quick_create_params || [],
      ospfRouterId: cpcloud_elements?.ospf_router_id,
      ripLoopback: cpcloud_elements?.rip_loopback,
      iso_attach_filename: cpcloud_elements?.iso_attach_filename, // 虚拟机ISO挂载
      iso_tmpdir_uuid: cpcloud_elements?.iso_tmpdir_uuid, // 虚拟机ISO挂载
      virtual_usbs: cpcloud_elements?.virtual_usbs, // USB仿真
      entity_usbs: cpcloud_elements?.entity_usbs, // 实体USB
      docker_params: cpcloud_elements?.docker_params,
      vendor: element?.vendor,
      npc_protocol: element?.npc_protocol,
      npc_url: element?.npc_url,
      npc_port: element?.npc_port,
      npc_username: element.npc_username || '',
      npc_password: element.npc_password || '',
    },

    // 路由表配置
    routerConfig: {
      routerConfig: getRouters(cpcloud_elements?.static_routes, element.ports), // 静态路由表
      route:
        cpcloud_elements?.role == ROLE['router'] &&
        cpcloud_elements?.image_type == 'vm' &&
        cpcloud_elements?.is_build_in
          ? getRoute(element.ports, cpcloud_elements, cpcloud_element_ports)
          : {},
    },

    // 网络配置
    networkConfig: {
      network: getNetwork(
        element.name,
        element.id,
        element.ports,
        cpcloud_elements,
        cpcloud_element_ports,
        isImport,
      ), // NET至外网
      address: cpcloud_elements?.cidr, // 地址段
      gateway: cpcloud_elements?.gateway, // 网关
      DNS: getDNS(cpcloud_elements?.dns_nameservers), // DNS
      vlanId: cpcloud_elements?.vlan_id, // VLan ID
      dhcp: cpcloud_elements?.dhcp, // DHCP
      addressRange: getAddressRange(cpcloud_elements?.allocation_pools), // 地址范围
      options: [], //展示用
      options_ports: [], //展示用，端口下拉
    },

    // 应用配置
    applicationConfig: {},

    // 其他配置
    otherConfig: {
      file: element?.file,
      order: _.toString(element?.init_commands), // 自定义命令
      node_command: _.toString(element?.node_command), // 自定义命令
    },

    // 穿透数据
    throughConfig: {},
  };
}

/**
 * 获取节点的数据采集数据
 * @param data plugins.cpcollection
 * @param id 节点id
 * @param init_support 节点是否支持cloud-init
 * @param system_type 节点的操作系统类型
 */
async function getcpCollection(
  data: any,
  id: string,
  init_support: any,
  system_type: any,
) {
  // 如果节点有数据采集数据则直接返回，如果之前数据采集被关闭，则默认重新开启
  if (data && data.hasOwnProperty(id) && data[id]) {
    // if (data[id].hasOwnProperty('enable_probe_collect')) {
    //   data[id].enable_probe_collect = true;
    // }
    return data[id];
  } else {
    // 重新获取数据采集数据
    if (
      init_support &&
      system_type &&
      (_.isEmpty(PageStatus.state.menubar) ||
        PageStatus.state.menubar.includes('probe'))
    ) {
      if (
        (_.isEmpty(PageStatus.state.menubar) ||
          PageStatus.state.menubar.includes('probe')) &&
        system_type
      ) {
        return await getCommonProbesFunc(
          init_support,
          [],
          system_type,
          id,
          PageStatus.state.showMenu,
        );
      }
    }
  }
}

/**
 * 返回节点的流量发生数据
 * @param data
 * @param id
 */
function getcpflow(data: any, id: string) {
  if (data && data.hasOwnProperty(id) && data[id]) {
    return data[id];
  }
}

/**
 * 替换端口id的节点id值部分
 * @param str
 * @param char
 */
export function replaceStr2(str: any, char: string) {
  let oldId = getNodeIdByPortId(str);
  if (str) {
    str = str.replace(oldId, char);
    return str;
  }
}

/**
 * 获取线
 * @param connection 线数据
 * @param edgeId 新线id
 * @param keyOldId 原节点id和新生成节点id的匹配关系,key值为原节点id
 * @param differ 拖拽偏移量
 * @param isNodeConnections 虚拟连线，即层节点连线
 * @param isImport 是否是全局导入
 * @param isUpperEdge 是否是上层连线
 */
export function getEdge(
  connection: any,
  edgeId: string,
  keyOldId: any,
  differ: any,
  isNodeConnections?: boolean,
  isImport?: boolean,
  isUpperEdge?: boolean,
) {
  // let { source: sourcePortName, target: targetPortName } =
  //   connection.name && isJSON(connection.name) && JSON.parse(connection.name);
  let sourceCell = keyOldId.get(
    connection.source && getNodeIdByPortId(connection.source),
  );
  let targetCell = keyOldId.get(
    connection.target && getNodeIdByPortId(connection.target),
  );
  // 虚拟连线
  if (isNodeConnections) {
    connection.vertices = connection.vertices?.map((item: any) => {
      return {
        x: item.x - (isImport ? 0 : differ.x),
        y: item.y - (isImport ? 0 : differ.y),
      };
    });
    // if (isImport) {
    return {
      id: edgeId,
      source: {
        cell: sourceCell,
        port: connection.source,
      },
      target: {
        cell: targetCell,
        port: connection.target,
      },
      labels: ['', ''],
      vertices: connection.vertices,
      // ...initEdgeConfig(null, true),
      ...initEdgeConfig(undefined, connection.type, connection),
    };
  } else {
    let { source: sourcePortName, target: targetPortName } =
      connection.name && isJSON(connection.name) && JSON.parse(connection.name);
    // 将连线端口id用新的节点id进行替换
    let newSourcePort = replaceStr2(connection.source, sourceCell);
    let newTargetPort = replaceStr2(connection.target, targetCell);

    connection.vertices = connection.vertices?.map((item: any) => {
      return {
        x: item.x - (isImport ? 0 : differ.x),
        y: item.y - (isImport ? 0 : differ.y),
      };
    });
    return {
      id: edgeId,
      source: { cell: sourceCell, port: newSourcePort },
      target: { cell: targetCell, port: newTargetPort },
      vertices: isUpperEdge ? [] : connection.vertices,
      labels: sceneStore.state.basicConfig?.showLineLabels
        ? setEdgeLabels(
            null,
            sourcePortName,
            targetPortName,
            true,
            connection.display_context,
          )
        : ['', ''],
      ...initEdgeConfig(undefined, connection.type, connection, isUpperEdge),
    };
  }
}

/**
 * 设置新端口id
 * @param ports 端口数据
 * @param nodeId 节点id
 */
export function setNewPortId(ports: any, nodeId: string) {
  ports?.forEach((port: any) => {
    const ids_arr = port.id.split('_');
    ids_arr.splice(1, 1, nodeId);
    port.newId = ids_arr.join('_');
  });
}

/**
 * 判断是否已连线
 * @param connections 连线数据
 * @param port 端口
 */
export function isLinkedToNode(connections: any, port: any) {
  let isLinked = false;
  connections?.forEach((connection: any) => {
    if (connection.source === port.id || connection.target === port.id) {
      isLinked = true;
    }
    if (connection.source === port.id) {
      connection.source = port.newId;
    }
    if (connection.target === port.id) {
      connection.target = port.newId;
    }
  });
  return isLinked;
}

/**
 * 获取终端节点network
 * @param name
 * @param id
 * @param data 拓扑端口数据
 * @param plugin 插件节点数据
 * @param ports 插件端口数据
 * @param isImport 是否是全局导入
 * @param connections
 * @param nodeId
 * @param image_type
 */
export function getNetwork(
  name: string,
  id: string,
  data: any,
  plugin: any,
  ports: any,
  isImport?: boolean,
  connections?: Array<any>,
  nodeId?: string,
  image_type?: any,
) {
  let network: any[] = [];
  data?.forEach((item: any) => {
    if (image_type == 'entity') {
      network.push({
        id: isImport ? item.id : item.newId,
        name: item.name,
        ip: item.ip,
        egress: item.egress,
        ingress: item.ingress,
        access_modes: ports[item.id]?.access_modes,
        firewall_rules: ports[item.id]?.firewall_rules,
        entity_access_type: ports[item.id]?.entity_access_type,
        entity_port: ports[item.id]?.entity_port,
        entity_switch_name: ports[item.id]?.entity_switch_name,
        entity_switch_port: ports[item.id]?.entity_switch_port,
        mac_addr: item?.mac_addr,
        logic_network_id: ports[item.id]?.logic_network_id,
        resource_id: ports[item.id]?.resource_id,
        usable: item.usable, // 端口是否连接
      });
    } else {
      if (plugin?.role == 3) {
        network.push({
          id: isImport ? item.id : item.newId,
          name: item.name,
          ip: item.ip,
          logic_network_id: ports[item.id]?.logic_network_id,
          resource_id: ports[item.id]?.resource_id,
          usable: item.usable, // 端口是否连接
        });
      } else {
        network.push({
          id: isImport ? item.id : item.newId,
          name: item.name,
          ip: item.ip,
          egress: item.egress,
          ingress: item.ingress,
          access_modes: ports[item.id]?.access_modes,
          firewall_rules: getFirewallRules(ports[item.id]?.firewall_rules),
          loss: item.loss,
          delay: item.delay,
          logic_network_id: ports[item.id]?.logic_network_id,
          resource_id: ports[item.id]?.resource_id,
          connect_mode: ports[item.id]?.connect_mode,
          port_connect_net_cidr: item.port_connect_net_cidr,
          usable: item.usable, // 端口是否连接
        });
      }
    }
  });
  // 导入的数据中 外部网络如果没有 空闲端口 默认生成一个; 1. 外部网络的连线数量 2. 与端口数量比对
  // if (plugin.role == 3) {
  //   let networkId = isImport ? id : nodeId;
  //   // @ts-ignore
  //   let edgeLen = getEdgesByNodeId(networkId, connections)?.length || 0;
  //   let dataLen = data ? data.length : 0;
  //   let portsIndex = network
  //     ?.map((port) => {
  //       let idArr = port.id.split('_');
  //       return idArr[idArr.length - 1];
  //     })
  //     ?.sort((a: any, b: any) => {
  //       return a - b;
  //     });
  //   let addIndex = getPortIndex(portsIndex, 1)[0];
  //
  // }
  return network;
}

/**
 * 路由配置
 * @param elementPorts topology.elements[id].ports
 * @param pluginsElement plugins.cpcloud.elements[id],
 * @param element_ports plugins.cpcloud.elements_ports[portId],
 * @param type
 * @param isImport 是否全局导入
 */
function getRoute(
  elementPorts: any,
  pluginsElement: any,
  element_ports: any,
  type?: string,
  isImport?: boolean,
) {
  let BGP: any[] = [];
  let OSPF: any[] = [];
  let RIP: any[] = [];
  elementPorts?.forEach((item: any) => {
    let id = isImport ? item.id : item.newId;
    if (element_ports[item.id]?.ospf_ip && element_ports[item.id]?.ospf_area) {
      OSPF.push({
        ospfIp: element_ports[item.id]?.ospf_ip,
        ospfArea: element_ports[item.id]?.ospf_area,
        portId: id,
        disabled: false,
      });
    }
    if (
      element_ports[item.id]?.bgp_as &&
      element_ports[item.id]?.bgp_ip &&
      element_ports[item.id]?.bgp_peer &&
      element_ports[item.id]?.bgp_peer_as
    ) {
      BGP.push({
        bgpAs: element_ports[item.id]?.bgp_as,
        bgpIp: element_ports[item.id]?.bgp_ip,
        bgpPeer: element_ports[item.id]?.bgp_peer,
        bgpPeerAs: element_ports[item.id]?.bgp_peer_as,
        portId: id,
        disabled: false,
      });
    }
    if (element_ports[item.id]?.rip_ip || element_ports[item.id]?.rip_pear) {
      RIP.push({
        ripIp: element_ports[item.id]?.rip_ip,
        ripNeighbour: element_ports[item.id]?.rip_pear,
        portId: id,
        disabled: false,
      });
    }
  });
  return {
    BGP,
    OSPF,
    RIP,
  };
}

/**
 * 获取静态路由表数据
 * @param data
 * @param ports
 * @param isImport
 */
function getRouters(data: any, ports: any, isImport?: boolean) {
  let routers: any[] = [];
  data?.forEach((item: any) => {
    let newId = ports?.filter((port: any) => port.id == item.nexthop_port_id)[0]
      ?.id;
    routers.push({
      destination: item.destination,
      nexthop: item.nexthop,
      nexthop_port_id: item.hasOwnProperty('nexthop_port_id') ? newId : '',
    });
  });
  return routers;
}

/**
 * 计算交换机数量
 * @param elements
 * @param plugins
 */
function getSwitcherNum(elements: any, plugins: any) {
  let switcher = 0;
  elements?.forEach((element: any) => {
    // 计算交换机数量
    if (plugins[element.id]?.role === 22) {
      switcher++;
    }
  });
  return switcher;
}

/**
 * 防火墙规则 添加源端口和目标端口字段属性值
 */
function getFirewallRules(rules: any) {
  return rules?.map((item: any) => {
    if (!item.hasOwnProperty('source_port')) {
      item['source_port'] = '';
    }
    if (!item.hasOwnProperty('destination_port')) {
      item['destination_port'] = '';
    }
    return item;
  });
}

/**
 * 更新节点图片池
 * @param graphData
 */
export async function updateIconPool(graphData: any) {
  if (!sceneStore.state.iconPoolData) {
    sceneStore.state.iconPoolData = new Map();
  }
  // console.log('更新图片池', graphData)
  let elements = graphData?.nodes || [];
  let iconArr = _.uniq(
    elements?.map((item: any) => item?.data?.basicConfig?.icon),
  );
  // 记录当前图片池已获取的图片数量
  for (let i = 0; i < iconArr.length; i++) {
    let icon = iconArr[i];
    if (icon) {
      if (sceneStore.state.iconPoolData?.has(icon)) {
        updateIconItemFunc(elements, icon);
      } else {
        await getImagePromise(icon)
          .then((res) => {
            sceneStore.setIconPoolData(icon, {
              ids: [],
              data: res,
            }); // 存储图片地址
            updateIconItemFunc(elements, icon);
          })
          .catch((err) => {
            sceneStore.setIconPoolData(icon, {
              ids: [],
              data: '',
            }); // 存储图片地址
            updateIconItemFunc(elements, icon);
          });
      }
    }
  }
}

/**
 * 更新画布中，节点的图标地址为icon的所有节点的attr属性，并重绘节点
 * @param elements
 * @param icon
 */
function updateIconItemFunc(elements: any, icon: any) {
  let ids = _.compact(
    elements?.map((item: any) => {
      if (item?.data?.basicConfig?.icon == icon) {
        return item.id;
      } else {
        return undefined;
      }
    }),
  );
  if (sceneStore.state.iconPoolData?.has(icon)) {
    let itemData = sceneStore.state.iconPoolData?.get(icon);
    sceneStore.setIconPoolData(icon, {
      ids: _.uniq([...itemData.ids, ...ids]),
      data: itemData.data,
    }); // 存储图片地址
  }
  // 更新当前画布中，节点的图片地址为icon的所有节点的图标
  cyberBus.emit('get-promise-icon', sceneStore.state.iconPoolData?.get(icon));
}
