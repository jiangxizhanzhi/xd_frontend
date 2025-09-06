<template>
  <!-- 团队学员时间轴 -->
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
                <!-- 状态 -->

                <!-- <span
                  :class="{ 'color-sky-blue': item.actionName === '下发任务' }"
                  >【{{ item.actionName }}】</span
                > -->
                <span
                  v-if="item.is_dynamic && Number(item.event_type) === 1"
                  class="orange-style"
                >
                  {{ $t('rbt.dynamicAdd') }}
                </span>
                <span
                  v-if="
                    Number(item.status) === 2 && Number(item.event_type) === 1
                  "
                >
                  <span class="red-status">{{ $t('rbt.fail') }}</span>
                </span>
                <span
                  v-if="
                    Number(item.status) === 1 && Number(item.event_type) === 1
                  "
                >
                  <span class="green-status">{{ $t('rbt.success') }}</span>
                </span>
                <span
                  v-if="
                    Number(item.status) === 0 && Number(item.event_type) === 1
                  "
                >
                  <span class="blue-status">{{ $t('rbt.toEvaluate') }}</span>
                </span>
                <span
                  v-if="
                    Number(item.status) === 3 && Number(item.event_type) === 1
                  "
                >
                  <span class="orange-status">{{ $t('rbt.reject') }}</span>
                </span>
                <span :title="item.title">{{ item.title }}</span>
              </div>
              <!-- 标记下载 -->
              <div
                v-if="
                  Number(item.event_type) !== 1 &&
                  item.attachments !== null &&
                  item.attachments.length >= 1
                "
                class="down-style"
              >
                <cb-iconfont
                  type="icon-xiazai"
                  @click="downloadFile(item)"
                ></cb-iconfont>
                <span>{{ item.attachments[0].filename }}</span>
              </div>
              <!-- 用户,头像,时间 -->
              <div class="tips-time" v-if="item.time">
                <img :src="item.avatar_url" alt="" />
                <span>{{ item.user_name }}</span>
                <span v-if="item.time" style="margin-left: 16px">{{
                  item.time.slice(5)
                }}</span>
              </div>
            </div>
            <div
              :class="{
                'radius-blue-old': true,
                'current-radius-blue-old': currentTips === index,
              }"
              @mouseenter="enterTips(index)"
              @mouseleave="leaveTips()"
            >
              <!-- 任务,标记 -->
              <cb-iconfont
                v-if="Number(item.event_type) === 1"
                type="icon-duiqi1"
              ></cb-iconfont>
              <!-- 标记icon待替换 -->
              <cb-iconfont v-else type="icon-biaoji"></cb-iconfont>
            </div>
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
    //标记下载
    downloadFile(item) {
      this.$request.binaryDownload(
        'get',
        item.attachments[0].path,
        {},
        { filename: item.attachments[0].filename, baseURL: '' },
      );
    },
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
.tips-txt {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.down-style {
  margin: 8px 0px;
}
.tips-time {
  padding-left: 0 !important;
  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
.green-status {
  display: inline-block;
  background: var(--green-color-2);
  color: var(--green-color);
  padding: 4px 8px;
  margin-right: 8px;
}
.blue-status {
  display: inline-block;
  background: var(--primary-color-2);
  color: var(--primary-color);
  padding: 4px 8px;
  margin-right: 8px;
}
.red-status {
  display: inline-block;
  background: var(--red-color-2);
  color: var(--red-color);
  padding: 4px 8px;
  margin-right: 8px;
}
.orange-status {
  display: inline-block;
  background: var(--yellow-color-2);
  color: var(--yellow-color);
  padding: 4px 8px;
  margin-right: 8px;
  margin-bottom: 4px;
}
.orange-style {
  display: inline-block;
  background: var(--orange-color-2);
  color: var(--orange-color);
  padding: 4px 8px;
  margin-right: 4px;
  margin-bottom: 4px;
}
.time-line-comp {
  width: 100%;
  height: 100%;
  position: relative;
  top: -15px;
  box-sizing: border-box;
  .time-line-top {
    position: absolute;
    top: -25px;
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
