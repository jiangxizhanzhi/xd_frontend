<template>
  <div class="replay-device">
    <div class="left">
      <div class="device-info">
        <div class="top">
          <div class="device-select">
            <span>{{ $t('common.replayObject') }}：</span>
            <cb-select
              v-model="nodeId"
              :options="deviceOptions"
              titleField="name"
              valueField="id"
              @change="changeDevice"
              filterable
              style="width: 182px"
            ></cb-select>
          </div>
          <div class="split-line"></div>
          <div class="occupancy">
            <div class="device-name">
              <div class="avatar">
                <img :src="deviceInfo.imgUrl" alt="" class="img" />
              </div>
              <div class="name" :title="deviceInfo.deviceName">
                {{ deviceInfo.deviceName }}
              </div>
            </div>
            <div class="system">
              <div class="model">
                <div class="icon" :title="$t('device.system')">
                  <cb-iconfont
                    :size="16"
                    type="icon-danping"
                    class="system-icon"
                  ></cb-iconfont>
                </div>
                <div class="text" :title="deviceInfo.deviceOs">
                  {{ deviceInfo.deviceOs }}
                </div>
              </div>
              <div class="version">
                <div class="icon" :title="$t('test.systemVersion')">
                  <cb-iconfont
                    :size="14"
                    type="icon-nitaiweb"
                    class="system-icon"
                  ></cb-iconfont>
                </div>
                <div class="text" :title="deviceInfo.deviceVersion">
                  {{ deviceInfo.deviceVersion }}
                </div>
              </div>
              <div class="ip">
                <div class="icon" title="IP">
                  <cb-iconfont
                    :size="16"
                    type="icon-IP"
                    class="system-icon"
                  ></cb-iconfont>
                </div>
                <div class="text" :title="deviceInfo.deviceIp">
                  {{ deviceInfo.deviceIp }}
                </div>
              </div>
            </div>
            <div class="info">
              <div class="cpu">
                <div class="line"></div>
                <div>{{ $t('test.cpuOccupancy') }}：</div>
                <div class="number">{{ deviceInfo.cpuOccupy }}%</div>
              </div>
              <div class="ram">
                <div class="line"></div>
                <div>{{ $t('test.memoryUsage') }}：</div>
                <div class="number">{{ deviceInfo.ramOccupy }}%</div>
              </div>
            </div>
            <div class="echart">
              <echart-line
                :color="occupyColor"
                :initData="occupyData"
                yAxisLabelFormatter="{value}%"
                :toolTipFormatter="toolTipFormatter"
              ></echart-line>
            </div>
          </div>
        </div>
        <div class="event-trend">
          <block :title="$t('common.eventTrend')" class="block"></block>
          <div class="echart">
            <echart-line
              :color="eventTrendColor"
              :initData="eventTrendData"
            ></echart-line>
          </div>
        </div>
        <div class="flow-event">
          <block :title="$t('common.flowTrend')" class="block"></block>
          <div class="echart">
            <echart-line
              :color="flowTrendColor"
              :initData="flowTrendData"
            ></echart-line>
          </div>
        </div>
      </div>
    </div>
    <div class="right scroll-bar">
      <!-- 播放大屏 -->
      <div class="monitor-area">
        <monitor-device
          ref="monitorScreen"
          :isRedBlue="isRedBlue"
          :sceneData="screenRecordData"
          :nodeId="nodeId"
          :deviceOptions="deviceOptions"
          :replayTime="replayTime"
          :replayStatus="replayStatus"
          @changePlayStatus="changePlayStatus"
          @updateTimeLine="updateTimeLine"
          @setTimeHandle="setTimeHandle"
          @screenPlayEnd="screenPlayEnd"
          :refresh-screen="refreshScreen"
        />
      </div>
      <!-- 用户切换及各类数据 -->
      <div class="host-area">
        <div class="host-switch">
          <div v-if="screenRecordData.length" class="switch-box scroll-bar">
            <div
              v-for="(item, index) in screenRecordData"
              :key="index"
              class="host-item"
            >
              <div v-if="item.type == 4" class="role-red">
                {{ $t('common.redUser') }}
              </div>
              <div v-if="item.type == 5" class="role-blue">
                {{ $t('common.blueUser') }}
              </div>
              <div
                class="name"
                :title="item.name"
                :class="[userName == item.name ? 'user-active' : '']"
              >
                {{ item.name }}
              </div>
              <div class="total-line">
                <div
                  class="part-line"
                  :class="[
                    screenActive == obj.file_name ? 'active' : 'no-active',
                  ]"
                  :title="getTitle(obj)"
                  v-for="(obj, key) in item.screen_records"
                  :key="key"
                  :style="{
                    width: getWidth(obj) + '%',
                    left: getLeft(obj) + '%',
                  }"
                  @click="changeScreen(obj)"
                ></div>
              </div>
            </div>
          </div>
          <!-- 无数据 -->
          <div v-else class="no-data">
            <div class="info">
              <cb-iconfont type="icon-zanwuziyuan" size="50"></cb-iconfont>
              <div>{{ $t('m.noData') }}</div>
            </div>
          </div>
        </div>
        <div class="table-area">
          <cb-tabs v-model="activeTab">
            <cb-tab-pane
              :label="$t('common.infoClass') + '（' + infoClassCount + '）'"
              name="info"
            >
              <info-table
                :sceneId="sceneId"
                :nodeId="nodeId"
                :replayTime="replayTime"
              ></info-table>
            </cb-tab-pane>
            <cb-tab-pane
              :label="$t('common.eventClass') + '（' + eventClassCount + '）'"
              name="event"
            >
              <event-table
                :sceneId="sceneId"
                :nodeId="nodeId"
                :replayTime="replayTime"
              ></event-table>
            </cb-tab-pane>
            <cb-tab-pane
              :label="$t('common.logClass') + '（' + logClassCount + '）'"
              name="log"
            >
              <log-table
                :sceneId="sceneId"
                :nodeId="nodeId"
                :replayTime="replayTime"
              ></log-table>
            </cb-tab-pane>
            <cb-tab-pane
              :label="$t('common.flowClass') + '（' + flowClassCount + '）'"
              name="flow"
            >
              <flow-table
                :sceneId="sceneId"
                :nodeId="nodeId"
                :replayTime="replayTime"
              ></flow-table>
            </cb-tab-pane>
          </cb-tabs>
        </div>
      </div>
    </div>
    <!-- 红蓝时间轴 -->
    <div class="red-blue-bottom" v-if="isRedBlue">
      <time-line
        ref="timeLine"
        :scale-times="scaleTimes"
        :disabled-start="false"
        @playScreen="playScreen"
        @pauseScreen="pauseScreen"
        @changePlayTime="changePlayTime"
        @changeRate="changeRate"
        @replayHandle="replayHandle"
        @updateReplayStatus="updateReplayStatus"
      ></time-line>
    </div>
    <!-- 团队时间轴 -->
    <div class="team-train-bottom" v-else>
      <time-line
        ref="timeLine"
        :scale-times="scaleTimes"
        :disabled-start="false"
        @playScreen="playScreen"
        @pauseScreen="pauseScreen"
        @changePlayTime="changePlayTime"
        @changeRate="changeRate"
        @replayHandle="replayHandle"
        @updateReplayStatus="updateReplayStatus"
      ></time-line>
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
import TaskStep from './components/task-step.vue';
import MonitorDevice from './components/monitor-device.vue';
import hostSwitch from './components/host-switch.vue';
import TimeLine from './components/time-line.vue';
import EchartLine from './components/echart-line.vue';
import InfoTable from './components/info-class-table.vue';
import EventTable from './components/event-class-table.vue';
import LogTable from './components/log-class-table.vue';
import FlowTable from './components/flow-class-tale.vue';
import {
  getDeviceInfo,
  getDeviceOccupy,
  getDeviceEventTrend,
  getDeviceFlowTrend,
  getRecordScreenByDevice,
  getTeamRecordScreenByDevice,
  getRedBlueTimeLineData,
  getTeamTrainTimeLineData,
  getRedBlueTimeData,
  getProbeTotal,
  getAllNodes,
} from '@/api/web/replay';

