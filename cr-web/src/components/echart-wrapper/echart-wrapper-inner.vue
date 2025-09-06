<template>
  <div ref="wrapper" style="width: 100%; height: 100%" />
</template>
<script>
import Utils from '../../utils/utils.js';
import _ from 'lodash';
import * as echarts from 'echarts';

export default {
  name: 'EchartWrapperInner',
  props: {
    opt: {
      type: Object,
      default: () => {
        return false;
      },
    },
    showXLabel: {
      type: Boolean,
      default: false,
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
    that.inst = echarts.init(that.$refs.wrapper);
    if (that.opt) {
      that.inst.setOption(that.opt);
    }
    if (that.showXLabel) {
      this.extension(that.inst);
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
  methods: {
    // 鼠标悬浮显示文字信息, 在options中需要配置triggerEvent: true
    extension(myChart) {
      myChart.on('mouseover', (params) => {
        if (params.componentType === 'yAxis') {
          xLabel = params.value;
          let offsetX = params.event.offsetX + 20;
          let offsetY = params.event.offsetY + 20;
          myChart.setOption({
            tooltip: {
              formatter: formateTooltip,
              alwaysShowContent: true,
            },
          });
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: 0,
            position: [offsetX, offsetY],
          });
        } else if (params.componentType === 'series') {
          myChart.setOption({
            tooltip: {
              formatter: function (params) {
                if (params[0].name && params[0].value) {
                  return params[0].name + ' : ' + params[0].value;
                }
              },
              alwaysShowContent: true,
              confine: true,
            },
          });
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: params.seriesIndex,
            dataIndex: params.dataIndex,
          });
        }
      });
      myChart.on('mouseout', (params) => {
        myChart.setOption({
          tooltip: {
            alwaysShowContent: false,
          },
        });
        if (params.componentType === 'yAxis') {
          xLabel = '';
        }
      });
      var xLabel = '';
      function formateTooltip(params) {
        return xLabel;
      }
    },
  },
};
</script>
