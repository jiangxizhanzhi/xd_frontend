<template>
  <div class="scene-all" id="scene-all">
    <!--内容区-->
    <div class="container" v-loading="openLayer && isCreatingTemplate">
      <!--表题-->
      <scene-title v-if="showTitle" :title="title"></scene-title>
      <!--菜单栏 && 弹窗页面-->
      <template v-if="sceneConfig.showMenu">
        <menus
          v-model="active"
          :show-title="showTitle"
          :menubar="sceneConfig.menubar"
          :toolMenuBar="sceneConfig.toolMenuBar"
          :target-menubar="sceneConfig.targetMenubar"
          @click="handleLabel"
        ></menus>
        <drawer-distribute
          :menuIndex="active"
          :showAddRole="showActionRole"
          :show-title="showTitle"
          :open-layer="openLayer"
          :role-show-config="roleShowConfig"
          @assetAllocation="assetAllocation"
          @close="drawClose"
          @quitEditStatus="quitEditStatus"
        ></drawer-distribute>
      </template>
      <!--画板-->
      <topology-stage
        v-if="showStage"
        v-bind="$props"
        ref="refTopologyStage"
        :status="status"
        :menubar="sceneConfig.menubar"
        :menu-index="active"
        :toolbar="sceneConfig.toolbar"
        :show-toolbar="sceneConfig.showToolbar && showToolbar"
        :topology-scene-class="topologySceneClass"
        :show-probe-batch="showProbeBatch"
        :show-shut-down-and-up-btn="showShutDownAndUpBtn"
        :show-access-dialog="showAccessDialog"
        :center-point="centerPoint"
        :sceneEid="sceneEid"
        :sceneConfigId="sceneConfigIdComputed"
        :event="eventComputed"
        :event_status="eventStatusComputed"
        :showImportTemplate.sync="showImportTemplate"
        :sync-processing.sync="syncProcessingComputed"
        @on-next-level="handleNextLevel"
        @assetAllocation="assetAllocation"
        @roleAssets="handleRoleAssets"
        @on-screen-shot="handleScreenShot"
        @on-deleted-nodes="handleDeletedNodes"
        @on-added-nodes="handleAddedNodes"
        @on-change-nodes="handleChangeNodes"
        @on-access="handleAccess"
        @on-node-restart="onNodeRestart"
        @on-node-rebuild="onNodeRebuild"
        @on-node-shutdown="onNodeShutDown"
        @on-node-shutup="onNodeShutUp"
        @on-node-start="onNodeStart"
        @on-node-snapshot="onNodeSnapshot"
        @on-node-snapshot-history="onSnapshotHistory"
        @on-display-click="onDisplayClick"
        @close-patch="hideProbeBatch"
        @delete-node="handleDeleteNode"
        @node-moved="getNodeLinkStatusList"
        @update-node-data="handleUpdateNodeData"
        @update-node-data-edit="handleUpdateNodeDataEdit"
      ></topology-stage>
      <!--底部-->
      <node-limit-tip
        v-if="
          (status == 'display' && showLabel) ||
          (status != 'display' &&
            shareSceneStoreState.basicConfig.showNodeLimitTip)
        "
        :text="
          $tt('stage.sceneSupportNodesCount', { count: shareState.maxCount })
        "
        icon="icon-tishi"
        type="bottom"
        color="var(--green-color)"
      ></node-limit-tip>
      <input
        ref="inputfile"
        v-on:change="importFile"
        type="file"
        accept="application/json"
        :multiple="false"
        style="display: none"
        @click="importFile"
      />
    </div>
    <!--遮罩区和进度条-->
    <mask-layer
      v-bind="$props"
      @onSceneStart="startScene"
      :progress-message="progressMessage"
      :progress-localize="progressLocalize"
      :stage-progress="stageProgress"
      :event="eventComputed"
      :event_status="eventStatusComputed"
      :use-new-progress="useNewProgress"
    >
      <!-- 进度条内部的按钮组 -->
      <template v-slot:custom-btn>
        <custom-btn
          :config="btnConfig"
          :status="customStatus"
          :disabled="customDisabled"
          :event_status="eventStatusComputed"
          :event="eventComputed"
          @close="handleClose"
          @recover="handleRecover"
          @changeStatus="customChangeStatus"
          @on-actual-size="handleActualSize"
          @on-update-topology="handleUpdate"
        ></custom-btn>
      </template>
    </mask-layer>
    <!--按钮区 需要启动成功后展示-->
    <div v-if="showBtn && progressComputed" class="btn-group">
      <custom-btn
        :config="btnConfig"
        :status="customStatus"
        :disabled="customDisabled"
        :event_status="eventStatusComputed"
        :event="eventComputed"
        @close="handleClose"
        @recover="handleRecover"
        @changeStatus="customChangeStatus"
        @on-actual-size="handleActualSize"
        @on-update-topology="handleUpdate"
      ></custom-btn>
    </div>
    <!-- 创建模板弹窗 -->
    <create-template
      ref="createTemplate"
      @createTemplate="createTemplate"
    ></create-template>
    <!--批量编排按钮-->
    <probe-batch-btn
      v-if="showProbe"
      :show-title="showTitle"
      @click="handleProbeBatch"
    ></probe-batch-btn>
  </div>
