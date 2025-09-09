<template>
  <cb-inner-page :background="false">
    <div class="teacher-home page">
      <div class="content">
        <div class="top-nav">
          <cb-tabs v-model="tabActive" type="border-card" class="elc-page-tabs">
            <cb-tab-pane name="拓扑监控" :label="$t('m.topologyMonitoring')">
              <scene-editor
                v-if="tabActive === '拓扑监控'"
                ref="sceneEditor"
                :title="sceneName"
                :sceneConfig="sceneConfig"
                :topologyData="sceneData"
                :show-mask="showMask"
                :progress="progress"
                :show-label="false"
                :show-title="false"
                :allow-dialog="false"
                :status="'display'"
                :show-btn="showBtn"
                :show-mask-btn="showMaskBtn"
                :show-progress="showProgress"
                :btn-config="btnGroupConfig"
                @onSceneStart="handleSceneStart"
                @onAccess="openTap"
                @close="handleClosed"
                @on-node-restart="nodeRestart"
                @on-node-rebuild="nodeRecreate"
                :mp-scene-id="sceneId"
                :show-snap-shot-btn="false"
                :ws-data="wsData"
                :node-link-connectivity-status="true"
                :business_id="resource_id"
              ></scene-editor>
            </cb-tab-pane>
            <cb-tab-pane name="桌面监控" :label="$t('m.desktopMonitoring')">
              <desktop-monitoring
                v-if="tabActive === '桌面监控'"
                :student-id="studentId"
                :id="scene_manager_id"
              />
            </cb-tab-pane>
          </cb-tabs>
        </div>
        <!-- 右上角几个操作按钮 -->
        <!--
          未开始isStart=true: 编辑靶场、启动靶场、删除靶场
          已开始isStart=false,sceneStatus=true: 结束、删除靶场
          已结束isStart=false,sceneStatus=false: 已结束、删除靶场
        -->
        <div class="left-button-group">
          <cb-button-group>
            <cb-button @click="gotoDataScreen()" icon="icon-tuopu" hollow>
              {{ $t('m.dtopology') }}
            </cb-button>
            <cb-button
              v-if="isStart"
              icon="icon-bianji"
              hollow
              @click="editTeamTrain"
            >
              {{ $t('m.editCyber') }}
            </cb-button>
            <cb-button
              v-if="isStart"
              icon="icon-huifu"
              hollow
              @click="operationScene"
            >
              {{ $t('m.startUp') }}
            </cb-button>
            <cb-button
              v-if="!isStart && sceneStatus"
              icon="icon-tingzhi"
              hollow
              @click="operationScene"
            >
              {{ $t('m.end') }}
            </cb-button>
            <cb-button
              v-if="!isStart && !sceneStatus"
              icon="icon-yitingzhi"
              disabled
              hollow
            >
              {{ $t('m.hasEnded') }}
            </cb-button>
            <cb-button
              icon="icon-shanchu"
              color-type="red hollow"
              @click="deleteTeamTrain"
            >
              {{ $t('m.deleteCyber') }}
            </cb-button>
          </cb-button-group>
        </div>
        <div
          class="right-info"
          :class="showInfo ? 'cssAnimate' : 'cssAnimateRight'"
        >
          <div class="btn-left fl" @click="showTaskPanel()">
            <cb-iconfont v-if="showInfo" type="icon-xiangzuo" size="12" />
            <cb-iconfont v-else type="icon-xiangyou" size="12" />
          </div>
          <div v-show="showInfo" class="info-content">
            <cb-tabs v-model="infoActiveName">
              <cb-tab-pane
                name="Script execution"
                :label="$t('m.scriptExecution')"
              >
                <div class="scroll-height">
                  <div class="crollDiv cyber-scroll-bar">
                    <!-- 剧本执行 -->
                    <script-execution
                      v-if="infoActiveName === 'Script execution'"
                      :resource-id="resource_id"
                      :cr-event-data="crEventData"
                      @refreshTimeData="getTimeLineInfo(resource_id)"
                      :close-scene-bool="closeSceneBool"
                    />
                  </div>
                </div>
              </cb-tab-pane>
              <cb-tab-pane
                name="Submission Review"
                :label="$t('m.submitReview')"
              >
                <submit-review
                  v-if="infoActiveName === 'Submission Review'"
                  :roles-list="rolesList"
                  :scene-id="sceneId"
                  :flag-data="flagData"
                />
              </cb-tab-pane>
              <cb-tab-pane name="Training Manual" :label="$t('m.trainManual')">
                <div
                  class="scroll-height"
                  v-if="infoActiveName === 'Training Manual'"
                >
                  <cb-scrollbar
                    class="markDownCommon markEdit"
                    style="margin-top: -10px"
                  >
                    <CbMarkdown v-model="trainManual" type="viewer" />
                  </cb-scrollbar>
                </div>
              </cb-tab-pane>
              <cb-tab-pane
                name="Student Rating"
                :label="$t('m.studentRatings')"
              >
                <!--学员评分-->
                <student-ratings
                  v-if="infoActiveName === 'Student Rating'"
                  :roles-list="rolesList"
                  @sendStudentId="getStudentId"
                />
              </cb-tab-pane>
              <!-- 训练报告 -->
              <cb-tab-pane
                name="Training Report"
                :lazy="true"
                :label="$t('m.trainReport')"
              >
                <div class="scroll-height">
                  <div class="crollDiv cyber-scroll-bar">
                    <train-report
                      v-if="infoActiveName === 'Training Report'"
                      ref="trainReport"
                    />
                  </div>
                </div>
              </cb-tab-pane>
            </cb-tabs>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="right-footer fl">
          <time-line :scale-times="scaleTimes" />
        </div>
      </div>
      <!--编辑弹窗-->
      <cb-dialog
        v-if="editDialog"
        :title="$t('event.InstanceEdit')"
        :visible.sync="editDialog"
        width="68.13%"
        style="padding: 0 50px"
        class="editDialog resource-list"
      >
        <div style="height: 600px">
          <cb-scrollbar>
            <write-content
              ref="writeContent"
              @createFormSuccess="formValidateSuccess"
              @sendVal="getChildComVal"
              @sendVals="getChildComVals"
              @checkValue="getNewCheckValue"
              @checksValue="getNewChecksValue"
            />
          </cb-scrollbar>
        </div>
        <div slot="footer" class="dialog-footer">
          <cb-button button-type="confirm" @click="saveUpdate()">
            {{ $t('common.confirm') }}
          </cb-button>
          <cb-button button-type="cancel" @click="editDialog = false">
            {{ $t('m.cancel') }}
          </cb-button>
        </div>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import DesktopMonitoring from '@/pages/web/team-train/desktop_monitoring.vue';
