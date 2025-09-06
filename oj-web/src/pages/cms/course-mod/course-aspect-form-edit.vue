<template>
  <aspect-form :id="id"></aspect-form>
</template>
<script>
import _ from 'lodash';
import AspectForm from './course-aspect-form.vue';
export default {
  components: {
    AspectForm,
  },
  computed: {
    id() {
      return _.get(this, '$route.params.aspectId');
    },
  },
};
</script>
