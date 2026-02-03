<template>
  <div>
    <Drawer
      v-bind="$attrs"
      v-on="$listeners"
      :visible.sync="drawerVisible"
      @update:visible="updateVisible"
      custom-class="cb-drawer"
      destroy-on-close
    >
      <div
        v-loading="loading"
        class="cb-drawer-body"
        :style="{ height, 'max-height': maxHeight }"
      >
        <cb-scrollbar v-if="height"><slot></slot></cb-scrollbar>
        <template v-else><slot></slot></template>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { Drawer } from 'element-ui';
import CbScrollbar from '../../scrollbar';
/**
 * @displayName cb-drawer 抽屉
 * @classify View/视图
 */
export default {
  name: 'CbDrawer',
  inheritAttrs: false,
  components: {
    Drawer,
    CbScrollbar,
  },
  props: {
    /**
     * 是否显示 Drawer，需要.sync 修饰符。隐藏时销毁内容
     *
     */
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * 最大高度
     *
     */
    maxHeight: {
      type: String,
      default: '',
    },
    /**
     * 内容高度，设置后内容超出自动显示滚动条
     *
     */
    height: {
      type: String,
      default: '',
    },
    /**
     * 内容区域loading
     *
     */
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
    };
  },
  watch: {
    visible: {
      handler(val) {
        this.drawerVisible = val;
      },
      immediate: true,
    },
  },
  beforeDestroy() {},
  methods: {
    updateVisible() {
      this.$emit('update:visible', this.drawerVisible);
    },
  },
};
</script>
