<template>
  <div class="task-adjudication">
    <!-- 任务概览 -->
    <div class="task-overview">
      <block :title="$t('rbt.taskOverview')"></block>
      <div class="overview-wrap">
        <div class="overview-item">
          <span class="outer-wrap">
            <span class="inner-wrap submit-mission-count">
              <cb-iconfont
                :size="16"
                type="icon-zhiding"
                class="task-overview-icon"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.submitTasks') }}</span>
          <span class="num">{{ submit_mission_count }}</span>
        </div>
        <div class="overview-item">
          <span class="outer-wrap">
            <span class="inner-wrap wait-missions-count">
              <cb-iconfont
                :size="16"
                type="icon-shenhe"
                class="task-overview-icon"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.toEvaluate') }}</span>
          <span class="num">{{ wait_missions_count }}</span>
        </div>
        <div class="overview-item">
          <span class="outer-wrap">
            <span class="inner-wrap success-missions-count">
              <cb-iconfont
                :size="16"
                type="icon-gou"
                class="task-overview-icon"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.success') }}</span>
          <span class="num">{{ success_missions_count }}</span>
        </div>
        <div class="overview-item">
          <span class="outer-wrap">
            <span class="inner-wrap fail-missions-count">
              <cb-iconfont
                :size="16"
                type="icon-guanbi"
                class="task-overview-icon"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.fail') }}</span>
          <span class="num">{{ fail_missions_count }}</span>
        </div>
        <div class="overview-item">
          <span class="outer-wrap">
            <span class="inner-wrap reject-missions-count">
              <cb-iconfont
                :size="16"
                type="icon-bianjiqizhongqi"
                class="task-overview-icon"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.reject') }}</span>
          <span class="num">{{ reject_missions_count }}</span>
        </div>
      </div>
    </div>
    <div class="task-access">
      <!-- 任务裁决 -->
      <div class="left-wrap">
        <block :title="$t('rbt.taskAdjudication')"></block>
        <!-- 筛选区域 -->
        <div class="search-wrap">
          <cb-select
            v-model="submitRecordFilterForm.role"
            clearable
            :first="{
              value: '',
              label: $t('rbt.allRoles'),
            }"
            @change="changeSelectRole()"
          >
            <cb-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </cb-select>
          <cb-select
            v-model="submitRecordFilterForm.user"
            clearable
            :first="{
              value: '',
              label: $t('rbt.allUsers'),
            }"
            @change="changeSelectUser()"
          >
            <cb-option
              v-for="item in userList"
              :key="item.resource_id"
              :label="item.name"
              :value="item.resource_id"
            />
          </cb-select>
          <cb-select
            v-model="submitRecordFilterForm.assesType"
            clearable
            :first="{
              value: '',
              label: $t('rbt.allStatus'),
            }"
            @change="changeSelectStatus()"
          >
            <cb-option
              v-for="(item, index) in classifyList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </cb-select>
        </div>
        <div class="access-list cyber-scroll-bar-small">
          <div
            class="access-item"
            :key="item.resource_id"
            v-for="(item, index) in tableTaskList"
            @click="assess(item)"
          >
            <!-- 标签、评估类型、标题、得分 -->
            <div class="title-wrap">
              <span
                class="tag"
                :class="[
                  item.evaluate_status === 0
                    ? 'blue'
                    : item.evaluate_status === 1
                    ? 'green'
                    : item.evaluate_status === 2
                    ? 'red'
                    : 'yellow',
                ]"
                >{{
                  item.evaluate_status === 0
                    ? $t('rbt.toEvaluate')
                    : item.evaluate_status === 1
                    ? $t('rbt.success')
                    : item.evaluate_status === 2
                    ? $t('rbt.fail')
                    : $t('rbt.reject')
                }}
              </span>
              <span class="type">{{
                item.evaluate_type === 0
                  ? $t('rbt.machineReview')
                  : $t('rbt.peopleReview')
              }}</span>
              <span class="title" :title="item.mission_title">{{
                item.mission_title
              }}</span>
              <span class="score"
                >{{ item.score }}{{ $t('common.score') }}</span
              >
            </div>
            <!-- 用户头像、名称、类型、角色、时间、评估按钮 -->
            <div class="role-wrap">
              <span class="logo-wrap">
                <img :src="item.submit_user_avatar" />
              </span>
              <span class="user-name" :title="item.submit_user_name">{{
                item.submit_user_name
              }}</span>
              <span class="user-type" v-if="item.role_group === 4">
                {{ $t('rbt.red') }}
              </span>
              <span class="user-type" v-if="item.role_group === 5">
                {{ $t('rbt.blue') }}</span
              >
              <span class="role-name" :title="item.role_name">{{
                item.role_name
              }}</span>
              <span class="time" :title="item.submit_time">{{
                item.submit_time
              }}</span>
              <cb-button
                class="btn-wrap"
                @click="assess(item)"
                type="text"
                hollow
                >{{
                  item.evaluate_status === 0
                    ? $t('rbt.evaluate')
                    : $t('rbt.reevaluate')
                }}</cb-button
              >
            </div>
            <!-- 左侧颜色装饰 -->
            <div
              class="decorate"
              :class="[
                item.evaluate_status === 0
                  ? 'decorate-wait'
                  : item.evaluate_status === 1
                  ? 'decorate-success'
                  : item.evaluate_status === 2
                  ? 'decorate-fail'
                  : 'decorate-other',
              ]"
            ></div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div
          v-if="!tableTaskList.length"
          class="empty-comp"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page ref="emptyComp" />
        </div>
      </div>
      <!-- 探针采集、流量分析 -->
      <div class="right-wrap">
        <cb-tabs v-model="activeTab">
          <cb-tab-pane :label="$t('rbt.probeCollection')" name="probe">
            <probe v-if="sceneId" :sceneId="sceneId"></probe>
          </cb-tab-pane>
          <cb-tab-pane :label="$t('rbt.flowAnalysis')" name="traffic">
            <traffic v-if="sceneId" :sceneId="sceneId"></traffic>
          </cb-tab-pane>
        </cb-tabs>
      </div>
    </div>
    <!-- 底部时间轴 -->
    <div class="footer">
      <div class="center-footer fl">
        <div class="timeBox">
          <div class="astronomicalBox fl">
            <div class="editBox">
              <span class="time-desc">{{ $t('m.astronomicalTime') }}</span>
              <cb-button
                icon="icon-bianji"
                v-if="isShowRate"
                type="text"
                :title="$t('common.edit')"
                @click="editTime('astronomical')"
              >
              </cb-button>
            </div>
            <div>
              <div class="time">
                <span class="time-y">{{ value1 }}</span>
                <span class="time">{{ value2 }}</span>
              </div>
            </div>
          </div>
          <div class="combatBox fl">
            <div class="editBox">
              <span>{{ $t('m.operationalTime') }}</span>
              <cb-button
                v-if="isShowRate"
                type="text"
                icon="icon-bianji"
                :title="$t('common.edit')"
                @click="editTime('combat')"
              ></cb-button>
            </div>
            <div>
              <div class="time">
                <span class="time-y">{{ operationalValue2 }}</span>
                <span class="time">{{ operationalValue1 }}</span>
                <div
                  clsaa="rate-value"
                  style="
                    position: absolute;
                    bottom: 5px;
                    left: 165px;
                    font-size: 14px;
                    height: 20px;
                    line-height: 26px;
                    white-space: nowrap;
                  "
                >
                  {{ $t('m.rate') }}：{{ rateSubmitValue }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-footer fl right-footer-single">
        <time-line :scale-times="scaleTimes" />
      </div>
    </div>
    <cb-dialog
      :visible.sync="dialogVisible"
      :title="$t('rbt.evaluate')"
      width="1180px"
      class="dialogStyle"
      @close="cancel"
    >
      <assess-detail
        ref="formRef"
        :form-info="formInfo"
        :pieLabelData="pieLabelArr"
      ></assess-detail>
      <span slot="footer" class="dialog-footer">
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button button-type="confirm" @click="confirm"></cb-button>
            <cb-button button-type="cancel" @click="cancel"></cb-button>
          </cb-button-group>
        </div>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import defaultLogo from '@/assets/img/addhost.png';
import TimeLine from '@/components/TimeLine/redBlueTimeLine.vue';
import block from '@/components/block';
import assessDetail from './components/assess-detail.vue';
import probe from './components/probe.vue';
import traffic from './components/traffic.vue';
import { timeLine } from '@/api/web/task_editor.js';
import { getData, postData } from '@/api/common';
import { getCurrentTime, getSceneData } from '@/api/web/red-blue';
import { getLanguage } from '@cyber/helper';
import { evaluationSubmit, getTaskCount } from '@/api/web/expert_assess.js';
import {
  getAssessList,
  getRole,
  getUser,
  getAssessDetail,
} from '@/api/web/red-blue.js';
import { getRadarLabels } from '@/api/common.js';
import emptyPage from '@/pages/web/Empty';
export default {
  components: {
    TimeLine,
    block,
    assessDetail,
    probe,
    traffic,
    emptyPage,
  },
  props: {
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      submit_mission_count: '',
      wait_missions_count: '',
      success_missions_count: '',
      fail_missions_count: '',
      reject_missions_count: '',
      // 学员列表
      userList: [],
      // 角色列表
      roleList: [],
      submitRecordFilterForm: {
        role: '',
        user: '',
        assesType: '',
      },
      // 评估状态
      classifyList: [
        {
          label: this.$t('rbt.toEvaluate'),
          value: this.$CONSTANT.SceneTerminal.ReviewStatus.WAIT.value,
        },
        {
          label: this.$t('m.success'),
          value: this.$CONSTANT.SceneTerminal.ReviewStatus.SUCCESS.value,
        },
        {
          label: this.$t('m.fail'),
          value: this.$CONSTANT.SceneTerminal.ReviewStatus.FAIL.value,
        },
        {
          label: this.$t('m.reject'),
          value: this.$CONSTANT.SceneTerminal.ReviewStatus.REJECT.value,
        },
      ],
      tableTaskList: [],
      pieLabelArr: [],
      formInfo: {
        evaluation_id: '',
        name: '',
        content: '',
        userAnswers: '',
        standardAnswer: '',
        write_up: '',
        region: '',
        level_data: [],
        type: '',
        answerOption: [],
        evaluate_status: '',
        defaultReasons: '',
        detail: '',
        assessScore: '',
        score: '',
      },
      defaultLogo,
      resource_id: this.$route.params && this.$route.params.resource_id,
      isShowRate: false,
      value1: '',
      value2: '',
      operationalValue1: '',
      operationalValue2: '',
      rateSubmitValue: 1,
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
        duration_time: '',
      },
      model2: {
        value3: '',
      },
      timer3: null,
      timer2: null,
      timer: null,
      model: {
        operationalValue: '',
      },
      time_resource_id: null,
      rangeState: null,
      isPause: false,
      isStop: false,
      isDisabled: true,
      refreshTime: null,
      activeTab: 'probe',
      dialogVisible: false,
      sceneId: '',
      topo_id: '',
    };
  },
  watch: {
    crEventData: {
      handler(val, oldval) {
        if (val !== oldval) {
          if (!_.isEmpty(val.data)) {
            this.getTaskCount();
            this.getAssessList();
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getUser();
    this.getRole();
  },
  mounted() {
    this.initData();
    this.initTimeLineData();
    this.refreshTime = setInterval(() => {
      this.initTimeLineData();
    }, 60000);
    this.getPieLabel();
    this.getSceneData();
  },
  beforeDestroy() {
    clearInterval(this.refreshTime);
    clearInterval(this.time);
    clearInterval(this.time2);
    clearInterval(this.time3);
  },
  methods: {
    getSceneData() {
      // 获取场景数据
      getSceneData({ room_id: this.resource_id, role_id: '' }).then((res) => {
        // 场景id
        // 接口返回场景sceneId(mp_scene_id)
        this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
        // 返回topo_id
        this.topo_id = _.get(res, 'data.data.topo_id', '') || '';
      });
    },
    // 获取任务数
    // 裁判评判获取统计数据
    getTaskCount() {
      getTaskCount(this.url, { resource_id: this.crEventData.data.resource_id })
        .then((res) => {
          this.submit_mission_count = res.data.data.submit_mission_count;
          this.wait_missions_count = res.data.data.wait_missions_count;
          this.success_missions_count = res.data.data.success_missions_count;
          this.fail_missions_count = res.data.data.fail_missions_count;
          this.reject_missions_count = res.data.data.reject_missions_count;
        })
        .catch((error) => {
          if (error.response.data.length > 0) {
            this.$message.error(error.response.data[0].message);
          }
        });
    },
    changeSelectRole() {
      this.getAssessList();
    },
    changeSelectUser() {
      this.getAssessList();
    },
    changeSelectStatus() {
      this.getAssessList();
    },
    // 任务列表
    getAssessList() {
      //裁判获取学员评估列表
      getAssessList({
        room_id: this.resource_id,
        user_id: this.submitRecordFilterForm.user,
        status: this.submitRecordFilterForm.assesType,
        role_id: this.submitRecordFilterForm.role,
      }).then((res) => {
        this.tableTaskList = res.data.data;
      });
    },
    getUser() {
      // 裁判登录裁定评判查询红蓝对抗学员用户列表
      getUser({
        resource_id: this.resource_id,
      }).then((res) => {
        this.userList = res.data.data;
      });
    },
    getRole() {
      getRole({
        resource_id: this.resource_id,
      }).then((res) => {
        this.roleList = res.data.data;
      });
    },
    // 获取雷达图label
    getPieLabel() {
      getRadarLabels().then((res) => {
        this.pieLabelArr = _.get(res, 'data.data.labels');
      });
    },
    assess(data) {
      getAssessDetail({
        resource_id: data.resource_id,
      }).then((res) => {
        const resData = _.get(res, 'data.data', '');
        this.dialogVisible = true;
        this.formInfo.evaluation_id = data.resource_id;
        this.formInfo.name = resData.title;
        this.formInfo.content = resData.description;
        this.formInfo.userAnswers = resData.user_answer;
        this.formInfo.standardAnswer = resData.answer;
        this.formInfo.write_up = resData.write_up;
        this.formInfo.level_data = resData.skill_points;
        this.formInfo.type = resData.type; //任务类型
        this.formInfo.answerOption = resData.option;
        this.formInfo.score = resData.score;
        // this.formInfo.evaluate_status = data.evaluate_status;
        // this.formInfo.defaultReasons = data.reason;
        // this.formInfo.detail = data.detail;
        // this.formInfo.assessScore = data.score;
      });
    },
    confirm() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          //  裁判人工评估任务
          evaluationSubmit(this.url, {
            room_id: this.resource_id,
            submit_id: this.formInfo.evaluation_id,
            evaluate_status: parseInt(this.formInfo.evaluate_status),
            reason: this.formInfo.defaultReasons,
            detail: this.formInfo.detail,
            score: this.formInfo.assessScore ? this.formInfo.assessScore : 0,
          })
            .then((res) => {
              this.$message({
                message: this.$t('m.successful'),
                type: 'success',
              });
              this.getAssessList();
              this.formInfo.evaluation_id = '';
              this.formInfo.evaluate_status = '';
              this.formInfo.defaultReasons = '';
              this.formInfo.detail = '';
              this.formInfo.assessScore = '';
              this.formInfo.score = '';
              this.dialogVisible = false;
              this.getTaskCount();
            })
            .catch((error) => {
              errorMessage(error, this);
            });
        }
      });
    },
    cancel() {
      this.formInfo.evaluate_status = '';
      this.formInfo.defaultReasons = '';
      this.formInfo.detail = '';
      this.formInfo.assessScore = '';
      this.dialogVisible = false;
    },
    // 天文时间作战时间
    initData() {
      getData(this.url, { resource_id: this.resource_id }).then((res) => {
        const datas = res.data.data;
        if (!_.isEmpty(datas)) {
          const first_data = datas;
          this.model2.value3 = first_data.current_astronomical_time;
          this.model.operationalValue = first_data.current_combat_time;
          this.rateSubmitValue = first_data.rate;
          this.time_resource_id = first_data.resource_id;
          this.control(first_data.status);
          this.sure();
          this.sure2();
        } else {
          // 模拟假数据
          this.rangeState = null;
          this.isDisabled = true;
          this.format();
        }
      });
    },
    sure() {
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
    sure2() {
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
      }
    },
    p(s) {
      return s < 10 ? '0' + s : s;
    },
    control(status) {
      if (status === this.$CONSTANT.CrEventScene.TimeStatus.START.value) {
        // 2
        this.startTime(status);
      }
      if (status === this.$CONSTANT.CrEventScene.TimeStatus.PAUSE.value) {
        // 1
        this.stopCombatTime();
      }
      if (status === this.$CONSTANT.CrEventScene.TimeStatus.RECOVERY.value) {
        // 3
        this.startTime(status);
      }
      if (status === this.$CONSTANT.CrEventScene.TimeStatus.STOP.value) {
        // 0
        this.stopCombatTime();
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
    // 初始化时间
    format() {
      if (!this.model2.value3 || !this.model.operationalValue) {
        getCurrentTime().then((res) => {
          const currentTime = _.get(res, 'data.data.current_time');
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
    // 时间列表
    initTimeLineData() {
      this.scaleTimes = {};
      // 登录获取作战时间
      timeLine(this.url, { resource_id: this.resource_id }).then((res) => {
        this.scaleTimes = res.data.data;
      });
    },
    // 时间转换
    parserDate(date) {
      var t = Date.parse(date);
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, '/')));
      }
    },
    // 暂停作战时间
    pauseCombatTime() {
      clearInterval(this.timer2);
    },
    // 恢复作战时间
    recoverCombatTime() {
      clearInterval(this.timer2);
      let currentCombat = this.operationalValue2.concat(
        ' ',
        this.operationalValue1,
      );
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
      }, 1000 / this.rateSubmitValue);
    },
    p(s) {
      return s < 10 ? '0' + s : s;
    },
    // 停止作战时间
    stopCombatTime() {
      clearInterval(this.timer2);
    },
  },
};
</script>
<style lang="scss" scoped>
.task-adjudication {
  width: 100%;
  height: calc(100% - 56px);
  .task-overview {
    border-radius: 4px;
    height: 136px;
    background: var(--bg-color-2);
    padding: 16px;
    .overview-wrap {
      height: 64px;
      display: flex;
      .overview-item {
        border-radius: 2px;
        flex: 1;
        background: var(--bg-color-3);
        margin-right: 16px;
        display: flex;
        align-items: center;
        &:last-child {
          margin-right: 0px;
        }
        .outer-wrap {
          width: 40px;
          height: 40px;
          background: var(--neutral0);
          margin-left: 20px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          .inner-wrap {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            .task-overview-icon {
              color: var(--white-color);
            }
          }
          .submit-mission-count {
            background: var(--primary-color);
          }
          .wait-missions-count {
            background: var(--cyan-color);
          }
          .success-missions-count {
            background: var(--green-color);
          }
          .fail-missions-count {
            background: var(--red-color);
          }
          .reject-missions-count {
            background: var(--yellow-color);
          }
        }
        .status {
          display: inline-block;
          height: 22px;
          line-height: 22px;
          margin: 0 16px;
          font-size: 14px;
          color: var(--neutral7);
        }
        .num {
          display: inline-block;
          height: 22px;
          line-height: 22px;
          font-size: 20px;
          color: var(--neutral8);
        }
      }
    }
  }
  .task-access {
    display: flex;
    margin-top: 16px;
    height: calc(100% - 152px);
    .left-wrap {
      border-radius: 4px;
      margin-right: 16px;
      background: var(--bg-color-2);
      // width: 40%;
      width: 500px;
      padding: 16px;
      position: relative;
      ::v-deep .cb-block {
        .cb-block-title-container {
          margin-bottom: 16px;
        }
      }
      .search-wrap {
        display: flex;
        .cb-select {
          flex: 1;
          margin-right: 8px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .access-list {
        margin-top: 16px;
        height: calc(100% - 80px);
        overflow-y: scroll;
        background: var(--bg-color-3);
        .access-item {
          border-radius: 2px;
          height: 90px;
          background: var(--bg-color-3);
          padding: 16px;
          position: relative;
          border-bottom: 1px solid var(--neutral1);
          &:hover {
            background: var(--neutral0);
            cursor: pointer;
          }
          // 标签、评估类型、标题、得分
          .title-wrap {
            height: 22px;
            line-height: 22px;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 30px;
            .tag {
              display: inline-block;
              min-width: 40px;
              height: 22px;
              line-height: 22px;
              font-size: 12px;
              padding: 0 8px;
            }
            .type {
              display: inline-block;
              background: var(--neutral0);
              color: var(--neutral8);
              min-width: 40px;
              height: 22px;
              line-height: 22px;
              font-size: 12px;
              padding: 0 8px;
            }
            .title {
              font-size: 14px;
              color: var(--neutral8);
              overflow: hidden;
            }
            .score {
              position: absolute;
              right: 0;
              font-size: 14px;
              color: var(--neutral8);
            }
          }
          // 用户头像、名称、类型、角色、时间、评估按钮
          .role-wrap {
            margin-top: 12px;
            height: 24px;
            line-height: 24px;
            display: flex;
            align-items: center;
            position: relative;
            .logo-wrap {
              display: inline-block;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: var(--bg-color-3);
              outline: 1px solid var(--neutral1);
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .user-name {
              min-width: 60px;
              max-width: 75px;
              height: 14px;
              line-height: 14px;
              font-size: 14px;
              color: var(--neutral7);
              padding: 0 8px;
              border-right: 1px solid var(--neutral1);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .user-type {
              height: 14px;
              line-height: 14px;
              font-size: 14px;
              color: var(--neutral7);
              padding: 0 8px;
              border-right: 1px solid var(--neutral1);
            }
            .role-name {
              max-width: 100px;
              font-size: 14px;
              color: var(--neutral7);
              padding: 0 8px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .time {
              font-size: 12px;
              color: var(--neutral5);
              padding: 0 8px;
            }
            .btn-wrap {
              position: absolute;
              right: 0;
              font-size: 14px;
              color: var(--primary-color);
              cursor: pointer;
            }
          }
          // 左侧颜色装饰
          .decorate {
            position: absolute;
            left: 0;
            top: 5px;
            width: 2px;
            height: 80px;
          }
          .decorate-wait {
            background: var(--primary-color);
          }
          .decorate-success {
            background: var(--green-color);
          }
          .decorate-fail {
            background: var(--red-color);
          }
          .decorate-other {
            background: var(--yellow-color);
          }
        }
        // 待评估
        .blue {
          background: var(--primary-color-2);
          color: var(--primary-color);
        }
        // 成功
        .green {
          background: var(--green-color-2);
          color: var(--green-color);
        }
        // 失败
        .red {
          background: var(--red-color-2);
          color: var(--red-color);
        }
        // 驳回
        .yellow {
          background: var(--yellow-color-2);
          color: var(--yellow-color);
        }
      }
    }
    .right-wrap {
      border-radius: 4px;
      background: var(--bg-color-2);
      // width: 60%;
      width: calc(100% - 500px);
      padding: 0 16px 16px 16px;
      ::v-deep.cb-tabs {
        .el-tabs {
          .el-tabs__header {
            .el-tabs__nav-wrap::after {
              height: 1px;
            }
          }
        }
        .el-tabs__content {
          .el-tab-pane {
            .cb-inner-page {
              padding-top: 0px;
            }
          }
        }
      }
    }
  }
  // 底部时间轴
  .footer {
    width: 100%;
    box-sizing: border-box;
    height: 56px;
    position: fixed;
    bottom: 0px;
    left: 40px;
    .center-footer {
      height: 56px;
      margin-right: 80px;
      box-sizing: border-box;
    }
    .right-footer-single {
      width: calc(100% - 492px) !important;
    }
    .right-footer {
      width: calc(100% - 710px);
      height: 100%;
    }
    .left-button-group-unstart {
      width: 10.07%;
    }
    .right-footer-unstart {
      width: 63.74%;
    }
    .timeBox {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // .astronomicalBox {
      //   width: 45.64%;
      // }
      .combatBox {
        // width: 45.64%;
        .editBox {
          span {
            font-size: 12px;
            white-space: nowrap;
            color: var(--neutral5);
          }
        }
      }
      .editBox {
        margin-bottom: 7px;
        display: flex;
        align-items: center;
        .time-desc {
          font-weight: 400;
          font-size: 12px;
          color: var(--neutral5);
        }
        span {
          font-size: 14px;
        }
      }
      .time {
        height: 100%;
        border-radius: 6px;
        width: 165px;
        position: relative;
        display: flex;
        align-items: center;
        .time {
          width: 80px;
          font-size: 16px;
          font-weight: bold;
          color: var(--neutral8);
        }
        .time-y {
          width: 90px;
          font-weight: bold;
          font-size: 16px;
          margin: 2px 0;
          color: var(--neutral8);
        }
      }
    }
  }
}

// 弹窗样式覆盖
.dialogStyle {
  ::v-deep.el-dialog {
    margin-top: 5vh !important;
  }
  ::v-deep.el-dialog__body {
    padding: 0px !important;
  }
}
</style>
