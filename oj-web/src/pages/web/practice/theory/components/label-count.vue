<template>
  <div class="label-count-wrapper">
    <div class="icon-box mr8" :style="{ background: circleColor }">
      <cb-iconfont :type="icon" :themedColor="countColor" />
    </div>
    <div class="label mr8">{{ label }}</div>
    <div class="count" :style="{ color: 'var(' + countColor + ')' }">
      {{ count }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    circleColor: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    count: {
      type: [String, Number],
      default: '',
    },
    countColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.mr8 {
  margin-right: 8px;
}
.label-count-wrapper {
  display: flex;
  align-items: center;
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .label {
    font-size: 12px;
    color: var(--neutral6);
    line-height: 16px;
  }
  .count {
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    line-height: 20px;
  }
}
</style>
