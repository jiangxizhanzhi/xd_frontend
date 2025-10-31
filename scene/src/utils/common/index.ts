import sceneStore from '../../store/scene-store';
import _ from 'lodash';
import { generateUUID } from './uniqueId';
import {
  getNodeIdByPortId,
  getPortNameByPortId,
} from '../port-processing/port-generation';
import { getCopyRouterConfig } from '../data-conversion/target-to-element';
import { getEdgeType } from '../data-conversion/scene-to-external/x6-to-external';
import { replaceStr2 } from '../data-conversion/external-to-scene/external-to-x6';
import { setEdgeLabels } from '../connection/connection-rule';
import { initEdgeConfig } from '../../pages/scene/painter/edge';
import { transfer10 } from '../data-conversion/external-to-scene/utils';
import PageStatus from '../../pages/store/page-status';
import { nextTick } from '@vue/composition-api';
import { setNodeEditedIcon } from '../dialog/probe';

export * from './uniqueId';

// 截取指定字符长度的字符串
export function subStr(str: string, len: number) {
  let r = /[^\x00-\xff]/g; //匹配非双字节字符（例如汉字和中文的标点符号）
  if (str.replace(r, 'mm').length <= len) {
    return str;
  }
  let m = Math.floor(len / 2);
  for (let i = m; i < str.length; i++) {
    if (str.slice(0, i).replace(r, 'mm').length >= len) {
      return str.slice(0, i) + '...';
    }
  }
  return str;
}

/**
 * 设置水平和垂直线的 路径点
 */
export function setVerticesOrth(edgeCls: any) {
  let vertice = [];
  let routePoints = sceneStore.state.graph.findViewByCell(
    edgeCls?.id,
  )?.routePoints;
  if (_.isArray(routePoints)) {
    let sourceCell = sceneStore.state.graph.getCellById(edgeCls?.source?.cell);
    let targetCell = sceneStore.state.graph.getCellById(edgeCls?.target?.cell);

    let { x: sourceX, y: sourceY } = sourceCell?.getPosition();
    let { x: targetX, y: targetY } = targetCell?.getPosition();

    if (!sourceCell || !targetCell) return;
    if (routePoints.length && sourceX != targetY && sourceY != targetY) {
      vertice = routePoints;
    } else {
      vertice = getEdgeCenter(
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourceCell.data.basicConfig.image_type,
        targetCell.data.basicConfig.image_type,
      );
    }
  }
  sceneStore.state.graph.getCellById(edgeCls.id)?.setVertices(vertice);
}

/**
 * 获取水平线和垂直线的中心点
 * @param sourceX
 * @param sourceY
 * @param targetX
 * @param targetY
 * @param sourceImageType
 * @param targetImageType
 * @param offset 设置偏移量
 * @return 数组
 */
export function getEdgeCenter(
  sourceX: any,
  sourceY: any,
  targetX: any,
  targetY: any,
  sourceImageType: any,
  targetImageType: any,
  offset?: any,
) {
  let vertice: any[] = [];
  if (sourceX == targetX) {
    vertice = getCenterPointVertical(
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourceImageType,
      targetImageType,
      offset,
    );
  } else if (sourceY == targetY) {
    vertice = getCenterPointHorizontal(
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourceImageType,
      targetImageType,
      offset,
    );
  } else {
    let pos = transfer10({
      x:
        targetX > sourceX
          ? (targetX - sourceX) / 2 + sourceX + 20
          : (sourceX - targetX) / 2 + targetX + 20,
      y:
        targetY > sourceY
          ? (targetY - sourceY) / 2 + sourceY + 20
          : (sourceY - targetY) / 2 + targetY + 20,
    });
    vertice = [pos];
  }
  return vertice;
}

/**
 * 获取垂直方向的中点
 */
export function getCenterPointVertical(
  sourceX: any,
  sourceY: any,
  targetX: any,
  targetY: any,
  sourceImageType: any,
  targetImageType: any,
  offset?: any,
  x?: any,
) {
  let differ = 20;
  return [
    {
      // @ts-ignore
      x: targetX + differ + (offset || 0),
      y:
        targetY > sourceY
          ? Math.round((targetY - sourceY) / 2) + sourceY + 20
          : Math.round((sourceY - targetY) / 2) + targetY + 20,
    },
  ];
}

/**
 * 获取水平方向的中点
 */
