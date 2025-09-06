<template>
  <career-system-form :frameId="$route.query.frameWorkId"></career-system-form>
</template>

<script>
import CareerSystemForm from '../components/CareerSystemForm.vue';
export default {
  name: 'CareerAdd',
  components: {
    CareerSystemForm,
  },
  data() {
    return {};
  },
};
</script>

<style></style>
