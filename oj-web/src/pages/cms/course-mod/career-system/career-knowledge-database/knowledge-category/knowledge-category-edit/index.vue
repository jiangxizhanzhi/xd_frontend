<template>
  <knowledge-category-form :id="$route.params.id" />
</template>
<script>
import KnowledgeCategoryForm from '../components/knowledge-category-form.vue';
export default {
  name: 'KnowledgeCategoryEdit',
  components: {
    KnowledgeCategoryForm,
  },
};
</script>
