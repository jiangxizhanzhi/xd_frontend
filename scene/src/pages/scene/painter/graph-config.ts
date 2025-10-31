import { Graph, Shape } from '@antv/x6';
import { initEdgeConfig } from './edge';
import {
  bothFromUpperLayer,
  checkEdgeRepeat,
  checkEdgeRule,
  checkVmContainerConnectInternalNetworkRepeat,
  getAvailablePorts,
} from '../../../utils/connection/connection-rule';
import sceneStore from '../../../store/scene-store';
import t from '../../../utils/i18n';
import PageStatus from '../../store/page-status';
import { getBackground } from './background/index';
import { nodeTypeName } from '../../../types/role';

/**
 * 初始化画布配置属性
 * @param container 容器
 * @param status 编辑状态还是展示状态 edit || display
 * @param message
 * @param containerMinimap 小地图
 * @param wrapperHeight
 */
export const graphConfig = (
  container: HTMLElement,
  status: string,
  message: any,
  containerMinimap: any,
  wrapperHeight: any,
) => {
  let width = container?.offsetWidth || 800;
  let height = container?.offsetHeight || 800;
  let sourceCellData: any, targetCellData: any; // 连线节点数据
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  // 高亮
  const magnetAvailabilityHighlighter = {
    name: 'stroke',
    args: {
      attrs: {
        fill: '#fff',
        stroke: '#47C769',
      },
    },
  };

  // @ts-ignore
  return {
    container,
    width,
    height,
    panning: {
      enabled: true,
    },
    // @ts-ignore
    checkView: ({ view, unmounted }) => {
      return checkViewRule(view, wrapperHeight);
    },
    embedding: {
      enabled: true,
      validate: (args: any) => {
        let { child, parent, childView, parentView } = args;
        if (
          child.shape === 'html' ||
          parent.shape === 'rect' ||
          child.shape === 'path' ||
          parent.shape === 'image' ||
          child.shape === 'image'
        )
          return false;
        return true;
      },
    },
    async: true,
    sorting: 'approx',
    background: {
      image:
        sceneStore.state.basicConfig?.backgroundType === 'background-image' &&
        getBackground(
          sceneStore.state.basicConfig.active,
          PageStatus.state.theme,
        ),
      color:
        (sceneStore.state.basicConfig?.backgroundType === 'background-color' &&
          sceneStore.state.basicConfig?.backgroundColor) ||
        'var(--bg-color-1)',
      position: 'center',
      size: '100% 100%',
    },
    // 网格
    grid: GET_GRID_CONFIG(PageStatus.state.theme),
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      // minScale: 0.5,
      // maxScale: 3,
    },
    connecting: {
      // router: {
      //   name: 'orth',
      //   args: {
      //     padding: 10,
      //   },
      // },
      // connector: {
      //   name: 'jumpover',
      // },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false, // 是否允许连接到画布空白位置的点
      allowMulti: 'withPort', // 是否允许在相同的起始节点和终止之间创建多条边
      allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
      allowEdge: false, // 是否允许边链接到另一个边
      allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
      // allowPort: false, // 是否允许边链接到链接桩
      snap: {
        radius: 0, // 连线的过程中距离节点或者连接桩 0px 时会触发自动吸附
      },
      // 临时边
      createEdge() {
        return new Shape.Edge(initEdgeConfig(undefined, null, {}));
      },
      // @ts-ignore
      validateConnection({ sourceCell, targetCell }) {
        // 判断是否可以连线
        sourceCellData = sourceCell;
        targetCellData = targetCell;
        return true;
      },
      // @ts-ignore
      validateEdge({ edge, type, previous }) {
        let {
          basicConfig: sourceBasicConfig,
          networkConfig: sourceNetworkConfig,
        } = sourceCellData.data;
        let {
          basicConfig: targetBasicConfig,
          networkConfig: targetNetworkConfig,
        } = targetCellData.data;

        let sourceRoleInfo = {
          role: sourceBasicConfig.role,
          image_type: sourceBasicConfig.image_type,
          is_build_in: sourceBasicConfig.is_build_in,
          shape: sourceCellData.shape,
        };
        let targetRoleInfo = {
          role: targetBasicConfig.role,
          image_type: targetBasicConfig.image_type,
          is_build_in: targetBasicConfig.is_build_in,
          shape: targetCellData.shape,
        };
        // 场景更新时，只允许终端节点添加连线
        if (sceneStore.state.sceneStatus === 'update') {
          if (sourceBasicConfig.role != 4 && targetBasicConfig.role != 4) {
            message.error(t('stage.updateConnectionNotAllowed'));
            return false;
          }
        }
        // 外部网络不可连接外部网络、仿真节点； 终端节点不能直接连接终端节点及仿真节点；仿真节点不能直接连接仿真节点；层节点不能连接层节点
        if (!checkEdgeRule(sourceRoleInfo, targetRoleInfo)) {
          message.error(
            // @ts-ignore
            t('stage.connectionNotAllowed', {
              source: nodeTypeName(
                sourceRoleInfo.role,
                sourceRoleInfo.image_type,
                sourceCellData.shape,
              ),
              target: nodeTypeName(
                targetRoleInfo.role,
                targetRoleInfo.image_type,
                targetRoleInfo.shape,
              ),
            }),
          );
          return false;
        }
        // 相同节点不可重复连接
        if (checkEdgeRepeat(sourceCellData, targetCellData)) {
          message.error(t('stage.duplicateConnection'));
          return false;
        }

        // 同时属于上层节点不允许连接
        if (PageStatus.state.openLayer) {
          if (bothFromUpperLayer(sourceCellData, targetCellData)) {
            message.error(t('stage.connectionLayerNotAllowed'));
            return false;
          }
        }

        // 虚拟机、容器不能连接多个外部网络
        if (
          checkVmContainerConnectInternalNetworkRepeat(
            sourceCellData,
            targetCellData,
          )
        ) {
          message.error(t('stage.vmContainerConnectInternalNetwork'));
          return false;
        }

        // 层节点和普通节点之间的连线，不校验端口数量
        if (
          sourceCellData.shape === 'image' ||
          targetCellData.shape === 'image'
        ) {
          return true;
        }

        // 判断源节点和目标节点有没有可用端口
        let sourceAvailablePort = getAvailablePorts(
          sourceNetworkConfig.network,
          sourceCellData,
        );
        let targetAvailablePort = getAvailablePorts(
          targetNetworkConfig.network,
          targetCellData,
        );
        if (!sourceAvailablePort) {
          message.error(
            `${sourceBasicConfig.name} ` + t('stage.noPortAvailable'),
          );
          return false;
        }
        if (!targetAvailablePort) {
          message.error(
            `${targetBasicConfig.name} ` + t('stage.noPortAvailable'),
          );
          return false;
        }
        if (sourceAvailablePort && targetAvailablePort) {
          return true;
        }
        return false;
      },
    },
    highlighting: {
      magnetAvailable: magnetAvailabilityHighlighter,
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            // fill: '#5F95FF',
            // stroke: '#5F95FF',
          },
        },
      },
      embedding: {
        name: 'stroke',
        args: {
          attrs: {
            stroke: 'var(--primary-color)',
          },
        },
      },
    },
    // 节点是否可调整大小
    resizing: {
      enabled: (node: any) => node.shape === 'html',
    },
    translating: {
      /* restrict: {
        x: 0,
        y: 0,
        width,
        height: height,
      }, */
    },
    interacting: {
      edgeLabelMovable: true,
    },

    // 节点是否可旋转
    rotating: false,
    // 点选/框选配置（详细文档：https://X6.antv.vision/zh/docs/tutorial/basic/selection）
    selecting: {
      enabled: true,
      multiple: true,
      rubberband: true,
      rubberEdge: true, // 框选可以选中edge
      rubberNode: true, // 框选可以选中node
      movable: true,
      strict: false,
      showNodeSelectionBox: true,
      showEdgeSelectionBox: false,
      className: 'my-selecting',
      filter: ['text-block'],
      modifiers: 'alt',
      pointerEvents: 'none',
    },
    // 对齐线配置，辅助移动节点排版（详细文档：https://X6.antv.vision/zh/docs/tutorial/basic/snapline）
    snapline: {
      enabled: true,
      clean: 100,
      tolerance: 5,
      filter(node: any) {
        return node.parent;
      },
    },
    // 撤销/重做能力（详细文档：https://X6.antv.vision/zh/docs/tutorial/basic/history）
    history: {
      enabled: true,
      beforeAddCommand(event: any, args: any) {
        // console.log('历史变更 event', event, args);
        // 忽略历史变更
        if (
          args.options.ignoreHistory ||
          args.key === 'zIndex' ||
          args.key === 'tools'
        ) {
          return false;
        }
      },
    },
    // 使画布具备滚动、平移、居中、缩放等能力（详细文档：https://X6.antv.vision/zh/docs/tutorial/basic/scroller）
    scroller: {
      enabled: false,
    },
    clipboard: true,
    minimap: {
      // 需要开启scroller  样式问题
      enabled: false,
      container: containerMinimap,
      width: 200,
      height: 160,
      padding: 10,
      minScale: 0.5,
      maxScale: 3,
      graphOptions: {
        async: true,
        // getCellView(cell:any) {
        //   if (cell.isNode()) {
        //     return SimpleNodeView
        //   }
        // },
        createCellView(cell) {
          if (cell.isEdge()) {
            return null;
          }
        },
      },
    },
    keyboard: {
      enabled: true,
      guard(this, e: KeyboardEvent) {
        if (e.altKey) {
          // 当按下 alt 键时，忽略所有键盘事件
          return false;
        }
        // 展示模式下禁止删除操作，兼容mac
        // if (
        //   sceneStore.state.sceneStatus === 'display' &&
        //   ((!isMac && e.key.toLowerCase() === 'delete') || (isMac && e.metaKey))
        // ) {
        //   return false;
        // }
        return true;
      },
      global: true, // 是否为全局键盘事件，设置为 true 时键盘事件绑定在 Document 上，否则绑定在画布容器上。当绑定在画布容器上时，需要容器获得焦点才能触发键盘事件。默认为 false。
    },
    autoResize: true, // 是否监听容器大小改变，并自动更新画布大小
    // @ts-ignore
    // onPortRendered({ contentContainer, port }) {},
    // onEdgeLabelRendered() {},
    // onToolItemCreated({ tool }) {},
  };
};

