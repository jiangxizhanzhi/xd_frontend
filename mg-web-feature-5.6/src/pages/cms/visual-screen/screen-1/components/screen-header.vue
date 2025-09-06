<template>
  <div class="header-wrapper">
    <div class="header-wrapper-time">
      <span class="header-wrapper-time-title"> 天文时间: </span>
      <span>
        {{ time1 }}
      </span>
      <span class="header-wrapper-time-title"> 作战时间: </span>
      <span>{{ time2 }}</span>
    </div>
    <div class="header-wrapper-competition">
      <span class="header-wrapper-competition-title">比赛时间:</span>
      <span class="header-wrapper-competition-time">
        {{ computedTime(time3) }}
      </span>
    </div>
    <div class="header-bg">
      <div class="bg-left"></div>
      <div class="bg-center">
        <div class="bg-center-bg-left"></div>
        <div class="bg-center-bg-right"></div>
        <div class="bg-center-line-left"></div>
        <div class="bg-center-line-right"></div>
        <div class="bg-center-text">赛宁网安工控靶场</div>
      </div>
      <div class="bg-right"></div>
    </div>
    <svg width="0" height="0">
      <defs>
        <filter id="composite">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="5"
            result="gaussianBlur"
          />
          <feColorMatrix
            in="gaussianBlur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="colorMatrix"
          />
          <feBlend in="SourceGraphic" in2="colorMatrix" />
        </filter>
      </defs>
    </svg>
  </div>
</template>
<script>
import { useTime } from '@/hooks';
import { getTime } from '@/api/screen-center';
import { ref, onMounted, onBeforeUnmount } from '@vue/composition-api';
import { dateFormat } from '@/utils';
export default {
  name: 'ScreenHeader',
  components: {},
  props: {},
  setup() {
    const time = useTime();
    let time1 = ref('');
    let time2 = ref('');
    let time3 = ref('');
    let clock = ref(null);
    const getAllTime = () => {
      getTime('8f24d7df2ba00c1d16fe5f2c1930503e').then((res) => {
        const data = res.data;
        time1.value = data.current_astronomical_time;
        time2.value = data.current_combat_time;
        time3.value = new Date(data.create_time);
        let t = new Date().getTime();
        time3.value = t - time3.value.getTime();
        startCount();
      });
    };

    onMounted(() => {
      getAllTime();
    });

    onBeforeUnmount(() => {
      clearInterval(clock.value);
    });

    const computedTime = (time) => {
      let diff = ~~(time / 1000);
      let hour = ~~(diff / (60 * 60));
      let min = ~~((diff - hour * 60 * 60) / 60);
      let seconds = diff - hour * 60 * 60 - min * 60;
      return `${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${
        seconds < 10 ? '0' + seconds : seconds
      }`;
    };

    const formatTime = (time) => {
      return dateFormat(time, 'yyyy-MM-dd HH:mm:ss');
    };

    const startCount = () => {
      if (!time1.value || !time2.value || !time3.value) {
        return;
      }
      time1.value = formatTime(new Date(time1.value));
      time2.value = formatTime(new Date(time2.value));

      clock.value = setInterval(() => {
        if (!time1.value || !time2.value || !time3.value) {
          return;
        }
        time1.value = formatTime(
          new Date(new Date(time1.value).getTime() + 1000),
        );
        time2.value = formatTime(
          new Date(new Date(time2.value).getTime() + 1000),
        );
        time3.value += 1000;
      }, 1000);
    };
    return { time, time1, time2, time3, computedTime };
  },
};
</script>
<style lang="scss" scoped>
.header-wrapper {
  height: 60px;
  position: relative;

  &-time {
    position: absolute;
    left: 0;
    bottom: 4px;
    font-size: var(--font-size-18);
    &-title {
      margin: 0 20px;
    }
  }
  &-competition {
    position: absolute;
    right: 0;
    bottom: 4px;
    &-time {
      font-size: var(--font-size-30);
      margin: 0 10px;
    }
  }
}
.header-bg {
  display: flex;
  align-items: flex-start;
  filter: url('#composite');
  height: 60px;

  .bg-left,
  .bg-right {
    flex: 1;
    width: 0;
    height: 20px;
    background: #191f2e;
    background: linear-gradient(90deg, #191f2e, #334c6e);
  }

  .bg-right {
    background: linear-gradient(-90deg, #191f2e, #334c6e);
  }

  .bg-center {
    padding: 0 20px;
    position: relative;
    height: 60px;
    background: linear-gradient(
      to bottom,
      #334d70,
      #334d70 50%,
      rgba(51, 77, 112, 0) 50%,
      rgba(110, 164, 231, 0) 100%
    );
    border-radius: 10px;
    border-bottom: 1px solid #dddddd;

    .bg-center-bg-left,
    .bg-center-bg-right {
      background: linear-gradient(0deg, #6ea5e7, #334c6e);
      position: absolute;
      inset: 0;
      transform-origin: 0 100%;
      top: 20px;
    }
    .bg-center-bg-left {
      transform: skew(45deg);
      border-radius: 0 0 20px 10px;
    }

    .bg-center-bg-right {
      transform: skew(-45deg);
      border-radius: 0 0 10px 20px;
    }

    .bg-center-line-left,
    .bg-center-line-right {
      position: absolute;
      background: repeating-linear-gradient(
        90deg,
        transparent 0,
        transparent 8%,
        rgba(69, 103, 150, 0.2) 8%,
        rgba(69, 103, 150, 0.2) 11%
      );
      z-index: 20;
      width: 60%;
    }

    .bg-center-line-left {
      position: absolute;
      inset: 0;
      transform-origin: 0 100%;
      transform: skew(45deg);
      border-radius: 0 0 0 10px;
    }

    .bg-center-line-right {
      transform-origin: 100% 100%;
      transform: skew(-45deg);
      z-index: 10;
      width: 60%;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: 0 0 10px 0;
    }

    .bg-center-text {
      position: relative;
      z-index: 20;
      font-size: 40px;
      font-family: youshebiaotihei;
      font-weight: 400;
      background: linear-gradient(180deg, #ffffff 0%, #cee5f2 100%);
      background-clip: text;
      color: transparent;
      letter-spacing: 5px;
    }
  }
}
</style>
