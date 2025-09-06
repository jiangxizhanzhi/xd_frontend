<template>
  <!-- 指标项管理编辑 -->
  <model-form :resourceId="$route.params.resource_id"> </model-form>
</template>

<script>
import ModelForm from './components/model-form';
export default {
  name: 'ModelEdit',
  components: {
    ModelForm,
  },
};
</script>

<style scoped></style>
