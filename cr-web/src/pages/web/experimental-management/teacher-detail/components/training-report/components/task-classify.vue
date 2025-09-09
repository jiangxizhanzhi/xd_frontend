<template>
  <div class="task-classify">
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
      type: [Array, Object],
      default: [],
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      option: {
        color: [
          this.$themed('primary-color'),
          this.$themed('blue-color'),
          this.$themed('green-color'),
          this.$themed('orange-color'),
          this.$themed('red-color'),
        ],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: '42%',
            style: {
              text: this.count,
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
              text: this.$t('rbt.taskClassification'),
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
            top: 0,
            bottom: 0,
            data: this.pieData,
            label: {
              formatter: '{b|{b}}\n{c|{c}}',
              minMargin: 0,
              color: this.$themed('neutral7'),
              fontSize: 14,
              lineHeight: 22,
              alignTo: 'edge',
              margin: 90,
              distanceToLabelLine: 0, // label距离引导线距离
              rich: {
                b: {
                  color: this.$themed('neutral7'),
                },
                c: {
                  color: this.$themed('neutral7'),
                },
              },
              distanceToLabelLine: 0,
            },
            labelLine: {
              // length: 30,
              // length2: 40,
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
      handler(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.option.series[0].data = newVal;
            this.option.graphic[0].style.text = this.count;
            this.$refs.demoRef.initChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.task-classify {
  width: 100%;
  height: calc(100% - 36px);
}
</style>
