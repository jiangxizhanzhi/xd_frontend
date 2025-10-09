<template>
  <div class="admin-home lay-com">
    <div class="header">
      <!-- 训练详情头部样式 -->
      <train-top-title
        :detail-title="detailTitle"
        @back="backHome"
        :isEnd="isEnd"
      ></train-top-title>
      <div class="header-right">
        <!--
          右侧训练状态相关按钮-
          未开始isStart=true: 编辑靶场、启动靶场、删除靶场
          已开始isStart=false,sceneStatus=true: 结束、删除靶场
          已结束isStart=false,sceneStatus=false: 已结束、删除靶场
        -->
        <!-- 编辑训练 -->
        <cb-button
          v-if="showEdit || isStart"
          @click="editInstance"
          button-type="edit"
          icon="icon-edit"
          hollow
          style="margin-right: 4px"
        >
          {{ $t('admin.editTraining') }}
        </cb-button>
        <!-- 开始训练 -->
        <cb-button
          icon="icon-huifu"
          hollow
          v-if="isStart"
          @click="startTraining"
        >{{ $t('rbt.startTrain') }}</cb-button>
        <!-- 结束训练 -->
        <cb-button
          icon="icon-jieshu"
          hollow
          v-if="!isStart && sceneStatus"
          @click="endTraining"
        >{{ $t('rbt.endTrain') }}</cb-button>
        <!-- 已结束 -->
        <!-- <cb-button
          icon="icon-yitingzhi"
          disabled
          hollow
          v-if="!isStart && !sceneStatus"
          @click="endTraining"
          >{{ $t('rbt.hasEnded') }}</cb-button
        > -->
        <!-- 删除训练 -->
        <cb-button
          icon="icon-shanchu"
          @click="deleteTeamTrain($event)"
          hollow
        >
          {{ $t('admin.deleteTraining') }}
        </cb-button>
      </div>
    </div>
    <div class="content">
      <div class="nav-wrap">
        <cb-radio-group
          v-model="tabActive"
          class="radio-btn"
          size="small"
        >
          <cb-radio-button :label="$t('rbt.pilotControl')"></cb-radio-button>
          <!-- 任务裁决tab -->
          <cb-radio-button
            :class="markStatus ? 'mark-style' : ''"
            :label="$t('rbt.taskAdjudication')"
          ></cb-radio-button>
          <cb-radio-button :label="$t('rbt.probeCollection')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.flowAnalysis')"></cb-radio-button>
          <!-- <cb-radio-button :label="$t('rbt.screenMonitoring')"></cb-radio-button> -->
          <cb-radio-button :label="$t('rbt.studentRatings')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.trainReport')"></cb-radio-button>
          <!-- <cb-radio-button :label="$t('rbt.trainManual')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.monitorReplay')"></cb-radio-button> -->
        </cb-radio-group>
        <!-- 3D拓扑按钮 -->
        <!-- <div class="btn-wrap">
          <cb-button
            type="text"
            icon="icon-tuopu"
            @click="gotoDataScreen"
          >
            {{ $t('m.dtopology') }}
          </cb-button>
          <cb-button
            style="margin-left: 16px"
            v-if="entranceInfo.show"
            type="text"
            icon="icon-changjingguanli"
            @click="gotoRealityScreen"
          >{{ $t('m.realTopology') }}</cb-button>
        </div> -->
        <div class="btn-wrap">
          <cb-button
            v-if="isShowSceneQueueBtn"
            hollow
            @click="sceneQueue"
          >{{ $t('场景排队') }}</cb-button>
        </div>
      </div>
      <div class="train-wrap el-tabs__content">
        <!-- 导调控制 -->
        <pilot-control
          v-if="tabActive === $t('rbt.pilotControl')"
          @sceneId="sceneId"
          @topoId="topoId"
          @sendData="getData"
          :screenName="screenName"
          :cr-event-data="crEventData"
          :time-line-up-data="timeLineUpData"
        ></pilot-control>
        <!-- 任务裁决 -->
        <task-judge
          v-if="tabActive === $t('rbt.taskAdjudication')"
          :sceneId="collectId"
        ></task-judge>
        <!-- 探针采集 -->
        <probe-collect
          v-if="tabActive === $t('rbt.probeCollection')"
          :sceneId="collectId"
        ></probe-collect>
        <!-- 流量分析 -->
        <flow-explain
          v-if="tabActive === $t('rbt.flowAnalysis')"
          :sceneId="collectId"
        ></flow-explain>
        <!-- 屏幕监控 -->
        <screen-monitor v-show="tabActive === $t('rbt.screenMonitoring')"></screen-monitor>
        <!-- 学员评分 -->
        <student-score v-if="tabActive === $t('rbt.studentRatings')">
        </student-score>
        <!-- 训练报告 -->
        <train-report
          v-if="tabActive === $t('rbt.trainReport')"
          :cr-event-data="crEventData"
          :sceneId="collectId"
        />
        <!-- 训练手册 -->
        <train-manual
          v-if="tabActive === $t('rbt.trainManual')"
          :resourceId="resource_id"
        />
        <!-- 复盘回放 -->
        <replay
          v-show="tabActive === $t('rbt.monitorReplay')"
          :isRedBlue="false"
          :sceneId="replaySceneId"
          :topoId="topo_id"
        ></replay>
      </div>
    </div>
    <!-- 团队聊天框todo-->
    <div class="char-box">
      <ChatToolTeam ref="charToolTeam" />
    </div>
    <Notice
      ref="noticeRef"
      type="team"
      :resourceId="resource_id"
      :role="roleGroup"
    />
    <!-- 场景排队弹窗 -->
    <scene-queue
      v-if="sceneQueueDialogVisible"
      :visible.sync="sceneQueueDialogVisible"
      :resource_id="resource_id"
    ></scene-queue>
  </div>
