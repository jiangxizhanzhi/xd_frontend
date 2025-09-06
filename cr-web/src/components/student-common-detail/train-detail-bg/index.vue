<template>
  <div class="left-block" :class="type === 'right' ? 'right-block' : ''">
    <div class="header-div" v-if="type === 'left'">
      <div class="header-1"></div>
      <div class="header-2"></div>
      <div class="header-3"></div>
      <div class="header-3"></div>
      <div class="header-3"></div>
      <div class="header-3"></div>
    </div>
    <div class="header-div" v-if="type === 'right'">
      <div class="header-3"></div>
      <div class="header-3"></div>
      <div class="header-3"></div>
      <div class="header-3"></div>
      <div class="header-2"></div>
      <div class="header-1"></div>
    </div>
    <div class="middle-div" v-if="type === 'left'">
      <div class="middle-1"></div>
      <div class="middle-2"></div>
    </div>
    <div class="middle-div" v-if="type === 'right'">
      <div class="middle-2"></div>
      <div class="middle-1"></div>
    </div>
    <div class="left-main"></div>
    <div class="left-bottom">
      <div class="bottom-1"></div>
      <div class="bottom-2">
        <div class="bottom-2-1"></div>
        <div class="bottom-2-2"></div>
        <div class="bottom-2-3"></div>
        <div class="bottom-2-4"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 类型（left right）
     */
    type: {
      type: String,
      default: 'left',
    },
  },
};
</script>

<style lang="scss" scoped>
.left-block {
  height: 100%;
  width: 398px;

  .header-div {
    width: 384px;
    height: 22px;
    display: flex;
    .header-1 {
      width: 242px;
      background: var(--bg-color-2);
    }
    .header-2 {
      width: 0;
      height: 0;
      border-color: transparent var(--bg-color-2);
      border-width: 23px 0 0 23px;
      border-style: solid;
    }
    .header-3 {
      position: relative;
      top: 2px;
      left: -7px;
      width: 12px;
      transform: skew(45deg);
      background: var(--primary-color-2);
      height: 16px;
      margin: 0 3px;
    }
  }
  .middle-div {
    width: 100%;
    height: 14px;
    display: flex;
    .middle-1 {
      width: 384px;
      background: var(--bg-color-2);
    }
    .middle-2 {
      width: 0;
      height: 0;
      border-color: transparent var(--bg-color-2);
      border-width: 15px 0 0 15px;
      border-style: solid;
    }
  }
  .left-main {
    background: var(--bg-color-2);
    height: calc(100% - 16px);
    box-shadow: 5px 0 20px -10px rgba(0, 0, 0, 0.35);
  }
  .left-bottom {
    height: 38px;
    background: var(--bg-color-2);
    box-shadow: 5px 5px 10px -4px rgba(0, 0, 0, 0.35);
    .bottom-1 {
      width: 100%;
      height: 25px;
      border-left: 2px solid var(--primary-color-2);
      border-right: 2px solid var(--primary-color-2);
    }
    .bottom-2 {
      display: flex;
      justify-content: space-between;
      position: relative;
      .bottom-2-1 {
        position: relative;
        top: -2px;
        width: 0;
        height: 0;
        border-color: transparent var(--primary-color-2);
        border-width: 15px 0 0 15px;
        border-style: solid;
      }
      .bottom-2-2 {
        width: 25px;
        height: 2px;
        background: var(--primary-color-2);
        position: absolute;
        bottom: 2px;
        left: 13px;
      }
      .bottom-2-3 {
        width: 25px;
        height: 2px;
        background: var(--primary-color-2);
        position: absolute;
        bottom: 2px;
        right: 13px;
      }
      .bottom-2-4 {
        position: relative;
        top: -2px;
        width: 0;
        height: 0;
        border-color: transparent var(--primary-color-2);
        border-width: 15px 15px 0 0;
        border-style: solid;
      }
    }
  }
}
.right-block {
  .header-div {
    width: 100%;
    justify-content: end;
    .header-2 {
      border-width: 23px 23px 0 0 !important;
    }
    .header-3 {
      left: 6px;
      transform: skew(-45deg) !important;
    }
  }
  .middle-div {
    .middle-2 {
      border-width: 15px 15px 0 0 !important;
    }
  }
}
</style>
