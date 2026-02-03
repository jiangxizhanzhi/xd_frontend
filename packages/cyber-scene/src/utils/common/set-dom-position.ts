import sceneStore from '../../store/scene-store';
import { nextTick } from '@vue/composition-api';

/**
 * 设置右键样式菜单的位置
 * @param x 鼠标位置
 * @param y 鼠标位置
 * @param sceneEid 场景id
 * @param stageContainer 画布容器
 */
export const clickMenuPosition = (
  x: any,
  y: any,
  sceneEid: string,
  stageContainer: any,
) => {
  let localToGraphPosition = sceneStore.state.graph.localToGraph(x, y);
  const element = document.getElementById(`node-click-menu-${sceneEid}`);
  setTimeout(() => {
    // @ts-ignore
    element.style.display = 'block';
    nextTick(() => {
      if (!element) return;
      const elementWidth = element.offsetWidth,
        elementHeight = element.offsetHeight,
        stageContainerElementWidth = stageContainer.offsetWidth,
        stageContainerElementHeight = stageContainer.offsetHeight,
        localToGraphPositionX = localToGraphPosition.x
          ? parseInt(localToGraphPosition.x)
          : 0,
        localToGraphPositionY = localToGraphPosition.y
          ? parseInt(localToGraphPosition.y)
          : 0;
      if (localToGraphPositionX + elementWidth > stageContainerElementWidth) {
        element.style.left =
          (localToGraphPositionX - elementWidth).toString() + 'px';
      } else {
        element.style.left = localToGraphPositionX.toString() + 'px';
      }
      if (localToGraphPositionY + elementHeight > stageContainerElementHeight) {
        if (localToGraphPositionY >= elementHeight) {
          element.style.top =
            (localToGraphPositionY - elementHeight).toString() + 'px';
        } else {
          element.style.top = '10px';
        }
      } else {
        element.style.top = localToGraphPositionY.toString() + 'px';
      }
    });
  });
};
/**
 * 计算节点信息悬浮提示框tip位置
 * @param node
 * @param element
 * @param stageContainer
 */
export const nodeTipPosition = (
  node: any,
  element: any,
  stageContainer: any,
) => {
  const nodeSize = node.getSize().width;
  const padding = 20;
  setTimeout(() => {
    element.style.display = 'block';
    nextTick(() => {
      const elementWidth = element.offsetWidth,
        elementHeight = element.offsetHeight,
        stageContainerElementWidth = stageContainer.offsetWidth,
        stageContainerElementHeight = stageContainer.offsetHeight,
        nodePosition = node.getPosition(),
        nodePositionX = nodePosition.x ? nodePosition.x : 0,
        nodePositionY = nodePosition.y ? nodePosition.y : 0,
        scale = sceneStore.state.graph.zoom(),
        localToGraphPosition = sceneStore.state.graph.localToGraph(
          nodePositionX,
          nodePositionY,
        ),
        localToGraphPositionX = localToGraphPosition.x
          ? parseInt(localToGraphPosition.x)
          : 0,
        localToGraphPositionY = localToGraphPosition.y
          ? parseInt(localToGraphPosition.y)
          : 0;
      if (
        localToGraphPositionX +
          elementWidth +
          parseInt(String((nodeSize + padding) * scale)) >
        stageContainerElementWidth
      ) {
        element.style.left =
          (localToGraphPositionX - elementWidth).toString() + 'px';
      } else {
        element.style.left =
          (
            localToGraphPositionX + parseInt(String(nodeSize * scale))
          ).toString() + 'px';
      }
      // 为了避免节点信息弹框遮盖节点名，节点信息弹框的top位置偏下
      element.style.top =
        (
          localToGraphPositionY + parseInt(String((nodeSize + padding) * scale))
        ).toString() + 'px';
    });
  });
};
/**
 * 计算节点接入方式面板弹框位置
 * @param node
 * @param element
 * @param stageContainer
 */
export const nodePosition = (node: any, element: any, stageContainer: any) => {
  const nodeSize = node.getSize().width;
  const padding = 20;
  setTimeout(() => {
    element.style.display = 'block';
    nextTick(() => {
      const elementWidth = element.offsetWidth,
        elementHeight = element.offsetHeight,
        stageContainerElementWidth = stageContainer.offsetWidth,
        stageContainerElementHeight = stageContainer.offsetHeight,
        nodePosition = node.getPosition(),
        nodePositionX = nodePosition.x ? nodePosition.x : 0,
        nodePositionY = nodePosition.y ? nodePosition.y : 0,
        scale = sceneStore.state.graph.zoom(),
        localToGraphPosition = sceneStore.state.graph.localToGraph(
          nodePositionX,
          nodePositionY,
        ),
        localToGraphPositionX = localToGraphPosition.x
          ? parseInt(localToGraphPosition.x)
          : 0,
        localToGraphPositionY = localToGraphPosition.y
          ? parseInt(localToGraphPosition.y)
          : 0;

      if (
        localToGraphPositionX +
          elementWidth +
          parseInt(String((nodeSize + padding) * scale)) >
        stageContainerElementWidth
      ) {
        element.style.left =
          (
            localToGraphPositionX -
            (parseInt(String(padding * scale)) + elementWidth)
          ).toString() + 'px';
      } else {
        element.style.left =
          (
            localToGraphPositionX +
            parseInt(String((nodeSize + padding) * scale))
          ).toString() + 'px';
      }

      if (
        localToGraphPositionY +
          elementHeight +
          parseInt(String(padding * scale)) >
        stageContainerElementHeight
      ) {
        if (localToGraphPositionY >= elementHeight) {
          element.style.top =
            localToGraphPositionY -
            elementHeight +
            parseInt(padding * scale) +
            'px';
        } else {
          element.style.top = '10px';
        }
      } else {
        element.style.top =
          (
            localToGraphPositionY + parseInt(String(padding * scale))
          ).toString() + 'px';
      }
    });
  });
};
/**
 * 计算场景启动后节点错误信息悬浮提示框tip位置
 * @param node
 * @param element
 * @param stageContainer
 */
export const nodeErrorTipPosition = (
  node: any,
  element: any,
  stageContainer: any,
) => {
  const nodeSize = node.getSize().width;
  setTimeout(() => {
    element.style.display = 'block';
    nextTick(() => {
      element.style.left = '0px';
      element.style.top = '0px';
      const elementWidth = element.offsetWidth,
        elementHeight = element.offsetHeight,
        nodePosition = node.getPosition(),
        nodePositionX = nodePosition.x ? nodePosition.x : 0,
        nodePositionY = nodePosition.y ? nodePosition.y : 0,
        scale = sceneStore.state.graph?.zoom(),
        localToGraphPosition = sceneStore.state.graph?.localToGraph(
          nodePositionX,
          nodePositionY,
        ),
        localToGraphPositionX = localToGraphPosition.x
          ? parseInt(localToGraphPosition.x)
          : 0,
        localToGraphPositionY = localToGraphPosition.y
          ? parseInt(localToGraphPosition.y)
          : 0;

      element.style.left =
        (
          localToGraphPositionX -
          elementWidth / 2 +
          parseInt(String(nodeSize * scale))
        ).toString() + 'px';
      element.style.top =
        (localToGraphPositionY - elementHeight).toString() + 'px';
    });
  });
};

/**
 * 获取编辑器视图
 * @param elm
 */
export const getClientPageRect = (elm: string) => {
  let dom = document.getElementById(elm);
  return dom?.getBoundingClientRect();
};
