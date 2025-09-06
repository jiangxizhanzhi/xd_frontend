<template>
  <div class="exam-tips">
    <div class="btn-once">
      <div class="btn-second">
        <span>{{ $t('m.fromEnd') }} {{ showTime }}</span>
      </div>
    </div>
    <div class="i-under-bg"></div>
    <img class="tips-icon" :src="time" />
  </div>
</template>

<script>
import moment from 'moment';
import time from '@/assets/time/time.png';
let interval = null;
export default {
  name: 'Index',
  props: {
    second: {
      type: Number,
      default: null,
    },
    status: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      showTime: '',
      timeDown: '',
      seconds: this.second,
      time,
    };
  },
  watch: {
    second: {
      handler(nv, ov) {
        this.seconds = nv;
      },
      immediate: true,
      deep: true,
    },
    seconds: {
      handler(nv, ov) {
        if (nv === 0) {
          this.$emit('countdownOver');
          clearInterval(interval);
        }
      },
      immediate: true,
      deep: true,
    },
    status: {
      handler(nv, ov) {
        if (nv === 3) {
          clearInterval(interval);
          this.showTime = this.formatTime(this.seconds);
        } else {
          clearInterval(interval);
          interval = setInterval(() => {
            if (this.seconds > 0) {
              this.seconds -= 1;
              this.showTime = this.formatTime(this.seconds);
            } else {
              this.showTime = '00:00:00';
            }
          }, 1000);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeDestroy() {
    clearInterval(interval);
  },
  methods: {
    formatTime(val) {
      let timeFormateValue = '';
      var d = moment.duration(val, 'seconds');
      var hours = Math.floor(d.asHours());
      var mins = Math.floor(d.asMinutes()) - hours * 60;
      var s = Math.floor(d.seconds());
      const hourss = hours < 10 ? '0' + hours : hours;
      const minss = mins < 10 ? '0' + mins : mins;
      const ss = s < 10 ? '0' + s : s;
      if (hourss > 0) {
        timeFormateValue = hourss + ':' + minss + ':' + ss;
      } else {
        if (minss > 0) {
          timeFormateValue = '00:' + minss + ':' + ss;
        } else {
          if (s > 0) {
            timeFormateValue = '00:' + '00:' + ss;
          } else {
            timeFormateValue = '00:00:00';
          }
        }
      }
      return timeFormateValue;
    },
  },
};
</script>

<style scoped lang="scss">
.exam-tips {
  position: relative;
  box-sizing: content-box !important;
  .btn-once {
    height: 36px;
    line-height: 35px;
    min-width: 120px;
    box-sizing: border-box;
    padding: 1px;
    border-radius: 2px;
    .btn-second {
      background: var(--bg-color-4);
      box-sizing: content-box !important;
      width: calc(100% - 45px);
      padding: 0 15px 0 30px;
      height: 100%;
      border-radius: 2px;
      text-align: center;
      vertical-align: middle;
      font-size: 14px;
      span {
        color: var(--orange-color);
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
  .i-under-bg,
  .tips-icon {
    box-sizing: content-box !important;
    position: absolute;
    top: -6px;
    left: -23px;
    font-size: 44px;
  }
  .i-under-bg {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--bg-color-4);
    margin: 2px 0;
  }
}
</style>
