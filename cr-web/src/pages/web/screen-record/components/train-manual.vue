<template>
  <div class="train-manual">
    <div class="train-manual-close" @click="closeManual">
      <cb-iconfont type="icon-guanbi"></cb-iconfont>
    </div>
    <div class="train-manual-title">{{ $t('m.trainManual') }}</div>
    <div class="train-manual-content cyber-scroll-bar-small">
      <cb-markdown v-model="markdownData" type="viewer"></cb-markdown>
    </div>
    <div class="train-manual-btn" @click="handleShowDirectory">
      <cb-iconfont type="icon-xiangqing"></cb-iconfont>
    </div>
    <div
      class="train-manual-directory cyber-scroll-bar-small"
      :class="showDirectory ? 'in' : 'out'"
    >
      <div
        v-for="item in manualData"
        :key="item.stage_name"
        class="train-manual-directory-item"
      >
        <div class="header">{{ item.stage_name }}</div>
        <div class="content">
          <div
            class="content-item one-overflow"
            v-for="child in item.missions"
            :key="child.resource_id"
            @click="handleChildClick(child)"
          >
            {{ child.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    manualData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      showDirectory: false,
      markdownData: '',
    };
  },
  watch: {
    manualData: {
      handler(val) {
        if (val) {
          this.markdownData = (val[0] && val[0].missions[0].write_up) || '';
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 关闭手册
    closeManual() {
      this.$emit('close');
    },
    // 目录控制
    handleShowDirectory() {
      this.showDirectory = !this.showDirectory;
    },
    // 点击任务
    handleChildClick(data) {
      this.markdownData = data.write_up;
      this.showDirectory = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes ltr-drawer-in {
  0% {
    transform: translate(-100%);
  }
  100% {
    transform: translate(0);
  }
}
@keyframes ltr-drawer-out {
  0% {
    transform: translate(0);
  }
  100% {
    transform: translate(-100%);
  }
}
.train-manual {
  position: relative;
  min-height: 100%;
  height: 100%;
  background: var(--bg-color-1);
  &-btn {
    position: absolute;
    top: 22px;
    left: 22px;
    cursor: pointer;
  }
  &-close {
    position: absolute;
    top: 22px;
    right: 22px;
    cursor: pointer;
    .cb-iconfont {
      color: var(--neutral-5);
    }
  }
  &-title {
    text-align: center;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid var(--neutral0);
  }
  &-content {
    height: calc(100% - 56px);
    overflow: auto;
  }
  .in {
    width: 420px;
    animation: ltr-drawer-in 0.3s 1ms;
  }
  .out {
    visibility: hidden;
    animation: ltr-drawer-out 0.3s 1ms;
  }
  &-directory {
    position: absolute;
    top: 56px;
    width: 420px;
    height: 100%;
    overflow: auto;
    background: var(--bg-color-2);
    font-size: 14px;
    transition: 0.3s ease;

    &-item {
      .header {
        border-bottom: 1px solid var(--neutral0);
        padding: 16px;
      }
      .content {
        &-item {
          border-bottom: 1px solid var(--neutral0);
          padding: 16px 16px 16px 32px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
