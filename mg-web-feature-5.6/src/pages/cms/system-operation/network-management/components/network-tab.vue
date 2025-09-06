<template>
  <div class="vm-tab">
    <cb-search-table
      :fetchPromise="fetchPromise"
      :cols.sync="columns"
      :background="true"
      :searchBarBg="false"
    >
      <template v-slot:detail="scope">
        <cb-button
          type="text"
          button-type="detail"
          @click="showDetail(scope.data)"
        >
          {{ $t('systemOperation.views.clusterManagement.network.detail') }}
        </cb-button>
      </template>
    </cb-search-table>
    <cb-dialog
      :title="$t('systemOperation.views.clusterManagement.network.detail')"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <cb-row>
        <cb-col
          class="col-item"
          v-for="(item, index) in Object.keys(detailData)"
          :key="index"
        >
          <span>"{{ item }}": "{{ detailData[item] }}", </span>
        </cb-col>
      </cb-row>
    </cb-dialog>
  </div>
</template>
<script>
import Utils from '@/utils/utils';
import { getNetwork, getSceneType } from '@/api/system-op.ts';
export default {
  data() {
    return {
      columns: [],
      dialogVisible: false,
      detailData: {
        id: '',
        cidr: '',
        gateway_ip: '',
        used_IPs: '',
        free_IPs: '',
        host_sum: '',
        'network_IO(kbps)': '',
      },
      sceneTypes: {}, // 场景类型数据
    };
  },
  created() {
    this.getSceneTypes();
    const that = this;

    that.columns = [
      {
        label: this.$t('systemOperation.views.clusterManagement.network.name'),
        prop: 'name',
        width: 300,
        resizable: true,
      },

      {
        label: this.$t(
          'systemOperation.views.clusterManagement.network.networkType',
        ),
        prop: 'network_type',
        width: 160,
      },
      {
        label: this.$t('systemOperation.common.Status'),
        prop: 'status',
        width: 160,
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.network.sceneName',
        ),
        prop: 'scene_name',
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.network.sceneType',
        ),
        getData: (row) => {
          return this.sceneTypes[row.reference_type];
        },
      },
      {
        label: this.$t(
          'systemOperation.views.clusterManagement.network.detail',
        ),
        slot: 'detail',
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
        getNetwork(queryData).then((resp) => {
          resolve(resp);
        });
      });
    },
    showDetail(data) {
      this.detailData.id = data.subnets[0].id;
      this.detailData.cidr = data.subnets[0].cidr;
      this.detailData.gateway_ip = data.subnets[0].gateway_ip;
      this.detailData.used_IPs = data.subnets[0].used_ips;
      this.detailData.free_IPs = data.subnets[0].free_ips;
      this.detailData.host_sum = data.node_num;
      this.detailData[
        'network_IO(kbps)'
      ] = `${data.download_speed}/${data.upload_speed}`;
      this.dialogVisible = true;
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
<style lang="scss" scoped>
.col-item {
  margin-bottom: 15px;
}
</style>
