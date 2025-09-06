<template>
  <!-- 裁定评判 -->
  <div class="assess red-expert-assess">
    <!-- 专家评估 上报件数 -->
    <div class="assess-top">
      <div class="div-box first-box">
        <div class="imgleft fl">
          <div class="com-icon-swapper">
            <cb-iconfont
              size="39"
              class="color-sky-blue"
              type="icon-zhiding"
            ></cb-iconfont>
          </div>
        </div>
        <div class="numright fr">
          <span class="number-color color-sky-blue">
            {{ numberOfTasksReported }}
            <i class="one-icon">{{ $t('common.item') }}</i>
          </span>
          <div class="one-texte blue color-sky-blue">
            {{ $t('m.numberOfTasksReported') }}
          </div>
        </div>
      </div>
      <div class="div-box">
        <div class="imgleft fl">
          <div class="com-icon-swapper">
            <cb-iconfont
              size="39"
              class="color-cyan"
              type="icon-kuaisuyuejuan"
            ></cb-iconfont>
          </div>
        </div>
        <div class="numright fr">
          <span class="number-color-withe color-cyan">
            {{ numberOfWaitMissions }}
            <i class="one-icon-withe">{{ $t('common.item') }}</i>
          </span>
          <div class="one-texte withe color-cyan">
            {{ $t('m.numberOfToAudit') }}
          </div>
        </div>
      </div>
      <div class="div-box">
        <div class="imgleft fl">
          <div class="com-icon-swapper">
            <cb-iconfont
              size="39"
              class="color-green"
              type="icon-chenggong"
            ></cb-iconfont>
          </div>
        </div>
        <div class="numright fr">
          <span class="number-color-green color-green">
            {{ numberOfSuccessfulTasks }}
            <i class="green">{{ $t('common.item') }}</i>
          </span>
          <div class="one-texte green-txt color-green">
            {{ $t('m.numberOfSuccessfulTasks') }}
          </div>
        </div>
      </div>
      <div class="div-box">
        <div class="imgleft fl">
          <div class="com-icon-swapper">
            <cb-iconfont
              size="39"
              class="color-red"
              type="icon-honglanduikang"
            ></cb-iconfont>
          </div>
        </div>
        <div class="numright fr">
          <span class="number-color-red color-red">
            {{ numberOfFailedTasks }}
            <i class="red">{{ $t('common.item') }}</i>
          </span>
          <div class="one-texte red-txt color-red">
            {{ $t('m.numberOfFailedTasks') }}
          </div>
        </div>
      </div>
      <div class="div-box">
        <div class="imgleft fl">
          <div class="com-icon-swapper">
            <cb-iconfont
              size="39"
              class="color-yellow"
              type="icon-bianjiqizhongjian"
            ></cb-iconfont>
          </div>
        </div>
        <div class="numright fr">
          <span class="number-color-orange color-yellow">
            {{ numberOfRejectedTasks }}
            <i class="orange">{{ $t('common.item') }}</i>
          </span>
          <div class="one-texte orange-txt color-yellow">
            {{ $t('m.numberOfRejectedTasks') }}
          </div>
        </div>
      </div>
    </div>
    <!-- 任务评估列表 -->
    <div class="assess-middle">
      <div class="assess-content">
        <div class="midd-title">
          <!-- <title-name :name="$t('m.taskAssessment')" class="fl" /> -->
          <title-director
            :square-color="'bg-color-sky-blue'"
            :name="$t('m.taskAssessment')"
            class="fl"
          />
          <!-- {{ $t('m.taskAssessment') }} -->
        </div>
        <!-- 筛选器 -->
        <div class="selc-top">
          <label class="color-gray">{{ $t('m.user') }}</label>
          <cb-select
            v-model="submitRecordFilterForm.user"
            class="elc-select elc-input-16"
            clearable
            @change="changeSelectUser()"
            :first="{
              value: '',
              label: $t('m.all'),
            }"
          >
            <cb-option
              v-for="item in rolesList"
              :key="item.resource_id"
              :label="item.name"
              :value="item.resource_id"
            />
          </cb-select>
          <label class="color-gray" style="margin-left: 20px">{{
            $t('m.completionStatus')
          }}</label>
          <cb-select
            v-model="submitRecordFilterForm.assesType"
            class="elc-select elc-input-16"
            clearable
            @change="changeSelect()"
            :first="{
              value: '',
              label: $t('m.all'),
            }"
          >
            <cb-option
              v-for="(item, index) in classifyList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </cb-select>
        </div>
        <div class="task-assess elc-table">
          <!-- 任务评估cb-table -->
          <cb-scrollbar v-if="tableTaskList.length">
            <template>
              <cb-search-table
                :cols="cols"
                rowKey="resource_id"
                :dataSource="tableTaskList"
                hidePaginOnDemand
                :searchBarBg="false"
              >
                <!-- 任务名称 -->
                <template v-slot:mission_data="scope">
                  <span>{{ scope.data.mission_data.title }}</span>
                </template>
                <!-- 分数 -->
                <template v-slot:score="scope">
                  <span>{{ scope.data.score }}{{ $t('common.score') }}</span>
                </template>
                <!-- 评估模式 -->
                <template v-slot:evaluator="scope">
                  <span v-if="scope.data.evaluator">{{
                    $t('m.peopleReview')
                  }}</span>
                  <span v-else>{{ $t('m.machineReview') }}</span>
                </template>
                <!-- 完成状态 -->
                <template v-slot:evaluate_status="scope">
                  <span
                    v-if="
                      scope.data.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.WAIT.value
                    "
                    class="toevaluate"
                    >{{ $t('m.toEvaluate') }}</span
                  >
                  <span
                    v-else-if="
                      scope.data.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.SUCCESS.value
                    "
                    class="success"
                    >{{ $t('m.success') }}</span
                  >
                  <span
                    v-else-if="
                      scope.data.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.FAIL.value
                    "
                    class="fail"
                    >{{ $t('m.fail') }}</span
                  >
                  <span
                    v-else-if="
                      scope.data.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.REJECT.value
                    "
                    class="reject"
                    >{{ $t('m.reject') }}</span
                  >
                  <span v-else />
                </template>
                <!-- 操作 -->
                <template v-slot:operation="scope">
                  <!-- 查看 -->
                  <cb-button
                    type="text"
                    @click="taskCheck(scope.$index, scope.data)"
                  >
                    {{ $t('m.check') }}</cb-button
                  >
                  <!-- 评估 -->
                  <cb-button
                    type="text"
                    @click="operationTask(scope.$index, scope.data, scope)"
                    v-if="
                      scope.data.evaluate_status !==
                      $CONSTANT.SceneTerminal.ReviewStatus.REJECT.value
                    "
                  >
                    {{ $t('m.assess') }}</cb-button
                  >
                </template>
              </cb-search-table>
            </template>
          </cb-scrollbar>
          <div v-if="!tableTaskList.length" style="width: 100%; height: 93%">
            <empty-page ref="emptyComp" />
          </div>
        </div>
      </div>
      <div class="assess-bottom">
        <div class="leftFlow">
          <div class="midd-title">
            <!-- <title-name :name="$t('m.primitiveEventFlow')" class="fl" /> -->
            <title-director
              :square-color="'bg-color-sky-blue'"
              :name="$t('m.primitiveEventFlow')"
              class="fl"
            />

            <!-- {{ $t('m.primitiveEventFlow') }} -->
          </div>
          <div style="height: 100%">
            <probes-new
              ref="probesRef"
              :scene_id="scene_id"
              :tabelHeight="240"
              type="referee"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 操作评审 -->
    <cb-dialog
      v-if="dialogReject"
      :title="$t('m.review')"
      :visible.sync="dialogReject"
      :modal-append-to-body="false"
      class="referee-dialogReject elc-dialog"
      @close="resetForm"
    >
      <cb-form
        ref="rejectForm"
        :rules="rules"
        :model="rejectForm"
        :label-width="getI18Nn().locale == 'en-US' ? '150px' : '80px'"
      >
        <cb-form-item :label="$t('m.peoplejudge')" prop="evaluate_status">
          <cb-radio-group v-model="rejectForm.evaluate_status" class="score">
            <cb-radio class="success-icon" :label="1">{{
              $t('m.success')
            }}</cb-radio>
            <cb-radio class="fail-icon" :label="2">{{ $t('m.fail') }}</cb-radio>
            <cb-radio class="reject-icon" :label="3">{{
              $t('m.reject')
            }}</cb-radio>
          </cb-radio-group>
        </cb-form-item>
        <cb-form-item
          :label="$t('m.presuppositionReason')"
          prop="defaultReasons"
        >
          <cb-select
            v-model="rejectForm.defaultReasons"
            class="elc-select"
            :placeholder="$t('m.pleaseChooseReason')"
          >
            <cb-option
              v-for="item in selectReasons"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('m.rulingDetails')" prop="realReason">
          <cb-input
            v-model="rejectForm.realReason"
            type="textarea"
            class="elc-input elc-input-16"
            :placeholder="$t('m.pleaseEnterVerdictDetails')"
            :rows="4"
          />
        </cb-form-item>
        <cb-form-item
          v-if="rejectForm.evaluate_status == 3 ? false : true"
          :label="$t('m.scoreChange')"
          prop="judgeScore"
        >
          <div class="fl realReasonLeft">
            <cb-input
              v-model="rejectForm.judgeScore"
              class="elc-input elc-input-16"
              :placeholder="$t('m.pleaseEnterAreassignmentScore')"
            />
          </div>
          <div
            class="fl realReasonRight"
            :class="{ enRealReasonRight: getI18Nn().locale == 'en-US' }"
          >
            <span>{{ $t('m.fullMarks') }}</span>
            <span>{{ rejectForm.score }}{{ $t('common.score') }}</span>
          </div>
        </cb-form-item>
      </cb-form>
      <div slot="footer" class="dialog-footer">
        <cb-button-group>
          <cb-button @click="operationSubmit()">{{ $t('m.ensure') }}</cb-button>
          <cb-button button-type="cancel" @click="resetForm('rejectForm')">{{
            $t('m.cancel')
          }}</cb-button>
        </cb-button-group>
      </div>
    </cb-dialog>
    <!--查看任务详情弹窗-->
    <cb-dialog
      :title="$t('m.taskDetails')"
      :visible.sync="dialogSee"
      width="50%"
      top="100px"
    >
      <check-task :form-info="form" :pieLabelData="pieLabelArr" />
    </cb-dialog>
    <cb-dialog
      :title="$t('m.lookDetails')"
      :visible.sync="dialogView"
      width="50%"
    >
      <template>
        <cb-scrollbar>
          <json-viewer :value="jsonData" :expand-depth="expandDepth" />
        </cb-scrollbar>
      </template>
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import U from '@/utils/utils';
import 'vue-json-viewer/style.css';
import CheckTask from './components/check_task.vue';
import { errorMessage } from '@/assets/js/tools.js';
import emptyPage from '@/pages/web/Empty';
import moment from 'moment';
import TitleDirector from '@/pages/web/RedVsBlue/Director/components/title.vue';
import { getRadarLabels } from '@/api/common.js';
import ProbesNew from '@/pages/web/RedVsBlue/Referee/components/probes-new.vue';
import { evaluationSubmit, getTaskCount } from '@/api/web/expert_assess.js';
import { getI18N } from '@cyber/helper';

