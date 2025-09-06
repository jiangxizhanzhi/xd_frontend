<template>
  <!-- 任务进度 -->
  <div class="task-progress-red">
    <div class="people">{{ number }}<span>人</span></div>
    <div class="progress">
      <cb-progress :percentage="percentage">
        <template v-slot:line-right><span></span></template>
      </cb-progress>
    </div>
    <div class="type">
      <span class="name">完成任务</span>
      <span class="number">{{ percentage }}%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskProgress',
  props: {
    number: {
      type: Number,
      default: 0,
    },
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
  created() {},
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
::v-deep .cb-progress-bar__outer {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    background: var(--people-bg);
    opacity: 0.3;
    inset: 0;
  }
}

.task-progress-red {
  width: 90%;
  margin: 0 auto;

  .people {
    text-align: center;
    font-size: 28px;
    color: var(--people-color);
    font-family: Heiti SC;
    font-weight: bold;
    font-style: italic;
    margin-bottom: var(--people-mg-bm);
    span {
      font-size: var(--font-size-12) !important;
    }
  }
  .progress {
    width: 100%;
  }
  .type {
    width: 100%;
    height: var(--type-height);
    line-height: var(--type-line-height);
    .name {
      font-size: var(--font-size-12);
      font-family: Microsoft YaHei;
      font-weight: 400;
      margin-left: var(--name-mg-lf);
    }
    .number {
      float: right;
      margin-right: var(--number-mg-rg);
      font-size: var(--font-size-16);
      font-family: Heiti SC;
      font-weight: 500;
      line-height: var(--number-line-height);
    }
  }
}
.task-progress-red {
  ::v-deep .cb-progress-bar__inner {
    background-color: var(--people-bg);
  }
  .type {
    position: relative;
    color: var(--people-color);
    &::before {
      content: '';
      position: absolute;
      background: var(--people-bg);
      opacity: 0.06;
      inset: 0;
    }
  }
}
</style>
