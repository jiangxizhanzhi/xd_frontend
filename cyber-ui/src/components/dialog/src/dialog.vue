<template>
  <div class="cb-dialog">
    <Dialog
      v-dialog-drag
      v-bind="$attrs"
      v-on="$listeners"
      :visible.sync="dialogVisible"
      @update:visible="updateVisible"
      v-if="dialogVisible"
      :close-on-click-modal="false"
      :class="fitWidth ? 'width-fit-content' : ''"
      center
    >
      <div
        v-loading="loading"
        class="cb-dialog-body"
        :style="{ height, 'max-height': maxHeight }"
      >
        <cb-scrollbar v-if="height"><slot></slot></cb-scrollbar>
        <template v-else><slot></slot></template>
      </div>
      <template v-slot:title> <slot name="title"></slot> </template>
      <template v-slot:footer> <slot name="footer"></slot> </template>
    </Dialog>
  </div>
</template>

<script>
import { Dialog } from 'element-ui';
// import { setParentMask } from '../../../utils';
import CbScrollbar from '../../scrollbar';
/**
 * @displayName cb-dialog 对话框
 * @classify View/视图
 */
export default {
  name: 'CbDialog',
  inheritAttrs: false,
  // directives: { drag },
  components: {
    Dialog,
    CbScrollbar,
  },
  props: {
    /**
     * 是否显示 Dialog，需要.sync 修饰符。隐藏时销毁内容
     *
     */
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * 最大宽度 fit-content
     *
     */
    fitWidth: {
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
      dialogVisible: this.visible,
    };
  },
  watch: {
    visible: {
      handler(val) {
        //setParentMask(val);
        this.dialogVisible = val;
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    //setParentMask(false);
  },
  methods: {
    updateVisible() {
      this.$emit('update:visible', this.dialogVisible);
    },
  },
};
</script>
