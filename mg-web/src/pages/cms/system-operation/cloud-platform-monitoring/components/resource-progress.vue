<template>
  <div class="resource-pie-item">
    <cb-progress
      type="circle"
      :percentage="value"
      :stroke-width="10"
      :color="'var(--primary-color)'"
      stroke-linecap="square"
    >
      <template v-slot:circle-text>
        <div class="percent">{{ `${value}%` }}</div>
        <div class="title">{{ title }}</div>
      </template>
    </cb-progress>
  </div>
</template>

<script>
export default {
  name: 'ResourceProgress',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.resource-pie-item {
  text-align: center;
  .percent {
    font-size: 22px;
    color: var(--neutral8);
  }
  .title {
    font-size: 14px;
  }
}
</style>
<style lang="scss">
.resource-pie-item,
.content,
.el-progress__text {
  color: var(--neutral8);
}
.el-progress--circle {
  .el-progress-circle {
    svg {
      path:first-child {
        stroke: var(--primary-color);
      }
    }
  }
}
</style>
