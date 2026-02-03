import { zIndex } from '../../../../types/z-index';
import { isJSON } from '../../../../utils/common';
import {
  bodyAttr,
  textAttr,
} from '../../../../utils/connection/connection-rule';
import sceneStore from '../../../../store/scene-store';
// ‘straight’ --直线；‘fold’ -- 折线；‘smooth’--曲线
/**
 * 连线配置属性
 */
/**
 * 连线配置属性
 * @param zIdx
 * @param type ‘straight’ --直线；‘fold’ -- 折线；‘smooth’--曲线
 * @param connectionData 连线的数据
 * @param isUpperEdge 是否是上层连线，如果是上层连线，则临时展示为直线，并存储上层连线的type及vertices数据
 */
export const initEdgeConfig = (
  zIdx?: number,
  type?: any,
  connectionData?: any,
  isUpperEdge?: Boolean,
) => {
  const edgeAttrs =
    connectionData?.display_context &&
    gerEdgeAttrs(connectionData?.display_context);
  let lineStroke = edgeAttrs?.line?.stroke || 'var(--neutral7)';
  let originalClass =
    lineStroke === 'var(--neutral7)' ? 'edge-line original' : 'edge-line';
  return {
    data: {
      line: {
        stroke: lineStroke,
        zIndex: edgeAttrs?.line?.zIndex || zIdx || zIndex['edge'],
        strokeWidth: edgeAttrs?.line?.strokeWidth || 1,
        strokeDasharray: edgeAttrs?.line?.strokeDasharray || 0,
      },
      labels: {
        body: bodyAttr(edgeAttrs),
        text: textAttr(edgeAttrs),
      },
      positionSource: edgeAttrs?.positionSource,
      positionTarget: edgeAttrs?.positionTarget,
      animation: edgeAttrs?.line?.animation,
      animationTimer: null,
      animationDirections:
        edgeAttrs?.line?.animationDirections || 'uniDirectional', // 动画的单向双向流动
      eid: connectionData?.eid,
      // lineStroke: lineStroke,
      // 存储被忽略的type和vertices，用于保存
      upperEdgeData: isUpperEdge
        ? {
            type: type,
            vertices: connectionData.vertices,
          }
        : undefined,
    },
    attrs: {
      line: {
        stroke: lineStroke,
        sourceMarker: null,
        targetMarker: null,
        class: originalClass,
        strokeWidth: edgeAttrs?.line?.strokeWidth || 1,
        strokeDasharray: edgeAttrs?.line?.strokeDasharray || 0,
        style: {
          animation:
            edgeAttrs?.line?.animation === 'flow'
              ? 'running-line 30s infinite linear'
              : '',
        },
        // stroke: {
        //   type: 'linearGradient',
        //   stops: [
        //     { offset: '0%', color: '#ccc' },
        //     { offset: '50%', color: '#73d13d' },
        //     { offset: '100%', color: 'var(--primary-color)' },
        //   ],
        // },
      },
    },
    zIndex: edgeAttrs?.line?.zIndex || zIdx || zIndex['edge'],
    router: {
      name: isUpperEdge ? 'normal' : type === 'fold' ? 'orth' : 'normal',
      args: {
        padding: 10,
      },
    },
    // 当前画布中连线的数量，如果连线数量大于50，则不使用跳线，跳线时间复杂度为O(n)
    connector: {
      name:
        type === 'smooth'
          ? 'smooth'
          : type === 'fold'
          ? 'normal'
          : sceneStore.state.edgeCount < sceneStore.state.jumpoverEdgeCount
          ? 'jumpover'
          : 'normal',
      args: {
        size: 3,
      },
    },
    // tools: {
    //   items: [
    //     {
    //       name: 'vertices',
    //       args: {
    //         attrs: { fill: '#666', width: 1, height: 1 },
    //       },
    //     },
    //   ],
    // },
  };
};
/**
 * 解析连线属性
 * @param attrs
 */
export function gerEdgeAttrs(attrs: any) {
  if (attrs && isJSON(attrs)) {
    return JSON.parse(attrs);
  }
}
