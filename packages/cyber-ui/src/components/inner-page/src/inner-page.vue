<template>
  <div class="cb-inner-page" :class="bgCls">
    <header-decorate v-if="title" :title="title"></header-decorate>
    <div class="cb-inner-page__fixed-height">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import HeaderDecorate from './compoents/header-decorate.vue';

/**
 * 自带背景和边距的页面背景
 * @displayName cb-inner-page 页面背景
 * @classify Layout/布局
 */
export default {
  name: 'CbInnerPage',
  components: { HeaderDecorate },
  props: {
    /**
     * 提供三种背景样式
     * @values true,false,noOpacity
     *
     */
    background: {
      type: [Boolean , String],
      default: true,
    },
    title: {
      type: String,
      default: ''
    },
  },
  computed: {
    bgCls() {
      if (this.background === true) {
        return 'bg-color';
      } else if (this.background === false) {
        return 'no-bg-color';
      // } else if (this.background === 'noOpacity') {
      //   return 'no-opacity-bg-color';
      }
    },
  },
};
</script>
