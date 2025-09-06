<template>
  <div class="elc-title">
    <left-border-title v-if="type === 'left-border'" :title="title">
      <slot>
        {{ title }}
      </slot>
    </left-border-title>
    <bg-title
      v-else-if="type === 'bg'"
      :title="title"
      :show-check-all="showCheckAll"
      :indeterminate="indeterminate"
      :check-all-value="checkAllValue"
      @checkAllChange="handleCheckAllChange"
    >
      <slot>
        {{ title }}
      </slot>
    </bg-title>
    <template v-else>
      <slot>
        {{ title }}
      </slot>
    </template>
  </div>
</template>

<script>
import LeftBorderTitle from './LeftBorderTitle';
import BgTitle from '@/components/Title/BgTitle';

export default {
  name: 'ElcTitle',
  components: {
    LeftBorderTitle,
    BgTitle,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },

    // 全选按钮相关属性
    showCheckAll: {
      type: Boolean,
      default: false,
    },
    checkAllValue: {
      type: Boolean,
      default: undefined,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handleCheckAllChange(value) {
      this.$emit('checkAllChange', value);
    },
  },
};
</script>
