<template>
  <scene-editor
    ref="sceneEditor"
    :sceneConfig="sceneConfig"
    :topologyData="sceneData"
    :show-mask="showMask"
    :progress="progress"
    :breadcrumb-localize="breadcrumbLocalize"
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
    :allow-start="handleAllowStart()"
    @on-node-start="nodeStart"
    @onSceneStart="handleSceneStart"
    @onAccess="openTap"
    @close="handleClosed"
    @on-node-restart="nodeRestart"
    @on-node-rebuild="nodeRecreate"
    @on-node-shutdown="(data) => onNodeShutDown(data, sceneId)"
    @on-node-shutup="(data) => onNodeShutUp(data, sceneId)"
    :mp-scene-id="sceneId"
    :show-snap-shot-btn="false"
    :show-node-btn="showNodeBtn()"
    :ws-data="wsData"
    :need-to-judge-role-asset-allocation="isNeedRoleAsset"
    :node-link-connectivity-status="true"
    :business_id="business_id"
    :roles.sync="roleList"
  >
  </scene-editor>
</template>

<script>
import { SceneEditor } from '@cyber/scene';
import {
  getSceneData,
  sceneStart,
  sceneClose,
  nodeRestart,
  nodeRecreate,
  getConnection,
} from '@/api/web/single-train';

import {
  getSceneDataApi,
  sceneStartApi,
  sceneCloseApi,
  nodeStartApi,
  nodeBuildApi,
  getConnectionApi,
} from '@/api/web/team-training';

import {
  getSceneDataRedBlue,
  startScene,
  closeScene,
  restartNode,
  recreateNode,
  openTap,
  startNode,
} from '@/api/web/red-blue';

