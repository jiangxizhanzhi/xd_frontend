<template>
  <category-detail :id="$route.params.id" />
</template>

<script>
import CategoryDetail from './components/detail';
export default {
  name: 'CategoryUpdate',
  components: {
    CategoryDetail,
  },
};
</script>

<style scoped></style>
