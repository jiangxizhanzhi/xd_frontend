<template>
  <div class="team-train-detail lay-com">
    <!-- 顶部标题 -->

    <train-top-title
      :detail-title="detailTitle"
      @back="backHome"
      :isEnd="isEnd"
    >
    </train-top-title>
    <!-- 编辑器 -->
    <!-- 学员的编辑器 -->
    <div
      v-loading="isStart"
      class="loading-content"
      :element-loading-text="$t('m.waitStartScene') + '...'"
      element-loading-spinner="null"
    >
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
          :open-layer="true"
          :sceneConfigId="sceneConfigId"
          :breadcrumb-localize="breadcrumbLocalize"
          @onAccess="openTap"
          @on-node-restart="nodeRestart"
          @on-node-rebuild="nodeRecreate"
          @on-node-shutdown="(data) => onNodeShutDown(data, sceneId)"
          @on-node-shutup="(data) => onNodeShutUp(data, sceneId)"
          :mp-scene-id="sceneId"
          :show-snap-shot-btn="false"
          :ws-data="wsData"
          :need-to-judge-role-asset-allocation="true"
          :node-link-connectivity-status="true"
          :business_id="resource_id"
          :roles.sync="roleList"
          :needToJudgeRoleAssetAllocation="true"
          :open-watch-topology-data="true"
        >
        </scene-editor>
      </div>
    </div>
    <!-- 时间轴 -->
    <div class="bottom-timeline">
      <time-line :scale-times="scaleTimes" />
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
            <!-- 学员训练说明 -->
            <mission-statement
              :train-description="trainDescription"
              :nodeNum="nodeNum"
            />
          </div>
          <train-detail-title :text="$t('rbt.activeAssets')">
            <div slot="left">
              <cb-button
                icon="icon-xinzeng"
                type="text"
                @click="addHost"
              >{{
                $t('rbt.add')
              }}</cb-button>
            </div>
          </train-detail-title>
          <div class="assets-wrap cyber-scroll-bar-small">
            <common-assets
              ref="commonAssetsRef"
              :topology-data="sceneData"
              :resource_id="resource_id"
              :runningStatus="runningStatus"
              :start="start"
              @connect="openTap"
              :scene-id="sceneId"
            ></common-assets>
          </div>
        </div>
      </div>
      <!-- 中间区域 -->
      <div class="middle-content common-content-style">
        <!-- 中间区域背景 -->
        <train-middle-bg :avatar="topData.logo"> </train-middle-bg>
        <div class="person-score-info">
          <div class="person-score-info-left">
            <div class="item border-right">
              <div class="score">{{ topData.success_count }}</div>
              <div class="text">{{ $t('m.success') }}</div>
            </div>
            <div class="item border-right">
              <div class="score">{{ topData.fail_count }}</div>
              <div class="text">{{ $t('m.singleFailed') }}</div>
            </div>
            <div class="item border-right">
              <div class="score">{{ topData.reject_count }}</div>
              <div class="text">{{ $t('taskStatus.reject') }}</div>
            </div>
            <div class="item">
              <div class="score">
                {{ topData.finish_count }}/{{ topData.all_count }}
              </div>
              <div class="text">{{ $t('m.progress') }}</div>
            </div>
          </div>
          <div class="person-score-info-middle">
            <div class="item">
              <div
                class="name one-overflow"
                :title="middleData.user_name"
              >
                {{ this.$store.state.user.name }}
              </div>
            </div>
          </div>
          <div class="person-score-info-right">
            <div class="item border-right border-score">
              <div class="score">{{ topData.score }}</div>
              <div class="text">{{ $t('rbt.scoresTotal') }}</div>
            </div>
            <div class="item">
              <div class="score">{{ getFormatTime(topData.time_cost) }}</div>
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
          <train-detail-title
            :text="$t('m.taskMatrix')"
            type="right"
          />
          <!-- :task-lists="taskLists" -->
          <task-student
            @getTaskList="getTaskList"
            :train-description="trainDescription"
            @refreshData="refreshData"
            @refershTask="getTaskDetail"
            :student_user_id="student_user_id"
            :resource_id="resource_id"
            :refreshList="refreshList"
            @timeLineFresh="timeLineFresh"
          />
        </div>
      </div>
    </div>
    <!-- 团队聊天框todo-->
    <div class="char-box">
      <ChatTool ref="charTool" />
    </div>
    <Notice
      ref="noticeRef"
      type="team"
      :resourceId="resource_id"
      :role="roleGroup"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { SceneEditor } from '@cyber/scene';
