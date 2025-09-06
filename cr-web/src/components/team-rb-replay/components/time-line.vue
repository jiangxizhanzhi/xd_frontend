<template>
  <div class="time-line-box">
    <!-- 底部线条 -->
    <div class="line-throughs" />
    <!-- 等分成五分 -->
    <div class="time-line">
      <div v-for="i in 5" :key="i" class="line" />
    </div>
    <!-- 等分的时间 -->
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
    <!-- 时间轴事件 -->
    <div class="time-line-top" :style="{ display: isShow }">
      <div class="time-tips-wrapper">
        <div
          v-for="(item, index) in scaleTimes.data"
          :key="index"
          class="time-item"
          :style="{ left: item.left }"
          :class="{ 'set-zindex': currentTips === index }"
        >
          <div
            v-if="item.special"
            :class="{
              'radius-blue': true,
              'current-radius-blue': currentTips === index,
            }"
            @click="enterTips(item, index)"
          >
            <cb-iconfont type="icon-duiqi1" class="red"></cb-iconfont>
          </div>
          <cb-tooltip
            v-else
            class="item"
            placement="top"
            popper-class="time-line-tooltip"
          >
            <div slot="content" style="max-width: 300px" class="tips">
              <div class="tips-txt">
                <span
                  v-if="item.is_dynamic && item.event_type == 1"
                  class="state add"
                  >{{ $t('rbt.dynamicAdd') }}</span
                >
                <span
                  v-if="item.status == 0 && item.event_type == 1"
                  class="state assess"
                  >{{ $t('rbt.toEvaluate') }}</span
                >
                <span
                  v-if="item.status == 1 && item.event_type == 1"
                  class="state success"
                  >{{ $t('rbt.success') }}</span
                >
                <span
                  v-if="item.status == 2 && item.event_type == 1"
                  class="state fail"
                  >{{ $t('rbt.fail') }}</span
                >
                <span
                  v-if="item.status == 3 && item.event_type == 1"
                  class="state reject"
                  >{{ $t('rbt.reject') }}</span
                >
                <span class="title">{{ item.title }}</span>
              </div>
              <!-- 附件下载 -->
              <div
                v-if="
                  item.event_type !== 1 &&
                  item.attachments &&
                  item.attachments.length
                "
                class="download"
              >
                <cb-iconfont type="icon-xiazai"></cb-iconfont>
                <span class="file-name" @click="download(item)">{{
                  item.attachments[0].filename
                }}</span>
              </div>

              <div class="user-info">
                <span class="avatar">
                  <img :src="item.avatar_url" alt="" />
                </span>
                <span class="name"> {{ item.user_name }}</span>
                <span> {{ item.time.slice(5) }} </span>
              </div>
            </div>
            <div
              :class="{
                'radius-blue': true,
                'current-radius-blue': currentTips === index,
              }"
              @click="enterTips(item, index)"
              @mouseleave="leaveTips()"
            >
              <!-- 红方任务 -->
              <cb-iconfont
                v-if="item.role_group == 4 && item.event_type == 1"
                type="icon-duiqi1"
                class="red"
              ></cb-iconfont>
              <!-- 蓝方任务 -->
              <cb-iconfont
                v-if="item.role_group == 5 && item.event_type == 1"
                type="icon-duiqi1"
                class="blue"
              ></cb-iconfont>
              <!-- 红方标记 -->
              <cb-iconfont
                v-if="item.role_group == 4 && item.event_type == 3"
                type="icon-biaoji"
                class="red"
              ></cb-iconfont>
              <!-- 蓝方标记 -->
              <cb-iconfont
                v-if="item.role_group == 5 && item.event_type == 3"
                type="icon-biaoji"
                class="blue"
              ></cb-iconfont>
              <!-- 团队任务 -->
              <cb-iconfont
                v-if="item.role_group == 2 && item.event_type == 1"
                type="icon-duiqi1"
                class="team"
              ></cb-iconfont>
              <!-- 团队标记 -->
              <cb-iconfont
                v-if="item.role_group == 2 && item.event_type == 3"
                type="icon-biaoji"
                class="team"
              ></cb-iconfont>
            </div>
          </cb-tooltip>
        </div>
      </div>
      <!-- 时间轴进度 -->
      <div class="cur-wrapper">
        <div
          @click="onSliderClick"
          @mousedown="onDragStartProgress"
          ref="slider"
          class="slider"
        >
          <div
            ref="sliderCurrent"
            class="time-current fl"
            :style="{ width: curWidth + 'px' }"
          />
        </div>
        <!-- <img v-if="curWidth > 0" class="fl time-arr" :src="timeArrUrl" alt="" /> -->
      </div>
    </div>
    <!-- 复盘开始暂停设置 -->
    <div class="screen-play-control">
      <span v-if="showPlayIcon" class="play-icon" @click="start">
        <cb-iconfont :size="24" type="icon-kaishi"></cb-iconfont>
      </span>
      <span v-else class="pause-icon" @click="pause">
        <cb-iconfont :size="24" type="icon-guaqi"></cb-iconfont>
      </span>
    </div>
    <!-- 视频倍速设置 -->
    <div
      class="screen-rate-control"
      :class="{ 'screen-rate-control-special': rateSpecial }"
      @mouseleave="showRateOptions = false"
    >
      <div class="rate-box">
        <div v-show="showRateOptions" class="options">
          <template v-if="rateSpecial">
            <div
              v-for="(item, index) in rateOptionsSpecial"
              :key="index"
              @click="changeRate(item)"
              class="option"
              :class="[item.value == rate ? 'select-rate' : '']"
            >
              {{ item.label }}
            </div>
          </template>
          <template v-else>
            <div
              v-for="(item, index) in rateOptions"
              :key="index"
              @click="changeRate(item)"
              class="option"
              :class="[item.value == rate ? 'select-rate' : '']"
            >
              {{ item.label }}
            </div>
          </template>
        </div>
        <div class="current-rate" @mouseenter="showRateOptions = true">
          <span> {{ selectRate.label }} </span>
          <span class="icon">
            <cb-iconfont
              :size="12"
              type="icon-control"
              class="current-rate-icon"
            ></cb-iconfont>
          </span>
        </div>
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
    rateSpecial: {
      type: Boolean,
      default: false,
    },
    disabledStart: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      theme: getTheme(),
      currentTips: false,
      currentTime: new Date(),
      isShow: false,
      //控制播放暂停图标切换,默认为暂停
      showPlayIcon: true,
      curWidth: 0,
      timeRange: [],
      setIndex: 666,
      timeDate: {},
      redUser: this.$CONSTANT.Role.RedVsBlue.REDUSER.value,
      blueUser: this.$CONSTANT.Role.RedVsBlue.BLUEUSER.value,
      //记录时间轴点击处的宽度
      clickWidth: '',
      //记录拖动后的时间段
      sliderTime: '',
      //控制时间轴的变化，在点击或者拖动时间轴期间禁止时间轴被视频播放进度改变
      updateControl: true,
      //时间轴变化定时器
      updateInterval: null,
      //视频播放的时间段,若无视频则为任务的起点时间
      screenPlayTime: '',
      //记录时间轴复盘的时间段
      replayTime: '',
      //播放速率
      rate: 1,
      selectRate: { label: '1.0x', value: 1 },
      showRateOptions: false,
      rateOptions: [
        { label: '3.0x', value: 3 },
        { label: '2.0x', value: 2 },
        { label: '1.5x', value: 1.5 },
        { label: '1.0x', value: 1 },
      ],
      rateOptionsSpecial: [
        { label: '2.0x', value: 2 },
        { label: '1.5x', value: 1.5 },
        { label: '1.0x', value: 1 },
      ],
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
      immediate: true,
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
    clearInterval(this.updateInterval);
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
        this.$nextTick(() => {
          if (document.querySelector('.time-line-box')) {
            const totalWidth = parseInt(
              window
                .getComputedStyle(document.querySelector('.time-line-box'))
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
            // if (curTimeValue >= endTimeValue) {
            //   const curDiff = endTimeValue - startTimeValue;
            //   this.curWidth = parseInt((totalWidth * curDiff) / duringTime);
            // } else {
            //   const curDiff = curTimeValue - startTimeValue;
            //   this.curWidth = parseInt((totalWidth * curDiff) / duringTime);
            // }
          }
        });
        const timeArrRange = [];
        for (let i = 0; i < 5; i++) {
          const time = moment(val.start_time)
            .add(((endTimeValue - startTimeValue) / 4) * i, 'milliseconds')
            .format('YYYY-MM-DD HH:mm:ss');
          timeArrRange.push(time);
        }
        this.timeRange = timeArrRange;
      } else {
        this.timeRange = [];
      }
    },
    //点击下发任务
    enterTips(item, index) {
      if (!this.rateSpecial) {
        this.curWidth = Number(item.left.slice(0, -2));
        this.replayTime = item.time;
        this.updateControl = false;
        this.startReplay();
        this.$emit('changePlayTime', this.replayTime);
        // //此时为播放状态
        // if (!this.showPlayIcon) {
        //   this.$emit('changePlayTime', this.replayTime);
        // }
        this.currentTips = index;
      }
    },
    leaveTips() {
      this.currentTips = false;
    },
    getCurrentTime() {
      let total = parseInt(
        window
          .getComputedStyle(document.querySelector('.slider'))
          .width.toString(),
      );
      // 计算出当前的时间
      const percent = this.curWidth / total;
      const startTimeValue = moment(this.scaleTimes.start_time).valueOf();
      const endTimeValue = moment(this.scaleTimes.end_time).valueOf();
      const duringTime = endTimeValue - startTimeValue;
      const currentTime = moment(percent * duringTime + startTimeValue).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      return currentTime;
    },
    // 时间轴点击点击
    onSliderClick(event) {
      if (!this.rateSpecial) {
        const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
        this.curWidth = event.clientX - sliderOffsetLeft;
      }
    },
    //时间轴拖动
    onDragStartProgress(event) {
      if (!this.rateSpecial) {
        this.updateControl = false;
        clearInterval(this.updateInterval);
        const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
        this.curWidth = event.clientX - sliderOffsetLeft;
        // 拖动更新处理函数
        const onDrag = (e) => {
          this.updateControl = false;
          this.curWidth = e.clientX - sliderOffsetLeft;
        };
        // 拖动结束处理函数
        const onDragEnd = () => {
          document.removeEventListener('mousemove', onDrag);
          document.removeEventListener('mouseup', onDragEnd);

          //更新视频进度
          let total = parseInt(
            window
              .getComputedStyle(document.querySelector('.slider'))
              .width.toString(),
          );
          //计算出拖动后的时间
          const percent = this.curWidth / total;
          const startTimeValue = moment(this.scaleTimes.start_time).valueOf();
          const endTimeValue = moment(this.scaleTimes.end_time).valueOf();
          const duringTime = endTimeValue - startTimeValue;
          this.replayTime = moment(
            percent * duringTime + startTimeValue,
          ).format('YYYY-MM-DD HH:mm:ss');
          this.startReplay();
          this.$emit('changePlayTime', this.replayTime);
          this.$emit('replayHandle', this.replayTime);
          // //此时为播放状态
          // if (!this.showPlayIcon) {
          //   this.$emit('changePlayTime', this.replayTime);
          // }
        };

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onDragEnd);
      }
    },
    // 开始复盘
    start() {
      if (!this.disabledStart) {
        this.showPlayIcon = false;
        // this.$emit('playScreen');
        this.startReplay();
        this.$emit('updateReplayStatus', this.showPlayIcon);
      }
    },
    //暂停复盘
    pause() {
      if (!this.disabledStart) {
        this.showPlayIcon = true;
        // this.$emit('pauseScreen');
        clearInterval(this.updateInterval);
        this.$emit('updateReplayStatus', this.showPlayIcon);
      }
    },
    //根据视频播放进度改变时间轴进度
    changeProgress(time) {
      if (!this.updateControl) {
        return;
      }
      clearInterval(this.updateInterval);
      //时间轴的宽度
      let total = parseInt(
        window
          .getComputedStyle(document.querySelector('.slider'))
          .width.toString(),
      );
      const startTimeValue = moment(this.scaleTimes.start_time).valueOf();
      const endTimeValue = moment(this.scaleTimes.end_time).valueOf();

      //录屏的播放时间点在训练区间外，复盘时间轴固定
      if (moment(time).valueOf() >= endTimeValue) {
        this.curWidth = total;
        //复盘走到的时间节点
        this.replayTime = this.scaleTimes.end_time;
      } else {
        //当前播放的时间节点在整个时间轴上的比例
        const percent =
          (moment(time).valueOf() - startTimeValue) /
          (endTimeValue - startTimeValue);
        // 总宽乘以百分比
        this.curWidth = percent * total;
        //复盘走到的时间节点
        this.replayTime = time;
      }

      this.$emit('replayHandle', this.replayTime);
    },
    //设置视频播放速率
    changeRate(data) {
      this.rate = data.value;
      this.selectRate = data;
      this.startReplay();
      this.$emit('changeRate', this.rate);
    },
    //开始复盘进度自动走
    startReplay() {
      clearInterval(this.updateInterval);
      //此时为暂停状态
      if (this.showPlayIcon) {
        return;
      }
      //复盘时间默认为任务开始时间
      if (!this.replayTime) {
        this.replayTime = this.scaleTimes.start_time;
      }
      let time = moment(this.replayTime).valueOf();
      this.updateInterval = setInterval(() => {
        this.showPlayIcon = false;
        time = time + 1000;
        this.replayTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
        //时间轴的宽度
        let total = parseInt(
          window
            .getComputedStyle(document.querySelector('.slider'))
            .width.toString(),
        );
        const startTimeValue = moment(this.scaleTimes.start_time).valueOf();
        const endTimeValue = moment(this.scaleTimes.end_time).valueOf();
        //复盘完成
        if (time >= endTimeValue) {
          clearInterval(this.updateInterval);
          this.showPlayIcon = true;
          this.replayTime = this.scaleTimes.start_time;
          this.curWidth = total;
          if (this.rateSpecial) {
            this.$emit('updateReplayStatus', this.showPlayIcon);
          }
          return;
        }
        //当前播放的时间节点在整个时间轴上的比例
        const percent =
          (moment(time).valueOf() - startTimeValue) /
          (endTimeValue - startTimeValue);
        // 总宽乘以百分比
        this.curWidth = percent * total;
        this.$emit('replayHandle', this.replayTime);
      }, 1000 / this.rate);
    },

    //视频快进或者倒退成功后的回调函数,允许视频播放修改时间轴进度
    setTimeHandle() {
      this.updateControl = true;
    },

    //视频的暂停播放改变时间轴的暂停播放
    changePlayStatus(type) {
      if (type == 'play') {
        //图标切换
        this.showPlayIcon = false;
        //允许视频播放修改时间轴进度
        this.updateControl = true;
      } else {
        this.showPlayIcon = true;
      }
      this.$emit('updateReplayStatus', this.showPlayIcon);
    },
    //标记下载
    download(item) {
      this.$request.binaryDownload(
        'get',
        item.attachments[0].path,
        {},
        { filename: item.attachments[0].filename, baseURL: '' },
      );
    },
    //录屏被切换,复盘暂停
    changeScreen() {
      this.showPlayIcon = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.time-line-box {
  width: 100%;
  height: 100%;
  position: relative;
  top: -15px;
  box-sizing: border-box;
  .time-line-top {
    width: 100%;
    position: absolute;
    top: 26px;
  }
  .time-tips-wrapper {
    position: relative;
    bottom: -4px;
    height: 8px;
    .set-zindex {
      z-index: 999 !important;
    }
    .time-item {
      position: absolute;
      bottom: 4px;
      z-index: 666;
      box-sizing: border-box;
      .current-radius-blue {
        // width: 6px !important;
        // height: 13px !important;
        // position: relative;
      }
      .radius-blue {
        width: 16px;
        height: 16px;
        margin-top: -2px;
        cursor: pointer;
        .desc {
          background: rgba(37, 47, 66, 1);
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.7);
          border-radius: 23px;
        }
      }
    }
    .red {
      color: var(--red-color) !important;
    }
    .blue {
      color: var(--primary-color) !important;
    }
    .team {
      color: var(--primary-color) !important;
    }
  }
  .cur-wrapper {
    position: relative;
    width: 100%;
    height: 28px;
    overflow-x: hidden;
    z-index: 100;
    .time-arr {
      width: 11px;
      height: 20px;
      margin-left: -4px;
      position: absolute;
      z-index: 100;
    }
    .slider {
      width: 100%;
      height: 4px;
      border-radius: 2px;
      // margin-top: 9px;
      cursor: pointer;
    }
    .time-current {
      height: 4px;
      // z-index: 50;
      border-radius: 2px;
      // margin-top: 9px;
      background: var(--primary-color);
      cursor: pointer;
    }
  }

  .line-throughs {
    height: 4px;
    width: 100%;
    position: relative;
    top: 60%;
    background: var(--bg-color-2);
    cursor: pointer;
  }
  .time-line {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    top: calc(60% + 2px);
    .line {
      width: 4px;
      height: 8px;
      opacity: 0.2;
      background: var(--neutral4);
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
  .screen-play-control {
    position: absolute;
    top: 24px;
    left: -25px;
    cursor: pointer;
  }
  .screen-rate-control {
    position: absolute;
    width: 50px;
    height: 120px;
    top: -72px;
    right: -55px;
    .rate-box {
      position: relative;
      width: 100%;
      height: 100%;
      font-size: 12px;
      color: var(--neutral6);
      .options {
        position: absolute;
        width: 50px;
        margin-bottom: 10px;
        background: var(--bg-color-2);
        padding: 4px 8px;
        cursor: pointer;
        .option {
          margin-bottom: 6px;
          &:hover {
            color: var(--neutral8);
          }
        }
        .select-rate {
          color: var(--neutral8);
        }
      }
      .current-rate {
        position: absolute;
        width: 50px;
        height: 24px;
        bottom: 0;
        padding: 4px 4px 0 4px;
        color: var(--neutral8);
        border: 1px solid var(--neutral3);
        .icon {
          float: right;
        }
        .current-rate-icon {
          color: var(--neutral7);
        }
      }
    }
  }
  .screen-rate-control-special {
    top: -52px;
    height: 100px;
  }
}
.tips {
  font-size: 14px;
  .tips-txt {
    margin-bottom: 4px;
    .state {
      display: inline-block;
      padding: 4px 8px;
      margin-right: 8px;
      margin-bottom: 4px;
    }
    .add {
      background: var(--orange-color-2);
      color: var(--orange-color);
    }
    .success {
      background: var(--green-color-2);
      color: var(--green-color);
    }
    .fail {
      background: var(--red-color-2);
      color: var(--red-color);
    }
    .assess {
      background: var(--primary-color-2);
      color: var(--primary-color);
    }
    .reject {
      background: var(--orange-color-2);
      color: var(--orange-color);
    }
  }
  .download {
    margin: 8px 0;
    .file-name {
      cursor: pointer;
      color: var(--primary-color);
    }
  }
  .user-info {
    .avatar {
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
    .name {
      margin: 0 10px;
    }
  }
}
</style>
