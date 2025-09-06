<template>
  <div class="topology-monitor">
    <div class="left-wrap">
      <div v-if="sceneStatus === 'display'" class="role-filter">
        <cb-select
          v-model="currentRole.group"
          class="text-box elc-select elc-input-16"
          :options="personalList"
          titleField="name"
          valueField="resource_id"
          @change="roleGroupChange"
        >
        </cb-select>
        <cb-select
          v-if="currentRoles && currentRoles.length"
          v-model="currentRole.role"
          class="text-box elc-select elc-input-16"
          :options="currentRoles"
          titleField="name"
          valueField="resource_id"
        >
        </cb-select>
      </div>
      <div class="red-blue-logo">
        <img :src="red_vs_blue" />
      </div>
      <scene-editor
        v-if="refresh"
        :class="{ 'update-scene': sceneStatus === 'update' }"
        ref="sceneEditor"
        :sceneConfig="sceneConfig"
        :topologyData="sceneData"
        :show-mask="showMask"
        :progress="progress"
        :progress-localize="progressLocalize"
        :breadcrumb-localize="breadcrumbLocalize"
        :stage-progress="stageProgress"
        :allow-dialog="false"
        :show-title="false"
        :show-label="false"
        :status="sceneStatus"
        :show-btn="showBtn"
        :show-mask-btn="showMaskBtn"
        :show-progress="showProgress"
        :btn-config="btnGroupConfig"
        :show-action-role="false"
        :draw-ws-new-node="false"
        :open-layer="true"
        :sceneConfigId="sceneConfigId"
        @on-next-level="handleNextLevel"
        @onSceneStart="handleSceneStart"
        @onAccess="openTap"
        @close="handleClosed"
        @on-node-restart="nodeRestart"
        @on-node-rebuild="nodeRecreate"
        @on-node-start="nodeStart"
        @on-node-shutdown="(data) => onNodeShutDown(data, sceneId)"
        @on-node-shutup="(data) => onNodeShutUp(data, sceneId)"
        @on-update-topology="updateTopology"
        @on-update-node-data="handleUpdateNodeData"
        @on-deleted-nodes="handleDeleteNode"
        :mp-scene-id="sceneId"
        :show-snap-shot-btn="false"
        :ws-data="wsData"
        :open-watch-topology-data="false"
        :node-link-connectivity-status="true"
        :business_id="resource_id"
        :role_id="currentRole.role"
        :roles.sync="role_list"
        :needToJudgeRoleAssetAllocation="
          current_role_group == 4 || current_role_group == 5 ? true : false
        "
      ></scene-editor>
      <div v-if="sceneStatus === 'update'" class="bottom-btn-wrapper">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" mr @click="submitTopology">
          </cb-button>
          <cb-button button-type="cancel" @click="toBack(true)"> </cb-button>
        </cb-button-group>
      </div>
    </div>
    <div class="right-wrap">
      <equipment-list
        :count-list="countList"
        :device-list="deviceList"
        @updateList="getEquipmentList($event)"
        :start="start"
        :sceneId="sceneId"
        :topo_id="topo_id"
        :scene-status="sceneStatus"
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
import red_vs_blue from '@/assets/img/redVsBlue/director/red_vs_blue.png';
import red_vs_blue_en from '@/assets/img/redVsBlue/director/red_vs_blue_en.png';
import { mapGetters } from 'vuex';
import util from '@/utils/util';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import defaultUserLogo from '@/assets/img/userhead.png';
import _ from 'lodash';
import { SceneEditor } from '@cyber/scene';
import { handleWsData, getSceneStatus } from '@/utils/scene-websocket.js';
import {
  openTap,
  getSceneData,
  startScene,
  closeScene,
  restartNode,
  recreateNode,
  startNode,
  deviceCount,
  getEquipment,
} from '@/api/web/red-blue';
import equipmentList from './equipment-list';
import {
  deleteNodeDynamic,
  updateNodeDynamic,
  updateTopologyDynamic,
} from '../../../../../api/scene/scene';
import { mixins } from '@/mixin';
import { getUserInfo, getLanguage } from '@cyber/helper';
export default {
  mixins: [mixins],
  components: {
    SceneEditor,
    equipmentList,
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
    // showUserInfo: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  data() {
    return {
      red_vs_blue: getLanguage() === 'en-US' ? red_vs_blue_en : red_vs_blue,
      resource_id: this.$route.params && this.$route.params.resource_id,
      cookie: '',
      sceneStatus: 'display',
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        // toolbar: ['restore'],
        // showToolbar: true,
        toolbar: [],
        showToolbar: false,
      },
      // 进度条的位置，与css样式中写的值同步
      progressLocalize: {
        width: '100%',
        left: '0px',
        bottom: '0px',
      },
      // 层节点面包屑的位置，与css样式中写的值同步
      breadcrumbLocalize: {
        top: '100px',
        left: '34px',
      },
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close', 'update-topology'], // 按钮组配置项
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      scene_manager_id: '',
      sceneId: '',
      topo_id: '',
      refresh: true,

      sceneLoading: false, // 场景loading
      showTask: true,
      isEdit: true,
      defaultUserLogo: defaultUserLogo,
      message: null,
      loading: true,
      missionType: {
        // 题目类型
        EXAM: 0,
        CTF: 1,
        CHECK: 2,
      },
      testType: {
        // 试题类型
        SINGLE: 0,
        MULTIPLE: 1,
        JUDGEMENT: 2,
        SHORTQUES: 3,
      },
      taskStatus: {
        // 任务完成的状态
        // notFinished: 0,
        error: 1,
        success: 2,
      },

      id: null,
      name: '',
      // connection_url: {},
      tasktype: null,
      activityBulletin: this.$t('m.activityBulletin'),
      scenarioContent: this.$t('m.scenarioContent'),
      answerLists: [],
      centerDialogVisible: false, // 弹出框
      taskBox: false,
      flagValue: '', // 提交flasg
      cr_scene_id: '',
      topologyValue: {},
      activity_time: null,
      taskInformation: {},
      extraData: [],
      description: '',
      taskLists: {},
      activityList: [],
      machinelists: [],
      getMachineInfo: {},
      clickIndex: null,
      topologyData: {},
      personalList: [],
      userList: [],
      gatherSchemesData: {},
      flowSchemeData: {},
      missionSchemesData: {},
      crEventDatas: this.crEventData,
      currentRole: {
        group: '',
        role: '',
      },
      currentRoleNodes: null,
      permissionGroup: null,
      wsData: {},
      countList: [],
      deviceList: [],
      model: {
        category: '',
        name: '',
      },
      start: false,
      sceneConfigId: '',
      role_list: [], // 单独维护到编辑器中
      levelId: '', // 层id
      current_role_group: 1,
    };
  },
  computed: {
    roleGroup() {
      return _.get(this.crEventData, 'data.role_permission.role_group');
    },
    showEdit() {
      const runningStatus = _.get(this, 'crEventData.data.training_status');
      if (runningStatus === 4) {
        return true;
      }
      return false;
    },
    userRole() {
      let group;
      let role;
      _.forEach(this.personalList, (roleGroup) => {
        if (
          _.find(
            roleGroup.users_data,
            (user) => user.resource_id === this.user_data.resource_id,
          )
        ) {
          group = roleGroup;
        }
        _.forEach(roleGroup.children, (chidlRole) => {
          if (
            _.find(
              chidlRole.users_data,
              (user) => user.resource_id === this.user_data.resource_id,
            )
          ) {
            group = roleGroup;
            role = chidlRole;
            return false;
          }
        });
        if (group || role) {
          return false;
        }
      });
      return {
        group,
        role,
      };
    },
    currentRoles() {
      const group = this.roleMapping[this.currentRole.group];
      if (group) {
        return group.children;
      }
      return [];
    },
    roleMapping() {
      const roleMapping = {};
      _.forEach(this.personalList, (roleGroup) => {
        roleMapping[roleGroup.resource_id] = roleGroup;
        _.forEach(roleGroup.children, (role) => {
          roleMapping[role.resource_id] = role;
        });
      });
      return roleMapping;
    },
    theTopologyData() {
      let data;
      if (this.crEventDatas.data) {
        if (this.crEventDatas.data.scene_data) {
          return this.crEventDatas.data.scene_data;
        } else {
          return (
            this.crEventDatas.data &&
            this.crEventDatas.data.scene_config_data &&
            this.crEventDatas.data.scene_config_data.topology_config
          );
        }
      }

      return data;
    },
    user_data() {
      return this.$store.state.user;
    },
    ...mapGetters(['language']),
  },
  watch: {
    language: {
      handler(val, oldval) {
        this.getUserData();
      },
      deep: true,
      immediate: true,
    },
    crEventData: {
      handler(val, oldval) {
        if (val !== oldval) {
          this.crEventDatas = val;
          this.getUserData();
        }
      },
      deep: true,
      immediate: true,
    },
    resource_id: {
      handler(nv, ov) {
        if (nv) {
          this.getUserInfo();
        }
      },
      deep: true,
      immediate: true,
    },
    personalList: {
      handler(val, oldval) {
        this.currentRole.group = !_.isEmpty(this.userRole.group)
          ? this.userRole.group.id
          : '';
        this.currentRole.role = !_.isEmpty(this.userRole.role)
          ? this.userRole.role.id
          : '';
      },
      immediate: true,
    },
    'currentRole.group': {
      handler(val, oldval) {
        if (!_.isEmpty(this.currentRoles)) {
          this.currentRole.role = this.currentRoles[0].resource_id;
        } else {
          this.currentRole.role = '';
          this.handleGetSceneData(
            this.$route.params && this.$route.params.resource_id,
          );
        }
      },
      immediate: false,
    },
    'currentRole.role': {
      handler(val, oldval) {
        if (this.currentRole.role) {
          const roleObj = this.roleMapping[this.currentRole.role];
          const nodes = util.parseJsonStr(roleObj.nodes, null);
          this.currentRoleNodes = nodes;
          this.handleGetSceneData(
            this.$route.params && this.$route.params.resource_id,
          );
        } else {
          this.currentRoleNodes = null;
        }
      },
      immediate: false,
    },
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
    // 获取token
    /* this.cookie = document.cookie.split('cr_jwttoken=')[1]; */
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getRouterData();
  },
  mounted() {
    this.permissionGroup = localStorage.getItem('role_group');
    this.getDeviceCount();
    _.isEmpty(this.sceneData) && this.handleGetSceneData(this.resource_id);
  },
  activated() {
    // this.changeTopo();
    this.handleGetSceneData(this.resource_id, true);
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        this.bindSceneWs();
      });
    },
    roleGroupChange(value) {
      const filterData = this.personalList.filter((item) => {
        return item.resource_id == value;
      });
      if (filterData?.length) {
        this.current_role_group = filterData[0].role_group;
      }
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
            page: 'red',
            id,
            role_group: this.roleGroup,
            nodeName,
            image_type,
            protocol,
            connection_url: connection_url,
            resource_id: this.resource_id,
            scene_name: this.breadcrumbName,
            node_id: nodeId,
            scene_id: this.sceneId,
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
        openTap(params).then((res) => {
          const url = this.$router.resolve({
            name: 'scene-screen-recording',
            query: {
              page: 'red',
              id,
              nodeName,
              image_type,
              role_group: this.roleGroup,
              nodeName: _.get(res, 'data.data.node_name'),
              protocol,
              resource_id: this.resource_id,
              connection_url: _.get(res, 'data.data.connection_url'),
              node_id: nodeId,
              connection_id: _.get(res, 'data.data.connection_id'),
              scene_id: this.sceneId,
              user_id: this.$store.state.user.id,
              scene_name: this.breadcrumbName,
            },
          });
          window.open(url.href, '_blank');
        });
      }
    },

    /**
     * 获取场景数据
     */
    handleGetSceneData(resource_id, refresh = true) {
      return new Promise((resolve, reject) => {
        let params = {};
        if (this.currentRole.role) {
          params = {
            role_id: this.currentRole.role,
          };
        }
        // 红蓝拓扑监控请选择角色获取场景数据
        getSceneData({ room_id: resource_id, ...params }).then((res) => {
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = status.showMaskBtn;
          this.showProgress = status.showProgress;
          this.showBtn = status.showBtn;
          this.progress = status.progress;
          this.start = status.showBtn;
          this.stageProgress = status.stageProgress;
          let red_roles = _.get(res, 'data.data.red_roles');
          let blue_roles = _.get(res, 'data.data.blue_roles');
          // 场景数据赋值
          // this.sceneData = {
          //   roles: this.setRolesData(red_roles, blue_roles), // 赋值roles
          //   ...status.sceneData,
          // };
          // this.role_list = this.setRolesData(red_roles, blue_roles);
          if (this.current_role_group == 4) {
            this.sceneData = {
              roles: this.setRolesData(red_roles, []), // 赋值roles
              ...status.sceneData,
            };
            this.role_list = this.setRolesData(red_roles, []);
          } else if (this.current_role_group == 5) {
            this.sceneData = {
              roles: this.setRolesData([], blue_roles), // 赋值roles
              ...status.sceneData,
            };
            this.role_list = this.setRolesData([], blue_roles);
          } else {
            this.sceneData = {
              roles: this.setRolesData(red_roles, blue_roles), // 赋值roles
              ...status.sceneData,
            };
            this.role_list = this.setRolesData(red_roles, blue_roles);
          }
          this.sceneConfigId = res?.data?.data?.mp_scene_id;
          // 场景id
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          // 返回topo_id
          this.topo_id = _.get(res, 'data.data.topo_id', '') || '';
          this.$emit('sendData', this.sceneId, this.topo_id);
          refresh && this.changeTopo();
          resolve();
        });
      });
    },

    // 红蓝场景启动
    handleSceneStart() {
      this.refreshProgress();
      /* this.bindSceneWs(); */
      startScene({ room_id: this.resource_id }).then((res) => {
        this.showMask = true;
        this.showMaskBtn = false;
        this.showProgress = true;
        this.showBtn = false;
        this.start = true;
        /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
        //  this.handleGetSceneData();
        this.handleGetSceneData(
          this.$route.params && this.$route.params.resource_id,
          true,
        );
      });
    },

    // 红蓝关闭场景
    handleClosed() {
      this.$confirm(
        this.$t('common.closeSceneConfirm') + '？',
        this.$t('common.info'),
        {
          type: 'warning',
        },
      ).then(() => {
        this.refreshProgress();
        closeScene({ room_id: this.resource_id }).then((res) => {
          this.showMask = true;
          this.showMaskBtn = true;
          this.showProgress = false;
          this.showBtn = false;
          this.start = false;
          this.handleGetSceneData(
            this.$route.params && this.$route.params.resource_id,
            true,
          );
        });
      });
    },

    showTaskPanel() {
      this.showTask = !this.showTask;
    },

    getUserData() {
      if (!_.isEmpty(this.crEventDatas.data)) {
        if (!_.isEmpty(this.crEventDatas.data.gather_scheme)) {
          this.gatherSchemesData = this.crEventDatas.data.gather_scheme;
        }
        if (!_.isEmpty(this.crEventDatas.data.flow_scheme)) {
          this.flowSchemeData = this.crEventDatas.data.flow_scheme;
        }
        if (!_.isEmpty(this.crEventDatas.data.mission_scheme)) {
          this.missionSchemesData = this.crEventDatas.data.mission_scheme;
        }
        this.personalList = this.crEventDatas.data.roles_data;
        this.userList = [];
        _.forEach(this.personalList, (people) => {
          if (people.role_group === this.$CONSTANT.Role.RedVsBlue.ADMIN.value) {
            this.$set(people, 'name', this.$t('common.admin'));
          } else if (
            people.role_group === this.$CONSTANT.Role.RedVsBlue.DIRECTOR.value
          ) {
            this.$set(people, 'name', this.$t('common.director'));
          } else if (
            people.role_group === this.$CONSTANT.Role.RedVsBlue.REFEREE.value
          ) {
            this.$set(people, 'name', this.$t('common.referee'));
          } else if (
            people.role_group === this.$CONSTANT.Role.RedVsBlue.REDUSER.value
          ) {
            this.$set(people, 'name', this.$t('common.redUser'));
          } else if (
            people.role_group === this.$CONSTANT.Role.RedVsBlue.BLUEUSER.value
          ) {
            this.$set(people, 'name', this.$t('common.blueUser'));
          }
          this.userList.push(people);
        });
      }
    },

    getRouterData() {
      this.id = this.$route.params && this.$route.params.id;
      this.cr_scene_id = this.$route.params && this.$route.params.cr_scene_id;
    },

    // 红蓝重启节点
    nodeRestart(data) {
      const { id } = data;
      restartNode({
        node_id: id,
        resource_id: this.resource_id,
      }).then((res) => {});
    },
    //红蓝节点重建
    nodeRecreate(data) {
      const { id } = data;
      recreateNode({
        node_id: id,
        resource_id: this.resource_id,
      }).then((res) => {
        this.crEventDatas = res.data;
      });
    },

    /* 部分节点启动 */
    nodeStart(data) {
      const { id } = data;
      startNode({
        node_id: id,
        resource_id: this.resource_id,
      }).then((res) => {
        this.crEventDatas = res.data;
      });
    },
    // 设备统计
    getDeviceCount() {
      deviceCount({ resource_id: this.resource_id }).then((res) => {
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
        resource_id: this.resource_id,
        category: this.model.category,
        name: this.model.name,
      };
      getEquipment(params).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.deviceList = data;
      });
    },
    // 红蓝进度条ws推送
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
                  // 刷新设备统计
                  this.getDeviceCount();
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
              this.handleGetSceneData(this.resource_id, true);
            }
            if (data.type === 2) {
              this.handleGetSceneData(this.resource_id, true);
            }
          },
        },
      );
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
      restartNode({
        node_id: nodeId,
        resource_id: resource_id,
      }).then((res) => {
        this.$message.success(this.$t('common.operateSuccess'));
      });
    },

    // 重建
    handleRecreate(nodeId, resource_id) {
      recreateNode({
        node_id: nodeId,
        resource_id: resource_id,
      }).then((res) => {
        this.$message.success(this.$t('common.operateSuccess'));
      });
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
        deleteNodeDynamic(params).then((res) => {});
      }
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
      this.currentRole.role = null;
      // 需要获取到没有角色的所有场景数据
      this.handleGetSceneData(this.resource_id, true).then(() => {
        this.sceneStatus = 'update';
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
      });
    },
    // 保存场景实例更新变动
    submitTopology() {
      this.$confirm(this.$t('crEvent.confirmSceneSaveUpdate'))
        .then(() => {
          let params = {
            red_roles:
              this.$refs.sceneEditor?.getData()?.roles[0]?.children || [],
            blue_roles:
              this.$refs.sceneEditor?.getData()?.roles[1]?.children || [],
            mp_scene_id: this.sceneId,
            update_scene: this.$refs.sceneEditor?.getData()?.scene_config,
          };
          updateTopologyDynamic(params).then((res) => {
            this.toBack(false);
          });
        })
        .catch(() => {});
    },
    // 取消返回操作
    toBack(refresh) {
      this.sceneStatus = 'display';
      this.sceneConfig = {
        showMenu: false,
        menubar: [],
        toolbar: [],
        showToolbar: false,
      };
      this.showBtn = true;
      this.currentRole = { group: '', role: '' };
      refresh && this.handleGetSceneData(this.resource_id);
    },
    // 赋值角色资产和战争迷雾数据
    setRolesData(red_roles, blue_roles) {
      let new_roles = [
        {
          asset_nodes: [],
          children: [],
          id: '',
          name: '红队',
          type: 'red',
          visible_nodes: [],
        },
        {
          asset_nodes: [],
          children: [],
          id: '',
          name: '蓝队',
          type: 'blue',
          visible_nodes: [],
        },
      ];

      red_roles &&
        red_roles.forEach((item) => {
          new_roles[0].children.push({
            asset_nodes: item.asset_nodes,
            id: item.name,
            name: item.name,
            type: 'red',
            visible_nodes: item.visible_nodes,
            missions_scheme: item.missions_scheme,
          });
        });
      blue_roles &&
        blue_roles.forEach((item) => {
          new_roles[1].children.push({
            asset_nodes: item.asset_nodes,
            id: item.name,
            name: item.name,
            type: 'blue',
            visible_nodes: item.visible_nodes,
            missions_scheme: item.missions_scheme,
          });
        });
      return new_roles;
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
    //text-align: center;
    .red-blue-logo {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 48px;
      z-index: 1;
    }
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