export default {
  components: {
    TitleDirector,
    CheckTask,
    emptyPage,
    ProbesNew,
  },
  filters: {
    limitResultLen(value) {
      if (value) {
        const screenWidth = document.body.clientWidth;
        let limit = 115;
        if (screenWidth <= 1366) {
          limit = 121;
        } else if (screenWidth <= 1440 && screenWidth > 1366) {
          limit = 134;
        } else if (screenWidth <= 1680 && screenWidth > 1440) {
          limit = 163;
        } else {
          limit = 197;
        }
        var res = value.length < limit ? value : value.slice(0, limit) + '...';
        return res;
      }
    },
  },
  props: {
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    var checkScore = (rule, value, callback) => {
      if (
        isNaN(value) ||
        value.trim === '' ||
        !/^\d+(?=\.{0,1}\d+$|$)/.test(value)
      ) {
        callback(new Error(this.$t('m.pleaseEnterPositiveInteger')));
      } else {
        if (value > this.rejectForm.score) {
          callback(
            new Error(
              this.$t('m.theScoreMustNotExceed') + this.rejectForm.score,
            ),
          );
        } else {
          callback();
        }
      }
    };
    return {
      cols: [
        {
          label: this.$t('m.missionTitle'),
          slot: 'mission_data',
        },
        {
          label: this.$t('m.user'),
          prop: 'submit_user_name',
        },
        {
          label: this.$t('m.role'),
          prop: 'submit_user_role',
        },
        {
          label: this.$t('m.scores'),
          slot: 'score',
        },
        {
          label: this.$t('m.sourceOfAssessment'),
          slot: 'evaluator',
        },
        {
          label: this.$t('m.completionStatus'),
          slot: 'evaluate_status',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
      scene_id: '',
      scene_manager_id: '',
      pattern: /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g,
      expandDepth: 0,
      jsonData: {},
      dialogView: false,
      visibleOperation: false,
      resource_id: this.$route.params && this.$route.params.resource_id,
      dialogReject: false,
      form: {
        evaluation_id: '',
        name: '',
        content: '',
        userAnswers: '',
        standardAnswer: '',
        write_up: '',
        region: '',
        realReason: '',
        score: '',
        level_data: [],
        type: '',
        answerOption: [],
      },
      rejectForm: {
        evaluation_id: '',
        defaultReasons: 1,
        realReason: '',
        score: '',
        judgeScore: null,
        evaluate_status: '',
      },
      dialogSee: false,
      radio: '1',
      value3: true,
      animate: false,
      showThis: true,
      expertAssessment: this.$t('m.expertAssessment'),
      dialogTableVisible: false,
      event: [],
      evaluation: [],
      confirmedEvaluation: [],
      tableTaskList: [],
      gridData: [
        {
          date: '关键词筛选',
          name: '包含字段"服务"',
        },
        {
          date: '关键词筛选',
          name: '包含字段"木马"',
        },
      ],
      evaluationData: [],
      confirmedEvaluationData: [],
      numberOfTasksReported: 0,
      numberOfSuccessfulTasks: 0,
      numberOfFailedTasks: 0,
      numberOfRejectedTasks: 0,
      numberOfWaitMissions: 0,
      numberOfOriginalEvents: 10,
      confirmationOfTheNumberOfAssessments: 4,
      waitingForAssessmentNumber: 7,
      numberOfEvaluationRules: 20,
      numberOfTrustedRules: 10,
      fuzzyRuleNumber: 10,
      selectReasons: [
        {
          value: 1,
          label: this.$t('m.insufficientEventSupport'),
        },
        {
          value: 2,
          label: this.$t('m.eventSupportSufficient'),
        },
      ],
      crDataNodeList: [],
      rules: {
        evaluate_status: [
          {
            required: true,
            message: this.$t('m.judgmentCannotBeEmpty'),
            trigger: 'change',
          },
        ],
        defaultReasons: [
          {
            required: true,
            message: this.$t('m.pleaseSelectPresetReason'),
            trigger: 'change',
          },
        ],
        realReason: [
          {
            required: true,
            message: this.$t('m.pleaseEnterVerdictDetails'),
            trigger: 'blur',
          },
          {
            min: 1,
            max: 100,
            message: this.$t('m.assessScoreRules'),
            trigger: 'blur',
          },
        ],
        judgeScore: [
          {
            required: true,
            message: this.$t('m.scoreCannotBeEmpty'),
            trigger: ['change', 'blur'],
          },
          { validator: checkScore, trigger: ['change', 'blur'] },
        ],
        // 裁判评判
      },
      submitRecordFilterForm: {
        user: '',
        assesType: '',
      },
      rolesList: [],
      startEndTime: null,
      contentLists: [
        {
          relationLeft: '',
          keywordLeft: '',
          relationRight: '',
          keywordRight: '',
        },
      ],
      includes: '', // 包含 1
      excludes: '', // 不包含 0
      startTime: null,
      endTime: null,
      includeList: [],
      excludeList: [],
      selectRelation: [
        {
          value: 1,
          label: this.$t('m.contains'),
        },
        {
          value: 0,
          label: this.$t('m.notContains'),
        },
      ],
      singleVal: null,
      props: { multiple: true },
      hostName: [],
      host: '',
      inHost: [],
      pieLabelArr: [],
    };
  },
  computed: {
    ...mapGetters(['language']),
    classifyList() {
      return [
        {
          label: this.$t('m.toEvaluate'),
          value: this.$CONSTANT.SceneTerminal.ReviewStatus.WAIT.value,
        },
        {
          label: this.$t('m.success'),
          value: this.$CONSTANT.SceneTerminal.ReviewStatus.SUCCESS.value,
        },
        {
          label: this.$t('m.fail'),
          value: this.$CONSTANT.SceneTerminal.ReviewStatus.FAIL.value,
        },
        {
          label: this.$t('m.reject'),
          value: this.$CONSTANT.SceneTerminal.ReviewStatus.REJECT.value,
        },
      ];
    },
  },
  watch: {
    crEventData: {
      handler(val, oldval) {
        if (val !== oldval) {
          if (!_.isEmpty(val.data)) {
            this.getListData();
            this.getTaskCount();
            this.$nextTick(() => {
              if (this.crEventData.data.scene_data) {
                const crDataNode = [];
                _.forEach(this.crEventData.data.scene_data.nodes, (item) => {
                  if (item.data.data._instance.networks) {
                    _.forEach(item.data.data._instance.networks, (list) => {
                      crDataNode.push({
                        ip: list.ip,
                        name: item.data.data.name,
                      });
                    });
                  }
                });
                if (crDataNode.length > 0) {
                  this.crDataNodeList = crDataNode;
                  crDataNode.forEach((item) => {
                    const obj = {};
                    obj.label = item.name;
                    obj.value = item.ip;
                    this.hostName.push(obj);
                  });
                }
              }
              this.handleGetSceneData();
            });
          }
        }
      },
      deep: true,
      immediate: true,
    },

    contentLists: {
      handler(nv, ov) {
        this.includeList = [];
        this.excludeList = [];
        _.forEach(nv, (item) => {
          if (item.relationLeft === 1 && item.keywordLeft) {
            this.includeList.push(item.keywordLeft);
          }
          if (item.relationLeft === 0 && item.keywordLeft) {
            this.excludeList.push(item.keywordLeft);
          }
          if (item.relationRight === 1 && item.keywordRight) {
            this.includeList.push(item.keywordRight);
          }
          if (item.relationRight === 0 && item.keywordRight) {
            this.excludeList.push(item.keywordRight);
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
  beforeMount() {},
  created() {
    const that = this;
    this.resource_id = this.$route.params && this.$route.params.resource_id;

    this.getUser();
  },
  mounted() {
    this.getPieLabel();
  },
  updated: function () {},
  methods: {
    getI18Nn() {
      return getI18N();
    },
    handleGetSceneData() {
      this.$request
        .get(
          '/cr/red_vs_blue/scene/',
          { room_id: this.$route.params && this.$route.params.resource_id },
          { baseURL: '/api/ojj' },
        )

        .then((res) => {
          // 场景id
          this.scene_id = _.get(res, 'data.data.mp_scene_id', '') || '';
        });
    },
    // 获取雷达图label
    getPieLabel() {
      getRadarLabels().then((res) => {
        this.pieLabelArr = _.get(res, 'data.data.labels');
      });
    },
    gethost(val) {
      this.inHost = val;
      this.host = val.join(',');
    },
    websocketSingleFilter(val) {
      const searchIncludeList = [];
      const searchExcludeList = [];
      const searchTimeList = [];
      const searchHost = [];
      this.$set(val, 'jsonResult', JSON.stringify(val.result));
      if (this.inHost.length > 0) {
        _.forEach(this.inHost, (j) => {
          if (val.machine_identification === j[0]) {
            searchHost.push(val);
          }
        });
      } else {
        searchHost.push(val);
      }
      if (this.includeList.length > 0) {
        _.forEach(this.includeList, (j) => {
          if (val.jsonResult.toLowerCase().indexOf(j.toLowerCase()) > -1) {
            searchIncludeList.push(val);
          }
        });
      } else {
        searchIncludeList.push(val);
      }
      if (this.excludeList.length > 0) {
        _.forEach(this.excludeList, (j) => {
          if (val.jsonResult.toLowerCase().indexOf(j.toLowerCase()) === -1) {
            searchExcludeList.push(val);
          }
        });
      } else {
        searchExcludeList.push(val);
      }
      if (this.startTime) {
        const evaluate_time = this.dateToMs(val.create_time);
        if (
          evaluate_time >= this.dateToMs(this.startTime) &&
          evaluate_time <= this.dateToMs(this.endTime)
        ) {
          searchTimeList.push(val);
        }
      } else {
        searchTimeList.push(val);
      }
      return _.intersection(
        searchIncludeList,
        searchExcludeList,
        searchTimeList,
        searchHost,
      );
    },
    dateToMs(date) {
      // 时间格式化
      const result = new Date(date).getTime();
      return result;
    },
    // 添加检索条件
    add() {
      if (this.contentLists.length < 4) {
        const a = {
          relationLeft: '',
          keywordLeft: '',
          relationRight: '',
          keywordRight: '',
        };
        this.contentLists.push(a);
      } else {
        this.$message({
          message: this.$t('m.theSearchTermsHaveReachedTheirUpperLimit'),
          type: 'error',
        });
      }
    },
    // 清除搜索数据
    clearData() {
      this.startTime = null;
      this.endTime = null;
      this.includeList = [];
      this.excludeList = [];
      this.startEndTime = null;
      this.contentLists = [
        {
          relationLeft: '',
          keywordLeft: '',
          relationRight: '',
          keywordRight: '',
        },
      ];
    },
    // 时间检索
    timeChange() {
      if (this.startEndTime) {
        this.startTime = moment(this.startEndTime[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.endTime = moment(this.startEndTime[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      } else {
        this.startTime = null;
        this.endTime = null;
      }
    },
    getUser() {
      // 裁判登录裁定评判查询红蓝对抗学员用户列表
      this.$request
        .get(
          '/cr/red_vs_blue/referee/get_user_list',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.rolesList = res.data.data;
          if (this.rolesList.length) {
            this.studentId = res.data.data[0].resource_id;
          }
        })
        .catch(() => {});
    },
    // 筛选标准
    changeSelect() {
      this.getListData();
      // this. getTaskCount()
    },
    changeSelectUser() {
      this.getListData();
      // this. getTaskCount()
    },
    // 原始事件流查看详情
    openDetails(item) {
      this.dialogView = true;
      // if (typeof item === 'string') {
      try {
        const obj = JSON.parse(item);
        if (typeof obj === 'object' && obj) {
          this.jsonData = JSON.parse(item);
          this.expandDepth = 10;
        } else {
          this.jsonData = item;
          this.expandDepth = 0;
        }
      } catch (error) {
        this.jsonData = item;
        this.expandDepth = 10;
      }
      // }
    },
    // 3个操作
    operationTask(index, row) {
      this.dialogReject = true;
      this.rejectForm.evaluation_id = row.resource_id;
      this.rejectForm.score = row.mission_data.score;
    },
    // 查看任务
    taskCheck(index, row) {
      this.dialogSee = true;
      this.form.evaluation_id = row.id;
      this.form.name = row.mission_data.title;
      this.form.content = row.mission_data.description;
      // this.form.userAnswers = row.submit_data.answer;
      this.form.userAnswers = row.submit_info.user_answer;
      this.form.standardAnswer = row.mission_data.answer;
      this.form.write_up = row.mission_data.write_up;
      this.form.score = row.score;
      this.form.total_score = row.total_score;
      this.form.level_data = JSON.parse(row.mission_data.skill_points);
      this.form.type = row.mission_data.type;
      this.form.answerOption = JSON.parse(row.mission_data.option);
    },
    // 获取所有任务列表
    getListData() {
      const fetchRedHostReqId = U.guid();
      //裁判裁定评判获取学员评估提交记录
      this.$request
        .get(
          '/cr/red_vs_blue/referee/mission_evaluation',
          {
            submitUser: this.submitRecordFilterForm.user,
            evaluateStatus: this.submitRecordFilterForm.assesType,
            roomId: this.resource_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.tableTaskList = res.data.data.list;
        })
        .catch((error) => {
          if (error.response.data.length > 0) {
            this.$message.error(error.response.data[0].message);
          }
        });
    },
    // 获取任务数
    // 裁判评判获取统计数据
    getTaskCount() {
      getTaskCount(this.url, { resource_id: this.crEventData.data.resource_id })
        .then((res) => {
          this.numberOfTasksReported = res.data.data.submit_mission_count;
          this.numberOfSuccessfulTasks = _.get(
            res.data.data,
            'success_missions_count',
            0,
          );
          this.numberOfFailedTasks = res.data.data.fail_missions_count;
          this.numberOfRejectedTasks = res.data.data.reject_missions_count;
          this.numberOfWaitMissions = _.get(
            res.data.data,
            'wait_missions_count',
            0,
          );
        })
        .catch((error) => {
          if (error.response.data.length > 0) {
            this.$message.error(error.response.data[0].message);
          }
        });
    },
    // 提交评判任务
    operationSubmit() {
      this.$refs['rejectForm'].validate((valid) => {
        if (valid) {
          //  裁判人工评估任务
          evaluationSubmit(this.url, {
            room_id: this.resource_id,
            submit_id: this.rejectForm.evaluation_id,
            reason: this.rejectForm.defaultReasons,
            detail: this.rejectForm.realReason,
            score: this.rejectForm.judgeScore ? this.rejectForm.judgeScore : 0,
            evaluate_status: parseInt(this.rejectForm.evaluate_status),
          })
            .then((res) => {
              this.$message({
                message: this.$t('m.successful'),
                type: 'success',
              });
              this.getListData();
              this.rejectForm.evaluation_id = '';
              this.rejectForm.defaultReasons = 1;
              this.rejectForm.realReason = '';
              this.rejectForm.score = '';
              this.rejectForm.judgeScore = '';
              this.rejectForm.evaluate_status = '';
              this.dialogReject = false;
              this.getTaskCount();
            })
            .catch((error) => {
              errorMessage(error, this);
            });
        }
      });
    },

    changeAssess() {
      this.showThis = !this.showThis;
      this.$message({
        message: '操作成功',
        type: 'success',
      });
    },
    open() {
      this.dialogTableVisible = false;
      this.$message({
        message: '操作成功',
        type: 'success',
      });
    },
    resetForm(formName) {
      this.rejectForm.defaultReasons = 1;
      this.rejectForm.realReason = '';
      this.rejectForm.judgeScore = '';
      this.rejectForm.evaluate_status = '';
      this.dialogReject = false;
    },
  },
};
</script>

<style lang="scss">
.assess {
  width: 100%;
  height: 100%;
  background: var(--bg-color-2);
  overflow: hidden;
  .cb-scrollbar {
    height: 100%;
  }
  .com-icon-swapper {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .assess-middle {
    width: 100%;
    height: calc(100% - 170px);
    display: flex;
    justify-content: center;
  }
  .assess-top {
    height: 170px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    .div-box {
      width: 18%;
      height: 128px;
      padding: 30px 0;
      box-sizing: border-box;
      margin-top: 21px;
      .imgleft {
        width: 84px;
        padding-left: 40px;
      }
      .numright {
        width: calc(100% - 150px);
        position: relative;
        margin-left: 20px;
        font-size: 30px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        .number-color,
        .number-color-orange,
        .number-color-red,
        .number-color-green,
        .number-color-withe {
          .one-icon,
          .one-icon-withe,
          .red,
          .green,
          .orange {
            position: absolute;
            bottom: 25px;
            height: 0;
            font-size: 12px;
          }
        }
        .number-color,
        .one-icon {
          height: 33px;
          padding-bottom: 18px;
          font-size: 30px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
        .number-color-withe,
        .one-icon-withe {
          height: 33px;
          padding-bottom: 18px;
          font-size: 30px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
        .number-color-green,
        .green {
          height: 33px;
          padding-bottom: 18px;
          font-size: 30px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
        .number-color-red,
        .red {
          height: 33px;
          padding-bottom: 18px;
          font-size: 30px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
        .number-color-orange,
        .orange {
          height: 33px;
          padding-bottom: 18px;
          font-size: 30px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
        .one-texte {
          margin-top: 10px;
          width: 100%;
          height: 19px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 300;
        }
      }
    }
    .first-box {
      background: none;
      box-shadow: none;
      margin-top: 10 !important;
      .number-color {
        font-size: 40px !important;
      }
    }
  }
  .assess-content {
    width: 50%;
    border-radius: 6px;
    .midd-title {
      width: 100%;
      height: 42px;
      padding-left: 30px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
    .task-assess {
      height: calc(100% - 125px);
    }
    .selc-top {
      height: 45px;
      margin: 10px 0 10px 44px;
      label {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        margin-right: 20px;
      }
      .cb-input__inner {
        width: 200px;
      }
    }
    .end {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
    .btn-tow {
      img {
        display: block;
        margin: 2px 5px 0 17px;
      }
    }
    .btn {
      img {
        display: block;
        margin: 3px 5px 0 0;
      }
    }
    .btn,
    .btn-tow {
      cursor: pointer;

      span {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
      }
    }
    ::v-deep.cb-scrollbar {
      height: 100%;
      .name-wrapper {
        display: inline-block;
      }
      .cb-scrollbar__wrap {
        overflow-x: hidden !important;
      }
      .cb-scrollbar__bar.is-horizontal {
        height: 0 !important;
      }
    }
  }
  .assess-bottom {
    width: 50%;
    overflow: hidden;
    .leftFlow {
      float: left;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .midd-title {
        width: 100%;
        height: 42px;
        padding-left: 30px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
      }
      .search-content {
        width: 100%;
        padding: 10px 0 10px 30px;
        box-sizing: border-box;
        .common-search {
          width: 100%;
          min-height: 40px;
          line-height: 40px;
          margin-bottom: 10px;
          overflow: hidden;
          .elc-date-picker {
            .el-range-editor.cb-input__inner {
              height: 40px;
              border-radius: 2px;
            }
            .el-range-separator {
              position: relative;
            }
            .el-date-editor .el-range__icon {
              position: relative;
              font-size: 18px;
              margin-left: -2px;
            }
          }
          .left-span {
            display: inline-block;
            width: 50px;
            font-size: 14px;
          }
          .right-time {
            width: calc(100% - 50px);
          }
          .query-time {
            width: 51%;
            display: flex;
            align-items: center;
          }
          .allclose {
            width: 40%;
          }
        }

        .content-common {
          display: flex;
          margin-bottom: 5px;
          .operation-boxs {
            width: calc(100% - 95px);
          }
          .btn-boxs {
            width: 90px;
            display: flex;
            align-items: center;
          }
          &:last-child {
            margin-bottom: 0;
          }
          .search-select {
            width: 25% !important;
          }
          .search-input {
            width: calc(30% - 65px);
          }
          .and {
            margin: 0 10px;
            color: #c0cce7;
          }
          .btn_start {
            margin: 6px 0 0 10px;
            width: 80px;
            height: 26px;
            box-sizing: border-box;
            border-radius: 2px;
            line-height: 0;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            font-family: Microsoft YaHei;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              margin: 8px 8px 0 0;
            }
          }
          .btn_radius {
            width: calc(100% - 18px);
            padding: 0 9px;
            height: 100%;
            border-radius: 15px;
            background: #193346;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            font-family: Microsoft YaHei;
            img {
              margin: 8px 8px 0 0;
            }
            span {
              background: linear-gradient(
                180deg,
                rgba(57, 239, 255, 1) 0%,
                rgba(58, 165, 255, 1) 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }
        .search-btn {
          text-align: center;
          .shell-search-btn {
            position: relative;
            width: 118px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            border-radius: 2px;
            text-align: center;
            ::v-deep span {
              vertical-align: middle;
            }
          }
          .clear-search-btn {
            position: relative;
            padding: 12px 20px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            border-radius: 2px;
            text-align: center;
          }
        }
      }
      .left-content {
        height: 100%;
        flex-grow: 1;
        overflow: hidden;
        .table-right-div {
          img {
            vertical-align: middle;
          }
          span {
            font-size: 12px;
            margin-left: 5px;
            background: linear-gradient(
              180deg,
              rgba(57, 239, 255, 1) 0%,
              rgba(58, 165, 255, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .event-color {
          width: 100%;
          height: 100%;
        }
        .name {
          width: 100%;
          height: 100%;
        }
        .color-item {
          cursor: pointer;
          width: calc(100% - 86px);
          padding: 6px 0 7px 86px;
          .left-time {
            display: inline-block;
            width: 15%;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(0, 150, 255, 1);
          }
          .left-middle,
          .left-event {
            display: inline-block;
            width: 10%;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(237, 242, 255, 1);
          }
          .left-event {
            display: inline-block;
            width: 66%;
          }
          .btn {
            display: inline-block;
            width: 4%;
            margin-left: 30px;
            img {
              padding: 0 5px 0 0;
            }
            span {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(36, 44, 59, 1);

              background: linear-gradient(
                180deg,
                rgba(57, 239, 255, 1) 0%,
                rgba(58, 165, 255, 1) 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }

        .name .color-item:nth-child(odd) {
          background: rgba(132, 144, 159, 0.05);
        }

        ::v-deep.cb-scrollbar {
          height: 100%;
          border-radius: 8px;
          ::v-deep .cb-scrollbar__wrap {
            height: 100%;
            overflow-x: hidden !important;
          }
          ::v-deep.cb-scrollbar__bar.is-horizontal {
            height: 0;
          }
        }
        .el-col {
          margin-bottom: 3px;
        }
        .left-ip {
          font-size: 12px;
          color: #4cc5a2;
        }
      }
    }
  }

  //操作弹框
  .referee-dialogReject {
    background-color: rgba(0, 0, 0, 0.3);
    .cb-dialog {
      width: 690px !important;
      height: 500px !important;
      margin-top: 10% !important;
      .cb-dialog__body {
        padding: 0 40px;
      }
      .cb-form-item__content {
        margin-bottom: 20px;
        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
          color: rgba(192, 204, 231, 0.5);
        }
        .cb-input {
          width: 100%;
        }
      }
      .cb-dialog__title {
        color: white;
      }
      .cb-select,
      .cb-input__inner {
        width: 100%;
        border-radius: 20px;
      }
      .cb-input__inner {
        border-radius: 2px;
      }
      .cb-form-item {
        padding-top: 5px;
        margin-bottom: 5px;
      }
      .cb-form-item__label {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        text-align: left;
      }
      .cb-dialog__footer {
        text-align: center;
        left: 0 !important;
        .elc-dialog-btn-ensure {
          width: 20% !important;
        }
        .elc-dialog-btn-cancel {
          width: 20% !important;
        }
      }
    }
    .cb-dialog__header {
      padding: 23px 0 23px 29px !important;
      vertical-align: none !important;
    }
    .realReasonLeft {
      width: 100%;
    }
    .realReasonRight {
      width: 40%;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(192, 204, 231, 0.5);
      position: absolute;
      top: 0;
      right: -107px;
    }
    .enRealReasonRight {
      right: -34px;
    }
  }
  //查看弹框
  .referee-dialogView {
    .cb-dialog {
      width: 690px !important;
      height: 600px !important;
      margin-top: 10% !important;
      .cb-dialog__header {
        text-align: left !important;
        padding: 23px 0 23px 29px !important;
        vertical-align: none !important;
        border-bottom: 1px solid #434c6e;
        margin-bottom: 10px;
        .cb-dialog__title {
          color: white;
        }
      }
      .cb-dialog__body {
        height: 450px;
        color: #606266;
        font-size: 14px;
        ::v-deep.jv-container.jv-light {
          background: transparent !important;
        }

        .jv-container.jv-light .jv-key,
        .jv-container.jv-light .jv-item.jv-array,
        .jv-container.jv-light .jv-item.jv-object {
          color: #fff !important;
        }
        .cb-scrollbar {
          height: 100%;
          border-radius: 8px;
          .cb-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
      }
    }
  }
  //查看任务详情弹窗
  .referee-dialogSee {
    .cb-dialog {
      max-height: 90%;
      background-color: transparent;
      .cb-dialog__body {
        padding: 0 40px;
        height: calc(100% - 100px) !important;
        .cb-scrollbar {
          height: 100%;
          border-radius: 8px;
          .cb-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
      }
      .cb-input__inner {
        border-radius: 2px;
      }

      .cb-dialog__header {
        padding: 23px 0 23px 29px !important;
        vertical-align: none !important;
        margin-bottom: 10px;
      }
      .cb-input__inner {
        border-radius: 2px;
      }
      .cb-form-item__label {
        text-align: left;
      }
      .cb-dialog__footer {
        text-align: center;
        height: 0 !important;
        .dialog-footer {
          padding-top: 30px;
          left: 0 !important;
          .elc-dialog-btn-ensure {
            width: 20% !important;
          }
          .elc-dialog-btn-cancel {
            width: 20% !important;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.assess {
  .host-title {
    padding-left: 0;
  }
}
</style>
<style lang="scss" scoped>
.color-cyan {
  color: var(--cyan-color);
}
.color-red {
  color: var(--red-color);
}
.color-yellow {
  color: var(--orange-color);
}
</style>
