<template>
  <div class="time-line-comp">
    <div class="line-through" />
    <div class="time-line">
      <div v-for="i in 3" :key="i" class="line" />
    </div>
    <div class="time-hours">
      <div
        v-for="(t, i) in timeRange"
        :key="i"
        class="item"
        :class="{ leftone: i === 1, leftthree: i === 3 }"
      >
        <span v-if="t.length > 8">{{ t.slice(5) }}</span>
        <span v-else>{{ t }}</span>
      </div>
    </div>
    <div class="time-line-top">
      <div class="time-tips-wrapper">
        <div
          v-for="(item, index) in scaleTimes.data"
          :key="item.time"
          class="time-item"
          :style="{ left: item.left }"
          :class="{ 'set-zindex': currentTips === index }"
        >
          <div
            class="tips-txtRed"
            v-if="currentTips === index && item.role_group === 4"
          >
            <cb-iconfont
              type="icon-duiqi"
              themedColor="danger-color"
            ></cb-iconfont>
            <div>
              <span class="report">{{ '【上报】' }}</span>
              {{ item.title }}
              <br />
              <span class="redTime">&nbsp {{ myMonment(item.time) }}</span>
            </div>
          </div>
          <div
            class="tips-txtBlue"
            v-if="currentTips === index && item.role_group === 5"
          >
            <cb-iconfont type="icon-duiqi"></cb-iconfont>
            <div>
              <span class="report">{{ '【上报】' }}</span>
              {{ item.title }}
              <br />
              <span class="blueTime"> &nbsp {{ myMonment(item.time) }}</span>
            </div>
          </div>
          <div
            :class="{
              radius: item.role_group === 4,
              radiusBlue: item.role_group === 5,
              'current-radius-red':
                currentTips === index && item.role_group === 4,
              'current-radius-blue':
                currentTips === index && item.role_group === 5,
            }"
            @mouseenter="enterTips(index)"
            @mouseleave="leaveTips()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'TimeProgress',
  props: {
    scaleTimes: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentTips: false,
      currentTime: new Date(),
      curWidth: 0,
      timeRange: [],
      setIndex: 666,
      timeDate: {
        duration_time: 25,
        start_time: '2020-3-12 08:00:00',
        end_time: '2020-3-13 8:15:34',
        current_time: '2020-3-12 20:50:34',
        data: [],
      },
    };
  },
  created() {},
  mounted() {
    this.initData(this.scaleTimes);
    this.__resizeHandler = _.debounce(() => {
      if (this.scaleTimes) {
        this.initData(this.scaleTimes);
      }
    }, 50);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler);
  },
  methods: {
    initData(val) {
      let duringTime;
      if (val.start_time) {
        // 开始时间的时间戳
        const startTimeValue = moment(val.start_time).valueOf();
        // 结束时间的时间戳
        const endTimeValue = moment(val.end_time).valueOf();
        // 时间差 = 结束时间的时间戳 - 开始时间的时间戳
        duringTime = endTimeValue - startTimeValue;
        // 现在时间的时间戳
        const curTimeValue = moment(val.current_time).valueOf();

        // bottom
        if (document.querySelector('.time-line-comp')) {
          // 获取最外层div的宽度
          this.$nextTick(() => {
            const totalWidth = parseInt(
              window
                .getComputedStyle(document.querySelector('.time-line-comp'))
                .width.toString(),
            );
            // 循环遍历记录
            val.data.forEach((item) => {
              // 时间格式化
              const range = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
              this.$set(item, 'range', range);

              // 操作记录时间与开始时间的差
              const diff = moment(item.time).valueOf() - startTimeValue;
              // 动态计算原点x轴的位置
              let left = parseInt((totalWidth * diff) / duringTime);
              // 如果left的位置大于总长度则显示在最后
              left = left > totalWidth ? totalWidth : left;
              this.$set(item, 'left', left + 'px');
            });

            // 设置高亮显示的div的宽度
            if (curTimeValue >= endTimeValue) {
              this.curWidth =
                parseInt(
                  (totalWidth * (endTimeValue - startTimeValue)) / duringTime,
                ) + 'px';
            } else {
              this.curWidth =
                parseInt(
                  (totalWidth * (endTimeValue - startTimeValue)) / duringTime,
                ) + 'px';
            }
          });
        }

        // 设置最底层的平分时间间隔
        const timeArrRange = [];
        for (let i = 0; i < 3; i++) {
          const time = moment(val.start_time)
            .add(((endTimeValue - startTimeValue) / 4) * i, 'milliseconds')
            .format('YYYY-MM-DD HH:mm:ss');
          timeArrRange.push(time);
        }
        this.timeRange = timeArrRange;
      } else if (!val.start_time) {
        // 如果开始结束时间为空，选择duration_time
        duringTime = val.duration_time * 60 * 60 * 1000;
        const timeRange = [];
        for (let j = 0; j < 5; j++) {
          let time;
          // 超过一天的时间
          if (val.duration_time > 24) {
            const aa = Math.floor(val.duration_time / 24);
            const bb = val.duration_time % 24;
            time = moment()
              .startOf('day')
              .add(j * ((bb * 60 * 60 * 1000) / 4), 'milliseconds')
              .format('HH:mm:ss');
            const arr = time.split(':');
            if (aa[0] !== '00') {
              arr[0] = (Number(arr[0]) + bb * 6 * j).toString();
            }
            time = arr.join(':');
          } else {
            // 小于一天的时间
            time = moment()
              .startOf('day')
              .add((j * duringTime) / 4, 'milliseconds')
              .format('HH:mm:ss');
          }
          timeRange.push(time);
        }
        this.timeRange = timeRange;
        this.timeRange[0] = '00:00:00';
      }
    },
    enterTips(index) {
      this.currentTips = index;
    },
    leaveTips() {
      this.currentTips = false;
    },
    myMonment(time) {
      return moment(time).format('MM-DD HH:mm:ss');
    },
  },
  watch: {
    scaleTimes: {
      handler(val, oldval) {
        this.initData(val);
      },
      deep: true,
    },
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.time-line-comp {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  .time-line-top {
    position: absolute;
    top: var(--time-line-top);
  }
  .time-tips-wrapper {
    position: relative;
    bottom: var(--time-tips-bottom);
    height: var(--time-tips-height);
    .set-zindex {
      z-index: 999 !important;
    }
    .time-item {
      position: absolute;
      z-index: 666;
      box-sizing: border-box;
      .tips-time {
        font-size: var(--font-size-18);
        padding-right: var(--tips-time-pd);
      }
      .tips-txtRed,
      .tips-txtBlue {
        position: absolute;
        bottom: var(--tips-text-bottom);
        font-size: var(--font-size-14);
        width: var(--tips-text-width);
        height: var(--tips-text-height);
        background: var(--tips-text-bg);
        left: var(--tips-text-left);
        z-index: 9999;
      }

      .tips-txtRed,
      .tips-txtBlue {
        display: flex;
        padding-top: var(--tips-text-pd-top);
        padding-left: var(-tips-text-pd-left);
        color: var(--white-color);
        .cb-iconfont {
          margin-top: var(--tips-text-mg-top);
          font-size: 22px !important;
        }
      }
      .current-radius-red,
      .current-radius-blue {
        width: var(--radius-width) !important;
        height: var(--current-radius-height) !important;
        left: var(--current-radius-left);
        position: relative;
        cursor: pointer;
      }
      .current-radius-red {
        background: var(--time-progress-red);
      }
      .current-radius-blue {
        background: var(--time-progress-blue);
      }
      .radiusBlue,
      .radius {
        width: var(--radius-width) !important;
        height: var(--radius-height);
        margin-top: var(--radius-mg-top);
        position: absolute;
        z-index: 9999;
        cursor: pointer;
      }
      .radiusBlue {
        background: var(--time-progress-blue);
      }
      .radius {
        background: var(--time-progress-red);
      }
    }
  }

  .line-through {
    height: var(--line-width);
    width: 100%;
    position: relative;
    top: 60%;
    background: var(--time-progress-line-bg);
  }
  .time-line {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    top: calc(60% + 0px);
    .line {
      width: var(--line-width);
      height: var(--line-height);
      background: var(--time-progress-line-bg);
    }
  }
  .time-hours {
    width: calc(100%);
    position: relative;
    top: calc(60% + 6px);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-12);
    .item {
      position: relative;
    }
    .leftone {
      // left: var(--leftone-left);
    }
    .leftthree {
      left: var(--leftthree-left);
    }
  }
}
</style>
