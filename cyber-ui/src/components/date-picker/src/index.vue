<template>
  <date-picker
    ref="datePickerRef"
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    @input="(value) => $emit('input', value)"
  ></date-picker>
</template>

<script>
/**
 * @displayName cb-date-picker 日期选择器
 * @classify Form/表单
 */

import { DatePicker } from 'element-ui';
export default {
  name: 'CbDatePicker',
  components: {
    DatePicker,
  },
  props: {
    value: {},
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  beforeDestroy() {
    const popperElm = this.$refs.datePickerRef.popperElm;
    if (
      popperElm &&
      popperElm.parentNode === document.querySelector('micro-app-body')
    ) {
      popperElm.parentNode.removeChild(popperElm);
    }
  },
  watch: {},
  methods: {},
};
</script>
