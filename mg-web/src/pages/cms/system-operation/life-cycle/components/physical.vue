<template>
  <div>
    <cb-search-table
      rowKey="id"
      ref="monitorListRef"
      :cols="cols"
      :data.sync="query"
      url="/devops/cluster/xd_source/phy_list"
      baseURL="/api/mp"
      :searchBarBg="true"
      :show-search-btn="false"
    >
      <template v-slot:used_memory="scope">
        <div>{{ `内存总量${scope.data.total_memory.value + scope.data.total_memory.unit}，已使用${scope.data.used_memory.value +
          scope.data.used_memory.unit}` }}</div>
      </template>
      <template v-slot:file_systems="scope">
        <cb-button
          type="text"
          @click="view(scope.data)"
        >查看</cb-button>
      </template>
    </cb-search-table>
    <cb-dialog
      :title="currentName + $t('磁盘')"
      :visible.sync="showDialog"
      width="1000px"
    > <cb-search-table
        :cols="dialogCols"
        :searchBarBg="true"
        :dataSource="fileData"
        :show-search-btn="false"
        :hidePaginOnDemand="true"
      >
        <template v-slot:used_file_system="scope">
          <div>{{ `磁盘总量${scope.data.total_file_system.value +
            scope.data.total_file_system.unit}，已使用${scope.data.used_file_system.value
            +
            scope.data.used_file_system.unit}` }}</div>
        </template>
      </cb-search-table>

    </cb-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      query: {

      },
      currentName: '',
      showDialog: false,
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [{
        label: this.$t('名称'),
        prop: 'node_name',
      },
      {
        label: this.$t('系统名称'),
        prop: 'sys_name',
      },
      {
        label: this.$t('ip'),
        prop: 'instance',
      },
      {
        label: this.$t('cpu使用占比'),
        prop: 'cpu_percent',
      },
      {
        label: this.$t('内存使用'),
        slot: 'used_memory',
        width: 300,
      },
      {
        label: this.$t('磁盘'),
        slot: 'file_systems',
      },
      {
        label: this.$t('厂商名称'),
        prop: 'company_name',
      },
      ],
      fileData: [],
      dialogCols: [
        {
          label: this.$t('磁盘名称'),
          prop: 'name',
        },
        {
          label: this.$t('磁盘使用'),
          slot: 'used_file_system',
        },
      ]
    };
  },
  computed: {

  },
  watch: {},
  mounted() {
  },
  methods: {
    view(data) {
      console.log(data);
      this.currentName = data.node_name;
      this.fileData = data.file_systems;
      this.showDialog = true;
    },
  },
};
</script>
<style lang="scss" scoped></style>
