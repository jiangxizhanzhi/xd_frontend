<template>
  <div class="director-home lay-com">
    <div class="header">
      <train-top-title
        :detail-title="detailTitle"
        @back="backHome"
        :isEnd="isEnd"
      ></train-top-title>
      <div class="header-right">
        <cb-button
          v-if="!isEnd"
          icon="icon-jieshu"
          hollow
          :disabled="isDisabledStop"
          @click="stopTime"
        >
          {{ $t('rbt.endTrain') }}
        </cb-button>
        <cb-button
          v-if="
            rangeState !== $CONSTANT.CrEventScene.TimeStatus.PAUSE.value &&
            rangeState !== $CONSTANT.CrEventScene.TimeStatus.RECOVERY.value &&
            rangeState !== $CONSTANT.CrEventScene.TimeStatus.STOP.value &&
            statusId === 0
          "
          icon="icon-huifu"
          hollow
          :disabled="!value1 && !value2"
          @click="startManagement"
        >
          {{ $t('rbt.startTrain') }}
        </cb-button>
        <cb-button
          v-if="
            rangeState === $CONSTANT.CrEventScene.TimeStatus.START.value ||
            rangeState === $CONSTANT.CrEventScene.TimeStatus.RECOVERY.value
          "
          icon="icon-zanting"
          hollow
          :disabled="!value1 && !value2"
          @click="startManagement"
        >
          {{ $t('rbt.stopTrain') }}
        </cb-button>
        <cb-button
          v-if="rangeState === $CONSTANT.CrEventScene.TimeStatus.PAUSE.value"
          icon="icon-huifu"
          hollow
          :disabled="!value1 && !value2"
          @click="startManagement"
        >
          {{ $t('rbt.resumeTrain') }}
        </cb-button>
      </div>
    </div>
    <div class="content">
      <div class="nav-wrap">
        <cb-radio-group v-model="tabActive" class="radio-btn" size="small">
          <cb-radio-button :label="$t('rbt.pilotControl')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.probeCollection')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.flowAnalysis')"></cb-radio-button>
          <cb-radio-button
            :label="$t('rbt.screenMonitoring')"
          ></cb-radio-button>
          <cb-radio-button :label="$t('rbt.trainManual')"></cb-radio-button>
          <cb-radio-button :label="$t('rbt.monitorReplay')"></cb-radio-button>
        </cb-radio-group>
        <!-- 对抗态势、3d拓扑 -->
        <div class="btn-wrap">
          <div class="btn-item" @click="gotoDataVis">
            <cb-button type="text" icon="icon-honglanduikang">
              {{ $t('m.dataVis') }}
            </cb-button>
          </div>
          <div class="btn-item">
            <cb-button
              type="text"
              icon="icon-tuopu"
              @click="gotoDataScreen"
              style="margin-left: 8px"
              >{{ $t('m.dtopology') }}
            </cb-button>
          </div>
        </div>
      </div>
      <div class="train-wrap">
        <direct-control
          v-if="tabActive === $t('rbt.pilotControl')"
          :isShowRate="isShowRate"
          :value1="value1"
          :value2="value2"
          :screenName="breadcrumbName"
          :operationalValue2="operationalValue2"
          :operationalValue1="operationalValue1"
          :rateSubmitValue="rateSubmitValue"
          @sure2="sure2"
          @sure="sure"
          @sendData="getData"
          :cr-event-data="crEventData"
          :isShowSituationData="isShowSituationData"
        ></direct-control>
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
        <training-manual
          v-if="tabActive === $t('rbt.trainManual')"
        ></training-manual>
        <replay
          v-if="tabActive === $t('rbt.monitorReplay')"
          :sceneId="replaySceneId"
          :topoId="topo_id"
        ></replay>
      </div>
    </div>
    <!-- 授时 -->
    <timing
      v-if="isShowRate"
      :resourceId="resource_id"
      :rateSubmitValue="rateSubmitValue"
      :astronomicalTime="model2.value3"
      :operationTime="model.operationalValue"
      @sure2="sure2"
      @sure="sure"
    ></timing>
    <!-- 聊天 -->
    <div class="char-box">
      <ChatTool ref="charTool" />
    </div>
    <!-- 文书 -->
    <base-document :resourceId="resource_id"></base-document>
    <!-- 公告 -->
    <Notice
      ref="noticeRef"
      type="red"
      :resourceId="resource_id"
      :role="roleGroup"
    />
  </div>
