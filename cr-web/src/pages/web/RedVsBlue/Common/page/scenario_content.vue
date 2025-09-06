<template>
  <div id="combat">
    <!-- 页面内容 -->
    <div class="combat-banner">
      <div class="bannerLeft">
        <div class="role-filter">
          <cb-select
            v-model="currentRole.group"
            class="text-box elc-select elc-input-16"
            :options="personalList"
            titleField="name"
            valueField="resource_id"
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
        <div class="content">
          <scene-editor
            v-if="refresh"
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
            @onSceneStart="handleSceneStart"
            @onAccess="openTap"
            @close="handleClosed"
            @on-node-restart="nodeRestart"
            @on-node-rebuild="nodeRecreate"
            @on-node-start="nodeStart"
            :mp-scene-id="sceneId"
            :show-snap-shot-btn="false"
            :ws-data="wsData"
            :open-watch-topology-data="false"
            :node-link-connectivity-status="true"
          ></scene-editor>
        </div>
      </div>
      <div
        v-if="showUserInfo"
        class="right-task"
        :class="showTask ? 'cssAnimate' : 'cssAnimateRight'"
      >
        <div class="btn-left fr" @click="showTaskPanel()">
          <cb-iconfont v-if="showTask" type="icon-xiangzuo"></cb-iconfont>
          <cb-iconfont v-else type="icon-xiangyou"></cb-iconfont>
        </div>
        <div
          v-if="showTask"
          class="task-content fr showRecord"
          style="width: 100%; position: absolute; z-index: 10"
        >
          <div class="right-role">
            <cb-scrollbar>
              <span class="role-span">{{ $t('m.roleInfo') }}</span>
              <div
                v-for="(role, i) in userList"
                :key="i + '11'"
                class="useritem"
              >
                <div
                  v-if="role.role_group < 4"
                  class="role-item-new"
                  :data-key="role.id"
                >
                  <div class="role-name">
                    <i class="green-color circle-one"
                      >{{ $t('m.managementGroup') }}
                    </i>
                    <template
                      v-if="
                        role.role_group === $CONSTANT.Role.RedVsBlue.ADMIN.value
                      "
                    >
                      <span>{{ $t('common.admin') }}</span>
                    </template>
                    <template
                      v-else-if="
                        role.role_group ===
                        $CONSTANT.Role.RedVsBlue.DIRECTOR.value
                      "
                    >
                      <span>{{ $t('common.director') }}</span>
                    </template>
                    <template
                      v-else-if="
                        role.role_group ===
                        $CONSTANT.Role.RedVsBlue.REFEREE.value
                      "
                    >
                      <span>{{ $t('common.referee') }}</span>
                    </template>
                  </div>
                  <div class="role-user-list">
                    <div
                      v-for="user in role.users_data"
                      :key="user.id"
                      class="role-user-item"
                    >
                      <img
                        :src="user.logo || defaultUserLogo"
                        class="user-logo"
                      />
                      <span
                        class="user-name one-overflow point"
                        :title="user.rep_name"
                        >{{ user.rep_name }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div v-for="role in personalList" :key="role.id" class="useritem">
                <div v-if="role.role_group >= 4" class="role-item-new">
                  <div
                    v-for="roleChildren in role.children"
                    :key="roleChildren.id"
                    class="role-box"
                  >
                    <div v-if="role.role_group == 4" class="role-name">
                      <i class="red-color circle-two"
                        >{{ $t('common.redUser') }} -</i
                      >
                      <span
                        class="one-overflow point"
                        :title="roleChildren.name"
                        >{{ roleChildren.name }}</span
                      >
                    </div>
                    <div v-if="role.role_group == 5" class="role-name">
                      <i class="blue-color circle-three"
                        >{{ $t('common.blueUser') }} -</i
                      >
                      <span
                        class="one-overflow point"
                        :title="roleChildren.name"
                        >{{ roleChildren.name }}</span
                      >
                    </div>
                    <div class="role-user-list">
                      <div
                        v-for="user in roleChildren.users_data"
                        :key="user.id"
                        class="role-user-item"
                      >
                        <img
                          :src="user.logo || defaultUserLogo"
                          class="user-logo"
                        />
                        <span
                          class="user-name one-overflow point"
                          :title="user.rep_name"
                          >{{ user.rep_name }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </cb-scrollbar>
          </div>
        </div>
      </div>
      <slot name="battle-info" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import util from '@/utils/util';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import defaultUserLogo from '@/assets/img/userhead.png';
import _ from 'lodash';
import { SceneEditor } from '@cyber/scene';
import { handleWsData, getSceneStatus } from '@/utils/scene-websocket.js';
export default {
  components: {
    SceneEditor,
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
    showUserInfo: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      cookie: '',
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        // toolbar: ['restore'],
        // showToolbar: true,
        toolbar: [],
        showToolbar: false,
      },
      // 进度条信息
      progress: {
        progressRate: 0,
        progressInfo: '',
        status: undefined,
      },

      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close'], // 按钮组配置项
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      scene_manager_id: '',
      sceneId: '',
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
    };
  },
  computed: {
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
      immediate: true,
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
    this.$nextTick(() => {});
    this.bindSceneWs();
  },
  activated() {
    this.changeTopo();
    this.handleGetSceneData(this.resource_id);
  },
  methods: {
    changeTopo() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
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
    handleGetSceneData(resource_id) {
      let params = {};
      if (this.currentRole.role) {
        params = {
          role_id: this.currentRole.role,
        };
      }
      // 红蓝拓扑监控请选择角色获取场景数据
      this.$request
        .get(
          '/cr/red_vs_blue/scene/',
          { room_id: resource_id, ...params },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          // TODO: this.refresh 作用？
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = status.showMaskBtn;
          this.showProgress = status.showProgress;
          this.showBtn = status.showBtn;
          this.sceneData = status.sceneData;
          this.progress = status.progress;

          // 场景id
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          // 返回topo_id
          this.topo_id = _.get(res, 'data.data.topo_id', '') || '';
          this.$emit('sendData', this.sceneId, this.topo_id);
          this.changeTopo();
        });
    },

    // 红蓝场景启动
    handleSceneStart() {
      this.refreshProgress();
      /* this.bindSceneWs(); */
      this.$request
        .post(
          `/cr/red_vs_blue/scene/`,
          { room_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          this.showBtn = true;
          /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
          //  this.handleGetSceneData();
          this.handleGetSceneData(
            this.$route.params && this.$route.params.resource_id,
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
        this.$request
          .delete(
            `/cr/red_vs_blue/scene/`,
            { room_id: this.resource_id },
            { baseURL: '/api/ojj' },
          )
          .then((res) => {
            this.showMask = true;
            this.showMaskBtn = true;
            this.showProgress = false;
            this.showBtn = false;
            this.handleGetSceneData(
              this.$route.params && this.$route.params.resource_id,
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
      this.$request
        .post(
          '/cr/red_vs_blue/scene/node/restart',
          {
            node_id: id,
            resource_id: this.resource_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {});
    },
    //红蓝节点重建
    nodeRecreate(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/red_vs_blue/scene/node/recreate',
          {
            node_id: id,
            resource_id: this.resource_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.crEventDatas = res.data;
        });
    },

    /* 部分节点启动 */
    nodeStart(data) {
      const { id } = data;
      this.$request
        .post(
          '/cr/red_vs_blue/scene/node/create',
          {
            node_id: id,
            resource_id: this.resource_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.crEventDatas = res.data;
        });
    },

    // 红蓝进度条ws推送
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

    refreshProgress() {
      this.progress.status = undefined;
      this.progress.progressInfo = '';
      this.progress.progressRate = 0;
    },
  },
};
</script>

<style lang="scss">
$border-color: #dcdfe6;

#combat {
  .right-task {
    .role-span {
      color: var(--neutral8);
    }

    .user-name {
      color: var(--neutral5);
    }
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;

    .bottom-btn {
      z-index: 10;
      margin-top: -50px;
      margin-left: 20px;
      position: absolute;
    }
  }
}

#combat {
  position: relative;
  width: 100%;
  height: 100%;

  .header {
    height: 35px;
    margin: 5px 0;
  }

  .point {
    cursor: pointer;
  }

  // banner样式
  .combat-banner {
    width: 100%;
    height: 100%;

    .bannerLeft {
      position: relative;
      float: left;
      width: 100%;
      height: 100%;
      // 拓扑
      .elc-group-scene-container {
        height: 100%;
        margin-bottom: 24px;

        .elc-scene-vis-display-panel-container {
          border-radius: 8px;

          .mask {
            background-color: transparent;
          }
        }
      }
    }

    .bannerRight {
      float: left;
      width: 27%;
      height: 100%;
      box-sizing: border-box;

      .info {
        height: 80%;
      }

      .operations {
        text-align: center;
        height: 18%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        box-sizing: border-box;
      }
    }
  }

  .cssAnimate {
    width: 23%;
    min-width: 400px;
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
    box-sizing: border-box;

    .btn-left {
      cursor: pointer;
      width: 20px;
      height: 50px;
      line-height: 50px;
      border-radius: 2px 0 0 2px;
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
      height: 100%;
      border-radius: 2px;
      position: absolute;
      right: 0;

      .right-role {
        width: calc(100% - 90px);
        height: calc(100% - 50px);
        margin: 50px 45px 0;

        .role-span {
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          // color: rgba(237, 242, 255, 1);
          display: inline-block;
          margin-bottom: 15px;
        }

        .el-scrollbar {
          width: 104%;
          height: calc(100% - 45px);

          .el-scrollbar__wrap {
            overflow: hidden;
          }
        }

        .el-scrollbar__wrap:hover {
          overflow: scroll;
        }

        .el-scrollbar__view {
          height: calc(100% - 45px);
        }

        .el-scrollbar__bar.is-horizontal {
          height: 0;
          left: 0;
        }
      }
    }

    .showRecord {
      .el-scrollbar {
        height: 100%;
      }

      .el-scrollbar__view {
        height: 100%;
      }

      .el-scrollbar__wrap {
        overflow-x: hidden !important;
      }

      .el-scrollbar__bar.is-horizontal {
        height: 0;
      }

      .useritem {
        width: 100%;
        // height: 100%;
      }
    }

    .role-name {
      width: 100%;
      margin: 10px 0 10px 16px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      // color: rgba(255, 255, 255, 1);
      display: flex;

      span {
        // float: left;
        padding-left: 5px;
        display: inline-block;
        width: calc(100% - 110px);
        // line-height: 12px;
        // max-width: 100%;
        cursor: pointer;
      }

      .circle-one,
      .circle-two,
      .circle-three {
        position: relative;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        // line-height: 36px;
      }

      .circle-one:after,
      .circle-two:after,
      .circle-three:after {
        position: absolute;
        top: 7px;
        left: -16px;
        content: '';
        width: 6px;
        height: 8px;
      }
    }

    .role-item {
      overflow: hidden;
      width: 100%;
    }

    .role-inner {
      margin: 10px;
      width: 98%;
    }

    .role-box {
      width: 100%;
    }

    .role-user-list {
      /*background: #222840;*/
      // height: 85px;
      overflow: auto;

      &::-webkit-scrollbar {
        width: 2px;
      }

      &::-webkit-scrollbar-thumb {
        // background-color: #ededee;
        background-color: transparent;
        outline: 1px solid slategrey;
      }

      &::-webkit-scrollbar-corner {
        // background-color: #ededee;
        background-color: transparent;
      }

      &::after {
        display: block;
        clear: both;
        content: '';
      }

      .role-user-item {
        float: left;
        text-align: center;
        width: 70px;
        font-size: 12px;
        position: relative;
        margin: 0 7px 10px 0;

        .user-logo {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: var(--bg-color-4);
        }

        .user-name {
          height: 30px;
          display: block;
          line-height: 30px;
          white-space: nowrap;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          // color: rgba(192, 204, 231, 1);
        }

        .remove {
          color: #f56c6c;
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
        }
      }
    }
  }
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
</style>

<style></style>
