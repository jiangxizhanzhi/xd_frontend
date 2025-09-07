<template>
  <div class="cb-form-title">
    <span>{{ title }}</span>
  </div>
</template>

<script>
/**
 * @displayName cb-form-title
 * @classify Form/表单
 */
export default {
  name: 'CbFormTitle',
  components: {},
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