</template>

<script>
import {
  getEditBackApi,
  deleteTrainingApi,
  getSceneStatusApi,
  endTrainingApi,
  startTrainingApi,
  getIsShowApi,
  getTaskMarkApi,
  getCancelMarkApi,
  getSituationApi,
} from '@/api/web/team-training';
import pilotControl from './components/pilot-control.vue'; //导调控制页面
import screenMonitor from './components/screen-monitor'; //屏幕监控页面
import probeCollect from './components/probe-collect.vue'; //探针采集页面
import flowExplain from './components/flow-explain.vue'; //流量分析页面
import TaskJudge from './components/task-judge.vue'; // 任务裁决页面
import TrainReport from './components/training-report/index.vue'; //训练报告页面
import TrainManual from './components/training-manual/index.vue'; //训练手册页面
import StudentScore from './components/student-score'; //学员评分页面
// import ChatTool from '@/components/ChatTools/index.vue';
import _ from 'lodash';
import { setBreadcrumbTitle } from '@cyber/ui';
// import replay from '@/components/replay/index.vue'; //旧的复盘回放
import replay from '@/components/team-rb-replay/index.vue'; //新的复盘回放
import TrainTopTitle from '@/components/student-common-detail/train-top-title/index.vue';
import ChatToolTeam from '@/components/ChatTools/index-team.vue';
import Notice from '@/pages/web/notice/index.vue';
import SceneQueue from './components/scene-queue'
import { getUserInfo, getSysSettings } from '@cyber/helper';
import { getTeamReplayEnable } from '@/api/web/replay';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { getCurrentModuleByRouterName } from '../../../../utils';
import { DETAIL_TITLE_TEACHER_NAME } from '../constants'
export default {
  name: 'teachDetail',
  components: {
    pilotControl,
    screenMonitor,
    probeCollect,
    flowExplain,
    replay,
    TrainReport,
    TrainManual,
    TrainTopTitle,
    TaskJudge,
    StudentScore,
    // ChatTool,
    ChatToolTeam,
    Notice,
    SceneQueue,
  },
  data() {
    return {
      timeLineUpData: 0,
      isEnd: false, //已结束展示结束标记
      cookie: '',
      markStatus: false,
      training_status: '',
      isCheck: '',
      isCheckValue: '',
      isChecks: '',
      isChecksValue: '',
      resource_id: '',
      breadcrumbName: '',
      crEventData: {},
      // dialogEditVisible: false,
      tabActive: this.$t('rbt.pilotControl'),
      isStart: false,
      sceneStatus: true,
      collectId: '', //传给探针采集的场景id
      replaySceneId: '', //复盘专用sceneId
      entranceInfo: {}, // 实景拓扑信息
      topo_id: '',
      screenName: '',
      detailTitle: '',
      sceneQueueDialogVisible: false,
    };
  },
  computed: {
    showEdit() {
      const runningStatus = _.get(this, 'crEventData.data.training_status');
      if (runningStatus === 4) {
        return true;
      }
      return false;
    },
    roleGroup() {
      return _.get(this.crEventData, 'data.training_role_data.role_group');
    },
    isShowSceneQueueBtn() {
      // 实验和综合演训展示场景排队
      return [
        'cloud-computing-resource-experimental-home',
        'cloud-network-resource-experimental-home',
        'scan-detect-attack-experimental-home',
        'vulnerability-mining-exploitation-experimental-home',
        'denial-service-attack-experimental-home',
        'new-network-basic-experimental-home',
        'new-network-attack-defense-experimental-home',
        'group-training-home', //综合演训
      ].includes(this.$route.name)
    },
  },

  watch: {
    tabActive: {
      handler: function (nv, ov) {
        if (nv !== ov) {
          if (nv === this.$t('rbt.monitorReplay')) {
            getTeamReplayEnable({ resource_id: this.resource_id })
              .then((res) => {
                this.replaySceneId = _.get(res, 'data.data', '') || '';
              })
              .catch((res) => {
                this.replaySceneId = '';
              });
          }
        }
        // 点击任务裁决取消红点
        if (nv === this.$t('rbt.taskAdjudication')) {
          this.getCancelMark();
        }
      },
      immediate: true, // 关键
      deep: true,
    },
  },
  async created() {
    getSysSettings().then((res) => {
      document.title = _.get(
        this.$store.state.user,
        'system_setting.system_name',
      );
    });
    this.getUserInfo();
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    //综合演训详情
    if (this.resource_id) {
      getEditBackApi({ resource_id: this.resource_id }).then(async (res) => {
        this.crEventData = res.data;
        this.breadcrumbName = res.data.data.name;
        this.screenName = res.data.data.name;
        setBreadcrumbTitle(this.breadcrumbName);
        this.detailTitle =
          DETAIL_TITLE_TEACHER_NAME[this.$route.name] +
          '-' +
          this.breadcrumbName;
      });
      this.getEntranceInfo();
    }
    this.getTrainStatus();
    this.detailTitle =
      // (await getCurrentModuleByRouterName('group-training')) +
      DETAIL_TITLE_TEACHER_NAME[this.$route.name] +
      '-' +
      this.breadcrumbName;
    this.getMark();
  },
  beforeDestroy() {
    // this.$refs.charTool.setConfig(false);
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.marketReportWs();
  },

  methods: {
    marketReportWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          if (data.code === 8) {
            // 更新任务裁决标记
            this.markStatus = true;
            //更新时间轴;new Date().getTime()便于及时更新时间轴
            this.timeLineUpData = new Date().getTime();
          }
          console.log(data.code, '团队教员ws');
          // 更新时间轴标记相关
          if (data.code === 9) {
            console.log(data.code, '团队教员成功');
            this.timeLineUpData = new Date().getTime();
          }
        },
      );
    },
    // 点击任务裁决红点取消
    getCancelMark() {
      getCancelMarkApi({ resource_id: this.resource_id }).then((res) => {
        this.markStatus = false;
      });
    },
    // 任务裁决是否显示红点
    getMark() {
      getTaskMarkApi({ resource_id: this.resource_id }).then((res) => {
        this.markStatus = res.data.data.show;
      });
    },
    getUserInfo() {
      getUserInfo().then((res) => { });
    },
    // 获取跳转3D态势的sceneId,topo_id
    sceneId(data) {
      this.sceneIdData = data;
      this.collectId = data; //获取场景id传给探针采集页面
    },
    topoId(data) {
      this.topo_id = data;
    },
    // 团队跳转3D态势
    gotoDataScreen() {
      const path = '/page/mg/admin/screen-3/visual-screen';
      if (this.sceneIdData) {
        window.open(
          `${path}?name=${this.screenName}&room_id=${this.resource_id}&scene_id=${this.sceneIdData}`,
          '_blank',
        );
      } else if (this.topo_id) {
        window.open(
          `${path}?name=${this.screenName}&room_id=${this.resource_id}&topo_id=${this.topo_id}`,
          '_blank',
        );
      }
    },
    // 点击返回按钮
    backHome() {
      this.$router.go(-1);
    },
    // 团队教员获取训练状态
    getTrainStatus() {
      getSceneStatusApi({ resource_id: this.resource_id })
        .then((res) => {
          this.training_status = res.data.data.training_status;
          // 场景状态 0未开始 1已开始 2已结束
          if (res.data.data.training_status === 0) {
            this.isStart = true;
          } else if (res.data.data.training_status === 1) {
            this.isStart = false;
            this.sceneStatus = true;
          } else if (res.data.data.training_status === 2) {
            this.isStart = false;
            this.sceneStatus = false;
            this.isEnd = true;
          }
        })
        .catch(() => { });
    },
    //团队教员结束训练
    endTraining() {
      this.$confirm(this.$t('rbt.confirmEndTrain') + '？').then(() => {
        endTrainingApi({
          resource_id: this.resource_id,
        })
          .then((res) => {
            if (res.data.data.training_status === 2) {
              this.isStart = false;
              this.sceneStatus = false;
              this.$message.success(this.$t('m.TrainingIsOverTips'));
            }
          })
          .catch((error) => { });
      });
    },
    // 团队教员开始训练
    startTraining() {
      this.$confirm(this.$t('rbt.confirmStartTrain') + '？').then(() => {
        startTrainingApi({
          resource_id: this.resource_id,
        })
          .then((res) => {
            if (res.data.data.training_status === 1) {
              this.isStart = false;
              this.sceneStatus = true;
              this.$message.success(this.$t('m.StartTrainingSuccessTips'));
            }
          })
          .catch((error) => { });
      });
    },

    getChildComVal(val) {
      this.isCheck = val;
    },
    getChildComVals(val) {
      this.isChecks = val;
    },
    getNewCheckValue(val) {
      this.isCheckValue = val;
    },
    getNewChecksValue(val) {
      this.isChecksValue = val;
    },
    // 编辑训练
    editInstance() {
      this.$router.push({
        name: this.$route.name + '-edit',
        params: {
          id: this.resource_id,
        },
      });
      // this.dialogEditVisible = true;
    },
    // 综合演训教员删除训练
    deleteTeamTrain(done) {
      this.$confirm(this.$t('common.confirmDelete') + '?').then(() => {
        deleteTrainingApi({ room_id: this.resource_id })
          .then((res) => {
            this.$message({
              type: 'success',
              message: this.$t('common.deleteSuccessful'),
            });
            this.backHome();
            // this.$router.push({
            //   name: 'group-training',
            // });
            done();
          })
          .catch((res) => {
            done(false);
          });
      });
    },
    saveUpdate() {
      if (!this.isCheck || !this.isChecks) {
        if (this.isCheckValue) {
          return this.$message.error(this.isCheckValue);
        } else {
          return this.$message.error(this.isChecksValue);
        }
      }
      this.$refs.editContent.submitForm();
    },
    getEntranceInfo() {
      getSituationApi({ room_id: this.resource_id })
        .then((res) => {
          this.entranceInfo = _.get(res, 'data.data', {}) || {};
        })
        .catch((res) => { });
    },
    // 团队跳转实景拓扑
    gotoRealityScreen() {
      const path = `/page/mg/screen_business/${this.resource_id}`;
      if (this.sceneIdData) {
        window.open(
          `${path}?scene_id=${this.sceneIdData}&name=${this.screenName}`,
          '_blank',
        );
      } else if (this.topo_id) {
        window.open(
          `${path}?topo_id=${this.topo_id}&name=${this.screenName}`,
          '_blank',
        );
      }
    },
    // 场景排队
    sceneQueue() {
      this.sceneQueueDialogVisible = true;
    },
    getData(hasLayer) { },
  },
};
</script>