import TimeLine from './components/time-line.vue';
import MissionStatement from './components/mission-statement.vue';
import TrainTopTitle from '@/components/student-common-detail/train-top-title/index.vue';
import TrainDetailBg from '@/components/student-common-detail/train-detail-bg/index.vue';
import TrainDetailTitle from '@/components/student-common-detail/train-detail-title/index.vue';
import TrainMiddleBg from '@/components/student-common-detail/train-middle-bg/index.vue';
import ChatTool from '@/components/ChatTools/index-team.vue';
import Notice from '@/pages/web/notice/index.vue';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import TaskStudent from './components/task-student.vue'; //任务矩阵
import commonAssets from './components/common-assets.vue'; //常用资产
import { mixins } from '@/mixin';
import {
  studentInfoApi,
  studentTaskApi,
  studentTimeLineApi,
  getTopologyApi,
  nodeStartApi,
  nodeBuildApi,
  getConnectionApi,
  studentTimeDataApi,
} from '@/api/web/team-training';
import { getUserInfo, getSysSettings } from '@cyber/helper';
import { getValueName } from '@/assets/js/tools.js';
import { getCurrentModuleByRouterName } from '../../../../utils';
import { EXPERIMENTAL_SUBJECT_MANAGEMENT_NAME } from "../constants";

