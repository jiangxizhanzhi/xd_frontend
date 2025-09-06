<template>
  <div class="vm-tab">
    <cb-search-table
      :fetchPromise="fetchPromise"
      :cols="columns"
      :background="true"
      :searchBarBg="false"
    >
    </cb-search-table>
  </div>
</template>
<script>
import Utils from '@/utils/utils';
import { getFloatIp } from '@/api/system-op.ts';
export default {
  data() {
    return {};
  },
  created() {
    const that = this;

    that.columns = [
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.floatIp.fixedIp',
        ),
        prop: 'fixed_ip_address',
        sort: 'fixed_ip_address',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.floatIp.FloatIp',
        ),
        prop: 'float_ip_address',
        sort: 'float_ip_address',
      },
      {
        label: this.$t('systemOperation.common.Status'),
        prop: 'status',
      },
      {
        label: this.$t('systemOperation.common.Created'),
        getData(row) {
          return Utils.formatDate(row.created_at);
        },
      },
    ];
  },
  methods: {
    fetchPromise(queryData, option) {
      const that = this;
      return new Promise((resolve) => {
        getFloatIp(queryData).then((resp) => {
          resolve(resp);
        });
      });
    },
  },
};
</script>
