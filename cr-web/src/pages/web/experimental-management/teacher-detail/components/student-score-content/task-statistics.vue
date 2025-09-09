<template>
  <!-- 团队训练学员评分页面任务统计数据 -->
  <div class="task-statistics">
    <block :title="$t('rbt.taskStatistics')"></block>
    <div class="chart-wrap">
      <chart-demo ref="demoRef" :option="option"></chart-demo>
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
import chartDemo from './chart-demo';
export default {
  components: {
    block,
    chartDemo,
  },
  props: {
    pieData: {
      type: Array,
      default() {
        return [];
      },
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      option: {
        color: [
          this.$themed('green-color'),
          this.$themed('red-color'),
          this.$themed('orange-color'),
          this.$themed('--primary-color'),
        ],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: '36%',
            style: {
              text: Number(this.total),
              fontSize: 24,
              fill: this.$themed('neutral8'),
              textAlign: 'center',
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '56%',
            style: {
              text: this.$t('rbt.taskTotal'),
              fontSize: 14,
              fill: this.$themed('neutral5'),
              textAlign: 'center',
            },
          },
        ],
        tooltip: {
          triggerOn: 'mousemove',
          //背景颜色
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          //tooltip的文本颜色
          textStyle: {
            color: this.$themed('neutral8'),
          },
          trigger: 'item',
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '70%'],
            // 避免标签重叠
            avoidLabelOverlap: true,
            itemStyle: {
              borderColor: this.$themed('bg-color-3'), //cy14
              borderWidth: 3,
            },
            center: ['50%', '50%'],
            left: 0,
            right: 0,
            top: 16,
            bottom: 0,
            data: this.pieData,
            label: {
              // formatter: '{b|{b}}：{c|{c}}\n{d|{d}%}',
              formatter: (params) => {
                const x = params.dataIndex;
                return (
                  '{name' +
                  x +
                  '|' +
                  params.data.name +
                  ':' +
                  params.data.value +
                  '}' +
                  '\n' +
                  '{zb' +
                  x +
                  '|' +
                  Math.round(params.percent) +
                  '%}'
                );
              },
              minMargin: 0,
              color: this.$themed('neutral7'),
              fontSize: 14,
              lineHeight: 22,
              alignTo: 'edge',
              margin: 90,
              distanceToLabelLine: 0, // label距离引导线距离
              rich: {
                //    b: {
                //   color: this.$themed('neutral7'),
                // },
                // c: {
                //   color: this.$themed('neutral7'),
                // },
                // d: {
                //   color: this.$themed('neutral7'),
                // },
                name0: {
                  color: this.$themed('neutral7'),
                  fontSize: 14,
                },
                name1: {
                  color: this.$themed('neutral7'),
                  fontSize: 14,
                },
                name2: {
                  color: this.$themed('neutral7'),
                  fontSize: 14,
                },
                name3: {
                  color: this.$themed('neutral7'),
                  fontSize: 14,
                },
                zb0: {
                  color: this.$themed('neutral7'),
                  fontSize: 14,
                },
                zb1: {
                  color: this.$themed('neutral7'),
                  fontSize: 14,
                },
                zb2: {
                  color: this.$themed('neutral7'),
                  fontSize: 14,
                },
                zb3: {
                  color: this.$themed('neutral7'),
                  fontSize: 14,
                },
              },
              distanceToLabelLine: 0,
            },
            labelLine: {
              length: 10,
              length2: 0,
              maxSurfaceAngle: 80,
              lineStyle: {
                color: this.$themed('neutral3'),
              },
            },
            labelLayout: (params) => {
              params.align = 'left';
              const isLeft =
                params.labelRect.x < this.$refs.demoRef.chart.getWidth() / 2;
              const points = params.labelLinePoints;
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
              return {
                labelLinePoints: points,
              };
            },
          },
        ],
      },
    };
  },
  watch: {
    pieData: {
      handler(val, oldval) {
        this.option.series[0].data = this.pieData;
      },
      deep: true,
      immediate: true,
    },
    total: {
      handler(val, oldval) {
        this.option.graphic[0].style.text = this.total;
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.task-statistics {
  width: 100%;
  height: 100%;
  .chart-wrap {
    height: calc(100% - 36px);
  }
}
</style>
