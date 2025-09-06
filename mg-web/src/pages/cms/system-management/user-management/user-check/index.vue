<template>
  <user-form :id="$route.query.id" :action-type="2"></user-form>
</template>

<script>
import UserForm from '../components/user-form';
export default {
  name: 'UserCheck',
  components: {
    UserForm,
  },
  data() {
    return {};
  },
};
</script>

<style></style>
