<template>
  <div class="node-Resource">
    <ul>
      <li>
        <img :src="iconCpu" alt="" />
        <div class="right-box">
          <span class="li-title">
            {{
              currentNode &&
              currentNode.host_state &&
              currentNode.host_state.cpu_count
            }}
            {{ $t('systemOperation.scene.core') }}
          </span>
          <br />
          <span>{{ $t('systemOperation.nodeMonitoring.cpu') }}</span>
        </div>
      </li>
      <li>
        <img :src="iconRam" alt="" />
        <div class="right-box">
          <span class="li-title">
            {{
              currentNode &&
              currentNode.host_state &&
              currentNode.host_state.memory_total
            }}MB
          </span>
          <br />
          <span>{{ $t('systemOperation.nodeMonitoring.ram') }}</span>
        </div>
      </li>

      <li>
        <img :src="iconDisk" alt="" />
        <div class="right-box">
          <span class="li-title">
            {{
              currentNode &&
              currentNode.host_state &&
              currentNode.host_state.disk_space
            }}GB
          </span>
          <br />
          <span>{{ $t('systemOperation.nodeMonitoring.disk') }}</span>
        </div>
      </li>
    </ul>
    <div class="node-line-wrap">
      <cb-echart-line
        ref="cbEchartLineRef"
        :xData="xData"
        :name="name"
        :lineData="lineData"
        :grid="grid"
        :legendShow="legendShow"
        :xAxisLine="axisLine"
        :yAxisLine="axisLine"
        :areaStyle="areaStyle"
        :tooltip="tooltip"
        :color="color"
        :symbol="symbol"
        :xAxisLabel="xAxisLabel"
        :yAxisLabel="yAxisLabel"
      ></cb-echart-line>
    </div>
  </div>
</template>
<script>
import iconCpu from '../../assets/img/icon-cpu.png';
import iconDisk from '../../assets/img/icon-disk.png';
import iconRam from '../../assets/img/icon-ram.png';
export default {
  name: 'NodeResource',
  props: {
    currentNode: {
      type: Object,
      default: () => {},
    },
    nodeRosourceTrend: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      iconCpu,
      iconDisk,
      iconRam,
      symbol: 'none',
      color: ['green-color', 'orange-color'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#242e43',
        borderWidth: 0,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
        axisPointer: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)',
            width: 1,
            type: 'solid',
          },
        },
      },
      legendShow: true,
      axisLineShow: true,
      smooth: true,
      // xType: 'time',
      //legend的显示位置
      legendLocation: 'center',
      ySplitLineShow: true,
      legendIcon: '',
      name: [
        this.$t('systemOperation.monitorReplay.cpu'),
        this.$t('systemOperation.monitorReplay.ram'),
      ],

      areaStyle: true,
      /**
       * 每种柱子的颜色和值
       */
      xData: [],
      yAxisIndex: [0, 0, 1],
      lineData: [],
      grid: {
        top: 40,
        bottom: 20,
        left: 50,
        right: 50,
        containLabel: true,
      },
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'],
        symbolSize: [5, 10],
        symbolOffset: [0, 10],
        lineStyle: { color: '#727E9A' },
      },
      xAxisLabel: {
        color: '#fff',
        opacity: 0.4,
        showMaxLabel: true,
        fontSize: 14,
      },
      yAxisLabel: {
        color: '#fff',
        opacity: 0.4,
        fontSize: 14,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.cbEchartLineRef.optionSet.legend.textStyle.color =
        'rgba(255, 255, 255, 0.7)';
    });
  },
  watch: {
    nodeRosourceTrend: {
      handler: function (nv, ov) {
        if (nv.length > 0) {
          const times = _.map(nv, (item) => {
            return item.time;
          });
          const cups = _.map(nv, (item) => {
            return item.cpu_percent;
          });
          const memorys = _.map(nv, (item) => {
            return item.memory_percent;
          });
          this.xData = times;
          this.lineData = [cups, memorys];
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.node-Resource {
  width: 100%;
  height: 80%;
  margin-top: 10px;
  ul {
    width: 60%;
    height: 21%;
    display: flex;
    justify-content: space-between;
    margin: auto;
    padding: 0;
    li {
      width: 30%;
      height: 100%;
      list-style: none;
      padding: 0;
      display: flex;
      img {
        width: 60px;
        height: 60px;
        float: left;
        margin: 7px 0px;
      }

      .right-box {
        flex: 1;
      }
      .li-title {
        display: inline-block;
        font-size: 16px;
        margin-top: 15px;
        position: relative;
        left: -5px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-weight: bold;
        text-shadow: 0 0 8px rgb(231 239 255 / 20%),
          0 0 8px rgb(231 239 255 / 20%), 0 0 8px rgb(231 239 255 / 20%),
          0 0 8px rgb(231 239 255 / 20%);
        background: linear-gradient(
          0deg,
          #bde1ff 0%,
          #ffffff 50%,
          #e7efff 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      span:last-child {
        font-size: 12px;
        position: relative;
        left: -5px;
        top: -5px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
      }
    }
  }
  .node-line-wrap {
    height: 200px;
    width: 100%;
  }
}
</style>
