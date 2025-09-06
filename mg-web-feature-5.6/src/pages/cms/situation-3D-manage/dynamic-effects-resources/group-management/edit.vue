<template>
  <detail :id="$route.params.id" />
</template>
<script>
import Detail from './detail.vue';
export default {
  components: {
    Detail,
  },
};
</script>
