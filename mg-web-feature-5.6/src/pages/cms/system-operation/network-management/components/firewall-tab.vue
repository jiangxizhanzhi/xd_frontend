<template>
  <div>
    <cb-search-table
      :cols="columns"
      url="/devops/cluster/firewall/page"
      baseURL="/api/mp"
      :searchBarBg="false"
    >
    </cb-search-table>
  </div>
</template>
<script>
import { getSceneType } from '@/api/system-op.ts';
export default {
  data() {
    return {
      sceneTypes: {},
    };
  },
  created() {
    this.getSceneTypes();
    this.columns = [
      {
        label: this.$t('systemOperation.views.clusterManagement.firewall.name'),
        prop: 'name',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.firewall.ingressName',
        ),
        prop: 'ingress_firewall_policy',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.firewall.engressName',
        ),
        prop: 'egress_firewall_policy',
      },
      {
        label: this.$t('systemOperation.common.Description'),
        prop: 'description',
      },
      {
        label: this.$t('systemOperation.common.Status'),
        prop: 'status',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.firewall.sceneName',
        ),
        prop: 'scene_name',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.firewall.sceneType',
        ),
        getData: (row) => {
          return this.sceneTypes[row.reference_type];
        },
      },
    ];
  },
  methods: {
    getSceneTypes() {
      getSceneType().then((res) => {
        const tempdata = _.get(res, 'data.data', []);
        tempdata.forEach((item) => {
          this.$set(this.sceneTypes, item.code, item.name);
        });
      });
    },
  },
};
</script>