export function getCenterPointHorizontal(
  sourceX: any,
  sourceY: any,
  targetX: any,
  targetY: any,
  sourceImageType: any,
  targetImageType: any,
  offset?: any,
) {
  let differ = 20;
  return [
    {
      // @ts-ignore
      x:
        targetX > sourceX
          ? Math.round((targetX - sourceX) / 2) + sourceX + 20
          : Math.round((sourceX - targetX) / 2) + targetX + 20,
      y: sourceY + differ - (offset || 0),
    },
  ];
}
// 判断是否为json字符串
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

// 替换对象key值
const setObjectKey = (obj: any, newKey: any) => {
  if (!_.isEmpty(obj)) {
    let oldNodeId = Object.keys(obj)[0];
    obj[newKey] = Object.values(obj)[0];
    delete obj[oldNodeId];
  }
};
/**
 * 替换节点的id和数据的id
 * @param oldNode 源节点的数据
 * @param newNodeId 新的节点id
 */
export function getNewNodeData(oldNode: any, newNodeId: string) {
  let newNode = _.cloneDeep(oldNode.getData());
  const network = newNode.networkConfig.network;
  network?.forEach((net: any) => {
    // 首尾下划线之间的作为节点id（特殊处理：如果有 'light' | 'electrical' | 'gateway' | 'wan' | 'lan' | 'entity' 这几个字符串要先排除再拼接）
    let oldId = getNodeIdByPortId(net.id);
    if (oldId) {
      net.id = net.id.replace(oldId, newNodeId);
    }
    net.eid && delete net.eid;
    net.usable = true;
  });
  // 复制 数据采集、流量发生
  let probes = newNode?.cpcollection?.elements || {};
  let flows = newNode?.cpFlow?.elements || {};
  setObjectKey(probes, newNodeId);
  setObjectKey(flows, newNodeId);
  // 复制 routerConfig
  newNode.routerConfig = getCopyRouterConfig(newNode.routerConfig, newNodeId);
  // 删除仿真usb挂载
  newNode.basicConfig.virtual_usbs = [];
  // 删除实装usb挂载
  newNode.basicConfig.entity_usbs = [];
  // 删除eid
  newNode.basicConfig.eid = undefined;
  // 更新area字段
  newNode.basicConfig.area_id = PageStatus.state.currentTreeLevelId;
  return newNode;
}
/**
 * 替换连线的id和source port、target port
 * @param oldEdge
 * @param nodeIdMap 取到最新的节点的id匹配关系
 * @param copyIndex
 * @param attrs
 */
export function getNewEdgeData(
  oldEdge: any,
  nodeIdMap: any,
  copyIndex: any,
  attrs?: any,
) {
  let edgeType = getEdgeType(oldEdge.router, oldEdge.connector);
  // 将连线端口id用新的节点id进行替换
  let newSourcePort = replaceStr2(
    oldEdge.source.port,
    nodeIdMap.get(oldEdge.source.cell),
  );
  let newTargetPort = replaceStr2(
    oldEdge.target.port,
    nodeIdMap.get(oldEdge.target.cell),
  );
  return {
    id: generateUUID(),
    source: { cell: nodeIdMap.get(oldEdge.source.cell), port: newSourcePort },
    target: { cell: nodeIdMap.get(oldEdge.target.cell), port: newTargetPort },
    vertices: oldEdge.vertices.map((item: any) => ({
      x: item.x + 32 * copyIndex,
      y: item.y + 60 * copyIndex,
    })),
    labels: sceneStore.state.basicConfig?.showLineLabels
      ? setEdgeLabels(
          null,
          getPortNameByPortId(newSourcePort),
          getPortNameByPortId(newTargetPort),
          true,
        )
      : ['', ''],
    ...initEdgeConfig(undefined, edgeType, attrs && { display_context: attrs }),
  };
}
// 将src url转换成base64
export const getImagePromise = (src: any) => {
  return new Promise((resolve, reject) => {
    if (/^data:/.test(src)) {
      //如果是base64，则直接执行
      resolve(src);
    } else {
      //如果是url，则读文件流转base64
      let request = new XMLHttpRequest();
      request.onreadystatechange = done;
      request.responseType = 'blob';
      request.open('GET', src, true);
      request.send();
      function done() {
        if (request.readyState !== 4) return;
        if (request.status !== 200) {
          reject('error');
          return;
        }
        let encoder = new FileReader();
        encoder.onloadend = function () {
          resolve(encoder.result);
        };
        encoder.readAsDataURL(request.response);
      }
    }
  });
};
/**
 * 设置单个节点元素属性
 * @param node 节点
 * @param opacity 透明度
 */
