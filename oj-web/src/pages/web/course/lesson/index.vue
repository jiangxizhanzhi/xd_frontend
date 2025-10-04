<template>
  <cb-inner-page :background="false">
    <div class="lesson-box">
      <div class="lesson-box-header">
        <div class="tool-box">
          <tool @tab-change="tabChange" :lesson-data="lessonInfo"></tool>
        </div>
      </div>
      <div class="lesson-content">
        <div class="single-box" v-if="isSingle">
          <div class="common-link" id="scene" v-if="sceneData">
            <cb-collapse
              class="elc-collapse"
              v-model="scene"
              @change="collapseScene"
            >
              <cb-collapse-item name="scene">
                <template slot="title">
                  <cb-iconfont
                    type="icon-arrow_down"
                    size="18"
                    v-if="activeScene"
                  />
                  <cb-iconfont type="icon-arrow_right1" size="18" v-else />
                  <span>{{ $t('m.scene') }}</span>
                </template>
                <div
                  v-if="activeScene"
                  class="single-scene-box"
                  style="height: 770px; position: relative"
                >
                  <scene-editor
                    v-if="refresh"
                    ref="sceneEditor"
                    :title="lessonName"
                    :sceneConfig="sceneConfig"
                    :topologyData="sceneData"
                    :show-mask="showMask"
                    :progress="progress"
                    :showTitle="false"
                    :showLabel="false"
                    :allow-dialog="false"
                    :status="'display'"
                    :show-btn="showBtn"
                    :show-mask-btn="showMaskBtn"
                    :show-progress="showProgress"
                    :btn-config="btnGroupConfig"
                    @onSceneStart="createScene"
                    @onAccess="goIframe"
                    @close="deleteScene"
                    @recover="updateScene"
                    @on-node-restart="restartDevice"
                    @on-node-rebuild="recreateDevice"
                    @on-node-shutdown="
                      (data) => onNodeShutDown(data, sceneData.id)
                    "
                    @on-node-shutup="(data) => onNodeShutUp(data, sceneData.id)"
                    :ws-data="wsData"
                    :center-content="true"
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
                  <div
                    v-if="queryRoomId && !crEventData.scene_data"
                    class="to-start"
                  >
                    <cb-button>{{ $t('scene.sceneToBeStarted') }}</cb-button>
                  </div>
                </div>
              </cb-collapse-item>
            </cb-collapse>
          </div>
          <div class="common-link" id="guide" v-if="showGuideSingle">
            <cb-collapse
              class="elc-collapse"
              v-model="guide"
              @change="collapseGuide"
            >
              <cb-collapse-item name="guide">
                <template slot="title">
                  <cb-iconfont
                    type="icon-arrow_down"
                    size="18"
                    v-if="activeGuide"
                  />
                  <cb-iconfont type="icon-arrow_right1" size="18" v-else />
                  <span v-if="lessonInfo.type === LESSON_TYPE.THEORY">{{
                    $t('m.lecture')
                  }}</span>
                  <span v-else>{{ $t('m.guide') }}</span>
                </template>
                <div style="height: auto">
                  <template v-if="lessonInfo.handout_type == 1">
                    <cb-markdown
                      v-model="lessonInfo.handout_url"
                      type="viewer"
                    ></cb-markdown>
                  </template>
                  <template v-else>
                    <guide
                      :is-single="isSingle"
                      :frame-url="lessonInfo.handout_url"
                    ></guide>
                  </template>
                </div>
              </cb-collapse-item>
            </cb-collapse>
          </div>
          <div class="common-link" id="video" v-if="lessonInfo.video_url">
            <cb-collapse
              class="elc-collapse"
              v-model="video"
              @change="collapseVideo"
            >
              <cb-collapse-item name="video"
                ><template slot="title">
                  <cb-iconfont
                    type="icon-arrow_down"
                    size="18"
                    v-if="activeVideo"
                  />
                  <cb-iconfont type="icon-arrow_right1" size="18" v-else />
                  <span>{{ $t('m.video') }}</span></template
                >
                <div style="height: auto">
                  <video-view
                    :is-single="isSingle"
                    :frame-url="lessonInfo.video_url"
                    :check-points="videoCheckPoints"
                    :business-id="lessonInfo.resource_id"
                  ></video-view>
                </div>
              </cb-collapse-item>
            </cb-collapse>
          </div>
          <div class="common-link" id="message">
            <cb-collapse
              class="elc-collapse"
              v-model="message"
              @change="collapseMessage"
            >
              <cb-collapse-item name="message"
                ><template slot="title">
                  <cb-iconfont
                    type="icon-arrow_down"
                    size="18"
                    v-if="activeMessage"
                  />
                  <cb-iconfont type="icon-arrow_right1" size="18" v-else />
                  <span>{{ $t('m.leaveMessage') }}</span></template
                >
                <div class="single-leave-message-box">
                  <leave-message
                    :comment-type="COMMENT_TYPE.LESSON"
                    :comments="comments"
                    @sendComment="sendComment"
                    @subLike="sendLike"
                  ></leave-message>
                </div>
              </cb-collapse-item>
            </cb-collapse>
          </div>
        </div>
        <div class="double-box" v-else>
          <splitpanes
            class="default-theme"
            @resize="resizeSplitPane"
            @resized="resizedSplitPane"
            :push-other-panes="false"
          >
            <pane v-if="doubleGuide" min-size="25%">
              <div
                v-if="doubleGuide"
                class="double-guide"
                :class="
                  doubleGuide && (doubleScene || doubleVideo)
                    ? 'right-double-box'
                    : 'all-double-box'
                "
              >
                <template v-if="lessonInfo.handout_type == 1">
                  <CbMarkdown
                    v-model="lessonInfo.handout_url"
                    type="viewer"
                  ></CbMarkdown>
                </template>
                <template v-else>
                  <div v-if="showFrameMask" class="frame-mask"></div>
                  <guide
                    v-if="doubleGuide"
                    :is-single="isSingle"
                    :frame-url="lessonInfo.handout_url"
                  ></guide>
                </template>
              </div>
            </pane>
            <pane v-if="doubleVideo" min-size="25%">
              <div
                v-if="doubleVideo"
                :class="
                  doubleVideo && (doubleGuide || doubleScene)
                    ? 'right-double-box'
                    : 'all-double-box'
                "
              >
                <video-view
                  v-if="doubleVideo"
                  :is-single="isSingle"
                  :frame-url="lessonInfo.video_url"
                  :check-points="videoCheckPoints"
                  :business-id="lessonInfo.resource_id"
                ></video-view>
              </div>
            </pane>
            <pane v-if="doubleScene" min-size="25%">
              <div
                v-if="doubleScene"
                :class="
                  doubleScene && (doubleGuide || doubleVideo)
                    ? 'right-double-box'
                    : 'all-double-box'
                "
                class="scene-wrapper"
              >
                <div
                  class="scene-btn-fake"
                  :class="[
                    editableTabsValue === 'scene'
                      ? 'scene-btn-fake-current'
                      : 'scene-btn-fake-other',
                  ]"
                  @click="currentScene"
                >
                  <cb-iconfont type="icon-tuopu" size="14" class="icon-tuopu" />
                  <span v-if="editableTabsValue === 'scene'">
                    {{ $t('course.topologyLesson') }}
                  </span>
                  <span v-else>{{ $t('course.backScene') }}</span>
                </div>

                <cb-tabs
                  v-if="editableTabs.length > 0"
                  v-model="editableTabsValue"
                  type="card"
                  @tab-remove="removeTab"
                  class="scene-tabs"
                  :class="
                    editableTabsValue === 'scene'
                      ? 'current-scene'
                      : 'current-no-scene'
                  "
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
                    <div class="node-frame-wrapper-box">
                      <div v-if="showFrameMask" class="frame-mask"></div>
                      <NodeFrame
                        :frameUrl="item.content"
                        :scene-data="sceneData"
                        :node-id="item.nodeId"
                        :scene-id="sceneData && sceneData.id"
                        :protocol="item.protocol"
                        :image-type="item.imageType"
                        :pos="pos"
                        :text="text"
                      />
                    </div>
                  </cb-tab-pane>
                </cb-tabs>
                <div
                  class="scene-wrapper-box"
                  v-if="editableTabsValue === 'scene'"
                  :class="editableTabs.length === 0 ? 'no-tabs' : 'have-tabs'"
                  :style="{
                    top: editableTabs.length === 0 ? '0px' : '31px',
                  }"
                >
                  <scene-editor
                    v-if="refresh"
                    ref="sceneEditor"
                    :title="lessonName"
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
                    :showCurrentPageBtn="true"
                    @onSceneStart="createScene"
                    @onAccess="goIframe"
                    @close="deleteScene"
                    @recover="updateScene"
                    @on-node-restart="restartDevice"
                    @on-node-rebuild="recreateDevice"
                    @on-node-shutdown="
                      (data) => onNodeShutDown(data, sceneData.id)
                    "
                    @on-node-shutup="(data) => onNodeShutUp(data, sceneData.id)"
                    :ws-data="wsData"
                    :center-content="true"
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
                  <div
                    v-if="queryRoomId && !crEventData.scene_data"
                    class="to-start"
                  >
                    <cb-button>{{ $t('scene.sceneToBeStarted') }}</cb-button>
                  </div>
                </div>
              </div>
            </pane>
          </splitpanes>
        </div>
      </div>
    </div>
    <div class="right-navigation">
      <right-navigation
        ref="rightNavigation"
        :lesson-data="lessonInfo"
        :single-status="isSingle"
        :is-living="showWatchLiveBtn"
        :living-status="livingStatus"
        @change-nav="changeNav"
        @single-change-nav="singleChangeNav"
      ></right-navigation>
    </div>
    <instruction-dialog
      ref="instructionDialog"
      @before-close="beforeClose"
    ></instruction-dialog>
    <my-notes-dialog
      ref="myNotes"
      @before-close="beforeClose"
    ></my-notes-dialog>
    <experiment-report
      ref="experimentReport"
      @before-close="beforeClose"
      @pos="getPos"
    ></experiment-report>
    <leave-message-dialog
      ref="leaveMessage"
      :comment-type-dialog="COMMENT_TYPE.LESSON"
      :coure-name="courseName"
      :lesson-name="lessonName"
      @before-close="beforeClose"
    ></leave-message-dialog>
    <annex-dialog
      ref="annexDialog"
      :annex-list="lessonInfo.lesson_file"
      @before-close="beforeClose"
    ></annex-dialog>
    <watch-live
      ref="liveDialog"
      :rtcUrl="rtcUrl"
      @before-close="beforeClose"
    ></watch-live>
