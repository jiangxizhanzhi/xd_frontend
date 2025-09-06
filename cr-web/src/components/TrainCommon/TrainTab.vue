<template>
  <div id="right-task" :class="showTask ? 'cssAnimate' : 'cssAnimateRight'">
    <div class="btn-left fr" @click="showTaskPanel()">
      <cb-iconfont v-if="showTask" type="icon-xiangzuo"></cb-iconfont>
      <cb-iconfont v-else type="icon-xiangyou"></cb-iconfont>
    </div>
    <div
      v-if="showTask && !showList && !showDetail"
      class="task-content fr showRecord"
      style="width: 100%; height: 100%; z-index: 10"
    >
      <div class="tabDetail">
        <div class="modify-detail">
          <div class="header">
            <block :title="$t('m.taskSpecification')"></block>
            <slot name="view-manual"></slot>
          </div>
          <div
            class="train-info cyber-scroll-bar"
            style="height: 142px; overflow: auto"
          >
            <cb-row class="row-mb">
              <cb-col :span="12" class="col-flex">
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.trainType') }}:</span>
                </div>
                <div
                  class="grid-content bg-purple-light"
                  :title="trainDescription.trainType"
                >
                  {{ trainDescription.trainType }}
                </div>
              </cb-col>
              <cb-col :span="12" class="col-flex">
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.trainDuration') }}:</span>
                </div>
                <div
                  class="grid-content bg-purple-light"
                  :title="trainDescription.duration_time + hours"
                >
                  {{ trainDescription.duration_time }} {{ hours }}
                </div>
              </cb-col>
            </cb-row>
            <cb-row class="row-mb">
              <cb-col :span="3">
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.frontSkills') }}:</span>
                </div>
              </cb-col>
              <cb-col :span="21">
                <div class="grid-content bg-purple-light skill-style">
                  <div
                    v-for="(item, k) in trainDescription.pre_skill"
                    :key="k"
                    class="skill-box one-overflow"
                    :title="item"
                  >
                    <cb-tag :title="item"> {{ item }}</cb-tag>
                  </div>
                </div>
              </cb-col>
            </cb-row>
            <cb-row class="row-mb">
              <cb-col :span="3">
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.trainingSkills') }}:</span>
                </div>
              </cb-col>
              <cb-col :span="21">
                <div class="grid-content bg-purple-light skill-style">
                  <div
                    v-for="(item, k) in trainDescription.train_skill"
                    :key="k"
                    class="skill-box one-overflow"
                    :title="item"
                  >
                    <cb-tag :title="item"> {{ item }}</cb-tag>
                  </div>
                </div>
              </cb-col>
            </cb-row>
            <cb-row class="row-mb">
              <cb-col :span="3">
                <!-- 描述信息 -->
                <div class="grid-content bg-purple">
                  <span>{{ $t('m.taskDescription') }}:</span>
                </div>
              </cb-col>
              <!-- 场景描述 -->
              <cb-col :span="21">
                <div class="grid-content bg-purple-light">
                  <div
                    class="grid-content bg-purple-light"
                    id="description"
                    :title="trainDescription.description"
                  >
                    {{ trainDescription.description }}
                  </div>
                </div>
              </cb-col>
            </cb-row>
          </div>
          <div class="header">
            <block :title="$t('m.taskMatrix')"></block>
            <div>
              <slot name="train-record"></slot>
            </div>
          </div>
          <div
            style="height: calc(100% - 350px); width: 100%; overflow: auto"
            class="cyber-scroll-bar"
          >
            <div style="height: 100%; width: 100%">
              <SimpleFishBone
                :value="data"
                readonly
                :key="dataKey"
                :layout="model.template"
                :theme="fishTheme"
                @answer="answer"
              />
            </div>
          </div>
          <cb-button
            :disabled="!showSubmitBtn"
            style="float: right; margin-top: 10px"
            @click="submitTrain"
            >{{ $t('m.submitTrain') }}</cb-button
          >
        </div>
      </div>
    </div>
    <!-- 训练记录列表 -->
    <TrainList
      v-if="showTask && showList"
      @showList="updateShowList"
      :trainList="trainList"
      @historyId="getRecordId"
      @showDetail="updateShowdetail"
      @resource="getResource"
    />
    <!-- 训练记录详情 -->
    <TrainDetail
      v-if="showTask && showDetail"
      :historyId="history_id"
      @showDetail="updateShowdetail"
      :resource="resource"
      @showList="updateShowList"
    />
    <cb-dialog
      v-if="showAnswerDialog"
      slot="answer-dialog"
      :visible.sync="showAnswerDialog"
      :close-on-press-escape="false"
    >
      <div slot="title" class="header-title">
        <span>{{ $t('m.taskRecord') }}-</span>
        <span>{{ taskStage }}</span>
        <span>{{ taskName }}</span>
      </div>
      <div class="cyber-scroll-bar" style="height: 600px; overflow: auto">
        <single-answer-dialog
          ref="singleAnswerDialog"
          :task-resource-id="taskResourceId"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" mr @click="SubmitAnswer()">
            {{ $t('m.ensure') }}
          </cb-button>
          <cb-button button-type="cancel" @click="showAnswerDialog = false">
            {{ $t('m.cancel') }}
          </cb-button>
        </cb-button-group>
      </span>
    </cb-dialog>
  </div>
