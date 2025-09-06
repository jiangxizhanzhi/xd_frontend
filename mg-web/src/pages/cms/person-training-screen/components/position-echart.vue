<template>
  <div ref="divRef" style="height: 100%; width: 100%" v-loading="loading"></div>
</template>

<script>
import * as Echarts from 'echarts';
import 'echarts-gl';
import { talentPosition } from '@/api/person-training-screen';
import _ from 'lodash';
export default {
  props: {},
  data() {
    return {
      loading: false,
      myChart: null,

      option: {
        tooltip: {
          borderWidth: 0,
          confine: true,
          backgroundColor: 'rgba(3, 110, 218, 0.7)',
          //tooltip的文本颜色
          textStyle: {
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 24,
          },
        },
        visualMap: {
          max: 10,
          left: '3%',
          bottom: '3%',
          padding: 20,
          textStyle: {
            color: 'rgba(255, 255, 255, 0.9)',
          },
          inRange: {
            color: [
              '#1671DB',
              '#1693DB',
              '#16B4DB',
              '#16D5DB',
              '#16DBA0',
              '#16DB3D',
              '#72DB16',
              '#B4DB16',
              '#DBC116',
              '#DB7F16',
            ],
          },
        },
        xAxis3D: {
          type: 'category',
          name: '',
          data: [],
          axisLabel: {
            show: false,
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0)',
            },
          },
        },
        yAxis3D: {
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
          },
          type: 'category',
          name: '',
          data: [],
          axisLabel: {
            show: true,
            margin: 1,
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
        },
        zAxis3D: {
          type: 'value',
          name: '',
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
          },
        },
        grid3D: {
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
          },
          axisPointer: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)',
              width: 1,
              type: 'solid',
            },
          },
          boxWidth: 200,
          boxDepth: 80,
          left: -40,
          top: -100,
          light: {
            main: {
              intensity: 1.2,
              shadow: true,
            },
            ambient: {
              intensity: 0.3,
            },
          },

          viewControl: { distance: 245 },
        },
        series: [
          {
            type: 'bar3D',
            data: [],
            shading: 'lambert',
            label: {
              fontSize: 14,
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
                color: '#ff6652',
              },
              itemStyle: {
                color: '#ff6652',
              },
            },
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.getTalentPosition();
  },
  methods: {
    getTalentPosition() {
      this.loading = true;
      talentPosition().then((res) => {
        this.loading = false;
        const data = _.get(res, 'data.data');
        const yData = [];
        const xData = [];
        const zData = [];

        data.map((item, index) => {
          yData.push(item.level_name);
          if (item.roles) {
            item.roles.map((child) => {
              const positionData = [];
              xData.push(child.role_name);
              positionData[0] = index;
              positionData[2] = child.qualified;
              zData.push(positionData);
            });
          }
        });
        zData.forEach((item, index) => {
          item[1] = index;
        });
        this.option.xAxis3D.data = xData;
        this.option.yAxis3D.data = yData;
        this.option.series[0].data = this.delWithData(zData);
        this.loadEchart();
      });
    },
    delWithData(data) {
      return data.map(function (item) {
        return {
          value: [item[1], item[0], item[2]],
        };
      });
    },
    loadEchart() {
      this.$nextTick(() => {
        this.ready = true;
        this.option.tooltip.formatter = (params) => {
          return this.getFormat(params);
        };
        this.myChart = Echarts.init(this.$refs.divRef);
        this.myChart.setOption(this.option);
      });
    },
    getFormat(params) {
      let xName = this.option.xAxis3D.data[params.value[0]];
      let yName = this.option.yAxis3D.data[params.value[1]];
      let zValue = params.value[2];

      const str = `<div><p style="font-weight:600;margin:0 8px;color:rgba(255, 255, 255, 0.9)"><span style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:rgba(129, 236, 86, 1);"></span>${xName}</p></div> 
      <div style="font-weight:400;color:rgba(255, 255, 255, 0.7);text-align:left;margin-left:24px;margin-top:6px"><span style="display:block;">y: ${yName}<span/><span style="display:block;">z: ${zValue}<span/> </div>
      `;
      return str;
    },
  },
};
</script>

<style lang="scss" scoped></style>
