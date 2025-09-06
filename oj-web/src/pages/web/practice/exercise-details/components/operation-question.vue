<template>
  <!-- 启动场景 -->
  <div class="operation-question" :key="resourceId">
    <template v-if="!loadingStatus">
      <div class="content" v-if="questionDatas">
        <operation-title
          :catagoryName="categoryName"
          :difficultName="difficultName"
          :difficult="questionDatas && questionDatas.difficulty"
          :knowledgeDatas="knowledgeDatas"
          :content="optTitle"
          :desc="optDesc"
          :enclosure="enclosure"
          :solved="isSolved || again === 'again'"
          :isCollection="isCollection"
          @collection-change="collection"
        ></operation-title>
        <div class="toolbar" v-if="crEventData.scene_config_data">
          <scene-editor
            ref="sceneEditor"
            :title="optTitle"
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
            v-if="sceneData.scene_share_mode"
            :topologyData="sceneData"
          />
          <div class="scene-time">
            <cy-time-countdown
              v-if="sceneData.remaining_time"
              :second="sceneData.remaining_time"
              :status="sceneData.status"
              @countdownOver="countdownOver"
            />
          </div>
        </div>
        <div class="answer">
          <!-- <span class="replay-span">{{ $t('m.examAnswer') }}</span>
          <span
            class="replay-span"
            :class="$store.state.app.language === 'en' ? 'colon-en' : ''"
          >
            {{ $t('m.colon') }}
          </span> -->
          <cb-form
            :model="formData"
            :rules="rules"
            ref="formOperationAnswer"
            style="width: 60%; margin: 0 16px 0 0"
          >
            <cb-form-item prop="operationAnswer" :label="''">
              <cy-textarea-flag
                class="message-info elc-input"
                :disabled="isSolved"
                type="text"
                v-model="formData.operationAnswer"
                @change="inputChange(arguments)"
                :placeholder="$t('practice.plzEnterAnswer')"
              ></cy-textarea-flag>
            </cb-form-item>
          </cb-form>
          <status-btn
            v-show="
              !isSolved && submitStatus !== SUBMITSTATUS.SubmittedCorrectly
            "
            :icon-name="'icon-xiafa'"
            :btn-name="$t('m.exercise.submit')"
            :status-class="'submit-btn'"
            @click.native="submitForm"
          ></status-btn>
          <status-btn
            v-show="submitStatus == SUBMITSTATUS.SubmittedCorrectly"
            :icon-name="'icon-xuanze1'"
            :btn-name="$t('m.exercise.submitted')"
            :status-class="'green-btn'"
          ></status-btn>
          <div class="status-tip">
            <div
              class="success-status-tip"
              v-show="submitStatus == SUBMITSTATUS.SubmittedCorrectly"
            >
              <cb-iconfont
                type="icon-chenggong"
                themedColor="green-color"
              ></cb-iconfont>
            </div>
            <div
              class="error-status-tip"
              v-show="submitStatus == SUBMITSTATUS.SubmittedError"
            >
              <cb-iconfont
                type="icon-shibai"
                themedColor="red-color"
              ></cb-iconfont>
            </div>
          </div>
          <!-- <status-btn
            v-show="isSolved"
            :icon-name="'icon-xuanze1'"
            :btn-name="$t('m.exercise.solved')"
            :status-class="'orange-btn'"
          ></status-btn> -->
        </div>
      </div>
      <div
        class="empty-div"
        v-if="!questionDatas"
        style="width: 100%; height: 420px"
      >
        <empty></empty>
      </div>
      <explain-column
        :type="type"
        :resourceId="resourceId"
        :solvingContent="solvingContent"
        :questionDatas="questionDatas"
        :businessType="businessType"
      ></explain-column>
    </template>
  </div>
</template>
<script>
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import empty from '@/components/empty/index.vue';
import operationTitle from '@/components/exercise-select/operation-title-flag.vue';
import statusBtn from '@/components/button/status-btn.vue';
import explainColumn from './explain-column.vue';
import { TYPE, DIFFICULTY, SUBMITSTATUS, SCENE_STATUS } from './../../constant';
import _ from 'lodash';
import { SceneEditor } from '@cyber/scene';
import cyTimeCountdown from '@/components/scene-related/index';
import ScenePattern from '@/components/scene-related/scene-pattern.vue';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import { mixins } from '@/mixin';

