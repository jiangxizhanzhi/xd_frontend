<template>
  <div class="regular-traffic">
    <line-chart :lineData="lineData"></line-chart>
  </div>
</template>
<script>
import LineChart from '../../components/line-chart-shadow-soild.vue';
export default {
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    LineChart,
  },
  name: 'regularTraffic',
  data() {
    return {
      type: [1, 2, 3],
      lineData: {
        xData: [],
        yData: [],
      },
    };
  },
  computed: {},
  watch: {
    listData: {
      handler(newVal, oldVal) {
        let xData = newVal.map((item) => {
          return item.time;
        });

        let yData = newVal.map((item) => {
          return item.data_size;
        });
        this.lineData.xData = xData;
        this.lineData.yData = yData;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.regular-traffic {
  height: calc(100% - 32px);
}
</style>
