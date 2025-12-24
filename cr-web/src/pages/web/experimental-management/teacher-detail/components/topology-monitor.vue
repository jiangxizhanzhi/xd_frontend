<template>
  <div class="topology-monitor">
    <div class="left-wrap">
      <!-- 左侧团队教员拓扑图 -->
      <scene-editor
        v-if="refresh"
        :class="{ 'update-scene': sceneStatusMode === 'update' }"
        ref="sceneEditor"
        :sceneConfig="sceneConfig"
        :topologyData="sceneData"
        :show-mask="showMask"
        :progress="progress"
        :progress-localize="progressLocalize"
        :stage-progress="stageProgress"
        :show-label="false"
        :show-title="false"
        :allow-dialog="false"
        :status="sceneStatusMode"
        :show-btn="showBtn"
        :show-mask-btn="showMaskBtn"
        :show-progress="showProgress"
        :btn-config="btnGroupConfig"
        :show-action-role="false"
        :draw-ws-new-node="false"
        :open-layer="true"
        :breadcrumb-localize="breadcrumbLocalize"
        :sceneConfigId="sceneConfigId"
        @on-next-level="handleNextLevel"
        @onSceneStart="handleSceneStart"
        @onAccess="openTap"
        @close="handleClosed"
        @on-node-restart="nodeRestart"
        @on-node-rebuild="nodeRecreate"
        @on-node-shutdown="(data) => onNodeShutDown(data, sceneId)"
        @on-node-shutup="(data) => onNodeShutUp(data, sceneId)"
        @on-update-topology="updateTopology"
        @on-update-node-data="handleUpdateNodeData"
        @on-deleted-nodes="handleDeleteNode"
        :mp-scene-id="sceneId"
        :show-snap-shot-btn="false"
        :ws-data="wsData"
        :node-link-connectivity-status="true"
        :roles.sync="role_list"
        :open-watch-topology-data="true"
      ></scene-editor>
      <div
        v-if="sceneStatusMode === 'update'"
        class="bottom-btn-wrapper"
      >
        <cb-button-group space="middle">
          <cb-button
            button-type="confirm"
            mr
            @click="submitTopology"
          >
          </cb-button>
          <cb-button
            button-type="cancel"
            @click="toBack(true)"
          > </cb-button>
        </cb-button-group>
      </div>
    </div>
    <!-- 右侧设备清单 -->
    <div class="right-wrap">
      <equipment-list
        :count-list="countList"
        :device-list="deviceList"
        @updateList="getEquipmentList($event)"
        :start="start"
        :sceneId="sceneId"
        :topo_id="topo_id"
        :scene-status="sceneStatusMode"
        :show-progress="showProgress"
        :level-id="levelId"
        @connect="openTap"
        @configure-node="handleConfigureNode"
        @select-node="selectTheNode"
        @restart="handleRestart"
        @recreate="handleRecreate"
        @delete-node="handleDeleteNodeOperation"
      ></equipment-list>
    </div>
  </div>
</template>

<script>
import defaultLogo from '@/assets/img/addhost.png';
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { getLanguage } from '@cyber/helper';
import { setBreadcrumbTitle } from '@cyber/ui';
import { SceneEditor } from '@cyber/scene';
import { handleWsData, getSceneStatus } from '@/utils/scene-websocket.js';
import { mixins } from '@/mixin';
import { deviceCountApi, getEquipmentApi } from '@/api/web/team-training';
import {
  deleteNodeDynamic,
  updateNodeDynamic,
  updateTopologyDynamic,
} from '../../../../../api/scene/scene';
import equipmentList from '../../../red-blue/admin/components/equipment-list'; // 设备清单,直接引用红蓝对抗组件
import {
  nodeBuildApi,
  nodeStartApi,
} from '../../../../../api/web/team-training';

