<template>
  <traffic-detail :id="{ id: $route.params.resource_id }" />
</template>

<script>
import TrafficDetail from './components/traffic_detail';
export default {
  name: 'StaticTrafficUpdate',
  components: {
    TrafficDetail,
  },
};
</script>

<style scoped></style>
