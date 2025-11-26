import sceneStore from '../../store/scene-store';
import { updateNetworkPorts } from '../port-processing/port-generation';
import { getEdgeCenter, isJSON, setVerticesOrth } from '../common';
import { gerEdgeAttrs } from '../../pages/scene/painter/edge';
import PageStatus from '../../pages/store/page-status';

const ROLE_ROUTER = 21;
const ROLE_SWITCH = 22;
const ROLE_FIREWALL = 23;
const ROLE_TERMINAL = 4;
const ROLE_EXT_NET = 3;
const ROLE_NPC = 7;

const IMAGE_TYPE_SIMPLE = 'simple';
const IMAGE_TYPE_VM = 'vm';
const IMAGE_TYPE_CONTAINER = 'container';
const IMAGE_TYPE_ENTITY = 'entity';
const SHAPE_LAYER = 'image';

/**
 * 判断两个给定的节点是否允许连接
 * */
export function checkEdgeRule(source: Device, target: Device): boolean {
  let another;
  let terminal;
  let npc;
  let layer;

  // 除外部网络不能连接外部网络 ，外部网络不能连接仿真节点
  another = findOne(source, target, isExtNet);
  if (another) {
    return !isExtNet(another) && !isNpc(another);
  }
  // 终端节点不能直接连接终端节点及仿真节点 2024.04.25新增
  terminal = findOne(source, target, isTerminal);
  if (terminal) {
    return !isTerminal(terminal) && !isNpc(terminal);
  }
  // 仿真节点不能直接连接仿真节点 2024.04.25新增
  npc = findOne(source, target, isNpc);
  if (npc) {
    return !isNpc(npc);
  }
  // 层节点不能连接层节点 2024.04.29新增
  layer = findOne(source, target, isLayer);
  if (layer) {
    return !isLayer(layer);
  }

  return true;
}

function isExtNet(x: Device) {
  return x.role === ROLE_EXT_NET;
}

function isNpc(x: Device) {
  return x.role === ROLE_NPC;
}

function isEntity(x: Device) {
  return x.image_type === IMAGE_TYPE_ENTITY;
}
function isTerminal(x: Device) {
  return x.role === ROLE_TERMINAL;
}
function isLayer(x: Device) {
  return x.shape === SHAPE_LAYER;
}

function isVm(x: Device) {
  return x.image_type === IMAGE_TYPE_VM;
}

function isContainer(x: Device) {
  return x.image_type === IMAGE_TYPE_CONTAINER;
}

function findOne(
  source: Device,
  target: Device,
  filter: (device: Device) => boolean,
): Device | null {
  if (filter(source)) {
    return target;
  }
  if (filter(target)) {
    return source;
  }
  return null;
}

interface Device {
  role: number;
  image_type: string;
  is_build_in: boolean;
  shape: string;
  area_id: string;
}

/**
 * 同时属于上一层的两个节点不支持连线
 */
export function bothFromUpperLayer(source: any, target: any) {
  let block_areas = sceneStore.state.graph
    .getNodes()
    ?.filter((node: any) => node.shape === 'html');
  if (
    PageStatus.state.currentTreeLevelId &&
    source.shape == 'rect' &&
    target.shape == 'rect' &&
    source?.data?.basicConfig?.area_id != PageStatus.state.currentTreeLevelId &&
    target?.data?.basicConfig?.area_id != PageStatus.state.currentTreeLevelId &&
    !block_areas?.some(
      (node: any) => node.id == target?.data?.basicConfig?.area_id,
    ) &&
    !block_areas?.some(
      (node: any) => node.id == source?.data?.basicConfig?.area_id,
    )
  ) {
    return true;
  }
  return false;
}

/**
 * 虚拟机、容器不能连接多个外部网络
 */
export function checkVmContainerConnectInternalNetworkRepeat(
  source: any,
  target: any,
) {
  function check(source: any, target: any) {
    if (isExtNet(source.data.basicConfig)) {
      if (!isEntity(target.data.basicConfig)) {
        // 判断目标节点连线到外部网络有多少个
        let neighbors = sceneStore.state.graph.getNeighbors(target);
        let count = 0;
        neighbors.forEach((neighbor: any) => {
          if (
            isExtNet(neighbor.data.basicConfig) &&
            neighbor.id !== source.id
          ) {
            count = count + 1;
          }
        });
        return count >= 1;
      }
    }
    return false;
  }
  // 需要满足两个条件，虚拟机、容器和外部网络相连；相同两个节点的连接数量超过1个
  return check(source, target) || check(target, source);
}

