<template>
  <div class="single-train-detail">
    <!-- 顶部标题 -->
    <train-top-title
      :detail-title="detailTitle"
      @back="backHome"
    >
    </train-top-title>

    <!-- 编辑器 -->
    <div class="topology">
      <scene-editor
        v-if="refresh"
        :class="{ 'update-scene': sceneStatus === 'update' }"
        ref="sceneEditor"
        :sceneConfig="sceneConfig"
        :topologyData="sceneData"
        :show-mask="showMask"
        :progress="progress"
        :progress-localize="progressLocalize"
        :breadcrumb-localize="breadcrumbLocalize"
        :stage-progress="stageProgress"
        :show-label="false"
        :show-title="false"
        :allow-dialog="false"
        :status="sceneStatus"
        :show-btn="showBtn"
        :show-mask-btn="showMaskBtn"
        :show-progress="showProgress"
        :btn-config="btnGroupConfig"
        :draw-ws-new-node="false"
        :open-layer="true"
        :sceneConfigId="sceneConfigId"
        @onSceneStart="handleSceneStart"
        @onAccess="openTap"
        @close="handleClosed"
        @on-node-restart="nodeRestart"
        @on-node-rebuild="nodeRecreate"
        @on-node-shutdown="(data) => onNodeShutDown(data, sceneId)"
        @on-node-shutup="(data) => onNodeShutUp(data, sceneId)"
        @on-update-topology="updateTopology"
        :mp-scene-id="sceneId"
        :show-snap-shot-btn="false"
        :ws-data="wsData"
        @on-update-node-data="handleUpdateNodeData"
        @on-deleted-nodes="handleDeleteNode"
        :node-link-connectivity-status="true"
      >
      </scene-editor>
      <div
        v-if="sceneStatus === 'update'"
        class="bottom-btn-wrapper"
      >
        <cb-button-group space="middle">
          <cb-button
            button-type="confirm"
            mr
            @click="submitTopology"
          >
          </cb-button>
          <cb-button
            button-type="cancel"
            @click="toBack(true)"
          > </cb-button>
        </cb-button-group>
      </div>
    </div>
    <!-- 时间轴 -->
    <div
      class="bottom-timeline"
      v-show="sceneStatus != 'update'"
    >
      <time-line :scale-times="scaleTimes" />
    </div>
    <!-- 主体部分 -->
    <div class="main-detail-content">
      <!-- 左边区域 -->
      <div
        class="left-content common-content-style"
        v-if="sceneStatus != 'update'"
      >
        <!-- 左侧背景 -->
        <train-detail-bg />
        <div class="task-specification cyber-scroll-bar-small">
          <train-detail-title :text="$t('m.taskSpecification')" />
          <div class="task-content">
            <!-- 训练说明 -->
            <mission-statement
              :train-description="trainDescription"
              :nodeNum="nodeNum"
            />
          </div>
          <train-detail-title :text="$t('m.trainRecord')" />
          <div>
            <train-record :train-record="trainList" />
          </div>
        </div>
      </div>
      <!-- 中间区域 -->
      <div class="middle-content common-content-style">
        <!-- 中间区域背景 -->
        <train-middle-bg :avatar="middleData.user_avatar" />
        <div class="person-score-info">
          <div class="person-score-info-left">
            <div class="item border-right">
              <div class="score">{{ middleData.successful }}</div>
              <div class="text">{{ $t('m.success') }}</div>
            </div>
            <div class="item border-right">
              <div class="score">{{ middleData.failed }}</div>
              <div class="text">{{ $t('m.singleFailed') }}</div>
            </div>
            <div class="item">
              <div class="score">
                {{ middleData.finished }}/{{ middleData.mission_count }}
              </div>
              <div class="text">{{ $t('m.progress') }}</div>
            </div>
          </div>
          <div class="person-score-info-middle">
            <div class="item">
              <div
                class="name one-overflow"
                :title="middleData.user_name"
              >
                {{ middleData.user_name }}
              </div>
            </div>
          </div>
          <div class="person-score-info-right">
            <div class="item border-right border-score">
              <div class="score">{{ middleData.score }}</div>
              <div class="text">{{ $t('rbt.scoresTotal') }}</div>
            </div>
            <div class="item">
              <div class="score">{{ getFormatTime(middleData.time_cost) }}</div>
              <div class="text">{{ $t('m.trainTime') }}</div>
            </div>
          </div>
        </div>
        <div
          class="warning-info"
          v-if="!started"
        >
          {{ $t('m.warningInfo') }}
        </div>
      </div>
      <!-- 右边区域 -->
      <div
        class="right-content common-content-style"
        v-if="sceneStatus != 'update'"
      >
        <!-- 右侧背景 -->
        <train-detail-bg type="right" />
        <div class="train-task-detail">
          <train-detail-title
            :text="$t('m.taskMatrix')"
            type="right"
          />
          <train-task
            :resource-id="resource_id"
            :train-task="taskLists"
            :show-submit-btn="show_submit_btn"
            @submit="handleSubmit"
            @update="handleUpdateData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { SceneEditor } from '@cyber/scene';
