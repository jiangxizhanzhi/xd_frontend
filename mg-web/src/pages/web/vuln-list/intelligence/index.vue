<template>
  <cb-inner-page :background="false">
    <intelligence-list
      storage-key="vuln-search-params"
      @detail="goDetail"
    ></intelligence-list>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import IntelligenceList from './list.vue';
export default {
  name: 'Index',
  components: {
    IntelligenceList,
  },
  data() {
    return {};
  },

  methods: {
    goDetail(resource_id) {
      this.$router.push({
        name: 'vuln-intelligence-detail',
        params: {
          resource_id: resource_id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
