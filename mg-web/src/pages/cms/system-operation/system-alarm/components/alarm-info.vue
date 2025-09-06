<template>
  <div class="alarm-info-page">
    <div class="system-alarm">
      <div class="title">
        <span></span>
        <span>{{ $t('systemOperation.systemAlarm.systemAlarm') }}</span>
      </div>
      <div class="count">
        <div>
          <span>{{ $t('systemOperation.systemAlarm.monitorTotal') }}</span>
          <span class="num num-total">{{ total }}</span>
        </div>
        <div>
          <span class="circle-normal"></span>
          <span>{{ $t('systemOperation.systemAlarm.normal') }}</span>
          <span class="num num-normal">{{ normalTotal }}</span>
        </div>
        <div>
          <span class="circle-abnormal"></span>
          <span>{{ $t('systemOperation.systemAlarm.abnormal') }}</span>
          <span class="num num-abnormal">{{ abnormalTotal }}</span>
        </div>
      </div>
      <div class="monitor">
        <div class="monitor-area cloud-monitor" @click="seeDetail()">
          <div
            :class="[cloudInfo.alarm_count > 0 ? 'icon-warning' : 'icon']"
            class="cloud-icon"
          >
            <cb-iconfont
              type="icon-xuniji-zhuangshi"
              color="#fff"
              size="25"
            ></cb-iconfont>
          </div>
          <div>
            <div>{{ $t('systemOperation.systemAlarm.cloudMonitor') }}</div>
            <div class="monitor-count">
              <span
                :class="[cloudInfo.alarm_count > 0 ? 'num-abnormal' : '']"
                >{{ cloudInfo.alarm_count }}</span
              >
              <span>/{{ cloudInfo.total_count }}</span>
            </div>
          </div>
        </div>
        <div class="monitor-area business-monitor" @click="seeDetail(1)">
          <div
            :class="[businessInfo.alarm_count > 0 ? 'icon-warning' : 'icon']"
            class="business-icon"
          >
            <cb-iconfont
              type="icon-npc-zhuangshi"
              color="#fff"
              size="25"
            ></cb-iconfont>
          </div>
          <div>
            <div>{{ $t('systemOperation.systemAlarm.businessMonitor') }}</div>
            <div class="monitor-count">
              <span
                :class="[businessInfo.alarm_count > 0 ? 'num-abnormal' : '']"
                >{{ businessInfo.alarm_count }}</span
              >
              <span>/{{ businessInfo.total_count }}</span>
            </div>
          </div>
        </div>
        <div class="monitor-area server-monitor" @click="seeDetail()">
          <div
            :class="[serverInfo.alarm_count > 0 ? 'icon-warning' : 'icon']"
            class="server-icon"
          >
            <cb-iconfont
              type="icon-nitaiweb"
              color="#fff"
              size="18"
            ></cb-iconfont>
          </div>
          <div>
            <div>{{ $t('systemOperation.systemAlarm.serverMonitor') }}</div>
            <div class="monitor-count">
              <span
                :class="[serverInfo.alarm_count > 0 ? 'num-abnormal' : '']"
                >{{ serverInfo.alarm_count }}</span
              >
              <span>/{{ serverInfo.total_count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="alarm-type">
      <div class="title">
        <span></span>
        <span>{{ $t('systemOperation.systemAlarm.alarmDistribution') }}</span>
      </div>
      <div>
        <div style="height: 170px" class="service-chart" ref="alarmPie"></div>
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
    nearWeekAlarmData: {
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
      isWarning: true,
      cloudInfo: {
        alarm_count: 0,
        error_count: 0,
        total_count: 0,
      },
      businessInfo: {
        alarm_count: 0,
        error_count: 0,
        total_count: 0,
      },
      serverInfo: {
        alarm_count: 0,
        error_count: 0,
        total_count: 0,
      },
      alarmOptions: {
        series: [
          {
            type: 'pie',
            radius: ['45%', '60%'],
            color: [
              this.$themed('yellow-color'),
              this.$themed('cyan-color'),
              this.$themed('blue-color'),
            ],
            label: {
              normal: {
                formatter: '{b|{b}}\n{per|{d}%}  ',
                rich: {
                  b: {
                    fontSize: 14,
                    padding: [-5, 5, 0, -5],
                    color: this.$themed('neutral8'),
                  },
                  per: {
                    fontSize: 14,
                    padding: [5, 0, 0, 0],
                    textAlign: 'left',
                    color: this.$themed('neutral8'),
                  },
                },
              },
            },
            labelLine: {
              length2: 35,
              lineStyle: {
                color: this.$themed('neutral8'),
              },
            },
            data: [
              {
                value: 0,
                name: this.$t('systemOperation.systemAlarm.cloudMonitor'),
              },
              {
                value: 0,
                name: this.$t('systemOperation.systemAlarm.businessMonitor'),
              },
              {
                value: 0,
                name: this.$t('systemOperation.systemAlarm.serverMonitor'),
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
        tooltip: {
          triggerOn: 'mousemove',
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          textStyle: {
            color: this.$themed('neutral8'),
          },
          trigger: 'item',
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
  computed: {
    total() {
      return (
        this.cloudInfo.total_count +
        this.businessInfo.total_count +
        this.serverInfo.total_count
      );
    },
    abnormalTotal() {
      return (
        this.cloudInfo.alarm_count +
        this.businessInfo.alarm_count +
        this.serverInfo.alarm_count
      );
    },
    normalTotal() {
      return this.total - this.abnormalTotal;
    },
  },
  watch: {
    alarmData() {
      this.getStatisticsInfo();
    },
    nearWeekAlarmData() {
      this.initAlarmChart();
    },
  },
  methods: {
    listenFunc() {
      this.alarmOptions.series[0].label = {
        normal: {
          formatter: '{b|{b}}\n{per|{d}%}  ',
          rich: {
            b: {
              fontSize: 14,
              padding: [-5, 5, 0, -5],
              color: this.$themed('neutral8'),
            },
            per: {
              fontSize: 14,
              padding: [5, 0, 0, 0],
              textAlign: 'left',
              color: this.$themed('neutral8'),
            },
          },
        },
      };
      this.alarmOptions.series[0].labelLine = {
        length2: 35,
        lineStyle: {
          color: this.$themed('neutral8'),
        },
      };
      this.alarmOptions.tooltip = {
        triggerOn: 'mousemove',
        backgroundColor: this.$themed('bg-color-1'),
        borderWidth: 0,
        show: true,
        textStyle: {
          color: this.$themed('neutral8'),
        },
        trigger: 'item',
      };
      this.alarmOptions.series[0].color = [
        this.$themed('yellow-color'),
        this.$themed('cyan-color'),
        this.$themed('blue-color'),
      ];
      this.alarmChart.setOption(this.alarmOptions);
    },
    initLine() {
      this.alarmChart = Echarts.init(this.$refs.alarmPie);
      this.alarmChart.setOption(this.alarmOptions);
    },
    seeDetail(data) {
      if (data == 1) {
        this.$router.push({
          name: 'business-service-monitoring',
        });
      } else {
        this.$router.push({
          name: 'cloud-platform-monitoring',
        });
      }
    },
    getStatisticsInfo() {
      const data = this.alarmData;
      this.cloudInfo = data.cloud_platform_monitor_vo;
      this.businessInfo = data.biz_service_monitor_vo;
      this.serverInfo = data.server_monitor_vo;
    },
    initAlarmChart() {
      const data = this.nearWeekAlarmData;
      const alarmTypeInfo = [
        {
          name: this.$t('systemOperation.systemAlarm.cloudMonitor'),
          value: data.cp_alarm_count || 0,
        },
        {
          name: this.$t('systemOperation.systemAlarm.businessMonitor'),
          value: data.cr_alarm_count || 0,
        },
        {
          name: this.$t('systemOperation.systemAlarm.serverMonitor'),
          value: data.server_alarm_count || 0,
        },
      ];
      this.alarmOptions.series[0].data = alarmTypeInfo;
      this.alarmChart.setOption(this.alarmOptions);
    },
  },
};
</script>
<style lang="scss" scoped>
.alarm-info-page {
  width: 100%;
  display: flex;
  .system-alarm {
    width: 60%;
    height: 208px;
    padding: 16px;
    color: var(--neutral8);
    background: var(--bg-color-2);
    .count {
      display: flex;
      font-size: 16px;
      margin-top: 20px;
      div {
        margin-right: 80px;
      }
      .num {
        position: relative;
        font-size: 24px;
        top: 3px;
        left: 3px;
      }
      .circle-normal {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 3px;
        background-color: var(--blue-color);
      }
      .circle-abnormal {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 3px;
        background-color: var(--red-color);
      }
    }
    .monitor {
      display: flex;
      margin-top: 25px;
      .icon-warning {
        width: 40px;
        height: 40px;
        line-height: 50px;
        text-align: center;
        border-radius: 50%;
        margin-right: 15px;
        background: var(--red-color);
      }
      .icon {
        width: 40px;
        height: 40px;
        line-height: 50px;
        text-align: center;
        border-radius: 50%;
        margin-right: 15px;
        background: var(--blue-color);
      }
      .server-icon {
        svg {
          margin-bottom: 3px;
        }
      }
      .monitor-area {
        display: flex;
        align-items: center;
        width: 33%;
        height: 80px;
        padding-left: 10px;
        background: var(--neutral0);
      }
      .cloud-monitor {
        cursor: pointer;
      }
      .business-monitor {
        margin-left: 15px;
        cursor: pointer;
      }
      .server-monitor {
        margin-left: 15px;
        cursor: pointer;
      }
      .monitor-count {
        font-size: 20px;
        margin-top: 5px;
        span {
          float: left;
        }
      }
    }
    .num-normal {
      color: var(--blue-color);
    }
    .num-abnormal {
      color: var(--red-color);
    }
  }
  .alarm-type {
    width: 40%;
    height: 208px;
    margin-left: 16px;
    padding: 16px;
    color: var(--neutral8);
    background: var(--bg-color-2);
  }
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
  }
}
</style>