// 网格配置属性
export const GET_GRID_CONFIG = (theme: string) => ({
  size: 20,
  visible: sceneStore.state.basicConfig?.showGrid === true,
  type: 'doubleMesh',
  args: [
    {
      color:
        theme === 'dark' ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.05)',
      thickness: 1,
    },
    {
      color:
        theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
      thickness: 1,
      factor: 10,
    },
  ],
});

// 截图配置
export const GET_SCREENSHOT_CONFIG = (theme: string, size?: any) => ({
  copyStyles: false,
  stylesheet: `
          .node-label.original {
            fill: ${
              PageStatus.state.theme === 'dark'
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(0, 0, 0, 1)'
            };
            }
           .edge-line.original {
             stroke: ${
               PageStatus.state.theme === 'dark'
                 ? 'rgba(255, 255, 255, 0.7)'
                 : 'rgba(0, 0, 0, 0.6)'
             }
            }
           .body-fill.body-fill-original {
             fill: ${
               PageStatus.state.theme === 'dark'
                 ? 'rgba(255, 255, 255, 0.05)'
                 : 'rgba(0, 0, 0, 0.03)'
             }
           }
          .body-stroke.body-stroke-original {
             stroke: ${
               PageStatus.state.theme === 'dark'
                 ? 'rgba(255, 255, 255, 0.1)'
                 : 'rgba(0, 0, 0, 0.05)'
             }
           }
          .label-fill.original {
            fill: ${
              PageStatus.state.theme === 'dark'
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(0, 0, 0, 1)'
            }
           }
           .block-image {
              width: calc(100% + 8px);
              height: calc(100% + 8px);
              margin-left: -8px;
              margin-top: -8px;
           }
          `,
  padding: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  width: size?.width || 900,
  height: size?.height || 500,
  quality: 1,
  backgroundColor: theme === 'dark' ? '#242e43' : '#f4f5f7',
});

