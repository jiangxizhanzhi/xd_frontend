<template>
  <!--  <div id="myChart" style="width: 320px;height: 245px" />-->
  <div ref="myChart" style="width: 320px; height: 245px" />
</template>
<script>
require('echarts/theme/macarons'); // echarts theme
import { debounce } from '@/utils';
export default {
  name: 'ChartCom',
  props: {
    skillPoints: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      options: {
        radar: [
          {
            indicator: [
              { text: this.$t('missions.socialEngineering'), max: 5 },
              { text: this.$t('missions.cryptography'), max: 5 },
              { text: this.$t('missions.vulnerability'), max: 5 },
              { text: this.$t('missions.penetration'), max: 5 },
              { text: this.$t('missions.application'), max: 5 },
              { text: this.$t('missions.others'), max: 5 },
            ],
            radius: 80,
            center: ['50%', '46%'],
          },
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item',
            },
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [
              {
                value: [1, 1, 1, 1, 1, 1],
                name: 'skill',
              },
            ],
          },
        ],
      },
      chart: '',
    };
  },
  watch: {
    skillPoints: {
      handler(val) {
        if (this.chart) {
          this.options.series[0].data[0].value = val;
          this.chart.setOption(this.options);
          window.onresize = this.chart.resize;
        }
      },
    },
  },
  // computed: {
  //   indicator: function () {
  //     var lang = this.$store.state.app.language
  //     if (lang === 'en') {
  //       this.options.radar[0].indicator = [
  //         { text: '社会工程学', max: 5 },
  //         { text: '密码学', max: 5 },
  //         { text: '漏洞', max: 5 },
  //         { text: '应用层渗透', max: 5 },
  //         { text: '数据运用', max: 5 },
  //         { text: this.$t('missions.others'), max: 5 },
  //       ]
  //     }
  //   },
  // },
  mounted() {
    this.drawLine();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0];
    this.sidebarElm &&
      this.sidebarElm.addEventListener(
        'transitionend',
        this.sidebarResizeHandler,
      );
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler);
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        'transitionend',
        this.sidebarResizeHandler,
      );

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      // this.chart = this.$echarts.init(document.getElementById('myChart'))
      this.chart = this.$echarts.init(this.$refs.myChart);
      // 绘制图表
      this.chart.setOption(this.options);
      window.addEventListener('resize', function () {
        this.chart.resize();
      });
    },
  },
};
</script>
