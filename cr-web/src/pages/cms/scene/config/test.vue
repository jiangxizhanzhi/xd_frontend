<template>
  <div class="scene-config-test">
    <scene-editor
      ref="sceneEditor"
      :title="title"
      :sceneConfig="sceneConfig"
      :topologyData="sceneData"
      :show-mask="showMask"
      :progress="progress"
      :allow-dialog="false"
      :status="'display'"
      :show-label="false"
      :show-btn="showBtn"
      :show-mask-btn="showMaskBtn"
      :show-progress="showProgress"
      :progress-localize="progressLocalize"
      :stage-progress="stageProgress"
      :btn-config="btnGroupConfig"
      :showSnapShotBtn="false"
      :showSnapshotHistoryBtn="false"
      :open-layer="true"
      @onSceneStart="handleSceneStart"
      @onAccess="goIframe"
      @close="handleClosed"
      @on-node-restart="nodeRestart"
      @on-node-rebuild="nodeRecreate"
      @on-node-start="nodeStart"
      @on-node-shutdown="(data) => onNodeShutDown(data, sceneId)"
      @on-node-shutup="(data) => onNodeShutUp(data, sceneId)"
      @on-node-snapshot="saveSnapshot"
      @on-node-snapshot-history="snapshotCount"
      :mp-scene-id="sceneId"
      :ws-data="wsData"
      :node-link-connectivity-status="true"
      :scene-config-id="sceneId"
      :business_id="room_id"
    ></scene-editor>
    <snapshot-form-modal
      :sceneId="sceneId"
      :image_uuid="image_uuid"
      :nodeId="nodeId"
      :image_type="image_type"
      v-if="saveSnapshotBtn"
      :saveSnapshotBtn.sync="saveSnapshotBtn"
      ref="snapshotFormModal"
    />
    <!-- 快照历史弹框 -->
    <snapshot
      :topoId="topoId"
      :sceneId="sceneId"
      :nodeId="nodeId"
      :image_uuid="image_uuid"
      v-if="snapshotModalTrigger"
      ref="snapshotModal"
      :snapshot-modal-trigger="snapshotModalTrigger"
      @snapshot-hide="snapshotHide"
      @merge-snapshot="mergeSnapshot"
    />
  </div>
</template>

<script>
import { SceneEditor } from '@cyber/scene';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { handleWsData, getSceneStatus } from '@/utils/scene-websocket.js';
import { nodeRestart, nodeRecreate, nodeStart } from '@/utils/scene-actions';
import SnapshotFormModal from './SnapshotFormModal';
import Snapshot from './Snapshot';
import { mixins } from '@/mixin';

export default {
  name: 'SceneConfigTest',
  mixins: [mixins],
  components: {
    SceneEditor,
    SnapshotFormModal,
    Snapshot,
  },
  data() {
    return {
      socket: null,
      cookie: '',
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
      sceneLoading: false, // 场景loading

      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      btnGroupConfig: ['close'], // 按钮组配置项

      // 进度条的位置，与css样式中写的值同步
      progressLocalize: {
        width: '100%',
        left: '0px',
        bottom: '0px',
      },

      sceneEid: '',
      sceneId: '',
      topoId: '',
      saveSnapshotBtn: false,
      snapshotModalTrigger: false,
      nodeId: null,
      image_uuid: null,
      image_type: null,
      wsData: {},
      room_id: '',
      sceneConfigId: '',
    };
  },
  computed: {},
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.title = this.$route.query && this.$route.query.title;
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getSceneConfig();
    this.bindSceneWs(this.id);
  },
  methods: {
    /* 节点接入 */
    goIframe(connection_url, access_modes, nodeId, image_type, nodeName, jump_type, vendor, type) {
      const { id, protocol, access_ip, access_port, path } = access_modes;
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
              name: 'scene-screen-recording-cms',
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
      }
    },

    /* 获取场景数据 */
    getSceneConfig() {
      this.$request
        .get(
          '/admin/ceBase/crEvents/testScene',
          { resource_id: this.id },
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
          this.stageProgress = status.stageProgress;
          // 接口返回场景sceneId(mp_scene_id)
          this.sceneId = _.get(res, 'data.data.mp_scene_id', '') || '';
          // this.sceneEid = _.get(res, 'data.data.scene_data.topology.scene.eid', '') || '';
          // 接口返回场景topoId(topo_id)
          this.topoId = _.get(res, 'data.data.topo_id', '') || '';
          this.room_id = _.get(res, 'data.data.room_id', '') || '';
        });
    },

    /* 启动场景 */
    handleSceneStart() {
      if (_.isEmpty(this.id)) {
        return;
      }
      this.refreshProgress();
      /* this.bindSceneWs(this.id); */
      this.$request
        .post(
          '/admin/ceBase/crEvents/testScene',
          { business_template_id: this.id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          /* 启动场景成功后要再调用获取场景的数据，拿到scene_id */
          this.getSceneConfig();
        });
    },

    /* 关闭场景 */
    handleClosed() {
      //单兵,团队,红蓝测试关闭场景
      if (_.isEmpty(this.id)) {
        return;
      }
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
            '/admin/ceBase/crEvents/testScene',
            { business_template_id: this.id },
            { baseURL: '/api/ojj' },
          )
          .then((_) => {
            this.showMask = true;
            this.showMaskBtn = true;
            this.showProgress = false;
            this.showBtn = false;
            this.sceneData = {};
            this.getSceneConfig();
          });
      });
    },

    /* 重启 */
    nodeRestart(data) {
      const { id } = data;
      nodeRestart(this.id, id);
    },

    /* 重建 */
    nodeRecreate(data) {
      const { id } = data;
      nodeRecreate(this.id, id);
    },

    /* 部分节点启动 */
    nodeStart(data) {
      const { id } = data;
      nodeStart(this.id, id);
    },

    /* 保存快照 */
    saveSnapshot(data) {
      this.saveSnapshotBtn = true;
      const { id, image_type, image_uuid } = data;
      this.nodeId = id;
      this.image_type = image_type;
      this.image_uuid = image_uuid;
    },

    /* 历史版本 */
    snapshotCount(data) {
      const { id, image_uuid } = data;
      this.nodeId = id;
      this.image_uuid = image_uuid;
      this.snapshotModalTrigger = true;
    },

    /* 合并快照弹框剔除 */
    snapshotHide(value) {
      this.snapshotModalTrigger = value;
    },

    mergeSnapshot() {
      this.snapshotModalTrigger = false;
    },

    /* 刷新进度条状态 */
    refreshProgress() {
      this.progress.status = undefined;
      this.progress.progressInfo = '';
      this.progress.progressRate = 0;
    },

    /* ws请求 */
    bindSceneWs() {
      this.socket && this.socket.close();
      this.socket = wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.id}&token=${this.cookie}`,
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
<style lang="scss" scoped>
.scene-config-test {
  position: relative;
  height: 800px;
  .bottom-btn {
    margin-top: -50px;
    margin-left: 20px;
    position: absolute;
    z-index: 10;
  }
}
</style>
