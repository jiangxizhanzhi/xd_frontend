<template>
  <div class="team-train-detail lay-com">
    <div class="header">
      <!-- 顶部标题 -->
      <train-top-title
        :detail-title="detailTitle"
        @back="backHome"
        :isEnd="isEnd"
      >
      </train-top-title>
      <div class="header-right">
        <cb-button icon="icon-honglanduikang" hollow @click="gotoDataVis">
          {{ $t('m.dataVis') }}
        </cb-button>
      </div>
    </div>

    <!-- 编辑器 -->
    <div class="topology">
      <scene-editor
        v-if="refresh"
        :sceneConfig="sceneConfig"
        :topologyData="sceneData"
        :show-mask="showMask"
        :progress="progress"
        :progress-localize="progressLocalize"
        :stage-progress="stageProgress"
        :show-label="false"
        :show-title="false"
        :allow-dialog="false"
        :status="'display'"
        :show-btn="showBtn"
        :show-mask-btn="showMaskBtn"
        :show-progress="showProgress"
        :btn-config="btnGroupConfig"
        :allow-start="false"
        @onAccess="openTap"
        :mp-scene-id="sceneId"
        :show-snap-shot-btn="false"
        :show-node-btn="false"
        :ws-data="wsData"
        :node-link-connectivity-status="true"
        :business_id="resource_id"
        :open-layer="true"
        :scene-config-id="sceneId"
        :breadcrumb-localize="breadcrumbLocalize"
        :needToJudgeRoleAssetAllocation="true"
      >
      </scene-editor>
    </div>
    <!--底部 时间轴 -->
    <div class="footer">
      <div class="center-footer fl">
        <div class="timeBox">
          <div class="astronomicalBox fl">
            <div class="editBox">
              <span class="time-desc">{{ $t('m.astronomicalTime') }}</span>
            </div>
            <div>
              <div class="time">
                <span class="time-y">{{ realTime2 }}</span>
                <span class="time">{{ realTime1 }}</span>
              </div>
            </div>
          </div>
          <div class="combatBox fl">
            <div class="editBox">
              <span>{{ $t('m.operationalTime') }}</span>
            </div>
            <div>
              <div class="time">
                <span class="time-y">{{ fightTime2 }}</span>
                <span class="time">{{ fightTime1 }}</span>
                <div
                  clsaa="rate-value"
                  style="
                    position: absolute;
                    bottom: 5px;
                    left: 180px;
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
        <time-line :scale-times="scaleTimes" :role_group="role_group" />
      </div>
    </div>

    <!-- 主体部分 -->
    <div class="main-detail-content">
      <!-- 左边区域 -->
      <div class="left-content common-content-style">
        <!-- 左侧背景 -->
        <train-detail-bg />
        <div class="task-specification cyber-scroll-bar-small">
          <train-detail-title :text="$t('m.taskSpecification')" />
          <div class="task-content">
            <!-- 任务说明 -->
            <mission-statement :train-description="trainDescription" />
          </div>
          <train-detail-title :text="$t('rbt.activeAssets')">
            <div slot="left">
              <cb-button icon="icon-xinzeng" type="text" @click="addHost">{{
                $t('rbt.add')
              }}</cb-button>
            </div>
          </train-detail-title>
          <!-- TODO:常用资产 -->
          <div class="assets-wrap cyber-scroll-bar-small">
            <common-assets
              ref="commonAssetsRef"
              :topology-data="sceneData"
              :resource_id="resource_id"
              :runningStatus="runningStatus"
              :start="start"
              @connect="openTap"
            ></common-assets>
          </div>
        </div>
      </div>
      <!-- 中间区域 -->
      <div class="middle-content common-content-style">
        <!-- 中间区域背景 -->
        <train-middle-bg
          :avatar="topData.logo"
          :type="role_group === 4 ? 'red' : 'blue'"
        />
        <div class="person-score-info">
          <div class="person-score-info-left">
            <div class="item border-right">
              <div
                class="score"
                :class="[role_group === 4 ? 'red-color' : 'blue-color']"
              >
                {{ topData.success_count }}
              </div>
              <div class="text">{{ $t('m.success') }}</div>
            </div>
            <div class="item border-right">
              <div
                class="score"
                :class="[role_group === 4 ? 'red-color' : 'blue-color']"
              >
                {{ topData.fail_count }}
              </div>
              <div class="text">{{ $t('m.singleFailed') }}</div>
            </div>
            <div class="item border-right">
              <div
                class="score"
                :class="[role_group === 4 ? 'red-color' : 'blue-color']"
              >
                {{ topData.reject_count }}
              </div>
              <div class="text">{{ $t('taskStatus.reject') }}</div>
            </div>
            <div class="item">
              <div
                class="score"
                :class="[role_group === 4 ? 'red-color' : 'blue-color']"
              >
                {{ topData.finish_count }}/{{ topData.all_count }}
              </div>
              <div class="text">{{ $t('m.progress') }}</div>
            </div>
          </div>
          <div class="person-score-info-middle">
            <div class="item">
              <div class="name one-overflow" :title="$store.state.user.name">
                {{ this.$store.state.user.name }}
              </div>
            </div>
          </div>
          <div class="person-score-info-right">
            <div class="item border-right border-score">
              <div
                class="score"
                :class="[role_group === 4 ? 'red-color' : 'blue-color']"
              >
                {{ topData.score }}
              </div>
              <div class="text">{{ $t('rbt.scoresTotal') }}</div>
            </div>
            <div class="item">
              <div
                class="score"
                :class="[role_group === 4 ? 'red-color' : 'blue-color']"
              >
                {{ getFormatTime(topData.time_cost) }}
              </div>
              <div class="text">{{ $t('m.trainTime') }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右边区域 -->
      <div class="right-content common-content-style">
        <!-- 右侧背景 -->
        <train-detail-bg type="right" />
        <div class="train-task-detail">
          <train-detail-title :text="$t('m.taskMatrix')" type="right" />
          <!-- TODO:任务矩阵 -->
          <task-student
            ref="taskRef"
            @getTaskList="getTaskList"
            :resource_id="resource_id"
          />
          <train-detail-title :text="$t('m.exerciseDocument')" type="right">
            <div slot="right">
              <cb-button
                icon="icon-shouquanfangwen"
                type="text"
                @click="showDialog = true"
                >{{ $t('rbt.detail') }}</cb-button
              >
            </div>
          </train-detail-title>
          <div class="document cyber-scroll-bar-small">
            <CbMarkdown v-model="model.content" type="viewer" />
            <!-- 暂无数据 -->
            <div
              v-if="!model.content"
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
        </div>
      </div>
    </div>
    <!-- 文书详情弹窗 -->
    <cb-dialog
      :title="$t('rbt.detail')"
      :visible.sync="showDialog"
      width="1000px"
    >
      <div
        class="cyber-scroll-bar-small"
        style="height: 600px; overflow-y: scroll"
      >
        <CbMarkdown v-model="model.content" type="viewer" />
      </div>
    </cb-dialog>
    <div class="char-box">
      <ChatTool ref="charTool" />
    </div>
    <Notice
      ref="noticeRef"
      type="red"
      :resourceId="resource_id"
      :role="role_group"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { SceneEditor } from '@cyber/scene';
import MissionStatement from './components/mission-statement.vue';
import commonAssets from './components/common-assets.vue';
import TrainTopTitle from '@/components/student-common-detail/train-top-title/index.vue';
import TrainDetailBg from '@/components/student-common-detail/train-detail-bg/index.vue';
import TrainDetailTitle from '@/components/student-common-detail/train-detail-title/index.vue';
import TrainMiddleBg from '@/components/student-common-detail/train-middle-bg/index.vue';
import ChatTool from '@/components/ChatTools/index.vue';
import Notice from '@/pages/web/notice/index.vue';
import emptyPage from '@/pages/web/Empty';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import { getData } from '@/api/common';
import moment from 'moment';
import { getConnectionApi } from '@/api/web/team-training';
import TimeLine from '@/components/TimeLine/redBlueTimeLine.vue';
import {
  getEditBack,
  getExercisePaper,
  studentTimeLine,
  trainingInstruction,
} from '@/api/web/red-blue';
import { getRedBlueTimeData } from '@/api/web/replay';
import { getValueName } from '@/assets/js/tools.js';
import { getUserInfo, getSysSettings } from '@cyber/helper';
import { routerResolve } from '@cyber/helper';
import taskStudent from './components/task-student.vue'; //任务矩阵
import { getCurrentModuleByRouterName } from '../../../../utils';

export default {
  components: {
    TrainTopTitle,
    SceneEditor,
    TimeLine,
    MissionStatement,
    commonAssets,
    TrainDetailBg,
    TrainDetailTitle,
    TrainMiddleBg,
    ChatTool,
    Notice,
    taskStudent,
    emptyPage,
  },
  data() {
    return {
      isEnd: false, //已结束展示结束标记
      showDialog: false,
      student_user_id: '',
      runningStatus: undefined, //
      role_group: '',
      middleData: {},
      cookie: '',
      detailTitle: '',
      room_id: '',
      local_scene_id: '',
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: [],
        showToolbar: false,
      },
      /* 进度条信息 */
      progress: {
        progressRate: 0,
        progressInfo: '',
        status: undefined,
      },

      /* 阶段进度 */
      stageProgress: {
        stageList: [],
        stageName: '',
        stagePercentage: 0,
      },
      progressLocalize: {
        width: 'calc(100% - 398px - 398px - 16px - 16px)',
        left: 'calc(398px + 16px)',
        bottom: 'calc(40px + 29px)',
      },
      // 层节点面包屑的位置，与css样式中写的值同步
      breadcrumbLocalize: {
        top: '130px',
        left: 'calc(398px + 16px + 20px)',
      },
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据

      scene_manager_id: '', // 用于通用场景请求
      showMaskBtn: false, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: [], // 按钮组配置项
      crEventData: {},
      taskTrain: this.$t('m.groupTraining'),
      showInfo: true,
      showTask: true,
      showTrainRecord: false,
      showAnswerDialog: false,
      showTreeFile: true, // true显示tree树，false显示文档
      trainDescription: {
        trainType: '',
        nodes_count: '',
        duration_time: '',
        trainDifficult: '',
        pre_skill: [],
        train_skill: [],
        description: '',
      },
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
        duration_time: '',
      },
      resource_id: this.$route.params && this.$route.params.resource_id,
      scene_manager_id: '',
      sceneId: '',
      wsData: {},
      parentHash: null,
      taskList: [],
      rateValue: 1,
      realTime1: '',
      realTime2: '',
      fightTime1: '',
      fightTime2: '',
      timer01: null,
      timer02: null,
      topData: {},
      timer: null, // 训练时长定时更新
      model: {
        content: '',
      },
      start: false,
      rateSubmitValue: '',
      refresh: true,
      scene_name: '',
    };
  },
  watch: {
    resource_id: {
      handler(nv, ov) {
        if (nv) {
          this.getUserInfo();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.student_user_id = this.$store.state.user.id;
    this.trainingInstruction();
    //红蓝对抗查询单个
    if (this.resource_id) {
      getEditBack({ resource_id: this.resource_id }).then(async (res) => {
        this.crEventData = res.data.data;
        this.runningStatus = res.data.data.training_status;
        if (this.runningStatus === 0) {
          this.isEnd = true;
        }
        this.role_group = res.data.data.role_permission.role_group;
        // this.detailTitle =
        //   this.$t('admin.cyberWargame') + '-' + res.data.data.name;
        this.scene_name = res.data.data.name;
        this.trainDescription.pre_skill = res.data.data.pre_skill;
        this.trainDescription.train_skill = res.data.data.train_skill;
        this.getExerciseDocument();
        this.detailTitle =
          (await getCurrentModuleByRouterName('red-vs-blue')) +
          '-' +
          res.data.data.name;
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
    this.getTimeDate();
    this.statusWs();
    this.exercisePaperWs();
    this.handleGetSceneData();
    this.initTimeLineData();
    this.getRedBlueTimeData();
  },
  beforeDestroy() {
    if (this.timer01) {
      clearInterval(this.timer01);
    }
    if (this.timer02) {
      clearInterval(this.timer02);
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = null;
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        this.bindSceneWs();
      });
    },
    backHome() {
      this.$router.go(-1);
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
    },
    getTaskList(val) {
      // 更新顶部数据
      this.topData = {
        ...val,
      };
      // 更新时间轴
      this.initTimeLineData();
      // 获取到数据之后根据状态启动定时器
      if (this.topData.started) {
        this.getTimeStart();
      }
    },
    // 训练说明
    trainingInstruction() {
      trainingInstruction({ resource_id: this.resource_id }).then((res) => {
        this.trainDescription.trainType = getValueName(
          this.$CONSTANT.Condition.Category,
          res.data.data.category,
        );
        this.trainDescription.trainDifficult = getValueName(
          this.$CONSTANT.Condition.Difficult,
          res.data.data.difficult,
        );
        this.trainDescription.duration_time = res.data.data.duration_time;
        this.trainDescription.nodes_count = res.data.data.nodes_count;
      });
    },
    getExerciseDocument() {
      const params = {
        resource_id: this.resource_id,
        group_hash: this.role_group,
      };
      getExercisePaper(params).then((res) => {
        this.model.content = res.data.data.exercise_paper;
      });
    },
    /**
     * 接入方式
     */
    openTap(connection_url, access_modes, nodeId, image_type, nodeName) {
      const { id, protocol, access_ip, access_port, path } = access_modes;
      if (protocol === 'http' || protocol === 'https') {
        let connection_url = '';
        if (!!path) {
          connection_url = `${protocol}://${access_ip}:${access_port}${path}`;
        } else {
          connection_url = `${protocol}://${access_ip}:${access_port}`;
        }
        // window.open(connection_url, '_blank');
        const url = this.$router.resolve({
          name: 'scene-screen-recording',
          query: {
            page: 'red-blue-student',
            image_type,
            id,
            role_group: this.role_group,
            nodeName,
            protocol,
            connection_url: connection_url,
            resource_id: this.resource_id,
            scene_id: this.sceneId,
            scene_name: this.scene_name,
            node_id: nodeId,
          },
        });
        window.open(url.href, '_blank');
      } else {
        const params = {
          access_mode_id: id,
          context: {
            access_user_id: this.$store.state.user.id,
          },
          id: this.sceneId,
          node_id: nodeId,
        };
        getConnectionApi(params).then((res) => {
          const url = this.$router.resolve({
            name: 'scene-screen-recording',
            query: {
              image_type,
              page: 'red-blue-student',
              id,
              role_group: this.role_group,
              nodeName: nodeName,
              protocol,
              resource_id: this.resource_id,
              connection_url: _.get(res, 'data.data.connection_url'),
              node_id: nodeId,
              connection_id: _.get(res, 'data.data.connection_id'),
              scene_id: this.sceneId,
              user_id: this.$store.state.user.id,
              scene_name: this.scene_name,
            },
          });
          window.open(url.href, '_blank');
        });
      }
    },
    // 添加操作
    addHost() {
      const allowAddHostMap = [2, 3];
      if (allowAddHostMap.some((it) => it === this.runningStatus)) {
        this.initData();
      } else {
        this.$message.error(this.$t('m.addHostMessage'));
      }
    },
    initData() {
      // 判断是否启动成功的scene信息，只有启动成功的时候学员才可以添加资产
      // canAddList不为空可添加资产
      const sceneIsSuccessInfo =
        this.sceneData &&
        this.sceneData.scene_config.topology &&
        this.sceneData.scene_config.topology.scene;
      if (
        sceneIsSuccessInfo &&
        (sceneIsSuccessInfo.event === 2 ||
          sceneIsSuccessInfo.event === 10 ||
          sceneIsSuccessInfo.event === 7 ||
          sceneIsSuccessInfo.event === 13) &&
        sceneIsSuccessInfo.event_status === 4
      ) {
        this.$refs.commonAssetsRef.getCanAddDevice();
      } else {
        this.$message.error(this.$t('m.noHasAircraft'));
        return false;
      }
    },
    /**
     * 获取场景数据
     */
    handleGetSceneData(refresh) {
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
          this.start = status.showBtn;
          this.stageProgress = status.stageProgress;
          //获取local_scene_id,room_id
          this.local_scene_id = res.data.data.local_scene_id;
          this.room_id = res.data.data.room_id;
          // 场景id
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          refresh && this.changeTopo();
        });
    },
    // ws请求
    bindSceneWs() {
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.resource_id}&token=${this.cookie}`,
        {
          '': (data) => {
            const wsData = handleWsData(
              data,
              this.progress,
              this.stageProgress,
              this.sceneData,
            );
            if (data.type === 'scene_element') {
              this.wsData = data.data;
            } else {
              // 场景相关的推送数据，更新场景id
              if (!this.sceneId) {
                this.sceneId = _.get(data, 'data.cscene_id', '') || '';
              }
            }
            if (this.wsData.call_action === 'node_access_user') {
              // 接入消息
              this.$refs.commonAssetsRef.addedList.forEach((item) => {
                if (item.id === this.wsData.node_id) {
                  item.access_users = this.wsData.data;
                }
              });
            } else {
              // 非接入消息
              // 节点开机关机状态
              this.$refs.commonAssetsRef.addedList.forEach((item) => {
                if (item.id === this.wsData.scene_element.id) {
                  item.event = this.wsData.scene_element.event;
                  item.event_status = this.wsData.scene_element.event_status;
                  item.name = this.wsData.scene_element.name;
                  // 更新节点端口的port协议接入数据
                  item.ports.forEach((port) => {
                    if (
                      this.wsData.scene_element_port_plugin_data.cpcloud.hasOwnProperty(
                        port.id,
                      )
                    ) {
                      port['cloud_access_modes'] =
                        this.wsData.scene_element_port_plugin_data.cpcloud[
                          port.id
                        ].access_modes;
                    }
                  });
                }
              });
              // 如果节点是删除操作，需要移除列表里面的节点
              let deleteStatus =
                this.wsData.scene_element?.event == 9 &&
                this.wsData.scene_element?.event_status == 4;
              if (deleteStatus) {
                let deviceIndex =
                  this.$refs.commonAssetsRef.addedList?.findIndex(
                    (item) => item.id === this.wsData.scene_element.id,
                  );
                deviceIndex >= 0 &&
                  this.$refs.commonAssetsRef.addedList.splice(deviceIndex, 1);
              }
            }
            if (wsData) {
              this.showMask = wsData.showMask;
              this.showMaskBtn = false;
              this.showProgress = wsData.showProgress;
              this.showBtn = false;
            }
          },
          6: (data) => {
            // 刷新常用资产
            this.$refs.commonAssetsRef.getAddedDevice();
            if (data.type === 1) {
              // 更新拓扑
              this.$message.success(this.$t('crEvent.topoUpdated'));
              this.handleGetSceneData(true);
            }
            if (data.type === 2) {
              this.handleGetSceneData(true);
            }
          },
        },
      );
    },
    exercisePaperWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/exercise_paper?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          if (data.code === 5) {
            this.getExerciseDocument();
          }
        },
      );
    },
    statusWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          // 0: 已停止   1：已挂起    2：已开始   3：已恢复  4：未开始
          if (data.code === 1) {
            // 裁判评估刷新列表
            this.$refs.taskRef.initData();
          }
          if (data.code === 7) {
            // 有任务下发
            // 获取任务矩阵
            this.$refs.taskRef.initData();
          }
          // 更新时间轴标记相关
          // console.log(data.code, '红蓝学员ws');
          if (data.code === 9) {
            // console.log(data.code, '红蓝学员成功');
            this.initTimeLineData();
          }
          if (data.runningStatus === 1) {
            // 暂停
            this.$message.success(this.$t('device.pause'));
            this.pauseCombatTime();
            this.getTimePaused(); // 训练时长暂停计时
          }
          if (data.runningStatus === 2) {
            this.$message.success(this.$t('device.running'));
          }
          if (data.runningStatus === 3) {
            // 恢复
            this.$message.success(this.$t('device.recover'));
            this.recoverCombatTime();
            this.getTimeStart(); // 训练时长恢复计时
          }
          if (data.runningStatus === 0) {
            // 停止
            this.$message.success(this.$t('device.stop'));
            this.stopCombatTime();
            this.getTimePaused(); // 训练时长停止计时
          }
          if (data.runningStatus === 4) {
            this.$message.success(this.$t('device.nostart'));
          }
        },
      );
    },
    // 暂停作战时间
    pauseCombatTime() {
      clearInterval(this.timer02);
    },
    // 恢复作战时间
    recoverCombatTime() {
      clearInterval(this.timer2);
      let currentCombat = this.fightTime2.concat(' ', this.fightTime1);
      const d = new Date(currentCombat || new Date());
      this.timer02 = setInterval(() => {
        var d_s = d.getTime(); // 转化为时间戳毫秒数
        d.setTime(d_s + 1000);
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
        this.fightTime2 = resDate;
        this.fightTime1 = resTime;
      }, 1000 / this.rateSubmitValue);
    },
    p(s) {
      return s < 10 ? '0' + s : s;
    },
    // 停止作战时间
    stopCombatTime() {
      clearInterval(this.timer02);
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
            let astronomical = moment(
              first_data.current_astronomical_time,
            ).valueOf();
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
    // 时间轴数据
    initTimeLineData() {
      // 登录获取作战时间
      studentTimeLine({ resource_id: this.resource_id }).then((res) => {
        this.scaleTimes = res.data.data;
      });
    },
    getRedBlueTimeData() {
      const params = {
        resource_id: this.$route.params.resource_id,
      };
      getRedBlueTimeData(params).then((res) => {
        const data = res?.data?.data;
        this.rateSubmitValue = data.rate;
      });
    },
    // 刷新场景
    changeTopo() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
    },
    // 获取格式化时间
    getFormatTime(second) {
      if (second === null) {
        return;
      }
      const days = Math.floor(second / 86400);
      const hours = Math.floor((second % 86400) / 3600);
      const minutes = Math.floor(((second % 86400) % 3600) / 60);
      const seconds = Math.floor(((second % 86400) % 3600) % 60);
      const getDay = days > 0 ? `${days}${this.$t('m.day')}` : '';
      const getHour = hours > 0 ? `${hours}${this.$t('m.Hour')}` : '';
      const getMinute = minutes > 0 ? `${minutes}${this.$t('m.minute')}` : '';
      const getSecond = `${seconds}${this.$t('m.second')}`;

      const formatTime = `${getDay}${getHour}${getMinute}${getSecond}`;
      return formatTime;
    },
    // 添加定时器计时
    getTimeStart() {
      if (this.timer) {
        clearInterval(this.timer);
      } else {
        this.timer = setInterval(() => {
          this.topData.time_cost++;
        }, 1000);
      }
    },
    // 暂停计时
    getTimePaused() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.team-train-detail {
  width: 100%;
  height: 100%;
  font-size: 14px;
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
  .topology {
    width: 100%;
    height: calc(100% - 56px);
  }
  // 底部时间轴样式
  .footer {
    width: 100%;
    box-sizing: border-box;
    height: 56px;
    position: fixed;
    bottom: 0px;
    left: 16px;
    .center-footer {
      height: 56px;
      margin-right: 80px;
      box-sizing: border-box;
    }
    .right-footer-single {
      width: calc(100% - 466px) !important;
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
        width: 180px;
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
          width: 100px;
          font-weight: bold;
          font-size: 16px;
          margin: 2px 0;
          color: var(--neutral8);
        }
      }
    }
  }

  .common-content-style {
    position: absolute;
    height: calc(100% - 200px);
    top: 72px;
  }
  .main-detail-content {
    // position: absolute;
    // top: 72px;
    // left: 16px;
    // width: calc(100% - 32px);
    // height: calc(100% - 200px);
    // display: flex;
    // justify-content: space-between;
    .left-content {
      // position: relative;
      width: 398px;

      left: 16px;

      .task-specification {
        position: absolute;
        top: 20px;
        left: 0;
        bottom: 0;
        padding: 0 16px 16px 16px;
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% + 20px);
        .task-content {
          margin-bottom: 16px;
        }
        // .assets-wrap {
        //   height: calc(100% - 310px);
        //   overflow-y: scroll;
        // }
      }
    }
    .middle-content {
      width: 544px;
      height: 70px;
      // position: relative;
      left: calc(50% - 272px);
      .person-score-info {
        position: absolute;
        top: 40px;
        // left: 8px;
        display: flex;
        // z-index: 9;
        justify-content: space-around;
        width: 544px;
        &-left {
          width: 232px;
          display: flex;
          justify-content: space-around;
        }
        &-middle {
          width: 80px;
        }
        &-right {
          width: 232px;
          display: flex;
          justify-content: space-around;
        }
        .border-right {
          position: relative;
          &::after {
            content: '';
            position: absolute;
            top: 12px;
            margin-right: 10px;
            left: 37px;
            width: 2px;
            height: 14px;
            display: block;
            overflow: hidden;
            background: var(--neutral0);
          }
        }
        .border-score {
          &::after {
            left: 40px;
          }
        }
        .item {
          line-height: 20px;
          text-align: center;
          .name {
            line-height: 48px;
            position: relative;
          }
          .score {
            font-size: 16px;
            // color: var(--primary-color);
          }
          .red-color {
            color: var(--red-color) !important;
          }
          .blue-color {
            color: var(--blue-color) !important;
          }
          .text {
            font-size: 12px;
            color: var(--neutral7);
          }
        }
      }
    }
    .right-content {
      width: 398px;
      // position: relative;
      right: 16px;

      .train-task-detail {
        width: 100%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        padding: 16px;
        height: calc(100% + 40px);
        .document {
          height: calc(100% - 520px);
          overflow-y: scroll;
          position: relative;
          ::v-deep.cb-markdown {
            .markdown-body {
              padding: 0px 4% 16px 4% !important;
            }
          }
          ::v-deep.empty-comp {
            .not-data {
              .cb-iconfont {
                font-size: 56px !important;
              }
              .text-data {
                font-size: 14px !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
micro-app,
micro-app-body {
  height: 100%;
}
</style>
