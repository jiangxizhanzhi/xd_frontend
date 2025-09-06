<template>
  <detail :editId="$route.params.id" />
</template>

<script>
import Detail from './components/detail';
export default {
  name: 'Edit',
  components: { Detail },
};
</script>

<style scoped></style>