import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import { mixins } from '@/mixin';
import { getUserInfo } from '@cyber/helper';
export default {
  mixins: [mixins],
  components: {
    SceneEditor,
  },
  props: {
    resourceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isNeedRoleAsset: false, //根据角色资产权限是否展示重启重建等按钮
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
      // 层节点面包屑的位置，与css样式中写的值同步
      breadcrumbLocalize: {
        top: '20px',
        left: '20px',
      },
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      scene_manager_id: this.resourceId, // 用于通用场景请求
      sceneId: '', // 场景id
      sceneConfigId: '',
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close'], // 按钮组配置项
      sceneLoading: false, // 场景loading
      wsData: {},
      business_id: '',
      roleList: [],
    };
  },
  created() {
    this.handleGetSceneData();
    this.getUserInfo();
  },
  mounted() {
    if (
      // 团队红蓝的ws只需要传scene_manager_id
      this.$route.query.page === 'team' ||
      this.$route.query.page === 'team-student' ||
      this.$route.query.page === 'red' ||
      this.$route.query.page === 'red-blue-student'
    ) {
      this.bindSceneTeamOrRedBlueWs();
    }
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        // 单兵的ws,需要传this.$store.state.user.id和scene_manager_id
        this.bindSceneWs();
      });
    },
    showNodeBtn() {
      // 红蓝对抗学员不展示重启重建，开机关机按钮
      if (this.$route.query.page === 'red-blue-student') {
        return false;
      } else {
        return true;
      }
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
        if (
          this.$route.query.page === 'team' ||
          this.$route.query.page === 'team-student'
        ) {
          // 团队接入
          getConnectionApi(params).then((res) => {
            // const url = this.$router.resolve({
            //   name: 'scene-screen-recording',
            //   query: {
            //     connection_url: _.get(res, 'data.data.connection_url'),
            //     node_id: nodeId,
            //     connection_id: _.get(res, 'data.data.connection_id'),
            //     scene_id: this.sceneId,
            //     user_id: this.$store.state.user.id,
            //   },
            // });
            // window.open(url.href, '_blank');
            const connection_url = _.get(res, 'data.data.connection_url', '');
            window.open(connection_url, '_blank');
          });
        } else if (
          this.$route.query.page === 'red' ||
          this.$route.query.page === 'red-blue-student'
        ) {
          // 红蓝接入
          openTap(params).then((res) => {
            // return false;
            const connection_url = _.get(res, 'data.data.connection_url', '');
            window.open(connection_url, '_blank');
          });
        } else {
          // 单兵接入
          getConnection(params).then((res) => {
            // const url = this.$router.resolve({
            //   name: 'scene-screen-recording',
            //   query: {
            //     connection_url: _.get(res, 'data.data.connection_url'),
            //     node_id: nodeId,
            //     connection_id: _.get(res, 'data.data.connection_id'),
            //     scene_id: this.sceneId,
            //     user_id: this.$store.state.user.id,
            //   },
            // });
            // window.open(url.href, '_blank');
            const connection_url = _.get(res, 'data.data.connection_url', '');
            window.open(connection_url, '_blank');
          });
        }
      }
    },
    handleAllowStart() {
      if (
        this.$route.query.page === 'red-blue-student' ||
        this.$route.query.page === 'team-student'
      ) {
        return false;
      } else {
        return true;
      }
    },
    // 单兵ws
    bindSceneWs() {
      this.cookie = utils.getCookie('cr_jwttoken');
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.scene_manager_id}_${this.$store.state.user.id}&token=${this.cookie}`,
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

    // 团队,红蓝的ws
    bindSceneTeamOrRedBlueWs() {
      this.cookie = utils.getCookie('cr_jwttoken');
      this.business_id = this.scene_manager_id;
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.scene_manager_id}&token=${this.cookie}`,
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
    /**
     * 获取场景数据
     */
    handleGetSceneData() {
      if (_.isEmpty(this.scene_manager_id)) {
        return;
      }
      if (
        this.$route.query.page === 'team' ||
        this.$route.query.page === 'team-student'
      ) {
        //团队获取场景
        getSceneDataApi({
          resource_id: this.scene_manager_id,
        }).then((res) => {
          const status = getSceneStatus(res);
          if (this.$route.query.page === 'team') {
            this.showMask = status.showMask;
            this.showMaskBtn = status.showMaskBtn;
            this.showProgress = status.showProgress;
            // this.showBtn = status.showBtn;
            this.showBtn = false;
            this.sceneData = status.sceneData;
            this.progress = status.progress;
          } else if (this.$route.query.page === 'team-student') {
            this.showMask = status.showMask;
            this.showMaskBtn = false; // 学员没有启动场景的权限
            this.showProgress = status.showProgress;
            this.showBtn = false; // 学员没有关闭场景的权限
            this.sceneData = status.sceneData;
            this.progress = status.progress;
            // 场景数据赋值
            this.sceneData = {
              roles: this.setRolesData(_.get(res, 'data.data.role_list')), // 赋值roles
              ...status.sceneData,
            };
            this.roleList = this.setRolesData(
              _.get(res, 'data.data.role_list'),
            );
            this.isNeedRoleAsset = true;
          }
          // 场景id
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          this.sceneConfigId = _.get(res, 'data.data.mp_scene_id', '') || '';
        });
      } else if (
        this.$route.query.page === 'red' ||
        this.$route.query.page === 'red-blue-student'
      ) {
        // 红蓝获取场景
        getSceneDataRedBlue({
          room_id: this.scene_manager_id,
        }).then((res) => {
          const status = getSceneStatus(res);
          if (this.$route.query.page === 'red') {
            this.showMask = status.showMask;
            this.showMaskBtn = status.showMaskBtn;
            this.showProgress = status.showProgress;
            // this.showBtn = status.showBtn;
            this.showBtn = false;
            this.sceneData = status.sceneData;
            this.progress = status.progress;
          } else if (this.$route.query.page === 'red-blue-student') {
            this.showMask = status.showMask;
            this.showMaskBtn = false; // 学员没有启动场景的权限
            this.showProgress = status.showProgress;
            this.showBtn = false; // 学员没有关闭场景的权限
            this.sceneData = status.sceneData;
            this.progress = status.progress;
          }
          // 场景id
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
        });
      } else {
        //单兵获取场景
        getSceneData({
          resource_id: this.scene_manager_id,
        }).then((res) => {
          const status = getSceneStatus(res);
          this.showMask = status.showMask;
          this.showMaskBtn = status.showMaskBtn;
          this.showProgress = status.showProgress;
          // this.showBtn = status.showBtn;
          this.showBtn = false;
          this.sceneData = status.sceneData;
          this.progress = status.progress;
          // 场景id
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
        });
      }
    },
    /* 部分节点启动 */
    nodeStart(data) {
      const { id } = data;
      if (this.$route.query.page === 'red') {
        startNode({
          node_id: id,
          resource_id: this.scene_manager_id,
        }).then((res) => {});
      } else if (this.$route.query.page === 'team') {
      }
    },
    /**
     * 场景启动
     */
    handleSceneStart() {
      this.refreshProgress();

      if (
        this.$route.query.page === 'team' ||
        this.$route.query.page === 'team-student'
      ) {
        // 团队场景启动sceneStartApi
        sceneStartApi({ resource_id: this.scene_manager_id }).then((res) => {
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          this.showBtn = true;
          /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
          this.handleGetSceneData();
        });
      } else if (
        this.$route.query.page === 'red' ||
        this.$route.query.page === 'red-blue-student'
      ) {
        // 红蓝场景启动
        startScene({ room_id: this.scene_manager_id }).then((res) => {
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          this.showBtn = true;
          /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
          //  this.handleGetSceneData();
          this.handleGetSceneData();
        });
      } else {
        // 单兵启动场景
        sceneStart({ resource_id: this.scene_manager_id }).then((res) => {
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          this.showBtn = true;
          /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
          this.handleGetSceneData();
        });
      }
    },

    /**
     * 场景关闭
     */
    handleClosed() {
      this.$confirm(
        this.$t('common.closeSceneConfirm') + '？',
        this.$t('common.info'),
        {
          type: 'warning',
        },
      )
        .then(() => {
          if (_.isEmpty(this.scene_manager_id)) {
            return;
          }
          this.refreshProgress();
          if (
            this.$route.query.page === 'team' ||
            this.$route.query.page === 'team-student'
          ) {
            //团队关闭
            sceneCloseApi({
              resource_id: this.scene_manager_id,
            })
              .then((res) => {
                this.showMask = true;
                this.showMaskBtn = true;
                this.showProgress = false;
                this.showBtn = false;
                this.handleGetSceneData();
              })
              .catch((error) => {
                this.$message.error(error);
              });
          } else if (
            this.$route.query.page === 'red' ||
            this.$route.query.page === 'red-blue-student'
          ) {
            this.refreshProgress();
            // 红蓝关闭
            closeScene({ room_id: this.scene_manager_id }).then((res) => {
              this.showMask = true;
              this.showMaskBtn = true;
              this.showProgress = false;
              this.showBtn = false;
              this.handleGetSceneData();
            });
          } else {
            // 单兵关闭
            sceneClose({
              resource_id: this.scene_manager_id,
            })
              .then((res) => {
                this.showMask = true;
                this.showMaskBtn = true;
                this.showProgress = false;
                this.showBtn = false;
                this.handleGetSceneData();
              })
              .catch((error) => {
                this.$message.error(error);
              });
          }
        })
        .catch(() => {});
    },

    /**
     * 重启
     */
    nodeRestart(data) {
      const { id } = data;
      if (
        this.$route.query.page === 'team' ||
        this.$route.query.page === 'team-student'
      ) {
        // 团队重启
        nodeStartApi({
          node_id: id,
          resource_id: this.scene_manager_id,
        }).then((res) => {});
      } else if (
        this.$route.query.page === 'red' ||
        this.$route.query.page === 'red-blue-student'
      ) {
        // 红蓝重启
        restartNode({
          node_id: id,
          resource_id: this.scene_manager_id,
        }).then((res) => {});
      } else {
        // 单兵重启
        nodeRestart({
          node_id: id,
          resource_id: this.scene_manager_id,
        }).then((res) => {});
      }
    },

    /**
     * 重建
     */
    nodeRecreate(data) {
      const { id } = data;
      if (
        this.$route.query.page === 'team' ||
        this.$route.query.page === 'team-student'
      ) {
        // 团队重建
        nodeBuildApi({
          node_id: id,
          resource_id: this.scene_manager_id,
        }).then((res) => {});
      } else if (
        this.$route.query.page === 'red' ||
        this.$route.query.page === 'red-blue-student'
      ) {
        // 红蓝重建
        recreateNode({
          node_id: id,
          resource_id: this.scene_manager_id,
        }).then((res) => {});
      } else {
        // 单兵重建
        nodeRecreate({
          node_id: id,
          resource_id: this.scene_manager_id,
        }).then((res) => {});
      }
    },
    /**
     * 重新刷新进度条信息
     */
    refreshProgress() {
      this.progress.status = undefined;
      this.progress.progressInfo = '';
      this.progress.progressRate = 0;
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
  },
};
</script>

<style lang="scss" scoped></style>
