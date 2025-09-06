<template>
  <div class="assess-detail">
    <div class="left-wrap">
      <block :title="$t('rbt.answerKey')"></block>
      <cb-scrollbar height="520px">
        <CbMarkdown
          v-model="formInfo.write_up"
          type="viewer"
          v-if="formInfo.write_up"
        />
        <div
          v-else
          class="empty-comp"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page ref="emptyComp" />
        </div>
      </cb-scrollbar>
    </div>
    <div class="right-wrap">
      <cb-scrollbar height="600px">
        <cb-form
          ref="formRef"
          :model.sync="formInfo"
          :rules="rules"
          :label-width="language === 'en-US' ? '150px' : '100px'"
          label-position="right"
          class="formStyle"
        >
          <cb-form-item :label="$t('m.missionTitle') + '：'">
            <div>{{ formInfo.name }}</div>
          </cb-form-item>
          <cb-form-item :label="$t('m.taskContent') + '：'">
            <div>{{ formInfo.content }}</div>
          </cb-form-item>
          <cb-form-item :label="$t('m.userAnswers') + '：'">
            <!-- 红蓝用户答案 -->
            <div class="userAnswer">
              <cb-markdown
                v-model="formInfo.userAnswers"
                type="viewer"
                class="markDownCommon"
              />
            </div>
          </cb-form-item>
          <cb-form-item :label="$t('m.standardAnswer') + '：'">
            <div class="standardAnswer">{{ formInfo.standardAnswer }}</div>
          </cb-form-item>
          <cb-form-item :label="$t('m.skillPoint') + '：'">
            <div class="skill-wrap">
              <cb-echart-radar
                v-if="pieLabelArr.length > 0"
                ref="rader"
                radarShape="sharp"
                :indicator="pieLabelArr"
                :radarData="formInfo.level_data"
                :axisName="axisName"
              ></cb-echart-radar>
            </div>
          </cb-form-item>
          <cb-form-item
            :label="$t('assessment.assessResult') + '：'"
            prop="evaluate_status"
          >
            <cb-radio-group
              v-model="formInfo.evaluate_status"
              @change="resultChange"
            >
              <cb-radio :label="1">{{ $t('m.success') }}</cb-radio>
              <cb-radio :label="2">{{ $t('m.fail') }}</cb-radio>
              <cb-radio :label="3">{{ $t('m.reject') }}</cb-radio>
            </cb-radio-group>
          </cb-form-item>
          <cb-form-item
            :label="$t('m.presuppositionReason') + '：'"
            prop="defaultReasons"
            style="margin-top: 10px"
          >
            <cb-radio-group v-model="formInfo.defaultReasons">
              <cb-radio :label="1">{{
                this.$t('m.insufficientEventSupport')
              }}</cb-radio>
              <cb-radio :label="2">{{
                this.$t('m.eventSupportSufficient')
              }}</cb-radio>
            </cb-radio-group>
          </cb-form-item>
          <cb-form-item
            :label="$t('m.detailAssess') + '：'"
            prop="detail"
            style="margin: 16px 0"
          >
            <cb-input
              v-model="formInfo.detail"
              type="textarea"
              :placeholder="$t('referee.pleaseEnterAssessDetails')"
              :rows="2"
            />
          </cb-form-item>
          <cb-form-item
            :label="$t('referee.assessScore') + '：'"
            prop="assessScore"
            v-if="formInfo.evaluate_status === 3 ? false : true"
          >
            <div>
              <cb-input
                v-model="formInfo.assessScore"
                :placeholder="$t('referee.pleaseEnterAreassScore')"
                ><template slot="append">{{ $t('referee.points') }}</template>
              </cb-input>
            </div>
          </cb-form-item>
        </cb-form>
      </cb-scrollbar>
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
import { getLanguage } from '@cyber/helper';
import validateUtils from '@/utils/validate';
import { cutStr } from '@/utils/index.js';
import emptyPage from '@/pages/web/Empty';
export default {
  components: {
    block,
    emptyPage,
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {},
    },
    pieLabelData: {
      type: Array,
      default: () => [],
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
        if (value > this.formInfo.score) {
          callback(
            new Error(this.$t('m.theScoreMustNotExceed') + this.formInfo.score),
          );
        } else {
          callback();
        }
      }
    };
    return {
      language: getLanguage(),
      rules: {
        evaluate_status: [
          {
            required: true,
            message: this.$t('referee.assessResultCannotBeEmpty'),
            trigger: ['blur', 'change'],
          },
        ],
        defaultReasons: [
          {
            required: true,
            message: this.$t('m.pleaseSelectPresetReason'),
            trigger: ['blur', 'change'],
          },
        ],
        detail: [
          {
            required: true,
            message: this.$t('referee.pleaseEnterAssessDetails'),
            trigger: 'blur',
          },
          {
            min: 1,
            max: 100,
            message: this.$t('m.assessScoreRules'),
            trigger: 'blur',
          },
        ],
        assessScore: [
          {
            required: true,
            message: this.$t('referee.assessScoreCannotBeEmpty'),
            trigger: ['change', 'blur'],
          },
          { validator: checkScore, trigger: ['change', 'blur'] },
        ],
      },
    };
  },
  computed: {
    axisName() {
      return {
        formatter: (text) => {
          var strlength = validateUtils.validateLength(text);
          var maxlength = 10;
          if (strlength > maxlength) {
            text = cutStr(text, maxlength) + '...';
          }
          return text;
        },
      };
    },
    pieLabelArr() {
      const arrs = [];
      _.forEach(this.pieLabelData, (item, index) => {
        if (index === 0) {
          arrs.push({
            name: item,
            max: 5,
            axisLabel: {
              align: 'center',
              verticalAlign: 'top',
              show: true,
              fontSize: 14,
              color: this.$themed('neutral5'),
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
      return arrs;
    },
  },
  created() {},
  mounted() {},
  methods: {
    validate(callback) {
      //这个form是子组件内部  的 ref="formRef"
      this.$refs.formRef.validate((valid) => {
        callback(valid);
      });
    },
    resultChange() {
      this.formInfo.defaultReasons = '';
      this.formInfo.detail = '';
      this.formInfo.assessScore = '';
    },
  },
};
</script>
<style lang="scss" scoped>
.assess-detail {
  display: flex;
  height: 100%;
  .left-wrap {
    width: 50%;
    border-right: 1px solid var(--neutral0);

    padding: 24px 12px 12px 24px;
  }
  .right-wrap {
    width: 50%;
    padding: 0 0 0 16px;
    .userAnswer {
      color: var(--primary-color);
    }
    .standardAnswer {
      color: var(--primary-color);
    }
    .skill-wrap {
      height: 230px;
    }
  }
}

// 表单样式覆盖
.formStyle {
  ::v-deep.el-form {
    padding: 16px 16px 16px 0;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  // ::v-deep.el-form .el-form-item {
  //   margin-bottom: 8px;
  // }

  ::v-deep.el-form .el-form-item .el-form-item__label {
    color: var(--neutral7);
  }
}
</style>
