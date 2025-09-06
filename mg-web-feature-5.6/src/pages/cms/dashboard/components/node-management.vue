<template>
  <cb-search-table
    class="nodeManage"
    :cols.sync="cols"
    url="/devops/cluster/monitor/hypervisor/page"
    ref="nodeManageRef"
    baseURL="/api/mp"
    :background="true"
    :searchBarBg="false"
  >
    <template v-slot:status="scope">
      <span v-if="scope.data.status == 'enabled'">{{
        $t('dashboard.enable')
      }}</span>
      <span v-else>{{ $t('dashboard.notEnable') }}</span>
    </template>
    <template v-slot:state="scope">
      <div
        :class="
          scope.data.state == 'up'
            ? 'circle color-running'
            : 'circle color-disable'
        "
      ></div>
      <div>
        <span v-if="scope.data.state == 'up'">{{
          $t('dashboard.normal')
        }}</span>
        <span v-else>{{ $t('dashboard.exception') }}</span>
      </div>
    </template>
    <template v-slot:cpu_percent="scope">
      <div>
        <span
          v-if="scope.data.cpu_percent || scope.data.cpu_percent === 0"
          :class="getStyle(scope.data.cpu_percent)"
          >{{ scope.data.cpu_percent }}%</span
        >
        <span v-else>-</span>
      </div>
    </template>
    <template v-slot:ram_percent="scope">
      <div>
        <span
          v-if="scope.data.ram_percent || scope.data.ram_percent === 0"
          :class="getStyle(scope.data.ram_percent)"
          >{{ scope.data.ram_percent }}%</span
        >
        <span v-else>-</span>
      </div>
    </template>
    <template v-slot:disk_percent="scope">
      <div>
        <span
          v-if="scope.data.disk_percent || scope.data.disk_percent === 0"
          :class="getStyle(scope.data.disk_percent)"
          >{{ scope.data.disk_percent }}%</span
        >
        <span v-else>-</span>
      </div>
    </template>
  </cb-search-table>
</template>

<script>
export default {
  name: 'nodeManage',
  data() {
    return {
      cols: [
        {
          label: this.$t('dashboard.nodeName'),
          prop: 'name',
          width: 200,
          resizable: true,
        },
        {
          label: this.$t('dashboard.nodeIp'),
          prop: 'ip',
        },
        {
          label: this.$t('dashboard.virtualCpu'),
          slot: 'cpu_percent',
        },

        {
          label: this.$t('dashboard.virtualRam'),
          slot: 'ram_percent',
        },
        {
          label: this.$t('dashboard.virtualDisk'),
          slot: 'disk_percent',
        },
        {
          label: this.$t('dashboard.vmCount'),
          prop: 'total_instances',
        },
        {
          label: this.$t('dashboard.containerCount'),
          prop: 'total_containers',
        },
        {
          label: this.$t('dashboard.computeService'),
          slot: 'status',
        },
        {
          label: this.$t('dashboard.nodeStatus'),
          slot: 'state',
        },
      ],
    };
  },
  created() {},
  methods: {
    getStyle(data) {
      if (data > 90) {
        return 'high';
      } else {
        return '';
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/style/dashboard/components/node-management.scss';
.dismissed {
  position: relative;
  top: 1px;
}
.circle {
  float: left;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  margin-right: 5px;
}
.color-disable {
  background-color: var(--red-color);
}
.color-running {
  background-color: var(--green-color);
}
</style>
