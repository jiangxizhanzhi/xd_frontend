<template>
  <!-- 用户复盘页面 -->
  <div class="replay-user">
    <div class="left">
      <div class="user-info">
        <div class="user-select">
          <span>{{ $t('common.replayObject') }}：</span>
          <cb-cascader
            v-model="userSet"
            :options="userList"
            :props="optionProps"
            @change="userChange"
            style="width: 182px"
          />
        </div>
        <div class="split-line"></div>
        <div class="task-state">
          <div class="user-count">
            <div class="avatar">
              <img :src="userInfo.avatarUrl" alt="" class="img" />
            </div>
            <div class="name" :title="userInfo.name">{{ userInfo.name }}</div>
            <div v-if="userInfo.role == 4" class="red-role">
              {{ $t('common.redUser') }}
            </div>
            <div v-if="userInfo.role == 5" class="blue-role">
              {{ $t('common.blueUser') }}
            </div>
            <div class="job" :title="userInfo.roleName">
              {{ userInfo.roleName }}
            </div>
            <div class="score">{{ userInfo.score }}分</div>
          </div>
          <div class="task-statistics">
            <div class="task">
              <div class="box">
                <div class="icon-box total">
                  <cb-iconfont
                    size="16"
                    type="icon-jianda1"
                    class="icon-style"
                  ></cb-iconfont>
                </div>
              </div>
              <div class="num">{{ userInfo.totalTasks }}</div>
              <div>{{ $t('common.totalTasks') }}</div>
            </div>
            <div class="task">
              <div class="box">
                <div class="icon-box success">
                  <cb-iconfont
                    size="16"
                    type="icon-gou"
                    class="icon-style"
                  ></cb-iconfont>
                </div>
              </div>
              <div class="num">{{ userInfo.successTasks }}</div>
              <div>{{ $t('common.success') }}</div>
            </div>
            <div class="task">
              <div class="box">
                <div class="icon-box fail">
                  <cb-iconfont
                    size="16"
                    type="icon-guanbi"
                    class="icon-style"
                  ></cb-iconfont>
                </div>
              </div>
              <div class="num">{{ userInfo.failTasks }}</div>
              <div>{{ $t('common.fail') }}</div>
            </div>
            <div class="task">
              <div class="box">
                <div class="icon-box unfinished">
                  <cb-iconfont
                    size="16"
                    type="icon-a-daitijiaodaiwancheng"
                    class="icon-style"
                  ></cb-iconfont>
                </div>
              </div>
              <div class="num">{{ userInfo.unFinishTasks }}</div>
              <div>{{ $t('common.unFinished') }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 用户任务列表 -->
      <div class="task-list">
        <block title="用户任务列表" class="title"></block>
        <div class="list">
          <task-step
            v-if="taskList.length"
            ref="taskStep"
            :taskList="taskList"
          />
          <!-- 无数据 -->
          <div v-else class="no-data">
            <div class="info">
              <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
              <div>{{ $t('m.noData') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right scroll-bar">
      <!-- 播放大屏 -->
      <div class="monitor-area">
        <host-monitor
          ref="monitorScreen"
          :sceneId="sceneId"
          :sceneData="screenRecordData"
          :currentUser="user"
          :userOptions="userOptions"
          :replayTime="replayTime"
          :replayStatus="replayStatus"
          @changePlayStatus="changePlayStatus"
          @updateTimeLine="updateTimeLine"
          @setTimeHandle="setTimeHandle"
          @screenPlayEnd="screenPlayEnd"
          :change-role="changeRole"
        />
      </div>
      <!-- 主机切换及各类数据 -->
      <div class="host-area">
        <div class="host-switch">
          <host-switch
            ref="hostSwitch"
            v-if="screenRecordData.length"
            :sceneId="sceneId"
            :trainStartTime="scaleTimes.start_time"
            :trainEndTime="scaleTimes.end_time"
            :sceneData="screenRecordData"
            :replayTime="replayTime"
            @changeScreen="changeScreen"
          ></host-switch>
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
import HostMonitor from './components/monitor.vue';
import hostSwitch from './components/host-switch.vue';
import TimeLine from './components/time-line.vue';
import InfoTable from './components/info-class-table.vue';
import EventTable from './components/event-class-table.vue';
import LogTable from './components/log-class-table.vue';
import FlowTable from './components/flow-class-tale.vue';
import {
  getTeamTrainAllUsers,
  getRedBlueAllUsers,
  getTeamUserTasks,
  getRedBlueUserTasks,
  getRecordScreenByUserRedBlue,
  getRedBlueTimeLineData,
  getTeamTrainTimeLineData,
  getRedBlueTimeData,
  getProbeTotal,
} from '@/api/web/replay';

export default {
  props: {
    //区分综合演训与红蓝，默认是红蓝
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
    HostMonitor,
    hostSwitch,
    TimeLine,
    InfoTable,
    EventTable,
    LogTable,
    FlowTable,
  },
  data() {
    return {
      changeRole: 0, //切换用户
      //用户id
      user: '',
      //用户级联选择器值
      userSet: '',
      //节点id
      nodeId: '',
      optionProps: {
        checkStrictly: false,
        expandTrigger: 'hover',
        value: 'resource_id',
        label: 'name',
        children: 'children',
      },
      //复盘期间探针采集数据总数
      infoClassCount: 0,
      eventClassCount: 0,
      logClassCount: 0,
      flowClassCount: 0,
      // nodeId: 'e170b2ca-de2d-4ad9-92bc-b3556dfac97c',
      //用户信息
      userInfo: {
        avatarUrl: '',
        name: '',
        role: '',
        roleName: '',
        score: 0,
        totalTasks: 0,
        successTasks: 0,
        failTasks: 0,
        unFinishTasks: 0,
      },
      //复盘的时间点
      replayTime: '',
      //复盘状态，默认为暂停
      replayStatus: true,
      //所有用户选项
      userOptions: [],
      //数据重组后的用户级联选择器选项
      userList: [],
      activeTab: 'info',
      //任务列表数据
      taskList: [],
      //天文时间、作战时间及速率
      astronomicalTime: '',
      combatTime: '',
      rate: 1,
      astronomicalTimeInterval: null,
      combatTimeInterval: null,
      //录屏数据
      screenRecordData: [],
      //时间轴数据
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
        current_time: '',
      },
    };
  },
  created() {},
  mounted() {
    this.getAllUser();
    if (this.isRedBlue) {
      this.getRedBlueTimeData();
    }
  },
  beforeDestroy() {
    clearInterval(this.astronomicalTimeInterval);
    clearInterval(this.combatTimeInterval);
  },
  watch: {
    //当前用户
    user: {
      handler(val) {
        if (val) {
          // this.getUserTasks();
          // this.getRecordScreenByUser();
          // this.getTimeLineData();
        }
      },
    },
  },
  methods: {
    //获取复盘的所有用户
    getAllUser() {
      const params = {
        resource_id: this.$route.params.resource_id,
      };
      if (this.isRedBlue) {
        getRedBlueAllUsers(params).then((res) => {
          const data = _.get(res, 'data.data', []) || [];
          this.userOptions = data;
          if (data.length) {
            // 红蓝根据 type 和 role_name 对数据进行分组
            const groups = [];
            for (const item of data) {
              const type = item.type;
              const roleName = item.role_name;
              if (!groups[type]) {
                groups[type] = {};
              }
              if (!groups[type][roleName]) {
                groups[type][roleName] = [];
              }
              groups[type][roleName].push(item);
            }

            // 组装数据结构，封装成级联选择器的树形结构
            let tempData = [];
            for (let key in groups) {
              let roleData = [];
              for (let i in groups[key]) {
                let a = {
                  name: i,
                  resource_id: i,
                  children: groups[key][i],
                };
                roleData.push(a);
              }
              let obj = {
                resource_id: key,
                name:
                  key == 4
                    ? this.$t('common.redUser')
                    : this.$t('common.blueUser'),
                children: roleData,
              };
              tempData.push(obj);
            }
            this.userList = tempData;
            //用户级联选择器，默认选中第一条
            this.userSet = [
              tempData[0].resource_id,
              tempData[0].children[0].name,
              tempData[0].children[0].children[0].resource_id,
            ];

            this.user = tempData[0].children[0].children[0].resource_id;
            this.userInfo.avatarUrl = tempData[0].children[0].children[0].logo;
            this.userInfo.name = tempData[0].children[0].children[0].name;
            this.userInfo.roleName =
              tempData[0].children[0].children[0].role_name;
            this.userInfo.role = tempData[0].children[0].children[0].type;
            this.getUserTasks();
            this.getTimeLineData();
          }
        });
      } else {
        getTeamTrainAllUsers(params).then((res) => {
          const data = _.get(res, 'data.data', []) || [];
          this.userOptions = data;
          if (data.length) {
            // 团队根据 role_name 对数据进行分组
            const groups = {};
            for (const item of data) {
              const roleName = item.role_name;
              if (!groups[roleName]) {
                groups[roleName] = [];
              }
              groups[roleName].push(item);
            }
            // 组装数据结构，封装成级联选择器的树形结构
            let tempData = [];
            for (let key in groups) {
              let obj = {
                name: key,
                resource_id: key,
                children: groups[key],
              };
              tempData.push(obj);
            }
            this.userList = tempData;
            //用户级联选择器，默认选中第一条
            this.userSet = [
              tempData[0].resource_id,
              tempData[0].children[0].resource_id,
            ];

            this.user = tempData[0].children[0].resource_id;
            this.userInfo.avatarUrl = tempData[0].children[0].logo;
            this.userInfo.name = tempData[0].children[0].name;
            this.userInfo.roleName = tempData[0].children[0].role_name;
            this.getUserTasks();
            this.getTimeLineData();
          }
        });
      }
    },
    //获取当前用户的所有任务
    getUserTasks() {
      const params = {
        resource_id: this.$route.params.resource_id,
        user_id: this.user,
      };
      if (this.isRedBlue) {
        getRedBlueUserTasks(params).then((res) => {
          const data = _.get(res, 'data.data', {}) || {};
          this.userInfo.score = data.final_score || 0;
          this.userInfo.totalTasks = data.all_count;
          this.userInfo.successTasks = data.success_count;
          this.userInfo.failTasks = data.fail_count;
          this.userInfo.unFinishTasks = data.all_count - data.finish_count;
          this.taskList = data.task_list;
        });
      } else {
        getTeamUserTasks(params).then((res) => {
          const data = _.get(res, 'data.data', {}) || {};
          this.userInfo.score = data.final_score || 0;
          this.userInfo.totalTasks = data.all_count;
          this.userInfo.successTasks = data.success_count;
          this.userInfo.failTasks = data.fail_count;
          this.userInfo.unFinishTasks = data.all_count - data.finish_count;
          this.taskList = data.task_list;
        });
      }
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
    //获取当前用户的所有录屏
    getRecordScreenByUser() {
      const params = {
        page: 1,
        per_page: 99,
        // csceneId: 'd2b945b02177454ab584b53cdf6af26e',
        csceneId: this.sceneId,
        userId: this.user,
        resource_id: this.$route.params.resource_id,
      };
      getRecordScreenByUserRedBlue(params).then((res) => {
        const list = _.get(res, 'data.data.list', []) || [];
        // 将录屏分类，同一设备下的录屏放在一起
        let data = {};
        list.forEach((item, index) => {
          const { host, node_id } = item;
          if (!data[host]) {
            data[host] = {
              name: host,
              id: node_id,
              url: [],
            };
          }
          //录屏的开始时间必须在训练区间内
          if (
            new Date(item.create_time).getTime() >
              new Date(this.scaleTimes.start_time).getTime() &&
            new Date(item.create_time).getTime() <
              new Date(this.scaleTimes.end_time).getTime()
          ) {
            data[host].url.push({
              id: item.file_name,
              nodeId: item.node_id,
              name: item.file_name,
              url: item.play_url,
              startTime: item.create_time,
              endTime: item.end_time,
              userName: item.user_name,
              avatar: item.user_avatar,
              host: item.host,
            });
          }
        });
        //按照录屏开始时间，先对每个设备下录屏排序，再对设备排序
        let screenData = this.sortDevice(this.sort(Object.values(data)));
        this.screenRecordData = screenData;

        if (this.screenRecordData.length) {
          this.nodeId = this.screenRecordData[0].id;
          this.getProbeTotal();
        } else {
          //无录屏时清空节点id和探针采集统计数据
          this.nodeId = '';
          this.infoClassCount = 0;
          this.eventClassCount = 0;
          this.logClassCount = 0;
          this.flowClassCount = 0;
        }
      });
    },
    // 每个设备下的录屏按照录屏开始时间排序
    sort(arr) {
      let data = arr.filter((item) => {
        return item.url.length !== 0;
      });

      data.forEach((item) => {
        item.url.sort((a, b) => {
          const timeA = new Date(a.startTime).getTime();
          const timeB = new Date(b.startTime).getTime();
          return timeA - timeB;
        });
      });
      return data;
    },
    //将设备按照最早录屏开始时间排序排序
    sortDevice(arr) {
      return arr.sort(function (a, b) {
        const timeA = new Date(a.url[0].startTime).getTime();
        const timeB = new Date(b.url[0].startTime).getTime();
        return timeA - timeB;
      });
    },
    //获取时间轴数据
    getTimeLineData() {
      const params = {
        resource_id: this.$route.params.resource_id,
        user_id: this.user,
      };
      if (this.isRedBlue) {
        getRedBlueTimeLineData(params).then((res) => {
          const data = _.get(res, 'data.data', {}) || {};
          this.scaleTimes.current_time = data.current_time;
          this.scaleTimes.start_time = data.start_time;
          this.scaleTimes.end_time = data.end_time;
          this.scaleTimes.data = data.events;
          //得到训练区间时间后获取录屏数据，方便过滤
          this.getRecordScreenByUser();
        });
      } else {
        getTeamTrainTimeLineData(params).then((res) => {
          const data = _.get(res, 'data.data', {}) || {};
          this.scaleTimes.current_time = data.current_time;
          this.scaleTimes.start_time = data.start_time;
          this.scaleTimes.end_time = data.end_time;
          this.scaleTimes.data = data.events;
          this.getRecordScreenByUser();
        });
      }
    },
    //获取天文时间/作战时间
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

    //设备切换，录屏切换
    changeScreen(data) {
      this.nodeId = data.nodeId;
      this.getProbeTotal();
      this.$refs.monitorScreen.changeScreen(data);
      this.$refs.timeLine.changeScreen();
    },
    userChange() {
      if (this.userSet.length > 0) {
        this.user = this.userSet[2] ? this.userSet[2] : this.userSet[1];
      }
      this.userOptions.forEach((item, i) => {
        if (this.user == item.resource_id) {
          this.userInfo.avatarUrl = item.logo;
          this.userInfo.name = item.name;
          this.userInfo.roleName = item.role_name;
          this.userInfo.role = item.type || '';
        }
      });
      this.getUserTasks();
      this.getTimeLineData();
      this.changeRole = this.changeRole + 1; //切换的当前角色
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
      if (this.$refs.taskStep) {
        this.$refs.taskStep.changeTaskStatus(time);
      }
    },
    //更新复盘状态，true为暂停，false为进行中
    updateReplayStatus(status) {
      this.replayStatus = status;
    },
  },
};
</script>
<style lang="scss" scoped>
.replay-user {
  width: 100%;
  height: calc(100% - 50px);
  font-size: 14px;
  display: flex;
  .left {
    width: 376px;
    height: 100%;
    .user-info {
      width: 376px;
      height: 251px;
      border-radius: 2px;
      background: var(--bg-color-2);
      .user-select {
        padding: 12px 16px;
        .switch-icon {
          margin-left: 8px;
          color: var(--primary-color);
          cursor: pointer;
        }
      }
    }
    .split-line {
      width: 100%;
      height: 1px;
      background: var(--neutral3);
    }
    .task-state {
      padding: 16px;
      .user-count {
        display: flex;
        align-items: center;
        // padding: 0 16px;
        .red-role {
          max-width: 80px;
          height: 22px;
          line-height: 22px;
          background: var(--red-color-2);
          color: var(--red-color);
          margin: 0 4px;
          padding: 0px 8px;
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .blue-role {
          max-width: 80px;
          height: 22px;
          line-height: 22px;
          background: var(--blue-color-2);
          color: var(--blue-color);
          margin: 0 4px;
          padding: 0px 8px;
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
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
          max-width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .job {
          height: 22px;
          line-height: 22px;
          margin: 0px 0px 0px 4px;
          padding: 0px 8px;
          max-width: 80px;
          font-size: 12px;
          color: var(--neutral8);
          background: var(--neutral0);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .score {
          height: 22px;
          line-height: 22px;
          margin-left: 16px;
          color: var(--primary-color);
        }
      }
      .task-statistics {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 110px;
        margin-top: 8px;
        // padding: 16px;
        .task {
          width: 80px;
          height: 100%;
          background: var(--bg-color-3);
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .box {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--neutral0);
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-box {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon-style {
              color: var(--white-color);
            }
          }
          .total {
            background: var(--cyan-color);
          }
          .success {
            background: var(--green-color);
          }
          .fail {
            background: var(--red-color);
          }
          .unfinished {
            background: var(--yellow-color);
          }
        }
        .num {
          margin-bottom: 4px;
        }
      }
    }
    .task-list {
      width: 376px;
      height: calc(100% - 251px - 16px);
      margin-top: 16px;
      padding: 16px 16px 0px 16px;
      border-radius: 2px;
      background: var(--bg-color-2);
      .title {
        ::v-deep .cb-block-title {
          font-size: 16px;
        }
      }
      .list {
        height: calc(100% - 40px);
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
        background: var(--bg-color-3);
      }
      .table-area {
        width: 100%;
        // height: 200px;
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
