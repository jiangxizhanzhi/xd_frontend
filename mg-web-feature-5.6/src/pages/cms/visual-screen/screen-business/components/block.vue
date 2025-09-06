<template>
  <div
    class="block"
    :style="
      boxRight >= 0
        ? {
            width: boxWidth + 'px',
            height: boxHeight + 'px',
            right: boxRight + 'px',
            top: boxTop + 'px',
          }
        : {
            width: boxWidth + 'px',
            height: boxHeight + 'px',
            left: boxLeft + 'px',
            top: boxTop + 'px',
          }
    "
  >
    <div class="block-header">
      <span class="icon"></span>
      <span class="title">{{ title }}</span>
      <span class="info" v-if="showInfo">{{ $t('screenBusiness.unit') }}</span>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    boxWidth: {
      type: Number,
      default: 0,
    },
    boxHeight: {
      type: Number,
      default: 0,
    },
    boxLeft: {
      type: Number,
      default: 0,
    },
    boxTop: {
      type: Number,
      default: 0,
    },
    boxRight: {
      type: Number,
      default: -1,
    },
    showInfo: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  // position: absolute;
  display: flex;
  flex-direction: column;
  .block-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    position: relative;
    .icon {
      background: url(~@/assets/img/visual-screen/screen-3/title.png) center
        center / contain no-repeat;
      width: 3.2em;
      height: 1.875em;
    }
    .title {
      font-size: 1.125em;
      font-family: youshebiaotihei !important;
      color: #ffffff;
      background: linear-gradient(180deg, #ffffff 0%, #afafc2 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .info {
      margin-right: 10px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC !important;
      font-weight: 400;
      color: #ffffff;
      line-height: 17px;
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
  }
  .body {
    flex: 1;
    overflow: hidden;
  }
}
</style>