export default {
  mixins: [mixins],
  components: {
    equipmentList,
    SceneEditor,
  },
  props: {},
  data() {
    return {
      refresh: true,
      sceneStatusMode: 'display',
      model: {
        category: '',
        name: '',
      },
      topo_id: '',
      start: false,
      resource_id: this.$route.params && this.$route.params.resource_id,
      sceneId: '',
      // flagData: false,
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

      // 进度条的位置，与css样式中写的值同步
      progressLocalize: {
        width: '100%',
        left: '0px',
        bottom: '0px',
      },
      // 层节点面包屑的位置，与css样式中写的值同步
      breadcrumbLocalize: {
        top: '20px',
        left: '20px',
      },
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close', 'update-topology'], // 按钮组配置项

      sceneName: '', // 场景标题
      resource_id: '',
      trainManual: '',
      crEventData: null, // 综合演训教员详情数据
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
      countList: {},
      deviceList: [],
      sceneConfigId: '',
      role_list: [], // 单独维护到编辑器中
      levelId: '', // 层id
      pollTimer: null,
    };
  },
  computed: {
    roleGroup() {
      return _.get(this.crEventData, 'training_role_data.role_group');
    },
  },

  watch: {
    showBtn: {
      handler(val) {
        // 场景状态变化更新设备清单列表数据
        this.getEquipmentList();
        this.getDeviceCount();
      },
      immediate: true,
    },
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getTeacherDetail(this.$route.params && this.$route.params.resource_id);
    this.getSceneStatus();
  },
  mounted() {
    this.getUser();
    this.getTrainManual(this.$route.params && this.$route.params.resource_id);
    // 获取token
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getDeviceCount();
    this.handleGetSceneData();
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.pollTimer = setInterval(() => {
      this.handleGetSceneData();
    }, 1000 * 10)
  },
  beforeDestroy() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  },
  //综合演训切换tab,(拓扑监控,桌面监控),请求赋值topologyData
  tabActive(nv) {
    if (nv) {
      this.handleGetSceneData();
    }
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        this.bindSceneWs();
      });
    },
    // 设备统计
    getDeviceCount() {
      deviceCountApi({
        resource_id: this.$route.params && this.$route.params.resource_id,
      }).then((res) => {
        const data = _.get(res, 'data.data', {});
        this.countList = data;
      });
    },
    // 设备清单
    getEquipmentList(e) {
      if (e) {
        this.model = e;
      }
      const params = {
        resource_id: this.$route.params && this.$route.params.resource_id,
        category: this.model.category,
        name: this.model.name,
      };
      getEquipmentApi(params).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.deviceList = data;
      });
    },

    /**
     * 接入方式
     */
    // openTap(connection_url, access_modes, nodeId) {
    openTap(connection_url, access_modes, nodeId, image_type, nodeName, jump_type, vendor, type) {
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
              page: 'team',
              id,
              role_group: this.roleGroup,
              nodeName,
              image_type,
              protocol,
              connection_url: connection_url,
              resource_id: this.resource_id,
              scene_name: this.breadcrumbName,
              scene_id: this.sceneId,
              node_id: nodeId,
              //  node_id: nodeId,
              //   scene_id: this.sceneId,
              //   user_id: this.$store.state.user.id,
            },
          });
          window.open(url.href, '_blank');
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
                  page: 'team',
                  role_group: this.roleGroup,
                  resource_id: this.resource_id,
                  connection_url: _.get(res, 'data.data.connection_url'),
                  node_id: nodeId,
                  id,
                  nodeName,
                  image_type,
                  protocol,
                  connection_id: _.get(res, 'data.data.connection_id'),
                  scene_id: this.sceneId,
                  user_id: this.$store.state.user.id,
                  scene_name: this.breadcrumbName,
                },
              });
              window.open(url.href, '_blank');
            });
        }
      }
    },

    /**
     * 获取场景数据
     */
    handleGetSceneData(refresh) {
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
          this.progress = status.progress;
          this.start = status.showBtn;
          this.stageProgress = status.stageProgress;
          //获取local_scene_id,room_id
          this.local_scene_id = res.data.data.local_scene_id;
          this.room_id = res.data.data.room_id;

          // 场景数据赋值
          this.sceneData = {
            roles: this.setRolesData(_.get(res, 'data.data.role_list')), // 赋值roles
            ...status.sceneData,
          };
          this.role_list = this.setRolesData(_.get(res, 'data.data.role_list'));
          this.sceneConfigId = res?.data?.data?.mp_scene_id;
          // 场景id
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          // 返回topo_id
          this.topo_id = _.get(res, 'data.data.topo_id', '') || '';
          // 传值sceneId,topo_id实现跳转3D态势
          this.$emit('sceneId', this.sceneId);
          this.$emit('topoId', this.topo_id);

          this.flagData = true;
          refresh && this.changeTopo();
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
      // this.bindSceneWs();
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
          this.start = true;
          /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
          this.handleGetSceneData(true);
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
            this.start = false;
            this.handleGetSceneData(true);
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
        .then((res) => { });
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
        .then((res) => { });
    },

    showTaskPanel() {
      this.showInfo = !this.showInfo;
    },

    // 教员-综合演训详情
    getTeacherDetail(id) {
      this.$request
        .get(
          '/cr/team_train/room',
          { resource_id: id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.screenName = res.data.data.name;
          this.crEventData = res.data.data;

          this.breadcrumbName = res.data.data.name;
          setBreadcrumbTitle(this.breadcrumbName);

          if (this.crEventData) {
            this.bindSceneWs();
          }
        })
        .catch((error) => { });
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
        .catch((_) => { });
    },

    // 教员编辑综合演训
    editTeamTrain() {
      this.editDialog = true;
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
        .catch(() => { });
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
        .catch((error) => { });
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
            const wsData = handleWsData(
              data,
              this.progress,
              this.stageProgress,
              this.sceneData,
            );
            if (data.type === 'scene_element') {
              this.wsData = data.data;
              if (this.wsData.call_action === 'node_access_user') {
                // 接入消息
                this.deviceList.forEach((item) => {
                  if (item.id === this.wsData.node_id) {
                    item.access_users = this.wsData.data;
                  }
                });
              } else {
                // 非接入消息
                // 节点开机关机状态
                this.deviceList.forEach((item) => {
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
                  let deviceIndex = this.deviceList?.findIndex(
                    (item) => item.id === this.wsData.scene_element.id,
                  );
                  deviceIndex >= 0 && this.deviceList.splice(deviceIndex, 1);
                }
              }
            }
            if (wsData) {
              this.showMask = wsData.showMask;
              this.showMaskBtn = wsData.showMaskBtn;
              this.showProgress = wsData.showProgress;
              this.showBtn = wsData.showBtn;
              this.start = wsData.showBtn;
            }
          },
          6: (data) => {
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
    // 场景启动实例更新
    updateTopology() {
      this.sceneStatusMode = 'update';
      this.sceneConfig = {
        showMenu: true,
        menubar: ['topology', 'assets', 'war'],
        toolbar: [],
        showToolbar: true,
        toolMenuBar: ['basicSetting'],
        targetMenubar: [
          'operatingSystem',
          'applicationSystem',
          'securityEquipment',
        ],
      };
      this.showBtn = false;
      this.showMaskBtn = false;
      this.showProgress = false;
      this.showMask = false;
    },
    // 保存场景实例更新变动
    submitTopology() {
      this.$confirm(this.$t('crEvent.confirmSceneSaveUpdate'))
        .then(() => {
          let params = {
            role_list: [
              ...this.$refs.sceneEditor.getData()?.roles[0]?.children,
              // ...this.$refs.sceneEditor.getData()?.roles[1]?.children,
            ],
            mp_scene_id: this.sceneId,
            update_scene: this.$refs.sceneEditor.getData()?.scene_config,
          };
          updateTopologyDynamic(params).then((res) => {
            this.toBack(false);
          });
        })
        .catch(() => { });
    },
    // 取消返回操作
    toBack(refresh) {
      this.sceneStatusMode = 'display';
      this.sceneConfig = {
        showMenu: false,
        menubar: [],
        toolbar: [],
        showToolbar: false,
      };
      this.showBtn = true;
      refresh && this.handleGetSceneData(refresh);
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
    // 单节点动态配置
    handleConfigureNode(data) {
      this.$refs.sceneEditor.configureTheNode(data.id + '');
    },
    // 单节点实例更新
    handleUpdateNodeData(data) {
      updateNodeDynamic(data).then((res) => {
        this.sceneStatus === 'display' &&
          this.$message.success(this.$t('common.operateSuccess'));
      });
    },
    // 单节点删除
    handleDeleteNode(data) {
      if (data[0].eid) {
        let params = {
          mp_scene_id: this.sceneId,
          node_id: data[0].id,
        };
        deleteNodeDynamic(params).then((res) => { });
      }
    },
    // 调用编辑器内部删除方法，处理删除操作
    handleDeleteNodeOperation(nodeId) {
      // 前端过滤删除节点
      const filterData = this.deviceList.filter((item) => {
        return item.id !== nodeId;
      });
      this.deviceList = filterData;
      this.$refs.sceneEditor.deleteNodeById(nodeId);
    },
    // 根据节点id选中拓扑中的节点
    selectTheNode(nodeId) {
      this.$refs.sceneEditor.selectNodeById(nodeId);
    },
    // 重启
    handleRestart(nodeId, resource_id) {
      nodeStartApi({
        node_id: nodeId,
        resource_id: resource_id,
      }).then((res) => {
        this.$message.success(this.$t('common.operateSuccess'));
      });
    },

    // 重建
    handleRecreate(nodeId, resource_id) {
      nodeBuildApi({
        node_id: nodeId,
        resource_id: resource_id,
      }).then((res) => {
        this.$message.success(this.$t('common.operateSuccess'));
      });
    },
    handleNextLevel(levelId) {
      this.levelId = levelId;
    },
  },
};
</script>

<style lang="scss" scoped>
.topology-monitor {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;

  .left-wrap {
    flex: 1;
    background: var(--bg-color-2);
    position: relative;
    width: calc(100% - 416px);

    .role-filter {
      position: absolute;
      left: 34px;
      top: 26px;
      z-index: 10;

      .el-input,
      .el-input--suffix {
        .el-input__inner {
          background-color: var(--bg-color-2) !important;
        }
      }
    }

    .edit-scene {
      position: absolute;
      bottom: 18px;
      left: 126px;
      z-index: 20;
    }

    ::v-deep .scene-all.update-scene {
      height: calc(100% - 60px);

      &.fullscreen {
        height: 100%;
      }
    }

    .bottom-btn-wrapper {
      text-align: center;
      margin: 14px 0;
    }
  }

  .right-wrap {
    width: 400px;
    margin-left: 16px;
    background: var(--bg-color-2);
  }
}
</style>
