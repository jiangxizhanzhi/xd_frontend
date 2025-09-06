<template>
  <div class="correct-detail" id="correct-detail">
    <div class="header">
      <div class="class">
        {{ $t('m.currentClass') }}：<span class="class-name">{{
          detailData && detailData.lesson_name
        }}</span>

        ({{ $t('m.totalPage') }}{{ detailData && detailData.practice_count
        }}{{ $t('m.topic') }})
      </div>
      <div>
        {{ $t('m.currentStudent') }}：{{
          detailData && detailData.submit_user_name
        }}
      </div>
      <div class="result">
        {{ $t('m.oqCorrectRate') }}({{ $t('m.objectiveQuestion') }})：<span
          class="right-count"
          >{{ detailData && getRightCount(detailData.accuracy) }}</span
        >/{{ detailData && getTotalCount(detailData.accuracy) }}
      </div>
      <div class="correct" :style="{ width: rightWidth }">
        <cb-form
          ref="formRef"
          :url="url"
          :baseURL="baseURL"
          :contentType="contentType"
          :model="model"
          :rules="rules"
          :inline="true"
        >
          <cb-form-item :label="$t('m.evaluation')" prop="level">
            <cb-select
              v-model="model.level"
              :options="options"
              :placeholder="$t('m.PlzSelectAnEvaluationResult')"
              @change="handleChange"
            ></cb-select>
          </cb-form-item>
          <cb-form-item>
            <cb-button button-type="confirm" @click="submitForm" mr>{{
              $t('button.confirm')
            }}</cb-button>
          </cb-form-item>
        </cb-form>
      </div>
    </div>
    <div class="class-content cyber-scroll-bar">
      <div v-if="singleData">
        <div class="title">
          <!-- {{ $t('m.practiceIndex.1')
          }} -->
          {{ $t('questionType.singleSelectionType') }}
        </div>
        <div
          class="content"
          v-for="(item, index) in singleData && singleData.practice_bos"
          :key="item.resource_id"
        >
          <question-title :content="item.content" :index="index" />
          <single-choice :choice="dealWithChoice(item.option)" />
          <all-answer
            :right-answer="item.answer"
            :solved="item.resolved_detail ? item.resolved_detail.solved : false"
            :user-answer="
              item.resolved_detail ? item.resolved_detail.user_answer : ''
            "
          />
          <rate
            :correct="
              item.resolved_detail ? item.resolved_detail.solved : false
            "
          />
        </div>
      </div>
      <div v-if="fillBlank">
        <div class="title">
          <!-- {{ $t(`m.practiceIndex.${fillBankIndex}`)
          }} -->
          {{ $t('questionType.blankType') }}
          <div class="warning-info">{{ $t('m.fillBankNoJudge') }}</div>
        </div>
        <div
          class="content"
          v-for="(item, index) in fillBlank && fillBlank.practice_bos"
          :key="item.resource_id"
        >
          <question-title :content="item.title" :index="index" />
          <!-- <other-question :content="item.content" /> -->
          <all-answer
            :right-answer="item.answer && dealWithFillBlank(item.answer)"
            :solved="item.resolved_detail ? item.resolved_detail.solved : false"
            :user-answer="
              item.resolved_detail
                ? dealWithFillBlankUserAnswer(item.resolved_detail.user_answer)
                : ''
            "
          />
        </div>
      </div>
      <div v-if="judgment">
        <div class="title">
          <!-- {{ $t(`m.practiceIndex.${judgeIndex}`)
          }} -->
          {{ $t('questionType.judgeType') }}
        </div>
        <div
          class="content"
          v-for="(item, index) in judgment && judgment.practice_bos"
          :key="item.resource_id"
        >
          <question-title :content="item.content" :index="index" />
          <judgement-question />
          <all-answer
            :right-answer="judgeAnswer(item.answer)"
            :solved="item.resolved_detail ? item.resolved_detail.solved : false"
            :user-answer="
              item.resolved_detail
                ? judgeAnswer(item.resolved_detail.user_answer)
                : ''
            "
          />
          <rate
            :correct="
              item.resolved_detail ? item.resolved_detail.solved : false
            "
          />
        </div>
      </div>
      <div v-if="multiple">
        <div class="title">
          <!-- {{ $t(`m.practiceIndex.${mutiIndex}`)
          }} -->
          {{ $t('questionType.multiSelectionType') }}
        </div>
        <div
          class="content"
          v-for="(item, index) in multiple && multiple.practice_bos"
          :key="item.resource_id"
        >
          <question-title :content="item.content" :index="index" />
          <multiple-choice :choice="dealWithChoice(item.option)" />
          <all-answer
            :right-answer="item.answer"
            :solved="item.resolved_detail ? item.resolved_detail.solved : false"
            :user-answer="
              item.resolved_detail ? item.resolved_detail.user_answer : ''
            "
          />
          <rate
            :correct="
              item.resolved_detail ? item.resolved_detail.solved : false
            "
          />
        </div>
      </div>

      <div v-if="shortAnswer">
        <div class="title">
          <!-- {{ $t(`m.practiceIndex.${shorAnswerIndex}`)
          }} -->
          {{ $t('questionType.shortAnswerType') }}
          <div class="warning-info">{{ $t('m.shortAnswerNoJudge') }}</div>
        </div>
        <div
          class="content"
          v-for="(item, index) in shortAnswer && shortAnswer.practice_bos"
          :key="item.resource_id"
        >
          <question-title :content="item.title" :index="index" />
          <!-- <other-question :content="item.content" /> -->
          <all-answer
            :right-answer="item.answer"
            :solved="item.resolved_detail ? item.resolved_detail.solved : false"
            :user-answer="
              item.resolved_detail ? item.resolved_detail.user_answer : ''
            "
          />
        </div>
      </div>
      <div v-if="operation">
        <div class="title">
          <!-- {{ $t(`m.practiceIndex.${operationIndex}`)
          }} -->
          {{ $t('questionType.operateType') }}
        </div>
        <div
          class="content"
          v-for="(item, index) in operation && operation.practice_bos"
          :key="item.resource_id"
        >
          <question-title :content="item.title" :index="index" />
          <other-question :content="item.content" />
          <all-answer
            :right-answer="item.answer"
            :solved="item.resolved_detail ? item.resolved_detail.solved : false"
            :user-answer="
              item.resolved_detail ? item.resolved_detail.user_answer : ''
            "
          />
          <rate
            :correct="
              item.resolved_detail ? item.resolved_detail.solved : false
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  toRefs,
  watch,
  onMounted,
  computed,
  nextTick,
} from '@vue/composition-api';
import { getI18N, getLanguage } from '@cyber/helper';
import QuestionTitle from './question-title.vue';
import SingleChoice from './single-choice.vue';
import JudgementQuestion from './judgement-question.vue';
import MultipleChoice from './multiple-choice.vue';
import OtherQuestion from './other-question.vue';
import AllAnswer from './all-answer.vue';
import Rate from './rate.vue';
const genIndex = (params) => {
  let idx = 1;
  for (const arr of params) {
    if (arr && arr.practice_bos && arr.practice_bos.length > 0) {
      idx += 1;
    }
  }
  return idx;
};
export default {
  components: {
    QuestionTitle,
    SingleChoice,
    JudgementQuestion,
    MultipleChoice,
    OtherQuestion,
    AllAnswer,
    Rate,
  },
  props: {
    detailData: {
      type: Object,
      default() {
        return null;
      },
    },
    userId: {
      type: String,
      default: '',
    },
  },
  setup(props, { root, emit }) {
    let formRef = ref(null);
    const i18n = getI18N();
    let language = getLanguage();
    const state = reactive({
      rightWidth: language === 'zh-CN' ? '370px' : '414px',
      options: [
        {
          label: i18n.t('m.good'),
          value: 1,
        },
        {
          label: i18n.t('m.well'),
          value: 2,
        },
        {
          label: i18n.t('m.middle'),
          value: 3,
        },
        {
          label: i18n.t('m.bad'),
          value: 4,
        },
      ],
      url: '/oj/admin/course/classroom/practice/mark/',
      baseURL: '/api/ojj',
      contentType: 'application/json',
      model: {
        level: '',
        lesson_id: '',
        user_id: '',
        classroom_id: '',
      },
      rules: {
        level: [
          // {
          //   required: true,
          //   message: getI18N().t('m.PlzSelectAnEvaluationResult'),
          // },
        ],
      },
      singleData: {},
      judgment: {},
      multiple: {},
      fillBlank: {},
      shortAnswer: {},
      operation: {},
    });
    const refData = toRefs(state);

    onMounted(() => {
      const params = root.$route.params;
      refData.model.value.lesson_id = params.courseId;
      refData.model.value.classroom_id = params.lessonId;
      refData.model.value.user_id = props.userId;
      refData.rules.value.level = [
        {
          required: true,
          message: getI18N().t('m.PlzSelectAnEvaluationResult'),
        },
      ];
    });
    watch(
      props,
      (nv, ov) => {
        if (nv.detailData) {
          const level = nv.detailData.level;
          const single = nv.detailData.practice_list?.single;
          const judgment = nv.detailData.practice_list?.judgment;
          const multiple = nv.detailData.practice_list?.multiple;
          const fillBlank = nv.detailData.practice_list?.fill_blank;
          const shortAnswer = nv.detailData.practice_list?.short_answer;
          const operation = nv.detailData.practice_list?.operation;
          refData.model.value.level = level;
          refData.singleData.value = single;
          refData.judgment.value = judgment;
          refData.multiple.value = multiple;
          refData.fillBlank.value = fillBlank;
          refData.shortAnswer.value = shortAnswer;
          refData.operation.value = operation;
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );
    const fillBankIndex = computed((props) => {
      return genIndex([refData.singleData.value]);
    });
    const judgeIndex = computed((props) => {
      return genIndex([refData.singleData.value, refData.fillBlank.value]);
    });
    const mutiIndex = computed((props) => {
      return genIndex([
        refData.singleData.value,
        refData.fillBlank.value,
        refData.judgment.value,
      ]);
    });
    const shorAnswerIndex = computed((props) => {
      return genIndex([
        refData.singleData.value,
        refData.fillBlank.value,
        refData.judgment.value,
        refData.multiple.value,
      ]);
    });
    const operationIndex = computed((props) => {
      return genIndex([
        refData.singleData.value,
        refData.fillBlank.value,
        refData.judgment.value,
        refData.multiple.value,
        refData.shortAnswer.value,
      ]);
    });
    const handleChange = async (value) => {
      if (value) {
        await nextTick(() => {
          formRef.value.resetFields();
          refData.model.value.level = value;
        });
      }
    };
    const submitForm = () => {
      formRef.value.submit().then(() => {
        emit('close');
      });
    };
    // 处理正确率
    const getRightCount = (str) => {
      if (str) {
        let ipos = str.indexOf('/');
        let str1 = str.substring(0, ipos);
        return str1;
      }
    };
    const getTotalCount = (str) => {
      if (str) {
        let ipos = str.indexOf('/');
        let str2 = str.substring(ipos + 1, str.length);
        return str2;
      }
    };
    // 处理单选多选选项
    const dealWithChoice = (data) => {
      const finalData = JSON.parse(data);
      const list = [];
      for (const key in finalData) {
        const item = {
          name: `${finalData[key]}`,
          label: key,
        };
        list.push(item);
      }
      return list;
    };
    // 处理判断题答案
    const judgeAnswer = (data) => {
      if (data === 'A') {
        return i18n.t('m.correct');
      }
      if (data === 'B') {
        return i18n.t('m.error');
      }
      if (data === null) {
        return '';
      }
    };
    // 处理填空题答案
    const dealWithFillBlank = (data) => {
      const finalData = JSON.parse(data);
      const dataList = finalData.map((item) => {
        return item.value;
      });
      return dataList.join('、');
    };
    const dealWithFillBlankUserAnswer = (data) => {
      const finalData = JSON.parse(data);
      let temp = [];
      for (var i in finalData) {
        temp.push(finalData[i]);
      }
      return temp.join('、');
    };
    return {
      ...refData,
      formRef,
      handleChange,
      submitForm,
      dealWithChoice,
      judgeAnswer,
      dealWithFillBlank,
      dealWithFillBlankUserAnswer,
      getRightCount,
      getTotalCount,
      fillBankIndex,
      judgeIndex,
      mutiIndex,
      shorAnswerIndex,
      operationIndex,
    };
  },
};
</script>

<style lang="scss" scoped>
.correct-detail {
  .header {
    display: flex;
    height: 80px;
    padding: 0 24px;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-color-3);
    .class-name {
      width: 150px;
      overflow: hidden; //溢出隐藏
      white-space: nowrap; //禁止换行
      text-overflow: ellipsis; //...
    }
    .correct {
      width: 370px;
      position: relative;
      top: 14px;
      right: -46px;
    }
    .right-count {
      color: var(--green-color);
    }
  }
  .class-content {
    margin-top: 15px;
    .title {
      font-size: 14px;
      font-weight: 600;
      color: var(--neutral8);
      line-height: 20px;
      position: relative;
    }
    .content {
      background: var(--bg-color-3);
      padding: 15px;
      margin: 15px 0;
      color: var(--neutral7);
      position: relative;
    }
  }
}
.warning-info {
  display: inline-block;
  position: absolute;
  top: -2px;
  right: 2px;
  padding: 2px 8px;
  margin-left: 10px;
  background: var(--blue-color-2);
  color: var(--blue-color);
  font-weight: normal;
}
</style>
<style lang="scss">
#correct-detail {
  .cb-markdown .markdown-body {
    padding: 4px 0 !important;
    line-height: 22px;
  }
}
</style>
