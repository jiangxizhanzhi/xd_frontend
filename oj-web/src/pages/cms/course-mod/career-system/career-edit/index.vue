<template>
  <career-system-form
    :id="$route.query.id"
    :frameId="$route.query.frameWorkId"
  ></career-system-form>
</template>

<script>
import CareerSystemForm from '../components/CareerSystemForm.vue';
export default {
  name: 'CareerEdit',
  components: {
    CareerSystemForm,
  },
  data() {
    return {};
  },
};
</script>

<style></style>