</template>

<script>
import TrainTopTitle from '@/components/student-common-detail/train-top-title/index.vue';
import ChatTool from '@/components/ChatTools/index.vue';
import directControl from './components/direct-control/index.vue';
import probeCollection from './components/probe-collection/index.vue';
import flowAnalysis from './components/flow-analysis/index.vue';
import screenMonitoring from './components/screen-monitoring/index.vue';
import trainingManual from './components/training-manual/index.vue';
// import replay from '@/components/replay/index.vue'; //5.4复盘回放
import replay from '@/components/red-blue-rb-replay/index.vue'; //新的复盘回放
import Notice from '@/pages/web/notice/index.vue';
import { timeLine } from '@/api/web/task_editor.js';
import BaseDocument from '@/pages/web/document/index.vue';
import timing from '@/pages/web/timing/index.vue';
import { getData, postData, getTimeApi } from '@/api/common';
import { getSysSettings } from '@cyber/helper';

import {
  TimeManagement,
  pauseScene,
  resumeScene,
} from '@/api/web/dispatching_guidance';
import {
  getEditBack,
  getRoleScoreInfo,
  getCurrentTime,
  deleteTraining,
} from '@/api/web/red-blue';
import { getIsShowApi } from '@/api/web/team-training';
import { getLanguage, routerResolve } from '@cyber/helper';
import { getRedBlueReplayEnable } from '@/api/web/replay';
import { getCurrentModuleByRouterName } from '../../../../utils';

