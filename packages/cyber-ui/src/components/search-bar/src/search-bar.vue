<template>
  <div
    class="cb-search-bar"
    v-if="$slots.filter || $slots.searchRightArea || $slots.search"
  >
    <div class="cb-search__filter">
      <!-- @slot flex两边对齐布局，左边部分 -->
      <slot name="filter"></slot>
    </div>
    <div class="cb-search__right-area">
      <!-- @slot flex两边对齐布局，右边部分 -->
      <slot name="searchRightArea"></slot>
    </div>
    <div class="cb-search__search">
      <!-- @slot 新的一行 -->
      <slot name="search"></slot>
    </div>
  </div>
</template>
<script>
/**
 * @displayName cb-search-bar 搜索栏布局
 * @classify Layout/布局
 */
export default {
  name: 'CbSearchBar',
  props: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
