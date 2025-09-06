<template>
  <tool-detail :id="$route.params.id" />
</template>

<script>
import ToolDetail from './detail';

export default {
  name: 'ToolEdit',
  components: {
    ToolDetail,
  },
};
</script>

<style scoped></style>
