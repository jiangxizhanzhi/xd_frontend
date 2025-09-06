<template>
  <div class="time-line-comp">
    <div class="line-through" />
    <div class="time-line">
      <div v-for="i in 5" :key="i" class="line" />
    </div>
    <div class="time-hours">
      <div
        v-for="(t, i) in timeRange"
        :key="i"
        class="item"
        :class="{ leftone: i === 1, leftthree: i === 3 }"
      >
        {{ t.slice(5) }}
      </div>
    </div>
    <div class="time-line-top" :style="{ display: isShow }">
      <div class="time-tips-wrapper">
        <div
          v-for="(item, index) in scaleTimes.data"
          :key="index"
          class="time-item"
          :style="{ left: item.left }"
          :class="{ 'set-zindex': currentTips === index }"
        >
          <cb-tooltip
            class="item"
            placement="top"
            popper-class="time-line-tooltip"
          >
            <div
              slot="content"
              style="max-width: 300px"
              class="current-tips-red"
            >
              <div class="tips-txt">
                <span
                  :class="{ 'color-sky-blue': item.actionName === '下发任务' }"
                  >【{{ item.actionName }}】</span
                >
                <span>{{ item.title }}</span>
              </div>
              <div class="tips-time" v-if="item.time">
                {{ item.time.slice(5) }}
              </div>
            </div>
            <div
              :class="{
                'radius-blue': true,
                'current-radius-blue': currentTips === index,
              }"
              @mouseenter="enterTips(index)"
              @mouseleave="leaveTips()"
            />
          </cb-tooltip>
        </div>
      </div>
      <div class="cur-wrapper">
        <div class="time-current fl" :style="{ width: curWidth + 'px' }" />
        <img v-if="curWidth > 0" class="fl time-arr" :src="timeArrUrl" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
// 红方是4
// 蓝方为5
import moment from 'moment';
import { debounce } from '@/utils/index.js';
import { getTheme } from '@cyber/helper';
import { getCurrentTime } from '@/api/web/red-blue.js';
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
      currentTime: '',
      isShow: false,
      curWidth: 0,
      timeRange: [],
      setIndex: 666,
      timeDate: {},
      redUser: this.$CONSTANT.Role.RedVsBlue.REDUSER.value,
      blueUser: this.$CONSTANT.Role.RedVsBlue.BLUEUSER.value,
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
      getCurrentTime().then((res) => {
        this.currentTime = _.get(res, 'data.data.current_time');
        // 设置时间等分
        let duringTime;
        if (val.start_time) {
          const startTimeValue = moment(val.start_time).valueOf();
          const endTimeValue = moment(val.end_time).valueOf();
          duringTime = endTimeValue - startTimeValue;
          const curTimeValue = moment(this.currentTime).valueOf();

          // bottom
          if (document.querySelector('.time-line-comp')) {
            const totalWidth = parseInt(
              window
                .getComputedStyle(document.querySelector('.time-line-comp'))
                .width.toString(),
            );
            val.data.forEach((item) => {
              const diff = moment(item.time).valueOf() - startTimeValue;
              const range = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
              let left = ((totalWidth * diff) / duringTime).toFixed(2);
              left = left > totalWidth ? totalWidth : left;
              this.$set(item, 'left', left + 'px');
              this.$set(item, 'range', range);
            });
            if (curTimeValue >= endTimeValue) {
              const curDiff = endTimeValue - startTimeValue;
              this.curWidth = parseInt((totalWidth * curDiff) / duringTime);
            } else {
              const curDiff = curTimeValue - startTimeValue;
              this.curWidth = parseInt((totalWidth * curDiff) / duringTime);
            }
          }
          const timeArrRange = [];
          for (let i = 0; i < 5; i++) {
            const time = moment(val.start_time)
              .add(((endTimeValue - startTimeValue) / 4) * i, 'milliseconds')
              .format('YYYY-MM-DD HH:mm:ss');
            timeArrRange.push(time);
          }
          this.timeRange = timeArrRange;
        }
      });
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
  position: relative;
  top: -15px;
  box-sizing: border-box;
  .time-line-top {
    position: absolute;
    top: 26px;
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
      .current-radius-blue {
        width: 6px !important;
        height: 13px !important;
        position: relative;
      }
      .radius-blue {
        width: 6px;
        height: 13px;
        margin-top: -2px;
        // background: linear-gradient(180deg,rgba(255,103,68,1) 0%,rgba(255,32,32,1) 100%);
        .desc {
          background: rgba(37, 47, 66, 1);
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.7);
          border-radius: 23px;
        }
      }
    }
  }
  .cur-wrapper {
    width: 100%;
    height: 28px;
    position: relative;
    overflow-x: hidden;
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
    top: 60%;
  }
  .time-line {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    top: calc(60% + 2px);
    .line {
      width: 4px;
      height: 14px;
      opacity: 0.2;
    }
  }
  .time-hours {
    width: calc(100%);
    position: relative;
    top: calc(60% + 6px);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    // opacity: 0.5;
    .item {
      position: relative;
    }
    .leftone {
      left: -30px;
    }
    .leftthree {
      left: 28px;
    }
  }
}
</style>