export default {
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
  },
  components: {
    block,
    TaskStep,
    MonitorDevice,
    hostSwitch,
    TimeLine,
    EchartLine,
    InfoTable,
    EventTable,
    LogTable,
    FlowTable,
  },
  data() {
    return {
      refreshScreen: 0, //切换复盘对象
      user: '',
      //节点id
      nodeId: '',
      //待播放视频
      screenActive: '',
      //待播放视频的所属用户名
      userName: '',
      //复盘期间探针采集数据总数
      infoClassCount: 0,
      eventClassCount: 0,
      logClassCount: 0,
      flowClassCount: 0,
      //设备基本信息
      deviceInfo: {
        imgUrl: '',
        deviceOs: '',
        deviceVersion: '',
        deviceIp: '',
        cpuOccupy: '',
        ramOccupy: '',
      },
      //复盘的时间点
      replayTime: '',
      //复盘状态，默认为暂停
      replayStatus: true,
      //所有设备
      deviceOptions: [],
      activeTab: 'info',
      astronomicalTime: '',
      combatTime: '',
      astronomicalTimeInterval: null,
      combatTimeInterval: null,
      rate: 1,
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
        current_time: '',
      },
      occupyColor: [this.$themed('primary-color'), this.$themed('green-color')],
      //占用率图表数据
      occupyData: {
        xData: [],
        yData: [],
      },
      //图表悬浮框自定义
      toolTipFormatter: '',
      //事件趋势图表数据
      eventTrendData: {
        xData: [],
        yData: [],
      },
      //流量图表数据
      flowTrendData: {
        xData: [],
        yData: [],
      },
      eventTrendColor: [this.$themed('orange-color')],
      flowTrendColor: [this.$themed('blue-color')],
      //录屏数据
      screenRecordData: [],
      hostScreenData: [
        {
          name: '用户A',
          startTime: '2023-04-27 16:00:15',
          endTime: '2023-04-27 16:01:30',
        },
        {
          name: '用户B',
          startTime: '2023-04-27 16:01:35',
          endTime: '2023-04-27 16:02:00',
        },
        {
          name: '用户C',
          startTime: '2023-04-27 16:02:00',
          endTime: '2023-04-27 16:04:00',
        },
      ],
    };
  },
  created() {},
  mounted() {
    Promise.all([this.getAllNodes(), this.getTimeLineData()]).then(() => {
      if (this.nodeId && this.scaleTimes.start_time) {
        this.getVersion();
        this.getDeviceOccupy();
        this.getDeviceEventTrend();
        this.getDeviceFlowTrend();
        this.getScreenRecord();
        this.getProbeTotal();
      }
    });
    if (this.isRedBlue) {
      this.getRedBlueTimeData();
    }
  },
  beforeDestroy() {
    clearInterval(this.astronomicalTimeInterval);
    clearInterval(this.combatTimeInterval);
  },
  watch: {},
  methods: {
    //获取所有设备
    getAllNodes() {
      return new Promise((resolve, reject) => {
        getAllNodes(this.sceneId)
          .then((res) => {
            const data = _.get(res, 'data.data', []) || [];
            this.deviceOptions = data;
            //默认选中第一个设备
            if (this.deviceOptions.length) {
              if (this.deviceOptions[0].ports.length) {
                this.deviceInfo.deviceIp = this.deviceOptions[0].ports[0].ip;
              }
              this.deviceInfo.imgUrl = this.deviceOptions[0].icon2;
              this.deviceInfo.deviceName = this.deviceOptions[0].name;
              this.deviceInfo.deviceOs = this.deviceOptions[0].system_type_name;
              this.nodeId = this.deviceOptions[0].id;
            }
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    //获取版本号
    getVersion() {
      const params = {
        sceneId: this.sceneId,
        elementIds: this.nodeId,
      };
      getDeviceInfo(params).then((res) => {
        const data = _.get(res, 'data.data.os', {}) || {};
        this.deviceInfo.deviceVersion = data.version;
      });
    },
    //获取设备CPU,内存使用率
    getDeviceOccupy() {
      const params = {
        sceneId: this.sceneId,
        elementIds: this.nodeId,
        startTime: this.scaleTimes.start_time,
        endTime: this.scaleTimes.end_time,
      };
      getDeviceOccupy(params).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        let xData = [],
          cpuYData = [],
          ramYData = [];
        list.forEach((item) => {
          xData.push(item.time.substr(10, 6));
          cpuYData.push(item.cpu_percent);
          ramYData.push(item.memory_percent);
        });
        if (list.length) {
          this.deviceInfo.cpuOccupy = list[list.length - 1].cpu_percent;
          this.deviceInfo.ramOccupy = list[list.length - 1].memory_percent;
        }
        this.occupyData.xData = xData;
        this.occupyData.yData = [cpuYData, ramYData];
        this.toolTipFormatter = (params) => {
          let relVal = params[0].name;
          for (let i = 0, l = params.length; i < l; i++) {
            relVal += '<br/>' + params[i].marker + ' ' + params[i].value + '%';
          }
          return relVal;
        };
      });
    },
    //获取设备事件趋势
    getDeviceEventTrend() {
      const params = {
        sceneId: this.sceneId,
        elementIds: this.nodeId,
        startTime: this.scaleTimes.start_time,
        endTime: this.scaleTimes.end_time,
      };
      getDeviceEventTrend(params).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        let xData = [],
          yData = [];
        list.forEach((item) => {
          xData.push(item.time.substr(10, 6));
          yData.push(item.count);
        });
        this.eventTrendData.xData = xData;
        this.eventTrendData.yData = [yData];
      });
    },
    //获取设备流量趋势
    getDeviceFlowTrend() {
      const params = {
        sceneId: this.sceneId,
        elementIds: this.nodeId,
        startTime: this.scaleTimes.start_time,
        endTime: this.scaleTimes.end_time,
      };
      getDeviceFlowTrend(params).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        let xData = [],
          yData = [];
        list.forEach((item) => {
          xData.push(item.time.substr(10, 6));
          yData.push(item.data_size);
        });
        this.flowTrendData.xData = xData;
        this.flowTrendData.yData = [yData];
      });
    },
    //获取探针采集数据总数
    getProbeTotal() {
      const params = {
        sceneId: this.sceneId,
        nodeIds: this.nodeId,
        startTime: this.scaleTimes.start_time,
        endTime: this.scaleTimes.end_time,
      };
      getProbeTotal(params).then((res) => {
        const data = _.get(res, 'data.data', {}) || {};
        this.infoClassCount = data.info || 0;
        this.eventClassCount = data.event || 0;
        this.logClassCount = data.log || 0;
        this.flowClassCount = data.flow || 0;
      });
    },
    //获取录屏
    getScreenRecord() {
      const params = {
        resource_id: this.$route.params.resource_id,
        node_id: this.nodeId,
        // startTime: this.scaleTimes.start_time,
        // endTime: this.scaleTimes.end_time,
      };
      if (this.isRedBlue) {
        getRecordScreenByDevice(params).then((res) => {
          const data = _.get(res, 'data.data', []) || [];
          let screenData = this.sortUser(this.sort(data));
          this.screenRecordData = screenData;
          //默认第一条录屏是待播放状态
          if (this.screenRecordData.length) {
            this.userName = this.screenRecordData[0].name;
            if (this.screenRecordData[0].screen_records.length) {
              this.screenActive =
                this.screenRecordData[0].screen_records[0].file_name;
            }
          }
        });
      } else {
        getTeamRecordScreenByDevice(params).then((res) => {
          const data = _.get(res, 'data.data', []) || [];
          let screenData = this.sortUser(this.sort(data));
          this.screenRecordData = screenData;
          //默认第一条录屏是待播放状态
          if (this.screenRecordData.length) {
            this.userName = this.screenRecordData[0].name;
            if (this.screenRecordData[0].screen_records.length) {
              this.screenActive =
                this.screenRecordData[0].screen_records[0].file_name;
            }
          }
        });
      }
    },
    // 每个用户下的录屏按照录屏开始时间排序
    sort(arr) {
      //过滤空数据
      let data = arr.filter((item) => {
        return item.screen_records.length !== 0;
      });
      data.forEach((item) => {
        item.screen_records.sort((a, b) => {
          const timeA = new Date(a.create_time).getTime();
          const timeB = new Date(b.create_time).getTime();
          return timeA - timeB;
        });
      });
      return data;
    },
    //将用户按照最早录屏开始时间排序排序
    sortUser(arr) {
      return arr.sort(function (a, b) {
        const timeA = new Date(a.screen_records[0].create_time).getTime();
        const timeB = new Date(b.screen_records[0].create_time).getTime();
        return timeA - timeB;
      });
    },
    //更换录屏
    changeScreen(data) {
      //切换待播放视频
      this.screenActive = data.file_name;
      this.userName = data.user_name;
      const screenData = {
        id: data.file_name,
        play_url: data.play_url,
        startTime: data.create_time,
        endTime: data.end_time,
        userName: data.user_name,
        avatar: data.user_avatar,
        host: data.host,
      };
      this.$refs.monitorScreen.changeScreen(screenData);
      this.$refs.timeLine.changeScreen();
    },
    //获取红蓝作战、天文时间
    getRedBlueTimeData() {
      const params = {
        resource_id: this.$route.params.resource_id,
      };
      getRedBlueTimeData(params).then((res) => {
        const data = res?.data?.data;
        if (!_.isEmpty(data)) {
          this.setTime(data);
        }
      });
    },
    //设置天文、作战时间
    setTime(data) {
      clearInterval(this.astronomicalTimeInterval);
      clearInterval(this.combatTimeInterval);
      let { rate, status } = data;
      this.rate = rate;
      let d = new Date(data.current_astronomical_time);
      this.astronomicalTimeInterval = setInterval(() => {
        let d_s = d.getTime(); // 转化为时间戳毫秒数
        d.setTime(d_s + 1000);
        let resDate =
          d.getFullYear() +
          '-' +
          this.p(d.getMonth() + 1) +
          '-' +
          this.p(d.getDate()) +
          ' ' +
          this.p(d.getHours()) +
          ':' +
          this.p(d.getMinutes()) +
          ':' +
          this.p(d.getSeconds());
        this.astronomicalTime = resDate;
      }, 1000);
      // 2为开始状态，3是恢复状态
      if (status == 2 || status == 3) {
        let f = new Date(data.current_combat_time);
        this.combatTimeInterval = setInterval(() => {
          let f_s = f.getTime(); // 转化为时间戳毫秒数
          f.setTime(f_s + 1000);
          let resDate =
            f.getFullYear() +
            '-' +
            this.p(f.getMonth() + 1) +
            '-' +
            this.p(f.getDate()) +
            ' ' +
            this.p(f.getHours()) +
            ':' +
            this.p(f.getMinutes()) +
            ':' +
            this.p(f.getSeconds());
          this.combatTime = resDate;
        }, 1000 / rate);
      } else {
        this.combatTime = data.combat_time;
      }
    },
    //时间格式
    p(s) {
      return s < 10 ? '0' + s : s;
    },
    //获取时间轴数据
    getTimeLineData() {
      return new Promise((resolve, reject) => {
        const params = {
          resource_id: this.$route.params.resource_id,
        };
        if (this.isRedBlue) {
          getRedBlueTimeLineData(params)
            .then((res) => {
              const data = _.get(res, 'data.data', {}) || {};
              this.scaleTimes.current_time = data.current_time;
              this.scaleTimes.start_time = data.start_time;
              this.scaleTimes.end_time = data.end_time;
              resolve();
            })
            .catch(() => {
              reject();
            });
        } else {
          getTeamTrainTimeLineData(params)
            .then((res) => {
              const data = _.get(res, 'data.data', {}) || {};
              this.scaleTimes.current_time = data.current_time;
              this.scaleTimes.start_time = data.start_time;
              this.scaleTimes.end_time = data.end_time;
              resolve();
            })
            .catch(() => {
              reject();
            });
        }
      });
    },
    //改变设备
    changeDevice() {
      this.deviceOptions.forEach((item, i) => {
        if (this.nodeId == item.id) {
          if (item.ports.length) {
            this.deviceInfo.deviceIp = item.ports[0].ip;
          }
          this.deviceInfo.imgUrl = item.icon2;
          this.deviceInfo.deviceName = item.name;
          this.deviceInfo.deviceOs = item.system_type_name;
        }
      });
      this.getVersion();
      this.getDeviceOccupy();
      this.getDeviceEventTrend();
      this.getDeviceFlowTrend();
      this.getScreenRecord();
      this.getProbeTotal();
      this.refreshScreen = this.refreshScreen + 1; //切换的复盘对象
    },
    //播放视频
    playScreen() {
      this.$refs.monitorScreen.startPlay();
    },
    //暂停视频
    pauseScreen() {
      this.$refs.monitorScreen.pauseScreen();
    },
    //改变时间轴的播放状态
    changePlayStatus(type) {
      this.$refs.timeLine.changePlayStatus(type);
    },
    //更新时间轴的进度
    updateTimeLine(time) {
      this.$refs.timeLine.changeProgress(time);
    },
    //改变当前播放时间
    changePlayTime(time) {
      this.$refs.monitorScreen.changePlayTime(time);
    },
    //改变当前播放速率
    changeRate(rate) {
      this.$refs.monitorScreen.changePlayRate(rate);
    },
    //视频快进或者倒退成功后的回调函数,允许视频播放修改时间轴进度
    setTimeHandle() {
      this.$refs.timeLine.setTimeHandle();
    },
    //视频结束回调
    screenPlayEnd() {
      this.$refs.timeLine.startReplay();
    },
    //复盘的时间点抛出后回调
    replayHandle(time) {
      this.replayTime = time;
    },
    //更新复盘状态，true为暂停，false为进行中
    updateReplayStatus(status) {
      this.replayStatus = status;
    },
    // 计算录屏时长所占训练区间的范围
    getWidth(data) {
      //训练时间之外的录屏，截止时间设为训练结束时间
      if (
        new Date(this.scaleTimes.end_time).getTime() <
        new Date(data.end_time).getTime()
      ) {
        data.end_time = this.scaleTimes.end_time;
      }
      // 训练总时长
      let totalTime =
        new Date(this.scaleTimes.end_time).getTime() -
        new Date(this.scaleTimes.start_time).getTime();
      //
      let time =
        new Date(data.end_time).getTime() -
        new Date(data.create_time).getTime();
      return (time / totalTime) * 100;
    },
    // 计算录屏开始时间在训练区间的起点
    getLeft(data) {
      let totalTime =
        new Date(this.scaleTimes.end_time).getTime() -
        new Date(this.scaleTimes.start_time).getTime();
      let time =
        new Date(data.create_time).getTime() -
        new Date(this.scaleTimes.start_time).getTime();
      return (time / totalTime) * 100;
    },
    getTitle(data) {
      return (
        this.$t('common.screenTime') +
        '：' +
        data.create_time +
        ' ~ ' +
        data.end_time
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.replay-device {
  width: 100%;
  height: calc(100% - 50px);
  font-size: 14px;
  display: flex;
  .left {
    width: 376px;
    height: 100%;
    .device-info {
      width: 100%;
      height: 100%;
      .top {
        width: 100%;
        height: 42%;
        border-radius: 2px;
        background: var(--bg-color-2);
        .device-select {
          padding: 12px 16px;
          .switch-icon {
            margin-left: 8px;
            color: var(--primary-color);
            cursor: pointer;
          }
        }
        .split-line {
          width: 100%;
          height: 1px;
          background: var(--neutral3);
        }
        .occupancy {
          width: 100%;
          height: calc(100% - 60px);
          background: var(--bg-color-2);
          padding: 16px;
          .device-name {
            display: flex;
            align-items: center;
            .avatar {
              .img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--bg-color-3);
                border: 1px solid var(--neutral1);
              }
            }
            .name {
              margin-left: 8px;
            }
          }
          .system {
            display: flex;
            font-size: 12px;
            color: var(--neutral7);
            text-align: center;
            margin-top: 4px;
            .model {
              display: flex;
              align-items: center;
              width: 33%;
              .system-icon {
                color: var(--neutral7);
              }
            }
            .version {
              display: flex;
              align-items: center;
              width: 33%;
              .system-icon {
                color: var(--neutral7);
              }
            }
            .ip {
              display: flex;
              align-items: center;
              width: 33%;
              .system-icon {
                color: var(--neutral7);
              }
            }
            .text {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-left: 4px;
            }
          }
          .info {
            display: flex;
            margin: 8px 0;
            .cpu {
              display: flex;
              align-items: center;
              .line {
                width: 14px;
                height: 2px;
                margin-right: 8px;
                background: var(--primary-color);
              }
              .number {
                color: var(--primary-color);
              }
            }
            .ram {
              display: flex;
              align-items: center;
              margin-left: 30px;
              .line {
                width: 14px;
                height: 2px;
                margin-right: 8px;
                background: var(--green-color);
              }
              .number {
                color: var(--primary-color);
              }
            }
          }
          .title {
            // padding:  16px 16px 0 16px;
          }
          .echart {
            width: 100%;
            height: calc(100% - 90px);
          }
        }
      }
    }
    .event-trend {
      width: 100%;
      height: calc((58% - 32px) / 2);
      margin-top: 16px;
      background: var(--bg-color-2);
      border-radius: 2px;
      padding: 16px 16px 4px 16px;
      .title {
        // padding:  16px 16px 0 16px;
      }
      .echart {
        width: 100%;
        height: calc(100% - 40px);
      }
    }
    .flow-event {
      width: 100%;
      height: calc((58% - 32px) / 2);
      margin-top: 16px;
      background: var(--bg-color-2);
      border-radius: 2px;
      padding: 16px 16px 4px 16px;
      .title {
        // padding:  16px 16px 0 16px;
      }
      .echart {
        width: 100%;
        height: calc(100% - 40px);
      }
    }
    .block {
      ::v-deep.cb-block-title-container {
        margin-bottom: 8px;
      }
    }
  }
  .right {
    width: calc(100% - 376px - 16px);
    height: 100%;
    margin-left: 16px;
    overflow: auto;
    .monitor-area {
      width: 100%;
      height: 450px;
      border-radius: 2px;
    }
    .host-area {
      padding: 12px 16px;
      margin-top: 8px;
      border-radius: 2px;
      background: var(--bg-color-2);
      .host-switch {
        width: 100%;
        height: 102px;
        padding: 12px;
        background: var(--bg-color-3);
        .switch-box {
          width: 100%;
          height: 100%;
          overflow: auto;
        }
        .host-item {
          display: flex;
          height: 28px;
          align-items: center;
          .role-blue {
            width: 40px;
            height: 22px;
            font-size: 12px;
            line-height: 22px;
            background: var(--blue-color-2);
            color: var(--blue-color);
            text-align: center;
          }
          .role-red {
            width: 40px;
            height: 22px;
            font-size: 12px;
            line-height: 22px;
            background: var(--red-color-2);
            color: var(--red-color);
            text-align: center;
          }
          .name {
            width: 5%;
            height: 22px;
            line-height: 22px;
            margin: 0 6px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .user-active {
            color: var(--primary-color);
          }
          .total-line {
            position: relative;
            width: 91%;
            height: 8px;
            background: var(--neutral0);
            border-radius: 6px;
            .part-line {
              position: absolute;
              height: 100%;
              border-radius: 6px;
              // background: var(--primary-color);
              cursor: pointer;
            }
            .active {
              background: var(--primary-color);
            }
            .no-active {
              background: var(--neutral8);
            }
          }
        }
      }
      .table-area-event {
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
}
</style>
