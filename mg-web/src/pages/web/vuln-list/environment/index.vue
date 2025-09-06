<template>
  <cb-inner-page :background="false">
    <env-list storage-key="vuln-search-params" @detail="goDetail"></env-list>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import EnvList from './list.vue';
export default {
  name: 'EnvIndex',
  components: {
    EnvList,
  },
  data() {
    return {};
  },

  methods: {
    goDetail(resource_id) {
      this.$router.push({
        name: 'vuln-env-detail',
        params: {
          resource_id: resource_id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
