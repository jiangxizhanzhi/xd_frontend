<template>
  <div class="chartDiv">
    <cb-chart-bar
      v-if="ready"
      :name="name"
      :ySplitLineShow="ySplitLineShow"
      :barData="directionBar"
      :xData="directionData"
      :color="color"
      :barWidth="barWidth"
      :xAxisLabel="axisLabel"
    ></cb-chart-bar>
  </div>
</template>

<script>
export default {
  name: 'line2',
  props: {
    directionData: {
      type: Array,
      default() {
        return [];
      },
    },
    directionBar: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      ready: false,
      x2y: false,
      xAxisLineShow: true,
      ySplitLineShow: true,
      barWidth: '19px',
      color: ['green-color'],
      name: [],
      xData: [],
      barData: [],
      axisLabel: {
        color: this.$themed('neutral5'),
        fontSize: 14,
        formatter: function (params) {
          return params.length > 6 ? params.substr(0, 6) + '...' : params;
        },
      },
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
    };
  },
  created() {
    this.listen.createListen();
    this.ready = true;
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      this.ready = false;
      this.axisLabel.color = this.$themed('neutral5');
      this.$nextTick(() => {
        this.ready = true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chartDiv {
  width: 100%;
  height: 100%;
}
</style>
