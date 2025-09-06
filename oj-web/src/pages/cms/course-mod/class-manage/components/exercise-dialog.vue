<template>
  <div class="scenes-content-cyScene">
    <scene-editor
      ref="sceneEditor"
      :title="title"
      :sceneConfig="sceneConfig"
      :topologyData="sceneData"
      :show-mask="showMask"
      :show-mask-btn="showMaskBtn"
      :show-progress="showProgress"
      :progress="progress"
      :progress-localize="progressLocalize"
      :stage-progress="stageProgress"
      :allow-dialog="false"
      :showTitle="false"
      :showLabel="false"
      :show-btn="showBtn"
      :btn-config="btnGroupConfig"
      status="display"
      @onSceneStart="createScene"
      @onAccess="goIframe"
      @close="deleteScene"
      @recover="updateScene"
      @on-node-restart="restartDevice"
      @on-node-rebuild="recreateDevice"
      @on-node-shutdown="(data) => onNodeShutDown(data, sceneData.id)"
      @on-node-shutup="(data) => onNodeShutUp(data, sceneData.id)"
      :ws-data="wsData"
    ></scene-editor>
    <div v-if="sceneData.scene_share_mode" class="scene-desc">
      <img
        v-if="
          sceneData.scene_share_mode === $CONSTANT.SCENE.SHARE_MODEL.PRIVATE
        "
        :src="privateimg"
      />
      <img
        v-else-if="
          sceneData.scene_share_mode === $CONSTANT.SCENE.SHARE_MODEL.SHARED
        "
        :src="shared"
      />
      <img
        v-else-if="
          sceneData.scene_share_mode === $CONSTANT.SCENE.SHARE_MODEL.GROUP
        "
        :src="group"
      />
      <span
        v-if="
          sceneData.scene_share_mode === $CONSTANT.SCENE.SHARE_MODEL.PRIVATE
        "
        >{{ $t('scene.privateScene') }}</span
      >
      <span
        v-else-if="
          sceneData.scene_share_mode === $CONSTANT.SCENE.SHARE_MODEL.SHARED
        "
        >{{ $t('scene.sharedScene') }}</span
      >
      <span
        v-else-if="
          sceneData.scene_share_mode === $CONSTANT.SCENE.SHARE_MODEL.GROUP
        "
        >{{ $t('scene.groupScene') }}</span
      >
    </div>
    <div class="scene-time">
      <cy-time-countdown
        v-if="sceneData.remaining_time"
        :second="sceneData.remaining_time"
        :status="sceneData.status"
        @countdownOver="countdownOver"
      />
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import Constant from '../../course-constant.js';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { SceneEditor } from '@cyber/scene';
import privateimg from '@/assets/scene/img/private.png';
import shared from '@/assets/scene/img/shared.png';
import group from '@/assets/scene/img/group.png';
import CyTimeCountdown from '@/components/time-countdown/index';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import { mixins } from '@/mixin';
export default {
  mixins: [mixins],
  components: { SceneEditor, CyTimeCountdown },
  props: {
    queryScenes: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      cookie: '',
      privateimg,
      shared,
      group,
      crEventData: null,
      websocketKey: '',
      title: '',
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: [],
        showToolbar: false,
      },
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      wsData: {},
    };
  },
  computed: {
    $CONSTANT() {
      // common下的
      return Constant;
    },
    btnGroupConfig() {
      // 按钮组配置项
      return ['close', 'recover'];
    },
    breadList: {
      get() {
        return [
          {
            title: this.$t('m.course'),
            path: '/course',
          },
          {
            title: this.lessonName,
            path: this.lessonPath,
          },
          {
            title: this.$t('m.Overview'),
          },
        ];
      },
    },
    topologyData() {
      if (this.crEventData && this.crEventData.scene_data) {
        return this.crEventData.scene_data;
      }
      if (this.crEventData && this.crEventData.scene_config_data) {
        return this.crEventData.scene_config_data.topology_config;
      }
      return null;
    },
  },

  watch: {},
  mounted() {},

  created() {
    /* this.cookie = document.cookie.split('cr_jwttoken=')[1]; */
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getScene_topology(1);
  },
  beforeDestroy() {
    if (this.connection) {
      this.connection.close();
    }
  },
  methods: {
    goIframe(connection_url, access_modes, nodeId) {
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
          id: this.sceneData.id,
          node_id: nodeId,
        };
        this.$request
          .post('/cscene/cscene_instances/get_connection', params, {
            baseURL: '/api/mp',
          })
          .then((res) => {
            const connection_url = _.get(res, 'data.data.connection_url', '');
            window.open(connection_url, '_blank');
          });
      }
    },
    // 获取场景数据
    getScene_topology(flag) {
      this.$request
        .get(
          '/oj/admin/lesson/scene_topo',
          {
            resource_id: this.queryScenes.lesson_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.crEventData = res.data.data;
          if (this.crEventData.scene_data) {
            this.$set(
              this.crEventData.scene_data,
              'scene_config',
              this.crEventData.scene_data.scene,
            );
            this.title = this.crEventData.scene_data.scene.topology.scene.name;
            this.websocketKey =
              this.crEventData.scene_config_data.websocket_key;
          } else if (this.crEventData.scene_config_data) {
            this.title =
              res.data.data.scene_config_data.scene_config.topology.scene.name;
            this.websocketKey =
              this.crEventData.scene_config_data.websocket_key;
          }
          const status = getSceneStatus(this.crEventData);
          this.showMask = status.showMask;
          this.showMaskBtn = status.showMaskBtn;
          this.showProgress = status.showProgress;
          this.showBtn = status.showBtn;
          this.sceneData = status.sceneData;
          this.progress = status.progress;
          this.stageProgress = status.stageProgress;
        });
      if (flag == 1) {
        this.bindSceneWs();
      }
    },

    clearWebsocket() {
      if (this.connection) {
        this.connection.close();
        this.connection = null;
      }
    },

    /**
     * 启动场景
     */
    createScene() {
      this.refreshProgress();
      this.$request
        .post(
          '/oj/admin/lesson/start_scene',
          {
            resource_id: this.queryScenes.lesson_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.crEventData.scene_data = _.get(res, 'data.data');
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          return false;
        });
    },

    countdownOver() {
      this.refreshProgress();
      this.$request
        .delete(
          '/oj/admin/lesson/delete_scene',
          {
            resource_id: this.queryScenes.lesson_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.crEventData.scene_data = null;
          this.getScene_topology();
          this.showMask = true;
          this.showMaskBtn = true;
          this.showProgress = false;
          this.showBtn = false;
          return false;
        });
    },

    deleteScene() {
      this.refreshProgress();
      this.$confirm(
        this.$t('scene.confirmDeleteScene') + '？',
        this.$t('common.info'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        },
      )
        .then(() => {
          this.$request
            .delete(
              '/oj/admin/lesson/delete_scene',
              {
                resource_id: this.queryScenes.lesson_id,
              },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              this.crEventData.scene_data = null;
              this.getScene_topology();
              this.showMask = true;
              this.showMaskBtn = true;
              this.showProgress = false;
              this.showBtn = false;
              return false;
            });
        })
        .catch(() => {});
    },
    // 暂停恢复场景
    updateScene(val) {
      const status = val
        ? this.$CONSTANT.SCENE_STATUS.RECOVERY
        : this.$CONSTANT.SCENE_STATUS.PAUSE;
      this.$request
        .patch(
          '/oj/admin/lesson/update_status',
          {
            resource_id: this.queryScenes.lesson_id,
            status: status,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {});
    },

    /**
     * 重启
     */
    restartDevice(node) {
      this.$request
        .post(
          '/oj/admin/lesson/node_restart',
          {
            resource_id: this.queryScenes.lesson_id,
            node_id: node.id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          return false;
        });
    },

    /**
     * 重建
     */
    recreateDevice(node) {
      this.$request
        .post(
          '/oj/admin/lesson/node_recreate',
          {
            resource_id: this.queryScenes.lesson_id,
            node_id: node.id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          return false;
        });
    },

    bindSceneWs() {
      this.connection = wsutil.cbind(
        `/ojj/ws/course/lesson_scene?lesson_id=${
          this.queryScenes.lesson_id
        }&shared=${this.queryScenes.share_mode != 1}&from_web=false&token=${
          this.cookie
        }`,
        {
          1: (data) => {
            if (data.type === 'scene_element') {
              this.wsData = data.data;
            }
            const wsData = handleWsData(
              data,
              this.progress,
              this.stageProgress,
              this.sceneData,
            );
            if (wsData) {
              this.showMask = wsData.showMask;
              this.showMaskBtn = wsData.showMaskBtn;
              this.showProgress = wsData.showProgress;
              this.showBtn = wsData.showBtn;
            }
            const scene = data.data.scene;
            if (data.type === 'scene') {
              if (scene.event === 6 || scene.event === 7) {
                if (scene.event_status === 4 || scene.event_status === 2) {
                  if (scene.event === 6) {
                    this.sceneData.status = 3; // 暂停倒计时
                  } else if (scene.event === 7) {
                    this.sceneData.status = 1; // 恢复倒计时
                  }
                }
              }
            }
          },
          // 启动同步
          'OJ-1': (data) => {
            this.getScene_topology();
          },
          // 删除同步
          'OJ-2': (data) => {
            this.getScene_topology();
          },
          // 启动完成
          'OJ-3': (data) => {
            this.getScene_topology();
          },
        },
      );
    },
  },
};
</script>
<style lang="scss">
.scene-desc {
  position: absolute;
  z-index: 0;
  top: 20px;
  left: 17px;
  min-width: 160px;
  height: 36px;
  line-height: 34px;
  text-align: center;
  padding: 0 15px;
  &::before {
    position: absolute;
    content: '';
    inset: 0;
    background: var(--primary-color);
    opacity: 0.1;
  }
  img {
    vertical-align: middle;
    margin-right: 10px;
  }
  span {
    vertical-align: middle;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: var(--primary-color);
  }
}
.scene-time {
  position: absolute;
  top: 20px;
  right: 25px;
  z-index: 22;
}
</style>

<style lang="scss">
.scenes-content-cyScene {
  position: relative;
  .elc-scene-loader-container .helper .rt-control-btns .dele-btn {
    background-color: var(--primary-color);
    color: var(--font-color-third);
  }
  .bottom-btn {
    margin-top: -50px;
    margin-left: 20px;
    position: absolute;
  }
  .elc-scene-loader-container .helper .mask {
    background-color: var(--bg-color-secondary) !important;
    opacity: 0.5;
  }
  .elc-scene-loader-container .helper .node-info {
    color: var(--font-color-primary);
  }
}
</style>
<style lang="scss">
.scenes-content-cyScene {
  height: 620px;
  .elc-scene-loader-container .helper .rt-control-btns .dele-btn {
    cursor: pointer;
    position: relative;
    width: 130px;
    height: 42px;
  }
}
</style>
