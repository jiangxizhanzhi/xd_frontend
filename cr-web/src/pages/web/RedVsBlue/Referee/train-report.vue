<template>
  <div class="train-report">
    <cb-tabs v-model="active" class="special-tabs">
      <cb-tab-pane name="red" :label="$t('common.redUser')"> </cb-tab-pane>
      <cb-tab-pane name="blue" :label="$t('common.blueUser')"></cb-tab-pane>
    </cb-tabs>
    <div class="big-boxs">
      <train-report-group :current="currentGroup" />
    </div>
  </div>
</template>
<script>
import TrainReportGroup from './components/train-report-group.vue';
export default {
  components: {
    TrainReportGroup,
  },
  props: {
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      active: 'red',
      currentGroup: 4,
    };
  },
  watch: {
    active: {
      handler(nv, ov) {
        if (nv === 'red') {
          this.currentGroup = 4;
        } else if (nv === 'blue') {
          this.currentGroup = 5;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.train-report {
  padding-top: 10px;
  height: 100%;
  .big-boxs {
    height: calc(100% - 40px);
  }
  .special-tabs {
    ::v-deep.el-tabs {
      .el-tabs__header {
        background: transparent;
      }
      .el-tabs__item {
        background: transparent !important;
      }
      .el-tabs__nav-wrap::after {
        background-color: var(--neutral3);
        height: 1px;
      }
    }
  }
}
</style>
