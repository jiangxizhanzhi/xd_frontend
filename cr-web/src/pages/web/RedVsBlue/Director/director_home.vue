<template>
  <cb-inner-page :background="false">
    <div class="director-home page">
      <div class="content">
        <div class="top-nav">
          <div class="left-button-group" :class="buttonClass">
            <cb-button-group>
              <cb-button @click="gotoDataVis()" icon="icon-yanshi" hollow>
                {{ $t('m.dataVis') }}
              </cb-button>
              <cb-button @click="gotoDataScreen()" icon="icon-tuopu" hollow>
                {{ $t('m.dtopology') }}
              </cb-button>
              <cb-button
                hollow
                colorType="red"
                :icon="
                  stop_or_stopped === $t('m.hasStopped')
                    ? 'icon-yitingzhi'
                    : 'icon-tingzhi'
                "
                :disabled="isDisabledStop"
                @click="stopTime"
              >
                {{ stop_or_stopped }}
              </cb-button>
              <cb-button
                hollow
                :colorType="statusId === 0 ? 'primary' : 'yellow'"
                v-if="
                  rangeState !== $CONSTANT.CrEventScene.TimeStatus.STOP.value
                "
                :icon="statusId === 0 ? 'icon-huifu' : 'icon-guaqi'"
                :disabled="!isDisabled || !(value1 && value2)"
                @click="startManagement"
              >
                {{ start_or_recovery_name }}
              </cb-button>
            </cb-button-group>
          </div>
          <cb-tabs v-model="tabActive" type="border-card">
            <cb-tab-pane name="拓扑监控">
              <span slot="label" :title="$t('m.topologyMonitoring')">
                <span>{{ $t('m.topologyMonitoring') }}</span>
              </span>
              <keep-alive>
                <scenario-content
                  v-if="tabActive === '拓扑监控'"
                  :cr-event-data="crEventData"
                  :show-user-info="false"
                  :breadcrumbName="breadcrumbName"
                  @sendData="getData"
                >
                  <div slot="battle-info">
                    <div class="battle-info">
                      <div class="common-div fl">
                        <div class="red-div common-bg-div">
                          <span class="red-span-color color-red">{{
                            $t('common.redUser')
                          }}</span>
                          <span class="red-span-color color-red">{{
                            performanceData.redScore
                          }}</span>
                        </div>
                        <div class="common-progress red-role">
                          <span
                            class="red-span-color color-red common-progress-span"
                            >{{ $t('m.progress') }}：{{
                              performanceData.redProgress
                            }}%</span
                          >
                          <cb-progress
                            :percentage="performanceData.redProgress"
                            :showText="false"
                            strokeLinecap="round"
                          />
                        </div>
                      </div>
                      <div class="battle-img fl" />
                      <div class="common-div fl">
                        <div class="blue-div common-bg-div">
                          <span class="blue-span-color color-blue">{{
                            $t('common.blueUser')
                          }}</span>
                          <span class="blue-span-color color-blue">{{
                            performanceData.blueScore
                          }}</span>
                        </div>
                        <div class="common-progress blue-role">
                          <span
                            class="blue-span-color color-blue common-progress-span"
                            >{{ $t('m.progress') }}：{{
                              performanceData.blueProgress
                            }}%</span
                          >
                          <cb-progress
                            :percentage="performanceData.blueProgress"
                            :showText="false"
                            strokeLinecap="round"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </scenario-content>
              </keep-alive>
            </cb-tab-pane>
            <cb-tab-pane name="任务编排">
              <span slot="label" :title="$t('m.schedulePlannerPro')">
                <span>{{ $t('m.schedulePlannerPro') }}</span>
              </span>
              <task-edit
                v-if="tabActive === '任务编排'"
                :cr-event-data="crEventData"
                :cr-status="rangeState"
              />
            </cb-tab-pane>
            <cb-tab-pane name="事件管理">
              <span slot="label" :title="$t('m.trafficEventManagement')">
                <span>{{ $t('m.trafficEventManagement') }}</span>
              </span>
              <keep-alive>
                <traffic-edit
                  v-if="tabActive === '事件管理'"
                  :cr-event-data="crEventData"
                />
              </keep-alive>
            </cb-tab-pane>
          </cb-tabs>
        </div>
      </div>
      <div class="footer">
        <div class="center-footer fl">
          <div class="timeBox">
            <div class="astronomicalBox fl">
              <div class="editBox">
                <span class="time-desc" style="font-size: 18px">{{
                  $t('m.astronomicalTime')
                }}</span>

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
                  <span class="time">{{ value2 }}</span>
                  <span class="time-y">{{ value1 }}</span>
                </div>
              </div>
            </div>
            <div class="combatBox fl">
              <div class="editBox">
                <span style="font-size: 18px; white-space: nowrap">{{
                  $t('m.operationalTime')
                }}</span>
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
                  <span class="time">{{ operationalValue1 }}</span>
                  <span class="time-y">{{ operationalValue2 }}</span>
                  <div
                    clsaa="rate-value"
                    style="
                      position: absolute;
                      bottom: 3px;
                      right: 0;
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
      <div class="char-box">
        <char-tool ref="charTool" />
      </div>
      <!--时间速率弹窗-->
      <cb-dialog :visible.sync="dialogRateTime" width="25%" center>
        <span slot="title">
          {{ rateTimeTitle }}
        </span>
        <template>
          <div v-show="showRate" class="rate">
            <div v-if="isShowRate" class="magT10">
              <cb-form label-width="60px" label-position="right">
                <cb-form-item :label="rateLeftLabel">
                  <cb-select
                    v-model="rateValue"
                    class="rate-select elc-select"
                    style="width: 100%"
                  >
                    <cb-option
                      v-for="(item, index) in rateList"
                      :key="index"
                      :label="item.rate"
                      :value="item.rate"
                    />
                  </cb-select>
                </cb-form-item>
              </cb-form>
            </div>
          </div>
          <div v-show="showRate" class="rate">
            <div v-if="isShowRate" class="magT10 time-box">
              <cb-form
                ref="operationalForm"
                :model="model"
                :rules="rules"
                label-width="60px"
                label-position="right"
              >
                <cb-form-item
                  prop="operationalValue"
                  :label="$t('m.time')"
                  class="elc-date-picker"
                >
                  <cb-date-picker
                    v-model="model.operationalValue"
                    type="datetime"
                    default-time="12:00:00"
                    style="width: 100%"
                  />
                </cb-form-item>
              </cb-form>
            </div>
          </div>
          <!--以上为作战时间和速率，下面为天文时间-->
          <div v-show="!showRate" class="rate">
            <div class="magT10 time-box">
              <!--<span class="label-span">{{ $t('m.time') }}</span>-->
              <cb-form
                ref="valueForm"
                :model="model2"
                :rules="rules2"
                label-width="60px"
                label-position="right"
              >
                <cb-form-item prop="value3" :label="$t('m.time')">
                  <cb-date-picker
                    v-model="model2.value3"
                    :disabled="!isShowRate"
                    type="datetime"
                    default-time="12:00:00"
                    style="width: 100%"
                  />
                </cb-form-item>
              </cb-form>
            </div>
          </div>
        </template>
        <span slot="footer" class="dialog-footer">
          <cb-button-group>
            <cb-button @click="saveTime()">{{ $t('m.ensure') }}</cb-button>
            <cb-button hollow @click="dialogRateTime = false">{{
              $t('common.cancel')
            }}</cb-button>
          </cb-button-group>
        </span>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import ScenarioContent from '@/pages/web/RedVsBlue/Common/page/scenario_content.vue';
