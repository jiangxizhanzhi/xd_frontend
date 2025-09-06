<template>
  <type-form :id="id" />
</template>
<script>
import TypeForm from './type_form.vue';
import _ from 'lodash';
export default {
  components: {
    TypeForm,
  },
  computed: {
    id() {
      return _.get(this, '$route.params.typeId');
    },
  },
};
</script>
