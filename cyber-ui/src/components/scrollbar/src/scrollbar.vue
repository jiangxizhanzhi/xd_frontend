<template>
  <div class="cb-scrollbar" :class="clsComputed" :style="{ height }">
    <Scrollbar ref="cbScrollbarRef"><slot></slot></Scrollbar>
  </div>
</template>

<script>
import { Scrollbar } from 'element-ui';
/**
 * Scrollbar 示例
 * @displayName cb-scrollbar
 */
export default {
  name: 'CbScrollbar',
  components: {
    Scrollbar,
  },
  props: {
    /**
     * 是否出现横向滑动条
     *
     */
    overflowX: {
      type: Boolean,
      default: false,
    },
    /**
     * 高度
     *
     */
    height: {
      type: String,
      default: '100%',
    },
  },
  data() {
    return {};
  },
  computed: {
    clsComputed() {
      return this.overflowX ? 'overflow-x-enable' : 'overflow-x-disable';
    },
  },
  watch: {},
  methods: {
    update() {
      this.$refs.cbScrollbarRef.update();
    },
  },
};
</script>
