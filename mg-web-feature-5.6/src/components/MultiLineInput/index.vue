<template>
  <div v-if="exists" class="elc-form-item elc-form-item-multi-line-input">
    <elc-form-multi-line-input
      :ref="targetName"
      :value.sync="val"
      :empty="elOptions.empty"
      :can-add-remove="elOptions.canAddRemove"
      :fixed-count="elOptions.fixedCount"
      :deep-watch="elOptions.deepWatch"
      @add-line="addLine"
      @remove-line="removeLine"
    >
      <template v-slot="sp">
        <slot
          :i="sp.i"
          :lineDatas="sp.data"
          :line="sp.line"
          :data="model"
          :item="item"
        >
          <cb-input v-model="sp.data[sp.i]" />
        </slot>
      </template>
    </elc-form-multi-line-input>
  </div>
</template>

<script>
import ElcFormMultiLineInput from './src/MultiLineInput';
import ItemMixin from './src/Mixin/ItemMixin';

export default {
  name: 'MultiLineInput',
  components: {
    ElcFormMultiLineInput,
  },
  mixins: [ItemMixin],
  computed: {
    addLine() {
      return this.elOptions.addLine || this.emptyFunc;
    },
    removeLine() {
      return this.elOptions.removeLine || this.emptyFunc;
    },
  },
  watch: {
    fromVal() {
      if (this.$itemTarget) {
        this.$itemTarget.init(this.val);
      }
    },
  },
};
</script>

<style lang="scss"></style>
