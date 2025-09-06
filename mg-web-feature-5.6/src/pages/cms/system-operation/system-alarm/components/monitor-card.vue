<template>
  <div class="monitor-card monitor-card-scope">
    <div class="explain-box one-overflow" :title="`${explain}(${sizeRate})`">
      <span class="explain">{{ explain }}</span>
      <span class="size-rate">({{ sizeRate }})</span>
    </div>
    <div class="progress-box">
      <cb-progress
        :percentage="progressPercentage"
        :color="progressColor"
        strokeLinecap="round"
      ></cb-progress>
    </div>
  </div>
</template>
<script>
export default {
  name: 'monitorCard',
  props: {
    progressColor: {
      type: [String, Number],
      default: '',
    },
    explain: {
      type: String,
      default: '',
    },
    sizeRate: {
      type: [String, Number],
      default: '',
    },
    progressPercentage: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.monitor-card {
  padding: 20px 5px 0 16px;
  .explain-box {
    margin-bottom: 18px;
    .explain {
      font-size: 16px;
      font-weight: 400;
      color: var(--neutral8);
    }
    .size-rate {
      font-size: 14px;
      font-weight: 400;
      color: var(--neutral7);
    }
  }
}
</style>
<style lang="scss">
.monitor-card-scope {
  .cb-progress-line-slot-left {
    margin-right: 0;
  }
}
</style>
