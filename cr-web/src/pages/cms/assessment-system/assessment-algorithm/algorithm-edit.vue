<template>
  <!-- 评估算法编辑 -->
  <algorithm-from :id="$route.params.resource_id"> </algorithm-from>
</template>

<script>
import AlgorithmFrom from './components/algorithm-form';
export default {
  name: 'AlgorithmEdit',
  components: {
    AlgorithmFrom,
  },
};
</script>

<style scoped></style>
