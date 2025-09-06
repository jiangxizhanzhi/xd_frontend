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
import { getRoute, getSceneType } from '@/api/system-op.ts';
export default {
  data() {
    return {
      sceneTypes: {}, // 场景类型
    };
  },
  created() {
    this.getSceneTypes();
    const that = this;

    that.columns = [
      {
        label: this.$t('systemOperation.views.clusterManagement.route.name'),
        prop: 'name',
        sort: 'name',
      },
      {
        label: this.$t('systemOperation.common.Status'),
        prop: 'status',
        width: 200,
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.route.sceneName',
        ),
        prop: 'scene_name',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.route.sceneType',
        ),
        getData: (row) => {
          return this.sceneTypes[row.reference_type];
        },
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
        getRoute(queryData).then((resp) => {
          resolve(resp);
        });
      });
    },
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