import TimeLine from './components/time-line.vue';
import MissionStatement from './components/mission-statement.vue';
import TrainRecord from './components/train-record.vue';
import TrainTask from './components/train-task.vue';
import TrainTopTitle from '@/components/student-common-detail/train-top-title/index.vue';
import TrainDetailBg from '@/components/student-common-detail/train-detail-bg/index.vue';
import TrainDetailTitle from '@/components/student-common-detail/train-detail-title/index.vue';
import TrainMiddleBg from '@/components/student-common-detail/train-middle-bg/index.vue';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import { mixins } from '@/mixin';
import {
  getSceneData,
  sceneStart,
  sceneClose,
  nodeRestart,
  nodeRecreate,
  timeLine,
  singleDetail,
  getConnection,
  trainHistory,
  missionMatrix,
} from '@/api/web/single-train';
import { getUserInfo, getSysSettings } from '@cyber/helper';
import {
  deleteNodeDynamic,
  updateNodeDynamic,
  updateTopologyDynamic,
} from '../../../api/scene/scene';
import { getCurrentModuleByRouterName } from '../../../utils';
export default {
  mixins: [mixins],
  components: {
    TrainTopTitle,
    SceneEditor,
    TimeLine,
    MissionStatement,
    TrainRecord,
    TrainTask,
    TrainDetailBg,
    TrainDetailTitle,
    TrainMiddleBg,
  },
  data() {
    return {
      nodeNum: 0,
      refresh: true,
      sceneStatus: 'display',
      resource_id: '',
      middleData: {},
      timer: null, // 自动计时
      started: true,
      cookie: '',
      scene_name: '', // 场景名称
      detailTitle: '',
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        // toolbar: ['restore'],
        // showToolbar: true,
        toolbar: [],
        showToolbar: false,
      },

      // 进度条的位置，与css样式中写的值同步
      progressLocalize: {
        width: 'calc(100% - 398px - 398px - 16px - 16px)',
        left: 'calc(398px + 16px)',
        bottom: 'calc(40px + 29px)',
      },
      // 层节点面包屑的位置，与css样式中写的值同步
      breadcrumbLocalize: {
        top: '130px',
        left: 'calc(398px + 16px + 20px)',
      },
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      scene_manager_id: this.$route.params && this.$route.params.resource_id, // 用于通用场景请求
      sceneId: '', // 场景id
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close', 'update-topology'], // 按钮组配置项
      sceneLoading: false, // 场景loading
      wsData: {},
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
        duration_time: '',
      },
      trainDescription: {
        trainType: '',
        duration_time: '',
        trainDifficult: '',
        pre_skill: [],
        train_skill: [],
        description: '',
      },
      // 训练列表
      trainList: [],
      // 任务列表
      taskLists: [],
      show_submit_btn: false,
      sceneConfigId: '',
      pollTimer: null,
    };
  },
  watch: {
    scene_manager_id: {
      handler(nv, ov) {
        if (nv) {
          this.getUserInfo();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this.getUserInfo();
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.handleGetSceneData();
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.pollTimer = setInterval(() => {
      this.handleGetSceneData();
    }, 1000 * 10)
  },
  mounted() {
    getSysSettings().then((res) => {
      document.title = _.get(
        this.$store.state.user,
        'system_setting.system_name',
      );
    });
    // 初始化数据
    this.initData();
    this.getMissionMatrix();
    this.initTimeData();
    this.getTrainRecord();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = null;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        this.bindSceneWs(this.scene_manager_id);
      });
    },
    // 提交任务后更新页面数据
    handleSubmit() {
      this.initData();
      this.getMissionMatrix();
      this.initTimeData();
    },
    // 提交训练后更新页面数据
    handleUpdateData() {
      this.initData();
      this.getMissionMatrix();
      this.initTimeData();
      this.getTrainRecord();
    },
    /**
     * 获取训练记录
     */
    getTrainRecord() {
      trainHistory({ resource_id: this.resource_id }).then((res) => {
        this.trainList = _.get(res, 'data.data', []);
      });
    },
    backHome() {
      this.$router.go(-1);
    },
    deleteCrEvent() { },
    /**
     * 接入方式
     */
    openTap(connection_url, access_modes, nodeId, image_type, nodeName) {
      const { id, protocol, access_ip, access_port, path } = access_modes;
      if (protocol === 'http' || protocol === 'https') {
        let connection_url = '';
        if (!!path) {
          connection_url = `${protocol}://${access_ip}:${access_port}${path}`;
        } else {
          connection_url = `${protocol}://${access_ip}:${access_port}`;
        }

        // window.open(connection_url, '_blank');
        const url = this.$router.resolve({
          name: 'scene-screen-recording',
          query: {
            page: 'single',
            id,
            nodeName,
            image_type,
            protocol,
            connection_url: connection_url,
            resource_id: this.resource_id,
            scene_name: this.scene_name,
            node_id: nodeId,
            scene_id: this.sceneId,
          },
        });
        window.open(url.href, '_blank');
      } else {
        const params = {
          access_mode_id: id,
          context: {
            access_user_id: this.$store.state.user.id,
          },
          id: this.sceneId,
          node_id: nodeId,
        };
        getConnection(params).then((res) => {
          const url = this.$router.resolve({
            name: 'scene-screen-recording',
            query: {
              page: 'single',
              id,
              nodeName,
              image_type,
              protocol,
              resource_id: this.resource_id,
              connection_url: _.get(res, 'data.data.connection_url'),
              node_id: nodeId,
              connection_id: _.get(res, 'data.data.connection_id'),
              scene_id: this.sceneId,
              user_id: this.$store.state.user.id,
              scene_name: this.scene_name,
            },
          });
          window.open(url.href, '_blank');
        });
      }
    },
    bindSceneWs() {
      this.cookie = utils.getCookie('cr_jwttoken');
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.scene_manager_id}_${this.$store.state.user.id}&token=${this.cookie}`,
        {
          '': (data) => {
            const wsData = handleWsData(
              data,
              this.progress,
              this.stageProgress,
              this.sceneData,
            );
            if (data.type === 'scene_element') {
              this.wsData = data.data;
            }
            if (wsData) {
              this.showMask = wsData.showMask;
              this.showMaskBtn = wsData.showMaskBtn;
              this.showProgress = wsData.showProgress;
              this.showBtn = wsData.showBtn;
            }
          },
        },
      );
    },
    /**
     * 获取场景数据
     */
    handleGetSceneData(refresh = false) {
      return new Promise((resolve, reject) => {
        if (_.isEmpty(this.scene_manager_id)) {
          resolve();
        }
        getSceneData({
          resource_id: this.scene_manager_id,
        }).then((res) => {
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = status.showMaskBtn;
          this.showProgress = status.showProgress;
          this.showBtn = status.showBtn;
          this.sceneData = status.sceneData;
          this.progress = status.progress;
          this.stageProgress = status.stageProgress;
          // 场景id
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          this.sceneConfigId = this.sceneId;
          refresh && this.changeTopo();
          resolve();
        });
      });
    },
    /**
     * 场景启动
     */
    handleSceneStart() {
      this.started = true;
      this.refreshProgress();
      // 启动场景
      sceneStart({ resource_id: this.scene_manager_id }).then((res) => {
        this.showMask = true;
        this.showMaskBtn = false;
        this.showProgress = true;
        this.showBtn = false;
        /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
        this.handleGetSceneData();
        this.initTimeData();
        this.initData();
        this.getMissionMatrix();
      });
    },

    /**
     * 场景关闭
     */
    handleClosed() {
      if (this.show_submit_btn) {
        this.$confirm(this.$t('m.confirmDelete'), this.$t('common.info'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        })
          .then(() => {
            if (_.isEmpty(this.scene_manager_id)) {
              return;
            }
            this.refreshProgress();
            sceneClose({
              resource_id: this.scene_manager_id,
            })
              .then((res) => {
                this.showMask = true;
                this.showMaskBtn = true;
                this.showProgress = false;
                this.showBtn = false;
                this.initData();
                this.handleGetSceneData(true);
                this.initTimeData();
                this.getMissionMatrix();
                this.started = false;
              })
              .catch((error) => {
                // this.$message.error(error);
              });
          })
          .catch(() => { });
      } else {
        //单兵提交任务之后关闭场景
        if (_.isEmpty(this.scene_manager_id)) {
          return;
        }
        this.$confirm(
          this.$t('common.closeSceneConfirm') + '？',
          this.$t('common.info'),
          {
            type: 'warning',
          },
        ).then(() => {
          this.refreshProgress();
          sceneClose({
            resource_id: this.scene_manager_id,
          })
            .then((res) => {
              this.showMask = true;
              this.showMaskBtn = true;
              this.showProgress = false;
              this.showBtn = false;
              this.initData();
              this.handleGetSceneData();
              this.getMissionMatrix(); //关闭场景后更新任务矩阵
            })
            .catch((error) => { });
        });
      }
    },

    /**
     * 重启
     */
    nodeRestart(data) {
      const { id } = data;
      nodeRestart({
        node_id: id,
        resource_id: this.scene_manager_id,
      }).then((res) => { });
    },

    /**
     * 重建
     */
    nodeRecreate(data) {
      const { id } = data;
      nodeRecreate({
        node_id: id,
        resource_id: this.scene_manager_id,
      }).then((res) => { });
    },

    /**
     * 初始化数据
     */
    initData() {
      if (this.resource_id) {
        singleDetail({
          resource_id: this.resource_id,
        })
          .then(async (res) => {
            // 获取训练说明的节点数量
            this.nodeNum = res?.data?.data?.event_data?.nodes_count || 0;
            this.sceneConfigData = res.data.data.scene_config_data;
            this.sceneConfigId =
              res?.data?.data?.event_data?.scene_config_data.id;
            this.scene_name = res.data.data.event_data.name;
            this.trainDescription = JSON.parse(
              JSON.stringify(res.data.data.event_data),
            );
            this.scaleTimes.duration_time = this.trainDescription.duration_time;
            this.trainDescription.duration_time =
              res.data.data.event_data.duration_time;
            this.trainDescription.trainType = utils.getValueName(
              this.$CONSTANT.Condition.Category,
              res.data.data.event_data.category,
            );
            this.trainDescription.trainDifficult = utils.getValueName(
              this.$CONSTANT.Condition.Difficult,
              res.data.data.event_data.difficult,
            );
            if (res.data.data && res.data.data.show_submit_btn) {
              this.show_submit_btn = res.data.data.show_submit_btn;
            } else {
              this.show_submit_btn = false;
            }
            this.detailTitle =
              (await getCurrentModuleByRouterName('single-list')) +
              '-' +
              res.data.data.event_data.name;
          })
          .catch(() => { });
      }
    },
    // 单兵获取任务矩阵和训练记录
    getMissionMatrix() {
      missionMatrix({ resource_id: this.resource_id }).then((res) => {
        const data = _.get(res, 'data.data');
        this.middleData = data;
        this.started = data.started;
        this.taskLists = data.matrix;
        // 获取到数据之后根据状态启动定时器
        if (data.running) {
          this.getTimeStart();
        } else {
          clearInterval(this.timer);
          this.timer = null;
        }
      });
    },
    // 获取时间轴数据
    initTimeData() {
      timeLine({ resource_id: this.resource_id })
        .then((res) => {
          if (res.data.data) {
            this.scaleTimes.data = res.data.data.data;
            this.scaleTimes.start_time = res.data.data.start_time;
            this.scaleTimes.end_time = res.data.data.end_time;
          } else {
            this.scaleTimes.data = [];
            this.scaleTimes.start_time = '';
            this.scaleTimes.end_time = '';
          }
        })
        .catch(() => { });
    },
    // 刷新场景
    changeTopo() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
    },
    // 场景启动实例更新
    updateTopology() {
      this.handleGetSceneData().then(() => {
        this.sceneStatus = 'update';
        this.sceneConfig = {
          showMenu: true,
          menubar: ['topology'],
          toolbar: [],
          showToolbar: true,
          toolMenuBar: ['basicSetting'],
          targetMenubar: [
            'operatingSystem',
            'applicationSystem',
            'securityEquipment',
          ],
        };
        this.showBtn = false;
        this.showMaskBtn = false;
        this.showProgress = false;
        this.showMask = false;
      });
    },
    // 保存场景实例更新变动
    submitTopology() {
      this.$confirm(this.$t('crEvent.confirmSceneSaveUpdate'))
        .then(() => {
          let params = {
            mp_scene_id: this.sceneId,
            update_scene: this.$refs.sceneEditor.getData().scene_config,
          };
          updateTopologyDynamic(params).then((res) => {
            this.$message.success(this.$t('crEvent.topoUpdated'));
            this.toBack(true);
          });
        })
        .catch(() => { });
    },
    // 单节点实例更新
    handleUpdateNodeData(data) {
      updateNodeDynamic(data).then((res) => {
        this.sceneStatus === 'display' &&
          this.$message.success(this.$t('common.operateSuccess'));
      });
    },
    // 单节点删除
    handleDeleteNode(data) {
      if (data[0].eid) {
        let params = {
          mp_scene_id: this.sceneId,
          node_id: data[0].id,
        };
        deleteNodeDynamic(params).then((res) => { });
      }
    },
    // 取消返回操作
    toBack(refresh) {
      this.sceneStatus = 'display';
      this.sceneConfig = {
        showMenu: false,
        menubar: [],
        toolbar: [],
        showToolbar: false,
      };
      this.showBtn = true;
      this.handleGetSceneData(refresh);
    },
    // 获取格式化时间
    getFormatTime(second) {
      if (second === null) {
        return;
      }
      const days = Math.floor(second / 86400);
      const hours = Math.floor((second % 86400) / 3600);
      const minutes = Math.floor(((second % 86400) % 3600) / 60);
      const seconds = Math.floor(((second % 86400) % 3600) % 60);
      const getDay = days > 0 ? `${days}${this.$t('m.day')}` : '';
      const getHour = hours > 0 ? `${hours}${this.$t('m.Hour')}` : '';
      const getMinute = minutes > 0 ? `${minutes}${this.$t('m.minute')}` : '';
      const getSecond = `${seconds}${this.$t('m.second')}`;

      const formatTime = `${getDay}${getHour}${getMinute}${getSecond}`;
      return formatTime;
    },
    // 添加定时器计时
    getTimeStart() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = setInterval(() => {
        this.middleData.time_cost++;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.single-train-detail {
  width: 100%;
  height: 100%;
  // position: relative;
  font-size: 14px;

  .topology {
    width: 100%;
    height: calc(100% - 48px);
    position: absolute;
    top: 48px;

    ::v-deep .scene-all.update-scene {
      height: calc(100% - 60px);

      &.fullscreen {
        height: 100%;
      }
    }

    .bottom-btn-wrapper {
      text-align: center;
      margin: 14px 0;
    }
  }

  .bottom-timeline {
    height: 40px;
    width: calc(100% - 32px);
    box-sizing: border-box;
    position: fixed;
    bottom: 30px;
    left: 16px;
  }

  .common-content-style {
    position: absolute;
    height: calc(100% - 200px);
    top: 72px;
  }

  .main-detail-content {

    // position: absolute;
    // top: 72px;
    // left: 16px;
    // width: calc(100% - 32px);
    // height: calc(100% - 200px);
    // display: flex;
    // justify-content: space-between;
    .left-content {
      // position: relative;
      width: 398px;

      left: 16px;

      .task-specification {
        position: absolute;
        top: 20px;
        left: 0;
        padding: 0 16px 16px 16px;
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% + 20px);

        .task-content {
          margin-bottom: 16px;
        }
      }
    }

    .middle-content {
      width: 544px;
      height: 70px;
      z-index: 1;
      // position: relative;
      left: calc(50% - 272px);

      .person-score-info {
        position: absolute;
        top: 40px;
        // left: 8px;
        display: flex;
        // z-index: 9;
        justify-content: space-around;
        width: 544px;

        &-left {
          width: 232px;
          display: flex;
          justify-content: space-around;
        }

        &-middle {
          width: 80px;
        }

        &-right {
          width: 232px;
          display: flex;
          justify-content: space-around;
        }

        .border-right {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            top: 12px;
            margin-right: 10px;
            left: 47px;
            width: 2px;
            height: 14px;
            display: block;
            overflow: hidden;
            background: var(--neutral0);
          }
        }

        .border-score {
          &::after {
            left: 40px;
          }
        }

        .item {
          line-height: 20px;
          text-align: center;

          .name {
            line-height: 48px;
            position: relative;
          }

          .score {
            font-size: 16px;
            color: var(--primary-color);
          }

          .text {
            font-size: 12px;
            color: var(--neutral7);
          }
        }
      }

      .warning-info {
        text-align: center;
        color: var(--orange-color);
      }
    }

    .right-content {
      width: 398px;
      // position: relative;
      right: 16px;

      .train-task-detail {
        width: 100%;
        position: absolute;
        top: 0;
        right: 0;
        padding: 16px;
        height: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
.single-train-detail {
  .topology {
    .scene-all {
      .btn-group {
        position: relative;
        left: 400px;
        bottom: 51px;
        // z-index: 9;
        width: 250px;
      }
    }
  }
}
</style>
