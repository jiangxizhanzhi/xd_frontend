<template>
  <!--环境信息-->
  <div class="env-info">
    <div
      v-loading="isStart"
      class="content"
      :element-loading-text="$t('m.waitStartScene') + '...'"
      element-loading-spinner="null"
      element-loading-background="rgba(37,57,115,.76)"
    >
      <div class="topology">
        <scene-editor
          v-if="refresh"
          ref="sceneEditor"
          :class="{ 'update-scene': sceneStatus === 'update' }"
          :title="crEventData.name"
          :sceneConfig="sceneConfig"
          :topologyData="sceneData"
          :show-mask="showMask"
          :show-mask-btn="showMaskBtn"
          :show-progress="showProgress"
          :progress="progress"
          :progress-localize="progressLocalize"
          :breadcrumb-localize="breadcrumbLocalize"
          :stage-progress="stageProgress"
          :show-label="false"
          :show-title="false"
          :allow-dialog="false"
          :status="sceneStatus"
          :show-btn="showBtn"
          :btn-config="btnGroupConfig"
          :draw-ws-new-node="false"
          :mp-scene-id="mpSceneId"
          :node-link-connectivity-status="true"
          :open-layer="false"
          :scene-config-id="mpSceneId"
          @onSceneStart="handleSceneStart"
          @close="sceneClosed"
          @onAccess="openTap"
          @on-node-restart="nodeRestart"
          @on-node-rebuild="nodeRecreate"
          @on-node-shutdown="(data) => onNodeShutDown(data, mpSceneId)"
          @on-node-shutup="(data) => onNodeShutUp(data, mpSceneId)"
          :ws-data="wsData"
          @on-update-topology="updateTopology"
          @on-update-node-data="handleUpdateNodeData"
          @on-deleted-nodes="handleDeleteNode"
        />
        <div v-if="sceneStatus === 'update'" class="bottom-btn-wrapper">
          <cb-button-group space="middle">
            <cb-button button-type="confirm" mr @click="submitTopology">
            </cb-button>
            <cb-button button-type="cancel" @click="toBack(true)"> </cb-button>
          </cb-button-group>
        </div>
      </div>
      <step-list
        ref="stepList"
        :task-lists="taskLists"
        @updateTimeLine="updateTimeLine"
      />
    </div>
    <div class="bottom-timeline">
      <time-line :scale-times="scaleTimes" />
    </div>
    <cb-dialog
      :title="$t('test.tip')"
      :visible.sync="showCloseDialog"
      width="640px"
    >
      <p style="margin-bottom: 20px">{{ $t('test.selectCloseAction') }}</p>
      <cb-radio-group v-model="closeRadio" direction="vertical">
        <cb-radio :label="0">{{ $t('test.closeandSave') }}</cb-radio>
        <cb-input
          class="inputStyle"
          v-model="taskName"
          clearable
          :placeholder="$t('test.enterInstanceName')"
        />
        <cb-radio :label="1">{{ $t('test.closeScene') }}</cb-radio>
      </cb-radio-group>
      <span slot="footer" class="dialog-footer">
        <cb-button button-type="confirm" @click="handleClosed" mr>
          {{ $t('common.confirm') }}
        </cb-button>
        <cb-button button-type="cancel" @click="closeDialog">
          {{ $t('common.cancel') }}
        </cb-button>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import validateUtils from '@/utils/validate';
