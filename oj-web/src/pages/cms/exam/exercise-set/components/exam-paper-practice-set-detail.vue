<template>
  <div class="practice-set mb30">
    <div class="first-row">
      <div class="item-title">
        <div class="big">
          {{ $t(`views.exam.paper.indexLabel.idx${index}`)
          }}{{ questionTypeStr }}
        </div>
        <div class="bracket ml10" v-if="!emptyList">
          ({{ ' ' + questionList.length + ' ' }}
          {{ questionList.length > 1 ? $t('m.exam.topics') : $t('m.topic') }}
          <!-- ,
          {{
            ' ' + totalScore + ' '
          }}{{ totalScore > 1 ? $t('m.points') : $t('m.point') }} -->
          )
        </div>
      </div>
      <div class="rest">
        <div class="empty" v-if="emptyList">
          {{ $t('common.pleaseAdd') }}{{ questionTypeStr }}
        </div>
      </div>
    </div>
    <template v-if="draggableEnabled">
      <draggable v-model="questionList" ghost-class="practice-ghost">
        <div
          class="practice mt10 pad10"
          v-for="(question, idx) of questionList"
          :key="idx"
        >
          <div class="first-row">
            <div class="num">{{ idx + 1 }}</div>
            <!-- <mavon-read
              class="exercise-set-mavon-title question pr10"
              :mavon-data.sync="question.content"
            ></mavon-read> -->
            <CbMarkdown
              type="viewer"
              v-model="question.content"
              style="position: relative; top: 9px; flex: 1 1 auto"
            />
            <!-- <div class="rest">
              <question-score v-model="question.score"></question-score>
            </div> -->
          </div>
          <option-panel :option="question.option"></option-panel>
          <!-- 每个类型题大于1 -->
          <div class="bottomClass">
            <!-- 非填空 -->
            <div
              v-if="
                question.question_type === 1 ||
                question.question_type === 4 ||
                question.question_type === 0
              "
            >
              {{ $t('m.answer') }}<span>:</span>{{ question.answer }}
            </div>
            <!-- 多个判断题A是正确.B是错误 -->
            <div v-if="question.question_type === 2">
              {{ $t('m.answer') }}<span>:</span>
              <span v-if="question.answer === 'A'">{{ $t('m.correct') }}</span>
              <span v-else>{{ $t('m.error') }}</span>
            </div>

            <!-- 填空题 -->
            <div class="answer-content">
              <!-- 填空答案数量大于1 -->
              <span v-if="question.question_type === 3">
                {{ $t('m.answer') }}<span>:</span></span
              >
              <div
                v-if="
                  question.question_type === 3 &&
                  question.answer &&
                  JSON.parse(question.answer).length > 1
                "
              >
                <div v-for="(item, idx) of JSON.parse(question.answer)">
                  <div class="answer-style">
                    {{ $t('m.space') }}{{ idx + 1 }}<span>:</span
                    >{{ item.value }}
                  </div>
                </div>
              </div>
              <!-- 填空答案数量为1个 -->
              <span
                v-if="
                  question.question_type === 3 &&
                  question.answer &&
                  JSON.parse(question.answer).length === 1
                "
              >
                <div v-for="(item, idx) of JSON.parse(question.answer)">
                  <div
                    :class="
                      language === 'en-US' ? 'more-style-en' : 'more-style'
                    "
                  >
                    {{ item.value }}
                  </div>
                </div>
              </span>
            </div>

            <div>
              <!-- <span class="move-icon iconfont icondrag"></span>-->
              <span
                class="remove-icon iconfont icondelete"
                @click="removeIt(question)"
              ></span>
            </div>
          </div>
        </div>
      </draggable> </template
    ><template v-else-if="questionList.length === 1">
      <div class="practice mt10 pad10" :draggable="false">
        <div class="first-row">
          <div class="num">{{ 1 }}</div>
          <CbMarkdown
            type="viewer"
            v-model="questionList[0].content"
            style="position: relative; top: 9px; flex: 1 1 auto"
          />
          <!-- <div class="rest">
            <question-score v-model="questionList[0].score"></question-score>
          </div> -->
        </div>
        <option-panel :option="questionList[0].option"></option-panel>
        <div class="bottomClass">
          <div>
            <!-- 每个类型只有一个题目的情况-->
            <div style="display: flex">
              <div
                v-if="questionList[0].question_type === 3"
                style="min-width: 36px"
              >
                <span>{{ $t('m.answer') }}</span
                ><span>:</span>
              </div>

              <div
                v-if="
                  questionList[0].question_type == 3 &&
                  questionList[0].answer &&
                  JSON.parse(questionList[0].answer).length == 1
                "
              >
                <span v-for="(item, idx) of JSON.parse(questionList[0].answer)">
                  <span class="single-style">{{ item.value }}</span>
                </span>
              </div>
            </div>
            <div
              v-if="
                questionList[0].question_type == 1 ||
                questionList[0].question_type == 4 ||
                questionList[0].question_type == 0
              "
            >
              {{ $t('m.answer') }}<span>:</span>{{ questionList[0].answer }}
            </div>

            <!-- 单个判断题A是正确.B是错误 -->
            <div v-if="questionList[0].question_type == 2">
              {{ $t('m.answer') }}<span>:</span>
              <span v-if="questionList[0].answer === 'A'">{{
                $t('m.correct')
              }}</span>
              <span v-else>{{ $t('m.error') }}</span>
            </div>

            <!-- 填空答案大于1 -->
            <div
              v-if="
                questionList[0].question_type == 3 &&
                questionList[0].answer &&
                JSON.parse(questionList[0].answer).length > 1
              "
            >
              <div v-for="(item, idx) of JSON.parse(questionList[0].answer)">
                <div class="answer-styles">
                  {{ $t('m.space') }}{{ idx + 1 }}<span>:</span>{{ item.value }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <span
              class="remove-icon iconfont icondelete"
              @click="removeIt(questionList[0])"
            ></span>
          </div>
        </div>
      </div>
    </template>
    <div class="hr-dash-line mt10 mb10" v-if="emptyList"></div>
  </div>
</template>
<script>
import OptionPanel from './option-panel.vue';
import mixin from './exam-paper-practice-set-detail-mixin.js';
import MavonRead from '@/components/markdown/mavon-read.vue';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';

export default {
  components: {
    OptionPanel,
    MavonRead,
  },
  mixins: [mixin],
  props: {
    index: {
      type: Number,
      default() {
        return 1;
      },
    },
    questionTypeStr: {
      type: String,
      default() {
        return '';
      },
    },
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      // 表示是否是浅色系
      light: true,
    };
  },
  computed: {
    language() {
      return this.$store.state.app.language;
    },
    draggableEnabled() {
      const { questionList = [] } = this;
      return questionList.length > 1;
    },
    questionList: {
      get() {
        const { list = [] } = this;
        return list || [];
      },
      set(val) {
        this.$emit('update:list', val);
      },
    },
  },
  mounted() {
    this.listenFunc();
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.light = false;
      } else {
        this.light = true;
      }
    },
  },
};
</script>
<style lang="scss">
.practice {
  background-color: var(--bg-color-3);
  margin-left: 2px;
}
</style>
<style lang="scss" scoped>
.practice-set {
  & > .first-row {
    display: flex;
    justify-content: space-between;
    & > .item-title {
      display: flex;
      align-items: flex-end;
      & > .big {
        font-size: 20px;
        font-weight: bolder;
      }
    }
  }
}
.practice-ghost {
  border-top: 1px solid var(--primary-color);
}
.practice:hover {
  box-shadow: 0 0 20px var(--box-shadow-color);
  outline: 1px solid var(--primary-color);
  cursor: move;
}
.practice {
  position: relative;
  border-radius: 2px;
  .bottomClass {
    // text-align: right;
    display: flex;
    justify-content: space-between;
    .answer-style {
      margin-left: 24px;
      word-break: break-all;
    }
    .answer-styles {
      margin-left: 24px;
      word-break: break-all;
    }
    .single-style {
      line-height: 20px;
      word-break: break-word;
    }
    .more-style {
      word-break: break-word;
      margin-left: 32px;
      margin-top: -18px;
    }
    .more-style-en {
      margin-left: 56px;
      margin-top: -16px;
    }
    .remove-icon:hover {
      opacity: 0.8;
    }
    .move-icon {
      font-size: 17px;
      color: var(--blue-color);
      margin-right: 10px;
    }
    .remove-icon {
      font-size: 17px;
      color: var(--red-color);
      cursor: pointer;
    }
  }
  & > .first-row {
    display: flex;
    align-items: flex-start;
    word-break: break-word;
    & > .num {
      margin-top: 10px;
      flex: 0 0 25px;
    }
    & > .question {
      margin-top: 8px;
      flex: 1 1 auto;
      word-break: break-all;
    }
  }
}
</style>
