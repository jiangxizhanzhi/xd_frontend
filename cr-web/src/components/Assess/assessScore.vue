<template>
  <div id="assessScore">
    <cb-form
      ref="formAssessScore"
      :model="form"
      :rules="rules"
      :label-width="language === 'en' ? '130px' : '132px'"
    >
      <cb-form-item :label="$t('m.missionTitle')">
        <cb-input v-model="form.name" disabled />
      </cb-form-item>
      <cb-form-item :label="$t('m.content')">
        <div
          v-if="form.type === 1 || form.type === 2"
          id="assessScoreContent"
          style="border-radius: 2px"
          class="markdownDiv"
        >
          <div>
            <span style="margin: 0 15px">{{ form.content }}</span>
          </div>
          <div v-for="(item, index) in form.answerOption" :key="index">
            <span style="margin: 0 15px">{{ item.optionLabel }}</span>
            <span>{{ item.optionValue }}</span>
          </div>
        </div>
        <CbMarkdown
          v-else
          ref="mdContent"
          v-model="form.content"
          type="viewer"
          class="markdownDiv"
        />
      </cb-form-item>
      <cb-form-item :label="$t('m.userAnswers')">
        <!--<mavon-editor-->
        <!--v-show="form.userAnswers.match(pattern)"-->
        <!--ref="md"-->
        <!--style="color: #fff; border: 1px solid #3C4464; background-color: #212740 !important;"-->
        <!--:autofocus="false"-->
        <!--:editable="false"-->
        <!--:toolbars-flag="false"-->
        <!--:subfield="false"-->
        <!--default-open="preview"-->
        <!--v-text="form.userAnswers"-->
        <!--/>-->
        <CbMarkdown
          ref="md"
          v-model="form.userAnswers"
          type="viewer"
          class="markdownDiv"
        />
      </cb-form-item>
      <cb-form-item :label="$t('m.standardAnswer')">
        <cb-input
          v-model="form.standardAnswer"
          type="textarea"
          class="elc-input"
          :rows="2"
          disabled
        />
      </cb-form-item>
      <cb-form-item :label="$t('m.viewAnswer')">
        <CbMarkdown
          ref="md"
          v-model="form.write_up"
          default-open="preview"
          type="viewer"
          class="markdownDiv"
        />
      </cb-form-item>
      <cb-form-item :label="$t('m.skillPoint')">
        <div class="skill-left">
          <cb-echart-radar
            v-if="pieLabelData.length > 0"
            ref="rader"
            radarShape="sharp"
            :indicator="pieLabelData"
            :radarData="form.level_data"
          ></cb-echart-radar>
          <!-- <skill-chart
            v-if="pieLabelData.length"
            :skill-data="form.level_data"
            :pieLabelData="pieLabelData"
          /> -->
        </div>
        <div class="skill-right">
          <div class="score">{{ $t('m.fraction') }}</div>
          <div class="realScore">
            <span>{{ form.score }}</span>
          </div>
        </div>
      </cb-form-item>
      <div v-if="showReject">
        <cb-form-item :label="$t('m.evaluationResult')" prop="submitResultType">
          <cb-select
            v-model="form.submitResultType"
            :options="submitResultTypeOptions"
            @change="changeAssess()"
          />
        </cb-form-item>
        <cb-form-item
          v-if="showReason"
          :label="$t('m.presuppositionReason')"
          prop="submitResultReasons"
        >
          <cb-select
            v-model="form.submitResultReasons"
            :options="selectReasons"
            :placeholder="$t('m.pleaseChooseReason')"
          />
        </cb-form-item>
        <cb-form-item
          v-if="showDetails"
          :label="$t('m.rulingDetails')"
          prop="submitResultRealReason"
        >
          <cb-input
            v-model="form.submitResultRealReason"
            type="textarea"
            class="elc-input"
            :rows="4"
          />
        </cb-form-item>
        <cb-form-item
          v-if="showScore"
          :label="$t('m.scoreChange')"
          prop="submitResultJudgeScore"
        >
          <cb-input
            v-model="form.submitResultJudgeScore"
            class="fl elc-input"
            style="width: 45%"
          />
          <div class="fl realReasonRight">
            <span>（</span>
            <span>{{ $t('m.fullMarks') }}</span>
            <span>{{ form.score }}</span>
            <span>）</span>
          </div>
        </cb-form-item>
      </div>
    </cb-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { errorMessage } from '@/assets/js/tools.js';
