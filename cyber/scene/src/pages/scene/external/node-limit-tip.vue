<template>
  <div
    :class="['info-tag', { 'info-tag-bottom': type == 'bottom' }]"
    :style="{'right': sceneStore.state.basicConfig.showGraphToolbar ? '60px' : '16px'}"
  >
    <cb-iconfont :type="icon" :color="color"></cb-iconfont>
    <span class="tag-text">{{ text }}</span>
  </div>
</template>

<script>
import sceneStore from "../../../store/scene-store";

export default {
  name: 'NodeLimitTip',
  props: {
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'icon-tuopubianpai',
    },
    color: {
      type: String,
      default: 'var(--green-color)',
    },
    type: {
      type: String,
      default: 'top',
    },
  },
  data() {
    return {
      sceneStore,
    };
  },
};
</script>

<style lang="scss" scoped>
.info-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  font-size: 12px;
  //top: 20px;
  min-width: 180px;
  //height: 40px;
  //line-height: 40px;
  &-bottom {
    bottom: 12px;
    right: 60px;
  }

  .tag-text {
    padding-left: 4px;
    user-select: none;
  }
}
</style>
