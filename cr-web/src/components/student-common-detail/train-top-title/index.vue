<template>
  <div class="header">
    <div class="header-main">
      <div class="back" @click="backHome">
        <cb-iconfont size="14" type="icon-fanhui"></cb-iconfont>
        <span>{{ $t('admin.goBack') }}</span>
      </div>
      <div
        class="title"
        :title="detailTitle"
        :style="{
          left: language === 'en-US' ? '120px' : '100px',
        }"
      >
        <span class="titles"> {{ detailTitle }}</span>
        <span class="status" v-if="isEnd">
          {{ $t('rbt.hasEnded') }}
        </span>
      </div>
    </div>
    <div class="header-bottom">
      <div class="header-bottom-left"></div>
      <div class="header-bottom-middle">
        <div class="header-bottom-middle-1"></div>
        <div class="header-bottom-middle-1-bg"></div>
        <div class="header-bottom-middle-2"></div>
        <div class="header-bottom-middle-3"></div>
        <div class="header-bottom-middle-4"></div>
        <div class="header-bottom-middle-5"></div>
        <div class="header-bottom-middle-2"></div>
        <div class="header-bottom-middle-3 header-bottom-middle-6"></div>
        <div class="header-bottom-middle-6-bg"></div>
      </div>
      <div class="header-bottom-right"></div>
    </div>
  </div>
</template>

<script>
import { getLanguage } from '@cyber/helper';
export default {
  props: {
    detailTitle: {
      type: String,
      default: '',
    },
    // 是否展示已结束
    isEnd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      language: getLanguage(),
    };
  },
  methods: {
    backHome() {
      this.$emit('back');
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 56px;
  line-height: 56px;
  position: relative;
  z-index: 2;
  &-main {
    height: 48px;
    background: var(--bg-color-2);
  }
  &-bottom {
    height: 8px;
    display: flex;
    &-left {
      width: calc(100% - 214px);
      height: 7px;
      background: var(--bg-color-2);
      border-bottom: 1px solid var(--primary-color-2);
      margin-right: -1px;
    }
    &-middle {
      width: 216px;
      height: 7px;
      display: flex;

      &-1 {
        width: 0;
        height: 0;
        border-color: transparent var(--bg-color-2);
        border-width: 0 0 7px 7px;
        border-style: solid;
      }
      &-1-bg {
        width: 2px;
        height: 7px;
        background: var(--primary-color-2);
        transform: skew(-45deg);
        position: relative;
        left: -3px;
      }
      &-2 {
        width: 72px;
        height: 7px;
        border-top: 1px solid var(--primary-color-2);
      }
      &-3 {
        width: 0;
        height: 0;
        border-color: transparent var(--primary-color-2);
        border-width: 0 8px 8px 0;
        border-style: solid;
      }
      &-4 {
        width: 72px;
        height: 7px;
        background: var(--primary-color-2);
        border-top: 1px solid var(--primary-color-2);
      }
      &-5 {
        width: 0;
        height: 0;
        border-color: transparent var(--primary-color-2);
        border-width: 0 0 8px 8px;
        border-style: solid;
      }

      &-6 {
        border-color: transparent var(--bg-color-2);
      }
      &-6-bg {
        width: 2px;
        height: 7px;
        background: var(--primary-color-2);
        transform: skew(45deg);
        position: relative;
        left: -5px;
      }
    }
    &-right {
      width: calc(100% - 214px);
      height: 7px;
      background: var(--bg-color-2);
      border-bottom: 1px solid var(--primary-color-2);
      margin-left: -2px;
    }
  }

  .back {
    padding: 0 8px;
    position: absolute;
    left: 16px;
    top: 12px;
    height: 32px;
    line-height: 32px;
    background: var(--neutral0);
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    span {
      font-size: 14px;
      color: var(--primary-color);
    }
  }
  .back:hover {
    background: var(--primary-color-2);
  }

  .title {
    position: absolute;
    left: 100px;
    top: 0;
    font-size: 24px;
    display: flex;
    .titles {
      font-size: 20px;
      max-width: 1080px;
      display: -webkit-box;
      text-overflow: ellipsis;
      white-space: normal;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    .status {
      font-size: 14px;
      margin-left: 8px;
      width: 58px;
      height: 32px;
      background: var(--neutral0);
      margin-top: 12px;
      text-align: center;
      line-height: 32px;
      color: var(--neutral8);
    }
  }

  .header-right {
    position: absolute;
    right: 16px;
    top: 0px;
  }
}
</style>
