<template>
  <div ref="wrapper" style="width: 100%; height: 100%" />
</template>
<script>
import Utils from '@/utils/utils.js';
import _ from 'lodash';
export default {
  name: 'EchartWrapperInner',
  props: {
    opt: {
      type: Object,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      inst: null,
    };
  },
  watch: {
    opt(option) {
      const that = this;
      if (that.inst && !_.isEmpty(option)) {
        that.inst.setOption(option);
      }
    },
  },
  mounted() {
    const that = this;
    that.inst = this.$echarts.init(that.$refs.wrapper);
    if (that.opt) {
      that.inst.setOption(that.opt);
    }

    that.__resizeHandler = Utils.debounce(() => {
      if (that.inst) {
        that.inst.resize();
      }
    }, 50);
    window.addEventListener('resize', that.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.inst) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);
    this.inst.dispose();
    this.inst = null;
  },
};
</script>
