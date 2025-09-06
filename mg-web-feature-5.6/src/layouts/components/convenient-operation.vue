<template>
  <div
    v-if="showAI || showRunningScene"
    class="convenient-operation"
    v-drag
    :style="{
      height: heightComputed,
    }"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div class="operation-item" v-if="showAI">
      <AI-chat :userInfo="$store.state.user" ref="AIRef" />
      <div class="line"></div>
    </div>
    <div class="operation-item" v-if="showRunningScene">
      <running-scene
        ref="mySceneRef"
        :dragMyscene="dragMyscene"
      ></running-scene>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
import runningScene from './running-scene.vue';
import AIChat from './AI-chat';
export default {
  components: {
    runningScene,
    AIChat,
  },
  props: {
    showAI: {
      type: Boolean,
      default: true,
    },
    showRunningScene: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dragMyscene: false, // 记录是否开始拖拽
    };
  },
  watch: {},
  computed: {
    heightComputed() {
      if (this.showRunningScene && this.showAI) {
        return '86px';
      }
      if (this.showRunningScene || this.showAI) {
        return '44px';
      }
    },
  },
  created() {},
  mounted() {
    if (this.showRunningScene) {
      document.addEventListener('mousemove', this.$refs.mySceneRef.mySceneMove);
    }
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
    this.listen.destroyListen();
    if (this.showRunningScene) {
      document.removeEventListener(
        'mousemove',
        this.$refs.mySceneRef.mySceneMove,
      );
    }
  },
  methods: {
    handleMouseDown(event) {
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.dragMyscene = true;
    },
    handleMouseUp(event) {
      // 判断是否为单击事件
      const endX = event.clientX;
      const endY = event.clientY;
      const distance = Math.sqrt(
        Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2),
      );
      if (distance < 5) {
        // 执行单击事件处理程序
        // this.handleClick();
      }
      this.startX = null;
      this.startY = null;
      this.dragMyscene = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.convenient-operation {
  width: 44px;
  height: 86px;
  background: var(--bg-color-2);
  border: 2px solid var(--primary-color-2);
  position: fixed;
  border-radius: 4px;
  bottom: 81px;
  right: 16px;
  z-index: 999;
  cursor: pointer;
  padding: 4px;
  .operation-item {
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    position: relative;
    .line {
      width: 100%;
      height: 2px;
      background: var(--neutral2);
      position: absolute;
      bottom: -6px;
      left: 0;
    }
    &:hover {
      background: var(--primary-color-2);
    }
    &:last-child {
      margin-bottom: 0px;
      .line {
        display: none;
        width: 100%;
        height: 2px;
        background: var(--neutral2);
        position: absolute;
        bottom: -6px;
        left: 0;
      }
    }
  }
}
</style>
