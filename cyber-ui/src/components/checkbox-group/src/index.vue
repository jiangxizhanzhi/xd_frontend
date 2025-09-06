
<template>
  <div
    class="cb-checkbox-group"
    role="group"
    aria-label="checkbox-group"
    :class="{ 'cb-checkbox-horizontal': direction === 'horizontal' }"
  >
    <slot></slot>
  </div>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter';
/**
 * @displayName cb-checkbox-group 多选按钮组
 * @ignore
 */
export default {
  name: 'CbCheckboxGroup',

  mixins: [Emitter],
  componentName: 'ElCheckboxGroup',

  inject: {
    elFormItem: {
      default: '',
    },
  },

  props: {
    /**
     * 绑定值
     *
     */
    value: {},
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 可被勾选的 checkbox 的最小数量
     */
    min: Number,
    /**
     * 可被勾选的 checkbox 的最大数量
     */
    max: Number,
    /**
     * 多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效
     * @values medium,small,mini
     */
    size: String,
    /**
     * 按钮形式的 Radio 激活时的填充色和边框色
     */
    fill: String,
    /**
     * 钮形式的 Radio 激活时的文本颜色
     */
    textColor: String,
    /**
     * checkbox组方向
     * @values horizontal/vertical
     */
    direction: {
      type: String,
      default: 'horizontal',
    },
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    checkboxGroupSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
  },

  watch: {
    value(value) {
      this.dispatch('ElFormItem', 'el.form.change', [value]);
    },
  },
};
</script>
