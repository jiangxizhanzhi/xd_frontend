<template>
  <div class="polit-content">
    <!-- 导调记录弹框 -->
    <cb-dialog
      class="dialog-style"
      :title="$t('rbt.dayRecord')"
      :visible.sync="sonRecordVisible"
      center="center"
      @close="closeFn"
      width="960px"
    >
      <cb-search-table
        ref="tableRef"
        :scroll="{ y: 400 }"
        :cols="columns"
        :data.sync="model"
        row-key="resource_id"
        baseURL="/api/ojj"
        :url="url"
      >
        <!-- 攻防类型 -->
        <template v-slot:category="scope">
          <span :title="scope.data.category.join()" v-if="scope.data.category">
            <!-- {{ ( ['侦查','防御']).join()}} -->
            {{ scope.data.category.join() }}
          </span>
          <span v-else>{{ '-' }}</span>
        </template>
      </cb-search-table>
    </cb-dialog>
  </div>
</template>

<script>
export default {
  props: {
    recordVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sonRecordVisible: this.recordVisible,
      url: '/situation/guide/guide_record',
      columns: [
        {
          label: this.$t('rbt.time'),
          prop: 'create_time',
          width: 150,
        },

        {
          label: this.$t('rbt.eventType'),
          prop: 'action_type',
          width: 100,
        },
        {
          label: this.$t('rbt.source'),
          prop: 'source_name',
        },
        {
          label: this.$t('rbt.target'),
          prop: 'target_name',
        },
        {
          label: this.$t('rbt.pilotName'),
          prop: 'event_name',
        },
        {
          label: this.$t('rbt.typeRecord'),
          slot: 'category',
        },
        {
          label: this.$t('rbt.triggerType'),
          prop: 'trigger_type',
        },
      ],
      model: {
        room_id: '',
        business_type: '', //团队
      },
    };
  },
  created() {
    this.resource_id = this.$route.params.resource_id;
    this.model.businessType = 4; //场景实例id
    this.model.roomId = this.resource_id;
  },
  mounted() {},
  methods: {
    closeFn() {
      this.$emit('recordVisibleChange', false);
    },
  },
  watch: {
    recordVisible: {
      handler(val) {
        this.sonRecordVisible = val;
      },
    },
  },
};
</script>

<style scoped lang="scss"></style>