import WriteContent from '@/pages/web/team-train/edit.vue';
import ScriptExecution from '@/pages/web/team-train/components/script_execution.vue';
import SubmitReview from '@/pages/web/team-train/components/submit_review.vue';
import StudentRatings from '@/pages/web/team-train/components/student_ratings.vue';
import TrainReport from '@/pages/web/team-train/components/train_report.vue';
import TimeLine from '@/components/TimeLine/TeacherTimeLine.vue';
import { getLanguage } from '@cyber/helper';
import { setBreadcrumbTitle } from '@cyber/ui';
import { SceneEditor } from '@cyber/scene';
import { handleWsData, getSceneStatus } from '@/utils/scene-websocket.js';

export default {
  name: 'TeacherHome',
  components: {
    WriteContent,
    ScriptExecution,
    SubmitReview,
    StudentRatings,
    TrainReport,
    TimeLine,
    DesktopMonitoring,
    SceneEditor,
  },
  data() {
    return {
      sceneId: '',
      flagData: false,
      room_id: '',
      cookie: '',
      local_scene_id: null,
      isCheck: '',
      isCheckValue: '',
      isChecks: '',
      isChecksValue: '',
      alertValue: '',
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: [],
        showToolbar: false,
        // toolbar: ['restore'],
        // showToolbar: true,
      },
      language: getLanguage(),
      sceneLoading: false, // 场景loading
      breadcrumbName: '',
      scene_manager_id: '', // 用于通用场景请求
      // 进度条信息
      progress: {
        progressRate: 0,
        progressInfo: '',
        status: undefined,
      },
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close'], // 按钮组配置项

      sceneName: '', // 场景标题
      resource_id: '',
      trainManual: '',
      crEventData: null, // 团队训练教员详情数据
      tabActive: '拓扑监控',
      editDialog: false,
      createFormVal: {},
      isStart: false,
      sceneStatus: true,
      sceneConfigData: null,

      showInfo: true,
      infoActiveName: 'Script execution',
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
      },
      rolesList: [], // 学员列表信息
      studentId: null, // 桌面监控获取学员id
      closeSceneBool: false, // 关闭场景是否触发
      wsData: {},
    };
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    // this.getTeacherDetail();
    this.getTeacherDetail(this.$route.params && this.$route.params.resource_id);
    this.handleGetSceneData();
    this.getSceneStatus();
  },
  mounted() {
    this.getUser();
    this.getTimeLineInfo(this.$route.params && this.$route.params.resource_id);
    this.getTrainManual(this.$route.params && this.$route.params.resource_id);
    // 获取token
    this.cookie = utils.getCookie('cr_jwttoken');
  },
  watch: {
    sceneData(nv) {},
    //团队训练切换tab,(拓扑监控,桌面监控),请求赋值topologyData
    tabActive(nv) {
      if (nv) {
        this.handleGetSceneData();
      }
    },
  },
  methods: {
    // 团队跳转3D态势
    gotoDataScreen() {
      const path = '/page/mg/admin/screen-3/visual-screen';
      if (this.sceneId) {
        window.open(
          `${path}?name=${this.screenName}&room_id=${this.resource_id}&scene_id=${this.sceneId}`,
          '_blank',
        );
      } else if (this.topo_id) {
        window.open(
          `${path}?name=${this.screenName}&room_id=${this.resource_id}&topo_id=${this.topo_id}`,
          '_blank',
        );
      }
    },
    getChildComVal(val) {
      this.isCheck = val;
    },
    getChildComVals(val) {
      this.isChecks = val;
    },
    getNewCheckValue(val) {
      this.isCheckValue = val;
    },
    getNewChecksValue(val) {
      this.isChecksValue = val;
    },
    /**
     * 接入方式
     */
    openTap(connection_url, access_modes, nodeId) {
      const { id, protocol, access_ip, access_port, path } = access_modes;
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
            // access_user_id: this.studentId,
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
      // 查看场景
      this.$request
        .get(
          '/cr/team_train/room/scene',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = status.showMaskBtn;
          this.showProgress = status.showProgress;
          this.showBtn = status.showBtn;
          this.sceneData = status.sceneData;
          this.progress = status.progress;
          //获取local_scene_id,room_id
          this.local_scene_id = res.data.data.local_scene_id;
          this.room_id = res.data.data.room_id;
          // 场景id
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          // 返回topo_id
          this.topo_id = _.get(res, 'data.data.topo_id', '') || '';
          this.flagData = true;
        })
        .catch((error) => {
          // this.$message.error(error);
        });
    },

    /**
     * 场景启动
     */
    handleSceneStart() {
      this.closeSceneBool = false;
      this.refreshProgress();
      this.bindSceneWs();
      // 启动场景
      this.$request
        .post(
          '/cr/team_train/room/scene',
          { room_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          this.showBtn = true;
          /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
          this.handleGetSceneData();
        });
    },

    /**
     * 场景关闭
     */
    handleClosed() {
      // 团队关闭场景
      this.$confirm(
        this.$t('common.closeSceneConfirm') + '？',
        this.$t('common.info'),
        {
          type: 'warning',
        },
      ).then(() => {
        // 关闭场景时，促使流量列表更新
        this.closeSceneBool = true;
        // if (_.isEmpty(this.scene_manager_id)) {
        //   return;
        // }
        this.refreshProgress();
        //关闭场景
        this.$request
          .delete(
            '/cr/team_train/room/scene',
            { room_id: this.resource_id },
            { baseURL: '/api/ojj' },
          )
          .then((res) => {
            this.showMask = true;
            this.showMaskBtn = true;
            this.showProgress = false;
            this.showBtn = false;
            this.handleGetSceneData();
          })
          .catch((error) => {
            // this.$message.error(error);
          });
      });
    },

    // 团队节点重启
    nodeRestart(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/team_train/room/scene/node/restart',
          {
            node_id: id,
            resource_id: this.resource_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {});
    },

    //团队节点重建
    nodeRecreate(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/team_train/room/scene/node/recreate',
          {
            node_id: id,
            resource_id: this.resource_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {});
    },

    showTaskPanel() {
      this.showInfo = !this.showInfo;
    },

    // 教员-团队训练详情
    getTeacherDetail(id) {
      this.$request
        .get(
          '/cr/team_train/room',
          { resource_id: id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          (this.screenName = res.data.data.name),
            (this.crEventData = res.data.data);

          this.breadcrumbName = res.data.data.name;
          setBreadcrumbTitle(this.breadcrumbName);

          if (this.crEventData) {
            this.bindSceneWs();
          }
        })
        .catch((error) => {});
    },

    // [前台]教员-获取靶场状态
    getSceneStatus() {
      this.$request
        .get(
          '/cr/team_train/room/start_end_team',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          // 场景状态 0未开始 1已开始 2已结束
          if (
            res.data.data.training_status ===
            this.$CONSTANT.Training.TrainingStatus.NoBegin.value
          ) {
            this.isStart = true;
          } else if (
            res.data.data.training_status ===
            this.$CONSTANT.Training.TrainingStatus.Already.value
          ) {
            this.isStart = false;
            this.sceneStatus = true;
          } else if (
            res.data.data.training_status ===
            this.$CONSTANT.Training.TrainingStatus.HasEnded.value
          ) {
            this.isStart = false;
            this.sceneStatus = false;
          }
        })
        .catch((_) => {});
    },

    // 教员编辑团队训练
    editTeamTrain() {
      this.editDialog = true;
    },

    // 保存修改
    saveUpdate() {
      if (!this.isCheck || !this.isChecks) {
        const alertMsg = this.isCheckValue || this.isChecksValue;
        return this.$message.error(alertMsg);
      }
      this.$refs.writeContent.submitForm();
    },

    formValidateSuccess() {
      this.editDialog = false;
      this.createFormVal = {};
      this.getTeacherDetail(
        this.$route.params && this.$route.params.resource_id,
      );
      this.getSceneStatus();
    },

    // [前台]教员-获取角色下人员信息
    getUser() {
      this.$request
        .get(
          '/cr/team_train/room/get_user_list',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const dataBakup = _.get(res, 'data.data', []);

          this.rolesList = dataBakup.map((item) => {
            item.id = item.resource_id;
            return item;
          });
          if (this.rolesList.length) {
            this.studentId = dataBakup[0].resource_id;
          }
        })
        .catch(() => {});
    },

    // 获取学员id
    getStudentId(val) {
      this.studentId = val;
    },

    // 获取训练手册
    getTrainManual(id) {
      this.$request
        .get(
          '/cr/team_train/room/get_training_manual',
          { resource_id: id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.trainManual = res.data.data;
        })
        .catch((error) => {});
    },

    // [前台]教员-开始结束场景
    operationScene() {
      this.$request
        .post(
          '/cr/team_train/room/start_end_team',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          // 场景状态 0未开始 1已开始 2已结束
          if (
            res.data.data.training_status ===
            this.$CONSTANT.Training.TrainingStatus.Already.value
          ) {
            this.isStart = false;
            this.sceneStatus = true;
            this.$message.success(this.$t('m.StartTrainingSuccessTips'));
          } else if (
            res.data.data.training_status ===
            this.$CONSTANT.Training.TrainingStatus.HasEnded.value
          ) {
            this.isStart = false;
            this.sceneStatus = false;
            this.$message.success(this.$t('m.TrainingIsOverTips'));
          }
        })
        .catch((error) => {});
    },

    // 教员删除该团队训练
    deleteTeamTrain() {
      this.$confirm(this.$t('common.confirmDelete') + '?')
        .then(() => {
          this.$request
            .delete(
              '/cr/team_train/room',
              { room_id: this.resource_id },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('common.deleteSuccessful'),
              });
              this.$router.push('/group_training');
            })
            .catch((res) => {});
        })
        .catch((res) => {});
    },

    // 教员-获取时间轴数据
    getTimeLineInfo(id) {
      this.$request
        .get(
          '/cr/team_train/room/get_time_line',
          { resource_id: id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          _.forEach(res.data.data.user_time_line_config, (item) => {
            if (item.type === 1) {
              this.$set(item, 'actionName', this.$t('m.issueTask'));
            } else {
              this.$set(item, 'actionName', this.$t('m.sendTraffic'));
            }
          });
          this.scaleTimes.data = res.data.data.user_time_line_config;
          this.scaleTimes.start_time = res.data.data.start_time;
          this.scaleTimes.end_time = res.data.data.end_time;
          this.scaleTimes.current_time = res.data.data.current_time;
          // this.scaleTimes = res.data
        });
    },

    /**
     * 刷新进度条状态
     */
    refreshProgress() {
      this.progress.status = undefined;
      this.progress.progressInfo = '';
      this.progress.progressRate = 0;
    },

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
              this.showMaskBtn = wsData.showMaskBtn;
              this.showProgress = wsData.showProgress;
              this.showBtn = wsData.showBtn;
            }
          },
        },
      );
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep {
  .el-tab-pane,
  .el-tabs,
  .cb-tabs {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 40px);
  }
}
.bottom-btn {
  margin-top: -50px;
  margin-left: 20px;
  position: absolute;
}
.mavon-editor-private {
  height: auto;
}
.teacher-home {
  overflow: hidden;

  .cssAnimate {
    width: 816px;
    min-width: 100px;
    transition: all 0.001ms ease;
  }
  .cssAnimateRight {
    width: 20px;
    transition: all 0.5s ease;
  }
  .left-button-group {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .edit-button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
    }
  }
  .content {
    width: 100%;
    position: relative;
    height: calc(100% - 120px);

    .top-nav {
      width: 100%;
      height: 100%;
    }
    .content-main {
      position: relative;
      width: 100%;
      height: calc(100% - 42px);
    }
    .right-info {
      position: absolute;
      right: 0;
      top: 38px;
      height: calc(100% - 40px);
      box-sizing: border-box;
      .scroll-height {
        height: 100%;
      }
      .crollDiv {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;
      }
      //正常滚动条样式
      .cyber-scroll-bar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: rgba(0, 0, 0, 0);
      }

      .cyber-scroll-bar::-webkit-scrollbar-thumb {
        background: themed(scrollbar-color);
      }

      // 横向竖向交差点方块
      .cyber-scroll-bar::-webkit-scrollbar-corner {
        background-color: rgba(0, 0, 0, 0);
      }
      .btn-left {
        width: 20px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        position: absolute;
        top: 34px;
        left: 0px;
        z-index: 10;
        cursor: pointer;
      }
      .info-content {
        width: calc(100% - 20px);
        height: 100%;
        position: absolute;
        right: 0;
        padding: 30px 25px 0 25px;
        box-sizing: border-box;
        z-index: 2;
        ::v-deep .cb-tabs {
          height: calc(100% - 20px);
          .el-tabs__nav {
            width: 100%;
            display: flex;

            .el-tabs__item {
              flex: 1;
              text-align: center;
            }
          }
        }

        ::v-deep.markEdit {
          word-break: break-all;
          ::v-deep.markdown-body {
            h2 {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
            }
            h2:after {
              content: '';
              float: left;
              display: block;
              width: 6px;
              height: 8px;
              margin: 5px 13px 0 0;
              background: #0bdaff;
            }
            hr {
              width: 100%;
              height: 0;
              border-right: none;
              border-left: none;
              border-bottom: none;
              opacity: 0.76;
            }
            h4 {
              display: block;
              width: 100%;
              height: 30px;
              line-height: 30px !important;
              margin: 12px 0 0 !important;
              padding-left: 18px !important;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 300;
            }
            h4,
            p {
              font-size: 14px;
              font-weight: 400;
            }
            p {
              margin-top: 12px;
              padding-left: 20px;
            }
            table {
              margin-left: 20px;
            }
            blockquote {
              margin: 0 !important;
            }
            ol > li {
              list-style: decimal;
            }
            ul > li {
              list-style: disc;
            }
            sup {
              top: -0.5em;
            }
            sub {
              bottom: -0.25em;
            }
            sub,
            sup {
              font-size: 75%;
              line-height: 0;
              position: relative;
              vertical-align: baseline;
            }
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    box-sizing: border-box;
    height: 126px;
    .right-footer {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
