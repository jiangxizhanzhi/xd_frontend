<template>
  <system-management-form :id="id" />
</template>
<script>
import systemManagementForm from '../components/system-management-form.vue';
export default {
  components: {
    systemManagementForm,
  },
  computed: {
    id() {
      return _.get(this, '$route.params.systemId');
    },
  },
};
</script>