import 'mavon-editor/dist/css/index.css';
import SkillChart from '@/components/TaskEditor/skill_chart.vue';
import { getRadarLabels } from '@/api/common';

export default {
  name: 'AssessScore',
  components: {
    SkillChart,
  },
  props: {
    taskData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    var checkScore = (rule, value, callback) => {
      // if (!Number.isInteger(value)) {
      if (
        isNaN(value) ||
        value.trim === '' ||
        !/^\d+(?=\.{0,1}\d+$|$)/.test(value)
      ) {
        callback(new Error(this.$t('m.pleaseEnterPositiveInteger')));
      } else {
        if (value > this.form.score) {
          callback(
            new Error(this.$t('m.theScoreMustNotExceed') + this.form.score),
          );
        } else {
          callback();
        }
      }
    };
    return {
      pieLabelData: [],
      pattern: /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g,
      form: {
        evaluation_id: '',
        name: '',
        content: '',
        userAnswers: '',
        standardAnswer: '',
        write_up: '',
        region: '',
        realReason: '',
        score: 0,
        level_data: [],
        type: '',
        answerOption: [],
        submitResultType: '', // 评估结果
        submitResultReasons: null, // 预设原因 TODO
        submitResultRealReason: '', // 裁决详情
        submitResultJudgeScore: '', // 分数改判
      },
      submitResult: {
        type: null,
      },
      selectReasons: [
        {
          value: 0,
          label: this.$t('m.eventSupportSufficient'),
        },
        {
          value: 1,
          label: this.$t('m.insufficientEventSupport'),
        },
      ],
      submitResultTypeOptions: [
        {
          value: 1,
          label: this.$t('m.success'),
        },
        {
          value: 2,
          label: this.$t('m.fail'),
        },
        {
          value: 3,
          label: this.$t('m.reject'),
        },
      ],
      showReject: false,
      showReason: false,
      showDetails: false,
      showScore: false,
      resource_id: this.$route.params && this.$route.params.resource_id,
      rules: {
        submitResultType: [
          {
            required: true,
            message: this.$t('m.pleaseSelectAssessResult'),
            trigger: 'change',
          },
        ],
        submitResultReasons: [
          {
            required: true,
            message: this.$t('m.pleaseSelectPresetReason'),
            trigger: 'change',
          },
        ],
        submitResultRealReason: [
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
        submitResultJudgeScore: [
          {
            required: true,
            message: this.$t('m.scoreCannotBeEmpty'),
            trigger: ['change', 'blur'],
          },
          { validator: checkScore, trigger: ['change', 'blur'] },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['language']),
  },
  watch: {
    taskData: {
      handler(val, oldval) {
        if (val !== oldval) {
          this.form.evaluation_id = val.resource_id;
          this.form.name = val.mission_data.title;
          this.form.content = val.mission_data.description;
          this.form.userAnswers = val.submit_info.user_answer;
          this.form.standardAnswer = val.mission_data.answer;
          this.form.write_up = val.mission_data.write_up;
          this.form.score = val.mission_data.score;
          this.form.level_data = JSON.parse(val.mission_data.skill_points);
          this.form.type = val.mission_data.type;
          this.form.answerOption = JSON.parse(val.mission_data.option);
          this.showReject = true;
          if (val.evaluate_status === 1 || val.evaluate_status === 2) {
            this.showReason = true;
            this.showDetails = true;
            this.showScore = true;
            this.form.submitResultType = val.evaluate_status;
            this.form.submitResultReasons = val.reason == null ? 0 : val.reason; // TODO
            this.form.submitResultRealReason = val.detail;
            this.form.submitResultJudgeScore = val.score;
          } else if (val.evaluate_status === 3) {
            this.showReason = true;
            this.showDetails = true;
            this.showScore = false;
            this.form.submitResultType = val.evaluate_status;
            this.form.submitResultReasons = val.reason == null ? 0 : val.reason; // TODO
            this.form.submitResultRealReason = val.detail;
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.getRadarLabelsList();
  },
  methods: {
    // 获取技能标签
    getRadarLabelsList() {
      getRadarLabels().then((res) => {
        const data = _.get(res, 'data.data.labels');
        const arrs = [];
        _.forEach(data, (item, index) => {
          if (index === 0) {
            arrs.push({
              name: item,
              max: 5,
              axisLabel: {
                align: 'center',
                verticalAlign: 'top',
                show: true,
                fontSize: 14,
                color: '#B8C4DF',
                showMaxLabel: true, //不显示最大值，即外圈不显示数字30
                showMinLabel: true, //显示最小数字，即中心点显示0
              },
            });
          } else {
            arrs.push({
              name: item,
              max: 5,
            });
          }
        });
        this.pieLabelData = arrs;
      });
    },
    // 切换评估结果select
    changeAssess() {
      // 1：成功
      // 2：失败
      // 3：驳回
      this.showReason = true;
      this.showDetails = true;
      this.form.submitResultReasons = null;
      this.form.submitResultRealReason = '';
      this.form.submitResultJudgeScore = '';
      if (this.form.submitResultType === 3) {
        this.showScore = false;
      } else {
        this.showScore = true;
      }
    },
    // 提交审核
    validateAssessForm() {
      this.$refs['formAssessScore'].validate((valid) => {
        if (valid) {
          this.$request
            .post(
              `/cr/training_team/training_team/submit_evaluation`,
              {
                submit_id: this.form.evaluation_id,
                room_id: this.resource_id,
                evaluate_status: this.form.submitResultType,
                reason: this.form.submitResultReasons,
                detail: this.form.submitResultRealReason,
                score: this.form.submitResultJudgeScore
                  ? this.form.submitResultJudgeScore
                  : 0,
              },
              {
                baseURL: '/api/ojj',
              },
            )
            .then((res) => {
              this.$message.success(this.$t('m.submitSuccess'));
              this.$emit('refershData');
            })
            .catch((error) => {
              errorMessage(error, this);
            });
        } else {
          return;
        }
      });
    },
  },
};
</script>

<style lang="scss">
#assessScore {
  width: 100%;
  height: 100%;
  margin-right: 3px;
  .markdownDiv {
    background-color: var(--neutral0);
  }
  .skill-left {
    float: left;
    height: 240px;
    width: 53%;
  }
  .skill-right {
    float: left;
    width: 40%;
    padding-left: 31;
    .realScore {
      width: 112px;
      height: 92px;
      background: var(--primary-color-2);
      font-size: 56px;
      text-align: center;
      line-height: 92px;
      margin-left: 60px;

      span {
        color: var(--primary-color);
      }
    }
  }
  .v-note-wrapper {
    background: transparent !important;
    min-height: 70px !important;
  }
  .markdown-body table tr {
    background-color: transparent !important;
  }
  .markdown-body .highlight pre,
  .markdown-body pre {
    background-color: #0f4377 !important;
  }
  .markdown-body em {
    font-style: italic;
  }
  .markdown-body h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    border-bottom: 0 !important;
  }
  .v-note-wrapper .v-note-panel.shadow {
    /*border: transparent;*/
    box-shadow: none;
  }
  .v-note-wrapper .v-note-op.shadow {
    border-bottom: 1px dashed #3b4465;
  }
  .v-note-wrapper .v-note-op .v-left-item .op-icon:hover,
  .v-note-wrapper .v-note-op .v-right-item .op-icon.selected,
  .v-note-wrapper .v-note-op .v-right-item .op-icon:hover {
    background: transparent !important;
    color: #dbdfeb;
  }
}
</style>
