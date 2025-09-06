<template>
  <div class="operation-question">
    <div class="toolbar" v-if="showScene">
      <scene-editor
        ref="sceneEditor"
        :title="content"
        :sceneConfig="sceneConfig"
        :topologyData="sceneData"
        :show-mask="showMask"
        :show-mask-btn="showMaskBtn"
        :show-progress="showProgress"
        :progress="progress"
        :progress-localize="progressLocalize"
        :stage-progress="stageProgress"
        :showTitle="false"
        :showLabel="false"
        :allow-dialog="false"
        :status="'display'"
        :show-btn="showBtn"
        :btn-config="btnGroupConfig"
        @onSceneStart="createScene"
        @onAccess="goIframe"
        @close="deleteScene"
        @recover="updateScene"
        @on-node-restart="restartDevice"
        @on-node-rebuild="recreateDevice"
        @on-node-shutdown="(data) => onNodeShutDown(data, sceneData.id)"
        @on-node-shutup="(data) => onNodeShutUp(data, sceneData.id)"
        :ws-data="wsData"
      >
      </scene-editor>
      <ScenePattern
        v-if="sceneData && sceneData.scene_share_mode"
        :topologyData="sceneData"
      />
      <div class="scene-time">
        <cy-time-countdown
          v-if="sceneData && sceneData.remaining_time"
          :second="sceneData.remaining_time"
          :status="sceneData.status"
          @countdownOver="countdownOver"
        />
      </div>
    </div>
    <div class="answer">
      <span class="replay-span">{{ $t('m.examAnswer') }}:</span>
      <cy-textarea-flag
        class="message-info elc-input"
        :disabled="isSolved"
        type="text"
        v-model="operationAnswer"
        @change="itemChange"
      ></cy-textarea-flag>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import $Constant from '@/constants';
import Constant from '@/constants';
import statusBtn from '@/components/button/status-btn.vue';
import { SceneEditor } from '@cyber/scene';
import private2 from '@/assets/scene/img/private.png';
import shared from '@/assets/scene/img/shared.png';
import group from '@/assets/scene/img/group.png';
import cyTimeCountdown from '@/components/scene-related/index';
import ScenePattern from '@/components/scene-related/scene-pattern.vue';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import { SCENE_STATUS } from '@/pages/web/course/constant.js';
import { mixins } from '@/mixin';

