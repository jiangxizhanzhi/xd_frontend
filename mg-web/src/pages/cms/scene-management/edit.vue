<template>
  <detail :id="$route.params.id" />
</template>

<script>
import Detail from './components/detail.vue';
export default {
  components: {
    Detail,
  },
};
</script>

<style lang="scss" scoped></style>