export default {
  name: '',
  mixins: [mixins],
  components: {
    empty,
    operationTitle,
    statusBtn,
    explainColumn,
    SceneEditor,
    cyTimeCountdown,
    ScenePattern,
  },
  props: {
    businessType: {
      type: [String, Number],
      default: '',
    },
    websocketKeyProp: {
      type: String,
      default() {
        return '';
      },
    },
    loadingStatus: {
      type: Boolean,
      default: true,
    },
    type: {
      type: Number,
      default: null,
    },
    resourceId: {
      type: String,
      default: '',
    },
    questionDatas: {
      type: Object,
      default: null,
    },
    crEventData: {
      type: Object,
      default: null,
    },
    categoryName: {
      type: String,
      default: '',
    },
    submitStatus: {
      // 0未提交 1提交错误 2 提交正确
      type: Number,
      default: SUBMITSTATUS.NotSubmitted,
    },
    isCollection: {
      type: Boolean,
      default: false,
    },
    // 是否从再练一次
    again: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      TYPE,
      DIFFICULTY,
      SUBMITSTATUS,
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: ['restore'],
        showToolbar: true,
      },
      showMask: true, // 场景蒙层
      loadingOpt: false,
      currentQuestionDatas: null,
      knowledgeDatas: null, // 知识点
      isSolved: false, // false未解决 true已解决
      formData: {
        operationAnswer: this.data,
      },
      rules: {
        operationAnswer: [
          {
            required: true,
            message: this.$t('m.searchPlaceholder'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      difficultName: '', // 难度初中高
      optTitle: '', // 操作题标题
      optDesc: '', // 操作题描述
      enclosure: '', // 附件url
      comments: [], // 评论
      solvingContent: '', // 题解
      practiceNotes: '', // 我的笔记
      websocketKey: this.websocketKeyProp,
      connection: null,
      resourceIds: '',
      showMaskBtn: true, // 是否显示启动按钮
      showProgress: false, // 是否显示进度条
      showBtn: false, // 是否显示按钮组
      sceneData: {}, // 场景数据
      cookie: '',
      wsData: {},
    };
  },
  computed: {
    btnGroupConfig() {
      // 按钮组配置项
      return ['close', 'recover'];
    },
    language() {
      return this.$store.state.app.language;
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
    questionDatas: {
      handler(val, oldval) {
        if (this.type === TYPE.CaptureFlag && val) {
          this.currentQuestionDatas = val;
          this.knowledgeDatas = JSON.parse(_.get(val, 'knowledge', '') || null);
          // this.isCollection = _.get(val, 'is_collection', '') || false;
          const difficuty = _.get(val, 'difficulty');
          if (difficuty === DIFFICULTY.Primary) {
            this.difficultName = this.$t('practice.easy');
          } else if (difficuty === DIFFICULTY.Medium) {
            this.difficultName = this.$t('practice.medium');
          } else if (difficuty === DIFFICULTY.Advanced) {
            this.difficultName = this.$t('practice.difficult');
          }
          this.optTitle = _.get(val, 'title', '') || '';
          this.optDesc = _.get(val, 'content', '') || '';
          const file = _.get(val, 'file_url', '') || '';
          this.enclosure = file
            ? '/download' +
              file +
              '?attname=' +
              encodeURIComponent(_.get(val, 'file_name', ''))
            : '';
          if (this.again) {
            let resolved_detail = {
              correct_answer: null,
              is_solved: false,
              keyword: null,
              submit_answer: null,
            };
            this.isSolved = _.get(resolved_detail, 'is_solved', '');
            this.formData.operationAnswer =
              _.get(resolved_detail, 'submit_answer', '') || '';
            this.solvingContent = _.get(val, 'writeup', '') || '';
          } else {
            const resolved_detail = _.get(val, 'resolved_detail', '');
            this.isSolved = _.get(resolved_detail, 'is_solved', '');
            this.formData.operationAnswer =
              _.get(resolved_detail, 'submit_answer', '') || '';
            this.solvingContent = _.get(val, 'writeup', '') || '';
          }
        }
      },
      immediate: true,
      deep: true,
    },
    'crEventData.scene_share_mode': {
      handler(val, oldval) {
        if (val !== oldval && val) {
          this.$nextTick(function () {
            this.bindSceneWs();
          });
        }
      },
      immediate: true,
      deep: true,
    },
    websocketKeyProp: {
      handler(val, oldval) {
        if (val) {
          this.$nextTick(function () {
            this.bindSceneWs();
          });
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
    this.resourceIds = this.$route.params && this.$route.params.id;
    /* this.cookie = document.cookie.split('cr_jwttoken=')[1]; */
    this.cookie = utils.getCookie('cr_jwttoken');
  },
  methods: {
    collection() {
      this.$emit('collection-change', this.isCollection);
    },
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

    inputChange(val) {
      this.formData.operationAnswer = val[0];
    },

    submitForm() {
      // 答案提交
      this.$refs['formOperationAnswer'].validate((valid) => {
        if (valid) {
          this.$emit('submit-opt-answer', this.formData.operationAnswer);
        } else {
          return false;
        }
      });
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
          '/oj/practice/operation/scene',
          {
            resource_id: this.resourceIds,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.$emit('update:crEventData', {
            ...this.crEventData,
            ...{ scene_data: data },
          });
          this.showMask = true;
          this.showMaskBtn = false;
          this.showProgress = true;
          // this.websocketKey = data.websocket_key
          return false;
        });
    },

    updateScene(val) {
      // 正常状态传 2 暂停状态传3
      const status = val ? SCENE_STATUS.RECOVERY : SCENE_STATUS.PAUSE;
      this.$request
        .patch(
          '/oj/practice/operation/scene_update_status',
          {
            resource_id: this.resourceIds,
            status: status,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          // this.$emit('update:crEventData', {
          //   ...this.crEventData,
          //   ...{ scene_data: res.data },
          // });
        });
    },

    countdownOver() {
      this.refreshProgress();
      this.$request
        .delete(
          '/oj/practice/operation/scene',
          {
            resource_id: this.resourceIds,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.showMask = true;
          this.showMaskBtn = true;
          this.showProgress = false;
          this.showBtn = false;
          this.$emit('update:crEventData', {
            ...this.crEventData,
            ...{ scene_data: null },
          });
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
              '/oj/practice/operation/scene',
              {
                resource_id: this.resourceIds,
              },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              this.showMask = true;
              this.showMaskBtn = true;
              this.showProgress = false;
              this.showBtn = false;
              this.$emit('update:crEventData', {
                ...this.crEventData,
                ...{ scene_data: null },
              });
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
          '/oj/practice/operation/scene_node_restart',
          {
            resource_id: this.resourceIds,
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
          '/oj/practice/operation/scene_node_recreate',
          {
            resource_id: this.resourceIds,
            node_id: node.id,
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
          '/oj/practice/operation/topo_scene',
          {
            resource_id: this.resourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$emit('update:crEventData', {
            ...this.crEventData,
            ...{ scene_data: res.data.data.scene_data },
          });
        });
    },

    bindSceneWs() {
      this.connection = wsutil.cbind(
        `/ojj/ws/oj/operation/scene?practice_id=${this.resourceIds}&shared=${this.crEventData.scene_share_mode}&from_web=true&token=${this.cookie}`,
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
.span-en {
  width: 125px;
}
::v-deep .el-form {
  .el-form-item {
    margin: 0px;
  }
  .el-form-item__content {
    margin: 0px;
    line-height: 20px;
  }
}
.operation-question {
  .status-tip {
    display: flex;
    align-items: center;
    padding-left: 26px;
    height: 20px;
  }
  .content {
    border-radius: 2px;
    // .knowledgePoints {
    //   padding: 30px 30px 0;
    //   margin: 0;
    // }
    .toolbar {
      height: 500px;
      border-radius: 2px;
      margin: 10px 30px 0;
      position: relative;
    }
    .answer {
      display: flex;
      align-items: center;
      padding: 20px 30px 23px;
      .replay-span {
        height: 40px;
        line-height: 40px;
        // margin-right: 10px;
        /*color: #C0CCE7*/
        font-size: 14px;
      }
      ::v-deep .el-input {
        margin-right: 20px;
        border-radius: 18px;
        .el-input__inner {
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.operation-question {
  .answer {
    .el-form {
      padding: 0;
    }
  }
}
</style>
