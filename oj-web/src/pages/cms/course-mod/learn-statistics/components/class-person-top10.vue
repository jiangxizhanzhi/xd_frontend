<template>
  <div class="chartDiv">
    <cb-chart-bar
      :name="name"
      v-if="ready"
      :ySplitLineShow="ySplitLineShow"
      :barData="barData"
      :xData="xData"
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
    xData: {
      type: Array,
      default() {
        return [];
      },
    },
    barData: {
      type: Array,
      default() {
        return [];
      },
    },
    color: {
      type: Array,
      default() {
        return ['blue-color'];
      },
    },
  },
  data() {
    return {
      ready: false,
      x2y: false,
      xAxisLineShow: true,
      ySplitLineShow: true,
      //   legendShow: true,
      barWidth: '19px',
      // color: ['blue-color'],
      name: [],
      axisLableColor: '',
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
    };
  },
  computed: {
    axisLabel() {
      return {
        color: this.axisLableColor,
        interval: 0,
        fontSize: 14,
        formatter: function (params) {
          return params.length > 6 ? params.substr(0, 6) + '...' : params;
        },
      };
    },
  },
  created() {
    this.listen.createListen();
    this.ready = true;
    this.axisLableColor = this.$themed('neutral5');
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      this.ready = false;
      this.axisLableColor = this.$themed('neutral5');
      this.$nextTick(() => {
        this.ready = true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chartDiv {
  margin-top: -20px;
  width: calc(100% + 20px);
  height: 100%;
}
</style>
