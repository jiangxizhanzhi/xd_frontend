<template>
  <knowledge-database-form :id="$route.params.libraryId" />
</template>
<script>
import KnowledgeDatabaseForm from '../components/knowledge-database-form.vue';
export default {
  name: 'KnowledgeDatabaseEdit',
  components: {
    KnowledgeDatabaseForm,
  },
};
</script>
