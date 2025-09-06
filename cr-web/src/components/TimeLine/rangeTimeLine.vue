<template>
  <div class="time-line-comp">
    <div class="line-through" />
    <div class="time-line" v-if="timeRange.length > 0">
      <div v-for="i in timeRange.length" :key="i" class="line" />
    </div>
    <div class="time-hours">
      <div v-for="(item, i) in timeRange" :key="i" class="item">
        <span>{{ item.time.slice(5) }}</span>
        <div class="step" :title="item.name">{{ item.name }}</div>
      </div>
    </div>
    <div class="time-line-top">
      <!-- <div class="time-tips-wrapper"></div> -->
      <div class="cur-wrapper" v-show="scaleTimes.start_time">
        <div class="time-current fl" :style="{ width: curWidth }" />
        <img
          v-if="parseInt(curWidth) > 0"
          class="fl time-arr"
          :src="timeArrUrl"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { debounce } from '@/utils/index.js';
import { getTheme } from '@cyber/helper';
export default {
  name: 'TimeLine',
  props: {
    scaleTimes: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      theme: getTheme(),
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
  computed: {
    currentThemeBg() {
      const currentBg = {
        'theme-dark': {
          timeArr: require('@/assets/img/time_arr.png').default,
        },
        'theme-light': {
          timeArr: require('@/assets/img/time_arr_shadow.png').default,
        },
      };
      return currentBg[this.theme];
    },
    timeArrUrl() {
      return this.currentThemeBg.timeArr;
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

  mounted() {
    this.__resizeHandler = debounce(() => {
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
        const timeArrRange = [];
        val.data.forEach((item) => {
          let obj = {
            time: item.end_time,
            name: item.title,
          };
          timeArrRange.push(obj);
        });
        this.timeRange = timeArrRange;
      } else if (!val.start_time) {
        this.timeRange = [];
      }
    },
    enterTips(index) {
      this.currentTips = index;
    },
    leaveTips() {
      this.currentTips = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.time-line-comp {
  width: 100%;
  height: 100%;
  background: var(--bg-color-2);
  position: relative;
  box-sizing: border-box;
  .time-line-top {
    position: absolute;
    top: 12px;
  }
  .time-tips-wrapper {
    position: relative;
    bottom: -10px;
    height: 40px;
    .set-zindex {
      z-index: 999 !important;
    }
    .time-item {
      position: absolute;
      bottom: -4px;
      z-index: 666;
      box-sizing: border-box;
      .tips {
        border-radius: 23px;
        padding: 5px 10px;
        position: absolute;
        bottom: 8px;
        white-space: nowrap;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        .tips-time {
          font-size: 18px;
          padding-right: 5px;
        }
        .tips-txt {
          font-size: 14px;
        }
      }
      .current-radius {
        width: 6px !important;
        height: 13px !important;
        position: relative;
      }
      .radius {
        width: 6px;
        height: 13px;
        margin-top: -2px;
        .desc {
          border-radius: 23px;
        }
      }
    }
  }
  .cur-wrapper {
    width: 100%;
    height: 28px;
    position: relative;
    .time-arr {
      width: 11px;
      height: 20px;
      margin-left: -4px;
      position: absolute;
      top: 1px;
      z-index: 100;
    }
    .time-current {
      height: 4px;
      z-index: 50;
      border-radius: 2px;
      margin-top: 9px;
    }
  }

  .line-through {
    height: 2px;
    width: 100%;
    position: relative;
    top: 15%;
  }
  .time-line {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    top: calc(15% + 1px);
    .line {
      width: 4px;
      height: 12px;
      background: var(--primary-color);
    }
  }
  .time-hours {
    width: calc(100%);
    position: relative;
    top: calc(15% + 6px);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .item {
      position: relative;
    }
    .step {
      padding-left: 20px;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
