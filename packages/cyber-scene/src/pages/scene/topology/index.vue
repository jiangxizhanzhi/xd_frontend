<template>
  <div
    class="stage-container cb-scene-editor"
    ref="stageContainer"
    v-loading="loading || draggingTemplate"
  >
    <div class="container-topo" :id="topologySceneClass"></div>
    <div
      v-if="openLayer && breadcrumbs.length > 1"
      class="breadcrumb-box"
      :style="{left: breadcrumbLocalizeComputed.left, top: breadcrumbLocalizeComputed.top}"
    >
      <span v-for="(item, index) in breadcrumbs" :key="item.id">
        <cb-iconfont
          v-if="index != 0"
          type="icon-xiangzuo"
          class="level-icon"
          color="var(--neutral8)"
        ></cb-iconfont>
        <span
          :class="{
            'level-text': index != breadcrumbs.length - 1,
            'last-level': index === breadcrumbs.length - 1,
          }"
          @click="getLevelDataByStatus(item.id, index)"
        >
          {{ item.name }}
        </span>
      </span>
    </div>
<!--    <div class="container-minimap" :id="topologySceneClass + '_minimap'"></div>-->
    <node-tooltip
      ref="nodeTooltip"
      :node-message="nodeMessage"
      :image-name="imageName"
      :entity-info="entityInfo"
      @tooltipEnter="clearTimeoutTooltip"
      @tooltipLeave="nodeHidden('node-tooltip')"
    ></node-tooltip>
    <node-popover
      ref="nodePopover"
      :mp-scene-id="mpSceneId"
      :node-id="clickedNodeId"
      :node-data="clickedNodeData"
      :topology-edges="topologyEdges"
      :show-snapshot-history-btn="showSnapshotHistoryBtn"
      :show-snap-shot-btn="showSnapShotBtn"
      :show-node-btn="showNodeBtn"
      :show-shut-down-and-up-btn="showShutDownAndUpBtn"
      :show-access-func="showAccessFunc"
      :hide-useless-port-in-access-dialog="hideUselessPortInAccessDialog"
      :scene-eid="sceneEid"
      :is-admin="isAdmin"
      :show-current-page-btn="showCurrentPageBtn"
      :need-to-judge-role-asset-allocation="needToJudgeRoleAssetAllocation"
      @jump-to-page="jumpToPage"
      @on-node-restart="onNodeRestart"
      @on-node-rebuild="onNodeRebuild"
      @on-node-shutdown="onNodeShutDown"
      @on-node-shutup="onNodeShutUp"
      @on-node-snapshot="onNodeSnapshot"
      @on-snapshot-history="onSnapshotHistory"
      @on-node-snapshot-history="onSnapshotHistory"
    >
    </node-popover>
    <!-- 右键菜单-->
    <node-click-menu
      ref="nodeClickMenu"
      :node-id="rightClickedNodeId"
      :node-cls="rightClickedNodeCls"
      :scene-eid="sceneEid"
      @change="handleChange"
    ></node-click-menu>
    <!-- 连线类型工具-->
    <edge-tool :edge-cls="selectedEdgeCls"></edge-tool>
    <!-- 绘图工具栏在场景展示模式下不显示（如果前台实训的居中按钮） -->
    <topology-toolbar
      v-if="status !== 'display' || (status === 'display' && !isStarting && !startError)"
      :show-toolbar="status == 'display' && showToolbar || status != 'display' && sceneStore.state.basicConfig.showGraphToolbar"
      :toolbar="toolbar"
      @clickToolbar="clickToolbarHandler"
    ></topology-toolbar>
    <!-- 流量发生和数据采集弹窗 不带表单校验-->
    <component
      v-if="(status === 'edit'|| status === 'update') && visible"
      ref="component"
      :is="isWho"
      v-model="visible"
      @close="handlePatchClose"
      :nodeInfo="nodeInfo"
      :current-node="currentNode"
      :topology="topology"
      :nodes-to-edge="nodesToEdge"
      :current-edge="currentEdge"
      :scene-config-id="sceneConfigId"
      @close-import="handleCloseImport"
      @update-probes="handleUpdateProbes"
      @clear-nodes-to-edge="clearNodesToEdge"
      @add-edge="handleAddEdge"
      @update-node-data-edit="handleUpdateNodeDataEdit"
      @import-scene-data="handleImportSceneData"
    ></component>
    <!-- 系列弹窗 配置选项弹窗-带表单校验 -->
    <div class="cb-scene-editor-dialog">
      <scene-dialog
        v-if="visibleValidator"
        :nodeInfo="nodeInfo"
        :visible.sync="visibleValidator"
        :size="dialogSize"
        :menuIndex="menuIndex"
        :scene-eid="sceneEid"
        :mp-scene-id="mpSceneId"
        :current-node="currentNode"
        :topology="topology"
        @close="handleClose"
        @update-node-data="handleUpdateNodeData"
      ></scene-dialog>
    </div>
    <!-- 节点错误提示 -->
    <div ref="errorElement" id="node-error-message">
      {{ nodeErrorMessage }}
    </div>
    <!-- 场景截图的进度条 -->
    <div
      v-if="screenShotProgress != 100 && screenShotProgress != 0"
      class="screenShot-progress"
    >
      <cb-progress
        :percentage="screenShotProgress"
        strokeLinecap="round"
        :stroke-width="2"
        :show-text="false"
      ></cb-progress>
    </div>
    <!-- 搜索组件 -->
    <node-searching :visible.sync="showSearchWrapper" :topologySceneClass="topologySceneClass"></node-searching>
  </div>
</template>

<script>
import TopologyToolbar from '../toolbar';
import {
  onMounted,
  onUnmounted,
  watch,
  getCurrentInstance,
  ref,
  nextTick,
  reactive,
  computed,
} from '@vue/composition-api';
import t from '../../../utils/i18n';
import _ from 'lodash';
import { Graph, DataUri, Addon, Vector } from '@antv/x6';
import insertCss from 'insert-css';
import {GridLayout, DagreLayout, CircularLayout, RadialLayout, RandomLayout, ForceLayout, ConcentricLayout, FruchtermanLayout} from '@antv/layout';
import { cyberBus } from '../../../utils/event-bus';
import { Overlay } from '../painter/overlay';
import sceneStore from '../../../store/scene-store';
import PageStatus from '../../store/page-status';
import ProbeSingleNode from '../dialog/probe-collection/single/probe-single-node';
import DrawerFlow from '../dialog/flow-occurs';
import SceneDialog from '../dialog';
import ProbeBatch from '../dialog/probe-collection/batch/probe-batch';
import NodeTooltip from '../node-tooltip';
import NodePopover from '../node-popover';
import NodeClickMenu from '../node-click-menu';
import EdgeTool from '../dialog/edge-tool';
import Port from '../dialog/port-selection-connection';
import { backgroundList } from '../painter/background';
import nodeSearching from "../node-searching";
// import importTemplate from '../dialog/import-template/index.vue';
import getNodeCategory from '../../../types/get-node-category';
import {
  getNodeIdByPortId,
  getPortNameByPortId,
  updateNetworkPorts,
} from '../../../utils/port-processing/port-generation';
import {getNodeStatus, NODE_STATUS_MAKEUP, setNodeStatus} from '../../../types/node-status';
import {
  getAvailablePorts,
  setEdgeLabels,
  setEdgeType,
  updatePortUsable,
} from '../../../utils/connection/connection-rule';
import {
  deleteCheck,
  getLayerTopologyData,
  getLayerTreeData,
  getRealEquipmentInfo,
  getSceneClsTopology,
  getSnapshotByName,
  saveTopology,
  saveTopologyWithoutCheck,
  setTopologyTreeData,
  syncWithTemplate,
  updateArea
} from '../../../api';
import {
  getRandomPosition,
  transfer10,
} from '../../../utils/data-conversion/external-to-scene/utils';
import {
  clickMenuPosition,
  nodeErrorTipPosition,
  nodePosition,
  nodeTipPosition,
} from '../../../utils/common/set-dom-position';
import {
  canAddNodes,
  fixedNodesFromUpperLayer,
  generateUUID,
  getImagePromise,
  getLevelAssetAndVisibleNodes,
  getNewEdgeData,
  getNewNodeData,
  getParentIds,
  isJSON,
  isUpperNode,
  subStr,
  updateParentChild,
} from '../../../utils/common';
import {
  checkViewRule,
  GET_GRID_CONFIG,
  GET_SCREENSHOT_CONFIG,
  graphConfig,
} from '../painter/graph-config';
import { addNodeConfig } from '../painter/node';
import { addBlockConfig } from '../painter/block';
import {
  getNetwork_layerNode,
  targetToElement
} from '../../../utils/data-conversion/target-to-element';
import {
  externalToX6,
  updateIconPool,
  wsDataToX6,
} from '../../../utils/data-conversion/external-to-scene/external-to-x6';
import {
  getEdgeDisplayContext,
  getEdgeType,
  getNodeDisplayContext,
  x6ToExternal
} from '../../../utils/data-conversion/scene-to-external/x6-to-external';
import {LAYER_TYPE, ROLE} from '../../../types/role';
import { updateIcon, updateName } from '../painter/common';
import {addLayerNodeConfig} from "../painter/layer-node";
import {MENU_ENUM} from "../../../types/menu";
import importTemplate from "../dialog/import-template";
import {handleProbeByMenuIndex} from "../../../utils/dialog/probe";
import {handleFlowByMenuIndex} from "../../../utils/dialog/flow";
import {defaultIcon2Base64} from "../../../assets/images/default-icon2-base64";

