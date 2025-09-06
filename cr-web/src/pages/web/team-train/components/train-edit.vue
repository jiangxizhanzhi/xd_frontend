<template>
  <detail :id="$route.params.id" />
</template>

<script>
import Detail from './train-detail';
export default {
  name: 'Edit',
  components: { Detail },
};
</script>

<style lang="scss" scoped></style>
