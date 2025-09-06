<template>
  <ability-form :id="id" />
</template>
<script>
import abilityForm from '../components/ability-database-form.vue';
import _ from 'lodash';
export default {
  components: {
    abilityForm,
  },
  computed: {
    id() {
      return _.get(this, '$route.params.abilityId');
    },
  },
};
</script>
