<template>
  <div class="table-content">
    <!-- 流量分析事件页面 -->
    <cb-search-table
      ref="tableRef"
      :scroll="{ y: 385 }"
      :cols="columns"
      :data.sync="model"
      :hidePaginOnDemand="true"
      row-key="resource_id"
      baseURL="/api/mp"
      :url="url"
    >
      <!-- 类型 -->
      <template v-slot:att_ck_type="scope">
        <span :title="scope.data.attack_info.att_ck_type">
          {{ scope.data.attack_info.att_ck_type }}</span
        >
      </template>
      <!-- 类型 attack_type-->
      <template v-slot:attack_type="scope">
        <span :title="scope.data.attack_info.attack_type">
          {{ scope.data.attack_info.attack_type }}</span
        >
      </template>
      <!-- 级别  severity-->
      <template v-slot:severity="scope">
        <span
          v-if="Number(scope.data.attack_info.severity) === 1"
          :title="$t('rbt.high')"
          >{{ $t('rbt.high') }}</span
        >
        <span
          v-if="Number(scope.data.attack_info.severity) === 2"
          :title="$t('rbt.middle')"
          >{{ $t('rbt.middle') }}</span
        >
        <span
          v-if="
            Number(scope.data.attack_info.severity) === 3 ||
            Number(scope.data.attack_info.severity) === 4
          "
          :title="$t('rbt.low')"
          >{{ $t('rbt.low') }}</span
        >
      </template></cb-search-table
    >
  </div>
</template>

<script>
export default {
  props: {
    // 接收场景启动场景id
    controlSceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      timer: null,
      url: '',
      columns: [
        {
          label: this.$t('rbt.time'),
          prop: 'time',
          width: 124,
        },
        {
          label: this.$t('rbt.sourceHost'),
          prop: 'source_node_name',
          width: 130,
        },
        {
          label: this.$t('rbt.destinationHost'),
          prop: 'target_node_name',
          width: 130,
        },
        {
          label: this.$t('rbt.eventType'),
          slot: 'attack_type',
          width: 110,
        },
        {
          label: this.$t('rbt.level'),
          slot: 'severity',
          width: 55,
        },
        {
          label: this.$t('rbt.typeRecord'),
          slot: 'att_ck_type',
          width: 95,
        },
      ],
      model: {
        id: this.controlSceneId, //场景实例id
      },
    };
  },
  created() {
    this.model.id = this.controlSceneId; //场景实例id
    if (this.model.id) {
      this.url = '/cscene/monitor/flow/page';
    }
    if (this.controlSceneId) {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.$refs.tableRef.reload();
        //刷新类型占比
        this.$emit('refreshFlow', true);
      }, 1000 * 10);
    }
  },
  destroyed() {
    //离开页面是销毁
    clearInterval(this.timer);
    this.timer = null;
  },
  mounted() {},
  methods: {},
  watch: {},
};
</script>

<style scoped lang="scss">
.table-content {
  ::v-deep .cb-search-table {
    .cb-a-table-container {
      padding: 0;
    }
  }
}
</style>
