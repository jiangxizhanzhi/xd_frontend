<template>
  <!-- <div :id="id" class="char-pie" style="width:100%; height:100%" />
   -->
  <chart-wrapper v-if="!!chartOption" :opt="chartOption" />
</template>

<script>
import { debounce } from '@/utils';
import chartWrapper from '@/components/chart-wrapper/chart-wrapper-main.vue';
import _ from 'lodash';

export default {
  name: 'CharPie',
  components: {
    chartWrapper,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    color: {
      type: Array,
      default: function () {
        return [];
      },
    },
    taskData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    // const that = this
    return {
      echartReady: false,
      defenseResultChar: null,
      unit: '个',
      item: '项',
      defenseOption: {
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: '70%',
          y: '25%',
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          textStyle: {
            fontSize: 14,
            color: '#fff',
          },
          pageIconInactiveColor: '#2f4554', // 翻页按钮不激活时颜色
          pageIconColor: '#aaa', // 翻页按钮颜色
          pageTextStyle: {
            color: '#8b94b1',
          },
          formatter: function (legend) {
            return legend;
          },
        },
        title: {
          text: '',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 14,
            color: '#fff',
          },
        },
        grid: {
          // y: 25,
          top: 20,
          // show: false,
        },
        // legend: {
        //   show: false,
        // },
        color: this.color,
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            // labelLine: {
            //   normal: {
            //     length: 20,
            //     length2: 120,
            //     lineStyle: {
            //       color: this.color[6],
            //     },
            //   },
            // },
            label: {
              show: false,
              position: 'center',
            },
            // emphasis: {
            //     label: {
            //         show: true,
            //         fontSize: '30',
            //         fontWeight: 'bold'
            //     }
            // },
            labelLine: {
              show: false,
            },
            // minAngle: 45,//最小角度
            // startAngle: 270, //起始角度
            // label: {
            //   normal: {
            //     formatter: '{b|{b}} {a|{c}项} {a|{d}%}\n\n',
            //     borderWidth: 20,
            //     borderRadius: 4,
            //     padding: [10, -100],
            //     rich: {
            //       a: {
            //         color: '#fff',
            //         fontSize: 14,
            //         lineHeight: 20,
            //         fontWeight: 'blod',
            //         padding: [0, 5],
            //       },
            //       b: {
            //         color: '#fff',
            //         fontSize: 14,
            //         lineHeight: 20,
            //       },
            //       c: {
            //         color: '#fff',
            //         fontSize: 14,
            //         lineHeight: 20,
            //       },
            //       d: {
            //         color: '#fff',
            //         fontSize: 14,
            //         lineHeight: 20,
            //       },
            //     },
            //   },
            // },

            data: [],
          },
        ],
      },
    };
  },
  computed: {
    chartOption() {
      const that = this;
      const { taskData, unit, item } = that;

      if (_.isEmpty(taskData)) {
        return false;
      }
      const legendDict = {};
      const legendPercent = {};
      const seriesData = _.filter(_.toPairs(taskData), (item) => {
        const key = _.get(item, '[0]', '');
        return key !== 'total';
      }).map((item) => {
        const value = _.get(item, '[1]', 0);
        const name = that.$t(`taskStatus.${_.get(item, '[0]', '')}`);
        const percent =
          taskData.total === 0 ? 0 : _.get(item, '[1]', 0) / taskData.total;
        legendPercent[name] = Math.round(percent * 100) + '%';
        legendDict[name] = value;
        return {
          value,
          name,
          percent,
        };
      });

      return {
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: '60%',
          align: 'left',
          top: 'middle',
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          textStyle: {
            fontSize: 14,
            color: '#fff',
          },
          pageIconInactiveColor: '#2f4554', // 翻页按钮不激活时颜色
          pageIconColor: '#aaa', // 翻页按钮颜色
          pageTextStyle: {
            color: '#8b94b1',
          },
          formatter: function (legend) {
            return `${legend} ${legendDict[legend]}  ${legendPercent[legend]}`;
          },
        },
        title: {
          text: taskData.total ? `${taskData.total}` : `0`,
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff',
          },
          textAlign: 'center',
          x: '34%',
          y: '45%',
        },
        grid: {
          top: 20,
        },
        color: this.color,
        series: [
          {
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['35%', '50%'],
            labelLine: {
              normal: {
                length: 20,
                length2: 120,
                lineStyle: {
                  color: this.color[6],
                },
              },
            },

            label: {
              show: false,
              position: 'center',
            },
            labelLine: {
              show: false,
            },
            data: seriesData,
          },
        ],
      };
    },
  },
  /*
  watch: {
    taskData(val) {
      this.defenseOption.title.text = ''
      this.defenseOption.series[0].data = []
      this.taskData = val
      this.defenseOption.title.text = val.total ? `${val.total}项` : '0项'
      const finalData = this.defenseOption.series[0].data
      const wait = { value: val.wait, name: '待审核' }
      const unreported = { value: val.unreported, name: '未上报' }
      const success = { value: val.success, name: '成功' }
      const fail = { value: val.fail, name: '失败' }
      const reject = { value: val.reject, name: '驳回' }
      finalData.push(wait)
      finalData.push(unreported)
      finalData.push(success)
      finalData.push(fail)
      finalData.push(reject)
      // this.taskData = finalData
      this.initDefense()

    },
  },
  */
  // created() {
  // },
  // mounted() {
  //   if (this.id === 'defenseResult') {
  //     this.initDefense()
  //   }
  //   this.__resizeHandler = debounce(() => {
  //     if (this.attackResultChar) {
  //       this.attackResultChar.resize()
  //     }
  //     if (this.defenseResultChar) {
  //       this.defenseResultChar.resize()
  //     }
  //   }, 50)
  //   window.addEventListener('resize', this.__resizeHandler)
  // },
  // beforeDestroy() {
  //   if (this.attackResultChar || this.defenseResultChar) {
  //     return
  //   }
  //   window.removeEventListener('resize', this.__resizeHandler)
  //   this.attackResultChar.dispose()
  //   this.attackResultChar = null
  //   this.defenseResultChar.dispose()
  //   this.defenseResultChar = null
  // },
  // methods: {
  //   initAttack() {
  //     this.attackResultChar = this.$echarts.init(document.getElementById('attackResult'))
  //     this.attackResultChar.setOption(this.attackOption)
  //   },
  //   initDefense() {
  //     this.defenseResultChar = this.$echarts.init(document.getElementById('defenseResult'))
  //     this.defenseResultChar.setOption(this.defenseOption)
  //   },
  // },
};
</script>

<style></style>