/**
 * 校验是否重复连线
 * @param source
 * @param target
 */
export function checkEdgeRepeat(source: any, target: any) {
  let num = 0;
  // @ts-ignore
  let edges = sceneStore.state.graph?.getEdges();
  if (edges && edges.length) {
    for (let i = 0; i < edges.length; i++) {
      let edge = edges[i];
      const sourceNodeId = edge.source.cell;
      const targetNodeId = edge.target.cell;
      if (source.id && target.id) {
        if (
          (source.id === sourceNodeId && target.id === targetNodeId) ||
          (source.id === targetNodeId && target.id === sourceNodeId)
        ) {
          num++;
          if (num > 1) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
/**
 * 获取可用于连线的端口id及端口名称
 * @param network 当前节点所有端口数据
 * @param cellData
 * @returns {*}
 */
export const getAvailablePorts = (network: any, cellData?: any) => {
  let _network = network?.filter((port: any) => port.usable === true);
  let edges = sceneStore.state.graph.getEdges();
  // 从所有连线的source、target中过滤已经连接的端口
  const portsIds = _network?.map((port: any) => port.id);
  let busyPortsIds: any[] = [];
  edges?.forEach((connection: any) => {
    portsIds?.includes(connection.source.port)
      ? busyPortsIds.push(connection.source.port)
      : portsIds?.includes(connection.target.port)
      ? busyPortsIds.push(connection.target.port)
      : '';
  });
  let availablePort = _network?.find(
    (port: any) => !busyPortsIds?.some((item) => item === port.id),
  );
  if (!availablePort) {
    if (
      sceneStore.state.basicConfig.simpleModeToEdge &&
      cellData?.data?.basicConfig?.role == 3
    ) {
      // 如果源节点和目标节点中有一个外部网络，生成外部网络的端口
      updateNetworkPorts(cellData, cellData, 'add');
    }
    if (cellData?.data?.basicConfig?.role == 3) {
      return [];
    }
    return null;
  } else {
    return _network?.find(
      (port: any) => !busyPortsIds?.some((item) => item === port.id),
    );
  }
};

export const bodyAttr = (edgeAttrs: any) => ({
  fill: edgeAttrs?.labels?.body?.fill || 'rgba(255,255,255,1)',
  rx: edgeAttrs?.labels?.body?.rx || 0,
  ry: edgeAttrs?.labels?.body?.rx || 0,
  refWidth: edgeAttrs?.labels?.body?.refWidth || '100%',
  refHeight: edgeAttrs?.labels?.body?.refWidth || '100%',
  refX: edgeAttrs?.labels?.body?.refWidth
    ? -(parseFloat(edgeAttrs?.labels?.body?.refWidth) - 100) / 2 + '%'
    : 0,
  refY: edgeAttrs?.labels?.body?.refWidth
    ? -(parseFloat(edgeAttrs?.labels?.body?.refWidth) - 100) / 2 + '%'
    : 0,
});

export const textAttr = (edgeAttrs: any) => ({
  fontSize: edgeAttrs?.labels?.text?.fontSize || 12,
  fill: edgeAttrs?.labels?.text?.fill || 'rgba(0,0,0,1)',
  fontWeight: edgeAttrs?.labels?.text?.fontWeight || 400,
});

/**
 * 设置连线标签
 * @param edge 连线实例
 * @param sourcePortName
 * @param targetPortName
 * @param showLineLabels
 * @param attrs 标签样式属性
 */
export const setEdgeLabels = (
  edge: any,
  sourcePortName: string,
  targetPortName: string,
  showLineLabels: boolean,
  attrs?: any,
) => {
  const edgeAttrs = attrs && isJSON(attrs) ? gerEdgeAttrs(attrs) : attrs;
  let sourceLabel: any = '';
  let targetLabel: any = '';
  sourceLabel = {
    attrs: {
      text: {
        text: sourcePortName || '',
        ...textAttr(edgeAttrs),
      },
      body: bodyAttr(edgeAttrs),
    },
    position: edgeAttrs?.labels?.positionSource || 0.3,
  };
  targetLabel = {
    attrs: {
      text: {
        text: targetPortName || '',
        ...textAttr(edgeAttrs),
      },
      body: bodyAttr(edgeAttrs),
    },
    position: edgeAttrs?.labels?.positionTarget || 0.7,
  };
  if (edge) {
    showLineLabels
      ? edge.setLabels([sourceLabel, targetLabel], { ignoreHistory: true })
      : edge.setLabels([sourceLabel, targetLabel], { ignoreHistory: true });
  } else {
    return [sourceLabel, targetLabel];
  }
};

// 更改连线类型
export const setEdgeType = (type: any, edgeCls: any) => {
  switch (type) {
    case 'straight':
      sceneStore.state.graph.batchUpdate(() => {
        edgeCls.setVertices([]);
        edgeCls.setRouter('normal');
        // 显示跳线时画布中的最大连线数量，如果连线数量大于50，则不使用跳线，跳线时间复杂度为O(n)
        if (sceneStore.state.edgeCount < sceneStore.state.jumpoverEdgeCount) {
          edgeCls.setConnector('jumpover', { size: 3 });
        }
      });
      break;
    case 'fold':
      sceneStore.state.graph.batchUpdate(() => {
        edgeCls.setConnector('normal');
        edgeCls.setRouter('orth');
        setVerticesOrth(edgeCls);
      });
      // props.edgeCls.addTools('vertices'); // 测试路径点
      break;
    case 'smooth':
      // 曲线，取中点  设置控制点
      let offset = 40;
      let sourceCell = sceneStore.state.graph.getCellById(
        edgeCls?.source?.cell,
      );
      let targetCell = sceneStore.state.graph.getCellById(
        edgeCls?.target?.cell,
      );

      let { x: sourceX, y: sourceY } = sourceCell?.getPosition();
      let { x: targetX, y: targetY } = targetCell?.getPosition();

      let vertice =
        edgeCls.vertices && edgeCls.vertices.length
          ? edgeCls.vertices
          : getEdgeCenter(
              sourceX,
              sourceY,
              targetX,
              targetY,
              sourceCell.data.basicConfig.image_type,
              targetCell.data.basicConfig.image_type,
              offset,
            );
      sceneStore.state.graph.batchUpdate(() => {
        edgeCls.setVertices(vertice);
        edgeCls.setRouter('normal');
        edgeCls.setConnector('smooth');
      });
      break;
  }
  setTimeout(() => {
    repaintStraight();
  }, 500);
};
// 重绘直线
const repaintStraight = () => {
  sceneStore.state.graph.batchUpdate(() => {
    sceneStore.state.graph
      .getEdges()
      ?.filter(
        (edge: any) => edge.connector && edge.connector.name === 'jumpover',
      )
      ?.forEach((edge: any) => {
        edge.removeConnector({ ignoreHistory: true });
        edge.setConnector('jumpover', { size: 3, ignoreHistory: true });
      });
  });
};
/**
 * 更新节点的端口连接状态字段usable
 * @param source 源节点实例
 * @param target 目标节点实例
 * @param sourcePortId 源端口id
 * @param targetPortId 目标端口id
 * @param usable 连接状态值 true 为空闲
 */
export const updatePortUsable = (
  source: any,
  target: any,
  sourcePortId: string,
  targetPortId: string,
  usable: any,
) => {
  let networkData = [
    _.cloneDeep(source?.data?.networkConfig?.network) || [],
    _.cloneDeep(target?.data?.networkConfig?.network) || [],
  ];
  networkData.forEach((network, index) => {
    if (networkData[index] && networkData[index].length) {
      networkData[index] = networkData[index].map((port) => {
        let contrastId = index === 0 ? sourcePortId : targetPortId;
        if (port.id === contrastId) {
          return {
            ...port,
            usable: usable,
          };
        } else {
          return port;
        }
      });
    }
  });
  if (source && networkData[0] && networkData[0].length) {
    let data = _.cloneDeep(source.data);
    _.merge(data, { networkConfig: { network: networkData[0] } });
    source.setData(data, { silent: true });
  }
  if (target && networkData[1] && networkData[1].length) {
    let data = _.cloneDeep(target.data);
    _.merge(data, { networkConfig: { network: networkData[1] } });
    target.setData(data, { silent: true });
  }
};
