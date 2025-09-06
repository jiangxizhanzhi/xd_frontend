<template>
  <skill-form :id="id" />
</template>
<script>
import skillForm from '../components/skill-database-form.vue';
export default {
  components: {
    skillForm,
  },
  computed: {
    id() {
      return _.get(this, '$route.params.libraryId');
    },
  },
};
</script>
