<template>
  <cb-inner-page :background="false">
    <vuln-list
      :storage-key="storageKey"
      live-search
      @detail="goDetail"
    ></vuln-list>
  </cb-inner-page>
</template>

<script>
import VulnList from '../vuln-list/components/list.vue';

import _ from 'lodash';

export default {
  name: 'LiveVulnIndex',
  components: {
    VulnList,
  },
  data() {
    return {
      storageKey: 'live-vuln-search-params',
    };
  },
  methods: {
    goDetail(resource_id) {
      this.$router.push({
        name: 'living-vuln-detail',
        params: {
          resource_id: resource_id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
