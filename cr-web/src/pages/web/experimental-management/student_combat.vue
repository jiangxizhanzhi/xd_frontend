<template>
  <!--团队训练学员页面-->
  <div class="student-combat page">
    <!-- <div class="header">
      <breadcrumb
        :breadcrumb="breadcrumbName"
        :breadcrumb-name="$t('m.groupTraining')"
        list-router="/group_training"
      />
    </div> -->
    <div
      v-loading="isStart"
      class="content"
      :element-loading-text="$t('m.waitStartScene') + '...'"
      element-loading-spinner="null"
    >
      <div class="topology">
        <scene-editor
          :title="crEventData.name"
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
          @onAccess="openTap"
          @on-node-restart="nodeRestart"
          @on-node-rebuild="nodeRecreate"
          :mp-scene-id="sceneId"
          :show-snap-shot-btn="false"
          :ws-data="wsData"
          :node-link-connectivity-status="true"
          :business_id="resource_id"
        />
      </div>
      <train-task
        :task-lists="taskLists"
        :train-description="trainDescription"
        @refreshData="refreshData"
        @refershTask="getTaskDetail"
      />
    </div>
    <div class="bottom-timeline">
      <time-line :scale-times="scaleTimes" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { getValueName } from '@/assets/js/tools.js';
import TimeLine from '@/components/TimeLine/TeacherTimeLine.vue';
import TrainTask from '@/components/TrainCommon/train_task.vue';
import { setBreadcrumbTitle } from '@cyber/ui';
import { SceneEditor } from '@cyber/scene';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket.js';

export default {
  components: {
    TimeLine,
    TrainTask,
    SceneEditor,
  },
  data() {
    return {
      cookie: '',
      room_id: '',
      local_scene_id: '',
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
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

      scene_manager_id: '', // 用于通用场景请求
      showMaskBtn: false, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: [], // 按钮组配置项

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
      wsData: {},
    };
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getTimeShaft();
  },
  mounted() {
    //获取token
    /* this.cookie = document.cookie.split('cr_jwttoken=')[1]; */
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getStudentInfo();
    this.getTaskDetail();
    // remoteUtil.loginJms();
    // this.bindSceneWs();
    this.studentReportWs();
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
        .post('/cscene/cscene_instances/get_connection', params, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          const connection_url = _.get(res, 'data.data.connection_url', '');
          window.open(connection_url, connection_url);
        });
    },

    showInfoPanel() {
      this.showInfo = !this.showInfo;
    },

    showTaskPanel() {
      this.showTask = !this.showTask;
    },

    gotoManual() {
      this.$router.push('/indidaul/manual/');
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
    // 学员ws接口
    studentReportWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          if (data.code === 0 || data.code === 2) {
            this.getTaskDetail();
          }
        },
      );
    },

    getStudentInfo() {
      // 获取左侧info
      // const _this = this
      this.$request
        .get(
          'cr/training_team/training_team_students',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.crEventData = res.data.data;
          this.breadcrumbName = res.data.data.name;
          setBreadcrumbTitle(this.breadcrumbName);
          this.trainDescription = JSON.parse(JSON.stringify(res.data.data));
          this.trainDescription.trainType = getValueName(
            this.$CONSTANT.Condition.Category,
            res.data.data.category,
          );
          this.trainDescription.trainDifficult = getValueName(
            this.$CONSTANT.Condition.Difficult,
            res.data.data.difficult,
          );
          this.trainDescription.duration_time = res.data.data.duration_time;
          if (
            res.data.data.training_status ===
            this.$CONSTANT.Training.TrainingStatus.NoBegin.value
          ) {
            this.isStart = true;
          } else {
            this.isStart = false;
          }

          this.handleGetSceneData();
          this.bindSceneWs();
        });
    },

    /**
     * 获取场景数据
     */

    //学员获取场景数据
    handleGetSceneData() {
      //学员获取场景数据
      this.$request
        .get(
          '/cr/team_train/room/scene',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = false; // 学员没有启动场景的权限
          this.showProgress = status.showProgress;
          this.showBtn = false; // 学员没有关闭场景的权限
          this.sceneData = status.sceneData;
          this.progress = status.progress;
          //获取local_scene_id,room_id
          this.local_scene_id = res.data.data.local_scene_id;
          this.room_id = res.data.data.room_id;

          // 场景id
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
        })
        .catch((error) => {
          // this.$message.error(error);
        });
    },

    /**
     * 场景启动
     */
    handleSceneStart() {
      if (_.isEmpty(this.scene_manager_id)) {
        return;
      }
      this.bindSceneWs(this.scene_manager_id);
      this.$request
        .post(`/ce_base/scene_managers/${this.scene_manager_id}/start_scene/`)
        .then((res) => {})
        .catch((error) => {
          this.$message.error(error);
        });
    },

    // [前台]学员-当前提交任务时间轴
    getTimeShaft() {
      this.$request
        .get(
          '/cr/training_team/training_team_students/get_time_line',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          _.forEach(res.data.data.data, (item) => {
            this.$set(item, 'actionName', this.$t('m.numberOfTasksReported'));
          });
          this.scaleTimes = res.data.data;
        });
    },

    refreshData() {
      // 提交完任务重新请求数据
      this.getTaskDetail();
      this.getTimeShaft();
    },

    // 团队学员节点重启
    nodeRestart(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/team_train/room/scene/node/restart',
          {
            node_id: id,
            resource_id: this.resource_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {});
    },

    //团队学员节点重建
    nodeRecreate(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/team_train/room/scene/node/recreate',
          {
            node_id: id,
            resource_id: this.resource_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {});
    },

    refreshProgress() {
      this.progress.status = undefined;
      this.progress.progressInfo = '';
      this.progress.progressRate = 0;
    },

    // ws请求
    bindSceneWs() {
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.resource_id}&token=${this.cookie}`,
        {
          '': (data) => {
            const wsData = handleWsData(data, this.progress, this.sceneData);
            if (data.type === 'scene_element') {
              this.wsData = data.data;
            }
            if (wsData) {
              this.showMask = wsData.showMask;
              this.showMaskBtn = false;
              this.showProgress = wsData.showProgress;
              this.showBtn = false;
            }
          },
        },
      );
    },
  },
};
</script>

<style lang="scss" scoped>
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
.student-combat {
  // width: 100%;
  height: 800px;
  // margin-left: 98px;
  // padding: 80px 5% 0 5%;
  // box-sizing: border-box;
  border-radius: 2px;
  .el-loading-spinner {
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px 20px;
    background: var(--primary-color);
    border-radius: 17px;
    width: auto;
  }
  .el-loading-spinner .el-loading-text {
    color: var(--white-color);
    font-size: 14px;
  }
  .header {
    width: 100%;
  }
  .content {
    width: 100%;
    height: calc(100% - 129px);
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
    height: 126px;
    width: 100%;
  }
  ::v-deep .el-loading-mask {
    z-index: 4;
  }
}
</style>
