// 数据采集-重新组装参数
import sceneStore from '../../store/scene-store';
import { setNodeOpacity } from '../common';

export function getParameter(data: any) {
  let parameterArr = [];
  if (data) {
    let paramList = JSON.parse(data);
    for (let param in paramList) {
      parameterArr.push({
        name: param,
        type: paramList[param][0],
        default_value: paramList[param][1],
      });
    }
  }
  return parameterArr;
}
/**
 * 数据采集是否编辑过，如果编辑过，则加个编辑过的图标
 * 只处理单个节点
 * @param data string时为节点id，否则为节点实例
 * @param status 区分是新增标记还是删除标记，true为新增，false为删除
 */
export function updateProbeEditedIcon(data: any, status: any) {
  let node;
  if (typeof data === 'string') {
    // 节点的id
    const graph = sceneStore.state.graph;
    node = graph.getCellById(data);
  } else {
    // 节点实例
    node = data;
  }
  // edited
  setNodeEditedIcon(node, status);
}

/**
 * 数据采集
 * 配置节点编辑标记是否展示
 * @param cls 节点实例
 * @param type 是否整体展示，展示为true，不展示为false
 * 5.5逻辑 如果节点开启了数据采集即展示edited图标 2024-04-30
 */
export function setNodeEditedIcon(cls: any, type: boolean) {
  let cpData = cls?.data?.cpcollection?.elements;
  if (cpData?.hasOwnProperty(cls.id)) {
    cls.setAttrs({
      edited: {
        style: {
          visibility:
            (cpData[cls.id]?.edited || cpData[cls.id]?.enable_probe_collect) &&
            type
              ? 'visible'
              : 'hidden',
          display:
            (cpData[cls.id]?.edited || cpData[cls.id]?.enable_probe_collect) &&
            type
              ? 'inline-block'
              : 'none',
        },
      },
    });
  }
}
/**
 * 进入数据采集模式
 * 对不支持采集的节点做置灰处理；
 * 对配置过的节点做添加标记处理（如果节点关闭数据采集，则移除标记）
 */
export function handleProbeByMenuIndex() {
  // 遍历当前画布节点
  const graph = sceneStore.state.graph;
  graph.getNodes()?.forEach((node: any) => {
    let { basicConfig } = node.data;
    if (
      !(basicConfig?.init_support && basicConfig?.system_type) &&
      node.shape !== 'image'
    ) {
      setNodeOpacity(node, 0.5);
    }
    // 判断数据采集标签
    setNodeEditedIcon(node, true);
  });
}
