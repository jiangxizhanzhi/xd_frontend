<template>
  <div class="cb-form-block">
    <form-title v-if="title" :title="title"></form-title>
    <slot> </slot>
  </div>
</template>

<script>
import FormTitle from '../../form-title';
/**
 * @displayName cb-form-block
 * @classify Form/表单
 */
export default {
  name: 'CbFormBlock',
  components: { FormTitle },
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },

  methods: {},
};
</script>
