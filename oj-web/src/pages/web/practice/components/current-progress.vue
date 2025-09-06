<template>
  <div class="current-progress">
    <div class="progress-box">
      <cb-progress
        type="circle"
        :percentage="percentage"
        :strokeWidth="9"
        strokeLinecap="round"
      >
        <template v-slot:circle-text>
          <div class="progress-text">
            <div class="top-sum">
              {{
                (currentProgressInfo &&
                  currentProgressInfo.sum &&
                  currentProgressInfo.sum.count) ||
                0
              }}
            </div>
            <div class="line"></div>
            <div class="bottom-sum">
              {{
                (currentProgressInfo &&
                  currentProgressInfo.sum &&
                  currentProgressInfo.sum.sum) ||
                0
              }}
            </div>
          </div>
        </template>
      </cb-progress>
    </div>
    <div class="level-count">
      <TopicProgress
        :label="$t('practice.easy')"
        level="lower"
        :info="currentProgressInfo && currentProgressInfo.simple"
      />
      <TopicProgress
        :label="$t('practice.medium')"
        level="middle"
        :info="currentProgressInfo && currentProgressInfo.medium"
      />
      <TopicProgress
        :label="$t('practice.difficult')"
        level="high"
        :info="currentProgressInfo && currentProgressInfo.difficulty"
      />
    </div>
  </div>
</template>
<script>
import TopicProgress from './topic-progress.vue';
export default {
  props: {
    currentProgressInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    TopicProgress,
  },
  data() {
    return {};
  },
  computed: {
    percentage() {
      const count =
        (
          this.currentProgressInfo?.sum?.count /
          this.currentProgressInfo?.sum?.sum
        ).toFixed(4) * 100;
      return count || 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.progress-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.current-progress {
  height: 181px;
  .progress-box {
    text-align: center;
    height: 134px;
    .top-sum {
      font-size: 24px;
      font-weight: 600;
      color: var(--neutral8);
    }
    .line {
      width: 32px;
      height: 1px;
      background: var(--neutral1);
      margin: 5px 0;
    }
    .bottom-sum {
      font-size: 12px;
      font-weight: 400;
      color: var(--neutral5);
    }
  }
  .level-count {
    padding: 0;
    display: flex;
    justify-content: space-around;
  }
}
</style>