</template>

<script>
import { TopologyStage, TopologyToolbar } from './topology/index.ts';
import menus from './menus';
import DrawerDistribute from './drawer/index.vue';
import NodeLimitTip from './external/node-limit-tip.vue';
import SceneTitle from './external/scene-title.vue';
import { saveAs } from 'file-saver';
import _ from 'lodash';
import PageStatus from '../store/page-status.ts';
import {
  onMounted,
  provide,
  watch,
  ref,
  nextTick,
  onBeforeMount,
} from '@vue/composition-api';
import CustomBtn from './external/custom-btn';
import CreateTemplate from './dialog/create-template';
import t, { i18n } from '../../utils/i18n';
import ProbeBatchBtn from './dialog/probe-collection/batch/probe-batch-btn';
import ProbeBatch from './dialog/probe-collection/batch/probe-batch';
import {
  getProbeSystemType,
  setMaxNodeCount,
  uploadScreenshot,
  getLinkStatus,
  setCommonProbes,
  setDynamics,
  createTemplateLayer,
  createTemplateOld,
  setModel3DData,
} from '../../api';
import { ListenDomChange } from '@cyber/ui';
import sceneStore from '../../store/scene-store';
import { x6ToExternal } from '../../utils/data-conversion/scene-to-external/x6-to-external';
import MaskLayer from './mask';
import {handleProbeByMenuIndex, setNodeEditedIcon} from "../../utils/dialog/probe";
import {
  setAllNodeOpacity,
  setEdgeColor,
  setNodeAttrs,
  setNodeOpacity,
  updateLevelAssetAndVisibleStoreData
} from "../../utils/common";
import {handleFlowByMenuIndex, setNodeFlowEditedIcon} from "../../utils/dialog/flow";
import { MENU_ENUM } from "../../types/menu";

