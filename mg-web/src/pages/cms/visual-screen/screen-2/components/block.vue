<template>
  <div class="block">
    <div class="block-inner">
      <div :class="['block-title', pos]">{{ title }}</div>
      <div class="block-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api';
export default defineComponent({
  name: 'Block',
  components: {},
  props: {
    title: String,
    titlePosition: String,
  },
  setup(prop) {
    const pos = computed(() => {
      return 'pos-' + prop.titlePosition || 'left';
    });

    return { pos };
  },
});
</script>
<style lang="scss" scoped>
.block {
  height: 100%;
  position: relative;
  background: rgba(68, 145, 255, 0.15);
  box-shadow: inset 0px 0px 16px 0px #010c36;
  border: 1px solid rgba(68, 145, 255, 0.5);
  font-size: calc(100vw / 120);

  &::before,
  &::after {
    position: absolute;
    content: '';
    display: block;
    width: 1em;
    height: 1em;
    border-color: #55b7ff;
    border-style: solid;
    top: -1px;
  }

  &::before {
    left: -1px;
    border-width: 1px 0 0 1px;
  }

  &::after {
    right: -1px;
    border-width: 1px 1px 0 0;
  }

  &-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0.75em;

    &::before,
    &::after {
      position: absolute;
      content: '';
      display: block;
      width: 1em;
      height: 1em;
      border-color: #55b7ff;
      border-style: solid;
      bottom: -1px;
    }

    &::before {
      left: -1px;
      border-width: 0 0 1px 1px;
    }

    &::after {
      right: -1px;
      border-width: 0 1px 1px 0;
    }
  }

  &-title {
    font-size: 1em;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 1.375em;
    background: linear-gradient(180deg, #70f4ff 0%, #4491ff 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.625em;

    &.pos-left {
      text-align: left;
    }

    &.pos-center {
      text-align: center;
    }

    &.pos-right {
      text-align: right;
    }
  }

  &-content {
    flex: 1;
    height: 0;
  }
}
</style>
