<template>
  <cb-search-table
    ref="sdlRef"
    class="node-search-table"
    :scroll="{ y: scrollY }"
    :background="false"
    url="/cscene/cscene_instances/list_host_events"
    :cols="columns"
    :data="query"
    childrenColumnName="course_lessons"
    baseURL="/api/mp"
    :searchBarBg="false"
  >
    <template v-slot:filter>
      <cb-select
        :placeholder="$t('systemOperation.eventAnalysis.selectNode')"
        v-model="query.nodeIds"
        :options="optionsNode"
      >
      </cb-select>
      <cb-select
        :placeholder="$t('systemOperation.eventAnalysis.selectEventType')"
        v-model="query.type"
        :options="optionsEvent"
      >
      </cb-select>
      <cb-date-picker
        v-model="date_start"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        :placeholder="$t('systemOperation.eventAnalysis.selectStartTime')"
        @change="changeDateRange"
      >
      </cb-date-picker>
      <cb-date-picker
        v-model="date_end"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        :placeholder="$t('systemOperation.eventAnalysis.selectEndTime')"
        @change="changeDateRange"
      >
      </cb-date-picker>
    </template>
    <template slot="searchRightArea">
      <cb-button icon="icon-shuaxin" @click="refresh">{{
        $t('systemOperation.eventAnalysis.refresh')
      }}</cb-button>
    </template>
    <template v-slot:virtual_type="scope">
      {{ nodeTypeArr[scope.data.virtual_type - 1] }}
    </template>
    <template v-slot:type="scope">
      {{ eventTypeArr[scope.data.virtual_type - 1] }}
    </template>
  </cb-search-table>
</template>

<script>
export default {
  name: 'NodeSearchTable',
  props: {
    scrollY: {
      type: Number,
      default: 0,
    },
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      optionsEvent: [
        {
          label: this.$t('systemOperation.eventAnalysis.eventTotal'),
          value: 0,
        },
        {
          label: this.$t('systemOperation.eventAnalysis.process'),
          value: 1,
        },
        {
          label: this.$t('systemOperation.eventAnalysis.port'),
          value: 2,
        },
        {
          label: this.$t('systemOperation.eventAnalysis.networkConnection'),
          value: 3,
        },
        {
          label: this.$t('systemOperation.eventAnalysis.file'),
          value: 4,
        },
        {
          label: this.$t('systemOperation.eventAnalysis.users'),
          value: 5,
        },
      ],
      nodeTypeArr: [
        this.$t('systemOperation.cloudPlatform.switch'),
        this.$t('systemOperation.cloudPlatform.router'),
        this.$t('systemOperation.cloudPlatform.firewall'),
        this.$t('systemOperation.cloudPlatform.vm'),
        this.$t('systemOperation.cloudPlatform.container'),
        this.$t('systemOperation.cloudPlatform.realEquipment'),
      ],
      eventTypeArr: [
        this.$t('systemOperation.eventAnalysis.process'),
        this.$t('systemOperation.eventAnalysis.port'),
        this.$t('systemOperation.eventAnalysis.networkConnection'),
        this.$t('systemOperation.eventAnalysis.file'),
        this.$t('systemOperation.eventAnalysis.users'),
      ],
      optionsNode: [],
      date_start: '', //第一个日期选择器选中的时间
      date_end: '', //第二个日期选择器选中的时间
      query: {
        name: '',
        id: this.sceneId,
        nodeIds: '', //节点
        startTime: '',
        endTime: '',
        type: null,
      },
      columns: [
        {
          label: this.$t('systemOperation.eventAnalysis.nodeName'),
          prop: 'node_name',
        },
        {
          label: this.$t('systemOperation.eventAnalysis.nodeType'),
          slot: 'virtual_type',
        },
        {
          label: this.$t('systemOperation.eventAnalysis.operatSystem'),
          prop: 'system_type_name',
        },
        {
          label: this.$t('systemOperation.eventAnalysis.eventType'),
          prop: 'type',
        },
        {
          label: this.$t('systemOperation.eventAnalysis.eventInfo'),
          prop: 'description',
        },
        {
          label: this.$t('systemOperation.eventAnalysis.times'),
          prop: 'time',
        },
      ],
    };
  },
  computed: {},
  created() {
    this.getNode();
  },
  mounted() {},
  watch: {},
  methods: {
    refresh() {
      this.$refs.sdlRef.reload();
    },
    // 获取节点
    getNode() {
      this.$request
        .get(
          `/cscene/monitor/scene/all_elements/${this.sceneId}`,
          {
            realTimeHostState: false,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.optionsNode = data.map((element) => {
            return {
              label: element.name,
              value: element.id,
            };
          });
          this.optionsNode.unshift({
            label: this.$t('systemOperation.eventAnalysis.allNode'),
            value: '',
          });
        });
    },
    //日期选择器确定值时才改变请求参数中的值
    changeDateRange() {
      this.query.startTime = this.date_start;
      this.query.endTime = this.date_end;
    },
  },
  components: {},
};
</script>

<style lang="scss">
.node-search-table .cb-search-table .cb-table-no-data {
  padding: 0 !important;
}
</style>
<style scoped lang="scss">
.node-search-table {
  ::v-deep.cb-a-table-container {
    .cb-table-no-data {
      padding: 10px 0;
    }
  }
}
</style>
