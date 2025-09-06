<template>
  <!--单兵训练-->
  <cb-inner-page :background="false">
    <div class="task-train page">
      <div class="content">
        <div class="topology">
          <scene-editor
            ref="sceneEditor"
            :sceneConfig="sceneConfig"
            :topologyData="sceneData"
            :show-mask="showMask"
            :progress="progress"
            :show-label="false"
            :show-title="false"
            :allow-dialog="false"
            :status="'display'"
            :show-btn="showBtn"
            :show-mask-btn="showMaskBtn"
            :show-progress="showProgress"
            :btn-config="btnGroupConfig"
            @onSceneStart="handleSceneStart"
            @onAccess="openTap"
            @close="handleClosed"
            @on-node-restart="nodeRestart"
            @on-node-rebuild="nodeRecreate"
            :mp-scene-id="sceneId"
            :show-snap-shot-btn="false"
            :ws-data="wsData"
            :node-link-connectivity-status="true"
          >
          </scene-editor>
        </div>
        <train-tab
          :show-submit-btn="show_submit_btn"
          :task-lists="taskLists"
          :train-description="trainDescription"
          @updateState="updateState"
          @getValue="getSingleValue"
          :showList="showList"
          :trainList="trainList"
          @showList="updateShowList"
          :showDetail="showDetail"
          @showDetail="updateShowdetail"
        >
          <div slot="view-manual">
            <cb-button @click="gotoManual" color-type="hollow">
              {{ $t('m.trainManual') }}
            </cb-button>
          </div>
          <div slot="train-record">
            <cb-button color-type="hollow" @click="gotoRecord">
              {{ $t('m.trainRecord') }}
            </cb-button>
          </div>
        </train-tab>
      </div>
      <div class="bottom-timeline">
        <time-line :scale-times="scaleTimes" />
      </div>
      <!-- 训练手册 -->
      <training-manual ref="trainingManual" />

      <!--训练记录-->
      <cb-dialog
        v-if="showTrainRecord"
        :visible.sync="showTrainRecord"
        width="81%"
        class="record manual-dialog"
        center
      >
        <div slot="title" class="header-title">
          <span>{{ $t('m.trainRecord') }}</span>
          <div class="fr">
            <span @click="showTreeFile = !showTreeFile">
              <cb-iconfont
                v-show="!showTreeFile"
                :title="$t('m.preview')"
                size="22"
                type="icon-liebiao"
                class="cursor mr10"
              />
            </span>
            <span @click="showTreeFile = !showTreeFile">
              <cb-iconfont
                v-show="showTreeFile"
                :title="$t('m.previews')"
                size="22"
                type="icon-renwufangan"
                class="cursor"
              />
            </span>
            <span @click="printParent()">
              <cb-iconfont
                v-show="!showTreeFile"
                :title="$t('m.print')"
                size="22"
                type="icon-dayin"
                class="cursor"
              />
            </span>
          </div>
        </div>
        <div style="height: 500px"></div>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { getValueName } from '@/assets/js/tools.js';
import TimeLine from '@/components/TimeLine/TimeLine.vue';
import TrainTab from '@/components/TrainCommon/TrainTab.vue';
import TrainingManual from '@/pages/web/SingleTrain/training_manual.vue';
import { setBreadcrumbTitle } from '@cyber/ui';
import { SceneEditor } from '@cyber/scene';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';