// @ts-ignore
export const checkViewRule = (view, wrapperHeight, isFullScreen?: boolean) => {
  return true;
  let windowBBox: any = null;
  const cell = view.cell;
  // @ts-ignore
  let wrapperSize = document
    .querySelector('#scene-all')
    .getBoundingClientRect();
  windowBBox = sceneStore.state.graph.pageToLocal(
    wrapperSize.x,
    wrapperSize.y - (isFullScreen ? wrapperSize.top : 0),
    wrapperSize.width,
    wrapperHeight || wrapperSize.height,
  );
  if (
    cell?.shape === 'rect' ||
    cell?.shape === 'image' ||
    cell?.shape === 'html'
  ) {
    return windowBBox.isIntersectWithRect(cell.getBBox().inflate(10));
  }
  if (cell?.shape === 'edge') {
    const sourceNode = cell.getSourceNode();
    const targetNode = cell.getTargetNode();
    let targetShow = windowBBox.isIntersectWithRect(
      targetNode?.getBBox().inflate(10),
    );
    let sourceShow = windowBBox.isIntersectWithRect(
      sourceNode?.getBBox().inflate(10),
    );
    if (targetShow || sourceShow || !cell.source.cell || !cell.target.cell) {
      return true;
    }
  }
  return false;
};
