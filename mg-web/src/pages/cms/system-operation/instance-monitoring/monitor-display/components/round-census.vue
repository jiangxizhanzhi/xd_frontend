<template>
  <div class="traffic-ul-container">
    <ul>
      <li>
        <div class="number">
          <img :src="iconNormal" alt="" />
          <span class="low-risk">{{ normalNum }}</span>
        </div>
        <div class="des-text low-risk">
          {{ $t('systemOperation.nodeMonitoring.lowRisk') }}
        </div>
      </li>
      <li>
        <div class="number">
          <img :src="iconWarn" alt="" />
          <span class="risk">{{ warnNum }}</span>
        </div>
        <div class="des-text risk">
          {{ $t('systemOperation.nodeMonitoring.middleRisk') }}
        </div>
      </li>
      <li>
        <div class="number">
          <img :src="iconDanger" alt="" />
          <span class="high-risk">{{ dangerNum }}</span>
        </div>
        <div class="des-text high-risk">
          {{ $t('systemOperation.nodeMonitoring.highRisk') }}
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import iconNormal from '../assets/img/icon_green.png';
import iconWarn from '../assets/img/icon_orange.png';
import iconDanger from '../assets/img/icon_red.png';
export default {
  name: 'RoundCensus',
  props: {
    normalNum: {
      type: [String, Number],
      default: 0,
    },
    warnNum: {
      type: [String, Number],
      default: 0,
    },
    dangerNum: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      iconNormal,
      iconDanger,
      iconWarn,
    };
  },
};
</script>
<style scoped lang="scss" scoped>
.traffic-ul-container {
  width: 100%;
  height: 100%;
  ul {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-around;
    margin: 0% auto;
    padding-left: 0px;
    li {
      list-style: none;
      width: 30%;
      height: 100%;
      text-align: center;
      position: relative;
      .number {
        position: relative;
        width: 100%;
        height: calc(100% - 20px);
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      img {
        position: absolute;
        width: auto;
        height: 100%;
        top: 0;
        animation: rotate 2s linear infinite;
      }
      @-webkit-keyframes rotate {
        0% {
          transform: rotate(0);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes rotate {
        0% {
          transform: rotate(0);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .low-risk {
        color: #39ffb2;
      }
      .risk {
        color: #fd762c;
      }
      .high-risk {
        color: #ff6058;
      }
      .des-text {
        font-size: 14px;
        position: relative;
        margin-top: -4px;
      }
    }
  }
}
</style>
