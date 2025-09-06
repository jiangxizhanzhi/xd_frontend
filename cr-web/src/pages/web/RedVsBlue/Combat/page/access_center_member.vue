<template>
  <div class="combat-member">
    <!-- 页面内容 -->
    <div class="combat-banner">
      <!-- 拓扑图 -->
      <scene-editor
        ref="sceneEditor"
        :title="breadcrumbName"
        :sceneConfig="sceneConfig"
        :topologyData="sceneData"
        :show-mask="showMask"
        :progress="progress"
        :allow-dialog="false"
        :show-title="false"
        :show-label="false"
        :status="'display'"
        :show-btn="showBtn"
        :show-mask-btn="showMaskBtn"
        :show-progress="showProgress"
        :btn-config="btnGroupConfig"
        @onAccess="openTap"
        :showNodeBtn="false"
        :mp-scene-id="sceneId"
        :show-snap-shot-btn="false"
        :ws-data="wsData"
        :node-link-connectivity-status="true"
      ></scene-editor>
    </div>
    <div
      class="right-task"
      :class="showTask ? 'cssAnimate' : 'cssAnimateRight'"
    >
      <div class="btn-left fr" @click="showTaskPanel()">
        <cb-iconfont v-if="showTask" type="icon-xiangzuo"></cb-iconfont>
        <cb-iconfont v-else type="icon-xiangyou"></cb-iconfont>
      </div>
      <div v-if="showTask" class="task-content">
        <div class="left-member fl">
          <!--时间-->
          <div class="time">
            <div class="time-top">
              <div class="tianwen fl">
                <p>{{ $t('m.astronomicalTime') }}</p>
                <div class="tainwen-box">
                  <div class="tianwen-top">{{ realTime1 }}</div>
                  <div class="tianwen-bottom">{{ realTime2 }}</div>
                </div>
              </div>
              <div class="tianwen fr">
                <p>{{ $t('m.operationalTime') }}</p>
                <div class="tainwen-box">
                  <div class="tianwen-top">{{ fightTime1 }}</div>
                  <div class="tianwen-bottom">{{ fightTime2 }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 活动公告带滚动部分 -->
          <div class="sendMessage">
            <acting-instrument :parent-hash="parentHash" />
          </div>
          <!-- 答题表单 -->
          <!-- <div class="taskAnswre"> -->
          <task-lists-member
            :task-list="taskList"
            :scheme="scheme"
            @listenSubmitAnswer="getTaskList"
          />
          <!-- </div> -->
        </div>
        <div class="right-member fr">
          <cb-scrollbar>
            <!-- 添加靶机 -->
            <add-host
              :id="resource_id"
              :scene-id="sceneId"
              ref="refAddHost"
              :topology-data="sceneData"
              :get-machine-info="getMachineInfo"
              :click-index="clickIndex"
              :cr-scene-id="$route.params.resource_id"
              :running-status="runningStatus"
              @showDialog="showDialog"
              @closeDialog="closeDialog"
            />
          </cb-scrollbar>
        </div>
      </div>
    </div>
    <!-- 添加靶机弹框 -->
    <cb-dialog
      v-if="centerDialogVisible"
      :visible.sync="centerDialogVisible"
      :title="$t('m.selectHost')"
      class="addMachine"
      center
    >
      <div style="height: 500px">
        <cb-scrollbar>
          <template>
            <ul>
              <li
                v-for="(item, index) in machinelists"
                :key="index"
                @click="getMachineIndex(index)"
              >
                <div
                  class="item-list"
                  :class="activeindex == index ? 'item-hover' : ''"
                >
                  <div class="img-box fl">
                    <img :src="item.icon2" alt />
                  </div>
                  <div class="text-box fl">
                    <cb-row>
                      <cb-col :span="6">
                        <div class="grid-content bg-purple">
                          {{ $t('m.machineName') }}:
                        </div>
                      </cb-col>
                      <cb-col :span="18">
                        <div
                          style="white-space: nowrap"
                          class="grid-content bg-purple-light blue-color one-overflow"
                          :title="item.name"
                        >
                          {{ item.name }}
                        </div>
                      </cb-col>
                    </cb-row>
                    <cb-row>
                      <cb-col :span="6">
                        <div class="grid-content bg-purple">IP:</div>
                      </cb-col>
                      <cb-col :span="18">
                        <div
                          class="grid-content bg-purple-light one-overflow"
                          :title="item.ports[0].ip"
                        >
                          {{ item.ports[0].ip }}
                        </div>
                      </cb-col>
                    </cb-row>
                    <cb-row>
                      <cb-col :span="6">
                        <div class="grid-content bg-purple">OS:</div>
                      </cb-col>
                      <cb-col :span="18">
                        <div
                          class="grid-content bg-purple-light one-overflow"
                          :title="item.image"
                        >
                          {{ item.image }}
                        </div>
                      </cb-col>
                    </cb-row>
                    <cb-row>
                      <cb-col :span="6">
                        <div class="grid-content bg-purple">
                          {{ $t('m.occupy') }}:
                        </div>
                      </cb-col>
                      <cb-col :span="18">
                        <div class="grid-content bg-purple-light one-overflow">
                          <span
                            v-text="
                              item.user_info
                                ? item.user_info
                                : $t('common.NoBody')
                            "
                          />
                        </div>
                      </cb-col>
                    </cb-row>
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </cb-scrollbar>
      </div>
      <div slot="footer" class="footer-btn">
        <cb-button
          button-type="confirm"
          mr
          @click="parentAddMachine()"
        ></cb-button>
        <cb-button
          button-type="cancel"
          @click="centerDialogVisible = false"
        ></cb-button>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import AddHost from '@/pages/web/RedVsBlue/Combat/components/add_host';
import TaskListsMember from '@/pages/web/RedVsBlue/Combat/components/task_lists_member';
import ActingInstrument from '@/pages/web/RedVsBlue/Combat/components/acting_instrument';
import { getData } from '@/api/common';
import { getUserTaskList } from '@/api/web/access_center_member.js';
import moment from 'moment';
import _ from 'lodash';
import { SceneEditor } from '@cyber/scene';
import DEFAULT_IMAGES from '@cyber/scene-icons';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';

export default {
  name: 'AccessCenterMember',
  components: {
    SceneEditor,
    AddHost,
    TaskListsMember,
    ActingInstrument,
  },
  props: {
    breadcrumbName: {
      type: String,
      default: '',
    },
    crEventData: {
      type: Object,
      default: () => {},
    },
    runningStatus: {
      type: Number,
      default: undefined,
    },
  },

  data() {
    return {
      cookie: '',
      DEFAULT_IMAGES,
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
      showMaskBtn: false, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: [], // 按钮组配置项
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      scene_manager_id: '',
      sceneId: '',
      activeindex: 0,
      showTask: true,
      taskList: [],
      timerSecond: 0,
      timerMinute: 0,
      timerHour: 0,
      inputTime: '00:00:00',
      realTime1: '',
      realTime2: '',
      fightTime1: '',
      fightTime2: '',
      message: null,
      timer01: null,
      timer02: null,
      rateValue: 1,
      loading: true,
      missionType: {
        // 题目类型
        EXAM: 0,
        CTF: 1,
        CHECK: 2,
      },

      id: null,
      name: '',
      // connection_url: {},
      tasktype: null,
      activityBulletin: this.$t('m.activityBulletin'),
      accessCenter: this.$t('m.accessCenter'),
      centerDialogVisible: false, // 弹出框
      flagValue: '', // 提交flasg
      cr_scene_id: '',
      topologyValue: {},
      activity_time: null,
      description: '',
      taskLists: {},
      activityList: [],
      machinelists: [],
      getMachineInfo: {},
      clickIndex: null,
      topologyData: {},
      messageList: [
        { message: '红001：红001对192.168.1.8进行了端口扫描.' },
        { message: '红001：红001对192.168.1.8进行了端口扫描.' },
        { message: '红001：红001对192.168.1.8进行了端口扫描.' },
        { message: '红001：红001对192.168.1.8进行了端口扫描.' },
        { message: '红001：红001对192.168.1.8进行了端口扫描.' },
      ],
      resource_id: '',
      scheme: '',
      parentHash: null,
      wsData: {},
    };
  },
  computed: {},
  watch: {
    crEventData: {
      handler(val, oldval) {
        if (val !== oldval) {
          this.getTaskList();
          // if (_.get(val, 'data.scene_manager_id', '')) {
          //   this.scene_manager_id = _.get(val, 'data.scene_manager_id');
          //   this.handleGetSceneData();
          //   this.bindSceneWs();
          // }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getRouterData();
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    /* this.cookie = document.cookie.split('cr_jwttoken=')[1]; */
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getTimeDate();
    this.memberReportWs();
    this.handleGetSceneData();
    this.bindSceneWs();
  },
  methods: {
    computedIcon(icon) {
      const image = DEFAULT_IMAGES[icon] ? DEFAULT_IMAGES[icon] : 'icon2';
      return image;
    },

    /**
     * 接入方式
     */
    openTap(connection_url, access_modes, nodeId) {
      const { id, protocol, access_ip, access_port, path } = access_modes;
      // 这两个协议 前端拼接
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
                page: 'red-blue-student',
                id,
                role_group: this.roleGroup,
                nodeName: _.get(res, 'data.data.node_name'),
                protocol,
                resource_id: this.resource_id,
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
      // 红蓝学员获取场景
      this.$request
        .get(
          `/cr/red_vs_blue/scene/`,
          { room_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = false;
          this.showProgress = status.showProgress;
          this.showBtn = false;
          this.sceneData = status.sceneData;
          this.progress = status.progress;

          // 场景id
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
        });
    },

    showTaskPanel() {
      this.showTask = !this.showTask;
    },

    // 获取任务列表
    getTaskList() {
      if (!_.isEmpty(this.crEventData.data)) {
        // this.scheme = this.crEventData.data.mission_scheme && this.crEventData.data.mission_scheme.scheme
        this.parentHash = this.crEventData.data.role_permission.parent_hash;
        this.resource_id = this.$route.params && this.$route.params.resource_id;
        // 学员登录获取任务列表
        getUserTaskList(this.url, { resource_id: this.resource_id }).then(
          (res) => {
            this.taskList = res.data.data;
          },
        );
      }
    },

    memberReportWs() {
      // 学员角色点击红蓝列表详情的ws
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          // 0: 已停止   1：已挂起    2：已开始   3：已恢复  4：未开始
          if (data.code === 1) {
            // this.getTaskDetail()
            this.getTaskList();
          }
          if (data.running_status === 1) {
            this.$message.success(this.$t('device.pause'));
          }
          if (data.running_status === 2) {
            this.$message.success(this.$t('device.running'));
          }
          if (data.running_status === 3) {
            this.$message.success(this.$t('device.recover'));
          }
          if (data.running_status === 0) {
            this.$message.success(this.$t('device.stop'));
          }
          if (data.running_status === 4) {
            this.$message.success(this.$t('device.nostart'));
          }
        },
      );
    },

    // 计时器
    startTime() {
      setInterval(() => {
        this.timerSecond = this.timerSecond + 1;
        if (this.timerSecond >= 60) {
          this.timerSecond = 0;
          this.timerMinute = this.timerMinute + 1;
        }
        if (this.timerMinute >= 60) {
          this.timerMinute = 0;
          this.timerHour = this.timerHour + 1;
        }
        this.inputTime =
          this.p(this.timerHour) +
          ':' +
          this.p(this.timerMinute) +
          ':' +
          this.p(this.timerSecond);
      }, 1000);
    },

    // 初始化时间
    formatTime(astronomical, combat) {
      if (astronomical) {
        astronomical = new Date(astronomical).valueOf();
      } else {
        astronomical = new Date(new Date()).valueOf();
      }
      this.timer01 = setInterval(() => {
        astronomical += 1000;
        this.realTime2 = moment(astronomical).format('YYYY-MM-DD');
        this.realTime1 = moment(astronomical).format('HH:mm:ss');
      }, 1000);
      if (combat) {
        combat = new Date(combat).valueOf();
      } else {
        combat = new Date(new Date()).valueOf();
      }
      this.timer02 = setInterval(() => {
        combat += 1000;
        this.fightTime2 = moment(combat).format('YYYY-MM-DD');
        this.fightTime1 = moment(combat).format('HH:mm:ss');
      }, 1000 / this.rateValue);
    },

    // 英文的星期
    week(str) {
      switch (new Date().getDay()) {
        case 0:
          str = 'Sunday';
          break;
        case 1:
          str = 'Monday';
          break;
        case 2:
          str = 'Tuesday';
          break;
        case 3:
          str = 'Wednesday';
          break;
        case 4:
          str = 'Thursday';
          break;
        case 5:
          str = 'Friday';
          break;
        case 6:
          str = 'Saturday';
          break;
      }
      return str;
    },

    p(s) {
      return s < 10 ? '0' + s : s;
    },

    onResultChange(val) {
      this.time = val; // 外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
    },

    getRouterData() {
      this.id = this.$route.params && this.$route.params.id;
      this.cr_scene_id = this.$route.params && this.$route.params.cr_scene_id;
    },

    getTimeDate() {
      // 获取时间管理数据
      getData(this.url, { resource_id: this.resource_id }).then((res) => {
        const datas = res.data.data;
        if (!_.isEmpty(datas)) {
          const first_data = datas;
          this.rateValue = first_data.rate;
          if (first_data.status === 0 || first_data.status === 1) {
            // clearInterval(this.timer02)
            this.fightTime2 = moment(first_data.current_combat_time).format(
              'YYYY-MM-DD',
            );
            this.fightTime1 = moment(first_data.current_combat_time).format(
              'HH:mm:ss',
            );
            let astronomical = moment(first_data.astronomical_time).valueOf();
            this.timer01 = setInterval(() => {
              astronomical += 1000;
              this.realTime2 = moment(astronomical).format('YYYY-MM-DD');
              this.realTime1 = moment(astronomical).format('HH:mm:ss');
            }, 1000);
          } else {
            this.formatTime(
              first_data.current_astronomical_time,
              first_data.current_combat_time,
            );
          }
        } else {
          this.formatTime();
        }
      });
    },

    parentAddMachine() {
      this.$refs.refAddHost.addMachine();
    },

    showDialog(data) {
      this.clickIndex = data.index;
      this.machinelists = data.machinelists;
      if (
        this.machinelists.length > 0 &&
        this.$_.isEmpty(this.getMachineInfo)
      ) {
        this.getMachineInfo = this.machinelists[0];
      }
      this.centerDialogVisible = true;
    },

    closeDialog() {
      this.centerDialogVisible = false;
    },

    getMachineIndex(index) {
      this.getMachineInfo = this.machinelists[index];
      this.activeindex = index;
    },
    //学员的进度条
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
<style lang="scss">
.combat-member {
  position: relative;
  .el-scrollbar,
  .el-scrollbar__view {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}
// 靶机弹框
.addMachine {
  // 弹框
  .el-dialog {
    width: 620px;
  }
  .el-dialog__body {
    height: 547px;
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
    .el-scrollbar__bar.is-horizontal {
      height: 0;
      left: 0;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
    .item-list {
      cursor: pointer;
      height: 162px;
      margin: 21px 25px;
      border: 1px solid transparent;
      border-radius: 2px;
    }
    .item-hover {
      border: 1px solid rgba(63, 228, 238, 0.5);
    }
    .img-box {
      width: 10%;
      padding: 40px;
      img {
        display: block;
        width: 100px;
        height: 100px;
      }
    }
    .text-box {
      width: 62%;
      margin-left: 80px;
      .el-row {
        margin: 15px;
        .bg-purple-light {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
<style lang="scss" scope>
.bottom-btn {
  z-index: 10;
  margin-top: -50px;
  margin-left: 20px;
  position: absolute;
}
.el-popup-parent--hidden {
  overflow: visible !important;
}
.combat-member {
  position: relative;
  width: 100%;
  height: 100%;

  .cssAnimate {
    width: 45.7%;
    min-width: 500px;
    transition: all 0.5s ease;
  }
  .cssAnimateRight {
    width: 1px;
    transition: all 0.5s ease;
  }
  .right-task {
    height: 100%;
    max-height: 916px;
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    .btn-left {
      cursor: pointer;
      width: 20px;
      height: 50px;
      border-radius: 2px 0 0 2px;
      line-height: 50px;
      text-align: center;
      position: absolute;
      top: 34px;
      left: -20px;
      z-index: 10;
      svg {
        font-size: 12px !important;
      }
    }
    .task-content {
      z-index: 10;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 2px;
      position: absolute;
      right: 0;
      .left-member {
        width: calc(50% - 1px);
        height: 100%;
        border-right: 1px solid var(--neutral3);
        .time {
          height: 20%;
          overflow: hidden;
          min-height: 134px;
          border-bottom: 1px solid var(--neutral3);
          .time-top {
            padding: 5px 10px;
            text-align: center;
            overflow: hidden;
            padding: 30px 0 0 30px;
            .tianwen {
              width: 50%;
              float: left;
              p {
                padding: 5px 0 0;
                margin: 0;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                text-align: left;
              }
              .tainwen-box {
                .tianwen-top {
                  letter-spacing: 5px;
                  font-size: 26px;
                  font-family: Microsoft YaHei;
                  font-weight: bold;
                  text-align: left;
                  padding: 5px 0;
                }
                .tianwen-bottom {
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  text-align: left;
                  padding-bottom: 7px;
                }
              }
            }
          }
        }
        .sendMessage {
          width: 100%;
          height: 42%;
          padding-left: 30px;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(114, 126, 154, 0.5);
        }
      }
      .right-member {
        width: 50%;
        height: 100%;
      }
    }
  }
  .header {
    // 倒计时
    #clock_box {
      width: 258px;
      height: 36px;
      border: 2px solid #0096ff;
      border-radius: 10px;
      display: inline-block;

      .clock_ico {
        width: 56px;
        height: 100%;
        background: #0096ff;
        border-radius: 4px;
        float: left;
        text-align: center;

        i {
          font-size: 28px;
          margin-top: 4px;
        }
      }

      time {
        font-size: 32px;
        width: calc(100% - 58px);
        text-align: center;
        display: inline-block;
        font-family: 'UnidreamLED';
        line-height: 32px;
        letter-spacing: 5px;
      }
    }

    /*右侧按钮*/
    .access-btn {
      .el-button {
        padding: 5px 20px !important;
      }
    }
  }

  // banner样式
  .combat-banner {
    width: 100%;
    height: 100%;
    .elc-scene-loader-container .helper .size-btn {
      left: 30px;
    }
    .el-row {
      height: 100%;
    }
    .banner-center {
      height: 100%;
      // 拓扑
      .elc-scene-loader-container {
        height: 64%;
        margin-bottom: 1%;
      }
    }
    .addHost {
      height: 35% !important;

      .squash {
        height: 98% !important;
        .hosts {
          height: 87% !important;
        }
      }
    }

    // 右侧任务信息
    .banner-right {
      padding: 0 0 !important;
      /*background-color: #262d47;*/
      height: 100%;
    }
    @media screen and (max-width: 1366px) {
      .time {
        height: 22% !important;
      }
    }
    .time {
      height: 19%;
      overflow: hidden;
      min-height: 160px;
      .time-title {
        padding-left: 16px;
        padding-top: 10px;
        margin-bottom: 10px;
        h4 {
          color: #1ea3fe;
        }
      }
      .time-top {
        padding: 5px 10px;
        text-align: center;
        overflow: hidden;
        .tianwen {
          width: 48%;
          float: left;
          p {
            margin-bottom: 9px;
          }
          .tainwen-box {
            background-color: rgb(33, 39, 63);
            border-radius: 6px;
            .tianwen-top {
              font-family: 'AequilateLED';
              font-weight: 600;
              font-size: 36px;
              letter-spacing: 1px;
            }
            .tianwen-bottom {
              color: #1f98e9;
              padding-bottom: 7px;
            }
          }
        }
        .zuozhan {
          width: 48%;
          float: right;
          p {
            margin-bottom: 9px;
          }
          .zuozhan-box {
            background-color: rgb(33, 39, 63);
            border-radius: 6px;
            .zuozhan-top {
              font-family: 'AequilateLED';
              font-weight: 600;
              font-size: 36px;
              letter-spacing: 2px;
            }
            .zuozhan-bottom {
              padding-bottom: 7px;
              color: #1f98e9;
            }
          }
        }
      }
    }
    .sendMessage {
      width: 100%;
      height: 33%;
      .messageTop {
        border-radius: 4px;
        background-color: #1c2238;
        margin: 3px 3px;
      }
      .sendForm {
        .el-form {
          margin-top: 2px;
        }
        .el-form-item {
          margin-bottom: 5px;
          label {
            color: #a8afc1;
          }
        }
        .el-form-item:nth-of-type(1n) {
          width: 65%;
        }
        .el-form-item:nth-of-type(2n) {
          width: 26%;
        }
        .el-form-item__content {
          width: 100%;
        }
        .el-input__inner {
          width: 94%;
          height: 30px;
          background: #222840;
          border: 1px solid #3d4667 !important;
          color: #fff;
        }
        .el-input {
          margin-left: 5px;
        }
        button {
          width: 100%;
          height: 25px;
          border-radius: 5px;
          text-align: center;
          padding: 1px !important;
          border-color: #409eff;
          span {
            font-size: 13px;
          }
        }
      }
      @media screen and (max-width: 1366px) {
        .el-scrollbar {
          height: 80% !important;
        }
      }
      .el-scrollbar {
        height: 90%;
        margin-top: 4px;
        border-radius: 8px;
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
        .lists {
          padding: 4px 10px;
          box-sizing: border-box;
          p {
            color: #626a87;
            font-size: 13px;
          }
        }
      }
    }
    .icon-circle {
      font-size: 21px;
      margin-left: -4px;
    }

    .el-icon-success {
      color: #02ffa5;
      font-size: 16px;
    }

    .el-icon-error {
      color: #f44c4c;
      font-size: 16px;
    }
  }
  .el-loading-mask {
    z-index: 800;
  }
  .elc-dialog-btn-ensure {
    width: 20%;
  }
  .elc-dialog-btn-cancel {
    width: 20%;
  }
}
</style>