import TimeLine from '@/components/TimeLine/rangeTimeLine.vue';
import { SceneEditor } from '@cyber/scene';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket.js';
import StepList from './step-list.vue';
import { mixins } from '@/mixin';
import {
  deleteNodeDynamic,
  updateNodeDynamic,
  updateTopologyDynamic,
} from '../../../../../api/scene/scene';
export default {
  mixins: [mixins],
  props: {
    taskId: {
      type: String,
      default: '',
    },
    mpSceneId: {
      type: String,
      default: '',
    },
  },
  components: {
    TimeLine,
    SceneEditor,
    StepList,
  },
  data() {
    return {
      sceneStatus: 'display',
      sendData: {},
      cookie: '',
      templateId: '',
      local_scene_id: '',
      showCloseDialog: false,
      closeRadio: 0,
      taskName: '',
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
        width: '100%',
        left: '0px',
        bottom: '0px',
      },
      // 层节点面包屑的位置，与css样式中写的值同步
      breadcrumbLocalize: {
        top: '20px',
        left: '20px',
      },
      showMask: true, // 场景蒙层
      showMaskBtn: false, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close', 'update-topology'], // 按钮组配置项
      sceneData: {}, // 场景数据
      scene_manager_id: '', // 用于通用场景请求
      sceneLoading: false, // 场景loading
      isStart: false,
      crEventData: {},
      breadcrumbName: '',
      taskTrain: this.$t('m.groupTraining'),
      showInfo: true,
      showTask: true,
      showTrainRecord: false,
      showAnswerDialog: false,
      showTreeFile: true, // true显示tree树，false显示文档
      trainDescription: {
        trainType: '',
        duration_time: '',
        trainDifficult: '',
        pre_skill: [],
        train_skill: [],
        description: '',
      },
      taskLists: [],
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
      },
      resource_id: '',
      scene_manager_id: '',
      sceneId: '',
      visible: true,
      wsData: {},
      refresh: true,
    };
  },
  computed: {},
  watch: {
    taskId(value) {
      this.getTopoData();
      this.getTimeShaft();
      this.$refs.stepList.taskId = value;
      this.$refs.stepList.getStepList();
    },
    mpSceneId(value) {
      this.$refs.stepList.mpSceneId = value;
    },
  },
  created() {
    this.templateId = this.$route.params && this.$route.params.templateId;
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.bindSceneWs();
    document.addEventListener('visibilitychange', this.handle);
  },
  methods: {
    handle() {
      this.visible = document.visibilityState === 'visible';
    },
    updateTimeLine() {
      this.getTimeShaft();
    },
    getTopoData(refresh = false) {
      const params = {};
      params.template_id = this.templateId;
      if (this.taskId) {
        params.task_id = this.taskId;
      }
      this.$request
        .get('/cr/eval/task', params, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.sendData = res.data.data;
          //储存测评详情的title
          localStorage.setItem('rang-detail', res.data.data.template_name);
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = status.showMaskBtn;
          this.showProgress = status.showProgress;
          this.showBtn = status.showBtn;
          this.sceneData = status.sceneData;
          this.progress = status.progress;
          this.stageProgress = status.stageProgress;
          // 场景id
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          // 返回topo_id
          this.topo_id = _.get(res, 'data.data.topo_id', '') || '';
          this.$emit('sendData', this.sendData);
          refresh && this.changeTopo();
        });
    },
    /**
     * 启动场景
     */
    handleSceneStart() {
      if (_.isEmpty(this.templateId)) {
        return;
      }
      this.refreshProgress();
      /* this.bindSceneWs(this.templateId); */
      this.$request
        .post(
          '/cr/eval/task/start',
          { template_id: this.templateId },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
          this.getTopoData();

          this.$emit('update');
        });
    },
    sceneClosed() {
      this.showCloseDialog = true;
    },
    /**
     * 关闭场景
     */
    handleClosed() {
      if (_.isEmpty(this.templateId)) {
        return;
      }
      const params = {};
      params.template_id = this.templateId;
      if (this.closeRadio == 0) {
        let strlength = validateUtils.validateLength(this.taskName);
        if (strlength < 1 || strlength > 255) {
          this.$message.warning(this.$t('test.InstanceNameCheck'));
          return;
        } else {
          params.task_name = this.taskName;
        }
      }
      if (this.taskId) {
        params.task_id = this.taskId;
      }
      this.refreshProgress();
      this.$request
        .post('/cr/eval/task/stop', params, { baseURL: '/api/ojj' })
        .then((res) => {
          this.showCloseDialog = false;
          this.showMask = true;
          this.showMaskBtn = true;
          this.showProgress = false;
          this.showBtn = false;
          this.sceneData = {};
          this.$emit('update');
        });
    },
    closeDialog() {
      this.showCloseDialog = false;
    },

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
                page: 'range-test',
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

    getTaskDetail() {
      this.$request
        .get(
          '/cr/training_team/training_team_students/get_mission_scheme',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.taskLists = res.data.data;
        });
    },

    //提交任务时间轴
    getTimeShaft() {
      const params = {};
      params.template_id = this.templateId;
      if (this.taskId) {
        params.task_id = this.taskId;
      }
      this.$request
        .get('/cr/eval/task/time_line', params, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          if (res.data.data.start_time) {
            const temp = {
              title: this.$t('test.startScene'),
              end_time: res.data.data.start_time,
            };
            res.data.data.data.unshift(temp);
          }
          if (!res.data.data.end_time) {
            res.data.data.end_time = res.data.data.current_time;
          } else {
            const temp = {
              title: this.$t('test.endScene'),
              end_time: res.data.data.end_time,
            };
            res.data.data.data.push(temp);
          }
          if (res.data.data.data == null) {
            res.data.data.data = [];
          }
          this.scaleTimes = res.data.data;
        });
    },

    // 节点重启
    nodeRestart(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/eval/scene/node/restart',
          {
            node_id: id,
            task_id: this.taskId,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {});
    },

    //节点重建
    nodeRecreate(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/eval/scene/node/recreate',
          {
            node_id: id,
            task_id: this.taskId,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {});
    },
    // ws请求
    bindSceneWs() {
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.templateId}&token=${this.cookie}`,
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

    // 场景启动实例更新
    updateTopology() {
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
    },
    // 保存场景实例更新变动
    submitTopology() {
      this.sceneData = null;
      this.$confirm(this.$t('crEvent.confirmSceneSaveUpdate'))
        .then(() => {
          let params = {
            mp_scene_id: this.mpSceneId,
            update_scene: this.$refs.sceneEditor.getData().scene_config,
          };
          updateTopologyDynamic(params).then((res) => {
            this.$message.success(this.$t('crEvent.topoUpdated'));
            this.toBack(true);
          });
        })
        .catch(() => {});
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
          mp_scene_id: this.mpSceneId,
          node_id: data[0].id,
        };
        deleteNodeDynamic(params).then((res) => {});
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
      this.getTopoData(refresh);
    },
    // 刷新场景
    changeTopo() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
    },
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.handle);
  },
};
</script>

<style lang="scss" scoped>
.inputStyle {
  margin-left: 20px;
  width: 90%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.transFormX50 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.bottom-btn {
  margin-top: -50px;
  margin-left: 20px;
  position: absolute;
}
.env-info {
  height: 100%;
  // height: 760px;
  border-radius: 2px;
  ::v-deep .elc-scene-loader-container .helper .mask {
    border-radius: 2px;
  }
  ::v-deep .elc-scene-loader-container .helper .size-btn {
    border-radius: 2px !important;
    left: 30px;
  }
  ::v-deep .elc-scene-loader-container .helper .rt-control-btns {
    display: none;
  }
  ::v-deep .elc-scene-loader-container .helper .cm-control-btns {
    display: none;
  }
  .el-loading-spinner {
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px 20px;
    background: #1ea3fe;
    border-radius: 17px;
    width: auto;
  }
  .el-loading-spinner .el-loading-text {
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
  }
  .header {
    width: 100%;
  }
  .content {
    width: 100%;
    height: calc(100% - 70px);
    position: relative;
    .topology {
      position: absolute;
      width: 78%;
      height: 100%;
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
  }
  .footer {
    /*height: 6%;*/
    height: 55px;
    text-align: center;
    img {
      display: inline-block;
      bottom: 20px;
    }
    span {
      bottom: 3px;
      font-size: 14px;
    }
  }
  .bottom-timeline {
    height: 130px;
    width: 100%;
  }
}
</style>
