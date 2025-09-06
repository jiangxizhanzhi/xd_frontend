<template>
  <div>
    <cb-search-table
      :cols="columns"
      url="/devops/cluster/openflow/page"
      baseURL="/api/mp"
      :searchBarBg="false"
    >
    </cb-search-table>
  </div>
</template>
<script>
export default {
  created() {
    this.columns = [
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.flowTable.bridge',
        ),
        prop: 'ovs_name',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.flowTable.hosts',
        ),
        prop: 'hostname',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.flowTable.table',
        ),
        prop: 'table',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.flowTable.packageNum',
        ),
        prop: 'npackets',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.flowTable.priority',
        ),
        prop: 'open_flow_match_condition_vo',
        getData: (row, open_flow_match_condition_vo) => {
          return open_flow_match_condition_vo.priority;
        },
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.flowTable.actions',
        ),
        prop: 'actions',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.flowTable.freetime',
        ),
        prop: 'duration',
      },
    ];
  },
};
</script>
