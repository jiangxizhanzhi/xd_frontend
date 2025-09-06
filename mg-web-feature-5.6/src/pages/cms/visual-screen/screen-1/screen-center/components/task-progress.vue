<template>
  <!-- 任务进度 -->
  <div :class="color === 'red' ? 'task-progress-red' : 'task-progress-blue'">
    <div class="progress">
      <cb-progress :percentage="percentage">
        <template v-slot:line-right><span></span></template>
      </cb-progress>
    </div>

    <div class="type">
      <span class="name">任务进度</span>
      <span class="number">{{ percentage }}%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskProgress',
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: 'red',
    },
  },
  data() {
    return {};
  },

  mounted() {},
  methods: {},
  watch: {},
};
</script>

<style scoped lang="scss">
::v-deep .cb-progress-line-slot-left,
::v-deep .cb-progress-line-slot-right {
  display: none;
}
::v-deep .cb-progress-bar {
  padding-right: 0;
  margin-right: 0;
}
.task-progress-red,
.task-progress-blue {
  margin-top: 20px;
  flex: 1;
  width: 90%;
  margin: 15px auto 0;
  .progress {
    width: 100%;
    .cb-progress-bar__outer {
      height: var(--cb-progress-height);
    }
  }
  .type {
    width: 100%;
    height: var(--task-progress-height);
    line-height: var(--task-type-line);
    background-color: rgba(14, 208, 216, 0.06);
    .name {
      font-size: var(--font-size-12);
      font-family: Microsoft YaHei;
      font-weight: 400;
      margin-left: var(--task-name-left);
    }
    .number {
      float: right;
      margin-right: var(--task-name-right);
      font-size: var(--font-size-14);
      font-family: Heiti SC;
      font-weight: 500;
      line-height: var(--task-number-line);
    }
  }
}
.task-progress-red {
  ::v-deep .cb-progress-bar__inner {
    background-color: var(--red-color);
  }

  .type {
    position: relative;
    color: var(--red-color);
    background-color: rgb(245, 164, 91, 0.06);
    &::before {
      content: '';
      position: absolute;
      background: var(--red-bg-color);
      opacity: 0.06;
      inset: 0;
    }
  }
}
.task-progress-blue {
  ::v-deep .cb-progress-bar__inner {
    background-color: var(--blue-color);
  }
  .type {
    position: relative;
    color: var(--blue-color);
    &::before {
      content: '';
      position: absolute;
      background: var(--blue-bg-color);
      opacity: 0.06;
      inset: 0;
    }
  }
}
</style>