</template>
<script>
import block from '@/components/block';
import SingleAnswerDialog from '@/components/TrainCommon/module/singleAnswerDialog.vue';
import SimpleFishBone from '@/components/SimpleFinshBoneWeb/index.vue';
import TrainList from '@/pages/web/SingleTrain/components/train_list.vue';
import TrainDetail from '@/pages/web/SingleTrain/components/train_detail.vue';
import { getTheme } from '@cyber/helper';

export default {
  components: {
    block,
    SingleAnswerDialog,
    SimpleFishBone,
    TrainList,
    TrainDetail,
  },
  props: {
    taskLists: {
      type: Object,
      default: () => {},
    },
    trainDescription: {
      type: Object,
      default: () => {},
    },
    showList: {
      type: Boolean,
      default: () => false,
    },
    trainList: {
      type: Array,
      default: () => [],
    },
    showDetail: {
      type: Boolean,
      default: () => false,
    },
    showSubmitBtn: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      theme: getTheme(),
      history_id: '',
      resource: 'detail',
      trainInfo: {},
      activeName: 'trainDescription',
      showTask: true,
      showAnswerDialog: false,
      showTreeFile: true, // true显示tree树，false显示文档
      taskStage: '',
      taskName: '',
      taskResourceId: null,
      resource_id: '',
      index: null,
      childrenIndex: null,
      data: [],
      themes: [
        {
          key: 'black',
          label: '黑色',
          value: 1,
        },
        {
          key: 'green',
          label: '绿色',
          value: 2,
        },
        {
          key: 'blue',
          label: '蓝色',
          value: 3,
        },
        {
          key: 'brown',
          label: '棕色',
          value: 4,
        },
      ],
      fishLayout: '',
      model: {
        template: null,
        color: null,
      },
    };
  },
  watch: {
    taskLists: {
      handler: function (val, oldval) {
        this.data = [];
        if (val.scheme_data) {
          val.scheme_data.map((item) => {
            let obj = {};
            obj.stage = item.stage;
            obj.templates = [];
            item.missions &&
              item.missions.map((i) => {
                let ibj = {};
                ibj.title = i.title;
                ibj.isDone = i.finished;
                ibj.resource_id = i.resource_id;
                obj.templates.push(ibj);
              });
            this.data.push(obj);
          });
        }
        this.model.color = val.color;
        this.model.template = val.template;
      },
      immediate: true, // 关键
      deep: true,
    },
  },
  computed: {
    hours() {
      let hoursName = '';
      if (this.trainDescription.duration_time === 1) {
        hoursName = this.$t('m.hours');
      } else {
        hoursName = this.$t('m.hour');
      }
      return hoursName;
    },
    dataKey() {
      return JSON.stringify(this.data);
    },
    fishTheme() {
      return (
        _.chain(this.themes)
          .find({ value: this.model.color })
          .get('key')
          .value() || ''
      );
    },
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  methods: {
    getRecordId(id) {
      this.history_id = id;
    },
    // 提交训练
    submitTrain() {
      this.$request
        .post(
          `/cr/single_train/room/train_submit/`,
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.history_id = _.get(res, 'data.data', '');
          this.resource = 'detail';
          this.$emit('showDetail', true);
          // 点击提交训练,
          this.$parent.$parent.initData();
        });
    },
    updateShowList(value) {
      this.$emit('showList', value);
    },
    getResource(resource) {
      this.resource = resource;
    },
    updateShowdetail(value) {
      this.$emit('showDetail', value);
    },
    answer(data) {
      this.taskResourceId = data.resource_id;
      this.taskStage = data.stage;
      this.$emit('getValue', data);
      this.showAnswerDialog = true;
    },

    showTaskPanel() {
      this.showTask = !this.showTask;
    },
    gotoAnswer(list, titleName, index, childrenIndex) {
      this.index = index;
      this.childrenIndex = childrenIndex;
      this.taskResourceId = list.resource_id;
      this.taskStage = titleName;
      this.taskName = list.name;
      this.$emit('getValue', list);
      this.showAnswerDialog = true;
    },
    SubmitAnswer() {
      // 单兵训练提交训练记录
      const params = {};
      if (this.$refs.singleAnswerDialog.questionType === 0) {
        params.answer = this.$refs.singleAnswerDialog.judgeAnswer;
      }
      if (this.$refs.singleAnswerDialog.questionType === 1) {
        params.answer = this.$refs.singleAnswerDialog.singleAnswer;
      }
      if (this.$refs.singleAnswerDialog.questionType === 2) {
        params.answer = JSON.stringify(
          this.$refs.singleAnswerDialog.multipleAnswer,
        );
      }
      if (this.$refs.singleAnswerDialog.questionType === 7) {
        params.answer = this.$refs.singleAnswerDialog.fileMD5;
      }
      params.training_record = this.$refs.singleAnswerDialog.taskAnswer;
      params.mission_resource_id = this.taskResourceId;
      params.business_template_id = this.resource_id;

      this.$request
        .post('/cr/single_train/room/mission_submit', params, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.$message.success(this.$t('m.reportSuccess'));
          this.$parent.$parent.initTimeData();
          this.showAnswerDialog = false;
          this.$parent.$parent.initData();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.cssAnimate {
  width: 720px;
  min-width: 350px;
  transition: all 0.001ms ease;
}
</style>
<style lang="scss">
.cyber-scroll-bar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.cyber-scroll-bar::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color);
}
.cyber-scroll-bar::-webkit-scrollbar-thumb:hover {
  background: var(--bg-color-2);
}
.cssAnimateRight {
  width: 1px;
  transition: all 0.5s ease;
}
#right-task {
  height: 100%;
  position: absolute;
  right: 0;
  box-sizing: border-box;
  // z-index: 2;
  .task-content {
    height: 100%;
    position: absolute;
    right: 0;
    .task-lists {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0 24px 0;
      .el-scrollbar {
        height: calc(100% - 10px);
      }
      .el-scrollbar__view {
        height: calc(100% - 10px);
      }
      .el-scrollbar__bar.is-horizontal {
        height: 0;
        left: 0;
      }
      .task-list {
        width: 100%;
        .task-stage {
          width: 100%;
          padding: 24px 0 10px;
          .left-stage {
            width: 30%;
            margin-top: 10px;
          }
          .stage-name {
            position: relative;
            width: 38%;
            height: 24px;
            margin: 0 1%;
            padding-left: 25px;
            font-size: 14px;
            font-family: Microsoft YaHei;
          }
          .stage-name::before {
            position: absolute;
            top: 6px;
            left: 4px;
            content: '';
            width: 6px;
            height: 8px;
          }
          .right-stage {
            width: 30%;
            transform: rotateY(180deg);
            margin-top: 10px;
          }
        }
      }
    }
    .task-set {
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin: 0;
      &:hover {
        cursor: pointer;
        width: 100%;
        height: 40px;
      }
      span:first-child {
        font-size: 14px;
      }
      .answered-name {
        display: inline-block;
        width: 70%;
      }
      .onanswered {
        display: inline-block;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 40px;
        margin-right: 15px;
        padding-left: 27px;
      }
      .offanswered {
        display: inline-block;
        line-height: 40px;
        margin-right: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        padding-left: 27px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
  }
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .tabsDetail {
    width: 21%;
    height: 42px;
    padding: 34px 46px 0;
  }
  .hv {
    line-height: 36px;
  }
  .title-name {
    padding: 15px 0 15px 15px;
    .linear {
      width: 3px;
      height: 16px;
      background: linear-gradient(
        0deg,
        rgba(30, 163, 254, 1),
        rgba(0, 224, 232, 1)
      );
    }
    span {
      padding-left: 15px;
      color: #1ea3fe;
      font-size: 16px;
      line-height: 16px;
      float: left;
    }
  }
  .btn-left {
    cursor: pointer;
    width: 20px;
    height: 50px;
    border-radius: 2px 0 0 2px;
    line-height: 50px;
    text-align: center;
    position: absolute;
    top: 34px;
    left: -20px;
    z-index: 10;
    svg {
      font-size: 12px !important;
    }
  }

  .showRecord {
    .el-scrollbar {
      height: calc(100% - 160px);
    }
    .el-scrollbar__view {
      height: calc(100% - 160px);
      padding: 0 0 0 0;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
    .el-scrollbar__bar.is-horizontal {
      height: 0;
    }
  }
  .noRecord {
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
  .info-content {
    width: 100%;
    height: 100%;
    padding: 0 24px 0;
    box-sizing: border-box;
    .el-scrollbar {
      height: 100%;
      width: 100%;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
  .train-info {
    width: 100%;
    margin: 24px 0 0 0;
    #description {
      text-overflow: ellipsis;
      display: -webkit-box;
      white-space: normal;
      -webkit-box-orient: vertical;
      // -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    .info-description-name {
      width: 80px;
      span {
        margin: 0 0 10px 10px;
        font-size: 14px;
      }
    }
    .info-description-right {
      margin-left: 10px;
      width: calc(100% - 110px);
      word-break: break-all;
    }
    .skill-box {
      font-size: 14px;
      margin-bottom: 6px;
      width: min-content;
      padding: 2px 13px;
      display: inline-block;
      max-width: 100%;
      cursor: pointer;
      margin-right: 10px;
    }
  }
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}
</style>
<style lang="scss" scoped>
.tabDetail {
  height: 100%;
  .modify-detail {
    height: 100%;
    padding: 10px;
    .header {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }
    .train-info {
      font-size: 14px;
      padding-left: 20px;
      .row-mb {
        margin-bottom: 8px;
        line-height: 20px;
        .col-flex {
          display: flex;
          justify-content: flex-start;
        }
        .grid-content {
          margin-right: 10px;
          span {
            color: var(--neutral8) !important;
          }
          ::v-deep .cb-tag-content {
            height: 24px;
            line-height: 24px;
          }
        }
        .skill-style {
          margin-left: -15px;
        }
      }
    }
  }
}
</style>
