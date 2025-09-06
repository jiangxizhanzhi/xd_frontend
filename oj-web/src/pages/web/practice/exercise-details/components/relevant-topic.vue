<template>
  <div class="right-area">
    <div class="recent-answer">
      <block :title="$t('m.exercise.recentAnswer')">
        <div v-if="recentAnswerList && recentAnswerList.length > 0">
          <div
            class="recent-answer-item"
            v-for="(item, index) in recentAnswerList"
            :key="'recent-answer-item' + index"
          >
            <div class="recent-answer-item-time" :title="item.time">
              {{ item.time }}
            </div>
            <div class="recent-answer-item-name" :title="item.user_name">
              {{ item.user_name }}
            </div>
            <div
              class="recent-answer-item-status"
              :class="{
                'orange-box': item.status === THEORYSTATUSTYPE.Tried,
                'green-box': item.status === THEORYSTATUSTYPE.Solved,
                'gray-box': item.status === THEORYSTATUSTYPE.NotStart,
              }"
            >
              <span
                v-if="item.status === THEORYSTATUSTYPE.Tried"
                :title="$t('practice.tried')"
              >
                {{ $t('practice.tried') }}
              </span>
              <span
                v-else-if="item.status === THEORYSTATUSTYPE.Solved"
                :title="$t('m.solved')"
              >
                {{ $t('m.solved') }}
              </span>
              <span
                v-else-if="item.status === THEORYSTATUSTYPE.NotStart"
                :title="$t('m.toStart')"
              >
                {{ $t('m.toStart') }}
              </span>
            </div>
          </div>
        </div>
        <empty v-else></empty>
      </block>
    </div>
    <div class="relevant-questions">
      <block :title="$t('m.exercise.relevantQuestions')">
        <div
          class="relevant-questions-box"
          v-if="revelantQuestions && revelantQuestions.length > 0"
        >
          <div
            class="relevant-questions-item"
            v-for="(item, index) in revelantQuestions"
            :key="'relevant-questions-item' + index"
            @click="toDetail(item)"
          >
            <div
              class="relevant-questions-item-topic two-overflow"
              :title="item.topic"
            >
              {{ item.topic }}
            </div>
            <div
              class="relevant-questions-item-status"
              :class="{
                'orange-box': item.status === THEORYSTATUSTYPE.Tried,
                'green-box': item.status === THEORYSTATUSTYPE.Solved,
                'gray-box': item.status === THEORYSTATUSTYPE.NotStart,
              }"
            >
              <span
                v-if="item.status === THEORYSTATUSTYPE.Tried"
                :title="$t('practice.tried')"
              >
                {{ $t('practice.tried') }}
              </span>
              <span
                v-else-if="item.status === THEORYSTATUSTYPE.Solved"
                :title="$t('m.solved')"
              >
                {{ $t('m.solved') }}
              </span>
              <span
                v-else-if="item.status === THEORYSTATUSTYPE.NotStart"
                :title="$t('m.toStart')"
              >
                {{ $t('m.toStart') }}
              </span>
            </div>
          </div>
        </div>
        <empty v-else></empty>
      </block>
    </div>
  </div>
</template>

<script>
import Block from '@/components/block';
import Empty from '@/components/empty';
import { THEORYSTATUSTYPE } from './../../constant';
export default {
  props: {
    // 最近答题
    recentAnswerList: {
      type: Array,
      default: () => [],
    },
    // 相关好题
    revelantQuestions: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Block,
    Empty,
  },
  data() {
    return {
      THEORYSTATUSTYPE,
    };
  },
  methods: {
    toDetail(row) {
      this.$emit('toDetail', row);
    },
  },
};
</script>

<style lang="scss" scoped>
.right-area {
  width: 320px;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  & > div {
    flex: 1;
    flex-shrink: 0;
  }
  .recent-answer {
    background: var(--bg-color-2);
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 12px;
    .recent-answer-item {
      margin-bottom: 15px;
      font-size: 14px;
      color: var(--neutral8);
      display: flex;
      justify-content: space-between;
      & > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .recent-answer-item-time {
        margin-right: 10px;
        flex: 2;
      }
      .recent-answer-item-name {
        margin-right: 20px;
        flex: 1;
      }
      .recent-answer-item-status {
        width: 60px;
        text-align: right;
      }
    }
  }
  .relevant-questions {
    background: var(--bg-color-2);
    padding: 12px 16px;
    border-radius: 4px;
    .relevant-questions-box {
      margin-top: -12px;
    }
    .relevant-questions-item {
      cursor: pointer;
      padding: 8px;
      font-size: 14px;
      color: var(--neutral8);
      display: flex;
      justify-content: space-between;
      &:hover {
        background: var(--neutral0);
      }
      .relevant-questions-item-topic {
        flex: 1;
        margin-right: 20px;
      }
      .relevant-questions-item-status {
        width: 60px;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .orange-box {
    color: var(--orange-color);
    background: none;
  }
  .green-box {
    color: var(--green-color);
    background: none;
  }
  .gray-box {
    color: var(--neutral8-color);
    background: none;
  }
}
</style>
