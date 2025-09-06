<template>
  <paper-form :resource-id="resourceId"></paper-form>
</template>

<script>
import PaperForm from './components/paper-form.vue';
export default {
  components: {
    PaperForm,
  },
  data() {
    return {};
  },
  computed: {
    resourceId() {
      return _.get(this, '$route.params.resource_id', '');
    },
  },
};
</script>

<style scoped lang="scss"></style>
