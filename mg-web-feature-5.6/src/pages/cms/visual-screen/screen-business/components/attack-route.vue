<template>
  <div class="bottom-attack-route">
    <div class="inner-content">
      <div class="title">{{ $t('screenBusiness.attackPath') }}</div>
      <div class="path-box">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="attack-route-box"
        >
          <div class="time-line-box">
            <div :class="['node-circle', { rotate: item.status === 2 }]">
              <img :src="getStateImg(item)" alt="" />
            </div>
            <div
              v-if="index < data.length - 1"
              class="line-border"
              :class="{ 'red-line': item.status === 3 }"
            >
              <img
                v-show="item.status === 3"
                :src="Light"
                alt=""
                class="light"
              />
            </div>
          </div>
          <div class="node-name" :class="getColor(item)">{{ item.node }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Attacked from '@/assets/img/visual-screen/screen-business/lujing_breached.png';
import Attacking from '@/assets/img/visual-screen/screen-business/lujing_breaching.png';
import Normal from '@/assets/img/visual-screen/screen-business/lujing_normal.png';
import Light from '@/assets/img/visual-screen/screen-business/light.png';
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      Attacked,
      Attacking,
      Normal,
      Light,
    };
  },
  methods: {
    // 1：未受攻击；2：正被攻击；3：攻击完成
    getStateImg(item) {
      if (item.status === 1) {
        return this.Normal;
      } else if (item.status === 2) {
        return this.Attacking;
      } else {
        return this.Attacked;
      }
    },
    getColor(item) {
      if (item.status === 3) {
        return 'red';
      } else if (item.status === 2) {
        return 'blue';
      }
    },
  },
};
</script>
<style lang="scss">
.bottom-attack-route {
  width: 100%;
  height: 85px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 11;

  .inner-content {
    width: 76%;
    height: 100%;
    margin: auto;
    background-image: url(~@/assets/img/visual-screen/screen-business/bottom_bg.png);
    background-size: 100% 100%;
    // padding: 3px 0;
    box-sizing: border-box;

    .title {
      font-size: 18px;
      padding-top: 8px;
      font-family: YouSheBiaoTiHei !important;
      text-align: center;
      color: #ffffff;
      line-height: 23px;
    }
  }

  .path-box {
    display: flex;
    justify-content: center;
    width: 68%;
    margin: auto;
    transform: translateX(48px);

    .attack-route-box {
      width: 14%;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #ffffff;
      line-height: 17px;

      .time-line-box {
        display: flex;
        align-items: center;

        .node-circle {
          display: flex;
          align-items: center;
          img {
            width: 12px;
            height: 13px;
          }
          animation: rotate-circle 5s linear infinite;
        }
        .line-border {
          width: calc(100% - 12px);
          height: 1px;
          z-index: 1;
          position: relative;
          border: 1px solid rgb(23 246 255 / 40%);

          .light {
            position: absolute;
            top: -12px;
            left: 0;
            width: 100%;
            height: 23px;
            animation: moveLeft 1s ease infinite;
          }
        }

        .red-line {
          border: 1px dashed #e04026;
        }
      }
      .node-name {
        margin-top: 5px;
        margin-left: -48px;
      }
      .blue {
        color: #17f6ff;
      }
      .red {
        color: #e04026;
      }
    }
  }
  @keyframes moveLeft {
    0% {
      opacity: 0;
      transform: translateX(-100%);
    }
    100% {
      opacity: 1;
      transform: translateX(10%);
    }
  }
  @keyframes rotate-circle {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  // margin-bottom: 4px;
}
</style>
