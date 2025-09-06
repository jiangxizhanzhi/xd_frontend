<template>
  <div class="detail-title" :class="type === 'right' ? 'right-title' : ''">
    <div class="border-current" v-if="type === 'left'">
      <cb-iconfont type="icon-xunlian-Titlezuo1" :size="24"></cb-iconfont>
      <span>{{ text }}</span>
    </div>
    <div class="border-current" v-if="type === 'right'">
      <span>{{ text }}</span>
      <cb-iconfont type="icon-xunlian-Titleyou1" :size="24"></cb-iconfont>
    </div>

    <!-- 按钮区域 -->
    <div class="left-btn-wrap" v-if="type === 'left'">
      <slot name="left"></slot>
    </div>
    <div class="right-btn-wrap" v-if="type === 'right'">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 文本信息
     */
    text: {
      type: String,
      default: '',
    },
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
.detail-title {
  font-size: 16px;
  font-weight: 400;
  border-bottom: 1px solid var(--neutral1);
  margin-bottom: 16px;
  position: relative;
  .border-current {
    width: 170px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--primary-color);
    position: relative;
    top: 1px;
    .cb-iconfont {
      position: relative;
      left: -8px;
    }
    span {
      position: relative;
      left: -11px;
    }
  }

  .left-btn-wrap {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.right-title {
  overflow: hidden;
  position: relative;
  .border-current {
    float: right;
    text-align: right;
    .cb-iconfont {
      position: relative;
      left: 6px;
    }
    span {
      position: relative;
      left: 9px;
    }
  }
  .right-btn-wrap {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
