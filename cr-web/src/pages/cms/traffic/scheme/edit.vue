<template>
  <traffic-scheme-detail :id="{ id: $route.params.resource_id }" />
</template>

<script>
import TrafficSchemeDetail from './detail';

export default {
  name: 'TrafficSchemeEdit',
  components: {
    TrafficSchemeDetail,
  },
};
</script>

<style scoped></style>
