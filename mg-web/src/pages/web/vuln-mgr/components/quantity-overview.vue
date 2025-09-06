<template>
  <div class="vuln-quantity-overview">
    <div
      class="quantity-platform"
      :style="{
        background: `url(${bgImg}) no-repeat`,
        'background-size': 'contain',
      }"
    >
      <div
        class="quantity-overview__total"
        :style="{ top: `calc(18% - ${offsetY}*0.06vw)` }"
      >
        <div>{{ totalNum }}</div>
        <div class="vuln-total-num">{{ $t('vulnIndex.totalNum') }}</div>
      </div>
      <div class="quantity-cylinder">
        <svg x="0px" y="0px" viewBox="0 0 136 250">
          <g transform="translate(0, 0)">
            <linearGradient
              id="vuln-quantity-overview__rec-1"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientTransform="matrix(66 0 0 128 7724 80)"
            >
              <stop offset="0" style="stop-color: #0bdaff" />
              <stop offset="1" style="stop-color: #0bdaff; stop-opacity: 0.1" />
            </linearGradient>
            <polygon
              opacity="0.3"
              fill="url(#vuln-quantity-overview__rec-1)"
              :points="`34,${184 - offsetY} 100,${
                184 - offsetY
              } 100,212 34,212`"
            />

            <linearGradient
              id="vuln-quantity-overview__rec-2"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientTransform="matrix(32.7519 0 0 151.4865 3863.0474 56.5252)"
            >
              <stop offset="0" style="stop-color: #0bdaff" />
              <stop offset="1" style="stop-color: #0bdaff; stop-opacity: 0.1" />
            </linearGradient>
            <polygon
              opacity="0.2"
              fill="url(#vuln-quantity-overview__rec-2)"
              :points="`100,${184 - offsetY} 134,${
                160 - offsetY
              } 134,184 100,212`"
            />

            <linearGradient
              id="vuln-quantity-overview__rec-3"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientTransform="matrix(-32.7519 0 0 151.4865 -3963.5532 56.5252)"
            >
              <stop offset="0" style="stop-color: #0bdaff" />
              <stop offset="1" style="stop-color: #0bdaff; stop-opacity: 0" />
            </linearGradient>
            <polygon
              opacity="0.2"
              fill="url(#vuln-quantity-overview__rec-3)"
              :points="`34,${184 - offsetY} 2,${160 - offsetY} 2,184 34,212`"
            />

            <linearGradient
              id="vuln-quantity-overview__polygon-1"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="0"
              gradientTransform="matrix(98 57 -36 63 11639 6763)"
            >
              <stop offset="0" style="stop-color: #0bdaff" />
              <stop offset="1" style="stop-color: #0bdaff; stop-opacity: 0.1" />
            </linearGradient>
            <polygon
              opacity="0.27"
              fill="url(#vuln-quantity-overview__rec-1)"
              :points="`100,${137 - offsetY} 134,${160 - offsetY} 100,${
                184 - offsetY
              } 34,${184 - offsetY} 2,${160 - offsetY} 34,${137 - offsetY}`"
            />

            <linearGradient
              id="vuln-quantity-overview__polygon-2"
              gradientUnits="userSpaceOnUse"
              x1="-117"
              y1="0"
              x2="-117"
              y2="-1"
              gradientTransform="matrix(98.9308 57.1177 -36.5921 63.3794 11639.6074 6891.1479)"
            >
              <stop offset="0" style="stop-color: #0bdaff" />
              <stop offset="1" style="stop-color: #0bdaff; stop-opacity: 0" />
            </linearGradient>
            <polygon
              id="vuln-quantity-overview__polygon-3"
              opacity="0.02"
              fill="url(#vuln-quantity-overview__polygon-2)"
              points="100,160 134,180 100,212 34,212 2,180 34,160"
            />

            <linearGradient
              id="vuln-quantity-overview__polygon-4"
              gradientUnits="userSpaceOnUse"
              x1="-116"
              y1="-0.5"
              x2="-117"
              y2="-0.9"
              gradientTransform="matrix(63.5348 36.6818 -23.5 40.7032 7457.1562 4363.5059)"
            >
              <stop offset="0" style="stop-color: #0bdaff; stop-opacity: 0.8" />
              <stop offset="1" style="stop-color: #0bdaff; stop-opacity: 0.1" />
            </linearGradient>
            <polygon
              opacity="0.27"
              fill="url(#vuln-quantity-overview__polygon-4)"
              :points="`90,${146 - offsetY} 110,${160 - offsetY} 90,${
                175 - offsetY
              } 46,${175 - offsetY} 26,${160 - offsetY} 46,${146 - offsetY}`"
            />
          </g>
        </svg>
      </div>
      <!-- 2 移动互联网 -->
      <div class="quantity-platform__mobile">
        <div class="quantity-platform__text">
          {{ $t(businessOptions[businessOptions.mobileInternet]) }}
        </div>
        <div>{{ category[businessOptions.mobileInternet] }}</div>
      </div>
      <!-- 1 电信 -->
      <div class="quantity-platform__telecom">
        <div class="quantity-platform__text">
          {{ $t(businessOptions[businessOptions.telecom]) }}
        </div>
        <div>{{ category[businessOptions.telecom] }}</div>
      </div>
      <!-- 4 区块链 -->
      <div class="quantity-platform__blockchain">
        <div class="quantity-platform__text">
          {{ $t(businessOptions[businessOptions.blockchain]) }}
        </div>
        <div>{{ category[businessOptions.blockchain] }}</div>
      </div>
      <!-- 3 工控 -->
      <div class="quantity-platform__industry">
        <div class="quantity-platform__text">
          {{ $t(businessOptions[businessOptions.industrialControlSystem]) }}
        </div>
        <div>{{ category[businessOptions.industrialControlSystem] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { businessOptions } from '@/constants';
import bgImg from '@/assets//img/vuln/overview_platform.png';
export default {
  props: {
    total: null,
    category: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      offsetY: 1,
      totalNum: 0,
      intervalId: null,
      businessOptions,
      animateRound: 50,
      curRound: 0,
      bgImg,
    };
  },
  computed: {},
  watch: {
    total(val) {
      if (val !== null) {
        this.startAnimate();
      }
    },
  },

  methods: {
    startAnimate() {
      this.intervalId = requestAnimationFrame(this.animateEffect);
    },
    animateEffect() {
      if (this.curRound >= this.animateRound) {
        this.totalNum = this.total;
        cancelAnimationFrame(this.intervalId);
      } else {
        this.offsetY = this.easeOutQuad(100);
        this.totalNum = this.easeOutQuad(this.total);
        this.curRound++;
        this.intervalId = requestAnimationFrame(this.animateEffect);
      }
    },
    easeOutQuad(changeValue) {
      const round = this.curRound / this.animateRound;
      return parseInt(-changeValue * round * (round - 2));
    },
  },
};
</script>

<style scoped lang="scss">
.vuln-quantity-overview {
  width: 100%;
  height: calc(100% - 88px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;

  .quantity-platform {
    $w: 84%;
    width: $w;
    box-sizing: content-box;
    height: 0;
    padding-bottom: calc($w/2.06);
    // background: url('@/assets//img/vuln/overview_platform.png') no-repeat;
    // background-size: contain;
    color: var(--neutral8);
    font-size: 1.6vw;
    position: relative;
    .quantity-overview__total {
      $w: 32%;
      box-sizing: content-box;
      position: absolute;
      width: $w;
      height: 0;
      padding-bottom: calc($w/4.5);
      background: url('@/assets//img/vuln/overview_total_bg.png') no-repeat;
      background-size: contain;
      background-position: 50%;
      left: calc(50% - 0.5 * $w);
      font-size: 2.1vw;
      text-align: center;
      color: var(--primary-color);
      .vuln-total-num {
        font-size: 0.9vw;
        color: var(--neutral8);
      }
    }
    .quantity-cylinder {
      $w: 24%;
      position: absolute;
      height: 34%;
      width: $w;
      top: -6%;
      left: calc(50% - 0.5 * $w);
    }
    .quantity-platform__text {
      font-size: 0.9vw;
    }
    .quantity-platform__mobile {
      position: absolute;
      left: 16%;
      top: 0;
    }
    .quantity-platform__telecom {
      position: absolute;
      right: 16%;
      top: 0px;
      text-align: right;
    }
    .quantity-platform__blockchain {
      position: absolute;
      left: 20%;
      top: 34%;
    }
    .quantity-platform__industry {
      position: absolute;
      right: 22%;
      top: 38%;
      text-align: right;
    }
  }
}
</style>
