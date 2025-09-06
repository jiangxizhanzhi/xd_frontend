<template>
  <exercise-set-form :id="id" />
</template>

<script>
import ExerciseSetForm from './form.vue';
import _ from 'lodash';
export default {
  components: {
    ExerciseSetForm,
  },
  computed: {
    id() {
      const id = _.get(this, '$route.params.id');
      return id;
    },
  },
};
</script>

<style scoped lang="scss"></style>
