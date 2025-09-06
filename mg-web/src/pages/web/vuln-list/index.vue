<template>
  <cb-inner-page :background="false">
    <vuln-list storage-key="vuln-search-params" @detail="goDetail"></vuln-list>
  </cb-inner-page>
</template>

<script>
import VulnList from './components/list.vue';

import _ from 'lodash';
export default {
  name: 'VulnWebIndex',
  components: {
    VulnList,
  },
  data() {
    return {};
  },

  methods: {
    goDetail(resource_id) {
      this.$router.push({
        name: 'vuln-detail',
        params: {
          resource_id: resource_id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