import TaskEdit from '@/pages/web/RedVsBlue/Director/task_editor.vue';
import TrafficEdit from '@/pages/web/RedVsBlue/Director/traffic_event_management.vue';
import { getData, postData } from '@/api/common';
import { getLanguage, routerResolve } from '@cyber/helper';
import {
  TimeManagement,
  pauseScene,
  resumeScene,
} from '@/api/web/dispatching_guidance';
import { timeLine } from '@/api/web/task_editor.js';
import TimeLine from '@/components/TimeLine/DirectorTimeLine.vue';
// import charTool from '@/components/ChatTools/index.vue';
import { setBreadcrumbTitle } from '@cyber/ui';
export default {
  name: 'DirectorHome',
  components: {
    ScenarioContent,
    TaskEdit,
    TrafficEdit,
    TimeLine,
    // charTool,
  },
  data() {
    return {
      language: getLanguage(),
      rateLeftLabel: this.$t('m.rate') + ' 1',
      resource_id: '',
      breadcrumbName: '',
      Router: '/red_vs_blue',
      crEventData: {},
      tabActive: '拓扑监控',
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
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
        duration_time: '',
      },
      performanceData: {
        redScore: 0,
        redProgress: 0,
        blueScore: 0,
        blueProgress: 0,
      },
      refreshTime: null,
      rateTimeTitle: '',
      role_group: '',
    };
  },
  computed: {
    buttonClass() {
      return !(
        this.rangeState !== this.$CONSTANT.CrEventScene.TimeStatus.STOP.value &&
        this.rangeState !== null
      )
        ? 'left-button-group-single'
        : '';
    },
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    if (this.resource_id) {
      this.$request
        .get(
          '/cr/red_vs_blue/red_vs_blue/',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.screenName = res.data.data.name;
          this.crEventData = res.data;
          this.breadcrumbName = res.data.data.name;
          setBreadcrumbTitle(this.breadcrumbName);
          this.role_group = res.data.data.role_permission.role_group;
        });
    }
  },
  mounted() {
    this.initData();
    this.initGradeData();
    this.initTimeLineData();
    this.refreshTime = setInterval(() => {
      this.initGradeData();
      this.initTimeLineData();
    }, 60000);
  },
  beforeDestroy() {
    clearInterval(this.refreshTime);
    this.$refs.charTool.setConfig(false);
  },
  destroy() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    clearInterval(this.timer3);
    clearInterval(this.refreshTime);
  },
  methods: {
    // 获取sendData
    getData(data1, data2) {
      (this.sceneId = data1), (this.topo_id = data2);
    },
    initGradeData() {
      // 学员角色查询训练得分信息
      this.$request
        .get(
          '/cr/red_vs_blue/red_vs_blue/get_role_score_info',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          _.forEach(res.data.data, (children) => {
            if (
              children.role_group ===
              this.$CONSTANT.Role.RedVsBlue.REDUSER.value
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
          this.isShowRate = false;
          this.model.operationalValue = first_data.current_combat_time;
          this.rateSubmitValue = first_data.rate;
          this.time_resource_id = first_data.resource_id;
          this.isStop = first_data.status === 0;
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
        this.$request
          .get(
            '/cr/common/current_time',
            {},
            {
              baseURL: '/api/ojj',
            },
          )
          .then((res) => {
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
    // 获取导演时间列表
    initTimeLineData() {
      // 导演登录获取作战时间
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
    suspend() {
      this.updateData(this.$CONSTANT.CrEventScene.TimeStatus.PAUSE.value);
    },
    // 关闭作战时间
    stopTime() {
      this.updateData(this.$CONSTANT.CrEventScene.TimeStatus.STOP.value);
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
            // 恢复作战时间
            this.updateData(
              this.$CONSTANT.CrEventScene.TimeStatus.RECOVERY.value,
              this.startTime,
            );
          }
        } else {
          this.createData(url, data, this.startTime);
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
    // 编辑时间
    editTime(state) {
      this.dialogRateTime = true;
      if (state === 'combat') {
        this.showRate = true;
        this.rateTimeTitle =
          this.$t('m.operationalTime') + this.$t('common.edit');
      } else {
        this.showRate = false;
        this.rateTimeTitle =
          this.$t('m.astronomicalTime') + this.$t('common.edit');
      }
    },
    saveTime() {
      // this.dialogRateTime = false
      if (this.showRate && this.isShowRate) {
        this.$refs.operationalForm.validate((valid) => {
          if (valid) {
            // 保存作战时间
            this.rateSubmitValue = JSON.parse(JSON.stringify(this.rateValue));
            this.sure2();
            this.dialogRateTime = false;
            this.$message({
              type: 'success',
              message: this.$t('m.SuccessfullyModified'),
            });
          }
        });
      } else {
        this.$refs.valueForm.validate((valid) => {
          if (valid) {
            // 保存天文时间
            this.sure();
            this.$message({
              type: 'success',
              message: this.$t('m.SuccessfullyModified'),
            });
            this.dialogRateTime = false;
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.director-home {
  .content {
    background: var(--bg-color-2);
  }

  .combatBox {
    color: var(--neutral8);
  }
}

::v-deep {
  .el-tab-pane,
  .el-tabs,
  .cb-tabs {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 39px);
  }
}
.director-home {
  overflow: hidden;
  .header {
    position: relative;
    width: 100%;
    height: 40px;
  }
  .content {
    width: 100%;
    height: calc(100% - 166px);
    .top-nav {
      width: 100%;
      height: 100%;
      position: relative;

      .left-tabs {
        width: 100%;
      }
      .right-btn {
        position: absolute;
        left: 300px;
        top: 2px;
        z-index: 1;
      }
      .right-btn-en {
        position: absolute;
        left: 450px;
        top: 2px;
        z-index: 1;
      }
    }
    .content-main,
    .content {
      width: 100%;
      height: calc(100% - 40px);
    }
    .content {
      height: calc(100% + 70px);
    }
  }
  .footer {
    width: 100%;
    box-sizing: border-box;
    height: 126px;
    .center-footer {
      height: 126px;
      margin-right: 30px;
      box-sizing: border-box;
    }
    .right-footer-single {
      width: calc(100% - 538px) !important;
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
      .astronomicalBox {
        width: 45.64%;
      }
      .combatBox {
        width: 45.64%;
      }
      .editBox {
        margin-bottom: 7px;
        display: flex;
        justify-content: space-between;
        .time-desc {
          font-weight: 400;
          font-size: 14px;
        }
        span {
          font-size: 14px;
        }
      }
      .time-r {
        float: right;
        font-size: 17px;
        margin: 2px 0 2px 0;
        border: none;
        text-align: center;
        img {
          width: 17px;
        }
      }
      .time {
        height: 100%;
        border-radius: 6px;
        float: left;
        width: 100%;
        position: relative;
        .time {
          font-size: 26px;
          font-family: Microsoft YaHei;
          font-weight: bold;

          margin-bottom: 5px;
          height: 61%;
          width: 100%;
          border: none;
          letter-spacing: 8px;
        }
        .time-y {
          height: 39%;

          width: 64%;
          float: left;
          font-size: 14px;
          margin: 2px 0;
          border: none;
          color: var(--neutral7);
          text-align: left;
        }
      }
    }
  }
  .com-div-btn {
    top: -5px;
  }
  .left-button-group {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    left: 300px;
    right: 2px;
    z-index: 1;
  }

  // battle info
  .battle-info {
    width: 322px;
    height: 130px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 24px;
    .common-div {
      width: 112px;
      height: 100%;
    }
    .common-bg-div {
      width: 112px;
      height: 92px;
      text-align: center;
      span {
        &:nth-child(1) {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          display: block;
          padding-top: 17px;
          height: 14px;
          line-height: 14px;
        }
        &:nth-child(2) {
          height: 24px;
          line-height: 46px;
          font-size: 30px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          margin-top: 18px;
          display: block;
          text-shadow: 0 0 40px rgba(12, 21, 48, 0.3);
        }
      }
    }

    .common-progress {
      padding: 5px 10px;
      text-align: center;
    }
    .common-progress-span {
      display: block;
      font-size: 12px;
      height: 13px;
      line-height: 13px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .red-div {
      background: url('~@/assets/img/redVsBlue/director/red_bg.png') no-repeat
        center;
    }
    .blue-div {
      background: url('~@/assets/img/redVsBlue/director/blue_bg.png') no-repeat
        center;
    }
    .battle-img {
      width: 42px;
      height: 56px;
      margin: 16px 28px;
      background: url('~@/assets/img/redVsBlue/director/vs.png') no-repeat
        center;
    }

    ::v-deep .red-role {
      .cb-progress-bar__outer {
        background-color: var(--red-color-4) !important;
      }
      .cb-progress-bar__inner {
        background-color: var(--red-color);
      }
    }

    ::v-deep .blue-role {
      .cb-progress-bar__outer {
        background-color: var(--blue-color-4) !important;
      }
      .cb-progress-bar__inner {
        background-color: var(--blue-color);
      }
    }

    // ::v-deep .blue-progress {
    //   .el-progress-bar__outer {
    //     background-color: var(--blue-color-4) !important;
    //   }
    //   .el-progress-bar__inner {
    //     background-color: var(--blue-color) !important;
    //   }
    // }
  }
}
// 编辑时间弹窗
.dialog-rate-time {
  ::v-deep .el-dialog__footer {
    padding: 20px !important;
  }
  ::v-deep.el-dialog__body {
    padding: 20px 40px 20px !important;
    .rate:nth-child(1) {
      margin-bottom: 20px;
    }
    .rate {
      width: 100%;
      .time-box {
        text-align: left;
      }
      .rate-select {
        margin-right: 0 !important;
      }
      ::v-deep .el-input--prefix {
        width: 100%;
      }
      .divBox {
        margin-top: 10px;
        text-align: center;
        padding: 40px 0;
        border: 1px solid rgba(54, 67, 91, 1);
        box-shadow: 0 4px 10px 0 rgba(20, 29, 40, 0.8),
          0 10px 26px 4px rgba(16, 24, 33, 0.9);
      }
      .time-box {
        ::v-deep.el-input__icon {
          line-height: 39px !important;
        }
      }
      .label-span {
        color: #d1dbf1;
        margin-right: 30px;
      }
      .red-disabled {
        background: linear-gradient(
          0deg,
          rgba(255, 103, 68, 1) 0%,
          rgba(255, 32, 32, 1) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        width: auto;
        text-align: center;
        padding-top: 20px;
      }
    }
  }
  .elc-dialog-btn-ensure,
  .elc-dialog-btn-cancel {
    width: 23.55% !important;
  }
}
</style>
