<template>
  <exercises-form :id="id" />
</template>
<script>
import ExercisesForm from './exercises-form.vue';
import _ from 'lodash';
export default {
  components: {
    ExercisesForm,
  },
  computed: {
    id() {
      const id = _.get(this, '$route.params.exercisesId');
      return id;
    },
  },
};
</script>
<style scoped lang="scss"></style>
