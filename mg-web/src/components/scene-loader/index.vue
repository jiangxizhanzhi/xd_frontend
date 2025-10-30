<template>
  <div class="scene-loader" v-loading="loading">
    <div v-if="notStartMsg" class="not-start-msg">
      {{ $t('components.sceneLoader.notStart') }}
    </div>
    <scene-editor
      v-if="sceneData"
      :key="sceneContentKey"
      ref="sceneEditorRef"
      :title="title"
      :scene-config="baseStatus"
      :topology-data="sceneData"
      :show-mask="showMask"
      :progress="progress"
      :progress-localize="progressLocalize"
      :stage-progress="stageProgress"
      :show-label="false"
      :show-title="showTitle"
      :show-btn="!player && showBtn"
      :show-mask-btn="!player && showMaskBtn"
      :show-progress="showProgress"
      :btn-config="btnConfigComputed"
      :show-node-btn="!player && showNodeBtnComputed"
      :show-access-login="showAccessLogin"
      :allow-dynamic-delete-node="false"
      :show-shut-down-and-up-btn="false"
      :hide-useless-port-in-access-dialog="hideUselessPortInAccessDialog"
      @on-scene-start="sceneStart"
      @on-access="access"
      @close="sceneClose"
      @recover="recover"
      @on-node-restart="nodeRestart"
      @on-node-rebuild="nodeRebuild"
      :ws-data="wsData"
      status="display"
    >
    </scene-editor>
  </div>
</template>

<script>
import { eventConst, statusConst } from './constant';
import { SceneEditor } from '@cyber/scene';
import { ws } from '@cyber/helper';

import _ from 'lodash';

