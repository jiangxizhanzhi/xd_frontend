<template>
  <detail :id="{ id: $route.params.resource_id }" />
</template>

<script>
import Detail from './components/detail';
export default {
  name: 'TrafficAnalyseEdit',
  components: {
    Detail,
  },
};
</script>

<style scoped></style>
