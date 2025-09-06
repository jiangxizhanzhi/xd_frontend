<template>
  <div class="danger-level" :title="dangerLevelOptions[level]">
    <span class="circle" :class="className"></span>
    <span>{{ dangerLevelOptions[level] }}</span>
  </div>
</template>

<script>
export default {
  props: {
    level: {
      type: Number,
      default: 0,
    },
    dangerLevelOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    className() {
      return this.dangerLevelOptions.type[this.level];
    },
  },
};
</script>

<style lang="scss" scoped>
.danger-level {
  display: flex;
  align-items: center;
  .circle {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
    margin-top: 1px;
  }
  .unknown {
    background-color: var(--neutral4);
  }
  .lowRisk {
    background-color: var(--yellow-color);
  }
  .crisis {
    background-color: var(--orange-color);
  }
  .highRisk {
    background-color: var(--red-color);
  }
  .critically {
    background-color: #000000;
  }
}
</style>