<!--    <div class="char-box" v-if="roomId">-->
<!--      <chat-tool ref="charTool" :roomId="roomId" />-->
<!--    </div>-->
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import Tool from './components/tool.vue';
import RightNavigation from './components/right-navigation';
import MyNotesDialog from './components/my-notes-dialog';
import ExperimentReport from './components/experiment-report';
import LeaveMessageDialog from './components/leave-message-dialog';
import LeaveMessage from '@/components/leave-message/index';
import Guide from './components/guide';
import VideoView from './components/video';
import AnnexDialog from './components/annex-dialog';
// import chatTool from '@/components/chat-tools/index.vue';
import InstructionDialog from './components/instruction-dialog';
import { mixins } from '@/mixin';
import {
  LESSON_TYPE,
  COMMENT_TYPE,
  SHARE_MODEL,
  SCENE_STATUS,
} from '@/pages/web/course/constant.js';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import { setBreadcrumbTitle } from '@cyber/ui';
import { SceneEditor } from '@cyber/scene';
import cyTimeCountdown from '@/components/scene-related/index';
import ScenePattern from '@/components/scene-related/scene-pattern.vue';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import NodeFrame from './components/node-frame.vue';
import watchLive from './components/live';
import { getPublishUrl } from '../../../../api/course';
export default {
  mixins: [mixins],
  components: {
    Tool,
    RightNavigation,
    MyNotesDialog,
    ExperimentReport,
    LeaveMessageDialog,
    LeaveMessage,
    Guide,
    AnnexDialog,
    VideoView,
    SceneEditor,
    cyTimeCountdown,
    ScenePattern,
    // chatTool,
    Splitpanes,
    Pane,
    NodeFrame,
    InstructionDialog,
    watchLive,
  },
  data() {
    return {
      videoCheckPoints: [], // 视频播放检查点
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      theme: 'dark',
      group_id: '',
      cookie: '',
      LESSON_TYPE,
      COMMENT_TYPE,
      SHARE_MODEL,
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        //拓扑区域一键居中按钮
        toolbar: ['restore'],
        showToolbar: true,
        // toolbar: [],
        // showToolbar: false,
      },
      showMask: true, // 场景蒙层
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      sceneLoading: false, // 场景loading
      crEventData: null,
      isScroller: false,
      isSingle: false,
      doubleScene: false,
      doubleGuide: false,
      doubleVideo: false,
      activeScene: false, // 单屏选中的状态
      activeGuide: false,
      activeVideo: false,
      activeMessage: true,
      showGuideSingle: false, // 单屏时是否有指导
      scene: 'scene',
      guide: 'guide',
      video: 'video',
      message: 'message',
      comments: [],
      isShowDialog: false,
      dialogContent: '',
      dialogType: '',
      resourceId: '',
      lessonId: '',
      lessonInfo: {},
      lessonName: '',
      courseName: '',
      lessonPath: '',
      connection: null,
      sceneData: {}, // 场景数据
      userId: this.$store.state.user.id,
      roomId: '',
      wsData: {},
      queryRoomId: '', // 从个人中心进入课时加的限制
      learnedType: '',
      showFrameMask: false, // 用于拖拽时，frame卡顿问题
      editableTabsValue: 'scene',
      editableTabs: [],
      refresh: true,
      pos: {},
      text: '',
      liveWs: null,
      showWatchLiveBtn: false, // 右边菜单是否展示直播按钮
      rtcUrl: '', // 直播链接
      livingStatus: false, // 是否是观看直播状态
    };
  },
  computed: {
    btnGroupConfig() {
      // 按钮组配置项
      if (
        this.sceneData != null &&
        this.sceneData &&
        this.sceneData.scene_share_mode === this.SHARE_MODEL.GROUP
      ) {
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
          this.showMaskBtn = this.$route.query.room_id
            ? false
            : status.showMaskBtn;
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

    $route: function (to, from) {
      // 执行数据更新查询
      this.resourceId = this.$route.params && this.$route.params.resource_id;
      this.lessonId = this.$route.params && this.$route.params.lesson_id;
      this.queryRoomId = this.$route.query && this.$route.query.room_id;
      this.learnedType = this.queryRoomId ? 1 : 0;
      this.getLessonInfo();
    },
    isSingle: {
      handler(val, oldval) {
        if (val) {
          this.getLeaveMessage();
          if (val !== oldval) {
            this.getTopologyData();
          }
        }
      },
      immediate: true,
      deep: true,
    },
    doubleScene: {
      handler(val, oldval) {
        if (val !== oldval && val) {
          this.getTopologyData(false);
        }
      },
      immediate: true,
      deep: true,
    },
    activeScene: {
      handler(val, oldval) {
        if (val) {
          this.scene = 'scene';
        } else {
          this.scene = '';
        }
      },
      immediate: true,
      deep: true,
    },
    activeGuide: {
      handler(val, oldval) {
        if (val) {
          this.guide = 'guide';
        } else {
          this.guide = '';
        }
      },
      immediate: true,
      deep: true,
    },
    activeVideo: {
      handler(val, oldval) {
        if (val) {
          this.video = 'video';
        } else {
          this.video = '';
        }
      },
      immediate: true,
      deep: true,
    },
    activeMessage: {
      handler(val, oldval) {
        if (val) {
          this.message = 'message';
        } else {
          this.message = '';
        }
      },
      immediate: true,
      deep: true,
    },
    editableTabsValue: {
      handler(val, oldVal) {
        if (val === 'scene' && oldVal && oldVal !== 'scene') {
          this.getTopologyData(false, true);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    //绑定事件
    window.addEventListener('beforeunload', (e) => this.clearWebsocket());
    this.resourceId = this.$route.params && this.$route.params.resource_id;
    this.lessonId = this.$route.params && this.$route.params.lesson_id;
    this.queryRoomId = this.$route.query && this.$route.query.room_id;
    this.learnedType = this.queryRoomId ? 1 : 0;
    this.getLessonInfo();
  },
  beforeDestroy() {
    this.listen.destroyListen();
    this.clearWebsocket();
    //卸载事件
    window.removeEventListener('beforeunload', (e) => this.clearWebsocket());
  },
  mounted() {
    this.listenFunc();
    this.listen.createListen();
    this.cookie = utils.getCookie('cr_jwttoken');
    if (this.$route.query?.room_id && !this.liveWs) {
      this.bindLiveWs();
      this.getLiveStatus();
    }
  },
  methods: {
    getLiveStatus() {
      getPublishUrl({ room_id: this.$route.query?.room_id }).then((res) => {
        this.showWatchLiveBtn = res?.data?.data?.on_live;
        if (res?.data?.data?.on_live) {
          this.rtcUrl =
            window.location.protocol + '//' + res?.data?.data?.url || '';
        }
      });
    },
    getPos(pos, text) {
      this.pos = pos;
      this.text = text;
    },
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.theme = 'dark';
      } else {
        this.theme = 'light';
      }
    },
    currentScene() {
      this.editableTabsValue = 'scene';
    },
    removeTab(targetName) {
      const filterData = _.filter(this.editableTabs, (item) => {
        return item.name === targetName;
      });
      if (
        !(
          filterData[0]?.protocol === 'http' ||
          filterData[0]?.protocol === 'https'
        )
      ) {
        // 不是http https ，关掉时需调录屏接口
        this.$request
          .post(
            '/cscene/cscene_instances/disable_recording',
            {
              connection_id: filterData[0]?.conId,
              context: {
                access_user_id: this.$store.state.user.id,
                pass_through: {},
              },
              id: this.sceneData.id,
              node_id: filterData[0]?.nodeId,
            },
            {
              baseURL: '/api/mp',
            },
          )
          .then((res) => {});
        this.removeTabCom(targetName);
      } else {
        this.removeTabCom(targetName);
      }
    },
    removeTabCom(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      if (targetName === activeName) {
        this.editableTabsValue = 'scene';
      } else {
        this.editableTabsValue = activeName;
      }
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
    resizeSplitPane($event) {
      if (
        (this.doubleGuide && this.lessonInfo.handout_type != 1) ||
        (this.doubleScene && this.editableTabs.length > 0)
      ) {
        if (!this.showFrameMask) {
          this.showFrameMask = true;
        }
      }
    },
    resizedSplitPane($event) {
      this.$nextTick(() => {
        if (this.doubleScene && this.$refs.sceneEditor) {
          this.$refs.sceneEditor.resizeScene();
        }
        if (
          (this.doubleGuide && this.lessonInfo.handout_type != 1) ||
          (this.doubleScene && this.editableTabs.length > 0)
        ) {
          this.showFrameMask = false;
        }
      });
    },
    goIframe(val, access_modes, nodeId, image_type, nodeName, jump_type) {
      const { id, protocol, access_ip, access_port, path } = access_modes;
      // 判断tabs里是有 当前登录信息
      const tabsFilter = _.findIndex(this.editableTabs, (item) => {
        return item.name === id;
      });
      if (protocol === 'http' || protocol === 'https') {
        let connection_url = '';
        if (!!path) {
          connection_url = `${protocol}://${access_ip}:${access_port}${path}`;
        } else {
          connection_url = `${protocol}://${access_ip}:${access_port}`;
        }
        if (jump_type === 'current') {
          this.tabsPush(
            tabsFilter,
            id,
            nodeName,
            protocol,
            connection_url,
            nodeId,
            image_type,
          );
        } else {
          window.open(connection_url, '_blank');
        }
      } else {
        this.$request
          .post(
            '/cscene/cscene_instances/get_connection',
            {
              access_mode_id: access_modes.id,
              context: {
                access_user_id: this.$store.state.user.id,
              },
              id: this.sceneData.id,
              node_id: nodeId,
            },
            {
              baseURL: '/api/mp',
            },
          )
          .then((res) => {
            const url = this.$router.resolve({
              name: 'ojweb-course-console',
              params: {
                id: this.resourceId,
                course_id: this.resourceId,
                lesson_id: this.lessonId,
              },
              query: {
                type: 'web',
                url: _.get(res, 'data.data.connection_url'),
                nodeId: nodeId,
                conId: _.get(res, 'data.data.connection_id'),
                id: this.sceneData.id,
                user_id: this.$store.state.user.id,
                coureName: this.courseName,
                lessonName: this.lessonName,
                roomId: this.queryRoomId,
                image_type: image_type,
                group_id: this.group_id,
                protocol,
              },
            });
            if (jump_type === 'current') {
              this.tabsPush(
                tabsFilter,
                id,
                nodeName,
                protocol,
                _.get(res, 'data.data.connection_url'),
                nodeId,
                _.get(res, 'data.data.connection_id'),
                image_type,
              );
            } else {
              window.open(url.href, '_blank');
            }
          });
      }
    },
    tabsPush(
      tabsFilter,
      id,
      nodeName,
      protocol,
      contentUrl,
      nodeId,
      conId,
      imageType,
    ) {
      const oneLogin = {
        title: nodeName + '-' + protocol,
        name: id,
        content: contentUrl,
        closable: true,
        nodeId: nodeId,
        protocol: protocol,
        conId: conId,
        imageType: imageType,
      };

      if (tabsFilter > -1) {
        this.editableTabsValue = id;
      } else {
        this.editableTabs.push(oneLogin);
        this.editableTabsValue = id;
      }
    },

    clearWebsocket(e) {
      if (this.connection) {
        this.connection.close();
        this.connection = null;
      }
    },
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > 0) {
        this.isScroller = true;
      } else {
        this.isScroller = false;
      }
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
          const backupData = _.get(res, 'data.data');
          this.lessonName = backupData.name;
          this.courseName = backupData.course_name;
          this.group_id =
            backupData.group_id == null ? '' : backupData.group_id;
          setBreadcrumbTitle(this.lessonName);
          this.lessonPath = '/course/detail/' + backupData.course_id + '/';
          this.lessonInfo = backupData;
          this.crEventData = backupData;
          this.roomId = backupData.room_id;
          this.videoCheckPoints = backupData?.video_check_point_config || [];

          // 默认进来是双屏

          if (this.lessonInfo.handout_url) {
            this.showGuideSingle = true;
          }

          this.judgeShow();
          this.bindSceneWs();
        });
    },
    // 单双屏切换
    tabChange(val) {
      this.sceneData = null;
      this.doubleScene = false;
      this.editableTabsValue = 'scene';
      this.editableTabs = [];
      if (val === 'double') {
        this.doubleScene = true;
        this.isSingle = false;
        this.judgeShow();
        this.activeScene = true;
        this.activeGuide = true;
        this.activeVideo = true;
        this.activeMessage = true;
      } else {
        // 单屏
        this.isSingle = true;
        this.judgeShow();
      }
    },
    // 判断单双屏模块展示的
    judgeShow() {
      if (this.isSingle) {
        // 单屏
        this.$nextTick(() => {
          const allStatusGet = this.$refs.rightNavigation.allStatus;
          let locationVal = '';
          // 顺序不可以变
          if (allStatusGet.isGuide) {
            locationVal = '#guide';
          } else if (allStatusGet.isScene) {
            locationVal = '#scene';
          } else if (allStatusGet.isVideo) {
            locationVal = '#video';
          } else if (allStatusGet.isMessage) {
            locationVal = '#message';
          }
          this.$el
            .querySelector(locationVal)
            .scrollIntoView({ behavior: 'smooth' });
        });
      } else {
        // 双屏
        this.doubleGuide = false;
        this.doubleScene = false;
        this.doubleVideo = false;
        const showGuide = this.lessonInfo.handout_url;
        const showScene =
          this.lessonInfo.scene_config_data || this.lessonInfo.scene_data;
        const showVideo = this.lessonInfo.video_url;
        if (showGuide && showScene) {
          this.doubleGuide = true;
          this.doubleScene = true;
        } else if (showGuide && showVideo) {
          this.doubleGuide = true;
          this.doubleVideo = true;
        } else if (showScene && showVideo) {
          this.doubleScene = true;
          this.doubleVideo = true;
        } else {
          if (showGuide) {
            this.doubleGuide = true;
          } else if (showScene) {
            this.doubleScene = true;
          } else if (showVideo) {
            this.doubleVideo = true;
          }
        }
      }
    },
    // 双屏时右侧导航点击切换
    changeNav(val) {
      if (
        !(
          _.last(val) === 'notes' ||
          _.last(val) === 'report' ||
          _.last(val) === 'message' ||
          _.last(val) === 'annex' ||
          _.last(val) === 'desc'
        )
      ) {
        this.doubleGuide = false;
        this.doubleScene = false;
        this.doubleVideo = false;
        this.sceneData = null;
        if (val.indexOf('scene') > -1) {
          this.$nextTick(() => {
            this.doubleScene = true;
          });
        } else {
          this.doubleScene = false;
        }
        if (val.indexOf('guide') > -1) {
          this.$nextTick(() => {
            this.doubleGuide = true;
          });
        } else {
          this.doubleGuide = false;
        }
        if (val.indexOf('video') > -1) {
          this.doubleVideo = true;
        } else {
          this.doubleVideo = false;
        }
      }

      this.$refs.myNotes.dialogNotes = false;
      this.$refs.experimentReport.dialogReport = false;
      this.$refs.leaveMessage.dialogMessage = false;
      this.$refs.annexDialog.dialogAnnex = false;
      this.$refs.instructionDialog.dialogInstruction = false;
      if (val.indexOf('notes') > -1) {
        this.$refs.myNotes.dialogNotes = true;
        this.$refs.myNotes.getLessonNotes();
      }
      if (val.indexOf('report') > -1) {
        this.$refs.experimentReport.dialogReport = true;
        this.$refs.experimentReport.getLessonReport();
      }
      if (val.indexOf('message') > -1) {
        this.$refs.leaveMessage.dialogMessage = true;
        this.$refs.leaveMessage.getLeaveMessage();
      }
      if (val.indexOf('annex') > -1) {
        this.$refs.annexDialog.dialogAnnex = true;
      }
      if (val.indexOf('desc') > -1) {
        this.$refs.instructionDialog.dialogInstruction = true;
      }
      if (val.indexOf('live') > -1) {
        this.$refs.liveDialog.dialogLive = true;
        this.livingStatus = true;
      }
    },
    // 单屏时右侧导航点击切换
    singleChangeNav(val) {
      const a = '#' + val;
      if (
        val.indexOf('scene') > -1 ||
        val.indexOf('guide') > -1 ||
        val.indexOf('video') > -1 ||
        val.indexOf('message') > -1
      ) {
        this.$el.querySelector(a).scrollIntoView({ behavior: 'smooth' });
      }
      this.$refs.myNotes.dialogNotes = false;
      this.$refs.experimentReport.dialogReport = false;
      this.$refs.annexDialog.dialogAnnex = false;
      this.$refs.instructionDialog.dialogInstruction = false;
      if (val.indexOf('notes') > -1) {
        this.$refs.myNotes.dialogNotes = true;
        this.$refs.myNotes.getLessonNotes();
      }
      if (val.indexOf('report') > -1) {
        this.$refs.experimentReport.dialogReport = true;
        this.$refs.experimentReport.getLessonReport();
      }
      if (val.indexOf('annex') > -1) {
        this.$refs.annexDialog.dialogAnnex = true;
      }
      if (val.indexOf('desc') > -1) {
        this.$refs.instructionDialog.dialogInstruction = true;
      }
      if (val.indexOf('live') > -1) {
        this.$refs.liveDialog.dialogLive = true;
        this.livingStatus = true;
      }
    },
    collapseScene() {
      this.activeScene = !this.activeScene;
      this.getTopologyData(false);
    },
    collapseGuide() {
      this.activeGuide = !this.activeGuide;
    },
    collapseVideo() {
      this.activeVideo = !this.activeVideo;
    },
    collapseMessage() {
      this.activeMessage = !this.activeMessage;
    },
    beforeClose(val) {
      if (val === 'live') {
        this.livingStatus = false;
      }
      this.$refs.rightNavigation.dialogClose(val);
    },
    // 章节获取留言()
    getLeaveMessage() {
      this.$request
        .get(
          '/oj/comment/list',
          {
            business_id: this.lessonId,
            business_type: 2,
            per_page: 1000,
            page: 1,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.comments = res.data.data.list;
          _.forEach(this.comments, (item) => {
            this.$set(item, 'inputShow', false);
            if (item.comment_reply) {
              _.forEach(item.comment_reply, (second) => {
                this.$set(second, 'inputShow', false);
              });
            }
          });
        });
    },
    sendComment(params) {
      this.$request
        .post(
          '/oj/comment/',
          {
            business_id: this.lessonId,
            business_type: COMMENT_TYPE.LESSON,
            theme_name: this.courseName + '/' + this.lessonName,
            ...params,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getLeaveMessage();
        });
    },
    sendLike(val, isLike) {
      this.$request
        .post(
          '/oj/comment/is_like',
          {
            resource_id: val,
            is_like: !isLike,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getLeaveMessage();
        });
    },
    /**
     * 切换单双屏时调用拓扑接口数据
     * @param type 是否需要定位锚点 默认 true需要
     * @param refresh 是否需要刷新
     */
    getTopologyData(type = true, refresh = false) {
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
          if (
            _.get(res, 'data.data.scene_config_data') ||
            _.get(res, 'data.data.scene_data')
          ) {
            this.crEventData = _.get(res, 'data.data');
            refresh && this.changeTopo();
            if (type) {
              this.judgeShow();
            }
          }
        });
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
    },

    countdownOver() {
      this.refreshProgress();
      if (!this.$route.query.room_id) {
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
            this.showMaskBtn = this.$route.query.room_id ? false : true;
            this.showProgress = false;
            this.showBtn = false;
            this.crEventData.scene_data = null;
            return false;
          });
      }
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
              this.editableTabs = [];
              this.editableTabsValue = 'scene';
              this.getTopologyData(false, true);
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

    getSceneCommonWS(val) {
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
          const backupData = _.get(res, 'data.data');
          this.group_id =
            backupData.group_id == null ? '' : backupData.group_id;
          this.crEventData = backupData;
          this.lessonInfo.scene_share_mode = this.crEventData.scene_share_mode;
          if (val != 'no') {
            this.bindSceneWs();
          }
        });
    },
    bindSceneWs() {
      this.refreshProgress();
      let url = '';
      if (this.group_id != '') {
        if (this.queryRoomId) {
          url = `/ojj/ws/oj/classroom/group/scene?group_id=${this.group_id}&token=${this.cookie}`;
        }
      } else {
        url = `/ojj/ws/course/lesson_scene?lesson_id=${this.lessonId}&shared=${
          this.lessonInfo.scene_share_mode != 1
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
          // 先销毁
          this.clearWebsocket();
          this.getSceneCommonWS();
        },
        // 删除同步
        'OJ-2': (data) => {
          this.clearWebsocket();
          this.getSceneCommonWS();
          this.editableTabs = [];
          this.editableTabsValue = 'scene';
        },
        // 启动完成
        'OJ-3': (data) => {
          this.getSceneCommonWS('no');
        },
      });
    },
    // 绑定直播的ws
    bindLiveWs() {
      this.liveWs && this.liveWs.close();
      this.liveWs = wsutil.bind(
        `/ojj/ws/live?stream=${this.$route.query?.room_id}&token=${this.cookie}`,
        (data) => {
          /**
           * type=1,code=1 开播事件
           * type=1,code=2 关播事件
           */
          if (data?.code == 2 && data?.type == 1) {
            this.showWatchLiveBtn = false;
            if (this.$refs.liveDialog.dialogLive) {
              this.$message({
                message: this.$t('course.liveEnded'),
                type: 'info',
              });
              this.$refs.liveDialog.dialogLive = false;
              this.$refs.rightNavigation.dialogClose('live');
            }
            this.livingStatus = false;
          }
          if (data?.code == 1 && data?.type == 1) {
            this.showWatchLiveBtn = true;
          }
        },
      );
    },

    // 刷新场景
    changeTopo() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
    },
  },
};
</script>
<style lang="scss">
.el-collapse {
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
}
.scene-tabs {
  .el-tabs__header {
    width: calc(100% - 124px);
    margin-left: 124px !important;
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
.current-scene {
  height: 100%;
  background: transparent;
  .el-tabs,
  .el-tab-pane {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 32px);
  }
}
.current-no-scene {
  height: 100%;
  .el-tabs,
  .el-tab-pane {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 32px);
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
</style>
<style lang="scss" scoped>
.no-tabs {
  margin-top: 31px;
}
.scene-wrapper {
  position: relative;
  background: var(--bg-color-1);
  overflow: hidden;
  .scene-btn-fake {
    width: 124px;
    height: 32px;
    position: absolute;
    top: 0;
    left: 0;
    line-height: 34px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
    color: var(--neutral8);
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-tuopu {
      margin-right: 4px;
      color: var(--neutral8);
    }
  }
  .scene-btn-fake-current {
    background: var(--bg-color-4);
  }
  .scene-btn-fake-other {
    background: var(--primary-color);
  }
}
::v-deep .lesson-box .copy-btn {
  display: none !important;
}
::v-deep .single-scene-box canvas {
  z-index: unset !important;
}
::v-deep .all-double-box canvas {
  z-index: unset !important;
}
::v-deep .right-double-box canvas {
  z-index: unset !important;
}
.scene-wrapper-box {
  width: 100%;
  height: calc(100% - 31px);
  position: absolute;
  left: 0;
}
.node-frame-wrapper-box {
  height: 100%;
  position: relative;
}
.bottom-btn {
  margin-top: -50px;
  margin-left: 20px;
  position: absolute;
  z-index: 20;
}
::v-deep .markdown-body {
  overflow: auto;
}

::v-deep .markdown-body::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  height: 12px;
  background-color: rgba(0, 0, 0, 0);
}

::v-deep .markdown-body::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background: var(--scroll-bar-bg-color);
}

::v-deep .markdown-body::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: var(--bg-color-third);
}

.markDownCommon {
  overflow: auto;
  overflow-x: hidden;
  height: 100%;
}
::v-deep {
  .el-scrollbar__view {
    height: 100%;
  }
  .slot-div {
    height: calc(100% - 83px);
  }
}

.lesson-box {
  height: inherit;
  background-color: var(--bg-color-2);
  padding: 20px;
  .lesson-box-header {
    height: 36px;
    margin-bottom: 15px;
    .breadcrumb {
      width: auto;
      float: left;
    }
    .tool-box {
      float: right;
      height: 36px;
    }
    .tool-box-scroller {
      width: calc(100% - 120px);
      height: 56px;
      position: fixed;
      top: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 5;
    }
  }
  .lesson-content {
    width: 100%;
    height: calc(100% - 51px);
    //小滚动条样式
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: rgba(0, 0, 0, 0) !important;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--scrollbar-color) !important;
    }
    .frame-mask {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1111;
      opacity: 0;
      background: #dd0000;
    }
    .single-box {
      height: 100%;
      overflow-y: auto;
      .common-link {
        &:before {
          display: block;
          height: 146px;
          visibility: hidden;
          content: '';
          margin-top: -146px;
          position: relative;
          z-index: 1;
        }
      }
    }
    .double-box {
      width: 100%;
      height: 100%;
      .double-guide {
        position: relative;
      }

      .all-double-box {
        width: 100%;
        height: 100%;
        position: relative;
      }
    }
  }
}

.left-double-box,
.right-double-box {
  width: 100%;
  height: 100%;
  position: relative;
}
.right-navigation {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1999;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}
.scene-time {
  position: absolute;
  top: 12px;
  right: 25px;
  z-index: 22;
}
</style>
