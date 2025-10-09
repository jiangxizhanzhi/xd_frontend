<template>
  <!-- 场景录屏 -->
  <div
    class="console lay-com"
    v-if="page === 'range-test'"
    :style="'height:' + iframeHeight + 'px;width:' + iframeWidth + 'px'"
  >
    <iframe
      ref="testIframeConsole"
      :src="$route.query.connection_url"
      scrolling="auto"
      width="100%"
      height="100%"
      style="border: none"
    />
  </div>
  <div class="console lay-com" v-else>
    <splitpanes
      class="default-theme"
      @resize="resizeSplitPane"
      @resized="resizedSplitPane"
      :push-other-panes="false"
    >
      <pane min-size="25%" v-if="manual">
        <!-- 训练手册 -->

        <train-manual @close="handleCloseManual" :manual-data="manualData" />
      </pane>
      <pane min-size="25%">
        <div v-if="showFrameMask" class="frame-mask"></div>
        <cb-tabs
          type="card"
          class="scene-tabs"
          v-model="editableTabsValue"
          @tab-remove="removeTab"
        >
          <cb-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            :closable="item.closable"
            :title="item.title"
          >
            <div
              slot="label"
              :title="item.title"
              class="one-overflow"
              style="max-width: 358px"
            >
              {{ item.title }}
            </div>
            <node-frame
              :frame-url="item.content"
              :image-type="item.image_type"
              :protocol="item.protocol"
            >
            </node-frame>
          </cb-tab-pane>
        </cb-tabs>
      </pane>
    </splitpanes>
    <!-- 右边操作按钮 -->
    <div class="right-tool">
      <div
        class="right-tool-item"
        v-for="(item, index) in rightToolList"
        :key="item.id"
        :class="markStatus ? item.class : ''"
        @click="handleClick(item)"
        :id="index === 3 ? 'mark-icon' : ''"
      >
        <cb-iconfont :type="item.icon"></cb-iconfont>
        <span>{{ item.text }}</span>
      </div>
    </div>

    <!-- 操作说明 -->
    <instruction ref="istructionRef" @before-close="beforeClose" />
    <!-- 场景详情 -->
    <scene-detail
      ref="sceneRef"
      :resource-id="resource_id"
      @before-close="beforeClose"
    />
    <!-- 资产清单 -->
    <asset-list
      ref="assetRef"
      :resource-id="resource_id"
      @before-close="beforeClose"
      @connect="handleConnect"
    />
    <!-- 任务矩阵(单兵) -->
    <task-matrix
      v-if="page === 'single'"
      ref="taskRef"
      :show-submit-btn="show_submit_btn"
      :resource-id="resource_id"
      @before-close="beforeClose"
      @update="getInitData"
    />
    <!-- 任务矩阵(红蓝) -->
    <task-matrix-red-blue
      v-if="page === 'red-blue-student'"
      ref="taskRef"
      :resource-id="resource_id"
      :user-id="this.$route.query.user_id"
      @before-close="beforeClose"
    />
    <!-- 团队任务矩阵 -->
    <task-matrix-team
      v-if="page === 'team-student'"
      ref="taskRef"
      :resource-id="resource_id"
      :user-id="this.$route.query.user_id"
      @before-close="beforeClose"
    />
    <!--团队 新增标记 -->
    <team-add-tag
      v-if="page === 'team-student'"
      ref="tagRef"
      :resource-id="resource_id"
      @before-close="beforeClose"
    />
    <!-- @refreshTimeLine='refreshTimeLine' -->

    <!-- 红蓝 新增标记 -->
    <red-blue-add-tag
      v-if="page === 'red-blue-student'"
      ref="tagRef"
      :resource-id="resource_id"
      @before-close="beforeClose"
    />
    <Notice
      v-if="
        page === 'team' ||
        page === 'red' ||
        page === 'team-student' ||
        page === 'red-blue-student'
      "
      ref="noticeRef"
      :type="page"
      :resourceId="resource_id"
      :role="roleGroup"
    />
    <div class="char-box">
      <ChatTool
        v-if="page === 'red' || page === 'red-blue-student'"
        ref="charTool"
      />
      <ChatToolTeam
        v-else-if="page === 'team' || page === 'team-student'"
        ref="charToolTeam"
      />
    </div>
  </div>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import NodeFrame from './components/node-frame.vue';
