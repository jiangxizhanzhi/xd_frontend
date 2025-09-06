<template>
  <cb-inner-page :background="false">
    <analysis-list :storage-key="storageKey" live-search @detail="goDetail">
    </analysis-list>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import AnalysisList from './list.vue';

export default {
  name: 'LiveVulnAnalysisIndex',
  components: {
    AnalysisList,
  },
  data() {
    return {
      storageKey: 'live-vuln-search-params',
    };
  },
  methods: {
    goDetail(resource_id) {
      this.$router.push({
        name: 'living-vuln-analysis-detail',
        params: {
          resource_id: resource_id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
