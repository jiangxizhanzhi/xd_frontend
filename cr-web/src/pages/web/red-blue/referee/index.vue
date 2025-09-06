<template>
  <div class="referee-home lay-com">
    <div class="header">
      <train-top-title
        :detail-title="detailTitle"
        @back="backHome"
        :isEnd="isEnd"
      ></train-top-title>
    </div>
    <div class="content">
      <div class="nav-wrap">
        <cb-radio-group v-model="tabActive" class="radio-btn" size="small">
          <cb-radio-button
            :class="markStatus ? 'mark-style' : ''"
            :label="$t('rbt.taskAdjudication')"
          ></cb-radio-button>
          <cb-radio-button :label="$t('rbt.probeCollection')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.flowAnalysis')"></cb-radio-button>
          <cb-radio-button
            :label="$t('rbt.screenMonitoring')"
          ></cb-radio-button>
          <cb-radio-button :label="$t('rbt.studentRatings')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.trainReport')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.trainManual')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.monitorReplay')"></cb-radio-button>
        </cb-radio-group>
        <!-- 对抗态势、3d拓扑 -->
        <div class="btn-wrap">
          <div class="btn-item" @click="gotoDataVis">
            <cb-button type="text" icon="icon-honglanduikang">{{
              $t('m.dataVis')
            }}</cb-button>
          </div>
          <div class="btn-item">
            <cb-button
              type="text"
              icon="icon-tuopu"
              @click="gotoDataScreen"
              style="margin-left: 8px"
            >
              {{ $t('m.dtopology') }}
            </cb-button>
          </div>
        </div>
      </div>
      <div class="train-wrap">
        <task-adjudication
          ref="taskAdjudicationRef"
          v-if="tabActive === $t('rbt.taskAdjudication')"
          :cr-event-data="crEventData"
        ></task-adjudication>
        <probe-collection
          v-if="tabActive === $t('rbt.probeCollection')"
          :sceneId="sceneId"
        ></probe-collection>
        <flow-analysis
          v-if="tabActive === $t('rbt.flowAnalysis')"
          :sceneId="sceneId"
        ></flow-analysis>
        <screen-monitoring
          v-show="tabActive === $t('rbt.screenMonitoring')"
        ></screen-monitoring>
        <student-rating
          v-if="tabActive === $t('rbt.studentRatings')"
          :resource_id="resource_id"
        ></student-rating>
        <training-report
          v-if="tabActive === $t('rbt.trainReport')"
          :cr-event-data="crEventData"
          :resource_id="resource_id"
          :sceneId="sceneId"
        ></training-report>
        <training-manual
          v-if="tabActive === $t('rbt.trainManual')"
        ></training-manual>
        <replay
          v-show="tabActive === $t('rbt.monitorReplay')"
          :sceneId="replaySceneId"
          :topoId="topo_id"
        ></replay>
      </div>
    </div>
    <div class="char-box">
      <ChatTool ref="charTool" />
    </div>
    <Notice
      ref="noticeRef"
      type="red"
      :resourceId="resource_id"
      :role="roleGroup"
    />
  </div>
</template>

<script>
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import TrainTopTitle from '@/components/student-common-detail/train-top-title/index.vue';
import taskAdjudication from './components/task-adjudication/index.vue';
import probeCollection from './components/probe-collection/index.vue';
import flowAnalysis from './components/flow-analysis/index.vue';
import screenMonitoring from './components/screen-monitoring/index.vue';
import studentRating from './components/student-rating/index.vue';
import trainingReport from './components/training-report/index.vue';
import trainingManual from './components/training-manual/index.vue';
// import replay from '@/components/replay/index.vue';5.4复盘回放
import replay from '@/components/red-blue-rb-replay/index.vue'; //新的复盘回放
import ChatTool from '@/components/ChatTools/index.vue';
import Notice from '@/pages/web/notice/index.vue';
import {
  getEditBack,
  getRefereeBadge,
  cancelRefereeBadge,
} from '@/api/web/red-blue';
import { getLanguage, routerResolve } from '@cyber/helper';
import { getRedBlueReplayEnable } from '@/api/web/replay';
import { getSysSettings } from '@cyber/helper';
import { getCurrentModuleByRouterName } from '../../../../utils';