export default {
  components: {
    NodeClickMenu,
    TopologyToolbar,
    SceneDialog,
    ProbeBatch,
    NodeTooltip,
    NodePopover,
    EdgeTool,
    nodeSearching,
    importTemplate,
  },
  name: 'TopologyStage',
  props: {
    /**
     * 编辑状态还是展示状态 edit || display || update 是否允许弹窗
     */
    status: {
      type: String,
      default: 'edit',
    },
    /**
     * display模式下是否需要展示接入方式弹窗
     */
    showAccessDialog: {
      type: Boolean,
      default: true,
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
    // 右下角配置的操作项
    toolbar: {
      type: Array,
      default: () => [],
    },
    // 左侧配置的菜单项
    menubar: {
      type: Array,
      default: () => [],
    },
    menuIndex: {
      type: Number,
      default: null,
    },
    showProbeBatch: {
      type: Boolean,
      default: false,
    },
    // 是否展示登录协议接入（终端和核心路由器）
    showAccessFunc: {
      type: Function,
      default: () => true,
    },
    // 保存快照
    showSnapShotBtn: {
      type: Boolean,
      default: false,
    },
    // 历史版本
    showSnapshotHistoryBtn: {
      type: Boolean,
      default: false,
    },
    /**
     * 节点是否显示重启重建
     */
    showNodeBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示关机开机按钮，针对竞赛不需要开机关机做的处理
     */
    showShutDownAndUpBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 控制展示隐藏接入弹窗的空闲（未连线）端口
     */
    hideUselessPortInAccessDialog: {
      type: Boolean,
      default: false,
    },
    // 是否自动居中画布元素
    centerContent: {
      type: Boolean,
      default: false,
    },
    // 画布中心点
    centerPoint: {
      type: Object,
      default: () => ({}),
    },
    // 是否绘制ws推送的新节点
    drawWsNewNode: {
      type: Boolean,
      default: false,
    },
    topologySceneClass: {
      type: String,
      default: '',
    },
    sceneEid: {
      type: String,
      default: '',
    },
    mpSceneId: {
      type: String,
      default: '',
    },
    //是否管理员接入，默认管理员
    isAdmin: {
      type: Boolean,
      default: true,
    },
    // 是否显当前页面登录按钮
    showCurrentPageBtn: {
      type: Boolean,
      default: false,
    },
    /**
     * 按钮组配置信息
     */
    btnConfig: {
      type: Array,
      default: () => {
        return ['close', 'recover', 'actualSize', 'update-topology'];
      },
    },
    // 外部自定义缩放比
    graphZoom: {
      type: String | Number,
      default: 1,
    },
    // 是否允许根据ws消息动态删除场景节点
    allowDynamicDeleteNode: {
      type: Boolean,
      default: true,
    },
    // 是否需要判断节点的角色资产配置，用于限制接入面板的重启重建开关机按钮
    needToJudgeRoleAssetAllocation: {
      type: Boolean,
      default: false,
    },
    event: {
      type: String | Number,
      default: '',
    },
    event_status: {
      type: String | Number,
      default: '',
    },
    // 容器高度，用于可视区渲染
    wrapperHeight: {
      type: Number,
      default: 800,
    },
    // 场景ID，主要用于分层拓扑数据获取
    sceneId: {
      type: String,
      default: '',
    },
    // 左上角标题内容
    title: {
      type: String,
      default: '',
    },
    // 是否开启分层编辑
    openLayer: {
      type: Boolean,
      default: false,
    },
    showImportTemplate: {
      type: Boolean,
      default: false,
    },
    sceneConfigId: {
      type: String,
      default: '',
    },
    upperNodeLocalize: {
      type: Object,
      default: () => {
        return {
          marginLeft: '200px',
          marginTop: '100px',
        };
      },
    },
    breadcrumbLocalize: {
      type: Object,
      default: () => {
        return {
          left: '25px',
          top: '380px',
        };
      },
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    // 训练房间id
    business_id: {
      type: String,
      default: undefined,
    },
    // 训练角色id
    role_id: {
      type: String,
      default: undefined,
    },
    syncProcessing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }, context) {
    const { proxy } = getCurrentInstance();
    const { $message, $confirm } = proxy;
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    let stageContainer = ref(null);
    let graph, dnd;
    let addNodeInfo;
    let toolbarValue = ref('');
    let overlay = ref();
    let dialogSize = ref('middle');
    let visible = ref(false);
    let visibleValidator = ref(false);
    let isWho = ref();
    const $tt = t;
    let nodeInfo = ref({});
    let nodeMessageShow = ref(false);
    let nodeMessage = ref({});
    let currentNode = ref();
    let topology = ref({});
    let topologyEdges = ref([]);
    let temporaryBlockStartPoint = null;
    let temporaryBlock = null;
    let imageName = ref('');
    let entityInfo = ref({});
    let nodeErrorMessage = ref('');
    let errorElement = ref(null);
    const MISTAKE_SIZE = 50; // 区块误触范围
    let isCtrlDown = false;
    let basicConfig = ref(sceneStore.state.basicConfig);
    let shareState = ref(PageStatus.state);
    let clickName = ref('');
    let draggingTemplate = ref(false);
    const popoverData = reactive({
      type: '',
      is_build_in: false,
      access: {},
      staticRoutes: [],
      network: {},
    });
    let snapshotHistoryCount = ref(0);
    let disableSaveSnapshot = ref(false);
    let clickedNodeData = ref();
    let clickedNodeId = ref('');
    let rightClickedNodeId = ref('');
    let rightClickedNodeCls = ref();
    let container;
    let containerMinimap;
    let nodesToEdge = ref([]);
    let currentEdge = ref();
    let copyNodes = ref([]);
    let copyEdges = ref([]);
    let timerTooltip = ref(null);
    let copyIndex = 0;
    let radio = 1; // 缩放比率
    const STEP = 0.2; // 每次点击按钮变动步幅
    const step = 0.03; // 单次动画步幅
    let mouseDownBlockPos; // 记录移动区块时的初始鼠标坐标位置
    let oldVertices = new Map(); // 记录移动区块时的初始线的路径点
    let selectedEdgeCls = ref(); // 选中的线实例
    let screenShotProgress = ref(0); // 截图的进度条
    let timerProgress = ref(0); // 截图进度动画
    let showSearchWrapper = ref(false); // 是否显示搜索弹框
    let breadcrumbs = ref([{ name: $tt('stage.firstLevel'), id: '' }]); // 分层层路径
    let loading = ref(props.openLayer); // 画布加载
    // let requestController = ref(); // 用于取消请求

    onMounted(() => {
      if (
        props.status === 'edit' ||
        props.status === 'update' ||
        props.btnConfig.includes('update-topology')
      ) {
        PageStatus.setDialog(true);
      } else {
        PageStatus.setDialog(false);
      }
      container = document.getElementById(props.topologySceneClass);
      containerMinimap = document.getElementById(props.topologySceneClass + '_minimap');
      graph = new Graph(graphConfig(container, props.status, $message, containerMinimap, props.wrapperHeight,props.openLayer));
      // graph.setAsync(true)
      sceneStore.setGraph(graph);
      dnd = new Addon.Dnd({
        target: graph,
        scaled: false,
        animation: false,
        containerParent: container,
        getDragNode: (node) => node.clone({ keepId: true }),
        getDropNode: (node, options) => node.clone({ keepId: true }),
        async validateNode(droppingNode, options) {
          const ALLOW_DISTANCE =
            props.menuIndex === MENU_ENUM['sceneTemplate']
              ? 520
              : [
                MENU_ENUM['operatingSystem'],
                MENU_ENUM['applicationSystem'],
                MENU_ENUM['networkEquipment'],
                MENU_ENUM['securityEquipment'],
              ].includes(props.menuIndex)
                ? 500
                : 320;
          // 将坐标转换为最接近的10的倍数
          let newPos = transfer10(droppingNode.position());
          droppingNode.position(newPos.x, newPos.y);
          let templatePosition = {
            x: _.cloneDeep(droppingNode.position()?.x),
            y: _.cloneDeep(droppingNode.position()?.y),
          };

          const draggingNode = options.draggingNode,
            x = droppingNode.position()?.x,
            y = droppingNode.position()?.y,
            // 将画布本地坐标转换为画布坐标，再做比较，验证被拖拽的靶标能否放入画布
            localToPagePosition = graph.localToGraph(x, y);
          if (localToPagePosition?.x >= ALLOW_DISTANCE) {
            // 节点变动通知事件
            emit('on-change-nodes');
            // 将查找面板隐藏
            showSearchWrapper.value = false;
            if (
              draggingNode.shape === 'rect' ||
              draggingNode.shape === 'image'
            ) {
              draggingNode.setData(draggingNode.data);
              // resetSearchInfo();
              droppingNode.zIndex = 2;
            } else {
              let position = droppingNode.position();
              // 处理模板拖拽数据
              return new Promise(async (resolve, reject) => {
                if (props.openLayer) {
                  draggingTemplate.value = true;
                  saveTopologyData().then(() => {
                    // 处理模板拖拽数据
                    return new Promise(async (resolve, reject) => {
                      await syncWithTemplate({
                        area_id: PageStatus.state.currentTreeLevelId,
                        id: props.sceneConfigId,
                        template_id: draggingNode.data.id,
                      }).then(async (res) => {
                        loading.value = false;
                        // 将plugins格式->内部格式
                        let data = await externalToX6(
                          res.data.data,
                          templatePosition,
                        );
                        data.nodes?.forEach((node) => {
                          if (!graph.getCellById(node.id)) {
                            graph.addNode(node);
                          }
                        });
                        graph.addEdges(data.edges);
                        PageStatus.setAnotherLayerNodeCount(res.data.data?.scene_config?.topology?.out_area_element_num || 0);
                        resolve(false);
                      }).finally(() => {
                        loading.value = false;
                        setTimeout(() => {
                          draggingTemplate.value = false;
                        }, 200);
                      });
                    });
                  }).catch(() => {
                    loading.value = false;
                    draggingTemplate.value = false;
                  });
                  resolve(false);
                } else {
                  // 将plugins格式->内部格式
                  let data = await externalToX6(draggingNode.data, position);
                  // 当前画布不支持层节点编辑，不允许拖拽带有层节点的场景模板
                  if (data.nodes?.some(item => item.shape === 'image')) {
                    $message.info($tt('stage.unSupportLayerTemplate'));
                    resolve(false);
                  } else {
                    graph.addEdges(data.edges);
                    graph.addNodes(data.nodes);
                    updateBlockNodes();
                    await updateIconPool(data);
                    resolve(false);
                  }
                }
              });
            }
            return true;
          } else {
            draggingTemplate.value = false;
            return false;
          }
        },
      });

      /*************************** 鼠标事件 **********************************/
      // 节点单击
      graph.on('node:click', ({ node }) => {
        if (startError.value) return;
        if (node.shape !== 'rect') {
          clearClickedData();
          nodeHidden(`node-popover-${props.sceneEid}`);
          nodeHidden(`node-click-menu-${props.sceneEid}`);
          return;
        }
        // 菜单是角色资产或战争迷雾，且是角色资产配置状态时，才可配置角色资产
        if (
          (props.menuIndex === MENU_ENUM['war'] || props.menuIndex === MENU_ENUM['assets']) &&
          PageStatus.state.roleAssets
        ) {
          if (isUpperNode(node)) return;
          emit('roleAssets', node);
        }
        // event 0 时，不展示接入面板
        if (props.status === 'display' && node.data.basicConfig?.event !== 0) {
          clearClickedData();
          emit('on-display-click', {
            id: node.id,
            role: node.data.basicConfig.role,
          });
          clickedNodeData.value = node.getData();
          clickedNodeId.value = node.id;
          topologyEdges.value = graph.getEdges();

          // 隐藏失败节点错误信息弹框
          nodeHidden('node-error-message');
          if (!props.showAccessDialog) return;
          // 显示节点接入方式弹框
          const element = document.getElementById(
            `node-popover-${props.sceneEid}`,
          );
          nodePosition(node, element, stageContainer.value);
        } else {
          // 编辑状态下点击节点，节点信息提示框隐藏
          nodeHidden('node-tooltip');
        }
      });
      graph.on('node:port-click', ({ node }) => {
        nodeHidden('node-tooltip');
        nodeHidden(`node-click-menu-${props.sceneEid}`);
      });
      graph.on('node:start-click', ({ e, node }) => {
        if (props.status === 'display') {
          if (PageStatus.state.allowStart) {
            emit('on-node-start', {
              id: node.id,
              role: node.data.basicConfig?.role,
              image_type: node.data.basicConfig?.image_type,
              is_build_in: node.data.basicConfig?.is_build_in,
              image_uuid: node.data.basicConfig?.image_uuid,
            });
            setNodeStatus(node, 'loading', container);
          } else {
            $message.error($tt('stage.notStarted'));
          }
          e.stopPropagation();
        }
      });
      // 鼠标移入块
      graph.on('node:mouseenter', ({ node, view, x, y }) => {
        if (node.shape !== 'rect' && node.shape !== 'image') return;
        if (props.status === 'edit' || props.status === 'update') {
          const nodeData = _.get(node, 'data', {}) || {};
          const {
            image = '',
            role = '',
            image_type = '',
          } = nodeData.basicConfig;
          nodeMessage.value = nodeData;
          getSnapShot(image, role);
          image_type === 'entity' &&
            getRealEquipmentInfo(image).then((res) => {
              entityInfo.value = _.get(res.data, 'data.list', [{}])[0];
            });
          // 显示节点信息提示框
          const element = document.getElementById('node-tooltip');
          nodeTipPosition(node, element, stageContainer.value);
          // 拓扑编排模式下显示连接桩
          if (
            [
              MENU_ENUM['topology'], // 拓扑编排
              MENU_ENUM['shortcut'], // 常用靶标
              MENU_ENUM['sceneTemplate'], // 场景模板
              MENU_ENUM['operatingSystem'], // 操作系统
              MENU_ENUM['applicationSystem'], // 应用系统
              MENU_ENUM['networkEquipment'], //网络设备
              MENU_ENUM['securityEquipment'], //安防设备
            ].includes(props.menuIndex)) {
            showCirclePorts(true);
          }
        }
        // 展示模式下显示节点的错误信息
        if (props.status === 'display' && node?.shape !== 'image') {
          const data = _.get(node, 'data.basicConfig', {}) || {};
          if (
            data.process_status &&
            data.process_status === 5 &&
            data.process_message
          ) {
            const element = errorElement.value;
            element.style.display = 'block';
            nodeErrorMessage.value = data.process_message;
            nodeErrorTipPosition(node, element, stageContainer.value);
          }
        }
      });

      // 鼠标移出
      graph.on('node:mouseleave', ({ node }) => {
        if (node.shape === 'rect' || node.shape === 'image') {
          // 延时隐藏节点信息提示框
          timerTooltip.value = setTimeout(() => {
            nodeHidden('node-tooltip');
          }, 200);
          nodeHidden('node-error-message');
          showCirclePorts(false);
        }
      });

      graph.on('node:dblclick', ({ node, e }) => {
        // 层节点
        if (node.shape === 'image') {
          if (props.openLayer) {
            if (props.status === 'edit') {
              // 如果是角色资产和战争迷雾的编排模式时，双击自动加入资产中
              if (
                (props.menuIndex === MENU_ENUM['war'] || props.menuIndex === MENU_ENUM['assets']) &&
                PageStatus.state.roleAssets
              ) {
                emit('roleAssets', node);
              }
              // 获取下层数据
              getCurrentLevelTopologyData(node.id);
              return;
            } else {
              // 展示模式下获取下层实例数据
              getCurrentLevelTopologyDataEid(node.id);
              emit('on-next-level', node.id);
              return;
            }
          } else {
            $message.info($tt('stage.unSupportLayer'));
          }
        }
        // 上层带过来的节点，只允许连线：禁止双击编辑，禁止删除
        if (isUpperNode(node)) return;
        if (props.status === 'display' && startError.value) return;
        // 角色资产和战争迷雾状态下不允许删除
        if (props.menuIndex === MENU_ENUM['war'] || props.menuIndex === MENU_ENUM['assets']) {
          !PageStatus.state.roleAssets &&
          $message.error($tt('stage.assetsEditLimit'));
          return;
        }
        if (!PageStatus.state.dialog) return;
        if (props.status !== 'edit' && node.shape === 'rect') {
          // 镜像网络设备和实装、外部网络、NPC暂不支持动态更新 必须有实例id
          if (
            (node.data?.basicConfig?.image_type === 'entity' || //实装
              node.data?.basicConfig?.role === ROLE['network'] || // 外部网络
              node.data?.basicConfig?.role === ROLE['npc'] || // NPC
              (!node.data?.basicConfig?.is_build_in &&
                ['vm', 'container', 'dynamips'].includes(
                  node.data?.basicConfig?.image_type,
                ) &&
                [ROLE['router'], ROLE['firewall'], ROLE['switch']].includes(
                  node.data?.basicConfig?.role,
                ))) &&
            node.data?.basicConfig?.eid
          ) {
            $message.error($tt('stage.updateNodeLimit'));
            return;
          }
        }
        nodeConfigDialog(node);
        if (node.shape === 'html' && props.status != 'display') {
          node.addTools({
            name: 'node-editor',
            args: {
              event: e,
              attrs: {
                backgroundColor: '#EFF4FF',
              },
              getText: ({ cell }) => {
                return cell.attr('label/text');
              },
              setText: ({ cell, value }) => {
                if (value.length > 255) {
                  $message.error($tt('stage.rectNameLen'));
                } else {
                  cell.attr('label/text', value);
                }
              },
            },
          });
        }
      });

      // 群组区块大小变化后，将区块范围内的节点加入群组
      graph.on('node:change:size', ({ node }) => {
        if (node.shape === 'html' && !node.data.isTemporary) {
          let { width = 0, height = 0 } = node?.getProp('size');
          updateNodesInBlock(node, width, height);
        }
      });

      graph.on('node:mousedown', ({ node, e, x, y, view, cell }) => {
        // 群组区块移动问题
        if (node.shape === 'html') {
          mouseDownBlockPos = { x, y };
          node.children?.forEach((child) => {
            graph.getIncomingEdges(child)?.forEach((edge) => {
              if (
                edge.getRouter()?.name === 'orth' ||
                edge.getConnector()?.name === 'smooth'
              ) {
                let saveVertices = _.cloneDeep(edge.getVertices()).length
                  ? _.cloneDeep(edge.getVertices())
                  : _.cloneDeep(graph.findViewByCell(edge.id).routePoints);
                oldVertices.set(edge.id, saveVertices);
              }
            });
          });
        }
      });

      // 移动鼠标
      graph.on('node:mousemove', ({ node, e, x, y }) => {
        // 隐藏节点信息提示框
        nodeHidden(`node-popover-${props.sceneEid}`);
        // 隐藏右键菜单
        nodeHidden(`node-click-menu-${props.sceneEid}`);
        // 清空存储的数据
        clearClickedData();
        // 隐藏节点接入弹框
        nodeHidden('node-tooltip');

        // 隐藏失败节点的错误信息弹框
        nodeHidden('node-error-message');

        // 隐藏连线类型工具栏
        nodeHidden('edge-tool-container');
        selectedEdgeCls.value = null;

        resetEdgeStatus();

        // 更新连线的路径点
        refreshHandler(node.id);
        if (node.shape === 'html') {
          node.children?.forEach((child) => {
            if (child.shape != 'html') {
              graph.getIncomingEdges(child)?.forEach((edge) => {
                if (
                  edge.getRouter()?.name === 'orth' ||
                  edge.getConnector()?.name === 'smooth'
                ) {
                  computedVertices(edge, x, y);
                }
              });
            }
          });
        }
      });

      // 群组区块移动位置后，将区块范围内的节点加入群组
      graph.on('node:moved', ({ node, x, y }) => {
        // TODO 多选节点整体移动问题
        if (node.shape === 'rect') {
          updateBlockNodes();
        }
        if (node.shape === 'html') {
          let { width = 0, height = 0 } = node?.getProp('size');
          updateNodesInBlock(node, width, height);
        }
        emit('node-moved', node);
      });

      // 添加节点后修改层级
      graph.on('node:added', ({ node }) => {
        if (node.shape === 'rect') {
          if (node.parent) {
            let parentNode = graph.getCellById(node.parent);
            parentNode.embed(node);
          }
          if (!isUpperNode(node)) {
            // 统计当前层的节点数量，上层节点不参与统计
            sceneStore.state.targetNum.nodes++;
          }
          updateSwitcherNum(node.data.basicConfig);
        }
        if (node.shape === 'html' && node?.data?.fillPic) {
          if (!sceneStore.state.iconPoolData.has(node?.data?.fillPic)) {
            getImagePromise(node?.data?.fillPic).then((res) => {
              sceneStore.setIconPoolData(node?.data?.fillPic, {data: res}); // 存储图片地址
              node.html = () => {
                return generateHtmlWrap(node, res);
              };
            });
          } else {
            node.html = () => {
              return generateHtmlWrap(node, sceneStore.state.iconPoolData.get(node?.data?.fillPic)?.data);
            };
          }
        }
      });

      // 节点右键
      graph.on('node:contextmenu', ({ node, x, y, e }) => {
        if (props.status === 'edit' || props.status === 'update') {
          rightClickedNodeId.value = node.id;
          rightClickedNodeCls.value = node;
          // 显示节点菜单下拉框
          clickMenuPosition(x, y, props.sceneEid, stageContainer.value);
        }
        if (node.shape !== 'image') return;
        node.addTools({
          name: 'node-editor',
          args: {
            event: e,
            attrs: {
              backgroundColor: '#EFF4FF',
            },
            getText: ({ cell }) => {
              return cell.attr('text/text');
            },
            setText: ({ cell, value }) => {
              if (value.length > 255) {
                $message.error($tt('stage.rectNameLen'));
              } else {
                let newValue = value?.trim()?.replace(/\s*/g, '');
                cell.attr('text/text', newValue);
                if (cell.shape === 'rect') {
                  let cellData = cell.getData();
                  cellData.basicConfig.name = newValue;
                  cell.setData(cellData);
                  cell.attr(
                    'text/text',
                    newValue ? subStr(newValue, 40) : '',
                  );
                }
              }
            },
          },
        });
      });

      // 连线点击
      graph.on('edge:click', ({ edge, x, y }) => {
        // 如果是上层连线，则直接return
        if (edge?.data?.upperEdgeData) {
          return;
        }
        resetEdgeStatus();
        nodeHidden(`node-click-menu-${props.sceneEid}`);
        edge.setAttrs(
          {
            line: {
              stroke: 'rgba(9, 178, 235, 1)',
            },
          },
          { ignoreHistory: true },
        );
        if (props.status === 'display') return;
        let localPosition = graph.localToGraph({ x, y });
        const element = document.getElementById('edge-tool-container');
        const padding = { x: 20, y: 40 };
        selectedEdgeCls.value = edge;
        setTimeout(() => {
          element.style.display = 'inline-block';
          element.style.top = localPosition.y - padding.y + 'px';
          element.style.left = localPosition.x + padding.x + 'px';
        });
      });

      // graph.on('edge:dblclick', ({ edge, x, y, e }) => {
      //   edge.addTools({
      //     name: 'edge-editor',
      //     args: {
      //       event: e,
      //       attrs: {
      //         backgroundColor: '#EFF4FF',
      //       },
      //     },
      //   });
      // });

      // 基础设置中不显示连线端口时，鼠标浮到线上线上端口名，反之不显示
      graph.on('edge:mouseenter', ({ edge }) => {
        if (!sceneStore.state.basicConfig.showLineLabels) {
          const sourceNode = edge.getSourceCell(),
            targetNode = edge.getTargetCell();
          const sourceNetwork =
              sourceNode.getData()?.networkConfig?.network || [],
            targetNetwork = targetNode.getData()?.networkConfig?.network || [];
          const { source, target } = edge;
          const sourceMatchedPort = sourceNetwork.find(
            (item) => item.id === source.port,
          );
          const targetMatchedPort = targetNetwork.find(
            (item) => item.id === target.port,
          );
          setEdgeLabels(
            edge,
            sourceMatchedPort?.name || '',
            targetMatchedPort?.name || '',
            true,
            edge.data,
          );
        }
      });

      graph.on('edge:mouseleave', ({ edge }) => {
        if (!sceneStore.state.basicConfig.showLineLabels) {
          setEdgeLabels(edge, '', '', false, edge.data);
        }
      });

      // 连线右键
      graph.on('edge:contextmenu', ({ edge, x, y }) => {
        graph.unselect(edge);
        resetEdgeStatus();
        if (props.status === 'edit' || props.status === 'update') {
          rightClickedNodeId.value = edge.id;
          rightClickedNodeCls.value = edge;
          // 显示节点菜单下拉框
          clickMenuPosition(x, y, props.sceneEid, stageContainer.value);
        }
      });

      graph.on('edge:connected', ({ currentCell, view, edge, isNew }) => {
        if (isNew) {
          const source = edge.getSourceCell();
          const target = edge.getTargetCell();

          let sourceData = source.getData();
          let targetData = target.getData();

          // 普通节点连线
          if (source.shape === 'rect' && target.shape === 'rect') {
            // 判断当前是简易型连线模式还是选择端口模式
            if (sceneStore.state.basicConfig.simpleModeToEdge) {
              // 查找可用端口
              let sourceAvailablePort = getAvailablePorts(
                sourceData?.networkConfig?.network,
                source
              );
              let targetAvailablePort = getAvailablePorts(
                targetData?.networkConfig?.network,
                target
              );
              if (!sourceAvailablePort || !targetAvailablePort) return;
              // 批量操作事务
              graph.batchUpdate(() => {
                // 更新端口usable
                updatePortUsable(
                  source,
                  target,
                  sourceAvailablePort.id,
                  targetAvailablePort.id,
                  false,
                );
                edge.setSource(
                  { cell: source.id, port: sourceAvailablePort.id },
                  { ignoreHistory: true },
                );
                edge.setTarget(
                  { cell: target.id, port: targetAvailablePort.id },
                  { ignoreHistory: true },
                );
                setEdgeLabels(
                  edge,
                  sourceAvailablePort?.name || '',
                  targetAvailablePort?.name || '',
                  sceneStore.state.basicConfig.showLineLabels,
                  edge.data,
                );
              });
              // 设置连线层级
              setTimeout(() => {
                edge.setZIndex(
                  Math.min(source.getZIndex(), target.getZIndex()) - 1,
                  { ignoreHistory: true },
                );
              }, 200);
            } else {
              nextTick(() => {
                // 需要选择端口
                visible.value = true;
                isWho.value = Port;
                currentEdge.value = edge;
                nodesToEdge.value.push(
                  { id: source.id, data: sourceData },
                  { id: target.id, data: targetData },
                );
              });
            }
          }
          // 层节点连线
          if (source?.shape === 'image' || target?.shape === 'image') {
            // 批量操作事务
            graph.batchUpdate(() => {
              edge.setSource(
                { cell: source.id, port: `port_${source.id}_layer_1` },
                { ignoreHistory: true },
              );
              edge.setTarget(
                { cell: target.id, port: `port_${target.id}_layer_1` },
                { ignoreHistory: true },
              );
            });
            edge.attr('line/strokeDasharray', "10, 5", source, target);
            edge.setData({ line: edge.getAttrs()?.line }, { silent: true });
          }
        }
      });

      // 用于处理模板拖拽 新增连线
      graph.on('edge:added', ({ edge, index, options }) => {
        if (edge.data?.animation === 'animateAlongPath') {
          setTimeout(() => {
            addAnimateAlongPath(edge);
          }, 1000);
        }
      });

      graph.on('blank:mousedown', ({ e, x, y }) => {
        nodeHidden(`node-click-menu-${props.sceneEid}`);
        if (
          props.status === 'display' ||
          ![0, 15, 5, 6, 7, 8, 9].includes(props.menuIndex)
        )
          return;
        if (isCtrlDown) {
          graph.resetSelection();
          temporaryBlockStartPoint = {
            x: x || 0,
            y: y || 0,
          };
        }
      });

      // 空白区域拖拽事件
      graph.on('blank:mousemove', ({ e, x, y }) => {
        // 隐藏连线类型工具栏
        nodeHidden('edge-tool-container');
        selectedEdgeCls.value = null;

        nodeHidden(`node-popover-${props.sceneEid}`);
        if (
          props.status === 'display' ||
          ![0, 15, 5, 6, 7, 8, 9].includes(props.menuIndex)
        )
          return;
        if (isCtrlDown) {
          graph.batchUpdate(
            () => {
              temporaryBlock =
                temporaryBlock ||
                graph.addNode(
                  addBlockConfig(
                    '',
                    temporaryBlockStartPoint,
                    { x, y },
                    $tt('target.group'),
                    undefined,
                    true,
                  ),
                  { ignoreHistory: true },
                );
              let width = x - temporaryBlockStartPoint.x;
              let height = y - temporaryBlockStartPoint.y;
              temporaryBlock.setAttrs(
                {
                  body: {
                    refPoints: `0,0 ${width},0 ${width},${height} 0,${height}`,
                  },
                },
                { ignoreHistory: true },
              );
              temporaryBlock.setProp(
                'size',
                { width, height },
                { ignoreHistory: true },
              );
            },
            { ignoreHistory: true },
          );
        }
      });

      graph.on('blank:mouseup', ({ e, x, y }) => {
        if (
          props.status === 'display' ||
          ![0, 15, 5, 6, 7, 8, 9].includes(props.menuIndex)
        )
          return;
        if (!temporaryBlock) return;
        let { width = 0, height = 0 } = temporaryBlock?.getProp('size');
        if (Math.abs(width) > MISTAKE_SIZE && Math.abs(height) > MISTAKE_SIZE) {
          // 转换起止节点坐标值
          let startPoint = {
            x: width < 0 ? x : x - width,
            y: height < 0 ? y : y - height,
          };
          let endPoint = {
            x: width < 0 ? x - width : x,
            y: height < 0 ? y - height : y,
          };
          graph.batchUpdate(
            () => {
              temporaryBlock.getChildren()?.forEach((child) => {
                child?.setParent(null, { ignoreHistory: true });
              });
              temporaryBlock.setChildren(null, { ignoreHistory: true });
              graph.removeNode(temporaryBlock, { ignoreHistory: true });
              const drawTemporaryBlock = graph.addNode(
                addBlockConfig(generateUUID(), startPoint, endPoint, $tt('target.group')),
              );
              // 框选范围内的节点均作为子节点
              updateNodesInBlock(
                drawTemporaryBlock,
                Math.abs(width),
                Math.abs(height),
              );
            },
            { ignoreHistory: true },
          );
        } else {
          graph.removeNode(temporaryBlock, { ignoreHistory: true });
        }
        temporaryBlock = null;
      });

      graph.on('blank:click', () => {
        graph.resetSelection();
        resetEdgeStatus();
        nodeHidden(`node-popover-${props.sceneEid}`);
        nodeHidden('node-tooltip');
        clickedNodeId.value = null;
        rightClickedNodeId.value = null;
        rightClickedNodeCls.value = null;
      });

      graph.on('edge:change:zIndex', (args)=> {
        args.cell?.setData({ line: { ...args.cell?.getAttrs()?.line, zIndex: args.current } }, { silent: true });
      })

      // 节点右键
      // graph.on('blank:contextmenu', ({node, x, y}) => {
      //   console.log('画布右键',  graph.getSelectedCells())
      // })

      graph.on('render:done', ({ e, x, y }) => {
        loading.value = false;
      });

      // delete
      graph.bindKey(['Delete', 'meta+backspace'], async () => {
        if (startError.value) return;
        // 角色资产和战争迷雾状态下不允许删除
        if (props.menuIndex === 3 || props.menuIndex === 4) {
          $message.error($tt('stage.assetsDeleteLimit'));
          return;
        }
        if (!PageStatus.state.dialog) return;
        const cells = graph.getSelectedCells();
        let illegalNodes = [];
        if (cells.length) {
          if (props.status === 'update' || props.status === 'display') {
            if (cells.length > 1) {
              props.status === 'update' &&
              $message.error($tt('stage.batchLimit'));
              return;
            } else if (cells[0]?.shape === 'rect') {
              if (
                cells[0]?.data?.basicConfig?.role !== ROLE['terminal'] &&
                cells[0]?.data?.basicConfig.eid
              ) {
                $message.error($tt('stage.deleteNodeLimit'));
                return;
              } else {
                // 上层的节点不允许删除， 与层节点有连线不允许删除
                let hasLayerConnection = graph.getConnectedEdges(cells[0])?.some(edge => edge.source?.port?.indexOf('layer')>=0 || edge.target?.port?.indexOf('layer')>=0);
                if (isUpperNode(cells[0])) {
                  illegalNodes.push(cells[0].id);
                } else if (hasLayerConnection) {
                  $message.error($tt('stage.updateDeleteNodeLimit'));
                  illegalNodes.push(cells[0].id);
                } else {
                  // 有实例id的节点
                  if (cells[0]?.data?.basicConfig.eid) {
                    $confirm($tt('stage.confirmDeleteNode'))
                      .then(() => {
                        handleUpdateDeleteNode(cells);
                      })
                      .catch(() => {});
                  } else {
                    // 新增的节点
                    handleUpdateDeleteNode(cells);
                  }
                }
              }
            } else if (cells[0]?.shape === 'edge') {
              if (
                cells[0].data?.eid
                // graph.getCellById(cell.source.cell)?.data?.basicConfig
                //   ?.role != 4 &&
                // graph.getCellById(cell.target.cell)?.data?.basicConfig
                //   ?.role != 4
              ) {
                illegalNodes.push(cells[0].id);
                $message.error($tt('stage.deleteEdgeLimit'));
              } else {
                let source = graph.getCellById(cells[0].source.cell);
                let target = graph.getCellById(cells[0].target.cell);
                // 更新外部网络端口
                updateNetworkPorts(source, target, 'delete', cells[0]);
                updatePortUsable(source, target, cells[0].source.port, cells[0].target.port, true);
                // 隐藏连线类型工具栏
                nodeHidden('edge-tool-container');
                selectedEdgeCls.value = null;
                graph.removeCell(cells[0]);
              }
            } else if (cells[0]?.shape === 'html') {
              if (props.status === 'display') return;
              // 删除群组区块时不删除内部子节点，同时需要更新子节点的area为null
              if (cells[0].data?.parent) {
                cells[0]?._children?.forEach((child) => {
                  child?.setParent(PageStatus.state.currentTreeLevelId);
                  let childData = child.getData();
                  childData.basicConfig.area_id = PageStatus.state.currentTreeLevelId;
                  child.setData(childData, { silent: true });
                  child.show();
                });
                cells[0].setChildren(null);
              }
              graph.removeCell(cells[0]);
            }// 层节点添加删除限制
            else if (cells[0].shape === 'image') {
              $message.error($tt('stage.deleteNodeLimit'));
              illegalNodes.push(cells[0].id);
            }
          } else {
            for (let i = 0; i < cells.length; i++) {
              let cell = cells[i];
              // 删除群组区块时不删除内部子节点，同时需要更新子节点的area为null
              if (cell.data?.parent) {
                cell?._children?.forEach((child) => {
                  child?.setParent(PageStatus.state.currentTreeLevelId);
                  let childData = child.getData();
                  childData.basicConfig.area_id = PageStatus.state.currentTreeLevelId;
                  child.setData(childData, { silent: true });
                  child.show();
                });
                cell.setChildren(null);
              } else {
                if (cell.shape === 'rect' || cell.shape === 'image') {
                  // 上层的节点不允许删除
                  if (isUpperNode(cell)) {
                    illegalNodes.push(cell.id);
                  } else {
                    // 层节点添加删除限制
                    if (cell.shape === 'image') {
                      await getLayerTopologyData(props.sceneConfigId, cell.id).then((res) => {
                        if (
                          res?.data?.data?.scene_config?.topology?.elements?.some(item => item.area === res?.data?.data?.scene_config?.topology?.area_id) ||
                          res?.data?.data?.scene_config?.topology?.areas?.some(item => item.area === res?.data?.data?.scene_config?.topology?.area_id)
                        ) {
                          $message.error($tt('stage.isNotEmptyLayerNode'));
                          illegalNodes.push(cell.id);
                        }
                      });
                    } else {
                      let hasCrossConnection = false;
                      // 如果当前的节点与其它层的节点有连线关系，则不允许删除
                      sceneStore.state.crossLevelConnection?.forEach(item => {
                        if (getNodeIdByPortId(item.source) === cell.id || getNodeIdByPortId(item.target) === cell.id) {
                          illegalNodes.push(cell.id);
                          hasCrossConnection = true;
                        }
                      })
                      if (!hasCrossConnection) {
                        handleDeleteTheNode(cell);
                      } else {
                        $message.error($tt('stage.deleteLayerEdgeLimit'));
                      }
                    }
                  }
                }
                if (cell.shape === 'edge') {
                  if (cell.data?.eid && (
                      cell.source.port?.indexOf('layer') >=0 ||
                      cell.target.port?.indexOf('layer') >=0
                    )
                  ) {
                    //调用关联关系接口，判断该连线是否可以删除
                    await deleteCheck({areaConnectionEid: cell.data.eid}).then(res => {
                      if (!res.data.data.result) {
                        illegalNodes.push(cell.id);
                        $message.error($tt('stage.deleteLayerEdgeLimit'));
                      }
                    })
                  } else {
                    let source = graph.getCellById(cell.source.cell);
                    let target = graph.getCellById(cell.target.cell);
                    // 如果连线两端的节点都不属于当前层，则也不允许删除
                    if (isUpperNode(source) && isUpperNode(target)) {
                      illegalNodes.push(cell.id);
                    } else {
                      // 删除连线更新外部网络端口
                      updateNetworkPorts(source, target, 'delete', cell);
                      updatePortUsable(source, target, cell.source.port, cell.target.port, true);
                      // 隐藏连线类型工具栏
                      nodeHidden('edge-tool-container');
                      selectedEdgeCls.value = null;
                    }
                  }
                }
              }
            }
            for (let i = cells.length - 1; i >= 0; i--) {
              if (illegalNodes.some((id) => id === cells[i].id)) {
                cells.splice(i, 1);
              }
            }
            emit(
              'on-deleted-nodes',
              cells.map((cell) => ({
                id: cell.id,
                eid: cell.data?.basicConfig?.eid,
              })),
            );
            graph.removeCells(cells);
          }
        }
      });
      // 修改复制的节点的值，重新生成节点id
      graph.bindKey(['meta+c', 'ctrl+c'], () => {
        if (props.status === 'display') return;
        copyNodes.value = [];
        copyEdges.value = [];
        copyIndex = 0;
        const cells = graph.getSelectedCells();
        let cellIds = cells.map((item) => item.id);
        if (cells.length) {
          if (cells.length > 1 && props.status === 'update') {
            $message.error($tt('stage.batchLimit'));
            return;
          }
          cells.forEach((cell) => {
            if (cell.shape === 'edge') {
              if (
                cellIds.some((id) => id === cell.source.cell) &&
                cellIds.some((id) => id === cell.target.cell)
              ) {
                copyEdges.value.push(cell);
              }
            }
            if (cell.shape === 'rect') {
              if (
                (props.status === 'update' &&
                  cell.data.basicConfig.role === ROLE['terminal']) ||
                props.status === 'edit'
              ) {
                copyNodes.value.push(cell);
              } else {
                $message.error($tt('stage.copyLimit'));
                return false;
              }
            }
          });
        }
        return false;
      });

      graph.bindKey(['meta+v', 'ctrl+v'], (e) => {
        if (props.status === 'display') return;
        if (copyNodes.value && copyNodes.value.length) {
          canAddNodes(sceneStore.state.targetNum.nodes, copyNodes.value.length)
            .then(() => {
              copyIndex++;
              // 节点变动通知事件
              emit('on-change-nodes');
              let nodeIdMap = new Map();
              copyNodes.value?.forEach((node) => {
                let newId = generateUUID();
                nodeIdMap.set(node.id, newId);
                let newNode = getNewNodeData(node, newId);
                let attrs = getNodeDisplayContext(node, true);
                graph.addNode(
                  addNodeConfig(
                    newId,
                    node.attrs?.image?.xlinkHref || '',
                    node.attrs?.text?.text || '',
                    newNode,
                    false,
                    {
                      x: (node.position()?.x || 0) + 40 * copyIndex,
                      y: (node.position()?.y || 0) + 60 * copyIndex,
                    },
                    undefined,
                    attrs,
                  ),
                );
              });
              copyEdges.value?.forEach((edge) => {
                let attrs = getEdgeDisplayContext(edge, true);
                graph.addEdge(getNewEdgeData(edge, nodeIdMap, copyIndex, attrs));
              });
            })
            .catch(() => {
              $message.error(
                $tt('stage.supportNodeLimit', {
                  maxCount: PageStatus.state.maxCount,
                  currentCount: sceneStore.state.targetNum.nodes,
                }),
              );
            });
          graph.resetSelection();
          // graph.select(cells);
        }
        return false;
      });

      // 修改复制的节点的值，重新生成节点id
      graph.bindKey(['meta+f', 'ctrl+f'], () => {
        if (props.status === 'edit') {
          showSearchWrapper.value = true;
          return false;
        }
      });
      // graph.bindKey(['meta+z', 'ctrl+z'], (e) => {
      //   graph.undo();
      // });
      // graph.bindKey(['meta+y', 'ctrl+y'], (e) => {
      //   graph.redo();
      // });
      // graph.history.on('undo', (args) => {})
      // graph.history.on('redo', (args) => {})

      // 更新节点状态
      // graph.on('node:change:data', ({ node }) => {});

      // 监听窗口变动
      window.addEventListener('resize', resizeHandler, true);
      window.addEventListener('keydown', listenKeydownCtrl, true);
      window.addEventListener('keyup', listenKeyupCtrl, true);
      /*************************** 节点鼠标事件 END **********************************/
    });

    /*************************** 业务方法 **********************************/
    watch(
      () => props.showProbeBatch,
      (val) => {
        visible.value = val;
        if (val) {
          topology.value = graph.getCells();
          isWho.value = ProbeBatch;
        }
      },
    );
    watch(
      () => shareState.value.theme,
      (val) => {
        paintBackground();
        nodeHidden(`node-click-menu-${props.sceneEid}`);
        rightClickedNodeId.value = null;
        rightClickedNodeCls.value = null;
      },
    );
    watch(
      () => shareState.value.isFullScreen,
      (val) => {
        setTimeout(() => {
          resizeScene(
            stageContainer.value.clientWidth,
            stageContainer.value.clientHeight,
            val
          );
        }, 200);
      },
    );
    watch(
      () => screenShotProgress.value,
      (val) => {
        if (val === 100) {
          screenShotProgress.value = 0;
          cancelAnimationFrame(timerProgress.value);
          timerProgress.value = 0;
        }
      },
    );
    watch(
      () => PageStatus.state.topologyTreeData,
      (val) => {
        breadcrumbs.value = [
          { name: $tt('stage.firstLevel'), id: '' },
          ...getParentIds(
            PageStatus.state.currentTreeLevelId,
            PageStatus.state.topologyTreeData,
          ),
        ];
        PageStatus.setCurrentTreeLevelDisplayContext(
          breadcrumbs.value[breadcrumbs.value.length - 1]?.display_context,
        );
      },
    );
    watch(
      () => props.showImportTemplate,
      (val) => {
        visible.value = val;
        if (val) {
          isWho.value = importTemplate;
        }
      },
    );
    watch(
      () => loading.value,
      (val) => {
        emit('update:syncProcessing', val || draggingTemplate.value);
      },
    );
    watch(
      () => draggingTemplate.value,
      (val) => {
        emit('update:syncProcessing', val || loading.value);
      },
    );
    // 场景启动中
    const isStarting = computed({
      get: () => {
        return props.event == 2 && props.event_status == 2;
      },
    });
    // 场景启动失败
    const startError = computed({
      get: () => {
        return props.event == 2 && props.event_status == 5;
      },
    });
    // 层节点面包屑位置计算
    const breadcrumbLocalizeComputed = computed({
      get: () => {
        if (props.openLayer) {
          if (props.status !== 'display') {
            let left = '150px';
            if (shareState.value.collapse) {
              left = '70px';
            }
            if (shareState.value.drawer) {
              const ALLOW_DISTANCE = [6, 7, 8, 9].includes(props.menuIndex)
                ? 510
                : 470;
              left = `calc(${ALLOW_DISTANCE}px)`;
            }
            if (shareState.value.roleAssets) {
              left = '290px';
            }
            if (props.showTitle) {
              left = Number((document.getElementsByClassName('info-name')[0]?.getBoundingClientRect()?.width || 380) + 60) + 'px';
            }
            return {
              left: left,
              top: '25px',
            }
          } else {
            return props.breadcrumbLocalize;
          }
        }
      },
    });
    cyberBus.off('drag');
    cyberBus.on('drag', ({ type, event, data, image }) => {
      if (!_.isEmpty(data) && Object.keys(data).length !== 0) {
        if (type === 'scene') {
          let currentNodesNum = data.scene_config?.topology?.elements.length;
          canAddNodes(sceneStore.state.targetNum.nodes, currentNodesNum)
            .then(async () => {
              await addNodesDnd(data, image, event);
            })
            .catch(() => {
              draggingTemplate.value = false;
              $message.error(
                $tt('stage.supportTemplateNodeLimit', {
                  max: PageStatus.state.maxCount,
                  current: sceneStore.state.targetNum.nodes + PageStatus.state.anotherLayerNodeCount,
                  add: currentNodesNum,
                }),
              );
            });
        } else {
          canAddNodes(sceneStore.state.targetNum.nodes, 1)
            .then(async () => {
              await addNodeDnd(data, image, event);
            })
            .catch(() => {
              $message.error(
                $tt('stage.supportNodeLimit', {
                  maxCount: PageStatus.state.maxCount,
                  currentCount: sceneStore.state.targetNum.nodes + PageStatus.state.anotherLayerNodeCount,
                }),
              );
            });
        }
      }
    });
    // 基础设置更换背景图
    cyberBus.off('changeBackground');
    cyberBus.on('changeBackground', ({ data }) => {
      paintBackground(data);
    });
    // 基础设置是否显示网格
    cyberBus.off('set-show-grid');
    cyberBus.on('set-show-grid', (data) => {
      if (data) {
        graph.showGrid();
      } else {
        graph.hideGrid();
      }
    });
    // 显示与隐藏连线端口名称
    cyberBus.off('set-line-labels');
    cyberBus.on('set-line-labels', (status) => {
      if (status) {
        graph.getEdges()?.forEach((edge) => {
          setEdgeLabels(
            edge,
            getPortNameByPortId(edge.source.port),
            getPortNameByPortId(edge.target.port),
            true,
            edge.data,
          );
        });
      } else {
        graph.getEdges()?.forEach((edge) => {
          setEdgeLabels(edge, '', '', false, edge.data);
        });
      }
    });

    // 动态获取图片
    cyberBus.off('get-promise-icon');
    cyberBus.on('get-promise-icon', (data) => {
      graph.batchUpdate(() => {
        data?.ids?.forEach(nodeId => {
          let node = graph.getCellById(nodeId);
          if (node) {
            let xlinkHref = node?.getAttrByPath('image')?.xlinkHref;
            if ((xlinkHref===undefined || xlinkHref?.includes('data:image') < 0)) {
              node.setAttrs({
                image: { xlinkHref: data.data },
              });
            }
          }
        })
      });
    });

    // 节点配置弹窗
    const nodeConfigDialog = (data) => {
      visibleValidator.value = false;
      visible.value = false;
      let node = {};
      if (typeof data === 'string') {
        graph.resetSelection();
        node = graph.getCellById(data);
        graph.select(node);
      } else {
        node = data;
      }
      if (node.shape === 'rect') {
        let { basicConfig } = node.data;
        const { type: TYPE } = getNodeCategory(
          basicConfig.role,
          basicConfig.image_type,
          basicConfig?.is_build_in,
        );
        nodeInfo.value = {
          id: node.id,
          role: basicConfig.role,
          image_type: basicConfig.image_type,
        };
        currentNode.value = node;
        // 获取当前画布中所有节点和边。
        topology.value = graph.getCells();
        // 默认弹窗状态
        if (
          (PageStatus.state.dialog && ![3, 4].includes(props.menuIndex)) ||
          typeof data === 'string'
        ) {
          dialogSize.value = 'large';
          if (['network'].includes(TYPE)) {
            dialogSize.value = 'small';
          }
          if (['npc'].includes(TYPE)) {
            dialogSize.value = 'npc';
          }
          if (['vserver', 'cserver'].includes(TYPE)) {
            dialogSize.value = 'largeMedium';
          }
          // 数据采集模式
          if (props.menuIndex === 1) {
            dialogSize.value = 'middle';
            if (basicConfig?.init_support && basicConfig?.system_type) {
              visible.value = true;
              isWho.value = ProbeSingleNode;
            } else {
              if (basicConfig?.init_support) {
                $message.error($tt('stage.unSupportSystemToEdit'));
              } else {
                $message.error($tt('stage.unSupportCloudInitToEdit'));
              }
            }
          }
          // 流量发生模式
          else if (props.menuIndex === 2) {
            visible.value = true;
            isWho.value = DrawerFlow;
          } else {
            visibleValidator.value = true;
          }
        }
      }
    };

    // 切换背景
    const paintBackground = (bgData) => {
      let type = sceneStore.state.basicConfig.backgroundType;
      let showGrid = sceneStore.state.basicConfig.showGrid;
      const bg = bgData && type === 'background-image'
        ? bgData
        : backgroundList[shareState.value.theme][
            sceneStore.state.basicConfig.active || 'background'
          ];
      graph.drawBackground({
        image: type === 'background-image' ? bg : undefined,
        color: type === 'background-color' ? sceneStore.state.basicConfig.backgroundColor : 'var(--bg-color-1)',
        position: 'center',
        size: '100% 100%',
      });
      // 重绘网格
      if (showGrid) {
        graph.drawGrid(GET_GRID_CONFIG(PageStatus.state.theme));
      } else {
        graph.hideGrid();
      }
    };

    // 拖拽单个节点
    const addNodeDnd = async (data, image, event) => {
      let id = generateUUID();
      let node;
      if (data?.type === 'layerNode') {
        node = graph.createNode(
          addLayerNodeConfig(id, data.label, {
              type: LAYER_TYPE,
              basicConfig: {
                area_id: PageStatus.state.currentTreeLevelId
              },
              networkConfig: {
                network: getNetwork_layerNode(id, {name: data.label}), // 端口信息
              }
          }),
        );
      } else {
        addNodeInfo = {};
        addNodeInfo = await targetToElement(id, data, props.menubar, image, PageStatus.state.currentTreeLevelId);
        node = graph.createNode(
          addNodeConfig(id, image, data.label, addNodeInfo),
        );
      }
      dnd.start(node, event);
    };
    // 拖拽多节点
    const addNodesDnd = async (data, image, event) => {
      // 临时节点
      const nodes = graph.createNode(
        addNodeConfig(generateUUID(), image, '', data, true),
      );
      dnd.start(nodes, event);
    };

    /**
     * 获取镜像名
     */
    const getSnapShot = (name, role) => {
      imageName.value = '';
      if (![ROLE['router'], ROLE['switch'], ROLE['firewall'], ROLE['terminal']].includes(role)) {
        return;
      }
      getSnapshotByName({name})
        .then((res) => {
          const _data = _.get(res.data, 'data', {
            data: { device_name: '', items: [] },
          });
          if (!_data) imageName.value = name;
          imageName.value = _data.device_name || name;
        });
    };

    // 隐藏节点接入方式弹框、信息提示框
    const nodeHidden = (elementDomId) => {
      const element = document.getElementById(elementDomId);
      if (element && element.style.display !== 'none') {
        element.style.top = '0';
        element.style.left = '0';
        element.style.display = 'none';
      }
    };

    /**
     * 更新节点状态，可用于处理ws推送节点状态
     * @param wsData
     */
    const updateNodeStatus = async (wsData) => {
      let wsStatus = getNodeStatus(
        wsData.scene_element.process_status,
        wsData.scene_element?.event,
        wsData.scene_element?.event_status,
      );
      const node = graph.getCellById(wsData.scene_element.id);
      let deleteStatus =
        wsData.scene_element?.event == 9 &&
        wsData.scene_element?.event_status == 4;
      if (!node && !deleteStatus) {
        if (props.drawWsNewNode) {
          // 新加节点
          let id = wsData.scene_element?.id || generateUUID();
          let addNodeInfo = wsDataToX6(wsData);
          let position = wsData.scene_element?.position2
            ? JSON.parse(wsData.scene_element?.position2)
            : getRandomPosition(props.centerPoint);
          let addNode = graph.addNode(
            addNodeConfig(
              id,
              addNodeInfo.basicConfig?.icon,
              addNodeInfo.basicConfig?.name,
              wsDataToX6(wsData),
              false,
              position,
            ),
          );
          setNodeStatus(addNode, wsStatus, container);
        }
      } else {
        // 需要删除的节点
        if (deleteStatus && props.allowDynamicDeleteNode) {
          graph.removeNode(wsData.scene_element.id);
          if (clickedNodeId.value === wsData.scene_element.id) {
            nodeHidden(`node-popover-${props.sceneEid}`);
            clickedNodeData.value = null;
            clickedNodeId.value = null;
          }
        } else {
          // 需要更新的节点
          const data = node.getData();
          let oldStatus = getNodeStatus(
            data.basicConfig?.process_status,
            data.basicConfig?.event,
            data.basicConfig?.event_status,
          );
          let newData = Object.assign(data, wsDataToX6(wsData));
          // 更新节点图标
          if (newData.basicConfig?.icon != data.basicConfig?.icon) {
            updateIcon(newData.basicConfig?.icon, node);
          }
          // 更新节点名称
          if (newData.basicConfig?.name != data.basicConfig?.name) {
            updateName(newData.basicConfig?.name, node);
          }
          node.setData(newData, { silent: true });
          if (wsStatus === oldStatus) {
          } else {
            // 设置节点状态：加载、失败、成功等
            setNodeStatus(node, wsStatus, container);
          }
          if (clickedNodeId.value === wsData.scene_element.id) {
            clickedNodeData.value = newData;
          }
        }
      }
    };

    /**
     * 更新区块子节点, 群组框选范围内的节点均作为子节点
     * @param cls 区块实例
     * @param width 区块宽度
     * @param height 区块高度
     */
    const updateNodesInBlock = (cls, width, height) => {
      let { x = 0, y = 0 } = cls?.getProp('position');
      graph
        ?.getNodes()
        ?.filter((node) => node.shape === 'rect')
        ?.forEach((node) => {
          // 如果该节点有父级区块且父级区块id不为当前区块id，同时，如果是上层节点则不执行后续操作
          if (node.parent && node.parent.id !== cls.id || isUpperNode(node)) return;
          let { x: nodeX, y: nodeY } = node.position();
          if (
            nodeX >= x &&
            nodeX < x + width &&
            nodeY <= y + height &&
            nodeY > y
          ) {
            if (node.parent && node.parent.id === cls.id) return;
            cls.embed(node);
          } else {
            cls.unembed(node);
          }
        });
      // TODO 待验证删除
      // cls.toBack();
    };

    // 重置当前画布节点和连线的状态， 用于场景更新时候状态图标和连线状态的清除
    const resetCellStatus = () => {
      // 获取到连线的data，然后重绘连线颜色
      graph.getEdges()?.forEach((edge) => {
        edge.setAttrs(
          { line: { stroke: edge?.data?.line?.stroke } },
          { ignoreHistory: true },
        );
      });
      graph
        .getNodes()
        ?.filter((item) => item.shape === 'rect')
        ?.forEach((node) => {
          setNodeStatus(node, '', container);
        });
    };

    // 重置连线选中状态
    const resetEdgeStatus = () => {
      const edges = graph.getEdges();
      selectedEdgeCls.value = null;
      nodeHidden('edge-tool-container');
      graph.batchUpdate(() => {
        edges?.forEach((edge) => {
          edge.setAttrs(
            {
              line: {
                stroke: edge.data.line?.stroke,
                class:
                  edge.data.line?.stroke === 'var(--neutral7)'
                    ? 'edge-line original'
                    : 'edge-line',
              },
            },
            { ignoreHistory: true },
          );
        });
      });
    };

    // 监听顶部工具栏点击
    const clickToolbarHandler = (value, index, lastIndex) => {
      toolbarValue.value = value;
      setInteractiveByToolbar();
      // 画布缩放
      if ([4, 5, 6].includes(index)) {
        scaleTopology(value);
      }
    };

    // 根据工具栏设置画布交互
    const setInteractiveByToolbar = () => {
      if (toolbarValue.value === 'react' || toolbarValue.value === 'text') {
        setGraphInteractive(false);
        if (toolbarValue.value === 'text') {
          overlay.value = new Overlay('#container-topo');
          overlay.value.init();
        }
      } else {
        setGraphInteractive(true);
        overlay.value?.removeInput();
      }
    };

    // 重置画布交互状态 画布平移
    const setGraphInteractive = (interactive) => {
      if (interactive) {
        graph.enablePanning();
      } else {
        graph.disablePanning();
      }
    };

    const handleClose = () => {
      visible.value = false;
      visibleValidator.value = false;
    };
    const clearNodesToEdge = () => {
      nodesToEdge.value = [];
      currentEdge.value = null;
    };
    const handlePatchClose = () => {
      emit('close-patch', false);
    };

    const resizeScene = (width, height, isFullScreen) => {
      graph.resize(
        width || stageContainer.value.clientWidth,
        height || stageContainer.value.clientHeight,
      );
      graph.options.checkView = ({ view }) => {
        return checkViewRule(view, height, isFullScreen);
      };
    };

    const resizeZoom = () => {
      graph.zoomTo(1);
    };

    // 获取当前画布下的所有元素数据
    const getTopologyData = () => {
      const json = graph?.toJSON();
      sceneStore.setBasicConfig({ graphTranslate: graph.translate() });
      sceneStore.setBasicConfig({ graphZoom: graph.zoom() });
      return json;
    };

    // 刷新层面包屑
    const refreshTopoTreeData = async (sceneConfigId) => {
      let treeData = await getLayerTreeData({id: sceneConfigId});
      PageStatus.setTopologyTreeData(treeData?.data?.data?.area_list || []);
      breadcrumbs.value = [
        {name: $tt('stage.firstLevel'), id: ''},
        ...getParentIds(
          PageStatus.state.currentTreeLevelId,
          PageStatus.state.topologyTreeData,
        ),
      ];
      PageStatus.setCurrentTreeLevelDisplayContext(
        breadcrumbs.value[breadcrumbs.value.length - 1]?.display_context,
      );
    }

    // 导入数据重绘画布元素
    const importFromJSON = async (_data, center, sceneConfigId) => {
      let data = JSON.parse(JSON.stringify(_data));
      PageStatus.setAnotherLayerNodeCount(data?.scene_config?.topology?.out_area_element_num || 0);
      // 节点变动通知事件
      emit('on-change-nodes');
      // 隐藏连线类型工具栏
      nodeHidden('edge-tool-container');
      selectedEdgeCls.value = null;
      graph.resetCells([]);
      graph.translate(0, 0);
      sceneStore.state.targetNum.nodes = 0;
      let graphData = await externalToX6(data, center, true, props.status);
      if (props.sceneConfigId && props.openLayer && props.status === 'edit') {
        await refreshTopoTreeData(props.sceneConfigId);
      }
      if (!graphData) {
        loading.value = false;
        return;
      }
      let graphTranslate, graphZoom;
      if (!PageStatus.state.currentTreeLevelId) {
        graphTranslate = sceneStore.state.basicConfig?.graphTranslate || {
          tx: 0,
          ty: 0,
        };
        graphZoom = sceneStore.state.basicConfig?.graphZoom || props.graphZoom || 1;
      } else {
        if (isJSON(PageStatus.state.currentTreeLevelDisplayContext)) {
          let display_context = JSON.parse(
            PageStatus.state.currentTreeLevelDisplayContext,
          );
          graphTranslate = display_context?.graphTranslate || {
            tx: 0,
            ty: 0,
          };
          graphZoom = display_context?.graphZoom || 1;
        } else {
          graphTranslate = {
            tx: 0,
            ty: 0,
          };
          graphZoom = 1;
        }
      }
      graph.zoomTo(graphZoom);
      if (graphTranslate.tx || graphTranslate.ty) {
        graph.translate(graphTranslate.tx, graphTranslate.ty);
      }
      const gridLayout = new GridLayout({
        type: 'grid',
        width: stageContainer.value.clientWidth || 800 - 100,
        height: stageContainer.value.clientHeight || 800 - 100,
        preventOverlap: true,
        preventOverlapPadding: 20,
        center: [center.x, center.y],
        cols: 2,
      });
      // 节点位置字段为空或者需要居中布局
      if (graphData.needLayout || props.centerContent) {
        const model = graphData.needLayout
          ? gridLayout.layout(graphData)
          : graphData;
        new Promise((resolve) => {
          for (let edge of model.edges) {
            graph.addEdge(edge);
          }
          for (let node of model.nodes) {
            graph.addNode(node);
          }
          setTimeout(() => {
            resolve();
          }, 200);
        }).then(() => {
          graph.centerContent();
          updateIconPool(graphData);
        });
      } else {
        for (let edge of graphData.edges) {
          graph.addEdge(edge);
        }
        for (let node of graphData.nodes) {
          graph.addNode(node);
        }
        if (_.isEmpty(graphData.nodes)) {
          loading.value = false;
        }
        nextTick(() => {
          updateParentChild();
          fixedNodesFromUpperLayer(0, stageContainer.value, props.upperNodeLocalize);
          // 处理角色资产和战争迷雾的置灰回显问题
          if (props.menuIndex === MENU_ENUM['assets'] || props.menuIndex === MENU_ENUM['war']) {
            getLevelAssetAndVisibleNodes();
          }
        });
        if (clickedNodeId.value) {
          let _clickedNodeData = graphData.nodes.filter(
            (node) => node.id == clickedNodeId.value,
          );
          clickedNodeData.value = _clickedNodeData[0]?.data;
        }
        if (props.openLayer && props.status === 'edit') {
          if (props.menuIndex === MENU_ENUM['probe']) {
            handleProbeByMenuIndex();
          }
          if (props.menuIndex === MENU_ENUM['flow']) {
            handleFlowByMenuIndex();
          }
        }
        // graph.fromJSON(graphData);
        await updateIconPool(graphData);
        // 遍历当前画布的节点，修改其图标的src属性，优化截图慢问题
        graph.getNodes()?.forEach(node => {
          if (node.shape === 'rect') {
            if (sceneStore.state.iconPoolData?.has(node?.getAttrs()?.image?.xlinkHref)) {
              let base64 = sceneStore.state.iconPoolData?.get(node?.getAttrs()?.image?.xlinkHref)?.data || defaultIcon2Base64();
              node.setAttrs({ image: { xlinkHref: base64 }}, { ignoreHistory: true, silent: false });
            }
          }
        })
      }
      paintBackground();
    };

    // 截图
    const getScreenShot = () => {
      let quiatity = graph.getNodes()?.length;
      let size = { width: 900, height: 500 };
      // 根据场景节点的数量来确定截图大小
      if (quiatity > 100) {
        size = { width: 7860, height: 4320 };
      }
      if (quiatity > 50 && quiatity <= 100) {
        size = { width: 3840, height: 2160 };
      }
      // graph.options.checkView = () => {
      //   return true;
      // };
      timerProgress.value = requestAnimationFrame(function fn() {
        if (screenShotProgress.value < 100) {
          screenShotProgress.value++;
          timerProgress.value = requestAnimationFrame(fn);
        }
      });
      // 添加延时的目的是处理可视区未渲染的节点的截图问题
      // setTimeout(() => {
        graph.toPNG((dataUri) => {
          // 下载
          DataUri.downloadDataUri(dataUri, 'screenshot.png');
          screenShotProgress.value = 100;
        }, GET_SCREENSHOT_CONFIG(PageStatus.state.theme, size));
        // graph.options.checkView = ({ view, unmounted }) => {
        //   return checkViewRule(view, props.wrapperHeight);
        // };
      // }, 200)
    };

    // 截图数据流
    const getScreenShotDataUri = (base64) => {
      // graph.options.checkView = () => {
      //   return true;
      // };
      return new Promise((resolve) => {
        // 添加延时的目的是处理可视区未渲染的节点的截图问题
        graph.toPNG((dataUri) => {
          if (base64) {
            resolve(dataUri);
          } else {
            let blob = b64toBlob(dataUri);
            emit('on-screen-shot', blob);
            resolve(blob);
          }
        }, GET_SCREENSHOT_CONFIG(PageStatus.state.theme, { width: 900, height: 500 }));
        // graph.options.checkView = ({ view }) => {
        //   return checkViewRule(view, props.wrapperHeight);
        // };
      }).catch((err) => {});
    };

    // base64->blob
    const b64toBlob = (dataURI) => {
      let byteString = atob(dataURI.split(',')[1]);
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/png' });
    };

    // 更新数据采集
    const handleUpdateProbes = ({ nodeId, probes, enable_probe_collect, edited }) => {
      let node = graph?.getCellById(nodeId);
      let nodeData = node.getData();
      _.set(nodeData.cpcollection['elements'][nodeId], 'probes', probes);
      _.set(nodeData.cpcollection['elements'][nodeId], 'enable_probe_collect', enable_probe_collect);
      _.set(nodeData.cpcollection['elements'][nodeId], 'edited', edited);
      node.setData(nodeData);
      handleUpdateNodeDataEdit(node);
    };

    // 清空画布节点选中状态
    const resetSelection = () => {
      graph.resetSelection();
      clickedNodeId.value = null;
      rightClickedNodeId.value = null;
      rightClickedNodeCls.value = null;
      clickedNodeData.value = null;
    };

    // 清空左键和右键节点时存储的变量数据
    const clearClickedData = () => {
      clickedNodeData.value = null;
      clickedNodeId.value = null;
      rightClickedNodeId.value = null;
      rightClickedNodeCls.value = null;
    }

    // 选中当前节点，并显示对应的接入面板
    const selectTheNode = (id, showAccess) => {
      if (clickedNodeId.value != id) {
        nodeHidden(`node-popover-${props.sceneEid}`);
      }
      graph.resetSelection();
      let node = graph.getCellById(id);
      node && graph.select(node);
      clickedNodeData.value = node.data;
      clickedNodeId.value = id;
      if (showAccess) {
        // 显示节点接入方式弹框
        const element = document.getElementById(
          `node-popover-${props.sceneEid}`,
        );
        nodePosition(node, element, stageContainer.value);
      }
    };

    // 对应的节点id的接入面板
    const showTheNodeAccessPanel = (id, showAccess) => {
      let node = graph.getCellById(id);
      clickedNodeData.value = node.data;
      clickedNodeId.value = id;
      // 显示节点接入方式弹框
      const element = document.getElementById(`node-popover-${props.sceneEid}`);
      nodePosition(node, element, stageContainer.value);
    };

    // 缩放工具
    const scaleTopology = (option) => {
      let func = {
        positive: () => requestAnimation(1), // 放大
        negative: () => requestAnimation(-1), // 缩小
        restore: () => {
          radio = 1;
          graph.zoomTo(1);
          graph.centerContent();
        }, // 还原
      };
      return func[option]();
    };

    /**
     * 画布缩放
     * @param option 大于0时为放大，小于0时为缩小
     */
    const requestAnimation = (option) => {
      let target = radio + STEP * option; // 目标比率
      if (-1 === option && target < 0) return; // 当目标比率小于0时，不执行后续操作
      let timer = requestAnimationFrame(function fn() {
        let condition = -1 === option ? radio >= target : radio <= target;
        // 缩小时当前画布缩放比例大于目标比例或者放大时当前画布缩放比例小于目标比例时，执行后续缩放操作
        if (condition) {
          let scale = graph.zoom();
          // 画布的缩放比例需要在0.5-3之间
          if (scale + step * option > 0.5 && scale + step * option < 3) {
            radio += step * option;
            graph.zoomTo(radio);
            timer = requestAnimationFrame(fn);
          }
        } else {
          cancelAnimationFrame(timer);
        }
      });
    };
    const resizeHandler = _.debounce(() => {
      resizeScene();
    }, 200);

    const refreshHandler = _.debounce(
      (nodeId) => {
        refreshVertices(nodeId);
      },
      200,
      {
        leading: true,
        trailing: false,
      },
    );

    // 键盘按下操作，原x6键盘监听不灵敏
    const listenKeydownCtrl = (event) => {
      // event.preventDefault();
      if (
        props.status === 'display' ||
        ![0, 15, 5, 6, 7, 8, 9].includes(props.menuIndex)
      )
        return;
      if (
        ((!isMac &&
            event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey &&
            event.key != 'c' &&
            event.key != 'v') ||
          (isMac && event.metaKey)) &&
        !isCtrlDown
      ) {
        setGraphInteractive(false);
        isCtrlDown = true;
      } else {
        if (event.key.toLowerCase() !== 'control') {
          isCtrlDown = false;
          setGraphInteractive(true);
        }
      }
    };

    const listenKeyupCtrl = (event) => {
      // event.preventDefault();
      if (
        props.status === 'display' ||
        ![0, 15, 5, 6, 7, 8, 9].includes(props.menuIndex)
      )
        return;
      if (!graph.isPannable()) {
        setGraphInteractive(true);
        isCtrlDown = false;
      }
    };

    /**
     * 跳转到新标签页
     */
    const jumpToPage = (
      connectUrl,
      access_modes,
      nodeId,
      image_type,
      nodeName,
      jump_type,
      vendor,
      type,
    ) => {
      emit(
        'on-access',
        connectUrl,
        access_modes,
        nodeId,
        image_type,
        nodeName,
        jump_type,
        vendor,
        type
      );
    };

    /**
     * 删除节点
     */
    const removeCell = (nodeId) => {
      graph.removeCell(nodeId);
    };

    /**
     * 节点重启
     */
    const onNodeRestart = (data) => {
      emit('on-node-restart', data);
    };

    /**
     * 节点重建
     */
    const onNodeRebuild = (data) => {
      emit('on-node-rebuild', data);
    };
    /**
     * 节点关机
     */
    const onNodeShutDown = (data) => {
      emit('on-node-shutdown', data);
    };
    /**
     * 节点开机
     */
    const onNodeShutUp = (data) => {
      emit('on-node-shutup', data);
    };
    /**
     * 快照到靶标
     */
    const onNodeSnapshot = (data) => {
      emit('on-node-snapshot', data);
    };
    /**
     * 快照历史版本
     */
    const onSnapshotHistory = (data) => {
      emit('on-node-snapshot-history', data);
    };

    /**
     * 场景实例更新-更新节点
     */
    const handleUpdateNodeData = (data) => {
      emit('update-node-data', data);
    };

    /**
     * 场景编辑-节点表单保存
     */
    const handleUpdateNodeDataEdit = (data) => {
      emit('update-node-data-edit', data);
    };

    /**
     * 控制连接桩显示/隐藏
     * @param show
     */
    const showCirclePorts = (show) => {
      const container = document.getElementById(props.topologySceneClass);
      const ports = container.querySelectorAll('.x6-node .port-circle');
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
      }
    };

    const handleAddEdge = (edgeInfo) => {
      graph.batchUpdate(() => {
        currentEdge.value.setSource(edgeInfo.source);
        currentEdge.value.setTarget(edgeInfo.target);
        setEdgeLabels(
          currentEdge.value,
          edgeInfo.labels.source,
          edgeInfo.labels.target,
          sceneStore.state.basicConfig.showLineLabels,
          currentEdge.value.data,
        );
        let source = graph.getCellById(edgeInfo.source.cell);
        let target = graph.getCellById(edgeInfo.target.cell);

        let sourceIndex = source.getZIndex() || 0;
        let targetIndex = target.getZIndex() || 0;

        currentEdge.value.setZIndex(
          Math.min(...[sourceIndex, targetIndex]) - 1,
        );
        // 更新端口usable
        updatePortUsable(
          source,
          target,
          edgeInfo.source.port,
          edgeInfo.target.port,
          false,
        );
        currentEdge.value = null;
        nodesToEdge.value = [];
      });
    };

    // 更新简易型交换机数量
    const updateSwitcherNum = (basicConfig, type) => {
      if (
        (basicConfig.role === ROLE['switch'] || basicConfig.role === ROLE['simpleSwitch']) &&
        basicConfig.image_type === 'simple'
      ) {
        if (type && type === 'delete') {
          sceneStore.state.targetNum.switcher--;
        } else {
          sceneStore.state.targetNum.switcher++;
        }
      }
    };

    // 节点可连线状态
    const setNodeCircleStatus = (menuIndex) => {
      showCirclePorts(false);
    };

    // 画布居中布局
    const graphToCenter = () => {
      graph.centerContent();
    };

    const clearTimeoutTooltip = () => {
      clearTimeout(timerTooltip.value);
    };

    /**
     * 解决区块移动后，折线路径点不断变化问题：计算偏移量 更新 vertices
     * @param edgeCls 边实例
     * @param x 区块最新位置
     * @param y 区块最新位置
     */
    const computedVertices = (edgeCls, x, y) => {
      let differBlock = {
        x: x - mouseDownBlockPos.x,
        y: y - mouseDownBlockPos.y,
      };
      let newVertices = _.cloneDeep(oldVertices.get(edgeCls.id))?.map(
        (vertice) => {
          return {
            x: vertice.x + differBlock.x,
            y: vertice.y + differBlock.y,
          };
        },
      );
      edgeCls.setVertices(newVertices);
    };

    // 更新区块子节点
    const updateBlockNodes = () => {
      graph
        ?.getNodes()
        ?.filter((node) => node.shape === 'html')
        ?.forEach((block) => {
          let { width = 0, height = 0 } = block?.getProp('size');
          updateNodesInBlock(block, width, height);
        });
    };

    // 刷新连线的路径点值
    const refreshVertices = (nodeId) => {
      graph.batchUpdate(() => {
        graph.getConnectedEdges(nodeId)?.forEach((edgeCls) => {
          edgeCls.setVertices([]);
          setTimeout(() => {
            setEdgeType(
              getEdgeType(edgeCls.router, edgeCls.connector),
              edgeCls,
            );
          }, 500);
        });
      });
    };

    // 更新填充色等属性
    const handleChange = (category = 'body', operationType, cls, value) => {
      if (category === 'animateAlongPath') {
        addAnimateAlongPath(cls);
      } else {
        removeAnimateAlongPath(category, cls, cls?.data?.animation === 'animateAlongPath');
        // 修改动画的方向
        if (operationType === 'changePort') {
          let { source, target } = cls;
          graph.batchUpdate(() => {
            cls.setSource(target);
            cls.setTarget(source);
          });
        } else {
          cls.setAttrs({
            [category]: {
              [operationType]: value,
            },
          });
        }
      }
    };

    // 添加路径动画
    const clearAnimationCircle = (path, edgeCls) => {
      if (path.parentNode.parentNode?.getElementsByClassName(`${edgeCls.id}_animation_circle`).length) {
        // console.log(' path.parentNode.parentNode',  path.parentNode.parentNode?.getElementsByClassName(`${edgeCls.id}_animation_circle`))
        // path.parentNode.parentNode.removeChild(
        //   // path.parentNode.parentNode?.getElementsByClassName(`${edgeCls.id}_animation_circle`)[0],
        // );
        const tempNode = (path.parentNode.parentNode?.getElementsByClassName(`${edgeCls.id}_animation_circle`));
        for (let i = 0; i<tempNode.length;i++) {
          path.parentNode.removeChild(tempNode[i]);
        }
        // tempNode?.forEach(item => {
        //   console.log('itte')
        //   path.parentNode.parentNode.removeChild(item);
        // })

      }
    }

    // 添加路径动画
    const addAnimateAlongPath = (edgeCls) => {
      const view = graph.findViewByCell(edgeCls);
      const TIME = 3000;
      const DELAY = 100;
      if (view) {
        const path = view.findOne('path');
        if (edgeCls.data.animation === 'animateAlongPath') {
          const createCircle = (type) => {
            return Vector.create('circle', {
              r: 4,
              fill: 'var(--primary-color)',
              filter: 'blur(3px)',
              class: `${edgeCls.id}_animation_circle`,
            });
          }
          if (path) {
            removeAnimateAlongPath('removeAnimateAlongPath', edgeCls, true);
            // 清除定时器
            edgeCls.data && clearInterval(edgeCls.data?.animationTimer);
            edgeCls.setData({animationTimer: null}, {silent: true})
            // 单向
            if (edgeCls.data?.animationDirections === 'uniDirectional' || !edgeCls.data?.animationDirections) {
              const token = createCircle();
              token.animateAlongPath(
                { dur: '3s', repeatCount: 'indefinite' },
                path,
              );
              token.appendTo(path.parentNode);
            }
            // 双向
            if (edgeCls.data?.animationDirections === 'biDirectional') {
              const token = createCircle();
              token.animateAlongPath(
                { dur: '3s', repeatCount: 'indefinite' },
                path,
              );
              token.appendTo(path.parentNode);
              let timer = setInterval(() => {
                handleChange('line', 'changePort', edgeCls);
              }, TIME)
              // 记录定时器的id
              edgeCls.setData({animationTimer: timer}, {silent: true})
            }
          }
        }
      }
    };

    // 移除路径动画
    const removeAnimateAlongPath = (category, edgeCls, isAnimation) => {
      // 清除定时器
      if (!isAnimation) {
        edgeCls.data && clearInterval(edgeCls.data?.animationTimer);
        edgeCls.setData({animationTimer: null}, {silent: true})
      }
      if (category === 'removeAnimateAlongPath') {
        const view = graph.findViewByCell(edgeCls);
        if (view) {
          const path = view.findOne('path');
          clearAnimationCircle(path, edgeCls);
        }
      }
    };

    // 删除节点
    const handleDeleteTheNode = (cell) => {
      emit('delete-node', cell.id);
      // 节点变动通知事件
      emit('on-change-nodes');
      let edges = graph.getConnectedEdges(cell);
      updateSwitcherNum(cell.getData()?.basicConfig, 'delete');
      sceneStore.state.targetNum.nodes--;
      edges?.forEach((edge) => {
        let source = graph.getCellById(edge.source.cell);
        let target = graph.getCellById(edge.target.cell);
        if (source?.shape === 'rect' && target?.shape === 'rect') {
          // 更新外部网络端口
          updateNetworkPorts(source, target, 'delete', edge);
          if (edge.source.cell === cell.id) {
            updatePortUsable(
              undefined,
              target,
              undefined,
              edge.target.port,
              true,
            );
          }
          if (edge.target.cell === cell.id) {
            updatePortUsable(
              source,
              undefined,
              edge.source.port,
              undefined,
              true,
            );
          }
        }
      });
      graph.removeCell(cell);
    };

    // 处理删除节点
    const handleUpdateDeleteNode = (cells) => {
      nodeHidden(`node-popover-${props.sceneEid}`);
      handleDeleteTheNode(cells[0]);
      if (props.status === 'display') {
        emit(
          'on-deleted-nodes',
          cells.map((cell) => ({
            id: cell.id,
            eid: cell.data?.basicConfig?.eid,
          })),
        );
      }
      graph.removeCells(cells);
    };

    /**
     * 生成自定义区块的元素
     * @param nodeCls 区块实例
     * @param picUrl 图片地址
     */
    const generateHtmlWrap = (nodeCls, picUrl) => {
      const wrap = document.createElement('div');
      wrap.className = 'block-image';
      wrap.id = `block-image-${nodeCls.id}`;
      wrap.style.width = '100%';
      wrap.style.height = '100%';
      wrap.style.backgroundImage = `url(${picUrl})`;
      wrap.style.backgroundSize = '100% 100%';
      wrap.style.backgroundPosition = 'center';
      wrap.style.borderRadius = nodeCls.getAttrs()?.body?.rx + 'px';
      return wrap;
    };
    /**
     * 根据不同的场景类型，调用获取拓扑的方法
     * @param id
     * @param index
     */
    const getLevelDataByStatus = (id, index) => {
      if (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update') {
        emit('on-next-level', id);
        getCurrentLevelTopologyDataEid(id, index);
        clickedNodeData.value = null;
        clickedNodeId.value = null;
        // 移除接入面板
        nodeHidden(`node-popover-${props.sceneEid}`);
      } else {
        getCurrentLevelTopologyData(id, index);
      }
    };

    // 根据层id查询场景实例中下一层数据
    const getCurrentLevelTopologyDataEid = async (id, index) => {
      if (index === breadcrumbs.value.length - 1) {
        return;
      }
      breadcrumbs.value = [{ name: $tt('stage.firstLevel'), id: '' }];
      loading.value = true;
      PageStatus.setCurrentTreeLevelId(id);
      getSceneClsTopology(props.sceneConfigId || props.mpSceneId, id, props.business_id, props.role_id).then((res) => {
        setTopologyTreeData(props.sceneConfigId, props.sceneConfigId || props.mpSceneId);
        importFromJSON(
          { scene_config: res?.data?.data?.scene_data || res?.data?.data?.scene } || {},
          props.centerPoint,
        );
        loading.value = false;
      }).finally(() => {
        loading.value = false;
      });
      // console.log('保存完成');
    };

    // 场景拓扑编辑-根据层id下一层数据
    const getCurrentLevelTopologyData = async (id, index) => {
      if (index === breadcrumbs.value.length - 1) {
        return;
      }
      breadcrumbs.value = [{ name: $tt('stage.firstLevel'), id: '' }];
      loading.value = true;

      saveTopologyData(false, true).then(() => {
        PageStatus.setCurrentTreeLevelId(id);
        getLayerTopologyData(props.sceneConfigId, id).then((res) => {
          importFromJSON(res?.data?.data || {}, props.centerPoint);
        });
        // console.log('保存完成');
      }).finally(() => {
        loading.value = false;
      });
      // await saveTopologyData();
    };

    //获取当前层的数据格式
    const getLevelTopologyData = (sceneType, taskState) => {
      let json = getTopologyData();
      return x6ToExternal(
        json,
        props.sceneConfigId,
        PageStatus.state.currentTreeLevelId,
        props.title,
        props.sceneType || undefined,
        sceneType,
      );
    };

    // 根据层id下一层数据
    const saveTopologyData = (showMessage, withoutCheck, type) => {
      // 更新当前层的display_context
      if (PageStatus.state.currentTreeLevelId) {
        let gTranslate = graph.translate();
        let display_context = '';
        if (
          !_.isEmpty(gTranslate) &&
          gTranslate.hasOwnProperty('tx') &&
          gTranslate.hasOwnProperty('ty')
        ) {
          display_context = JSON.stringify({
            graphTranslate: {
              tx: Math.round(gTranslate.tx),
              ty: Math.round(gTranslate.ty),
            },
            graphZoom: graph.zoom(),
          });
        }
        updateArea({
          area_id: PageStatus.state.currentTreeLevelId,
          display_context: display_context,
          scene_id: props.sceneConfigId,
        });
      }

      let params = getLevelTopologyData();

      return new Promise((resolve, reject) => {
        if (withoutCheck) {
          saveTopologyWithoutCheck(params).then((res) => {
            if (showMessage) {
              $message.success($tt('stage.saveLevelSuccess'));
            }
            sceneStore.state.crossLevelNodeConnection = [];
            sceneStore.state.crossLevelConnection = [];
            setTopologyTreeData(props.sceneConfigId);
            resolve(res);
          }).catch(err => {
            reject();
          });
        } else {
          loading.value = true;
          // requestController.value = new AbortController();
          saveTopology(params, {}).then((res) => {
            loading.value = false;
            if (showMessage) {
              $message.success($tt('stage.saveLevelSuccess'));
            }
            if (type !== 'createTemplate' && type !== 'export') {
              sceneStore.state.crossLevelNodeConnection = [];
              sceneStore.state.crossLevelConnection = [];
              setTopologyTreeData(props.sceneConfigId || res.data.data.id);
            }
            resolve(res);
          }).catch(err => {
            loading.value = false;
            reject();
          });
        }
      });
    };

    // 处理导入
    const handleImportSceneData = (res) => {
      importFromJSON(
        res || {},
        props.centerPoint,
      );
    };

    const handleCloseImport = (data) => {
      emit('update:showImportTemplate', false);
    }

    insertCss(`
      @keyframes running-line {
        to {
          stroke-dashoffset: -1000;
        }
      }
      @keyframes loading {
        from {
          stroke-dashoffset: 0;
          transform: rotate(0deg);
        }
        to {
          stroke-dashoffset: 0;
          transform: rotate(360deg);
        }
      }
    `);
    /*************************** 业务方法 END **********************************/

    onUnmounted(() => {
      // requestController.value?.abort();
      PageStatus.setAnotherLayerNodeCount(0);
      PageStatus.setTopologyTreeData([]);
      PageStatus.setCurrentTreeLevelId('');
      sceneStore.state.importSceneId = '';
      sceneStore.resetAssets([]);
      graph.off(); // 移除画布自身事件
      graph.clearCells(); // 清除所有元素
      graph.dispose();
      graph = null;
      container = null;
      window.removeEventListener('resize', resizeHandler, true);
      window.removeEventListener('keydown', listenKeydownCtrl, true);
      window.removeEventListener('keyup', listenKeyupCtrl, true);
      clearTimeout(timerTooltip.value);
      sceneStore.state.iconPoolData = undefined;
    });

    return {
      graph,
      loading,
      breadcrumbs,
      clickToolbarHandler,
      setGraphInteractive,
      toolbarValue,
      getTopologyData,
      visible,
      isWho,
      visibleValidator,
      dialogSize,
      nodeInfo,
      nodeMessage,
      nodeMessageShow,
      entityInfo,
      handleClose,
      handlePatchClose,
      currentNode,
      topology,
      handleUpdateProbes,
      importFromJSON,
      getScreenShot,
      getScreenShotDataUri,
      stageContainer,
      resizeScene,
      resizeHandler,
      refreshHandler,
      updateNodeStatus,
      imageName,
      basicConfig,
      NODE_STATUS_MAKEUP,
      clickName,
      popoverData,
      snapshotHistoryCount,
      disableSaveSnapshot,
      clickedNodeData,
      clickedNodeId,
      rightClickedNodeId,
      rightClickedNodeCls,
      topologyEdges,
      screenShotProgress,
      isStarting,
      startError,
      showSearchWrapper,
      draggingTemplate,
      jumpToPage,
      onNodeRestart,
      onNodeRebuild,
      onNodeShutDown,
      onNodeShutUp,
      onNodeSnapshot,
      onSnapshotHistory,
      errorElement,
      nodeErrorMessage,
      nodeHidden,
      scaleTopology,
      resetSelection,
      nodesToEdge,
      currentEdge,
      clearNodesToEdge,
      handleAddEdge,
      setNodeCircleStatus,
      graphToCenter,
      timerTooltip,
      clearTimeoutTooltip,
      resizeZoom,
      selectedEdgeCls,
      nodeConfigDialog,
      removeCell,
      refreshVertices,
      handleUpdateNodeData,
      handleUpdateNodeDataEdit,
      handleChange,
      addAnimateAlongPath,
      removeAnimateAlongPath,
      resetCellStatus,
      selectTheNode,
      showTheNodeAccessPanel,
      handleDeleteTheNode,
      handleUpdateDeleteNode,
      sceneStore,
      getLevelDataByStatus,
      handleImportSceneData,
      saveTopologyData,
      handleCloseImport,
      breadcrumbLocalizeComputed,
      getLevelTopologyData,
    };
  },
};
</script>

