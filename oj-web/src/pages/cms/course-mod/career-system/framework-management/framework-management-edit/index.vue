<template>
  <framework-management-form :id="id" />
</template>
<script>
import frameworkManagementForm from '../components/framework-management-form.vue';
export default {
  components: {
    frameworkManagementForm,
  },
  computed: {
    id() {
      return _.get(this, '$route.params.frameworkId');
    },
  },
};
</script>
