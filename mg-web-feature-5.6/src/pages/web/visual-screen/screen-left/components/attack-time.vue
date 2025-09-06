<template>
  <div class="contain">
    <div class="header">
      <div v-for="(item, index) in attackData" :key="index" class="header-item">
        <div class="header-item-left">
          <div class="sknew-div-up"></div>
          <div class="sknew-div-down"></div>
        </div>
        <div class="header-item-center">{{ item }}</div>

        <div class="header-item-right">
          <div class="sknew-div-up"></div>
          <div class="sknew-div-down"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
export default {
  name: 'attack-echarts',
  props: {},
  setup(props) {
    const attackData = ref([
      '目标侦查',
      // '目标侦查',
      // '目标侦查',
      // '目标侦查',
      // '目标侦查',
      // '目标侦查',
      // '目标侦查',
    ]);
    return {
      attackData,
    };
  },
};
</script>

<style lang="scss" scoped>
.contain {
  height: 100%;
  background-color: yellow;
}
.header {
  display: flex;
  height: 40px;
  justify-content: center;
  &-item {
    display: flex;
    // flex: 1;
    width: 400px;
    justify-content: center;
    align-items: center;
    // border: 1px solid red;
    &-center {
      flex: 1;
      display: flex;
      height: 100%;
      border-top: 1px solid red;
      border-bottom: 1px solid red;
      border-left: 1px solid red;
      justify-content: center;
      align-items: center;
      background: rgba(47, 23, 40, 0.8);
      position: relative;
      z-index: 2;
    }
    &-left {
      display: flex;
      height: 100%;
      width: 20px;
      flex-direction: column;
      .sknew-div-up {
        flex: 1;
        border-right: 3px solid red;
        transform: skew(0, 45deg);
        transform-origin: 100% 100%;
        background: rgba(47, 23, 40, 0.8);
        clip-path: polygon(100% 0, 100% 0, 100% 100%, 0 100%);
      }
      .sknew-div-down {
        flex: 1;
        border-right: 3px solid red;
        transform: skew(0, -45deg);
        transform-origin: 100% 0;
        background: rgba(47, 23, 40, 0.8);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%);
      }
    }
    &-right {
      display: flex;
      height: 100%;
      width: 20px;
      flex-direction: column;
      .sknew-div-up {
        flex: 1;
        border-right: 3px solid red;
        transform: skew(45deg, 0);
        transform-origin: 100% 100%;
        background: rgba(47, 23, 40, 0.8);
        clip-path: polygon(100% 0, 100% 0, 100% 100%, 0 100%);
      }
      .sknew-div-down {
        flex: 1;
        border-right: 3px solid red;
        transform: skew(-45deg, 0);
        transform-origin: 100% 0;
        background: rgba(47, 23, 40, 0.8);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%);
      }
    }
  }
}
</style>
