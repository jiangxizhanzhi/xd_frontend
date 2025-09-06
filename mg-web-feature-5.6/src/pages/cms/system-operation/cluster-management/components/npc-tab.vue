<template>
  <div class="vm-tab pad20">
    <cb-search-table
      :fetchPromise="fetchPromise"
      :cols="columns"
      :background="true"
    >
    </cb-search-table>
  </div>
</template>
<script>
import { getVpc } from '@/api/system-op.ts';
import Utils from '@/utils/utils';
export default {
  created() {
    const that = this;

    that.columns = [
      {
        label: 'id',
        prop: 'id',
        width: 220,
      },
      {
        label: this.$t('systemOperation.views.clusterManagement.vm.serverIp'),
        prop: 'ip',
        width: 220,
      },
      {
        label: this.$t('systemOperation.common.Status'),
        prop: 'status',
        width: 160,
      },
      {
        label: this.$t('systemOperation.common.Created'),
        getData(row) {
          return Utils.formatDate(row.created_at);
        },
        width: 200,
      },
    ];
  },
  methods: {
    fetchPromise(queryData, option) {
      const that = this;
      return new Promise((resolve) => {
        getVpc(queryData).then((resp) => {
          resolve(resp);
        });
      });
    },
  },
};
</script>