<style lang="scss" scoped>
.stage-container {
  width: 100%;
  height: 100%;
  #node-error-message {
    max-width: 400px;
    min-height: 30px;
    text-align: center;
    word-break: break-all;
    font-size: 12px;
    background-color: #242b35;
    color: #fff;
    padding: 8px;
    display: none;
    border: solid 1px #494c50;
    position: absolute;
    border-radius: 4px;
    z-index: 0;
  }
  .breadcrumb-box {
    display: inline-block;
    position: absolute;
    font-size: 14px;
    color: var(--neutral8);
  }
  .level-icon {
    font-size: 16px;
    vertical-align: text-top;
    color: rgba(255, 255, 255, 0.4);
  }
  .level-text {
    font-size: 15px;
    &:hover {
      color: var(--primary-color);
      cursor: pointer;
    }
  }
  .last-level {
    font-size: 15px;
    color: var(--neutral7);
    cursor: not-allowed;
  }
}

.container-topo {
  width: 100%;
  height: 100%;
  position: relative;

  ::v-deep
  .x6-widget-selection.my-selecting.x6-widget-selection-selected
  .x6-widget-selection-box {
    border: 2px dashed var(--primary-color);
    box-shadow: none;
    //pointer-events: none !important;
  }
  .x6-node .x6-port.x6-port-bottom .x6-port-body {
    padding: 4px;
  }
  ::v-deep .x6-node foreignObject > body {
    background: initial !important;
    width: initial !important;
    min-width: initial !important;
  }
}
.container-minimap {
  position: absolute;
  bottom: 45px;
  right: 80px;
  width: 200px;
  height: 150px;
  ::v-deep .x6-widget-minimap .x6-graph {
    box-shadow: none !important;
  }
}
.screenShot-progress {
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
}
</style>
