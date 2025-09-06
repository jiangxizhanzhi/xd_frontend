<template>
  <div
    class="study-overview-item"
    :class="language === 'en-US' ? 'study-overview-item-en' : ''"
  >
    <div class="left-content">
      <cb-iconfont
        :type="icon"
        :themedColor="iconColor"
        :size="size"
        class="icon-style"
      ></cb-iconfont>
    </div>
    <div class="item-content">
      <div class="item-number">{{ count }}</div>
      <div class="item-title">
        <span class="item-name">{{ name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import { getLanguage } from '@cyber/helper';
export default {
  props: {
    icon: {
      type: String,
      default() {
        return '';
      },
    },
    iconColor: {
      type: String,
      default() {
        return '';
      },
    },
    name: {
      type: String,
      default() {
        return '';
      },
    },
    count: {
      type: Number,
      default() {
        return 0;
      },
    },
    size: {
      type: [String, Number],
      default() {
        return '16';
      },
    },
  },
  data() {
    return {
      language: getLanguage(),
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.study-overview-item-en {
  width: 138px !important;
}
.study-overview-item {
  display: flex;
  align-items: center;
  height: 48px;
  width: 120px;

  .left-content {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--neutral0);
    margin-right: 12px;
    position: relative;
    .icon-style {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
  .item-content {
    height: 48px;
  }
  .item-number {
    margin: auto;
    font-size: 20px;
    font-weight: bold;
    color: var(--neutral8);
  }
  .item-title {
    font-size: 12px;
    color: var(--neutral5);
  }
}
</style>
