<template>
  <cb-dialog
    class="scene-dialog"
    :title="$t('m.scene')"
    :visible.sync="dialogScene"
    :before-close="beforeClose"
  >
    <div style="height: 700px; position: relative">
      <SceneAll
        ref="sceneAll"
        :crEventDatas="crEventData"
        :resourceId="resourceId"
        :lessonId="lessonId"
        :query-room-id="queryRoomId"
        @goIframe="gotoAccess"
      ></SceneAll>
    </div>
  </cb-dialog>
</template>

<script>
import { SceneEditor } from '@cyber/scene';
import SceneAll from './scene-all.vue';
export default {
  name: 'SceneDialog',
  components: {
    SceneEditor,
    SceneAll,
  },
  props: {
    crEventDatas: {
      type: Object,
      default: () => {},
    },
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: [],
        showToolbar: false,
      },
      // 进度条信息
      progress: {
        progressRate: 0,
        progressInfo: '',
      },
      showMask: true, // 场景蒙层

      sceneLoading: false, // 场景loading
      dialogScene: false,
      crEventData: {},
      resourceId: this.$route.params.course_id,
      lessonId: this.$route.params.lesson_id,
      queryRoomId: this.$route.query.roomId,
    };
  },
  computed: {
    topologyData() {
      if (this.crEventData && this.crEventData.scene_data) {
        this.showMask = false;
        this.$set(
          this.crEventData.scene_data,
          'scene_config',
          this.crEventData.scene_data.scene,
        );
        return this.crEventData.scene_data;
      }

      if (this.crEventData && this.crEventData.scene_config_data) {
        return this.crEventData.scene_config_data;
      }

      return null;
    },
  },
  watch: {
    crEventDatas: {
      handler(val, oldval) {
        if (val) {
          this.crEventData = val;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    gotoAccess(connection_url, access_modes, nodeId) {
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
            access_user_id: this.userId,
          },
          id: this.crEventData.scene_data.id,
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
    beforeClose() {
      this.$emit('before-close', 'scene');
      this.dialogScene = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.scene-dialog {
  ::v-deep .el-dialog {
    width: 940px;
    min-height: 612px;
    margin-right: 0;
    .cb-dialog-body {
      height: 100%;
    }
    .el-dialog__body {
      height: calc(100% - 101px);
    }
    ::v-deep .elc-scene-loader-container {
      height: 100% !important;
    }
  }
}
</style>
