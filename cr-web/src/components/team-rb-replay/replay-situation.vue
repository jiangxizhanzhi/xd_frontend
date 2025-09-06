<template>
  <div class="replay-situation">
    <div class="right scroll-bar">
      <!-- 播放大屏 -->
      <div class="monitor-area" :class="{ 'monitor-area-zoom': zoomIn }">
        <div class="toolbar-single">
          <cb-iconfont :size="24" type="icon-huifumoren" @click="restore" />
          <cb-iconfont
            :size="24"
            type="icon-shijianshijiaogensui"
            @click="follow"
          />

          <cb-iconfont
            :size="24"
            :type="
              rotate
                ? 'icon-zidongxuanzhuankaiqi'
                : 'icon-zidongxuanzhuanguanbi'
            "
            @click="rotateFun"
          />
        </div>
        <iframe
          v-if="sceneId"
          class="u3d"
          runat="server"
          :src="iframeUrl"
          frameborder="no"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
          ref="iframeRef"
          style="z-index: 11; width: 100%; height: 100%"
        ></iframe>
        <div class="zom-box" @click="zoomInOut">
          <cb-iconfont
            :size="14"
            :type="zoomIn ? 'icon-quxiaoquanping' : 'icon-a-fangda2'"
          ></cb-iconfont>
        </div>
      </div>
      <!-- table -->
      <div v-if="!zoomIn" class="table-area">
        <scroll-table class="flex-column" :data="tableData" :cols="tableCols">
          <template v-slot:category="scope">
            <span>{{
              scope.data.category ? scope.data.category.join('、') : '-'
            }}</span>
          </template>
          <template v-slot:operation="scope">
            <cb-button type="text" @click="singleExecution(scope.data)">
              {{ $t('m.singlePointExecution') }}
            </cb-button>
          </template>
        </scroll-table>
      </div>
      <div v-if="showFilter" class="filter-box">
        <block :title="$t('m.playbackFilter')"></block>
        <!-- 事件类型 -->
        <div class="type-desc">{{ $t('m.eventType') }}</div>
        <div class="check-wrapper" style="margin-bottom: 20px">
          <cb-checkbox-group
            class="check-current"
            v-model="checkListEvent"
            :disabled="btnStatusStart"
          >
            <cb-checkbox :label="1">{{
              $t('m.taskGuidanceEvent')
            }}</cb-checkbox>
            <cb-checkbox :label="2">{{
              $t('m.manualTuningEvent')
            }}</cb-checkbox>
            <cb-checkbox :label="3">{{
              $t('m.trafficCollectionEvent')
            }}</cb-checkbox>
            <cb-checkbox :label="4">{{
              $t('m.hostCollectionEvent')
            }}</cb-checkbox>
          </cb-checkbox-group>
        </div>
        <!-- 动作类型 -->
        <div class="type-desc">{{ $t('m.actionType') }}</div>
        <div class="check-wrapper" style="margin-bottom: 10px">
          <cb-checkbox-group
            class="check-current"
            v-model="checkListAction"
            :disabled="btnStatusStart"
          >
            <cb-checkbox :label="1">{{ $t('m.attack') }}</cb-checkbox>
            <cb-checkbox :label="2">{{ $t('m.defense') }}</cb-checkbox>
            <cb-checkbox :label="3">{{ $t('m.block') }}</cb-checkbox>
            <cb-checkbox :label="4" v-if="isRedBlue">{{
              $t('m.belongTo')
            }}</cb-checkbox>
          </cb-checkbox-group>
        </div>
        <div class="tabs-boxs">
          <cb-tabs v-model="activeTab">
            <cb-tab-pane
              v-if="checkListAction.includes(1)"
              :label="$t('m.attack')"
              name="attack"
            >
              <div>
                <cb-date-picker
                  style="width: 100%"
                  v-model="attackForm.date"
                  type="datetimerange"
                  :range-separator="$t('list.to')"
                  :start-placeholder="$t('list.startTime')"
                  :end-placeholder="$t('list.endTime')"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :clearable="false"
                  popper-class="hide-clear-btn"
                  :disabled="btnStatusStart"
                >
                </cb-date-picker>
                <cb-select
                  class="top-width"
                  v-model="attackForm.event_name"
                  filterable
                  :placeholder="$t('m.allEvents')"
                  :first="{ label: $t('m.allEvents'), value: '' }"
                  :options="attackEventNames"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="attackForm.category"
                  :placeholder="$t('m.allAttackTypes')"
                  :first="{ name: $t('m.allAttackTypes'), code: '' }"
                  titleField="name"
                  valueField="code"
                  :options="attackTypeList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="attackForm.source"
                  filterable
                  :placeholder="$t('m.allAttackSources')"
                  :first="{ name: $t('m.allAttackSources'), resource_id: '' }"
                  :options="sourceList"
                  titleField="name"
                  valueField="resource_id"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="attackForm.target"
                  filterable
                  :placeholder="$t('m.allAttackTargets')"
                  :first="{ name: $t('m.allAttackTargets'), resource_id: '' }"
                  titleField="name"
                  valueField="resource_id"
                  :options="targetList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="attackForm.result"
                  :placeholder="$t('m.allAttackResults')"
                  :first="{ name: $t('m.allAttackResults'), code: '' }"
                  titleField="name"
                  valueField="code"
                  :options="resultList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
              </div>
            </cb-tab-pane>
            <cb-tab-pane
              v-if="checkListAction.includes(2)"
              :label="$t('m.defense')"
              name="defense"
            >
              <div>
                <cb-date-picker
                  style="width: 100%"
                  v-model="defenseForm.date"
                  type="datetimerange"
                  :range-separator="$t('list.to')"
                  :start-placeholder="$t('list.startTime')"
                  :end-placeholder="$t('list.endTime')"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :clearable="false"
                  popper-class="hide-clear-btn"
                  :disabled="btnStatusStart"
                >
                </cb-date-picker>
                <cb-select
                  class="top-width"
                  v-model="defenseForm.event_name"
                  filterable
                  :placeholder="$t('m.allEvents')"
                  :first="{ label: $t('m.allEvents'), value: '' }"
                  :options="defenseEventNames"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="defenseForm.category"
                  :placeholder="$t('m.allDefenseTypes')"
                  :first="{ name: $t('m.allDefenseTypes'), code: '' }"
                  titleField="name"
                  valueField="code"
                  :options="defenseTypeList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="defenseForm.source"
                  filterable
                  :placeholder="$t('m.allAttackSources')"
                  :first="{ name: $t('m.allAttackSources'), resource_id: '' }"
                  titleField="name"
                  valueField="resource_id"
                  :options="sourceList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="defenseForm.target"
                  filterable
                  :placeholder="$t('m.allAttackTargets')"
                  :first="{ name: $t('m.allAttackTargets'), resource_id: '' }"
                  titleField="name"
                  valueField="resource_id"
                  :options="targetList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="defenseForm.result"
                  :placeholder="$t('m.allDefenseResults')"
                  :first="{ name: $t('m.allDefenseResults'), code: '' }"
                  titleField="name"
                  valueField="code"
                  :options="resultList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
              </div>
            </cb-tab-pane>
            <cb-tab-pane
              v-if="checkListAction.includes(3)"
              :label="$t('m.block')"
              name="block"
            >
              <div>
                <cb-date-picker
                  style="width: 100%"
                  v-model="blockForm.date"
                  type="datetimerange"
                  :range-separator="$t('list.to')"
                  :start-placeholder="$t('list.startTime')"
                  :end-placeholder="$t('list.endTime')"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :clearable="false"
                  popper-class="hide-clear-btn"
                  :disabled="btnStatusStart"
                >
                </cb-date-picker>
                <cb-select
                  class="top-width"
                  v-model="blockForm.event_name"
                  filterable
                  :placeholder="$t('m.allEvents')"
                  :first="{ label: $t('m.allEvents'), value: '' }"
                  :options="blockingEventNames"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="blockForm.source"
                  filterable
                  :placeholder="$t('m.allAttackSources')"
                  :first="{ name: $t('m.allAttackSources'), resource_id: '' }"
                  titleField="name"
                  valueField="resource_id"
                  :options="sourceList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="blockForm.target"
                  filterable
                  :placeholder="$t('m.allBlockNodes')"
                  :first="{ name: $t('m.allBlockNodes'), resource_id: '' }"
                  titleField="name"
                  valueField="resource_id"
                  :options="targetList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
              </div>
            </cb-tab-pane>
            <cb-tab-pane
              v-if="checkListAction.includes(4) && isRedBlue"
              :label="$t('m.belongTo')"
              name="affiliation"
            >
              <div>
                <cb-date-picker
                  style="width: 100%"
                  v-model="affiliationForm.date"
                  type="datetimerange"
                  :range-separator="$t('list.to')"
                  :start-placeholder="$t('list.startTime')"
                  :end-placeholder="$t('list.endTime')"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :clearable="false"
                  popper-class="hide-clear-btn"
                  :disabled="btnStatusStart"
                >
                </cb-date-picker>
                <cb-select
                  class="top-width"
                  v-model="affiliationForm.event_name"
                  filterable
                  :placeholder="$t('m.allEvents')"
                  :first="{ label: $t('m.allEvents'), value: '' }"
                  :options="belongingEventNames"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="affiliationForm.source"
                  filterable
                  :placeholder="$t('m.allAssets')"
                  :first="{ name: $t('m.allAssets'), resource_id: '' }"
                  titleField="name"
                  valueField="resource_id"
                  :options="sourceList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
                <cb-select
                  class="top-width"
                  v-model="affiliationForm.role"
                  :placeholder="$t('m.allRole')"
                  :first="{ name: $t('m.allRole'), code: '' }"
                  titleField="name"
                  valueField="code"
                  :options="roleList"
                  :disabled="btnStatusStart"
                >
                </cb-select>
              </div>
            </cb-tab-pane>
          </cb-tabs>
        </div>
        <div class="start-btn-boxs">
          <cb-button @click="startPlaybackTh">
            {{ btnStatusStart ? $t('m.endPlayback') : $t('m.startPlayback') }}
          </cb-button>
          <cb-button
            hollow
            class="reset-btn"
            :disabled="btnStatusStart"
            @click="resetData"
          >
            {{ $t('m.playbackReset') }}
          </cb-button>
        </div>
      </div>
    </div>
    <div
      class="filter-btn-boxs"
      :class="{ 'filter-btn-box-click': showFilter }"
      @click="showFilterBox"
    >
      <cb-iconfont :size="16" type="icon-shaixuan1"></cb-iconfont>
      <span>{{ $t('m.playbackFilter') }}</span>
    </div>
    <!-- 红蓝时间轴 -->
    <div class="red-blue-bottom" v-if="isRedBlue">
      <time-line
        @refreshList="refreshList"
        ref="timeLine"
        :scale-times="scaleTimes"
        :rate-special="true"
        :disabled-start="!btnStatusStart"
        @changePlayTime="changePlayTime"
        @changeRate="changeRate"
        @replayHandle="replayHandle"
        @updateReplayStatus="updateReplayStatus"
        @finishPlayback="handleFinish"
      ></time-line>
    </div>
    <!-- 团队时间轴 -->
    <div class="team-train-bottom" v-else>
      <time-line
        @refreshList="refreshList"
        ref="timeLine"
        :scale-times="scaleTimes"
        :rate-special="true"
        :disabled-start="!btnStatusStart"
        @changePlayTime="changePlayTime"
        @changeRate="changeRate"
        @replayHandle="replayHandle"
        @updateReplayStatus="updateReplayStatus"
        @finishPlayback="handleFinish"
      ></time-line>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import block from '@/components/block';
