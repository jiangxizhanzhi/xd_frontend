<template>
  <div class="header-right flex-center">
    <div class="previous-step">
      <cb-button
        :disabled="isFirst"
        hollow="hollow"
        icon="icon-xiangyou"
        @click="prev()"
      >
        {{ $t('m.exercise.previousQuestion') }}
      </cb-button>
    </div>

    <div v-if="!isExam" class="go-back-box mgl24" @click="goTopicBank()">
      <cb-iconfont type="icon-xiangqing" size="18" />
      <!-- 题库 -->
      <span v-if="recordFrom === 'normal'">{{ $t('m.questionBank') }}</span>
      <span
        v-else-if="
          recordFrom === 'relevantNormal' ||
          recordFrom === 'relevantPerson' ||
          recordFrom === 'relevantNormalMistake' ||
          recordFrom === 'relevantNormalNote' ||
          recordFrom === 'relevantNormalRecord'
        "
      >
        {{ $t('practice.relateGood') }}
      </span>
      <!-- 题目列表 -->
      <span v-else-if="recordFrom === 'practice_set'">
        {{ $t('practice.topicList') }}
      </span>
      <!-- 我的收藏 -->
      <span v-else-if="recordFrom === 'collection'">
        {{ $t('practice.myCollection') }}
      </span>
      <!-- 我的错题 -->
      <span v-else-if="recordFrom === 'mistake'">
        {{ $t('practice.myMistake') }}
      </span>
      <!--  我的笔记 -->
      <span v-else-if="recordFrom === 'note'">{{ $t('practice.myNote') }}</span>
      <!--  我的提问 -->
      <span v-else-if="recordFrom === 'question'">
        {{ $t('m.myQuestion') }}
      </span>
      <!--  我的回复 -->
      <span v-else-if="recordFrom === 'replay'">{{ $t('m.myReply') }}</span>
      <template v-else>
        <!-- 练习记录 -->
        <span v-if="type === TYPE.Rationale">
          {{ $t('practice.practiceRecord') }}
        </span>
        <!-- 解题记录 -->
        <span v-else> {{ $t('practice.problemRecord') }} </span>
      </template>
    </div>
    <div v-else class="go-back-box mgl24">
      <span>{{ currentIndex }}/{{ totalIndex }}</span>
    </div>

    <div class="next-step mgl24">
      <cb-button :disabled="isLast" hollow="hollow" @click="next()">
        {{ $t('m.exercise.nextQuestion') }}
        <cb-iconfont type="icon-xiangzuo" :size="14" style="margin-left: 1px" />
      </cb-button>
    </div>
    <div class="back-box">
      <cb-button
        hollow="hollow"
        icon="icon-fanhui"
        type="text"
        @click="goBack()"
      >
        <!-- 返回 -->
        <template v-if="!isExam"> {{ $t('practice.back') }} </template>
        <!-- 退出答题 -->
        <template v-else> {{ $t('practice.exitAnswer') }} </template>
      </cb-button>
    </div>
    <div v-if="isExam" class="hand-exam-box">
      <cb-button @click="handExam()">
        {{ $t('practice.volumeSubmit') }}
      </cb-button>
    </div>
  </div>
</template>
<script>
import gradientRadius from '@/components/button/gradient-radius.vue';
import { TYPE } from '../../constant';
export default {
  name: '',
  components: { gradientRadius },
  props: {
    isProfile: {
      type: Boolean,
      default: false,
    },
    currentIndex: {
      type: Number,
      default: null,
    },
    totalIndex: {
      type: Number,
      default: null,
    },
    // isCollection: {
    //   type: Boolean,
    //   default: false,
    // },
    type: {
      type: Number,
      default: 0,
    },
    practiceSetId: {
      type: [String, Number],
      default: '',
    },
    // 自由组卷
    isExam: {
      type: Boolean,
      default: false,
    },
    // 记录从哪来的，用于判断显示中间显示什么&&是否显示交卷按钮
    recordFrom: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return { TYPE };
  },
  computed: {
    isFirst() {
      return this.currentIndex === null || this.currentIndex === 1;
    },
    isLast() {
      return this.currentIndex === null || this.currentIndex >= this.totalIndex;
    },
    // isTheoryBase() {
    //   return this.type === this.TYPE.Rationale || this.isProfile;
    // },
  },

  methods: {
    // collection() {
    //   this.$emit('collection-change', this.isCollection);
    // },
    prev() {
      this.$emit('prev-change');
    },
    next() {
      this.$emit('next-change');
    },
    goTopicBank() {
      this.$emit('go-topic-bank');
    },
    goBack() {
      this.$emit('go-back');
    },
    handExam() {
      this.$emit('hand-exam');
    },
  },
};
</script>
<style lang="scss" scoped>
.header-right {
  height: 36px;
  position: relative;
  width: 100%;
  .header-line {
    width: 1px;
    height: 20px;
    background: var(--neutral1);
  }
  .mgl24 {
    margin-left: 24px;
  }
  .collection {
    display: flex;
    align-items: center;
    i {
      color: var(--orange-color);
    }
    span {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: var(--neutral8);
      margin: 0 20px 0 10px;
    }
  }
  .go-back-box {
    font-size: 16px;
    color: var(--neutral8);
    display: flex;
    align-items: center;
    cursor: pointer;
    .cb-iconfont {
      color: var(--neutral8) !important;
      margin-top: 2px;
    }
    &:hover {
      color: var(--primary-color);
      .cb-iconfont {
        color: var(--primary-color) !important;
      }
    }
    span {
      margin-left: 6px;
    }
  }
  .back-box {
    position: absolute;
    top: 3px;
    left: 8px;
    .cb-button {
      background: var(--neutral0);
      padding: 5px 8px;
      border-radius: 2px;
    }
    &:hover {
      background: var(--primary-color-2);
      border-radius: 2px;
    }
  }
  .hand-exam-box {
    position: absolute;
    top: 3px;
    right: 8px;
  }
}
</style>
<style lang="scss">
.header-right {
  .back-box {
    .cb-button.cb-button-default .el-button--text:hover:not(.is-disabled) {
      text-decoration: none;
    }
  }
}
</style>
