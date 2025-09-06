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
          :key="item.time"
          class="time-item"
          :style="{ left: item.left }"
          :class="{ 'set-zindex': currentTips === index }"
        >
          <cb-tooltip
            class="item"
            effect="dark"
            placement="top"
            popper-class="time-line-tooltip"
          >
            <div
              slot="content"
              :class="{
                'current-tips-red': item.role_group === redUser,
                'current-tips-blue': item.role_group === blueUser,
              }"
              style="max-width: 300px"
            >
              <template v-if="item.type === 2">
                <div class="tips-txt">
                  <span>{{ '【' + $t('m.report') + '】' }}</span>
                  <span>{{ item.user_name }}</span>
                  <span>{{ item.title }}</span>
                </div>
                <div class="tips-time" v-if="item.range">
                  {{ item.range.slice(5) }}
                </div>
              </template>
              <template v-if="item.type === 3">
                <div class="tips-txt">
                  <span class="color-green">{{
                    '【' + $t('m.finish') + '】'
                  }}</span>
                  <span>{{ item.user_name }}</span>
                  <span>{{ item.title }}</span>
                </div>
                <div class="tips-time" v-if="item.range">
                  {{ item.range.slice(5) }}
                </div>
              </template>
            </div>
            <div
              v-if="item.role_group === redUser"
              :class="{
                'radius-red': true,
                'current-radius-red': currentTips === index,
              }"
              @mouseenter="enterTips(index)"
              @mouseleave="leaveTips()"
            />
            <div
              v-if="item.role_group === blueUser"
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
        <img
          v-if="curWidth > 0"
          class="fl time-arr"
          src="@/assets/img/time_arr.png"
          alt=""
        />
      </div>
    </div>
    <div class="time-bg"></div>
  </div>
</template>
<script>
// 红方是4
// 蓝方为5
import moment from 'moment';
import { debounce } from '@/utils/index.js';
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
      currentTips: false,
      currentTime: new Date(),
      isShow: false,
      curWidth: 0,
      timeRange: [],
      setIndex: 666,
      timeDate: {},
      redUser: this.$CONSTANT.Role.RedVsBlue.REDUSER.value,
      blueUser: this.$CONSTANT.Role.RedVsBlue.BLUEUSER.value,
    };
  },
  watch: {
    scaleTimes: {
      handler(val, oldval) {
        if (JSON.stringify(val) !== JSON.stringify(oldval)) {
          this.initData(val);
        }
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
      // 设置时间等分
      let duringTime;
      if (val.start_time) {
        const startTimeValue = moment(val.start_time).valueOf();
        const endTimeValue = moment(val.end_time).valueOf();
        duringTime = endTimeValue - startTimeValue;
        const curTimeValue = moment(new Date()).valueOf();

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
            let left = parseInt((totalWidth * diff) / duringTime);
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
/* @import '@cyber/ui/lib/style/themify'; */
body {
  /* @include themify() {
  } */
}
.time-line-comp {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  .time-line-top {
    position: absolute;
    top: 28px;
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
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.7);
        background-color: rgba(37, 47, 66, 1);
        padding: 5px 10px;
        color: rgba(255, 255, 255, 1);
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
      .current-tips-red {
        font-weight: bold;
        display: inline-block !important;

        .tips-time {
          font-size: 18px;
          padding-right: 5px;
        }
      }
      .current-tips-blue {
        font-weight: bold;
        display: inline-block !important;
        .tips-time {
          font-size: 18px;
          padding-right: 5px;
        }
      }
      .current-radius-red {
        position: relative;
      }
      .radius-red {
        width: 6px;
        height: 13px;
        .desc {
          border-radius: 23px;
        }
      }
      .current-radius-blue {
        width: 6px !important;
        height: 13px !important;
        position: relative;
      }
      .radius-blue {
        width: 6px;
        height: 13px;
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
  .time-bg {
    width: 100%;
    position: absolute;
    height: 4px;
    background: var(--font-color-2);
    top: 77px;
    z-index: -1;
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
    color: #a9b7d6;
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