export default {
  components: {
    TopologyToolbar,
    TopologyStage,
    menus,
    DrawerDistribute,
    NodeLimitTip,
    SceneTitle,
    CustomBtn,
    CreateTemplate,
    ProbeBatchBtn,
    ProbeBatch,
    MaskLayer,
    // NodeDataView,
  },
  name: 'index',
  props: {
    /**
     * 场景配置数据
     * 包含：
     *  menubar: 左侧菜单配置，不配置默认显示全部，当前包含配置菜单为前五个['topology','probe','flow','assets','war',]
     *  toolbar：右下角辅助功能配置['fullScreen','positive','negative','restore','help']分别对应；全屏、放大、缩小、居中还原，帮助
     *  toolMenuBar：左下角辅助功能配置['screenshot', 'importConfiguration','exportConfiguration','createTemplate','basicSetting']
     *               对应：截图、导入配置、导出配置、创建模板、基础设置
     *  targetMenubar: 靶标菜单项配置 ['shortcut','sceneTemplate','operatingSystem','applicationSystem', 'networkEquipment', 'securityEquipment']
     */
    sceneConfig: {
      type: Object,
      default: () => {
        return {
          menubar: [],
          showMenu: true,
          toolbar: [],
          showToolbar: true,
          toolMenuBar: [],
          targetMenubar: [],
        };
      },
    },
    /**
     * 拓扑数据 （接口返回的全部数据）
     */
    topologyData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /**
     * 是否显示遮罩
     */
    showMask: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示启动按钮
     */
    showMaskBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示进度条
     */
    showProgress: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示启动组
     */
    showBtn: {
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
    /**
     * 进度条数据
     *  status: 进度条状态
     *  progressRate： 进度
     *  progressInfo： websocket推送的信息
     */
    progress: {
      type: Object,
      default: () => {
        return {
          status: undefined,
          progressRate: 0,
          progressInfo: '',
        };
      },
    },

    /* 5.4.1新增的阶段进度 */
    stageProgress: {
      type: Object,
      default: () => {
        return {
          stageList: [],
          stageName: '',
          stagePercentage: 0,
        };
      },
    },

    // 是否启用新的进度条
    useNewProgress: {
      type: Boolean,
      default: true,
    },
    /**
     * 场景启动进度条的位置和宽度定位
     * width: 进度条宽度，默认 100%，如 'calc(100% - 600px)'
     * left: 左边偏移量 字符串 如：'70px'
     * bottom: 下边偏移量
     */
    progressLocalize: {
      type: Object,
      default: () => {
        return {
          width: '100%',
          left: '0px',
          bottom: '0px',
        };
      },
    },
    /**
     * 是否下载截图
     * 默认下载
     */
    downloadImage: {
      type: Boolean,
      default: true,
    },
    /**
     * 编辑状态还是展示状态 edit || display || update
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
    /**
     * 左上角标题内容
     */
    title: {
      type: String,
      default: '',
    },
    /**
     * 右下方节点数量限制提示
     */
    showLabel: {
      type: Boolean,
      default: true,
    },
    /**
     * 左上角标题
     */
    showTitle: {
      type: Boolean,
      default: true,
    },
    /**
     * 节点是否显示重启重建开关机
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
     * 角色资产是否显示"新增角色"的按钮
     */
    showActionRole: {
      type: Boolean,
      default: true,
    },
    /**
     * 控制展示隐藏接入登录
     */
    showAccessFunc: {
      type: Function,
      default: () => true,
    },
    /**
     * 控制展示隐藏接入弹窗的空闲（未连线）端口
     */
    hideUselessPortInAccessDialog: {
      type: Boolean,
      default: false,
    },
    /**
     * 场景id
     */
    mpSceneId: {
      type: String,
      default: '',
    },
    /**
     * 用于控制是否轮询场景边和节点的连通状态
     */
    nodeLinkConnectivityStatus: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否展示保存快照按钮
     */
    showSnapShotBtn: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否展示历史版本按钮
     */
    showSnapshotHistoryBtn: {
      type: Boolean,
      default: false,
    },
    // 场景启动时ws推送的节点消息数据
    wsData: {
      type: Object,
      default: () => ({}),
    },
    // 是否开启监听topologyData
    openWatchTopologyData: {
      type: Boolean,
      default: false,
    },
    // 是否自动居中画布元素
    centerContent: {
      type: Boolean,
      default: false,
    },
    // 是否绘制ws推送的新节点
    drawWsNewNode: {
      type: Boolean,
      default: false,
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
    // 外部自定义缩放比
    graphZoom: {
      type: String | Number,
      default: 1,
    },
    // 场景中未启动的节点是否显示启动按钮
    allowStart: {
      type: Boolean,
      default: true,
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
    // 容器高度，用于可视区渲染
    wrapperHeight: {
      type: Number,
      default: 800,
    },
    // 是否开启分层编辑
    openLayer: {
      type: Boolean,
      default: false,
    },
    // 场景ID，主要用于分层拓扑数据获取
    sceneConfigId: {
      type: String,
      default: '',
    },
    // 针对分层节点，进入新层后，上层节点如果没有位置需要自动居中排列布局，自动布局时左侧和上方的间距支持配置
    upperNodeLocalize: {
      type: Object,
      default: () => {
        return {
          marginLeft: 200,
          marginTop: 100,
        };
      },
    },
    /**
     * 针对分层节点，层级面包屑位置支持配置,display模式下生效
     * left: 左边偏移量 字符串 如：'70px'
     * top: 下边偏移量
     */
    breadcrumbLocalize: {
      type: Object,
      default: () => {
        return {
          top: '25px',
          left: '380px',
        };
      },
    },
    // 角色资产显示红队、蓝队，默认空数组即两个都可配置；例：['red'] 可配置红队，不可配置蓝队
    roleShowConfig: {
      type: Array,
      default: () => {
        return [];
      },
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
    // 角色资产和战争迷雾数据
    roles: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * 是否正在执行同步操作
     * 当编辑器内部在执行一些同步操作的时候，该值会变化，可以通过该属性对业务页面做一些交互限制
     * 当前支持监听操作：创建模板、拖拽模板
     */
    syncProcessing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    let shareState = ref(PageStatus.state);
    let shareSceneStoreState = ref(sceneStore.state);
    let centerPoint = ref({ x: 0, y: 0 }); // 画布中心点
    let refTopologyStage = ref(null);
    let active = ref(0);
    let showToolbar = ref(true);
    let showProbe = ref(false);
    // 仅用于角色资产配置、不涉及其他
    let currentRoleAssets = ref([]); // 当前角色资产配置的数据
    let nodeDataView = ref({}); // 节点数据展示
    let customStatus = ref(false); // 禁用状态
    let showProbeBatch = ref(false);
    let showStage = ref(true);
    let showStageData = ref(null);
    let startSceneSuccess = ref(false);
    let nodeLinkStatusTimer = ref(null);
    let showImportTemplate = ref(false);
    let sceneConfigIdComputed = ref(''); // 拓扑分层需要的场景id
    // let syncRequest = new AbortController(); // 用于缓存创建模板请求
    let isCreatingTemplate = ref(false); // 正在创建模板
    const listenFunc = () => {
      const className = document.body.className;
      if (className.indexOf('theme-dark') != -1) {
        PageStatus.setTheme('dark');
      } else {
        PageStatus.setTheme('light');
      }
    };
    let listen = new ListenDomChange({
      dom: document.body,
      callback: listenFunc,
    });
    provide('lang', i18n.lang);

    PageStatus.setMenubar(props.sceneConfig.menubar);
    PageStatus.setShowMenu(props.sceneConfig.showMenu);
    PageStatus.setAllowStart(props.allowStart);
    PageStatus.setOpenLayer(props.openLayer);
    setMaxNodeCount();
    setModel3DData();
    setDynamics();
    onBeforeMount(async () => {
      await setCommonProbes();
    });

    const className = document.body.className;
    if (className.indexOf('theme-dark') !== -1) {
      PageStatus.setTheme('dark');
    } else {
      PageStatus.setTheme('light');
    }
    /**
     * 获取画布中心点
     * @returns {{x: number, y: number}}
     */
    const getCenter = () => {
      const currentNode = document.querySelector('.scene-all');
      const parentNode = currentNode?.parentNode;
      // @ts-ignore
      const clientHeight = parentNode?.clientHeight
        ? parentNode?.clientHeight
        : 0;
      // @ts-ignore
      const clientWidth = parentNode?.clientWidth ? parentNode?.clientWidth : 0;
      return { x: clientWidth / 2, y: clientHeight / 2 };
    };
    onMounted(() => {
      let firstPaint = true;
      centerPoint.value = getCenter();
      PageStatus.setDrawer(false);
      // 获取操作系统类型
      if (!Object.keys(shareState.value.systemType).length) {
        getProbeSystemType();
      }
      watch(
        () => props.topologyData,
        (val) => {
          nextTick(() => {
            if (props.openWatchTopologyData) {
              val &&
                Object.keys(val).length &&
                refTopologyStage.value.importFromJSON(val, centerPoint.value);
            } else {
              if (val && firstPaint) {
                if (props.openLayer) {
                  PageStatus.setCurrentTreeLevelId(val?.scene_config?.topology?.area_id || '');
                  sceneConfigIdComputed.value = props.sceneConfigId; // 拓扑分层需要的场景id
                }
                refTopologyStage.value.importFromJSON(val, centerPoint.value, props.sceneConfigId);
              }
              firstPaint = !val || !Object.keys(val).length;
            }
          });
        },
        { deep: true, immediate: true },
      );
      watch(() => props.roles,
        (val) => {
          sceneStore.resetAssets(val);
        },
        { deep: true, immediate: true },
      );
    });

    return {
      shareState,
      centerPoint,
      refTopologyStage,
      shareSceneStoreState,
      active,
      showToolbar,
      showProbe,
      currentRoleAssets,
      nodeDataView,
      customStatus,
      showProbeBatch,
      showStage,
      showStageData,
      startSceneSuccess,
      nodeLinkStatusTimer,
      listen,
      showImportTemplate,
      sceneConfigIdComputed,
      // syncRequest,
      isCreatingTemplate,
    };
  },
  computed: {
    progressMessage() {
      return _.get(
        this.topologyData,
        'scene_config.topology.scene.process_message',
        '',
      );
    },
    topologySceneClass() {
      return (
        'topology-scene-' +
        _.get(this.topologyData, 'scene_config.topology.scene.eid', '')
      );
    },
    customDisabled: {
      get: function () {
        // 除了 状态成功，其他状态禁用
        const event_status =
          _.get(
            this.topologyData,
            'scene_config.topology.scene.event_status',
            0,
          ) === 4;
        return !event_status;
      },
      set: function (val) {
        this.customDisabled = val;
      },
    },
    sceneEid() {
      return _.get(this.topologyData, 'scene_config.topology.scene.eid', '');
    },
    eventComputed() {
      return _.get(this.topologyData, 'scene_config.topology.scene.event', 0);
    },
    eventStatusComputed() {
      return _.get(
        this.topologyData,
        'scene_config.topology.scene.event_status',
        0,
      );
    },
    // 计算是否在按钮区显示关闭场景等按钮组
    progressComputed() {
      // 添加条件：业务中配置不使用新的进度条，或者业务中配置使用新的进度条但是场景启动成功(如场景启动失败，则在mask组件中显示按钮组)
      return (
        (this.useNewProgress &&
          !(this.eventStatusComputed == 5 && this.eventComputed == 2)) ||
        !this.useNewProgress
      );
    },
    syncProcessingComputed: {
      get: function () {
        return this.syncProcessing;
      },
      set: function (val) {
        this.$emit('update:syncProcessing', val);
      },
    }
  },
  watch: {
    active(newVal, oldVal) {
      if (oldVal === 3 || oldVal === 4) {
        this.quitEditStatus();
      }
    },
    'topologyData.scene_config.topology.scene.event': {
      handler(val) {
        this.customStatus =
          _.get(this.topologyData, 'scene_config.topology.scene.event', 0) !==
          6;
        let event_status = _.get(
          this.topologyData,
          'scene_config.topology.scene.event_status',
          0,
        );
        if (
          (val === 2 && event_status === 4) ||
          (val === 10 && event_status === 4)
        ) {
          this.startSceneSuccess = true;
        } else {
          this.resetGraphStatus();
        }
      },
      immediate: true,
      deep: true,
    },
    'topologyData.scene_config.topology.scene.event_status': {
      handler(val) {
        let event = _.get(
          this.topologyData,
          'scene_config.topology.scene.event',
          0,
        );
        if (event === 2 && val === 4) {
          this.startSceneSuccess = true;
        }
        if (event === 10 && val === 4) {
          this.startSceneSuccess = true;
        }
      },
      immediate: true,
      deep: true,
    },
    startSceneSuccess: {
      handler(newVal) {
        if (newVal && this.mpSceneId && this.nodeLinkConnectivityStatus && this.status === 'display') {
          this.getNodeLinkStatusList();
          this.nodeLinkStatusTimer = setInterval(
            this.getNodeLinkStatusList,
            5000,
          );
        }
      },
      immediate: true,
      deep: true,
    },
    wsData: {
      handler(newVal, oldVal) {
        if (
          newVal &&
          newVal.hasOwnProperty('scene_element') &&
          newVal.scene_element.id
        ) {
          this.repaintWsNode(newVal);
        }
        if (newVal && newVal.cscene_id) {
          this.sceneConfigIdComputed = newVal.cscene_id;
        }
      },
      deep: true,
      immediate: false,
    },
    status: {
      handler(newVal, oldVal) {
        sceneStore.setSceneStatus(newVal);
        if (newVal !== 'display') {
          this.nodeLinkStatusTimer && clearInterval(this.nodeLinkStatusTimer);
          this.nodeLinkStatusTimer = null;
        }
        if (newVal === 'update' && oldVal === 'display') {
          // 清除节点和连线的状态图标
          this.refTopologyStage.resetCellStatus();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    $tt: t,
    // 更新ws推送节点的状态和业务数据
    repaintWsNode(val) {
      this.refTopologyStage.updateNodeStatus(val);
    },
    /**
     * 轮询节点状态
     */
    getNodeLinkStatusList() {
      if (this.status === 'display') {
        let event = _.get(
          this.topologyData,
          'scene_config.topology.scene.event',
          0,
        );
        let event_status = _.get(
          this.topologyData,
          'scene_config.topology.scene.event_status',
          0,
        );
        if (
          !this.mpSceneId ||
          !(
            (event === 2 && event_status === 4) ||
            (event === 10 && event_status === 4)
          )
        )
          return;
        getLinkStatus({ id: this.mpSceneId }).then((res) => {
          // 监听重绘
          res?.data?.data?.node_link_status_list?.forEach((node) => {
            let alpha = node.status ? 1 : 0.4;
            setNodeOpacity({ id: node.node_id }, alpha);
            node?.connection_status_list?.forEach((connection) => {
              let color = connection.status ? '#a9aeb6' : 'var(--red-color-8)';
              setEdgeColor(connection.connection_id, color);
            });
          });
        });
      }
    },
    /**
     * 实际大小
     */
    handleActualSize() {
      this.refTopologyStage.scaleTopology('restore');
    },
    /**
     * 创建模板
     */
    createTemplate(templateData) {
      this.isCreatingTemplate = true;
      this.$emit('update:syncProcessing', true);
      // 获取截图，存储。用于创建模板接口的logo字段
      this.refTopologyStage.getScreenShotDataUri().then((res) => {
        const file = new File([res], 'file.png', { type: 'png' });
        const formData = new FormData();
        formData.append('file', file);
        uploadScreenshot(formData).then((childRes) => {
          this.createModel(
            _.get(childRes, 'data.data.http_url', ''),
            templateData,
          );
        });
      });
    },
    /**
     * 自定义按钮change事件
     */
    customChangeStatus(status) {
      this.customStatus = status;
    },
    /**
     * 菜单点击
     * @param index
     */
    handleLabel(index) {
      this.showProbe =
        (this.active == MENU_ENUM['probe'] &&
          [
            MENU_ENUM['probe'],
            MENU_ENUM['screenshot'],
            MENU_ENUM['importConfiguration'],
            MENU_ENUM['exportConfiguration'],
            MENU_ENUM['createTemplate'],
            MENU_ENUM['basicSetting'],
          ].includes(index)) ||
        index == MENU_ENUM['probe'];
      this.showToolbar = true;
      // 截图
      if (index === MENU_ENUM['screenshot']) {
        // 是否下载截图 支持传递一个参数downloadImage：是否下载截图
        this.refTopologyStage.getScreenShot();
      }
      // 导入配置
      if (index === MENU_ENUM['importConfiguration']) {
        if (this.openLayer) {
          this.saveTopologyData(false, true).then(() => {
            this.showImportTemplate = true;
          });
        } else {
          this.$refs.inputfile.click();
        }
      }
      // 导出配置
      if (index === MENU_ENUM['exportConfiguration']) {
        if (this.openLayer) {
          this.exportFile();
        } else {
          let topologyData = this.getTopologyData();
          let data = x6ToExternal(topologyData);
          let blob = new Blob([JSON.stringify(data)], {
            type: 'application/json',
          });
          saveAs(blob, `${this.title || 'config'}.json`);
        }
      }
      // 创建模板
      if (index === MENU_ENUM['createTemplate']) {
        this.$refs.createTemplate.handleOpen();
      }
      /**
       * 数据采集
       * 不支持cloud-init的节点和没有系统信息的节点做置灰处理
       * 数据采集弹窗新增开关按钮，默认关闭
       * 配置过的节点新增勾选图标状态标记
       */
      if (this.showProbe) {
        handleProbeByMenuIndex();
      } else {
        // 非数据采集模式将节点置亮
        setAllNodeOpacity(1, true);
      }
      /**
       * 流量发生
       * 配置过的节点新增勾选图标状态标记
       */
      if (index == MENU_ENUM['flow']) {
        handleFlowByMenuIndex();
      }
      PageStatus.setRoleAssets(false);
      this.refTopologyStage.setGraphInteractive(true);
      this.refTopologyStage.setNodeCircleStatus();
      this.refTopologyStage.nodeHidden(`node-click-menu-${this.sceneEid}`);
    },



    /**
     * 弹窗关闭
     */
    drawClose() {
      this.showToolbar = true;
      setAllNodeOpacity(1.0);
    },

    /**
     * 角色资产配置功能
     * @param config 单个角色
     */
    ...{
      /**
       * 退出编辑状态, 编辑状态就是角色资产缩小选择节点的状态
       */
      quitEditStatus() {
        sceneStore.setCurrentAssets({});
        setAllNodeOpacity(1.0);
        // 配置之后将资产分配状态 置为 false, 弹窗置为true 并将全局遮罩替掉
        PageStatus.setRoleAssets(false);
        PageStatus.setDialog(true);
      },

      /**
       * 角色资产配置
       * @param data
       * @param type
       */
      assetAllocation(data, type) {
        this.currentRoleAssets = data[type]; // 当前配置的角色资产
        PageStatus.setRoleAssets(true);
        PageStatus.setDialog(false);
        const graph = sceneStore.state.graph;
        const cells = graph.getCells();
        // 所有节点置灰(层节点支持双击)
        cells.forEach((cell) => {
          if (cell.shape === 'rect') {
            setNodeAttrs(cell, 0.5);
          }
        });
        // 角色资产中已有节点重新置亮
        if (this.currentRoleAssets.length) {
          for (let i = 0; i < cells.length; i++) {
            if (cells[i].shape === 'rect') {
              for (let k = 0; k < this.currentRoleAssets.length; k++) {
                if (this.currentRoleAssets[k].id === cells[i].id) {
                  setNodeAttrs(cells[i], 1.0);
                  break;
                }
              }
            }
          }
        }
      },

      /**
       * 点击之后配置角色资产
       * @param nodeInfo 节点
       */
      handleRoleAssets(nodeInfo) {
        if (
          _.find(this.currentRoleAssets, function (o) {
            return o.id === nodeInfo.id;
          })
        ) {
          this.currentRoleAssets.splice(
            this.currentRoleAssets.findIndex((item) => {
              return item.id === nodeInfo.id;
            }),
            1,
          );
          setNodeOpacity(nodeInfo, 0.5);
        } else {
          const category = nodeInfo.shape === 'image' ? 5 :  _.get(nodeInfo, 'data.basicConfig.category');
          this.currentRoleAssets.push({ id: nodeInfo.id, category });
          setNodeOpacity(nodeInfo, 1.0);
        }
        updateLevelAssetAndVisibleStoreData(this.currentRoleAssets);
        this.$emit('update:roles', sceneStore.state.assets);
      },
    },
    /**
     * 导入配置
     */
    importFile() {
      this.$refs.inputfile.onchange = (e) => {
        const files = _.get(e, 'target.files', []);
        if (_.isEmpty(files)) {
          return;
        }
        let reader = new FileReader();
        reader.readAsText(files[0]);
        //  文件加载完成
        reader.onload = (ev) => {
          // 判断是否超出节点数
          const { elements: addNodes = [], areas: addAreas = [] } = JSON.parse(ev.target.result)
            ?.scene_config?.topology;
          if (!this.openLayer && addAreas?.some(item => item.type == 1)) {
            this.$message.info(this.$tt('stage.unSupportLayerImport'));
            return;
          }
          if (addNodes.length <= PageStatus.state.maxCount) {
            // 清除外部数据
            this.refTopologyStage.importFromJSON(
              JSON.parse(ev.target.result),
              this.centerPoint,
            );
            this.resetGraphStatus();
          } else {
            this.$message.error(
              this.$tt('stage.supportFileNodeLimit', {
                maxCount: PageStatus.state.maxCount,
                addCount: addNodes.length,
              }),
            );
          }
        };
        this.$refs.inputfile.value = '';
      };
    },
    /**
     * 场景启动
     */
    startScene() {
      this.$emit('onSceneStart', this.topologyData.id);
      this.$emit('on-scene-start', this.topologyData.id);
    },
    /**
     * 聚合数据
     */
    getData() {
      let topologyData = this.getTopologyData();
      return x6ToExternal(topologyData, this.sceneConfigIdComputed, PageStatus.state.currentTreeLevelId);
    },
    // 触发单节点配置弹窗
    configureTheNode(id) {
      this.resetGraphStatus();
      this.refTopologyStage?.nodeConfigDialog(id);
    },
    // 根据节点id选中某个节点
    selectNodeById(id, showAccess) {
      this.refTopologyStage?.selectTheNode(id, showAccess);
    },
    // 支持从外部设置接入面板
    showAccessPanel(nodeId) {
      this.refTopologyStage?.showTheNodeAccessPanel(nodeId);
    },
    // 删除画布节点
    deleteNodeById(id) {
      this.handleDeleteNode(id);
      this.refTopologyStage?.removeCell(id);
    },
    getTopologyData() {
      return this.refTopologyStage.getTopologyData();
    },
    // 重置编辑器交互
    resetInteractive() {
      this.refTopologyStage.setGraphInteractive(true);
    },
    /**
     * 监听窗口变动重置画布大小
     */
    resizeScene() {
      this.refTopologyStage.resizeScene();
    },
    /**
     * 重置画布缩放比例
     */
    resizeZoom() {
      this.refTopologyStage.resizeZoom();
    },
    /**
     * 画布居中
     */
    graphToCenter() {
      this.refTopologyStage.graphToCenter();
    },

    /**
     * 设置编辑器主题
     */
    setTheme(theme) {
      PageStatus.setTheme(theme);
    },
    /**
     * 抛出截图的数据流
     */
    handleScreenShot(val) {
      this.$emit('onScreenShot', val);
      this.$emit('on-screen-shot', val);
    },

    // 删除节点，处理角色资产数据
    handleDeleteNode(nodeId) {
      sceneStore.state.assets?.forEach((team) => {
        team?.children?.forEach((child, index) => {
          let asset_nodes_index = child?.asset_nodes.findIndex((item) => {
            return item.id === nodeId;
          });
          let visible_nodes_index = child?.visible_nodes.findIndex((item) => {
            return item.id === nodeId;
          });
          if (asset_nodes_index >= 0) {
            child.asset_nodes?.splice(asset_nodes_index, 1);
          }
          if (visible_nodes_index >= 0) {
            child.visible_nodes?.splice(visible_nodes_index, 1);
          }
        });
      });
      this.$emit('update:roles', sceneStore.state.assets);
      let deepAssets = _.cloneDeep(sceneStore.state.assets);
      sceneStore.resetAssets(deepAssets);
    },

    /**
     * 删除节点事件抛出
     */
    handleDeletedNodes(nodes) {
      if (nodes.length) {
        this.$emit('on-deleted-nodes', nodes);
      }
    },
    /**
     * 新增节点事件抛出
     */
    handleAddedNodes(nodes) {
      if (nodes.length) {
        this.$emit('on-added-nodes', nodes);
      }
    },
    /**
     * 节点变化通知事件
     */
    handleChangeNodes() {
      this.$emit('on-change-nodes');
    },
    /**
     * 获取场景截图数据流
     */
    getScreenShot(fileType) {
      if (fileType === 'base64') {
        return new Promise((resolve, reject) => {
          this.refTopologyStage.getScreenShotDataUri(true).then((res) => {
            const reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        });
      } else {
        return new Promise((resolve) => {
          this.refTopologyStage.getScreenShotDataUri().then((res) => {
            resolve(res);
          });
        });
      }
    },
    /**
     * 创建模板
     */
    createModel(imagePath, templateData) {
      if (this.openLayer) {
        this.createModelOpenLayer(imagePath, templateData);
      } else {
        let topologyData = this.refTopologyStage.getTopologyData();
        let params = x6ToExternal(topologyData);
        // 摘掉角色里的id
        delete params.id;
        delete params.roles;
        params.type = 1;
        params.logo = imagePath;
        _.set(params, 'scene_config.topology.scene', {
          name: templateData.templateName,
          description: templateData.templateDescribe,
        });
        createTemplateOld(params)
          .then((res) => {
            if (res.status) {
              this.$message.success(this.$tt('stage.createSuccess'));
            }
          })
          .catch(() => {
            this.$message.error(this.$tt('stage.createFailed'));
          });
      }
    },

    createModelOpenLayer(imagePath, templateData) {
      this.saveTopologyData(false, false, 'createTemplate').then(() => {
        let params = {
          name: templateData.templateName,
          description: templateData.templateDescribe,
          id: this.sceneConfigIdComputed,
          logo: imagePath,
        }
        // let signal = this.syncRequest.signal;
        createTemplateLayer(params, { intercept: true })
          .then((res) => {
            if (res.status) {
              this.isCreatingTemplate = false;
              this.$emit('update:syncProcessing', false);
              this.$message.success(this.$tt('stage.createSuccess'));
            }
          })
          .catch(() => {
            this.$message.error(this.$tt('stage.createFailed'));
          });
      }).catch(() => {
        this.isCreatingTemplate = false;
        this.$emit('update:syncProcessing', false);
      });;
    },

    // 清空弹窗和节点选中状态
    resetGraphStatus() {
      this.refTopologyStage?.nodeHidden(`node-popover-${this.sceneEid}`);
      this.refTopologyStage?.nodeHidden('node-tooltip');
      this.refTopologyStage?.resetSelection();
    },

    /**
     * 接入方式
     * 抛出 path
     */
    handleAccess(
      connectUrl,
      access_modes,
      nodeId,
      image_type,
      nodeName,
      jump_type,
       vendor,
      type
    ) {
      this.$emit(
        'onAccess',
        connectUrl,
        access_modes,
        nodeId,
        image_type,
        nodeName,
        jump_type,
           vendor,
          type
      );
      this.$emit(
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
    },
    /**
     * 场景关闭
     */
    handleClose() {
      this.resetGraphStatus();
      this.$emit('close');
    },
    /**
     * 场景挂起、恢复
     */
    handleRecover(status) {
      this.resetGraphStatus();
      this.$emit('recover', status);
    },
    /**
     * 节点重启
     */
    onNodeRestart(data) {
      this.$emit('on-node-restart', data);
    },
    /**
     * 节点重建
     */
    onNodeRebuild(data) {
      this.$emit('on-node-rebuild', data);
    },
    /**
     * 节点关机
     */
    onNodeShutDown(data) {
      this.$emit('on-node-shutdown', data);
    },
    /**
     * 节点开机
     */
    onNodeShutUp(data) {
      this.$emit('on-node-shutup', data);
    },
    /**
     * 节点启动
     */
    onNodeStart(data) {
      this.$emit('on-node-start', data);
    },
    /**
     * 快照到靶标
     */
    onNodeSnapshot(data) {
      this.$emit('on-node-snapshot', data);
    },
    /**
     * 历史版本按钮
     */
    onSnapshotHistory(data) {
      this.$emit('on-node-snapshot-history', data);
    },
    /**
     * 更新拓扑
     */
    handleUpdate() {
      this.resetGraphStatus();
      this.$emit('on-update-topology');
    },
    /**
     * 场景实例更新-更新节点
     */
    handleUpdateNodeData(data) {
      this.$emit('on-update-node-data', data);
    },
    /**
     * 场景编辑时-更新节点的配置表单数据
     */
    handleUpdateNodeDataEdit(data) {
      // 数据采集
      if (this.showProbe) {
        setNodeEditedIcon(data, true);
      }
      // 流量发生
      if (this.active == 2) {
        setNodeFlowEditedIcon(data, true);
      }
    },
    /**
     * 抛出展示状态下节点点击事件
     */
    onDisplayClick(nodeInfo) {
      this.$emit('on-display-click', nodeInfo);
    },
    handleProbeBatch() {
      this.showProbeBatch = true;
    },
    hideProbeBatch() {
      this.showProbeBatch = false;
    },
    // 保存场景拓扑
    saveTopologyData(showMessage, withoutCheck, type) {
      return this.refTopologyStage.saveTopologyData(showMessage, withoutCheck, type);
    },
    // 导出配置
    exportFile(path, done) {
      let fileName = (this.title || 'config') + '.json';
      this.saveTopologyData(false, false, 'export').then(() => {
        this.$request.binaryDownload(
          'get',
          '/cscene/cscenes/export_file',
          { id: this.sceneConfigIdComputed },
          { baseURL: '/api/mp', filename: fileName },
        );
      });
    },
    handleNextLevel(levelId) {
      this.$emit('on-next-level', levelId);
    },
  },
  async mounted() {
    this.listen?.createListen();
    if (this.openLayer) {
      if (!this.sceneConfigId && sceneStore.state.sceneStatus !== 'display') {
        sceneStore.state.importSceneId = '';
        let saveData = await this.saveTopologyData();
        this.sceneConfigIdComputed = saveData?.data?.data?.id;
      }
    }
  },
  beforeDestroy() {
    // this.syncRequest?.abort();
    this.listen?.destroyListen();
    this.nodeLinkStatusTimer && clearInterval(this.nodeLinkStatusTimer);
    this.nodeLinkStatusTimer = null;
  },
};
</script>

<style lang="scss" scoped>
.scene-all {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;

  .btn-group {
    position: absolute;
    margin-top: -50px;
    margin-left: 20px;
    display: flex;
  }
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    /* overflow-x: hidden; */
    overflow: hidden;
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: rgba(0, 0, 0, 0);
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(#7988a6, 0.3);
    }
  }
}
</style>