export default {
  components: {
    TrainTopTitle,
    ChatTool,
    directControl,
    probeCollection,
    flowAnalysis,
    screenMonitoring,
    trainingManual,
    replay,
    Notice,
    BaseDocument,
    timing,
  },
  data() {
    return {
      tabActive: this.$t('rbt.pilotControl'),
      language: getLanguage(),
      isEnd: false, //已结束展示结束标记
      rateLeftLabel: this.$t('m.rate') + ' 1',
      resource_id: '',
      breadcrumbName: '',
      Router: '/red_vs_blue',
      crEventData: {},
      model: {
        operationalValue: '',
      },
      rules: {
        operationalValue: [
          {
            required: true,
            message: this.$t('m.selectTime'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      operationalValue1: '',
      operationalValue2: '',
      // operationalWeek: '',
      model2: {
        value3: '',
      },
      rules2: {
        value3: [
          {
            required: true,
            message: this.$t('m.selectTime'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      value1: '',
      value2: '',
      // valueWeek: '',
      timer: '',
      timer2: '',
      timer3: '',
      time_resource_id: null,
      rangeState: null,
      isPause: false,
      isStop: false,
      isDisabled: true,
      isDisabledStop: true,
      // 启动靶场按钮
      start_or_recovery_name: this.$t('m.startUpTime'),
      statusId: 0,
      stop_or_stopped: this.$t('m.stop'),
      rateValue: 1,
      rateSubmitValue: 1,
      rateList: [
        { id: 1, rate: 1 },
        { id: 2, rate: 2 },
        { id: 3, rate: 3 },
        { id: 4, rate: 4 },
        { id: 5, rate: 5 },
      ],
      isAmplification: false,
      isShowRate: true,
      showRate: false,
      dialogRateTime: false,

      performanceData: {
        redScore: 0,
        redProgress: 0,
        blueScore: 0,
        blueProgress: 0,
      },
      refreshTime: null,
      rateTimeTitle: '',
      role_group: '',
      sceneId: '',
      //复盘专用sceneId
      replaySceneId: '',
      topo_id: '',
      isShowSituationData: false,
      detailTitle: '',
    };
  },
  computed: {
    roleGroup() {
      return _.get(this.crEventData, 'data.role_permission.role_group');
    },
  },
  watch: {
    tabActive: {
      handler: function (nv, ov) {
        if (nv !== ov) {
          if (
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
      },
      immediate: true, // 关键
      deep: true,
    },
  },
  async created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getSituationData();
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
    this.initData();
    this.initGradeData();
    // this.initTimeLineData();
    this.refreshTime = setInterval(() => {
      this.initGradeData();
      // this.initTimeLineData();
    }, 60000);
  },
  beforeDestroy() {
    clearInterval(this.refreshTime);
  },
  destroy() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    clearInterval(this.timer3);
    clearInterval(this.refreshTime);
  },
  methods: {
    backHome() {
      this.$router.go(-1);
    },
    getSituationData() {
      getIsShowApi().then((res) => {
        res.data.data.forEach((item) => {
          if (item.name === 'isShowSituation') {
            if (item.content === 'false' || item.content === false) {
              this.isShowSituationData = false;
            } else if (item.content === 'true' || item.content === true) {
              this.isShowSituationData = true;
            }
          }
        });
      });
    },
    getData(data1, data2, data3) {
      this.sceneId = data1;
      this.topo_id = data2;
    },
    initGradeData() {
      // 学员角色查询训练得分信息
      getRoleScoreInfo({ resource_id: this.resource_id }).then((res) => {
        _.forEach(res.data.data, (children) => {
          if (
            children.role_group === this.$CONSTANT.Role.RedVsBlue.REDUSER.value
          ) {
            this.performanceData.redScore = children.score;
            this.performanceData.redProgress =
              children.missions_info[1] === 0
                ? 0
                : Math.ceil(
                    (children.missions_info[0] / children.missions_info[1]) *
                      100,
                  );
          } else {
            this.performanceData.blueScore = children.score;
            this.performanceData.blueProgress =
              children.missions_info[1] === 0
                ? 0
                : Math.ceil(
                    (children.missions_info[0] / children.missions_info[1]) *
                      100,
                  );
          }
        });
      });
    },
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
    // 导演跳转3D态势
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
    // 天文时间作战时间
    // 导演登录获取时间管理数据
    initData() {
      getData(this.url, { resource_id: this.resource_id }).then((res) => {
        const datas = res.data.data;
        if (!_.isEmpty(datas)) {
          const first_data = datas;
          this.model2.value3 = first_data.current_astronomical_time;
          this.model.operationalValue = first_data.current_combat_time;
          this.rateSubmitValue = first_data.rate;
          this.time_resource_id = first_data.resource_id;
          this.isStop = first_data.status === 0;
          this.control(first_data.status);
          this.sure();
          this.sure2();
          this.isShowRate = false;
        } else {
          // 未启动训练获取时间,有的话走接口没有模拟假数据
          // 获取时长接口
          getTimeApi({ resource_id: this.resource_id }).then((res) => {
            if (res.data.data) {
              this.model2.value3 = res.data.data.astronomical_time;
              this.rateSubmitValue = res.data.data.rate;
              // 天文时间
              const dateTmp = res.data.data.astronomical_time.replace(
                /-/g,
                '/',
              ); //为了兼容IOS，需先将字符串转换为'2018/9/11 9:11:23'
              let timestamp = Date.parse(dateTmp); //返回'2018-9-12 9:11:23'的时间戳
              this.timer = setInterval(() => {
                timestamp += 1000;
                const d = new Date(timestamp);
                this.value1 =
                  d.getFullYear() +
                  '-' +
                  this.p(d.getMonth() + 1) +
                  '-' +
                  this.p(d.getDate());
                this.value2 =
                  this.p(d.getHours()) +
                  ':' +
                  this.p(d.getMinutes()) +
                  ':' +
                  this.p(d.getSeconds());
              }, 1000);
              // 作战时间
              const splitCurrentTime = _.split(res.data.data.combat_time, ' ');

              this.operationalValue2 = splitCurrentTime[0];
              this.operationalValue1 = splitCurrentTime[1];
              this.model.operationalValue = this.parserDate(
                this.operationalValue2 + ' ' + this.operationalValue1,
              );
            } else {
              // 模拟假数据
              this.rangeState = null;
              this.isDisabled = true;
              this.format();
            }
          });
        }
      });
    },
    sure(data) {
      if (data) {
        this.model2.value3 = data;
      }
      clearInterval(this.timer3);
      if (this.model2.value3) {
        clearInterval(this.timer);
        const _this = this;
        const d = new Date(this.model2.value3);
        this.timer3 = setInterval(function () {
          var d_s = d.getTime(); // 转化为时间戳毫秒数
          d.setTime(d_s + 1000);
          const resDate =
            d.getFullYear() +
            '-' +
            _this.p(d.getMonth() + 1) +
            '-' +
            _this.p(d.getDate());
          const resTime =
            _this.p(d.getHours()) +
            ':' +
            _this.p(d.getMinutes()) +
            ':' +
            _this.p(d.getSeconds());
          _this.value1 = resDate;
          _this.value2 = resTime;
          // _this.valueWeek = _this.formatWeekLanguage(resDate);
        }, 1000);
      }
    },
    formatWeekLanguage(time) {
      let weekFormat = '';
      const week = moment(time).format('dddd');
      if (this.language === 'en') {
        // 英文
        weekFormat = week;
      } else {
        // zh 中文
        if (week === 'Monday') {
          weekFormat = '星期一';
        } else if (week === 'Tuesday') {
          weekFormat = '星期二';
        } else if (week === 'Wednesday') {
          weekFormat = '星期三';
        } else if (week === 'Thursday') {
          weekFormat = '星期四';
        } else if (week === 'Friday') {
          weekFormat = '星期五';
        } else if (week === 'Saturday') {
          weekFormat = '星期六';
        } else if (week === 'Sunday') {
          weekFormat = '星期日';
        }
      }
      return weekFormat;
    },
    sure2(time, rate) {
      if (time) {
        this.model.operationalValue = time;
      }
      if (rate) {
        this.rateSubmitValue = rate;
      }
      if (this.model.operationalValue) {
        const d = new Date(this.model.operationalValue);
        const resDate =
          d.getFullYear() +
          '-' +
          this.p(d.getMonth() + 1) +
          '-' +
          this.p(d.getDate());
        const resTime =
          this.p(d.getHours()) +
          ':' +
          this.p(d.getMinutes()) +
          ':' +
          this.p(d.getSeconds());
        this.operationalValue2 = resDate;
        this.operationalValue1 = resTime;
        // this.operationalWeek = this.formatWeekLanguage(resDate);
      }
    },
    p(s) {
      return s < 10 ? '0' + s : s;
    },
    control(status) {
      if (status === this.$CONSTANT.CrEventScene.TimeStatus.START.value) {
        // 2
        this.start_or_recovery_name = this.$t('m.pause');
        this.isDisabled = true;
        this.isPause = false;
        this.isDisabledStop = false;
        this.statusId = 1;
        this.startTime(status);
        this.rangeState = this.$CONSTANT.CrEventScene.TimeStatus.START.value;
      }
      if (status === this.$CONSTANT.CrEventScene.TimeStatus.PAUSE.value) {
        // 1
        this.start_or_recovery_name = this.$t('m.recoveryTime');
        this.statusId = 0;
        this.isDisabled = true;
        this.isDisabledStop = false;
        this.isPause = false;
        this.stopCombatTime();
        this.rangeState = this.$CONSTANT.CrEventScene.TimeStatus.PAUSE.value;
      }
      if (status === this.$CONSTANT.CrEventScene.TimeStatus.RECOVERY.value) {
        // 3
        this.start_or_recovery_name = this.$t('m.pause');
        this.statusId = 1;
        this.isDisabled = true;
        this.isPause = true;
        this.isDisabledStop = false;
        this.startTime(status);
        this.rangeState = this.$CONSTANT.CrEventScene.TimeStatus.RECOVERY.value;
      }
      if (status === this.$CONSTANT.CrEventScene.TimeStatus.STOP.value) {
        // 0
        this.isStop = true;
        this.stop_or_stopped = this.$t('m.hasStopped');
        this.isDisabled = false;
        this.isDisabledStop = true;
        this.stopCombatTime();
        this.rangeState = this.$CONSTANT.CrEventScene.TimeStatus.STOP.value;
      }
    },
    // 初始化时间
    format() {
      if (!this.model2.value3 || !this.model.operationalValue) {
        getCurrentTime().then((res) => {
          const currentTime = _.get(res, 'data.data.current_time');
          // 获取一开始的天文时间
          this.model2.value3 = currentTime;
          const splitCurrentTime = _.split(currentTime, ' ');
          // 未启动时，作战时间
          this.operationalValue2 = splitCurrentTime[0];
          this.operationalValue1 = splitCurrentTime[1];
          this.model.operationalValue = this.parserDate(
            this.operationalValue2 + ' ' + this.operationalValue1,
          );
          const dateTmp = currentTime.replace(/-/g, '/'); //为了兼容IOS，需先将字符串转换为'2018/9/11 9:11:23'
          let timestamp = Date.parse(dateTmp); //返回'2018-9-12 9:11:23'的时间戳
          this.timer = setInterval(() => {
            timestamp += 1000;
            const d = new Date(timestamp);
            this.value1 =
              d.getFullYear() +
              '-' +
              this.p(d.getMonth() + 1) +
              '-' +
              this.p(d.getDate());
            this.value2 =
              this.p(d.getHours()) +
              ':' +
              this.p(d.getMinutes()) +
              ':' +
              this.p(d.getSeconds());
          }, 1000);
        });
      }
    },
    // 获取导演时间列表
    // initTimeLineData() {
    //   // 导演登录获取作战时间
    //   timeLine(this.url, { resource_id: this.resource_id }).then((res) => {
    //     this.scaleTimes = res.data.data;
    //   });
    // },
    // 时间转换
    parserDate(date) {
      var t = Date.parse(date);
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, '/')));
      }
    },
    // 暂停作战时间
    suspend() {
      this.$confirm(this.$t('rbt.confirmStopTrain') + '？').then(() => {
        this.updateData(this.$CONSTANT.CrEventScene.TimeStatus.PAUSE.value);
      });
    },
    // 关闭作战时间
    stopTime() {
      this.$confirm(this.$t('rbt.confirmEndTrain') + '？').then(() => {
        this.updateData(this.$CONSTANT.CrEventScene.TimeStatus.STOP.value);
      });
    },
    stopCombatTime() {
      clearInterval(this.timer2);
    },
    startManagement() {
      // 启动靶场
      if (this.value1 && this.value2) {
        const url = '/cr/red_vs_blue/red_vs_blue/create_time_management';
        const astronomical_time = _.join([this.value1, this.value2], ' ');
        const combat_time = _.join(
          [this.operationalValue2, this.operationalValue1],
          ' ',
        );
        const data = {
          astronomical_time: astronomical_time,
          combat_time: combat_time,
          rate: this.rateSubmitValue,
          // cr_scene_case: this.resource_id,
          // red_vs_blue: this.resource_id,
          room_id: this.resource_id,
        };
        if (this.time_resource_id !== null) {
          // 暂停
          if (
            this.rangeState ===
              this.$CONSTANT.CrEventScene.TimeStatus.START.value ||
            this.rangeState ===
              this.$CONSTANT.CrEventScene.TimeStatus.RECOVERY.value
          ) {
            this.suspend();
          } else {
            this.$confirm(this.$t('rbt.confirmResumeTrain') + '？').then(() => {
              // 恢复作战时间
              this.updateData(
                this.$CONSTANT.CrEventScene.TimeStatus.RECOVERY.value,
                this.startTime,
              );
            });
          }
        } else {
          this.$confirm(this.$t('rbt.confirmStartTrain') + '？').then(() => {
            this.createData(url, data, this.startTime);
          });
        }
      }
    },
    // 开始作战时间
    startTime(status) {
      this.stopCombatTime();
      let currentCombat = this.model.operationalValue;
      if (
        status === this.$CONSTANT.CrEventScene.TimeStatus.RECOVERY.value &&
        this.operationalValue2
      ) {
        currentCombat = this.operationalValue2.concat(
          ' ',
          this.operationalValue1,
        );
      } else if (
        status === this.$CONSTANT.CrEventScene.TimeStatus.START.value
      ) {
        currentCombat = this.model.operationalValue;
      }
      const d = new Date(currentCombat || new Date());
      const _this = this;
      this.timer2 = setInterval(function () {
        var d_s = d.getTime(); // 转化为时间戳毫秒数
        d.setTime(d_s + 1000);
        const resDate =
          d.getFullYear() +
          '-' +
          _this.p(d.getMonth() + 1) +
          '-' +
          _this.p(d.getDate());
        const resTime =
          _this.p(d.getHours()) +
          ':' +
          _this.p(d.getMinutes()) +
          ':' +
          _this.p(d.getSeconds());
        _this.operationalValue2 = resDate;
        _this.operationalValue1 = resTime;
        // _this.operationalWeek = _this.formatWeekLanguage(resDate);
      }, 1000 / this.rateSubmitValue);
    },
    // 开始作战
    createData(url, data, callback) {
      postData(this.url, data)
        .then((res) => {
          // 导演点击启动靶场
          this.isDisabled = false;
          this.time_resource_id = res.data.data.resource_id;
          this.model.operationalValue = res.data.data.combat_time;
          this.control(res.data.data.status);
          this.$message.success(this.$t('m.start_success'));
          this.isShowRate = false;
          if (callback) {
            callback();
          }
        })
        .catch((res) => {
          const datas = res.response.data;
          _.forEach(datas, (value, key) => {
            this.$message.error(value[0].message);
          });
        });
    },
    updateData(status, callback) {
      // 停止靶场
      if (status === 0) {
        //导演角色停止靶场
        TimeManagement(this.url, { room_id: this.resource_id })
          .then((res) => {
            this.$message.success(this.$t('common.operateSuccess'));
            this.isDisabled = true;
            // this.suspendBtn = !this.suspendBtn
            this.control(status);
            if (callback) {
              callback();
            }
          })
          .catch((res) => {
            const datas = res.response.data;
            _.forEach(datas, (value, key) => {
              if (_.isArray(value)) {
                this.$message.error(value[0].message);
              } else {
                this.$message.error(value.message);
              }
            });
          });
      }
      // 导演角色暂停靶场
      if (status === 1) {
        pauseScene(this.url, { room_id: this.resource_id })
          .then((res) => {
            this.$message.success(this.$t('common.operateSuccess'));
            this.control(status);
          })
          .catch((res) => {
            const datas = res.response.data;
            _.forEach(datas, (value, key) => {
              if (_.isArray(value)) {
                this.$message.error(value[0].message);
              } else {
                this.$message.error(value.message);
              }
            });
          });
      }
      // 恢复靶场
      // 导演角色恢复靶场
      if (status === 3) {
        resumeScene(this.url, { room_id: this.resource_id })
          .then((res) => {
            this.$message.success(this.$t('common.operateSuccess'));
            this.control(status);
          })
          .catch((res) => {
            const datas = res.response.data;
            _.forEach(datas, (value, key) => {
              if (_.isArray(value)) {
                this.$message.error(value[0].message);
              } else {
                this.$message.error(value.message);
              }
            });
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.director-home {
  width: 100%;
  height: 100vh;
  position: relative;
  .header {
    height: 56px;
    line-height: 56px;
    position: relative;
    .header-right {
      position: absolute;
      right: 16px;
      top: 0px;
      z-index: 2;
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
