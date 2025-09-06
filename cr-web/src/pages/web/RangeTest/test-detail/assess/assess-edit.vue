<template>
  <!-- 评估编辑 -->
  <assess-form :id="$route.params.resource_id"> </assess-form>
</template>

<script>
import AssessForm from './components/assess-form';
export default {
  name: 'AssessEdit',
  components: {
    AssessForm,
  },
};
</script>

<style scoped></style>
