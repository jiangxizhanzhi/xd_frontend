<template>
  <div class="chart-wrapper">
    <div class="assets-top">
      <div class="assets">
        <div class="icon"></div>
        <div class="info">
          <div class="number-style">{{ data.assets_total || 0 }}</div>
          <div>{{ $t('screenBusiness.totalAssets') }}</div>
        </div>
      </div>
      <div class="ips">
        <div class="icon"></div>
        <div class="info">
          <div class="number-style">{{ data.ip_total || 0 }}</div>
          <div>{{ $t('screenBusiness.totalIp') }}</div>
        </div>
      </div>
    </div>
    <div class="assets-bottom">
      <div>
        <div class="icon num-style">
          {{ data.operation_system_count || 0 }}
        </div>
        <div class="name">{{ $t('screenBusiness.operateSystem') }}</div>
      </div>
      <div>
        <div class="icon num-style">
          {{ data.application_system_count || 0 }}
        </div>
        <div class="name">{{ $t('screenBusiness.application') }}</div>
      </div>
      <div>
        <div class="icon num-style">{{ data.safety_system_count || 0 }}</div>
        <div class="name">{{ $t('screenBusiness.security') }}</div>
      </div>
      <div>
        <div class="icon num-style">{{ data.network_count || 0 }}</div>
        <div class="name">{{ $t('screenBusiness.network') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          assets_total: '41',
          ip_total: '56',
          operation_system_count: '',
          application_system_count: '',
          safety_system_count: '',
          network_count: '',
        };
      },
    },
  },
};
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
        .number-style {
          font-family: OPPOSans !important;
        }
        div:nth-child(1) {
          font-size: 26px;
          // font-family: youshebiaotihei !important;
          color: #07e6cc;
          line-height: calc(var(--size) * 1.75);
          background: linear-gradient(180deg, #ffffff 0%, #ccfff8 100%);
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        div:nth-child(2) {
          font-size: 12px;
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
    .num-style {
      font-family: OPPOSans !important;
    }

    & > div {
      flex: 1;
      text-align: center;
    }
    .icon {
      height: 40px;
      line-height: 40px;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url(~@/assets/img/visual-screen/screen-business/zichan_bg.png);
      font-size: 16px;
      // font-family: youshebiaotihei !important;
      color: #ffffff;
    }
    .name {
      font-size: 12px;
      font-weight: 400;
      color: rgb(255, 255, 255, 0.6);
    }
  }
}
</style>
