<template>
  <course-form :id="id" />
</template>
<script>
import CourseForm from './course-form.vue';
import _ from 'lodash';
export default {
  components: {
    CourseForm,
  },
  computed: {
    id() {
      const id = _.get(this, '$route.params.courseId');
      return id;
    },
  },
};
</script>
