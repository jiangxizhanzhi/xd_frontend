<template>
  <div class="level-single">
    <div
      class="level-desc"
      :class="{
        lower: level === 'lower',
        middle: level === 'middle',
        high: level === 'high',
      }"
    >
      {{ label }}
    </div>
    <div class="level-static">
      <div class="left-static">
        {{ (info && info.count) || 0 }}
      </div>
      <div class="right-static">
        {{ (info && info.sum) || 0 }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      default: '',
    },
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      percentage: 10,
    };
  },
};
</script>
<style lang="scss" scoped>
.level-single {
  width: 31%;
  .level-desc {
    margin-bottom: 10px;
  }
  .level-static {
    display: flex;
    align-items: center;
    .left-static {
      font-size: 14px;
      font-weight: 400;
      color: var(--neutral8);
    }
    .right-static {
      margin-left: 5px;
      padding-left: 5px;
      border-left: 1px solid var(--neutral1);
      font-size: 12px;
      font-weight: 400;
      color: var(--neutral5);
    }
  }
}
</style>