export default {
  components: {
    TrainTopTitle,
    taskAdjudication,
    probeCollection,
    flowAnalysis,
    screenMonitoring,
    studentRating,
    trainingReport,
    trainingManual,
    replay,
    ChatTool,
    Notice,
  },
  props: {},
  data() {
    return {
      isEnd: false, //已结束展示结束标记
      markStatus: false,
      cookie: '',
      tabActive: this.$t('rbt.taskAdjudication'),
      resource_id: this.$route.params && this.$route.params.resource_id,
      breadcrumbName: '',
      screenName: '',
      crEventData: {},
      role_group: '',
      sceneId: '',
      //复盘专用sceneId
      replaySceneId: '',
      topo_id: '',
      detailTitle: '',
    };
  },
  watch: {
    tabActive: {
      handler: function (nv, ov) {
        if (nv !== ov) {
          if (
            nv === this.$t('rbt.taskAdjudication') ||
            nv === this.$t('rbt.probeCollection') ||
            nv === this.$t('rbt.flowAnalysis')
          ) {
            this.$request
              .get(
                '/cr/red_vs_blue/scene/',
                { room_id: this.resource_id },
                { baseURL: '/api/ojj' },
              )
              .then((res) => {
                // 场景id
                // 接口返回场景sceneId(mp_scene_id)
                this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
                //返回topo_id
                this.topo_id = _.get(res, 'data.data.topo_id', '') || '';
                if (!res?.data?.data.scene_data) {
                  this.$message({
                    message: this.$t('m.instanceNotStarted'),
                    type: 'error',
                  });
                }
              });
          } else if (nv === this.$t('rbt.monitorReplay')) {
            getRedBlueReplayEnable({ resource_id: this.resource_id })
              .then((res) => {
                this.replaySceneId = _.get(res, 'data.data', '') || '';
              })
              .catch(() => {
                this.replaySceneId = '';
              });
          }
        }
        // 点击任务裁决取消红点
        if (nv === this.$t('rbt.taskAdjudication')) {
          this.cancelRefereeBadge();
        }
      },
      immediate: true, // 关键
      deep: true,
    },
  },
  computed: {
    roleGroup() {
      return _.get(this.crEventData, 'data.role_permission.role_group');
    },
  },
  async created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getRefereeBadge();
    //红蓝对抗查询单个
    if (this.resource_id) {
      getEditBack({ resource_id: this.resource_id }).then(async (res) => {
        this.screenName = res.data.data.name;
        this.breadcrumbName = res.data.data.name;
        this.crEventData = res.data;
        if (this.crEventData.data.training_status === 0) {
          this.isEnd = true;
        }
        this.role_group = res.data.data.role_permission.role_group;
        const role_user = [];
        this.crEventData.data.role_permission.chart_info.role_data_list.forEach(
          (role) => {
            role.user_infos.forEach((user) => {
              role_user.push({
                role_name: this.getRoleName(role.role_group) || role.role_name,
                role_group: role.role_group,
                role_color: this.getRoleColor(role.role_group),
                role_user: user.rep_name,
                role_logo: user.logo,
              });
            });
          },
        );
        this.$set(
          this.crEventData.data.role_permission,
          'role_data_list',
          role_user,
        );
        this.detailTitle =
          (await getCurrentModuleByRouterName('red-vs-blue')) +
          '-' +
          this.breadcrumbName;
      });
    }
  },
  mounted() {
    getSysSettings().then((res) => {
      document.title = _.get(
        this.$store.state.user,
        'system_setting.system_name',
      );
    });
    this.cookie = utils.getCookie('cr_jwttoken');
    this.statusWs();
  },
  methods: {
    backHome() {
      this.$router.go(-1);
    },
    getRefereeBadge() {
      getRefereeBadge({ resource_id: this.resource_id }).then((res) => {
        this.markStatus = res.data.data.show;
      });
    },
    cancelRefereeBadge() {
      cancelRefereeBadge({ resource_id: this.resource_id }).then((res) => {
        this.markStatus = false;
      });
    },
    // 对抗态势
    gotoDataVis() {
      let toPath = '';
      if (parseInt(this.role_group) === 2 || parseInt(this.role_group) === 3) {
        toPath =
          '/data-display/battle/' + this.resource_id + '/' + this.role_group;
      }

      if (parseInt(this.role_group) === 4) {
        toPath =
          '/data-display/red-grade/' + this.resource_id + '/' + this.role_group;
      }

      if (parseInt(this.role_group) === 5) {
        toPath =
          '/data-display/blue-grade/' +
          this.resource_id +
          '/' +
          this.role_group;
      }
      const { href } = routerResolve({
        path: toPath,
      });
      window.open(href, '_blank');

      /*const routeData = this.$router.resolve({
        path: toPath,
      });
      window.open(routeData.href, '_blank');
      */
    },
    // 3D拓扑
    gotoDataScreen() {
      const path = '/page/mg/admin/screen-3/visual-screen';
      // window.open(path, '_blank');
      if (this.topo_id) {
        window.open(
          `${path}?name=${this.screenName}&room_id=${this.resource_id}&topo_id=${this.topo_id}`,
          '_blank',
        );
      } else if (this.sceneId) {
        window.open(
          `${path}?name=${this.screenName}&room_id=${this.resource_id}&scene_id=${this.sceneId}`,
          '_blank',
        );
      }
    },
    getRoleName(role) {
      let name = '';
      if (role === this.$CONSTANT.Role.RedVsBlue.ADMIN.value) {
        name = this.$t('common.admin');
      } else if (role === this.$CONSTANT.Role.RedVsBlue.DIRECTOR.value) {
        name = this.$t('common.director');
      } else if (role === this.$CONSTANT.Role.RedVsBlue.REFEREE.value) {
        name = this.$t('common.referee');
      }
      return name;
    },
    getRoleColor(role) {
      let color = '';
      if (role === this.$CONSTANT.Role.RedVsBlue.ADMIN.value) {
        color = 'color-sky-blue';
        // 'linear-gradient(0deg,rgba(88,255,253,1) 0%, rgba(0,237,223,1) 100%)'
      } else if (role === this.$CONSTANT.Role.RedVsBlue.DIRECTOR.value) {
        color = 'color-green';
        // 'linear-gradient(180deg,rgba(0,255,126,1) 0%, rgba(12,243,168,1) 100%)'
      } else if (role === this.$CONSTANT.Role.RedVsBlue.REFEREE.value) {
        color = 'color-yellow';
        // 'linear-gradient(0deg,rgba(255,173,57,1) 0%, rgba(228,137,39,1) 100%)'
      } else if (role === this.$CONSTANT.Role.RedVsBlue.REDUSER.value) {
        color = 'color-red';
        // 'linear-gradient(180deg,rgba(255,88,49,1) 0%, rgba(255,22,22,1) 100%)'
      } else if (role === this.$CONSTANT.Role.RedVsBlue.BLUEUSER.value) {
        color = 'color-blue';
        // 'linear-gradient(180deg,rgba(57,239,255,1) 0%, rgba(58,165,255,1) 100%)'
      }
      return color;
    },
    statusWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          // 0: 已停止   1：已挂起    2：已开始   3：已恢复  4：未开始
          if (data.code === 8) {
            // 裁判监听到任务提交
            this.$refs.taskAdjudicationRef.getAssessList();
            this.$refs.taskAdjudicationRef.getTaskCount();
            this.$refs.taskAdjudicationRef.initTimeLineData();
            this.markStatus = true;
          }
          // 更新时间轴标记相关
          if (data.code === 9) {
            this.$refs.taskAdjudicationRef.initTimeLineData();
          }
          if (data.runningStatus === 1) {
            // 暂停
            this.$message.success(this.$t('device.pause'));
            this.$refs.taskAdjudicationRef.pauseCombatTime();
          }
          if (data.runningStatus === 2) {
            this.$message.success(this.$t('device.running'));
          }
          if (data.runningStatus === 3) {
            // 恢复
            this.$message.success(this.$t('device.recover'));
            this.$refs.taskAdjudicationRef.recoverCombatTime();
          }
          if (data.runningStatus === 0) {
            // 停止
            this.$message.success(this.$t('device.stop'));
            this.$refs.taskAdjudicationRef.stopCombatTime();
          }
          if (data.runningStatus === 4) {
            this.$message.success(this.$t('device.nostart'));
          }
        },
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.referee-home {
  width: 100%;
  height: 100vh;
  position: relative;
  .header {
    height: 56px;
    line-height: 56px;
    position: relative;
  }

  .content {
    height: calc(100% - 56px);
    padding: 0 40px 16px 40px;
    .nav-wrap {
      height: 56px;
      line-height: 56px;
      text-align: center;
      position: relative;
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
      .btn-wrap {
        min-width: 170px;
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
          margin-left: 16px;
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
