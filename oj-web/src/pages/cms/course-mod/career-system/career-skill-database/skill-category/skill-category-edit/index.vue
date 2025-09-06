<template>
  <skill-category-form :id="id" />
</template>
<script>
import skillCategoryForm from '../components/skill-category-form.vue';
export default {
  components: {
    skillCategoryForm,
  },
  computed: {
    id() {
      return _.get(this, '$route.params.systemId');
    },
  },
};
</script>
