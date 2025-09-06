<template>
  <Block :mb="false" :title="$t('dashboard.systemApplication')">
    <div class="chartDiv">
      <cb-echart-line
        v-if="ready"
        :yAxisLabelFormatter="yAxisLabelFormatter"
        :ySplitLineShow="ySplitLineShow"
        :legendShow="legendShow"
        :xData="xData"
        :name="name"
        :lineData="lineData"
        :symbol="symbol"
        :toolTipFormatter="toolTipFormatter"
        :color="color"
        :axisLineShow="false"
        :grid="grid"
        :areaStyle="true"
        :smooth="true"
      ></cb-echart-line>
    </div>
  </Block>
</template>

<script>
import Block from '@/components/block';
export default {
  name: 'line2',
  components: { Block },
  data() {
    return {
      clusterData: {},
      radio_value: 'CPU',
      ready: false,
      color: ['green-color', 'orange-color', 'primary-color'],
      legendShow: true,
      axisLineShow: true,
      smooth: true,
      //legend的显示位置
      legendLocation: 'center',
      symbol: 'none',
      ySplitLineShow: true,
      legendIcon: 'rect',
      name: [
        this.$t('dashboard.cpu'),
        this.$t('dashboard.ram'),
        this.$t('dashboard.disk'),
      ],
      /**
       * 每种柱子的颜色和值
       */
      xData: [],
      lineData: [],
      yAxisLabelFormatter: (val, index) => {
        return val + '%';
      },
      toolTipFormatter: '',
      groups: [
        {
          label: 'CPU',
          value: `${this.$t('dashboard.cpu')}`,
        },
        {
          label: 'RAM',
          value: `${this.$t('dashboard.ram')}`,
        },
        {
          label: 'DISK',
          value: `${this.$t('dashboard.disk')}`,
        },
      ],
      grid: {
        right: '4%',
        left: '2%',
        bottom: '3%',
        containLabel: true,
      },
    };
  },
  created() {
    this.$request
      .get('/system_info/app_running_info', null, {
        baseURL: '/api/ojj',
      })
      .then((resp) => {
        this.clusterData = _.get(resp, 'data.data', {});
        _.forEach(this.clusterData.xaxis, (item) => {
          this.xData.push(item.substr(11, 5));
        });
        this.lineData.push(
          this.clusterData.cpudata,
          this.clusterData.ramdata,
          this.clusterData.diskdata,
        );
        this.toolTipFormatter = (params) => {
          var relVal = params[0].name;
          for (var i = 0, l = params.length; i < l; i++) {
            relVal +=
              '<br/>' +
              params[i].marker +
              params[i].seriesName +
              ' ' +
              params[i].value +
              '%';
          }
          return relVal;
        };
        this.ready = true;
      });
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.chartDiv {
  width: 100%;
  height: calc(100% - 21px);
  position: relative;
}
</style>
