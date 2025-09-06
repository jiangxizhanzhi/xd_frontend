<template>
  <div style="height: 100%; position: relative">
    <scene-editor
      ref="sceneEditor"
      :title="crEventData.name"
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
    <div v-if="queryRoomId && !crEventData.scene_data" class="to-start">
      <cb-button>{{ $t('scene.sceneToBeStarted') }}</cb-button>
    </div>
  </div>
</template>
<script>
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { SceneEditor } from '@cyber/scene';
import ScenePattern from '@/components/scene-related/scene-pattern.vue';
import { SHARE_MODEL, SCENE_STATUS } from '@/pages/web/course/constant.js';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import { mixins } from '@/mixin';
export default {
  mixins: [mixins],
  components: {
    SceneEditor,
    ScenePattern,
  },
  props: {
    crEventDatas: {
      type: Object,
      default: () => {},
    },
    resourceId: {
      type: [String, Number],
      default: '',
    },
    lessonId: {
      type: [String, Number],
      default: '',
    },
    queryRoomId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      cookie: '',
      SHARE_MODEL,
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        // toolbar: [],
        // showToolbar: false,
        //拓扑区域一键居中按钮
        toolbar: ['restore'],
        showToolbar: true,
      },
      showMask: true, // 场景蒙层
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      sceneData: {}, // 场景数据
      crEventData: this.crEventDatas,
      wsData: {},
      group_id: '',
      connection: null,
      learnedType: '',
    };
  },
  computed: {
    btnGroupConfig() {
      // 按钮组配置项
      if (this.sceneData.scene_share_mode === this.SHARE_MODEL.GROUP) {
        return [];
      }
      return ['close', 'recover'];
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
          this.showMaskBtn = this.queryRoomId ? false : status.showMaskBtn;
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
  },
  mounted() {
    this.learnedType = this.queryRoomId ? 1 : 0;
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getLessonInfo();
  },
  beforeDestroy() {
    this.clearWebsocket();
  },
  methods: {
    clearWebsocket() {
      if (this.connection) {
        this.connection.close();
        this.connection = null;
      }
    },
    goIframe(val, access_modes, nodeId) {
      this.$emit('goIframe', val, access_modes, nodeId);
    },

    /**
     * 启动场景
     */
    createScene() {
      this.refreshProgress();
      this.$request
        .post(
          '/oj/lesson/start_scene',
          {
            resource_id: this.lessonId,
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
      // 1是启动 3是暂停
      const status = val ? SCENE_STATUS.RECOVERY : SCENE_STATUS.PAUSE;
      this.$request
        .patch(
          '/oj/lesson/update_status',
          {
            resource_id: this.lessonId,
            status: status,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {});
      // // 正常状态传 2 暂停状态传3
    },

    /**
     * 删除场景
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
              '/oj/lesson/delete_scene',
              {
                resource_id: this.lessonId,
              },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              this.showMask = true;
              this.showMaskBtn = true;
              this.showProgress = false;
              this.showBtn = false;
              this.crEventData.scene_data = null;
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
          '/oj/lesson/node_restart',
          {
            resource_id: this.lessonId,
            node_id: node.id,
            room_id: this.queryRoomId || '',
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
          '/oj/lesson/node_recreate',
          {
            resource_id: this.lessonId,
            node_id: node.id,
            room_id: this.queryRoomId || '',
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          return false;
        });
    },
    // 获取课时详情信息
    getLessonInfo() {
      const params = {
        course_id: this.resourceId,
        lesson_id: this.lessonId,
        room_id: this.queryRoomId || '',
        learned_type: this.learnedType,
      };
      this.$request
        .get('/oj/lesson', params, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const backupData = _.get(res, 'data.data', {}) || {};
          this.group_id = backupData.group_id || '';
          this.bindSceneWs();
        });
    },
    getSceneCommon() {
      this.$request
        .get(
          'oj/lesson/scene_topo',
          {
            resource_id: this.lessonId,
            room_id: this.queryRoomId || '',
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.crEventData = _.get(res, 'data.data');
        });
    },

    bindSceneWs() {
      let url = '';
      if (this.group_id != '') {
        if (this.queryRoomId) {
          url = `/ojj/ws/oj/classroom/group/scene?group_id=${this.group_id}&token=${this.cookie}`;
        }
      } else {
        url = `/ojj/ws/course/lesson_scene?lesson_id=${this.lessonId}&shared=${
          this.crEventData.scene_share_mode != 1
        }&from_web=true&token=${this.cookie}`;
      }
      this.connection = wsutil.cbind(url, {
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
      });
    },
  },
};
</script>
<style scoped lang="scss">
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
  z-index: 22;
}
</style>
