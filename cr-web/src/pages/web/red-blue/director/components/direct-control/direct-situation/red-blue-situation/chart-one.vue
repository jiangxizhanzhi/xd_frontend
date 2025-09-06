<template>
  <div class="task-statistics">
    <chart-demo ref="demoRef" :option="option"></chart-demo>
  </div>
</template>

<script>
import chartDemo from './chart-demo';
export default {
  components: {
    chartDemo,
  },
  props: {
    pieData: {
      type: Array,
      default() {
        return [];
      },
    },
    totalCount: {
      type: Number,
      default: 0,
    },
    refreshTypes: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      option: {
        color: [
          this.$themed('--primary-color'),
          this.$themed('green-color'),
          this.$themed('orange-color'),
          this.$themed('--yellow-color'),
          this.$themed('red-color'),
          this.$themed('blue-color'),
        ],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: '38%',
            style: {
              text: Number(this.totalCount),
              fontSize: 24,
              fill: this.$themed('neutral8'),
              textAlign: 'center',
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '55%',
            style: {
              // text: this.$t('rbt.pilotEvent') + '\n' + this.$t('rbt.totalNum'),
              text: this.$t('rbt.pilotEvent'),
              fontSize: 14,
              fill: this.$themed('neutral5'),
              textAlign: 'center',
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '65%',
            style: {
              text: this.$t('rbt.totalNum'),
              fontSize: 14,
              fill: this.$themed('neutral5'),
              textAlign: 'center',
            },
          },
        ],
        tooltip: {
          triggerOn: 'mousemove',
          // formatter: '{b}:{d}%',
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
            // radius: ['55%', '70%'],
            radius: ['63%', '80%'],
            // 避免标签重叠
            avoidLabelOverlap: true,
            itemStyle: {
              borderColor: this.$themed('bg-color-3'), //cy14
              borderWidth: 3,
            },
            center: ['50%', '50%'],
            left: '7%',
            right: '7%',
            top: 16,
            bottom: 8,
            data: this.pieData,
            label: {
              formatter: (params) => {
                const x = params.dataIndex;
                return (
                  '{name' +
                  x +
                  '|' +
                  params.data.name +
                  '' +
                  '}' +
                  '\n' +
                  params.value
                );
              },
              minMargin: 0,
              color: this.$themed('neutral7'),
              fontSize: 14,
              lineHeight: 22,
              alignTo: 'edge',
              margin: 45,
              distanceToLabelLine: 0, // label距离引导线距离
              rich: {
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
            },
            labelLine: {
              length: 10,
              length2: 0,
              maxSurfaceAngle: 80,
              lineStyle: {
                // color: this.$themed('neutral3'),
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

    refreshTypes: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.option.series[0].data = this.pieData;
        }
      },
      deep: true,
      immediate: true,
    },

    totalCount: {
      handler(val, oldval) {
        this.option.graphic[0].style.text = this.totalCount;
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
}
</style>
