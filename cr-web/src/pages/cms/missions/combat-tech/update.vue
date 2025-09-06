<template>
  <combat-detail :id="$route.params.resource_id" />
</template>

<script>
import CombatDetail from './components/detail';
export default {
  name: 'CombatTechUpdate',
  components: {
    CombatDetail,
  },
};
</script>

<style scoped></style>
