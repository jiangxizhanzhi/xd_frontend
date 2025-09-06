<template>
  <div class="chart-wrapper">
    <div class="assets-top">
      <div class="assets">
        <div class="icon"></div>
        <div class="info">
          <div>{{ data.assets_total }}</div>
          <div>{{ $t('mgRoutes.totalAssets') }}</div>
        </div>
      </div>
      <div class="ips">
        <div class="icon"></div>
        <div class="info">
          <div>{{ data.ip_total }}</div>
          <div>{{ $t('mgRoutes.totalIP') }}</div>
        </div>
      </div>
    </div>
    <div class="assets-bottom">
      <div>
        <div class="icon">{{ data.operation_system_count }}</div>
        <div class="name">{{ $t('mgRoutes.operateSystem') }}</div>
      </div>
      <div>
        <div class="icon">{{ data.application_system_count }}</div>
        <div class="name">{{ $t('mgRoutes.application') }}</div>
      </div>
      <div>
        <div class="icon">{{ data.safety_system_count }}</div>
        <div class="name">{{ $t('mgRoutes.security') }}</div>
      </div>
      <div>
        <div class="icon">{{ data.network_count }}</div>
        <div class="name">{{ $t('mgRoutes.network') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'AssetsStatistics',
  props: {
    data: Object,
    default: () => ({}),
  },
  setup() {},
});
</script>
<style lang="scss" scoped>
.chart-wrapper {
  display: flex;
  flex-direction: column;
  .assets-top {
    display: flex;
    align-items: center;
    padding: 0 1.125rem;
    margin-bottom: 0.75em;

    .assets,
    .ips {
      flex: 1;
      display: flex;
      .icon {
        width: 3.75em;
        height: 3.125em;
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
      }

      .info {
        div:nth-child(1) {
          font-size: 1.6em;
          font-family: youshebiaotihei !important;
          color: #07e6cc;
          line-height: calc(var(--size) * 1.75);
          background: linear-gradient(180deg, #ffffff 0%, #ccfff8 100%);
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        div:nth-child(2) {
          font-size: 0.75em;
          font-weight: 400;
          color: rgb(255, 255, 255, 0.6);
        }
      }
    }

    .assets .icon {
      background-image: url(~@/assets/img/visual-screen/screen-3/assets.png);
    }

    .ips .icon {
      background-image: url(~@/assets/img/visual-screen/screen-3/ips.png);
    }
  }

  .assets-bottom {
    display: flex;
    align-items: center;
    padding: 0 0.5em;

    & > div {
      flex: 1;
      text-align: center;
    }
    .icon {
      height: calc(var(--size) * 2.5);
      line-height: calc(var(--size) * 2.1);
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url(~@/assets/img/visual-screen/screen-3/system.png);
      font-size: 1.125em;
      font-family: youshebiaotihei !important;
      color: #07e6cc;
    }
    .name {
      font-size: 0.75em;
      font-weight: 400;
      color: rgb(255, 255, 255, 0.6);
    }
  }
}
</style>
