<template>
  <cb-search-table
    :cols="cols"
    url="/devops/cluster/monitor/virtual-real-switch-state/"
    row-key="resource_id"
    baseURL="/api/mp"
    :hidePaginOnDemand="true"
    :searchBarBg="false"
  >
    <template v-slot:state="scope">
      <div>
        <cb-button
          type="text"
          colorType="green"
          v-if="scope.data.state === 'up'"
          >{{ scope.data.state }}</cb-button
        >
        <cb-button
          type="text"
          colorType="red"
          v-if="scope.data.state === 'down'"
          >{{ scope.data.state }}</cb-button
        >
      </div>
    </template>
  </cb-search-table>
</template>

<script>
import _ from 'lodash';
export default {
  data() {
    return {
      cols: [],
    };
  },
  created() {
    const that = this;

    that.cols = [
      {
        label: this.$t('systemOperation.cloudPlatform.switchName'),
        prop: 'name',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.manageIp'),
        prop: 'management_ip',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.nodeMange'),
        slot: 'state',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.totalPort'),
        prop: 'ports',
      },
      {
        label: this.$t('systemOperation.cloudPlatform.usedPort'),
        prop: 'used_ports',
      },
    ];
  },
  mounted() {},
  methods: {},
};
</script>
