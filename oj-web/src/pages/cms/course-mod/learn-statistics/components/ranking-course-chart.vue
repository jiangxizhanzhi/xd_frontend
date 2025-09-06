<template>
  <div class="regex">
    <echart-wrapper
      ref="CountChart"
      :opt="option"
      :showXLabel="showXLabel"
      @ready="echartReady = true"
    ></echart-wrapper>
  </div>
</template>
<script>
export default {
  props: {
    className: {
      type: Array,
      default: '',
    },
    data: {
      type: Array,
      default: '',
    },
    showXLabel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      colorList: [],
      axisLabel: '',
      rightAxisLabel: '',
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      echartReady: false,
    };
  },
  computed: {
    option() {
      if (!this.echartReady) {
        return false;
      }
      return {
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          top: '10%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          // triggerOn: 'click',
          axisPointer: {
            type: 'none',
          },
          backgroundColor: this.$themed('bg-color-3'),
          borderWidth: 0,
          textStyle: {
            color: this.$themed('neutral8'),
          },
          formatter: function (params) {
            if (params[0].name && params[0].value) {
              return params[0].name + ' : ' + params[0].value;
            }
          },
          // formatter: function(params) {
          //     return params[0].name + '<br/>' +
          //         "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
          //         params[0].seriesName + ' : ' + params[0].value
          // }
        },
        xAxis: {
          show: false,
          type: 'value',
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            triggerEvent: true,
            // max: 5,
            // splitNumber : 5,
            axisLabel: {
              show: true,
              margin: 25,
              textStyle: {
                color: this.axisLabel,
              },
              formatter: function (value) {
                return value.length > 4 ? value.slice(0, 4) + '...' : value;
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: this.className,
          },
          {
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            show: true,
            axisLabel: {
              textStyle: {
                color: this.rightAxisLabel,
                fontSize: '14',
                fontWeight: 'bolder',
              },
              formatter: function (value) {
                return value;
              },
            },
            data: this.data,
          },
        ],
        series: [
          {
            name: 'rank',
            type: 'bar',
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: (params) => {
                  return this.colorList[params.dataIndex];
                },
              },
            },
            barWidth: 15,
            data: this.data,
          },
        ],
      };
    },
  },
  created() {
    this.listen.createListen();
    this.colorList = this.getColorList();
    this.axisLabel = this.$themed('neutral8');
    this.rightAxisLabel = this.$themed('neutral7');
    // this.resource_id = this.$route.params.userId;
    // this.getCount();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      this.colorList = this.getColorList();
      this.axisLabel = this.$themed('neutral8');
      this.rightAxisLabel = this.$themed('neutral7');
    },
    getColorList() {
      return [
        this.$themed('primary-color'),
        this.$themed('cyan-color'),
        this.$themed('yellow-color'),
        this.$themed('orange-color'),
        this.$themed('green-color'),
      ];
    },
  },
};
</script>
<style scoped lang="scss">
.regex {
  height: 225px;
}
</style>