export function setNodeAttrs(node: any, opacity: any) {
  node.setAttrs({
    image: {
      opacity,
    },
    text: {
      opacity,
    },
  });
}

/**
 * 设置指定节点透明度
 * @param node 节点
 * @param opacity 透明度
 */
export function setNodeOpacity(node: any, opacity: any) {
  const graph = sceneStore.state.graph;
  const cell = graph.getCellById(node.id);
  if (!cell || cell.getAttrs()?.image?.opacity === opacity) return;
  setNodeAttrs(cell, opacity);
}

/**
 * 设置所有节点透明度
 * @param opacity 透明度
 * @param removeEditedIcon 是否移除edited标记
 * @param excludeLayerNode 排除层节点
 */
export function setAllNodeOpacity(
  opacity: any,
  removeEditedIcon: any,
  excludeLayerNode: boolean,
) {
  const graph = sceneStore.state.graph;
  const cells = graph.getNodes();
  // 所有节点置灰
  cells.forEach((cell: any) => {
    if (
      cell.shape === 'rect' ||
      (!excludeLayerNode && cell.shape === 'image')
    ) {
      setNodeAttrs(cell, opacity);
      if (removeEditedIcon) {
        setNodeEditedIcon(cell, false);
      }
    }
  });
}

/**
 * 设置指定连线颜色
 * @param edgeId
 * @param color
 */