import MonitorDevice from './components/monitor-device.vue';
import TimeLine from './components/time-line-third.vue';
import ScrollTable from './components/scroll-table.vue';
import {
  teamPlaybackOption,
  redBluePlaybackOption,
  teamPlaybackTimeLine,
  redBluePlaybackTimeLine,
  playbackTimeLine,
  playbackRefresh,
  postExecution,
} from '@/api/web/replay';
import { getToken } from '@cyber/helper';

export default {
  name: 'replay-situation',
  props: {
    //区分团队训练与红蓝，默认是红蓝
    isRedBlue: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    //场景id
    sceneId: {
      type: String,
      default: () => {
        return '';
      },
    },
    //topoId
    topoId: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  components: {
    block,
    MonitorDevice,
    TimeLine,
    ScrollTable,
  },
  data() {
    return {
      user: '',
      //节点id
      // nodeId: '',
      //待播放视频
      screenActive: '',
      //待播放视频的所属用户名
      userName: '',
      //复盘的时间点
      replayTime: '',
      //复盘状态，默认为暂停
      replayStatus: true,
      // 按钮状态
      btnStatusStart: false,
      //所有设备
      // deviceOptions: [],
      // activeTab: 'info',
      astronomicalTime: '',
      tabData: ['attack', 'defense', 'block', 'affiliation'],
      combatTime: '',
      rate: 1,
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
        current_time: '',
      },
      tableData: [],
      tableCols: [
        { label: this.$t('m.eventName'), width: 12, prop: 'event_name' },
        { label: this.$t('m.triggerType'), width: 12, prop: 'trigger_type' },
        { label: this.$t('m.actionType'), width: 12, prop: 'action_type' },
        { label: this.$t('m.attackDefenseType'), width: 12, slot: 'category' },
        { label: this.$t('m.sourceName'), width: 12, prop: 'source_name' },
        { label: this.$t('m.sourceIp'), width: 12, prop: 'source_ip' },
        { label: this.$t('m.sourcePort'), width: 12, prop: 'source_port' },
        { label: this.$t('m.targetName'), width: 12, prop: 'target_name' },
        { label: this.$t('m.targetIp'), width: 12, prop: 'target_ip' },
        { label: this.$t('m.targetPort'), width: 12, prop: 'target_port' },
        { label: this.$t('m.nodeOpreate'), width: 12, slot: 'operation' },
      ],
      showFilter: false,
      checkListEvent: [1, 2, 3, 4],
      checkListAction: [1, 2, 3, 4],
      activeTab: 'attack',
      originDate: [],
      attackForm: {
        date: [],
        event_name: '',
        category: '',
        source: '',
        target: '',
        result: '',
      },
      defenseForm: {
        date: [],
        event_name: '',
        category: '',
        source: '',
        target: '',
        result: '',
      },
      blockForm: {
        date: [],
        event_name: '',
        source: '',
        target: '',
      },
      affiliationForm: {
        date: [],
        event_name: '',
        source: '',
        role: '',
      },
      eventList: [],
      attackEventNames: [], // 攻击事件名称列表
      attackTypeList: [], //攻击类型
      sourceList: [], //攻击源列表
      targetList: [], //攻击目标列表
      resultList: [], //结果
      // 防御
      defenseEventNames: [],
      defenseTypeList: [],
      // 阻断
      blockingEventNames: [],
      // 归属
      belongingEventNames: [],
      roleList: [],
      iframeUrl: '',
      slideTimeInterval: null,
      zoomIn: false,
      rotate: false,
      paramsData: {},
      startTime: '',
      finishPlayback: false, // 是否完成播放
    };
  },
  created() {
    this.iframeUrl =
      location.origin +
      '/topology/scene/' +
      `?sceneId=${this.sceneId}&topoId=&modeType=1&token=${getToken()}`;
  },
  mounted() {
    if (this.isRedBlue) {
      // this.getRedBlue TimeData();
      this.getRedBluePlaybackOption();
    } else {
      this.getTeamPlaybackOption();
    }
    // this.getTimeLineData();
  },
  beforeDestroy() {
    clearInterval(this.slideTimeInterval);
    this.slideTimeInterval = null;
  },
  watch: {
    checkListAction: {
      handler(value) {
        const minValue = Math.min(...value);
        this.activeTab = this.tabData[minValue - 1];
      },
      deep: true,
    },
  },
  methods: {
    refreshList(data) {
      this.showFilter = false;
      // this.tableData = [];
    },
    zoomInOut() {
      this.zoomIn = !this.zoomIn;
    },
    restore() {
      this.$refs.iframeRef.contentWindow.postMessage(
        { type: 'restore' },
        this.iframeUrl,
      );
    },
    follow() {
      this.$refs.iframeRef.contentWindow.postMessage(
        { type: 'follow' },
        this.iframeUrl,
      );
    },
    rotateFun() {
      this.rotate = !this.rotate;
      this.$refs.iframeRef.contentWindow.postMessage(
        { type: 'rotate' },
        this.iframeUrl,
      );
    },
    // 获取团队options
    getTeamPlaybackOption() {
      const data = {
        room_id: this.$route.params.resource_id,
      };
      teamPlaybackOption(data).then((res) => {
        const data = _.get(res, 'data.data');
        const {
          start_time,
          end_time,
          attack_event_names,
          attack_type,
          node_list,
          result,
          defense_event_names,
          defense_type,
          blocking_event_names,
        } = data;
        this.originDate = [start_time, end_time];
        // 攻击
        this.attackForm.date = [start_time, end_time];
        this.attackTypeList = attack_type;
        this.attackEventNames = attack_event_names;
        this.sourceList = node_list;
        this.targetList = node_list;
        this.resultList = result;

        // 防御
        this.defenseForm.date = [start_time, end_time];
        this.defenseEventNames = defense_event_names;
        this.defenseTypeList = defense_type;

        // 阻断
        this.blockForm.date = [start_time, end_time];
        this.blockingEventNames = blocking_event_names;
      });
    },
    // 获取红蓝options
    getRedBluePlaybackOption() {
      const data = {
        room_id: this.$route.params.resource_id,
      };
      redBluePlaybackOption(data).then((res) => {
        const data = _.get(res, 'data.data');
        const {
          start_time,
          end_time,
          attack_event_names,
          attack_type,
          node_list,
          result,
          defense_event_names,
          defense_type,
          blocking_event_names,
          belonging_event_names,
          role_type,
        } = data;
        this.originDate = [start_time, end_time];
        // 攻击
        this.attackForm.date = [start_time, end_time];
        this.attackTypeList = attack_type;
        this.attackEventNames = attack_event_names;
        this.sourceList = node_list;
        this.targetList = node_list;
        this.resultList = result;

        // 防御
        this.defenseForm.date = [start_time, end_time];
        this.defenseEventNames = defense_event_names;
        this.defenseTypeList = defense_type;

        // 阻断
        this.blockForm.date = [start_time, end_time];
        this.blockingEventNames = blocking_event_names;

        // 归属
        this.affiliationForm.date = [start_time, end_time];
        this.belongingEventNames = belonging_event_names;
        this.roleList = role_type;
      });
    },
    // 开始回放
    startPlaybackTh() {
      this.showFilter = false;
      if (this.btnStatusStart) {
        // true 代表 播放中，需要暂停
        this.$refs.timeLine.pause();
        this.tableData = [];
        this.$refs.timeLine.curWidth = 0;
        this.$refs.timeLine.replayTime = '';
        this.scaleTimes.data = [];
        this.scaleTimes.start_time = '';
        this.scaleTimes.end_time = '';
        this.startTime = '';
        clearInterval(this.slideTimeInterval);
        this.slideTimeInterval = null;
        this.btnStatusStart = false;
      } else {
        // if (this.replayStatus) {
        this.dataDeal();
        this.btnStatusStart = true;
        let eventTime = [];
        playbackTimeLine(this.paramsData)
          .then((res) => {
            const data = _.get(res, 'data.data', {}) || {};
            this.scaleTimes.start_time = data.start_time;
            this.scaleTimes.end_time = data.end_time;
            _.forEach(data.event_time_list, (item) => {
              eventTime.push({
                time: item,
                special: true,
              });
            });
            this.scaleTimes.data = eventTime;
            if (this.$refs.timeLine.showPlayIcon) {
              setTimeout(() => {
                this.$refs.timeLine.start();
                //   this.btnStatusStart = true;
              }, 200);
            }
          })
          .catch((err) => {
            this.btnStatusStart = false;
          });
      }
    },
    dataDeal() {
      // 攻击数据
      let attack_screen_bo = {
        ...this.attackForm,
        start_time: (this.attackForm.date && this.attackForm.date[0]) || '',
        end_time: (this.attackForm.date && this.attackForm.date[1]) || '',
      };
      delete attack_screen_bo.date;
      if (!this.checkListAction.includes(1)) {
        attack_screen_bo = null;
      }
      // 防御数据
      let defense_screen_bo = {
        ...this.defenseForm,
        start_time: (this.defenseForm.date && this.defenseForm.date[0]) || '',
        end_time: (this.defenseForm.date && this.defenseForm.date[1]) || '',
      };
      delete defense_screen_bo.date;
      if (!this.checkListAction.includes(2)) {
        defense_screen_bo = null;
      }
      // 阻断数据
      let blocking_screen_bo = {
        ...this.blockForm,
        start_time: (this.blockForm.date && this.blockForm.date[0]) || '',
        end_time: (this.blockForm.date && this.blockForm.date[1]) || '',
      };
      delete blocking_screen_bo.date;
      if (!this.checkListAction.includes(3)) {
        blocking_screen_bo = null;
      }
      // 归属数据
      let belonging_screen_bo = {
        ...this.affiliationForm,
        start_time:
          (this.affiliationForm.date && this.affiliationForm.date[0]) || '',
        end_time:
          (this.affiliationForm.date && this.affiliationForm.date[1]) || '',
      };
      delete belonging_screen_bo.date;
      if (!this.checkListAction.includes(4)) {
        belonging_screen_bo = null;
      }
      if (!this.isRedBlue) {
        belonging_screen_bo = null;
      }
      let business_type = this.isRedBlue ? 4 : 3;
      let room_id = this.$route.params.resource_id;
      let event_sub_type_list = this.checkListEvent;
      const rate = this.$refs.timeLine.rate;
      if (this.scaleTimes.start_time) {
        // 处理开始时间参数，每隔6秒*rate累加一次，但是不能超过时间轴上的当前时间
        // (startTimeValue <= timeLineStartTimeValue) && (startTimeValue + 6000) <= timeLineStartTimeValue)
        if (!this.startTime) {
          this.startTime = this.scaleTimes.start_time;
        } else {
          const startTimeValue = moment(this.startTime).valueOf();
          const timeLineStartTimeValue = moment(
            this.$refs.timeLine.getCurrentTime(),
          ).valueOf();
          if (
            startTimeValue <= timeLineStartTimeValue &&
            startTimeValue + rate * 6000 <= timeLineStartTimeValue
          ) {
            this.startTime = moment(startTimeValue + rate * 6000).format(
              'YYYY-MM-DD HH:mm:ss',
            );
          }
        }
      }
      // const start_time = this.$refs.timeLine.getCurrentTime();
      const start_time = this.startTime;
      const data = {
        attack_screen_bo,
        defense_screen_bo,
        blocking_screen_bo,
        belonging_screen_bo,
        event_sub_type_list,
        business_type,
        room_id,
        start_time,
        rate,
      };

      this.paramsData = data;
    },
    startPlayback() {
      if (!this.$refs.timeLine.showPlayIcon) {
        // let eventTime = [];
        // playbackTimeLine(this.paramsData).then((res) => {
        //   const data = _.get(res, 'data.data', {}) || {};
        //   this.scaleTimes.start_time = data.start_time;
        //   this.scaleTimes.end_time = data.end_time;
        //   _.forEach(data.event_time_list, (item) => {
        //     eventTime.push({
        //       time: item,
        //       special: true,
        //     });
        //   });
        //   this.scaleTimes.data = eventTime;
        // });
        // this.tableData = [];
        playbackRefresh(this.paramsData).then((res) => {
          // console.log('111111');
          const tableData = _.get(res, 'data.data');
          // this.tableData.push(...tableData);
          if (tableData.length > 0) {
            tableData.forEach((obj) => {
              this.tableData.push(obj);
            });
          }
        });
      }
    },
    // 重置数据
    resetData() {
      this.checkListEvent = [1, 2, 3, 4];
      this.checkListAction = [1, 2, 3, 4];
      this.activeTab = 'attack';
      // 攻击
      this.attackForm.date = _.cloneDeep(this.originDate);
      this.attackForm.event_name = '';
      this.attackForm.category = '';
      this.attackForm.source = '';
      this.attackForm.target = '';
      this.attackForm.result = '';
      //防御
      this.defenseForm.date = _.cloneDeep(this.originDate);
      this.defenseForm.event_name = '';
      this.defenseForm.category = '';
      this.defenseForm.source = '';
      this.defenseForm.target = '';
      this.defenseForm.result = '';
      // 阻断
      this.blockForm.date = _.cloneDeep(this.originDate);
      this.blockForm.event_name = '';
      this.blockForm.source = '';
      this.blockForm.target = '';

      //归属
      this.affiliationForm.date = _.cloneDeep(this.originDate);
      this.affiliationForm.event_name = '';
      this.affiliationForm.source = '';
      this.affiliationForm.role = '';
    },
    showFilterBox() {
      this.showFilter = !this.showFilter;
    },
    singleExecution(row) {
      // 单点执行
      const slideStatus = this.$refs.timeLine.showPlayIcon;
      if (!slideStatus) {
        // 请先暂停播放器，再点击单点执行
        this.$message.error(this.$t('m.plzPauseExecution'));
      } else {
        postExecution({
          action_code: row.action_code,
          business_type: this.isRedBlue ? 4 : 3,
          category_code: row.category_code,
          event_name: row.event_name,
          result: row.result,
          role: row.role,
          room_id: this.$route.params.resource_id,
          source_id: row.source_id,
          target_id: row.target_id,
          trigger_code: row.trigger_code,
        }).then((res) => {
          this.$message.success(this.$t('rbt.operateSuccess'));
        });
      }
    },

    //获取时间轴数据
    getTimeLineData() {
      return new Promise((resolve, reject) => {
        const params = {
          room_id: this.$route.params.resource_id,
          // business_type: this.isRedBlue ? 4 : 3, //团队训练3,红蓝对抗4
        };
        let eventTime = [];
        playbackTimeLine(params)
          .then((res) => {
            const data = _.get(res, 'data.data', {}) || {};
            this.scaleTimes.start_time = data.start_time;
            this.scaleTimes.end_time = data.end_time;
            _.forEach(data.event_time_list, (item) => {
              eventTime.push({
                time: item,
                special: true,
              });
            });
            this.scaleTimes.data = eventTime;
            resolve();
          })
          .catch(() => {
            reject();
          });
        // if (this.isRedBlue) {
        //   redBluePlaybackTimeLine(params)
        //     .then((res) => {
        //       const data = _.get(res, 'data.data', {}) || {};
        //       this.scaleTimes.start_time = data.start_time;
        //       this.scaleTimes.end_time = data.end_time;
        //       _.forEach(data.event_time_list, (item) => {
        //         eventTime.push({
        //           time: item,
        //           special: true,
        //         });
        //       });
        //       this.scaleTimes.data = eventTime;
        //       resolve();
        //     })
        //     .catch(() => {
        //       reject();
        //     });
        // } else {
        //   teamPlaybackTimeLine(params)
        //     .then((res) => {
        //       const data = _.get(res, 'data.data', {}) || {};
        //       this.scaleTimes.start_time = data.start_time;
        //       this.scaleTimes.end_time = data.end_time;
        //       _.forEach(data.event_time_list, (item) => {
        //         eventTime.push({
        //           time: item,
        //           special: true,
        //         });
        //       });
        //       this.scaleTimes.data = eventTime;
        //       resolve();
        //     })
        //     .catch(() => {
        //       reject();
        //     });
        // }
      });
    },

    //改变当前播放时间
    changePlayTime(time) {
      // this.$refs.monitorScreen.changePlayTime(time);
    },
    //改变当前播放速率
    changeRate(rate) {
      // this.$refs.monitorScreen.changePlayRate(rate);
    },

    //复盘的时间点抛出后回调
    replayHandle(time) {
      this.replayTime = time;
    },
    //更新复盘状态，true为暂停，false为进行中
    updateReplayStatus(status) {
      this.replayStatus = status;
      // this.btnStatusStart = !this.btnStatusStart;
      if (status) {
        clearInterval(this.slideTimeInterval);
        this.slideTimeInterval = null;
      } else {
        if (this.finishPlayback) {
          this.$refs.timeLine.curWidth = 0;
          this.startTime = '';
          this.tableData = [];
        }
        this.finishPlayback = false;
        clearInterval(this.slideTimeInterval);
        this.slideTimeInterval = null;
        // 一开始没有startTime执行一次，后面开始累加时间暂停后再恢复不需要再执行
        if (!this.startTime) {
          this.dataDeal();
        }
        this.startPlayback();

        this.slideTimeInterval = setInterval(() => {
          this.dataDeal();
          this.startPlayback();
        }, 6000);
      }
    },
    // 更新时间轴进度状态
    handleFinish() {
      this.finishPlayback = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.replay-situation {
  width: 100%;
  height: calc(100% - 50px);
  font-size: 14px;
  .right {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
    .monitor-area {
      width: 100%;
      height: 450px;
      border-radius: 2px;
      position: relative;
    }
    .toolbar-single {
      position: absolute;
      top: 6px;
      right: 32px;
      z-index: 30;
      user-select: none;
      .cb-iconfont {
        cursor: pointer;
      }
    }
    .monitor-area-zoom {
      height: calc(100% - 5px);
    }
    .zom-box {
      position: absolute;
      right: 18px;
      bottom: 18px;
      cursor: pointer;
      z-index: 33;
    }
    .table-area {
      padding: 12px 16px;
      margin-top: 8px;
      border-radius: 2px;
      background: var(--bg-color-2);
      height: calc(100% - 458px);
    }
    .filter-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 386px;
      height: 100%;
      background: var(--bg-color-2);
      box-shadow: 8px 8px 30px 0px var(--box-shadow-color);
      border-radius: 4px;
      padding: 16px;
      .type-desc {
        font-size: 14px;
        color: var(--neutral5);
        line-height: 22px;
        margin-bottom: 10px;
      }
      .check-wrapper {
        width: 100%;
      }
      .check-current {
        display: flex;
        flex-wrap: wrap;
      }
      .top-width {
        width: 100% !important;
        margin-top: 16px;
      }
      .start-btn-boxs {
        width: calc(100% - 32px);
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 16px;
        .reset-btn {
          margin-left: 8px;
        }
      }
    }
  }
  .red-blue-bottom {
    position: fixed;
    width: calc(100% - 150px);
    height: 56px;
    left: 60px;
    bottom: 0px;
    z-index: 2;
  }
  .team-train-bottom {
    position: fixed;
    width: calc(100% - 150px);
    height: 56px;
    left: 60px;
    bottom: 0px;
    z-index: 2;
  }
  .no-data {
    height: 100%;
    width: 100%;
    text-align: center;
    position: relative;
    .info {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
    }
  }
  .scroll-bar::-webkit-scrollbar {
    width: 6px;
  }
  .scroll-bar::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
  }
  .filter-btn-boxs {
    position: fixed;
    left: 38px;
    bottom: 65px;
    padding: 10px 14px;
    border: 1px solid var(--bg-color-2);
    font-size: 14px;
    color: var(--primary-color);
    border-radius: 4px;
    cursor: pointer;
    span {
      margin-left: 2px;
    }
    &:hover {
      background: var(--bg-color-2);
    }
  }
  .filter-btn-box-click {
    background: var(--bg-color-2);
  }
}
</style>
<style lang="scss">
.replay-situation {
  .right {
    .filter-box {
      .check-wrapper {
        .check-current {
          .el-checkbox {
            &:nth-child(2n) {
              margin: 5px 0 5px 0;
            }
          }
          .el-checkbox__label {
            width: 148px;
          }
        }
      }
    }
  }
}
.hide-clear-btn {
  .el-picker-panel__footer {
    .el-button--text {
      display: none;
    }
  }
}
</style>
