<template>
  <Cascader ref="cascaderRef" v-bind="$attrs" v-on="$listeners">
    <template slot-scope="{ node, data }">
      <slot :data="data" :node="node"></slot>
    </template>
  </Cascader>
</template>

<script>
/**
 * @displayName cb-cascader 级联选择器
 * @classify Form/表单
 */
import { Cascader } from 'element-ui';
export default {
  name: 'CbCascader',
  components: {
    Cascader,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {
    const popperElm = this.$refs.cascaderRef.popperElm;
    if (
      popperElm &&
      popperElm.parentNode &&
      popperElm.parentNode === document.querySelector('micro-app-body')
    ) {
      popperElm.parentNode.removeChild(popperElm);
    }
  },
  watch: {},
  methods: {
    getCheckedNodes(...args) {
      return this.$refs.cascaderRef.getCheckedNodes(...args);
    },
  },
};
</script>
