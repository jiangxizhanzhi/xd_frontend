<template>
  <vuln-form url="/admin/vuln/patch/" :resource-id="resourceId"></vuln-form>
</template>

<script>
import VulnForm from './components/vuln-form.vue';
export default {
  name: 'VulnWebHoleEdit',
  components: {
    VulnForm,
  },
  data() {
    return {
      resourceId: this.$route.params.resource_id,
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
