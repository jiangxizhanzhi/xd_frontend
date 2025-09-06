<template>
  <div class="practice-set mb40">
    <div class="first-row">
      <div class="item-title">
        <div class="big">
          {{ $t(`views.exam.paper.indexLabel.idx${index}`)
          }}{{ questionTypeStr }}
        </div>
        <div class="bracket ml10" v-if="!emptyList">
          ({{ questionList.length
          }}{{ questionList.length > 1 ? $t('m.exam.topics') : $t('m.topic') }}
          <!-- ,{{ ' ' + totalScore + ' '
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
            <div class="num">{{ idx + 1 }}.</div>
            <CbMarkdown
              type="viewer"
              v-model="question.title"
              style="position: relative; top: 9px; flex: 1 1 auto"
            />
            <!-- <div class="rest">
              <question-score v-model="question.score"></question-score>
            </div> -->
          </div>
          <option-panel :option="question.option"></option-panel>

          <div class="bottomClass">
            <div class="answer-content">
              <!-- 动态flag返回空数组,不展示答案 -->
              <span v-if="JSON.parse(question.answer).length >= 1">{{
                $t('m.answer')
              }}</span
              ><span v-if="JSON.parse(question.answer).length >= 1">:</span>
              <!-- 每个类型多个题目 -->
              <!-- 多个答案 -->
              <div v-if="JSON.parse(question.answer).length > 1">
                <div v-for="(item, idx) of JSON.parse(question.answer)">
                  <div class="answer-style">
                    {{ $t('m.space') }}{{ idx + 1 }} <span>:</span
                    ><span class="content-style">{{ item }}</span>
                  </div>
                </div>
              </div>
              <!-- 一个答案 -->
              <div v-if="JSON.parse(question.answer).length == 1">
                <div v-for="(item, idx) of JSON.parse(question.answer)">
                  <div
                    :class="
                      language === 'en-US' ? 'more-style-en' : 'more-style'
                    "
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
            <div class="button-style">
              <!-- <span class="move-icon iconfont icondrag"></span> -->
              <span
                class="remove-icon iconfont icondelete"
                @click="removeIt(question)"
              ></span>
            </div>
          </div>
        </div>
      </draggable> </template
    ><template v-else-if="questionList.length === 1">
      <div
        class="practice mt10 pad10"
        :class="{ boxShadow: light }"
        :draggable="false"
      >
        <div class="first-row">
          <div class="num">{{ 1 }}</div>
          <mavon-read
            class="question pr10"
            :mavon-data.sync="questionList[0].title"
          ></mavon-read>
        </div>
        <option-panel :option="questionList[0].option"></option-panel>
        <!-- 每个类型一个题目 -->
        <div class="bottomClass">
          <div style="display: flex">
            <div
              style="min-width: 36px"
              v-if="JSON.parse(questionList[0].answer).length == 1"
            >
              <span>{{ $t('m.answer') }}</span
              ><span>:</span>
            </div>
            <div
              style="min-width: 52px"
              v-if="JSON.parse(questionList[0].answer).length > 1"
            >
              <span>{{ $t('m.answer') }}</span
              ><span>:</span>
            </div>
            <!-- 一个答案 -->
            <div v-if="JSON.parse(questionList[0].answer).length == 1">
              <div v-for="(item, idx) of JSON.parse(questionList[0].answer)">
                <div class="single-style">{{ item }}</div>
              </div>
            </div>
            <!-- 多个答案 -->
            <div
              v-if="JSON.parse(questionList[0].answer).length > 1"
              style="margin-top: 18px"
            >
              <div v-for="(item, idx) of JSON.parse(questionList[0].answer)">
                <div class="answer-more">
                  {{ $t('m.space') }}{{ idx + 1 }}<span>:</span
                  ><span class="content-style">{{ item }}</span>
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

.bottomClass {
  display: flex;
  justify-content: space-between;
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
  .answer-style {
    margin-left: 24px;
    .content-style {
      word-break: break-all;
    }
  }
  .answer-more {
    margin-left: -28px;
    .content-style {
      word-break: break-all;
    }
  }
}
</style>
