<template>
  <traffic-detail :id="{ id: $route.params.resource_id }" />
</template>

<script>
import TrafficDetail from './components/traffic_detail';
export default {
  name: 'DynamicTrafficUpdate',
  components: {
    TrafficDetail,
  },
};
</script>

<style scoped></style>
