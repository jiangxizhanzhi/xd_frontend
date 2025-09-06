<template>
  <!-- 评估算法编辑 -->
  <indicators-form :resourceId="$route.params.resource_id"> </indicators-form>
</template>

<script>
import IndicatorsForm from './components/indicators-form';
export default {
  name: 'IndicatorsEdit',
  components: {
    IndicatorsForm,
  },
};
</script>

<style scoped></style>