export function setEdgeColor(edgeId: any, color: any) {
  const graph = sceneStore.state.graph;
  const edge = graph.getCellById(edgeId);
  if (!edge || edge.getAttrs()?.line?.stroke === color) return;
  edge.attr('line/stroke', color);
}
// 树结构
export const getParentIds = (id: any, data: any) => {
  // 深度遍历查找
  function dfs(data: any, id: any, parents: any) {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      // 找到id则返回父级id
      // if (item.id === id) return parents;
      if (item.id === id) {
        parents.push({
          id: item.id,
          name: item.name,
          display_context: item.display_context,
        });
        return parents;
      }
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前id入栈
      parents.push({
        id: item.id,
        name: item.name,
        display_context: item.display_context,
      });

      if (dfs(item.children, id, parents).length) return parents;
      // 深度遍历查找未找到时当前id 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }
  return dfs(data, id, []);
};
// 将上层节点置顶 节点居中
export const fixedNodesFromUpperLayer = (
  time: any,
  container: any,
  upperNodeLocalize: any,
) => {
  const fixedFunc = () => {
    if (PageStatus.state.currentTreeLevelId) {
      const nodeSize = 110; // 节点大小
      const split = nodeSize - 40; // 间隔大小
      const marginLeft = upperNodeLocalize.marginLeft || 200; // 左间距
      const marginTop = upperNodeLocalize.marginTop || 100; // 上间距

      // 找出不属于当前层的节点
      let filterCells = sceneStore.state.graph
        .getNodes()
        ?.filter((item: any) => {
          return (
            item.data?.basicConfig?.area_id !=
              PageStatus.state.currentTreeLevelId &&
            !item.data?.basicConfig?.outer_position2?.hasOwnProperty(
              PageStatus.state.currentTreeLevelId,
            ) &&
            !sceneStore.state.graph
              .getNodes()
              ?.filter((node: any) => node.shape == 'html')
              ?.some((node: any) => node.id == item.data?.basicConfig?.area_id)
          );
        });
      let lineNodes = Math.round(
        (parseFloat(container.clientWidth || 0) - marginLeft) / nodeSize,
      ); // 每行最多展示的节点个数

      // 过滤出属于当前层的节点, 超出当前行自动换行
      filterCells?.forEach((item: any, index: number) => {
        if (item.shape === 'rect' || item.shape === 'image') {
          let x = 0;
          let y = 0;
          if (parseInt(index / lineNodes) > 0) {
            if (index % lineNodes > 0) {
              // 余数大于零
              x = marginLeft + (index % lineNodes) * nodeSize;
              y = marginTop + split * parseInt(index / lineNodes);
            } else {
              // 余数等于零
              x = marginLeft;
              y = marginTop + split * parseInt(index / lineNodes);
            }
          } else {
            x = marginLeft + nodeSize * index;
            y = marginTop;
            if (lineNodes > filterCells.length) {
              // 如果没有超过一行，则居中展示
              let evenlyWidth =
                (container.clientWidth - filterCells.length * nodeSize) / 2;
              x = nodeSize * index + evenlyWidth;
            }
          }
          item.setPosition(
            transfer10({
              x:
                (0 - sceneStore.state.graph.translate().tx + x) /
                sceneStore.state.graph.zoom(),
              y:
                (0 - sceneStore.state.graph.translate().ty + y) /
                sceneStore.state.graph.zoom(),
            }),
          );
        }
      });
    }
  };
  if (time) {
    _.debounce(() => {
      fixedFunc();
    }, time)();
  } else {
    fixedFunc();
  }
};
// 更新模板父子关系
export const updateParentChild = () => {
  // 更新模板父子关系
  sceneStore.state.parentChild = sceneStore.state.parentChild?.map(
    (item: any) => {
      return {
        parent: sceneStore.state.oldKey.get(item.parent),
        child: sceneStore.state.oldKey.get(item.child),
      };
    },
  );
  nextTick(() => {
    sceneStore.state.parentChild?.forEach((item: any) => {
      sceneStore.state.graph
        .getCellById(item.parent)
        ?.embed(sceneStore.state.graph.getCellById(item.child));
    });
  });
};
// 多层拓扑-处理角色资产和战争迷雾的回显问题
export const getLevelAssetAndVisibleNodes = () => {
  const storeCurrentData = sceneStore.state.currentAssets;
  if (PageStatus.state.roleAssets) {
    // 角色资产模式
    setAllNodeOpacity(0.5, undefined, true);
    let childData = sceneStore.state.assets?.filter(
      (item) => item.type === storeCurrentData?.type,
    );
    if (childData?.length) {
      let child = childData[0]?.children?.filter(
        (item: any) => item.id === storeCurrentData.id,
      );
      if (child?.length) {
        child[0]?.[storeCurrentData?.configType]?.forEach((nodeId: string) => {
          setNodeOpacity({ id: nodeId }, 1);
        });
      }
    }
  }
};
/**
 * 更新store中的资产和迷雾数据
 * @param newVal 即节点id和节点类型组成的数组
 */
export const updateLevelAssetAndVisibleStoreData = (newVal: any) => {
  const storeCurrentData = sceneStore.state.currentAssets;
  if (PageStatus.state.currentTreeLevelId) {
    if (
      !newVal?.some(
        (item: any) => item.id === PageStatus.state.currentTreeLevelId,
      )
    ) {
      newVal.push({ id: PageStatus.state.currentTreeLevelId, category: 5 });
    }
  }
  let childData = sceneStore.state.assets?.filter(
    (item) => item.type === storeCurrentData?.type,
  );
  if (childData?.length) {
    let child = childData[0]?.children?.filter(
      (item: any) => item.id === storeCurrentData.id,
    );
    if (child?.length) {
      child[0][storeCurrentData.configType] = newVal;
    }
  }
  let deepAssets = _.cloneDeep(sceneStore.state.assets);
  sceneStore.resetAssets(deepAssets);
};
// 是否是上层的节点，cell为节点实例
export const isUpperNode = (cell: any) => {
  // 上层的节点不允许删除
  if (
    cell.shape === 'rect' &&
    PageStatus.state.currentTreeLevelId &&
    cell.getData()?.basicConfig?.area_id !=
      PageStatus.state.currentTreeLevelId &&
    !sceneStore.state.graph
      .getNodes()
      ?.filter((node: any) => node.shape == 'html')
      ?.some((node: any) => node.id == cell.getData()?.basicConfig?.area_id)
  ) {
    return true;
  }
};
/**
 * 是否可以添加节点
 * @param nodesNum 当前拓扑节点数量，只有真正属于当前层的节点数量，排除其他层的节点
 * @param addNodesNum 即将添加的节点数量
 * @returns {Promise<unknown>}
 */
export const canAddNodes = (nodesNum: number, addNodesNum: number) => {
  return new Promise((resolve, reject) => {
    if (
      nodesNum + addNodesNum <=
      parseInt(PageStatus.state.maxCount) -
        parseInt(PageStatus.state.anotherLayerNodeCount)
    ) {
      resolve(true);
    } else {
      reject(false);
    }
  });
};
