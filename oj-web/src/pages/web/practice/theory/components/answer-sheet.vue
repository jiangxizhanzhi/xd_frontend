<template>
  <div class="answer-sheet-wrapper">
    <div>
      <Block :title="$t('practice.answerSheet')"></Block>
    </div>
    <div class="topic-statistics">
      <div class="statistics-com">
        <div class="statistics-count green">{{ right }}</div>
        <div class="statistics-label">{{ $t('practice.right') }}</div>
      </div>
      <div class="statistics-com">
        <div class="statistics-count red">{{ wrong }}</div>
        <div class="statistics-label">{{ $t('practice.wrong') }}</div>
      </div>
      <div class="statistics-com">
        <div class="statistics-count yellow">{{ notStart }}</div>
        <div class="statistics-label">{{ $t('practice.notStart') }}</div>
      </div>
    </div>
    <div class="topic-number">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="topic-item"
        :class="{
          'error-topic': item.solved === THEORYSTATUSTYPE.Tried,
          'success-topic': item.solved === THEORYSTATUSTYPE.Solved,
          'current-topic': item.practice_id === currentTopic,
        }"
        @click="topicClick(item)"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>
<script>
import Block from '@/components/block';
import { THEORYSTATUSTYPE } from '../../constant';
export default {
  name: 'AnswerSheet',
  components: {
    Block,
  },
  props: {
    // 未开始
    notStart: {
      type: [String, Number],
      default: 0,
    },
    // 正确
    right: {
      type: [String, Number],
      default: 0,
    },
    // 错误
    wrong: {
      type: [String, Number],
      default: 0,
    },
    // 题目列表
    list: {
      type: Array,
      default: () => [],
    },
    // 当前题目
    currentTopic: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      THEORYSTATUSTYPE,
    };
  },
  computed: {},
  methods: {
    topicClick(val) {
      this.$emit('topic-click', val);
    },
  },
};
</script>
<style lang="scss" scoped>
.green {
  color: var(--green-color);
}
.red {
  color: var(--red-color);
}
.yellow {
  color: var(--yellow-color);
}
.answer-sheet-wrapper {
  padding: 12px 16px;
  .topic-statistics {
    height: 92px;
    background: var(--bg-color-3);
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding: 0 2px;
    justify-content: space-between;
    margin-bottom: 24px;
    .statistics-com {
      text-align: center;
      width: 33%;
      .statistics-count {
        font-size: 24px;
        font-weight: 600;
        line-height: 20px;
        margin-bottom: 8px;
      }
      .statistics-label {
        font-size: 12px;
        color: var(--neutral6);
        line-height: 16px;
      }
    }
  }
  .topic-number {
    display: flex;
    flex-wrap: wrap;
    .topic-item {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid var(--neutral3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--neutral8);
      font-size: 16px;
      margin: 0 20px 24px 0;
      cursor: pointer;
      &:nth-child(5n) {
        margin: 0 0 24px 0;
      }
      &:hover {
        background: var(--primary-color);
        border: 1px solid var(--primary-color);
        color: var(--white-color);
      }
    }
    .error-topic {
      background: var(--red-color-4);
      border: 1px solid var(--red-color-4);
      color: var(--white-color);
    }
    .success-topic {
      background: var(--green-color-4);
      border: 1px solid var(--green-color-4);
      color: var(--white-color);
    }
    .current-topic {
      background: var(--primary-color);
      border: 1px solid var(--primary-color);
      color: var(--white-color);
    }
  }
}
</style>
