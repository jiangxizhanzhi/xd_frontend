<template>
  <job-database-form :id="$route.params.jobId" />
</template>
<script>
import JobDatabaseForm from '../components/job-database-form.vue';
export default {
  name: 'JobDatabaseEdit',
  components: {
    JobDatabaseForm,
  },
};
</script>