import TopTool from './components/top-tool.vue';
import Instruction from './components/instruction.vue';
import SceneDetail from './components/scene-detail.vue';
import TrainManual from './components/train-manual.vue';
import AssetList from './components/asset-list.vue';
import TaskMatrix from './components/task-matrix.vue';
import TaskMatrixRedBlue from './components/task-matrix-red-blue.vue';
import TaskMatrixTeam from './components/task-matrix-team.vue'; //团队学员接入的任务矩阵
import teamAddTag from './components/team-add-tag.vue';
import redBlueAddTag from './components/red-blue-add-tag.vue';
import {
  trainManual,
  getConnection,
  singleDetail,
} from '@/api/web/single-train';
import { getMarkApi, getMarkCancelApi } from '@/api/web/team-training';
import {
  getRedBlueMatrixBadge,
  cancelRedBlueMatrixBadge,
} from '@/api/web/red-blue';
import Notice from '@/pages/web/notice/index.vue';
import ChatTool from '@/components/ChatTools/index.vue';
import ChatToolTeam from '@/components/ChatTools/index-team.vue';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
export default {
  name: 'ScreenRecording',
  components: {
    Splitpanes,
    Pane,
    NodeFrame,
    TopTool,
    Instruction,
    SceneDetail,
    TrainManual,
    AssetList,
    TaskMatrix,
    TaskMatrixRedBlue,
    teamAddTag,
    redBlueAddTag,
    Notice,
    ChatTool,
    ChatToolTeam,
    TaskMatrixTeam,
  },
  data() {
    return {
      cookie: '',
      markStatus: false,
      page: this.$route.query.page,
      show_submit_btn: false,
      resource_id: this.$route.query.resource_id,
      roleGroup: null,
      iframeHeight: '',
      iframeWidth: '',
      showFrameMask: false,
      manual: false,
      editableTabs: [],
      editableTabsValue: '',
      rightToolList: [
        {
          id: 'instruction',
          icon: 'icon-kechengguanli',
          text: this.$t('m.operatingInstructions'),
          class: '',
        },
        {
          id: 'topo',
          icon: 'icon-tuopubianpai',
          text: this.$t('m.TopologyDetails'),
          class: '',
        },
        {
          id: 'manual',
          icon: 'icon-jianda',
          text: this.$t('m.trainManual'),
          class: '',
        },
        {
          id: 'asset',
          icon: 'icon-kecheng',
          text: this.$t('m.assetList'),
          class: '',
        },
        {
          id: 'task',
          icon: 'icon-changjingmoban',
          text: this.$t('m.taskMatrix'),
          class: 'mark-style',
        },
        {
          id: 'tag',
          icon: 'icon-weishoucang',
          text: this.$t('m.addTags'),
          class: '',
        },
      ],
      manualData: [],
    };
  },

  watch: {
    '$route.query': {
      handler(val) {
        this.getTabList(val);
      },
      deep: true,
      immediate: true,
    },
    markStatus: {
      handler(val) {
        if (val) {
          document.getElementById('mark-icon').classList.add('mark-style');
        }
      },
      deep: true,
      immediate: true,
    },
  },

  created() {
    this.roleGroup = this.$route.query.role_group
      ? JSON.parse(this.$route.query.role_group)
      : null;
    if (this.page === 'team-student') {
      this.getTeamStatus();
    } else if (this.page === 'red-blue-student') {
      this.getRedBlueStatus();
    }
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.marketReportWs();
    if (this.page === 'single') {
      this.getInitData();
    }
    if (this.page === 'range-test') {
      this.$refs.testIframeConsole.focus();
      this.iframeHeight = document.documentElement.clientHeight;
      this.iframeWidth = document.documentElement.clientWidth;
    }
    // 添加监听浏览器窗口关闭的
    window.addEventListener('unload', (e) => this.recordScreen());
  },
  beforeDestroy() {
    window.removeEventListener('unload', (e) => this.recordScreen());
  },
  methods: {
    marketReportWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          if (data.code === 7) {
            // 更新任务矩阵红点
            this.markStatus = true;
            document.getElementById('mark-icon').classList.add('mark-style');
            if (this.page === 'red-blue-student') {
              // 刷新任务矩阵
              this.$refs.taskRef.taskRef.initData();
            }
          }
        },
      );
    },
    // 获取单兵数据
    getInitData() {
      singleDetail({
        resource_id: this.resource_id,
      }).then((res) => {
        if (res.data.data && res.data.data.show_submit_btn) {
          this.show_submit_btn = res.data.data.show_submit_btn;
        } else {
          this.show_submit_btn = false;
        }
      });
    },
    // 点击团队任务矩阵的标记红点状态取消
    cancelMark() {
      getMarkCancelApi({
        resource_id: this.resource_id,
      }).then((res) => {
        this.markStatus = false;
      });
    },
    // 获取团队任务矩阵的标记红点状态
    getTeamStatus() {
      getMarkApi({
        resource_id: this.resource_id,
      }).then((res) => {
        this.markStatus = res.data.data;
      });
    },
    // 获取红蓝任务矩阵的标记红点状态
    getRedBlueStatus() {
      getRedBlueMatrixBadge({
        resource_id: this.resource_id,
      }).then((res) => {
        this.markStatus = res.data.data;
      });
    },
    // 红蓝任务矩阵的标记红点状态取消
    cancelRedBlueMark() {
      cancelRedBlueMatrixBadge({
        resource_id: this.resource_id,
      }).then((res) => {
        this.markStatus = false;
      });
    },

    // 更新时间轴
    // refreshTimeLine(data){

    // },
    // 删除tab
    removeTab(targetName) {
      const filterData = _.filter(this.editableTabs, (item) => {
        return item.name === targetName;
      });
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.editableTabsValue = activeName;
            }
          }
        });
      }
      // if (this.$route.query.id === targetName) {
      //   // this.$message.warning('当前tab不能删除');
      // } else {
      if (
        !(
          filterData[0]?.protocol === 'http' ||
          filterData[0]?.protocol === 'https'
        )
      ) {
        this.recordScreen(filterData[0]);
      }
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      // }
    },
    // 获取当前tab
    getTabList(val) {
      const {
        page,
        nodeName,
        protocol,
        id,
        connection_url,
        image_type,
        node_id,
        connection_id,
      } = val;
      // 如果是从单兵进来的没有新增标记按钮传page=single，
      if (page === 'single') {
        this.rightToolList = this.rightToolList.slice(0, -1);
      } else if (page === 'red' || page === 'team') {
        // 如果是团队或者红蓝没有训练手册，管理员、导演、裁判、教员没有任务矩阵
        this.rightToolList = this.rightToolList.filter(
          (item) =>
            item.id !== 'manual' && item.id !== 'task' && item.id !== 'tag',
        );
      } else if (page === 'red-blue-student' || page === 'team-student') {
        // 学员没有训练手册
        this.rightToolList = this.rightToolList.filter(
          (item) => item.id !== 'manual',
        );
      }
      const loginInfo = {
        title: nodeName + '-' + protocol,
        name: id,
        content: connection_url,
        closable: true,
        connectionId: connection_id,
        nodeId: node_id,
        image_type,
        protocol: protocol,
      };
      this.editableTabs.push(loginInfo);
      this.editableTabsValue = id;
    },
    // 资产清单登录事件
    async handleConnect(data, node) {
      let connection_url = '';
      let connection_id = '';
      const { id, protocol, access_ip, access_port, path } = data;

      if (protocol === 'http' || protocol === 'https') {
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
            access_user_id: this.$route.query.user_id,
          },
          id: this.$route.query.scene_id,
          node_id: node.id,
        };
        await getConnection(params).then((res) => {
          connection_url = _.get(res, 'data.data.connection_url');
          connection_id = _.get(res, 'data.data.connection_id');
        });
        const loginInfo = {
          closable: true,
          content: connection_url,
          name: id || String(Math.ceil(Math.random() * 10)),
          connectionId: connection_id,
          nodeId: node.id,
          image_type: node.image_type,
          protocol: protocol,
          title: node.name + '-' + protocol,
        };
        const tabsFilter = _.findIndex(this.editableTabs, (item) => {
          return item.name === loginInfo.name;
        });
        if (tabsFilter > -1) {
          this.editableTabsValue = loginInfo.name;
        } else {
          this.editableTabs.push(loginInfo);
          this.editableTabsValue = loginInfo.name;
        }
      }
    },
    // 弹框关闭
    beforeClose(val) {
      this.rightToolList.map((item) => {
        if (item.id === val) {
          item.class = '';
        }
      });
    },
    // 右边按钮点击事件
    handleClick(data) {
      this.rightToolList.map((item) => {
        if (item.id === data.id) {
          item.class = 'active';
        } else {
          item.class = '';
        }
        if (item.id === 'tag') {
          if (this.page === 'team-student') {
            // 团队学员任务矩阵取消红点提示
            this.cancelMark();
          } else if (this.page === 'red-blue-student') {
            // 红蓝学员任务矩阵取消红点提示
            this.cancelRedBlueMark();
          }
        }
      });
      this.goDetail(data.id);
    },
    // 右侧按钮跳转不同详情
    goDetail(type) {
      if (type === 'instruction') {
        this.$refs.istructionRef.visible = true;
      }
      if (type === 'topo') {
        this.$refs.sceneRef.visible = true;
      }
      if (type === 'manual') {
        this.manual = true;
        this.getTrainManual();
      }
      if (type === 'asset') {
        this.$refs.assetRef.visible = true;
        this.getAssetList();
      }
      if (type === 'task') {
        this.$refs.taskRef.visible = true;
      }
      if (type === 'tag') {
        this.$refs.tagRef.visible = true;
      }
    },
    // 获取单兵训练手册数据
    getTrainManual() {
      const data = {
        resource_id: this.resource_id,
      };
      trainManual(data).then((res) => {
        this.manualData = _.get(res, 'data.data', []);
      });
    },
    // 获取单兵资产清单
    getAssetList() {
      const data = {};
      // assetList(data).then(res)=>{

      // }
    },
    // 关闭手册
    handleCloseManual() {
      this.manual = false;
    },
    resizeSplitPane() {
      if (!this.showFrameMask) {
        this.showFrameMask = true;
      }
    },
    resizedSplitPane() {
      this.showFrameMask = false;
    },
    // 关闭此窗口时录屏
    recordScreen(data) {
      this.$request
        .post(
          '/cscene/cscene_instances/disable_recording',
          {
            connection_id: data.connectionId || this.$route.query.connection_id,
            context: {
              access_user_id: this.$route.query.user_id,
              pass_through: {},
            },
            id: this.$route.query.scene_id,
            node_id: data.nodeId || this.$route.query.node_id,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.mark-style {
  position: relative;
  &:after {
    right: -4px;
    top: -2px;
    position: absolute;
    display: block;
    content: ' ';
    clear: both;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background: var(--red-color);
  }
}
.console {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: inherit;
  .right-tool {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 99;
    background: var(--bg-color-2);
    color: var(--neutral8);
    padding: 0 16px;
    margin-bottom: -20px;

    &-item {
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      margin: 20px 0;
      cursor: pointer;
      .cb-iconfont {
        color: var(--neutral8);
      }
      &:hover {
        color: var(--primary-color);
        .cb-iconfont {
          color: var(--primary-color);
        }
      }
    }
    .active {
      color: var(--primary-color);
      .cb-iconfont {
        color: var(--primary-color);
      }
    }
  }

  .frame-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1111;
    opacity: 0;
  }
}
</style>
<style lang="scss">
.scene-tabs {
  height: calc(100% - 28px);
  .el-tabs__header {
    width: calc(100% - 124px);
  }
  .el-tabs__item {
    height: 32px;
    line-height: 32px;
    padding: 0 16px !important;
    background: var(--bg-color-3) !important;
    border-radius: 4px;
  }
  .el-tabs__nav {
    display: flex;
  }
  .el-tabs__item.is-active {
    display: flex;
    align-items: center;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 32px;
    font-size: 14px;
    width: 25px;
    text-align: center;
    &:hover {
      color: var(--primary-color);
    }
  }
  .el-tabs {
    height: 100%;
    .el-tabs__content {
      height: 100%;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
  .el-tabs--card .el-tabs__item.is-active {
    background: var(--bg-color-4) !important;
  }
  .el-tabs__header {
    border-bottom: 1px solid transparent !important;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-left: 0;
    border-bottom: 0;
  }
  .el-tabs--card .el-tabs__nav {
    border: 0;
  }
  .el-tabs__nav-wrap.is-scrollable {
    padding: 0 25px;
  }
  .el-tabs__item .el-icon-close:hover {
    background-color: transparent;
    color: var(--primary-color);
  }
}
.splitpanes.default-theme .splitpanes__pane {
  background-color: var(--bg-color-2);
}
.splitpanes.default-theme .splitpanes__splitter {
  background-color: var(--neutral1);
  border-left: 1px solid transparent;
  margin-left: 0;
}
.splitpanes.default-theme .splitpanes__splitter:before,
.splitpanes.default-theme .splitpanes__splitter:after,
.splitpanes.default-theme .splitpanes__splitter:hover:before,
.splitpanes.default-theme .splitpanes__splitter:hover:after {
  background-color: var(--primary-color);
}
.xterm .xterm-viewport {
  display: none !important;
}
</style>
