<template>
  <div class="student-monitor-wrapper">
    <div class="header-wrap">
      <span class="title">人员学习分析详情</span>
      <cb-tabs v-model="activeName">
        <cb-tab-pane
          :label="$t('基本详情')"
          name="basic"
        > </cb-tab-pane>
        <cb-tab-pane
          :label="$t('课程学习')"
          name="study"
        ></cb-tab-pane>
      </cb-tabs>
    </div>
    <template v-if="activeName === 'basic'">
      <div class="name-box">
        <span class="name">张三</span>
        <div class="right-area">
          <div
            class="item"
            :class="{
              'active': active === index
            }"
            :key="index"
            v-for="(item, index) in list"
            @click="handlerClick(index)"
          >
            {{ item }}
          </div>
          <cb-date-picker
            style="width: 100%"
            v-model="form.date"
            type="datetimerange"
            :range-separator="$t('至')"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
            popper-class="hide-clear-btn"
          >
          </cb-date-picker>
        </div>
      </div>

      <div class="analysis-wrap">
        <span class="title">教学分析</span>
        <div class="line"></div>
        <div class="course-wrap">
          <div class="course-item">
            <div class="outer">
              <span class="label">
                参与课程</span>
              <span class="value">10</span>
            </div>
          </div>
          <div class="course-item">
            <div class="outer">
              <span class="label">
                完成课程</span>
              <span class="value">10</span>
            </div>
          </div>
          <div class="course-item">
            <div class="outer">
              <span class="label">
                参与课时</span>
              <span class="value">10</span>
            </div>
          </div>
          <div class="course-item">
            <div class="outer">
              <span class="label">
                完成课时</span>
              <span class="value">10</span>
            </div>
          </div>
          <div class="course-item">
            <div class="outer">
              <span class="label">
                训练时长（h）</span>
              <span class="value">10</span>
            </div>
          </div>
        </div>
      </div>

      <div class="train-task-analysis">
        <div class="left-wrap">
          <span class="title">训练任务分析</span>
          <div class="line"></div>
          <div class="task-wrap">
            <div class="task-item">
              <div class="outer">
                <span class="label">
                  接收任务数量</span>
                <span class="value">10</span>
              </div>
            </div>
            <div class="task-item">
              <div class="outer">
                <span class="label">
                  成功任务数量</span>
                <span class="value">10</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-wrap">
          <span class="title">训练得分分析</span>
          <div class="line"></div>
          <div
            class="chart-wrap"
            ref="chartref"
          >

          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
export default {
  name: "student-monitor",
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    return {
      activeName: 'basic',
      list: ['全部', '近1月', '近3月', '近12月'],
      form: {
        date: [],
      },
      active: 0,
    }
  },
  data() {
    return {
      option: {
        title: {
          text: '训练次数',
          subtext: '23',
          left: 'center',
          top: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          top: 'center',
        },
        series: [
          {
            name: '训练得分分析',
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
              { value: 1048, name: '0~59' },
              { value: 735, name: '60~69' },
              { value: 580, name: '70~79' },
              { value: 484, name: '80~89' },
              { value: 300, name: '90~100' }
            ],
          }
        ]
      },
    }
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = _.debounce(() => {
      this.chart.resize();
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  methods: {
    handlerClick(index) {
      this.active = index;
    },
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartref);
      }
      this.chart.setOption(this.option);
    },
  }
}
</script>

<style scoped lang="scss">
.header-wrap {
  height: 124px;
  background: var(--bg-color-2);
  padding: 12px 0 0 16px;
  margin-bottom: 16px;

  .title {
    font-weight: 600;
    font-size: 16px;
    display: inline-block;
    margin-bottom: 51px;
  }
}

.name-box {
  height: 60px;
  background: var(--bg-color-2);
  position: relative;
  margin-bottom: 16px;

  .name {
    position: absolute;
    left: 36px;
    top: 20px;
    font-size: 14px;
  }

  .right-area {
    position: absolute;
    top: 6px;
    right: 36px;
    height: 48px;
    display: flex;
    align-items: center;

    .item {
      padding: 6px 12px;
      margin-right: 8px;
      white-space: nowrap;
      font-size: 14px;
      color: #7f7f7f;
      border: 1px solid #7f7f7f;
      border-radius: 2px;
      cursor: pointer;
    }

    .item.active {
      color: #ffffff;
      background: var(--primary-color);
      border: 1px solid var(--primary-color);
    }
  }
}

.analysis-wrap {
  height: 200px;
  background: var(--bg-color-2);
  padding: 12px 16px 0 16px;
  margin-bottom: 16px;

  .title {
    display: inline-block;
    font-size: 14px;
    margin-bottom: 24px;
  }

  .line {
    width: 100%;
    height: 2px;
    background: #f2f2f2;
    margin-bottom: 20px;
  }

  .course-wrap {
    height: 110px;
    background: #f2f2f2;
    display: flex;

    .course-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .outer {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;

        .label {
          font-size: 14px;
        }

        .value {
          font-size: 26px;
        }

      }
    }
  }
}

.train-task-analysis {
  width: 100%;
  height: 328px;
  display: flex;

  .left-wrap {
    background: var(--bg-color-2);
    margin-right: 16px;
    width: 50%;
    padding: 12px 16px 0 16px;

    .title {
      display: inline-block;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .line {
      width: 100%;
      height: 2px;
      background: #f2f2f2;
      margin-bottom: 20px;
    }

    .task-wrap {
      height: 234px;
      display: flex;

      .task-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .outer {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;

          .label {
            font-size: 14px;
          }

          .value {
            font-size: 26px;
          }

        }
      }
    }
  }

  .right-wrap {
    background: var(--bg-color-2);
    width: 50%;
    padding: 12px 16px 0 16px;

    .title {
      display: inline-block;
      font-size: 14px;
      margin-bottom: 24px;

    }

    .line {
      width: 100%;
      height: 2px;
      background: #f2f2f2;
      margin-bottom: 20px;
    }

    .chart-wrap {
      width: 100%;
      height: 234px;
    }
  }
}
</style>