<style lang="scss" scoped>
.mark-style {
  position: relative;

  &:after {
    right: 6px;
    top: 18px;
    position: absolute;
    display: block;
    content: ' ';
    clear: both;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background: var(--red-color);
  }
}

.admin-home {
  width: 100%;
  height: 100vh;
  position: relative;

  .header {
    height: 56px;
    line-height: 56px;
    position: relative;

    .title {
      position: absolute;
      left: 100px;
      top: 0;
      font-size: 24px;
    }

    .header-right {
      position: absolute;
      right: 16px;
      top: 0px;
      z-index: 1000;
    }
  }

  .content {
    height: calc(100% - 56px);
    padding: 0 40px 16px 40px;

    .nav-wrap {
      height: 56px;
      line-height: 56px;
      text-align: center;
      position: relative;

      .btn-wrap {
        min-width: 74px;
        height: 56px;
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;

        .btn-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: var(--primary-color);
          cursor: pointer;

          .cb-iconfont {
            margin-right: 4px;
          }
        }
      }

      ::v-deep .radio-btn {
        .el-radio-button {
          .el-radio-button__inner {
            &:hover {
              color: var(--primary-color);
            }
          }
        }
      }
    }

    .train-wrap {
      height: calc(100% - 56px);
    }
  }
}
</style>
