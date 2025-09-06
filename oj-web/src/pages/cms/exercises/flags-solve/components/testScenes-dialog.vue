<template>
  <div class="scenes-content-cyScene">
    <scene-editor
      ref="sceneEditor"
      :title="title"
      :sceneConfig="sceneConfig"
      :topologyData="sceneData"
      :show-mask="showMask"
      :show-mask-btn="showMaskBtn"
      :progress="progress"
      :show-progress="showProgress"
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
        v-if="sceneData.scene_share_mode === SCENE.SHAREMODEL.PRIVATE"
        :src="privateimg"
      />
      <img
        v-else-if="sceneData.scene_share_mode === SCENE.SHAREMODEL.SHARED"
        :src="shared"
      />
      <img
        v-else-if="sceneData.scene_share_mode === SCENE.SHAREMODEL.GROUP"
        :src="group"
      />
      <span v-if="sceneData.scene_share_mode === SCENE.SHAREMODEL.PRIVATE">{{
        $t('scene.privateScene')
      }}</span>
      <span
        v-else-if="sceneData.scene_share_mode === SCENE.SHAREMODEL.SHARED"
        >{{ $t('scene.sharedScene') }}</span
      >
      <span v-else-if="sceneData.scene_share_mode === SCENE.SHAREMODEL.GROUP">{{
        $t('scene.groupScene')
      }}</span>
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
import { DEVICE, SCENE, SCENE_STATUS } from '../../exercise-constants.js';
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
  components: {
    SceneEditor,
    CyTimeCountdown,
  },
  props: {
    taskResourceId: {
      type: String,
      default: '',
    },
    shareMode: {
      type: Number,
      default: '',
    },
  },
  data() {
    return {
      cookie: '',
      DEVICE,
      SCENE,
      privateimg,
      shared,
      group,
      crEventData: null,
      websocketKey: '',
      connection: null,
      title: '',
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: [],
        showToolbar: false,
      },
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      showMask: true, // 场景蒙层
      sceneData: {}, // 场景数据
      wsData: {},
    };
  },

  computed: {
    btnGroupConfig() {
      // 按钮组配置项
      return ['close', 'recover'];
    },
  },

  watch: {
    taskResourceId: {
      handler(val, oldval) {
        this.getSceneTopology();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.cookie = document.cookie.split('cr_jwttoken=')[1];
    this.cookie = utils.getCookie('cr_jwttoken');
    this.bindSceneWs();
  },
  beforeDestroy() {
    if (this.connection) {
      this.connection.close();
    }
  },
  created() {},
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
    clearWebsocket() {
      if (this.connection) {
        this.connection.close();
        this.connection = null;
      }
    },
    // 暂停恢复场景
    updateScene(val) {
      // 恢复状态传1  暂停状态传3
      const status = val ? SCENE_STATUS.PAUSE : SCENE_STATUS.RECOVERY;
      this.$request
        .patch(
          '/oj/admin/practice/operation/scene_update_status',
          {
            resource_id: this.taskResourceId,
            status: status,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {});
    },
    createScene() {
      this.refreshProgress();
      this.$request
        .post(
          '/oj/admin/practice/operation/start_scene',
          {
            resource_id: this.taskResourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((data) => {
          this.crEventData.scene_data = data;
          // this.websocketKey = data.websocket_key;
          this.getSceneTopology();
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
          '/oj/admin/practice/operation/delete_scene',
          {
            resource_id: this.taskResourceId,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.crEventData.scene_data = null;
          this.getSceneTopology();
          this.showMask = true;
          this.showMaskBtn = true;
          this.showProgress = false;
          this.showBtn = false;
          return false;
        });
    },
    // 获取场景数据
    getSceneTopology() {
      this.$request
        .get(
          '/oj/admin/practice/operation/scene_topo',
          {
            resource_id: this.taskResourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          this.crEventData = resp.data.data;
          if (this.crEventData.scene_data) {
            this.$set(
              this.crEventData.scene_data,
              'scene_config',
              this.crEventData.scene_data.scene,
            );
            this.title = this.crEventData.scene_data.scene.topology.scene.name;
            // this.websocketKey =
            //   this.crEventData.scene_config_data.websocket_key;
          } else if (this.crEventData.scene_config_data) {
            // this.sceneData = resp.data.scene_config_data;
            this.title =
              resp.data.data.scene_config_data.scene_config.topology.scene.name;
            // this.websocketKey =
            //   this.crEventData.scene_config_data.websocket_key;
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
              '/oj/admin/practice/operation/delete_scene',
              {
                resource_id: this.taskResourceId,
              },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              this.crEventData.scene_data = null;
              this.getSceneTopology();
              this.showMask = true;
              this.showMaskBtn = true;
              this.showProgress = false;
              this.showBtn = false;
              return false;
            });
        })
        .catch(() => {});
    },

    /**
     * 重启
     */
    restartDevice(node) {
      this.$request
        .post(
          '/oj/admin/practice/operation/scene_node_restart',
          {
            node_id: node.id,
            resource_id: this.taskResourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          return false;
        });
    },

    /**
     * 重建
     */
    recreateDevice(node) {
      this.$request
        .post(
          '/oj/admin/practice/operation/scene_node_recreate',
          {
            node_id: node.id,
            resource_id: this.taskResourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          return false;
        });
    },

    bindSceneWs() {
      this.connection = wsutil.cbind(
        `/ojj/ws/oj/operation/scene?practice_id=${this.taskResourceId}&shared=${this.shareMode}&from_web=false&token=${this.cookie}`,
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
            this.getSceneTopology();
          },
          // 删除同步
          'OJ-2': (data) => {
            this.getSceneTopology();
          },
          // 启动完成
          'OJ-3': (data) => {
            this.getSceneTopology();
          },
        },
      );
    },
  },
};
</script>
<style lang="scss">
.scenes-content-cyScene {
  .elc-scene-loader-container .helper .rt-control-btns .dele-btn {
    background-color: var(--primary-color);
  }
  .bottom-btn {
    margin-top: -50px;
    margin-left: 20px;
    position: absolute;
  }
}

.scenes-content-cyScene {
  height: 620px;
  position: relative;
}
</style>
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
