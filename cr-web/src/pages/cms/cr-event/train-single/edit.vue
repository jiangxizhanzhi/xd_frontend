<template>
  <train-single-detail :id="$route.params.id" />
</template>

<script>
import TrainSingleDetail from './detail';
export default {
  name: 'Edit',
  components: { TrainSingleDetail },
};
</script>

<style scoped></style>
