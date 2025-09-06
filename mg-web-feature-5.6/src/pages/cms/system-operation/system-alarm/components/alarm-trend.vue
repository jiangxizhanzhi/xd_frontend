<template>
  <div class="alarm-trend-page">
    <div class="title">
      <span></span>
      <span>{{ $t('systemOperation.systemAlarm.alarmTrend') }}</span>
      <span class="tip">{{
        $t('systemOperation.systemAlarm.recentData')
      }}</span>
    </div>
    <div class="chart-area">
      <div
        v-show="serviceLineShow"
        class="service-chart"
        ref="serviceLine"
      ></div>
      <div v-show="!serviceLineShow" class="no-data">
        <div class="serviceChartName">
          {{ $t('systemOperation.systemAlarm.serviceAlarm') }}
        </div>
        <div class="info">
          <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
          <div>{{ $t('systemOperation.systemAlarm.noData') }}</div>
        </div>
      </div>
      <div v-show="devicelineShow" class="device-chart" ref="deviceline"></div>
      <div v-show="!devicelineShow" class="no-data ml15">
        <div class="deviceChartName">
          {{ $t('systemOperation.systemAlarm.deviceAlarm') }}
        </div>
        <div class="info">
          <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
          <div>{{ $t('systemOperation.systemAlarm.noData') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Echarts from 'echarts';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
export default {
  props: {
    alarmData: {
      Type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      serviceLineShow: true,
      devicelineShow: true,
      serviceOptions: {
        tooltip: {
          triggerOn: 'mousemove',
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          textStyle: {
            color: this.$themed('neutral8'),
          },
          trigger: 'axis',
        },
        title: {
          left: 'center',
          text: this.$t('systemOperation.systemAlarm.serviceAlarm'),
          top: 5,
          textStyle: {
            color: this.$themed('blue-color'),
            fontWeight: 'normal',
            fontSize: 14,
          },
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            inside: false,
            showMinLabel: true,
            showMaxLabel: true,
            verticalAlign: 'top',
            color: this.$themed('neutral5'),
          },
          data: [],
        },
        yAxis: {
          name: this.$t('systemOperation.systemAlarm.times'),
          nameTextStyle: {
            padding: [30, 0, 0, -30],
            color: this.$themed('neutral5'),
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            color: this.$themed('neutral5'),
          },
          splitLine: {
            lineStyle: {
              color: this.$themed('neutral2'),
              type: 'soild',
            },
          },
          minInterval: 1,
        },
        color: [this.$themed('blue-color')],
        series: [
          {
            type: 'line',
            symbol: 'none',
            data: [],
            smooth: true,
          },
        ],
        grid: {
          top: 40,
          left: 20,
          right: 20,
          bottom: 10,
          containLabel: true,
        },
      },
      deviceOptions: {
        tooltip: {
          triggerOn: 'mousemove',
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          textStyle: {
            color: this.$themed('neutral8'),
          },
          trigger: 'axis',
        },
        title: {
          left: 'center',
          text: this.$t('systemOperation.systemAlarm.deviceAlarm'),
          top: 5,
          textStyle: {
            color: this.$themed('cyan-color'),
            fontWeight: 'normal',
            fontSize: 14,
          },
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            inside: false,
            showMinLabel: true,
            showMaxLabel: true,
            verticalAlign: 'top',
            color: this.$themed('neutral5'),
          },
          data: [],
        },
        yAxis: {
          name: this.$t('systemOperation.systemAlarm.times'),
          nameTextStyle: {
            padding: [30, 0, 0, -30],
            color: this.$themed('neutral5'),
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            color: this.$themed('neutral5'),
          },
          splitLine: {
            lineStyle: {
              color: this.$themed('neutral2'),
              type: 'soild',
            },
          },
          minInterval: 1,
        },
        color: [this.$themed('cyan-color')],
        series: [
          {
            type: 'line',
            symbol: 'none',
            data: [],
            smooth: true,
          },
        ],
        grid: {
          top: 40,
          left: 20,
          right: 20,
          bottom: 10,
          containLabel: true,
        },
      },
    };
  },
  created() {
    this.listen.createListen();
  },
  mounted() {
    this.initLine();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  watch: {
    alarmData() {
      this.getTrendInfo();
    },
  },
  methods: {
    listenFunc() {
      const nameTextStyle = {
        padding: [30, 0, 0, -30],
        color: this.$themed('neutral5'),
      };
      const xAxisLabel = {
        fontSize: 14,
        inside: false,
        showMinLabel: true,
        showMaxLabel: true,
        verticalAlign: 'top',
        color: this.$themed('neutral5'),
      };
      const yAxisLabel = {
        fontSize: 14,
        color: this.$themed('neutral5'),
      };
      const splitData = {
        lineStyle: {
          color: this.$themed('neutral2'),
          type: 'soild',
        },
      };
      const tooltip = {
        triggerOn: 'mousemove',
        backgroundColor: this.$themed('bg-color-1'),
        borderWidth: 0,
        show: true,
        textStyle: {
          color: this.$themed('neutral8'),
        },
        trigger: 'axis',
      };
      this.serviceOptions.yAxis.nameTextStyle = nameTextStyle;
      this.deviceOptions.yAxis.nameTextStyle = nameTextStyle;
      this.serviceOptions.xAxis.axisLabel = xAxisLabel;
      this.deviceOptions.xAxis.axisLabel = xAxisLabel;
      this.serviceOptions.yAxis.axisLabel = yAxisLabel;
      this.deviceOptions.yAxis.axisLabel = yAxisLabel;
      this.serviceOptions.tooltip = tooltip;
      this.deviceOptions.tooltip = tooltip;
      this.serviceOptions.yAxis.splitLine = splitData;
      this.deviceOptions.yAxis.splitLine = splitData;
      this.serviceOptions.color = [this.$themed('blue-color')];
      this.deviceOptions.color = [this.$themed('cyan-color')];
      this.serviceChart.setOption(this.serviceOptions);
      this.deviceChart.setOption(this.deviceOptions);
    },
    initLine() {
      this.serviceChart = Echarts.init(this.$refs.serviceLine);
      this.serviceChart.setOption(this.serviceOptions);
      this.deviceChart = Echarts.init(this.$refs.deviceline);
      this.deviceChart.setOption(this.deviceOptions);
    },
    getTrendInfo() {
      const data = this.alarmData;
      const serviceData = data.service_alarm_list;
      const deviceData = data.server_alarm_list;
      if (!serviceData.length) {
        this.serviceLineShow = false;
      }
      if (!deviceData.length) {
        this.devicelineShow = false;
      }
      const serviceXaxisData = [];
      const serviceYaxisData = [];
      const deviceXaxisData = [];
      const deviceYaxisData = [];
      serviceData.forEach((item) => {
        serviceXaxisData.push(item.alarm_date.substring(5));
        serviceYaxisData.push(item.alarm_count);
      });
      deviceData.forEach((item) => {
        deviceXaxisData.push(item.alarm_date.substring(5));
        deviceYaxisData.push(item.alarm_count);
      });
      this.serviceOptions.xAxis.data = serviceXaxisData;
      this.serviceOptions.series[0].data = serviceYaxisData;
      this.deviceOptions.xAxis.data = deviceXaxisData;
      this.deviceOptions.series[0].data = deviceYaxisData;
      this.serviceChart.setOption(this.serviceOptions);
      this.deviceChart.setOption(this.deviceOptions);
    },
  },
};
</script>
<style lang="scss" scoped>
.alarm-trend-page {
  width: 100%;
  height: 280px;
  padding: 16px;
  background: var(--bg-color-2);
  color: var(--neutral8);
  .title {
    font-size: 16px;
    display: flex;
    align-items: center;
    color: var(--font-color-primary);
    span:first-child {
      width: 6px;
      height: 8px;
      margin-right: 10px;
      background: var(--primary-color);
    }
    .tip {
      margin-left: 16px;
      font-size: 12px;
      color: var(--neutral5);
    }
  }
  .chart-area {
    display: flex;
    margin-top: 20px;
    .service-chart {
      width: 50%;
      height: 200px;
      background: var(--neutral0);
    }
    .device-chart {
      margin-left: 15px;
      width: 50%;
      height: 200px;
      background: var(--neutral0);
    }
  }
  .serviceChartName {
    font-size: 14px;
    color: var(--blue-color);
    margin-top: 6px;
  }
  .deviceChartName {
    font-size: 14px;
    color: var(--cyan-color);
    margin-top: 6px;
  }
  .no-data {
    height: 200px;
    width: 50%;
    text-align: center;
    position: relative;
    background: var(--neutral0);
    .info {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
    }
  }
  .ml15 {
    margin-left: 15px;
  }
}
</style>
