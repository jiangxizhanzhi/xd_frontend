<template>
  <detail :id="{ id: $route.params.id }" />
</template>

<script>
import Detail from './components/detail';
export default {
  components: {
    Detail,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped></style>