export default {
  mixins: [mixins],
  components: {
    TrainTopTitle,
    SceneEditor,
    TimeLine,
    MissionStatement,
    TrainDetailBg,
    TrainDetailTitle,
    TrainMiddleBg,
    ChatTool,
    Notice,
    TaskStudent, //团队任务矩阵
    commonAssets,
  },
  data() {
    return {
      EXPERIMENTAL_SUBJECT_MANAGEMENT_NAME,
      isEnd: false,
      refreshList: false,
      start: false,
      runningStatus: undefined, //
      topData: {}, //中间顶部数据
      timer: null, // 自动刷新时间的定时器
      nodeNum: 0,
      student_user_id: '',
      // user_ids: this.$route.params && this.$route.params.user_ids,
      resource_id: '',
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

      progressLocalize: {
        width: 'calc(100% - 398px - 398px - 16px - 16px)',
        left: 'calc(398px + 16px)',
        bottom: 'calc(40px + 29px)',
      },
      breadcrumbLocalize: {
        top: '175px',
        left: 'calc(398px + 16px + 20px)',
      },
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据

      scene_manager_id: '', // 用于通用场景请求
      showMaskBtn: false, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: [], // 按钮组配置项

      sceneLoading: false, // 场景loading
      isStart: false,
      crEventData: {},
      taskTrain: this.$t('m.groupTraining'),
      showInfo: true,
      showTask: true,
      showTrainRecord: false,
      showAnswerDialog: false,
      showTreeFile: true, // true显示tree树，false显示文档
      trainDescription: {
        trainType: '',
        duration_time: '',
        trainDifficult: '',
        pre_skill: [],
        train_skill: [],
        description: '',
      },
      taskLists: [],
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
      },
      resource_id: '',
      scene_manager_id: '',
      sceneId: '',
      wsData: {},
      refresh: true,
      sceneConfigId: '',
      scene_name: '',
      roleList: [],
      training_role_data: null,
      pollTimer: null,
    };
  },
  watch: {
    scene_manager_id: {
      handler(nv, ov) {
        if (nv) {
          this.bindSceneWs(this.scene_manager_id);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    roleGroup() {
      return _.get(this.crEventData, 'training_role_data.role_group');
    },
  },
  created() {
    getSysSettings().then((res) => {
      document.title = _.get(
        this.$store.state.user,
        'system_setting.system_name',
      );
    });
    this.getUserInfo();
    this.resource_id = this.$route.params && this.$route.params.resource_id;

    this.getTimeShaft();
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getStudentInfo();
    this.getTaskDetail();
    // this.studentReportWs();
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.pollTimer = setInterval(() => {
      if (!this.showMaskBtn) {
        this.handleGetSceneData();
      }
    }, 1000 * 10)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = null;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  },
  methods: {
    // ws推送任务矩阵改变,底部时间轴也改变
    timeLineFresh(val) {
      this.getTimeShaft();
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
        this.$message.error(this.$t('rbt.noHasAircraft'));
        return false;
      }
    },
    // 添加资产操作
    addHost() {
      // runningStatus开始为1
      const allowAddHostMap = [1];
      if (allowAddHostMap.some((it) => it === this.runningStatus)) {
        this.initData();
      } else {
        this.$message.error(this.$t('m.addHostMessage'));
      }
    },
    // 获取学员中间顶部数据
    getTaskList(val) {
      this.topData = {
        ...val,
      };
      // 获取到数据之后根据状态启动定时器
      if (this.topData.started) {
        this.getTimeStart();
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        // 用户id
        this.student_user_id = this.$store.state.user.id;
      });
    },

    backHome() {
      this.$router.go(-1);
    },
    deleteCrEvent() { },
    /**
     * 接入方式
     */
    openTap(connection_url, access_modes, nodeId, image_type, nodeName, jump_type, vendor, type) {
      const { id, protocol, access_ip, access_port, path } = access_modes;
      if (type === 'npc') {
        const params = {
          id: this.sceneId,
          node_id: nodeId,
        };
        this.$request
          .post('/cscene/cscene_instances/get_connection_by_npc', params, {
            baseURL: '/api/mp',
          })
          .then((res) => {
            let connection_url = _.get(res, 'data.data.connection_url');
            window.open(connection_url, '_blank');
          });
      } else if (vendor) {
        const params = {
          id: this.sceneId,
          node_id: nodeId,
        };
        this.$request
          .post('/cscene/cscene_instances/get_connection_by_vendor', params, {
            baseURL: '/api/mp',
          })
          .then((res) => {
            let connection_url = _.get(res, 'data.data.connection_url');
            window.open(connection_url, '_blank');
          });
      } else {
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
              page: 'team-student',
              role_group: this.roleGroup,
              id,
              nodeName,
              image_type, //操作机工具
              protocol,
              connection_url: connection_url,
              resource_id: this.resource_id,
              scene_name: this.scene_name,
              scene_id: this.sceneId,
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
                page: 'team-student',
                role_group: this.roleGroup,
                id,
                nodeName,
                image_type, //操作机工具
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
      }
    },
    showInfoPanel() {
      this.showInfo = !this.showInfo;
    },

    showTaskPanel() {
      this.showTask = !this.showTask;
    },

    gotoManual() {
      this.$router.push('/indidaul/manual/');
    },

    getTaskDetail() {
      studentTaskApi({
        resource_id: this.resource_id,
      }).then((res) => {
        this.taskLists = res.data.data;
      });
    },

    getStudentInfo() {
      // 获取左侧info
      // const _this = this
      studentInfoApi({
        resource_id: this.resource_id,
      }).then(async (res) => {
        this.crEventData = res.data.data;
        this.nodeNum = this.crEventData.nodes_count; // 获取训练说明的节点数量
        this.runningStatus = res.data.data.training_status; //获取当前训练任务状态
        this.training_role_data = this.crEventData.training_role_data;
        // 训练结束,已结束标记出现
        if (this.runningStatus === 2) {
          this.isEnd = true;
        }
        this.scene_name = res.data.data.name;
        this.trainDescription = JSON.parse(JSON.stringify(res.data.data));

        this.trainDescription.trainType = getValueName(
          this.$CONSTANT.Condition.Category,
          res.data.data.category,
        );
        this.trainDescription.trainDifficult = getValueName(
          this.$CONSTANT.Condition.Difficult,
          res.data.data.difficult,
        );
        this.trainDescription.duration_time = res.data.data.duration_time;
        if (
          res.data.data.training_status ===
          this.$CONSTANT.Training.TrainingStatus.NoBegin.value
        ) {
          this.isStart = true;
        } else {
          this.isStart = false;
        }

        this.handleGetSceneData();
        this.bindSceneWs();
        this.detailTitle =
          EXPERIMENTAL_SUBJECT_MANAGEMENT_NAME[this.$route.name] +
          '-' +
          res.data.data.name;
      });
    },

    /**
     * 获取场景数据
     */

    //学员获取场景数据
    handleGetSceneData(refresh) {
      //学员获取场景数据

      getTopologyApi({ resource_id: this.resource_id })
        .then((res) => {
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = false; // 学员没有启动场景的权限
          this.showProgress = status.showProgress;
          this.showBtn = false; // 学员没有关闭场景的权限
          this.sceneData = status.sceneData;
          this.progress = status.progress;
          this.start = status.showBtn;
          this.stageProgress = status.stageProgress;
          //获取local_scene_id,room_id
          this.local_scene_id = res.data.data.local_scene_id;
          this.room_id = res.data.data.room_id;
          // 场景数据赋值
          const all_role_list = _.get(res, 'data.data.role_list');
          const current_role_list = all_role_list.filter((item) => {
            return item.id === this.training_role_data.resource_id;
          });
          this.sceneData = {
            roles: this.setRolesData(current_role_list), // 赋值roles
            ...status.sceneData,
          };
          this.roleList = this.setRolesData(current_role_list);
          this.sceneConfigId = res?.data?.data?.mp_scene_id;
          // 场景id
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          refresh && this.changeTopo();
        })
        .catch((error) => {
          // this.$message.error(error);
        });
    },

    // [前台]学员-当前提交任务时间轴
    getTimeShaft() {
      studentTimeLineApi({
        resource_id: this.resource_id,
      }).then((res) => {
        _.forEach(res.data.data.data, (item) => {
          this.$set(item, 'actionName', this.$t('m.numberOfTasksReported'));
        });
        this.scaleTimes = res.data.data;
      });
    },

    refreshData() {
      // 提交完任务重新请求数据
      this.getTaskDetail();
      this.getTimeShaft();
    },

    // 团队学员节点重启
    nodeRestart(data) {
      const { id } = data;
      this.$request;
      nodeStartApi({
        node_id: id,
        resource_id: this.resource_id,
      }).then((res) => { });
    },

    //团队学员节点重建
    nodeRecreate(data) {
      const { id } = data;
      this.$request;
      nodeBuildApi({
        node_id: id,
        resource_id: this.resource_id,
      }).then((res) => { });
    },

    // 赋值角色资产和战争迷雾数据
    setRolesData(role_list) {
      let new_roles = [
        {
          asset_nodes: [],
          children: [],
          id: Date.now(),
          name: '红队',
          type: 'red',
          visible_nodes: [],
        },
      ];
      role_list &&
        role_list.forEach((item, index) => {
          new_roles[0].children.push({
            asset_nodes: item.asset_nodes,
            id: item.name,
            name: item.name,
            type: 'red',
            visible_nodes: item.visible_nodes,
            missions_scheme: item.missions_scheme,
          });
        });
      return new_roles;
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
      const getHour = hours > 0 ? `${hours}${this.$t('m.hour')}` : '';
      const getMinute = minutes > 0 ? `${minutes}${this.$t('m.minute')}` : '';
      const getSecond = `${seconds}${this.$t('m.second')}`;

      const formatTime = `${getDay}${getHour}${getMinute}${getSecond}`;
      return formatTime;
    },
    // 添加定时器计时
    getTimeStart() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = setInterval(() => {
        this.topData.time_cost++;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.team-train-detail {
  width: 100%;
  height: 100%;
  font-size: 14px;

  .loading-content {
    width: 100%;
    height: calc(100% - 56px);
    // position: absolute;
    top: 0;
  }

  .topology {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
  }

  .bottom-timeline {
    height: 40px;
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    bottom: 20px;
    padding: 0 16px;
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
        padding: 0 16px 16px 16px;
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% + 20px);

        .task-content {
          margin-bottom: 16px;
        }

        .assets-wrap {
          // height: calc(100% - 310px);
          // overflow-y: scroll;
        }
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
            color: var(--primary-color);
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
        padding: 16px;
        height: 100%;
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
