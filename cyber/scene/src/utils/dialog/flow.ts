// 数据采集-重新组装参数
import sceneStore from '../../store/scene-store';
// import { setNodeOpacity } from '../common';
/**
 * 进流量发生模式
 * 对配置过的节点做添加标记处理
 */
export function handleFlowByMenuIndex() {
  // 遍历当前画布节点
  const graph = sceneStore.state.graph;
  graph.getNodes()?.forEach((node: any) => {
    // if (node.shape === 'image') {
    //   setNodeOpacity(node, 0.5);
    // }
    // 判断流量发生标记标签
    setNodeFlowEditedIcon(node, true);
  });
}
/**
 * 流量发生
 * 配置节点编辑标记是否展示
 * @param cls 节点实例
 * @param type 是否整体展示，展示为true，不展示为false
 */
export function setNodeFlowEditedIcon(cls: any, type: boolean) {
  let cpData = cls?.data?.cpFlow?.elements;
  if (cpData?.hasOwnProperty(cls.id)) {
    cls.setAttrs({
      edited: {
        style: {
          visibility:
            cpData[cls.id]?.flows?.length && type ? 'visible' : 'hidden',
          display:
            cpData[cls.id]?.flows?.length && type ? 'inline-block' : 'none',
        },
      },
    });
  }
}
