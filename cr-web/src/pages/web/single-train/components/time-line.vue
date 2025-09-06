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
        <template v-if="scaleTimes.start_time">
          <span v-if="t.length > 8">{{ t.slice(5) }}</span>
          <span v-else>{{ t }}</span>
        </template>
        <template v-else>
          <span>{{ t }}</span>
        </template>
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
          <cb-tooltip
            class="item"
            effect="dark"
            placement="top"
            popper-class="time-line-tooltip"
          >
            <div
              slot="content"
              style="max-width: 300px"
              class="current-tips-content"
            >
              <div class="tips-txt">
                <!-- <span class="report">{{ '【' + $t('m.report') + '】' }}</span> -->
                <cb-tag
                  size="small"
                  class="tag-item"
                  :class="
                    item.status === task_status.CORRECT
                      ? 'tag-success'
                      : item.status === task_status.ERROR
                      ? 'tag-error'
                      : ''
                  "
                  >{{
                    item.status === task_status.CORRECT
                      ? $t('m.success')
                      : item.status === task_status.ERROR
                      ? $t('m.singleFailed')
                      : $t('m.unsubmitted')
                  }}</cb-tag
                >
                <span class="task-title one-overflow" :title="item.title">{{
                  item.title
                }}</span>
              </div>
              <div class="tips-bottom">
                <div class="img-box"><img :src="item.avatar_url" /></div>

                <div class="name-box">{{ item.user_name }}</div>
                <div class="tips-time" v-if="item.range">
                  {{ item.range.slice(5) }}
                </div>
              </div>
            </div>
            <div
              :class="{
                radius: true,
                'current-radius-single': currentTips === index,
              }"
              @mouseenter="enterTips(index)"
              @mouseleave="leaveTips()"
            >
              <cb-iconfont type="icon-duiqi1"></cb-iconfont>
            </div>
          </cb-tooltip>
        </div>
      </div>
      <div class="cur-wrapper">
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
import { TASK_STATUS } from '../constants';
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
      task_status: TASK_STATUS,
      theme: getTheme(),
      currentTips: false,
      currentTime: '',
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
      getCurrentTime().then((res) => {
        this.currentTime = _.get(res, 'data.data.current_time');
        let duringTime;
        if (val.start_time) {
          // 开始时间的时间戳
          const startTimeValue = moment(val.start_time).valueOf();
          // 结束时间的时间戳
          const endTimeValue = moment(val.end_time).valueOf();
          // 时间差 = 结束时间的时间戳 - 开始时间的时间戳
          duringTime = endTimeValue - startTimeValue;
          // 现在时间的时间戳
          const curTimeValue = moment(this.currentTime).valueOf();

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
                    (totalWidth * (curTimeValue - startTimeValue)) / duringTime,
                  ) + 'px';
              }
            });
          }

          // 设置最底层的平分时间间隔
          const timeArrRange = [];
          for (let i = 0; i < 5; i++) {
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
            if (val.duration_time >= 24) {
              const aa = Math.floor(val.duration_time / 24);
              const bb = val.duration_time % 24;
              time = moment()
                .startOf('day')
                .add(j * ((bb * 60 * 60 * 1000) / 4), 'milliseconds')
                .format('HH:mm:ss');
              const arr = time.split(':');
              if (aa[0] !== '00') {
                arr[0] = (Number(arr[0]) + aa * 6 * j).toString();
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
.current-tips-content {
  width: 242px;
  font-size: 14px;
  // background: var(--bg-color-3);
  .tips-txt {
    .task-title {
      font-size: 14px;
      color: var(--neutral8);
    }
  }
  .tips-bottom {
    margin-top: 10px;
    display: flex;
    .name-box {
      margin: 0 10px 0 6px;
    }
    .img-box {
      width: 20px;
      height: 20px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.time-line-comp {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  .time-line-top {
    position: absolute;
    top: 5px;
  }
  .time-tips-wrapper {
    position: relative;
    bottom: -10px;
    height: 10px;

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
        // width: 6px !important;
        // height: 13px !important;
        position: relative;
      }
      .radius {
        background: transparent;
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
<style lang="scss">
.tag-item {
  font-size: 12px;
}
.tag-success {
  background: var(--green-color-2);
  .cb-tag-content {
    color: var(--green-color);
  }
}
.tag-error {
  background: var(--red-color-2);
  .cb-tag-content {
    color: var(--red-color);
  }
}
</style>