export default {
  name: 'Operation',
  mixins: [mixins],
  components: {
    statusBtn,
    SceneEditor,
    cyTimeCountdown,
    ScenePattern,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
    examResource: {
      type: String,
      default: '',
    },
    crEventDatas: {
      type: Object,
      default: null,
    },
    exerciseId: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    lessonId: {
      type: String,
      default: '',
    },
    shareMode: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const that = this;
    return {
      cookie: '',
      crEventData: this.crEventDatas,
      private2,
      shared,
      group,
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: [],
        showToolbar: false,
      },
      showMask: true, // 场景蒙层
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close', 'recover'],
      operationAnswer: '',
      websocketKey: '',
      connection: null,
      showScene: true,
      sceneData: {}, // 场景数据
      wsData: {},
    };
  },
  computed: {
    $CONSTANTS() {
      // 当前app下的
      return $Constant;
    },
    $CONSTANT() {
      // common下的
      return Constant;
    },
    topologyData: {
      get: function () {
        if (this.crEventData && this.crEventData.scene_data) {
          this.$set(
            this.crEventData.scene_data,
            'scene_config',
            this.crEventData.scene_data.scene,
          );
        }
        return this.crEventData;
      },
      set: function (val) {
        this.topologyData = val;
      },
    },
  },
  watch: {
    topologyData: {
      handler(val, oldval) {
        if (val) {
          const status = getSceneStatus(val);
          this.showMask = status.showMask;
          this.showMaskBtn = status.showMaskBtn;
          this.showProgress = status.showProgress;
          this.showBtn = status.showBtn;
          this.sceneData = status.sceneData;
          this.progress = status.progress;
          this.stageProgress = status.stageProgress;
        }
      },
      immediate: true,
      deep: true,
    },
    value: {
      handler(val, oldval) {
        this.operationAnswer = val;
      },
      immediate: true,
      deep: true,
    },
    crEventData: {
      handler(val, oldval) {
        if (val) {
          if (val.topo_id) {
            this.showScene = true;
          } else {
            this.showScene = false;
          }
        } else {
          this.showScene = false;
        }
        if (val !== null) {
          if (JSON.stringify(val) !== JSON.stringify(oldval)) {
            this.websocketKey = '';
            if (val && val.scene_config_data) {
              this.websocketKey = val.scene_config_data.websocket_key;
            }
            // if (val && val.scene_data && val.scene_data.websocket_key) {
            //   this.websocketKey = val.scene_data.websocket_key
            // }
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeDestroy() {
    this.clearWebsocket();
  },
  mounted() {
    this.clearWebsocket();
    /* this.cookie = document.cookie.split('cr_jwttoken=')[1]; */
    this.cookie = utils.getCookie('cr_jwttoken');
    this.bindSceneWs();
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
    itemChange(val) {
      this.operationAnswer = val;
      //第三个参数 1 代表实操题
      this.$emit('sendOperation', this.operationAnswer, this.exerciseId, 5, 1);
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
          '/oj/lesson/practice/start_scene',
          {
            lesson_id: this.lessonId,
            practice_id: this.exerciseId,
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

    updateScene(val) {
      // 正常状态传 2 暂停状态传3
      const status = val ? SCENE_STATUS.RECOVERY : SCENE_STATUS.PAUSE;
      this.$request
        .patch(
          '/oj/lesson/practice/update_status',
          {
            lesson_id: this.lessonId,
            practice_id: this.exerciseId,
            status: status,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          return false;
        });
    },

    countdownOver() {
      this.refreshProgress();
      this.$request
        .delete(
          '/oj/lesson/practice/delete_scene',
          {
            lesson_id: this.lessonId,
            practice_id: this.exerciseId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.showMask = true;
          this.crEventData.scene_data = null;
          this.showMask = true;
          this.showMaskBtn = true;
          this.showProgress = false;
          this.showBtn = false;
          return false;
        });
    },

    /**
     * 关闭场景
     */
    deleteScene() {
      this.$confirm(
        this.$t('scene.confirmDeleteScene') + '？',
        this.$t('common.info'),
        {
          type: 'warning',
        },
      )
        .then(() => {
          this.refreshProgress();
          this.$request
            .delete(
              '/oj/lesson/practice/delete_scene',
              {
                lesson_id: this.lessonId,
                practice_id: this.exerciseId,
              },
              {
                baseURL: '/api/ojj',
              },
            )
            .then((res) => {
              this.showMask = true;
              this.crEventData.scene_data = null;
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
     * 节点重启
     */
    restartDevice(node) {
      this.$request
        .post(
          '/oj/lesson/practice/node_restart',
          {
            lesson_id: this.lessonId,
            practice_id: this.exerciseId,
            node_id: node.id,
          },
          {
            baseURL: '/api/ojj',
          },
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
          '/oj/lesson/practice/node_recreate',
          {
            lesson_id: this.lessonId,
            practice_id: this.exerciseId,
            node_id: node.id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          return false;
        });
    },

    getSceneCommon() {
      this.$request
        .get(
          '/oj/lesson/practice/scene_topo',
          {
            lesson_id: this.lessonId,
            practice_id: this.exerciseId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          Object.assign(this.crEventData, res.data.data);
        });
    },

    bindSceneWs() {
      this.connection = wsutil.cbind(
        `/ojj/ws/course/lesson/operation/scene?lesson_id=${this.lessonId}&practice_id=${this.exerciseId}&shared=${this.shareMode}&from_web=true&token=${this.cookie}`,
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
            this.getSceneCommon();
          },
          // 删除同步
          'OJ-2': (data) => {
            this.getSceneCommon();
          },
          // 启动完成
          'OJ-3': (data) => {
            this.getSceneCommon();
          },
        },
      );
    },
  },
};
</script>
<style lang="scss" scoped>
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
.bottom-btn {
  margin-top: -50px;
  margin-left: 20px;
  position: absolute;
}
</style>
<style scoped lang="scss">
.operation-question {
  position: relative;
  .toolbar {
    height: 500px;
    position: relative;
  }
  .answer {
    display: flex;
    padding: 20px 0 23px;
    .replay-span {
      height: 40px;
      line-height: 40px;
      margin-right: 10px;
    }
    .message-info {
      width: 100%;
    }
    .sub-bt {
      margin-left: 20px;
    }
    ::v-deep .el-input {
      height: 36px;
      border-radius: 2px;
      .el-input__inner {
        border-radius: 2px;
      }
    }
  }
}
</style>