export default {
  name: 'SceneLoader',
  components: {
    SceneEditor,
  },
  props: {
    title: String,
    btnConfig: {
      type: Array,
      default: () => [],
    },
    player: {
      type: Boolean,
      default: false,
    },
    //AD通用 300
    //运维赛 301
    //解题赛 302
    //攻防赛 303
    //渗透赛 304
    reference: {
      type: String,
      default: '300',
    },
    // 是否请求connection接口
    requestConnection: {
      type: Boolean,
      default: true,
    },
    showAccessLogin: {
      type: Boolean,
      default: true,
    },
    hideUselessPortInAccessDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      eventConst,
      statusConst,
      accessMap: {},
      accessCacheFlag: false,
      sceneId: '',
      loading: true,
      showMask: true,
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条

      baseStatus: {
        menubar: [],
        showMenu: false,
        toolbar: [],
        showToolbar: false,
      },
      // 进度条信息
      progress: {
        progressRate: 0,
        progressInfo: '',
        status: undefined,
      },
      // 进度条的位置，与css样式中写的值同步
      progressLocalize: {
        width: '100%',
        left: '0px',
        bottom: '0px',
      },
      sceneData: null,
      socket: null,
      sceneContentKey: 0,
      resizeHandler: null,
      wsData: {},
      /* 5.4.1新加的阶段进度 */
      stageProgress: {
        stageList: [],
        stageName: '',
        stagePercentage: 0,
      },
    };
  },
  computed: {
    notStartMsg() {
      return (
        !this.loading && this.player && this.showMask && !this.showProgress
      );
    },
    btnConfigComputed() {
      if (!_.isEmpty(this.btnConfig)) {
        return this.btnConfig;
      }
      const result = [];
      if (this.$listeners && this.$listeners.close) {
        result.push('close');
      }
      if (this.$listeners && this.$listeners.recover) {
        result.push('recover');
      }
      return result;
    },
    showNodeBtnComputed() {
      if (
        this.$listeners &&
        this.$listeners.restart &&
        this.$listeners.rebuild
      ) {
        return true;
      } else {
        return false;
      }
    },
    showTitle() {
      return Boolean(this.title);
    },
    showBtn() {
      // 是否显示按钮组
      return this.progress.status === 'exception' || !this.showMask;
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.closeWs();
  },
  methods: {
    /**
     * @method initSceneData
     * @description: 初始化场景
     * @param {response,wsConfig} wsConfig:{
        url: '',
        config: {},
      },
     */
    initSceneData(res, wsConfig) {
      this.accessCacheFlag = false;
      wsConfig && this.bindWs(wsConfig);
      res && this.getSceneData(res);
      this.loading = false;
    },
    hideMask() {
      this.showMask = false;
      this.showMaskBtn = false;
      this.showProgress = false;
    },
    setEmpty() {
      this.strategy('empty')();
    },
    sceneStart() {
      this.$emit('start', () => {
        this.strategy('start')();
      });
    },
    sceneClose() {
      this.$confirm(this.$t('components.sceneLoader.closeSceneConfirm'), '', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            this.$emit('close', () => {
              done();
              instance.confirmButtonLoading = false;
            });
            setTimeout(() => {
              done();
              instance.confirmButtonLoading = false;
            }, 1000);
          } else {
            done();
          }
        },
      }).catch(() => {});
    },
    bindWs(config) {
      this.socket = ws(
        config.url,
        (res) => {
          this.handleWsData(res);
        },
        config.config,
      );
    },
    handleWsData(res) {
      let data = res;
      if (!_.isPlainObject(res)) {
        data = JSON.parse(res);
      }
      // console.log('ws', data);
      const scene = data.data.scene || {};

      if (data.type === 'scene_element') {
        this.wsData = data.data;
        this.updateNodesInstance(data.data);
      }
      // 更新场景状态
      if (data.type === 'scene') {
        this.stageProgress = {
          stageList: scene.stage_list,
          stageName: scene.stage_name,
          stagePercentage: scene.stage_percentage,
        };
        const csceneId = _.get(data, 'data.cscene_id');
        const { event, event_status, progress_percentage } = scene;
        // console.log('ws event', eventConst[event], event);
        // console.log('ws event_status', statusConst[event_status], event_status);
        if (event !== eventConst.close) {
          //非关闭的推送消息才更新场景id
          csceneId && (this.sceneId = csceneId);
          console.log('update scene id', csceneId);
        }
        const result = this.sceneStatusHandler(
          event,
          event_status,
          progress_percentage,
          csceneId,
        );
        if (!result) {
          return;
        }
        this.$set(this.sceneData.scene_config.topology, 'scene', scene); //更新场景自己进度信息
        console.log('progress_percentage', progress_percentage);
      }
      // 更新节点状态
      // if (data.type === 'scene_element') {
      //   const element = data.data;
      //   this.updateNodesInstance(element);
      // }
    },

    updateNodesInstance(element) {
      const sceneElement = element.scene_element;
      const { event, event_status } = sceneElement;
      console.log('element event', eventConst[event], event);
      console.log(
        'element event_status',
        statusConst[event_status],
        event_status,
      );
      let key = 'other';
      if (
        [eventConst.recreate].includes(event) &&
        event_status === statusConst.complete
      ) {
        key = 'recreate';
      }
      const id = sceneElement.id;
      const pluginData = element.scene_element_plugin_data.cpcloud;
      const portData = element.scene_element_port_plugin_data.cpcloud;

      const update = {
        elements: { [id]: pluginData },
        element_ports: portData,
      };

      console.log('element update');

      // 原节点数据组
      const originElement = _.get(
        this.sceneData,
        'scene_config.topology.elements',
        [],
      );
      // 更新节点数据
      originElement.some((ele) => {
        if (ele.id === id) {
          _.merge(ele, sceneElement);
          return true;
        }
      });

      const originPluginData = _.get(
        this.sceneData,
        `scene_config.plugins.cpcloud`,
        {},
      );

      _.merge(originPluginData, update);
      this.nodeStrategy(key)();
      console.log('element data updated', originPluginData);
    },

    getSceneData(data) {
      const sceneData = _.get(data, 'data.scene_config') || {};
      this.sceneId = sceneData.id;
      const sceneInstance = sceneData.scene; //实例

      if (!sceneInstance || _.isEmpty(sceneInstance)) {
        //未启动
        this.strategy('close')();
        this.sceneData = sceneData;
      } else {
        const scene = _.get(sceneInstance, 'topology.scene') || {};
        const { event, event_status, progress_percentage } = scene;

        this.sceneStatusHandler(event, event_status, progress_percentage, '');
        this.sceneData = {
          scene_config: sceneInstance,
        };
        this.stageProgress = {
          stageList: scene.stage_list,
          stageName: scene.stage_name,
          stagePercentage: scene.stage_percentage,
        };
      }
    },
    closeWs() {
      this.socket && this.socket.close();
    },
    recover(bool) {
      this.$emit('recover', bool, () => {});
    },
    access(path, accessMode, nodeId) {
      console.log('access', accessMode, nodeId);
      const accessList = this.accessMap[nodeId] || [];
      const connectionUrl = (
        _.find(accessList, { access_mode_id: accessMode.id }) || {}
      ).connection_url;
      if (!connectionUrl) {
        console.log('error: no connection_url');
        return;
      }
      console.log('connection_url', connectionUrl);
      const newWindow = window.top.open(connectionUrl, '_blank');
      newWindow && (newWindow.opener = null);
      this.$emit('access', connectionUrl, accessMode, nodeId);
    },
    getAccessConnection() {
      if (this.accessCacheFlag) {
        // 避免ws推送多次成功消息，导致请求多次接口
        return;
      }
      this.accessCacheFlag = true;
      this.$request
        .get(
          `/public/service/scene/${this.sceneId}/connections/`,
          {
            reference: this.reference,
          },
          { baseURL: '/api/vuln' },
        )
        .then((res) => {
          this.accessMap = _.get(res, 'data.data');
        })
        .finally(() => {
          this.accessCacheFlag = false;
        });
    },
    nodeRestart(data) {
      this.accessCacheFlag = false;
      this.$emit('restart', data);
    },
    nodeRebuild(data) {
      this.accessCacheFlag = false;
      this.$emit('rebuild', data);
    },
    nodeStrategy(key) {
      const list = {
        recreate: () => {
          this.requestConnection && this.getAccessConnection();
        },
        other: () => {},
      };
      console.log('node strategy', key);
      return list[key] || list['other'];
    },
    strategy(key) {
      const list = {
        start: () => {
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          this.progress = {
            progressRate: 0,
            progressInfo: '',
            status: undefined,
          };
          _.set(
            this.sceneData,
            'scene_config.topology.scene.process_message',
            '',
          );
        },
        close: () => {
          this.progress.status = undefined;
          this.showMask = true;
          this.showMaskBtn = true;
          this.showProgress = false;
          this.accessCacheFlag = false;
        },
        success: () => {
          this.progress.status = 'success';
          this.showMask = false;
          this.showMaskBtn = false;
          this.showProgress = false;
          this.requestConnection && this.getAccessConnection();
          this.$emit('success');
        },
        exception: () => {
          this.progress.status = 'exception';
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
        },
        other: () => {
          this.progress.status = undefined;
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
        },
        empty: () => {
          this.sceneData = {};
          this.loading = false;
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = false;
        },
      };
      console.log('strategy', key);
      return list[key] || list['other'];
    },
    sceneStatusHandler(event, status, percentage = 0, sceneId) {
      if (sceneId && sceneId !== this.sceneId) {
        console.log('非匹配消息', sceneId, event, status);
        return false;
      }
      let key = 'other';
      if (
        [eventConst.create, eventConst.recover, eventConst.resume].includes(
          event,
        ) &&
        status === statusConst.complete
      ) {
        key = 'success';
      } else if (status === statusConst.failed) {
        key = 'exception';
      } else if (
        event === eventConst.close &&
        status === statusConst.complete
      ) {
        key = 'close';
      }
      this.strategy(key)();
      this.$emit('change', { key, event, status, percentage });
      this.progress.progressRate = percentage;
      this.showProgress &&
        (this.progress.progressInfo = this.getEventMessage(event, status));
      return true;
    },
    getEventMessage(event, status) {
      if (!event && !status) {
        return undefined;
      }
      return `${event && eventConst[event]}${status && statusConst[status]}`;
    },

    forceRefreshScene() {
      this.sceneContentKey = this.sceneContentKey + 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.scene-loader {
  width: 100%;
  height: 100%;
  position: relative;
  .not-start-msg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    font-size: 16px;
    font-weight: 400;
    color: var(--neutral5);
  }
}
</style>
