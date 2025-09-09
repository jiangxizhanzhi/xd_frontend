<template>
  <div class="table-content">
    <!-- 主机采集事件 -->
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
    </cb-search-table>
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
          width: 120,
        },
        {
          label: this.$t('rbt.host'),
          prop: 'target_node_name',
          width: 150,
        },

        {
          label: this.$t('rbt.eventType'),
          prop: 'host_event_type',
          width: 100,
        },
        {
          label: this.$t('rbt.eventDesc'),
          prop: 'host_event_desc',
          width: 100,
        },
        {
          label: this.$t('rbt.typeRecord'),
          prop: 'att_ck_names',
          width: 110,
        },
      ],
      model: {
        scene_id: this.controlSceneId, //场景实例id
      },
    };
  },
  created() {
    this.model.scene_id = this.controlSceneId; //场景实例id
    if (this.model.scene_id) {
      this.url = '/cscene/taishi/host_event_list';
    }
    if (this.controlSceneId) {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.$refs.tableRef.reload();
        //刷新类型占比
        this.$emit('refreshHost', true);
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