export default {
  components: {
    SceneEditor,
    TimeLine,
    TrainTab,
    TrainingManual,
  },
  data() {
    return {
      cookie: '',
      show_submit_btn: false,
      trainList: [],
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        // toolbar: ['restore'],
        // showToolbar: true,
        toolbar: [],
        showToolbar: false,
      },
      // 进度条信息
      progress: {
        progressRate: 0,
        progressInfo: '',
        status: undefined,
      },
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      breadcrumbName: '',
      scene_manager_id: this.$route.params && this.$route.params.resource_id, // 用于通用场景请求
      sceneId: '', // 场景id
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close'], // 按钮组配置项

      sceneLoading: false, // 场景loading
      showList: false,
      showDetail: false,
      showTrainRecord: false,
      crEventData: {},
      taskTrain: this.$t('m.singleTrain'),
      showInfo: true,
      showTask: true,
      showAnswerDialog: false,
      showTreeFile: true, // true显示tree树，false显示文档
      taskLists: {},
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
      sceneConfigData: null,
      taskResourceId: '',
      wsData: {},
    };
  },
  computed: {},
  watch: {
    scene_manager_id: {
      handler(nv, ov) {
        if (nv) {
          this.bindSceneWs(this.scene_manager_id);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.handleGetSceneData();
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    // 初始化数据
    this.initData();
    this.initTimeData();
  },
  methods: {
    /**
     * 接入方式
     */
    openTap(connection_url, access_modes, nodeId) {
      const { id, protocol, access_ip, access_port, path } = access_modes;
      if (protocol === 'http' || protocol === 'https') {
        let connection_url = '';
        if (!!path) {
          connection_url = `${protocol}://${access_ip}:${access_port}${path}`;
        } else {
          connection_url = `${protocol}://${access_ip}:${access_port}`;
        }
        window.open(connection_url, '_blank');
      } else {
        const params = {
          access_mode_id: id,
          context: {
            access_user_id: this.$store.state.user.id,
          },
          id: this.sceneId,
          node_id: nodeId,
        };
        this.$request
          .post('/cscene/cscene_instances/get_connection', params, {
            baseURL: '/api/mp',
          })
          .then((res) => {
            const url = this.$router.resolve({
              name: 'scene-screen-recording',
              query: {
                connection_url: _.get(res, 'data.data.connection_url'),
                node_id: nodeId,
                connection_id: _.get(res, 'data.data.connection_id'),
                scene_id: this.sceneId,
                user_id: this.$store.state.user.id,
              },
            });
            window.open(url.href, '_blank');
          });
      }
    },

    /**
     * 获取场景数据
     */
    handleGetSceneData() {
      if (_.isEmpty(this.scene_manager_id)) {
        return;
      }
      this.$request
        .get(
          `/cr/single_train/room/scene`,
          {
            resource_id: this.scene_manager_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = status.showMaskBtn;
          this.showProgress = status.showProgress;
          this.showBtn = status.showBtn;
          this.sceneData = status.sceneData;
          this.progress = status.progress;
          // 场景id
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
        });
    },

    /**
     * 场景启动
     */
    handleSceneStart() {
      this.refreshProgress();
      // 启动场景
      this.$request
        .post(
          '/cr/single_train/room',
          { resource_id: this.scene_manager_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          this.showBtn = true;
          /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
          this.handleGetSceneData();
          this.initTimeData();
          this.initData();
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
            this.$request
              .delete(
                `/cr/single_train/room/`,
                {
                  resource_id: this.scene_manager_id,
                },
                {
                  baseURL: '/api/ojj',
                },
              )
              .then((res) => {
                this.showMask = true;
                this.showMaskBtn = true;
                this.showProgress = false;
                this.showBtn = false;
                this.initData();
                this.handleGetSceneData();
                this.initTimeData();
              })
              .catch((error) => {
                this.$message.error(error);
              });
          })
          .catch(() => {});
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
          this.$request
            .delete(
              `/cr/single_train/room/`,
              {
                resource_id: this.scene_manager_id,
              },
              {
                baseURL: '/api/ojj',
              },
            )
            .then((res) => {
              this.showMask = true;
              this.showMaskBtn = true;
              this.showProgress = false;
              this.showBtn = false;
              this.initData();
              this.handleGetSceneData();
            })
            .catch((error) => {});
        });
      }
    },

    /**
     * 重启
     */
    nodeRestart(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/single_train/room/scene/node/restart',
          {
            node_id: id,
            resource_id: this.scene_manager_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {});
    },

    /**
     * 重建
     */
    nodeRecreate(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/single_train/room/scene/node/recreate',
          {
            node_id: id,
            resource_id: this.scene_manager_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {});
    },

    getSingleValue(val) {
      this.taskResourceId = val.resource_id;
    },
    /**
     * 初始化数据
     */
    initData() {
      if (this.resource_id) {
        this.$request
          .get(
            '/cr/single_train/room',
            { resource_id: this.resource_id },
            { baseURL: '/api/ojj' },
          )
          .then((res) => {
            this.sceneConfigData = res.data.data.scene_config_data;
            setBreadcrumbTitle(res.data.data.event_data.name);
            this.trainDescription = JSON.parse(
              JSON.stringify(res.data.data.event_data),
            );
            this.scaleTimes.duration_time = this.trainDescription.duration_time;
            this.trainDescription.duration_time =
              res.data.data.event_data.duration_time;
            this.trainDescription.trainType = getValueName(
              this.$CONSTANT.Condition.Category,
              res.data.data.event_data.category,
            );
            this.trainDescription.trainDifficult = getValueName(
              this.$CONSTANT.Condition.Difficult,
              res.data.data.event_data.difficult,
            );
            if (res.data.data && res.data.data.show_submit_btn) {
              this.show_submit_btn = res.data.data.show_submit_btn;
            } else {
              this.show_submit_btn = false;
            }
            this.taskLists = res.data.data.missions_scheme;
          })
          .catch(() => {});
      }
    },

    // 获取时间轴数据
    initTimeData() {
      this.$request
        .get(
          '/cr/single_train/room/time_line',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
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
        .catch(() => {});
    },
    // 修改任务答题状态
    updateState(params) {
      this.taskLists[params.index].missions[params.childrenIndex].state = 1;
    },
    showInfoPanel() {
      this.showInfo = !this.showInfo;
    },
    showTaskPanel() {
      this.showTask = !this.showTask;
    },
    // 跳转手册
    gotoManual() {
      this.$refs.trainingManual.dialogVisible = true;
    },

    // 跳转训练记录
    gotoRecord() {
      this.getRescordList();
      this.showList = true;
    },
    // 获取训练记录
    // 获取训练记录是新增巴基斯坦需求,接口代替换todo
    getRescordList() {
      this.$request
        .get(
          `/cr/single_train/room/train_history/`,
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.trainList = _.get(res, 'data.data', []);
        });
    },
    updateShowList(value) {
      this.showList = value;
    },
    updateShowdetail(value) {
      this.showDetail = value;
    },
    printParent() {
      this.$refs.trainRecord.print();
    },

    bindSceneWs() {
      this.cookie = utils.getCookie('cr_jwttoken');
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.scene_manager_id}_${this.$store.state.user.id}&token=${this.cookie}`,
        {
          '': (data) => {
            const wsData = handleWsData(data, this.progress, this.sceneData);
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
     * 重新刷新进度条信息
     */
    refreshProgress() {
      this.progress.status = undefined;
      this.progress.progressInfo = '';
      this.progress.progressRate = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.task-train {
  .bottom-btn {
    z-index: 10;
    margin-top: -50px;
    margin-left: 20px;
    position: absolute;
  }
  ::v-deep .el-scrollbar__bar {
    right: 0;
    &.is-vertical > div {
      height: 100%;
    }
  }
  @keyframes dong {
    0% {
      transform: translate(0px, -50px);
    }
    100% {
      transform: translate(0px, 50px);
    }
  }
  .imgAnimation {
    animation: dong 2s infinite;
  }
  .header {
    width: 100%;
  }
  .elc-dialog-btn-cancel {
    width: 120px;
    height: 36px;
    line-height: 10px;
  }
  .content {
    width: 100%;
    height: calc(100% - 130px);
    position: relative;
    margin-top: 10px;
    .topology {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .left-info {
      height: calc(100% - 100px);
      width: 19%;
      position: absolute;
      left: 0;
    }
    .pv {
      margin-right: 10px;
      margin-top: 7px;
    }
  }
  .bottom-timeline {
    height: 127px;
    width: 100%;
    box-sizing: border-box;
  }

  .footer {
    height: 55px;
    text-align: center;
    img {
      display: inline-block;
      bottom: 20px;
      height: 45px;
    }
    span {
      bottom: 3px;
      font-size: 14px;
    }
  }
}
.header-title {
  width: calc(100% - 40px);
}
.task-answer-dialog {
  width: 100%;
  height: 100%;

  .el-dialog {
    min-height: 30%;
  }
  .el-dialog__body {
    padding: 25px 50px 15px !important;
  }
}
.record {
  .el-dialog__header {
    height: 8.5% !important;
    text-align: center !important;
    span {
      display: inline-block;
    }
    .el-dialog__body {
      padding: 0 30px !important;
      height: 100% !important;
    }
  }
  .fa-list:before {
    position: absolute !important;
    top: 24px !important;
    right: 80px !important;
  }
  .fa-print:before {
    position: absolute !important;
    top: 24px !important;
    right: 55px !important;
  }
  .fa-file-text-o:before {
    position: absolute !important;
    top: 24px !important;
    right: 80px !important;
  }
}
</style>
