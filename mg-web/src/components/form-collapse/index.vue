<template>
  <div class="form-collapse-container">
    <div class="form-collapse-title" :class="expand ? '' : 'collapse-content'">
      <cb-form-title :title="title" />
      <div
        @click="expandHandler"
        class="collapse-img"
        :class="expand ? 'expand-img' : ''"
      ></div>
    </div>

    <div ref="formCollapseContentRef" class="form-collapse-content">
      <transition name="zoom-in-top">
        <div v-show="expand">
          <slot></slot>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { gsap } from 'gsap';
export default {
  props: {
    defaultCollapse: Boolean,
    title: String,
  },
  data() {
    return {
      expand: this.defaultCollapse,
    };
  },
  computed: {},
  methods: {
    expandHandler() {
      const height = this.expand ? '0px' : 'auto';
      gsap.to(this.$refs.formCollapseContentRef, {
        duration: 0.2,
        height,
        ease: 'power1.inOut',
      });
      this.expand = !this.expand;
    },
  },
};
</script>
<style lang="scss" scoped>
.form-collapse-container {
  width: 100%;
  height: 100%;
  .form-collapse-content {
    height: 0px;
  }
  .form-collapse-title {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .collapse-img {
      cursor: pointer;
      float: right;
      background: url('./img/panel_expand.png');
      background-repeat: no-repeat;
      background-size: contain;
      width: 16px;
      height: 16px;
      transition: all 0.3s;
      margin: 2px 0;
    }
    .expand-img {
      transform: rotateZ(180deg);
    }
    &.collapse-content {
      .cb-form-title {
        margin-bottom: 0px;
      }
      margin-bottom: 16px;
    }
  }
  .zoom-in-top-enter-active,
  .zoom-in-top-leave-active {
    opacity: 1;
    transform: scaleY(1);
    transition: all 0.3s;
    transform-origin: top;
  }
  .zoom-in-top-enter,
  .zoom-in-top-leave-active {
    opacity: 0;
    transform: scaleY(0);
  }
}
</style>
