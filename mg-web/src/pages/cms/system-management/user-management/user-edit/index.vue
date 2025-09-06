<template>
  <user-form :id="$route.query.id" :action-type="1"></user-form>
</template>

<script>
import UserForm from '../components/user-form';
export default {
  name: 'UserEdit',
  components: {
    UserForm,
  },
  data() {
    return {};
  },
};
</script>

<style></style>
