<template>
  <cb-inner-page :background="false">
    <!-- 任务裁决探针采集 -->
    <cb-search-table
      ref="tableRef"
      :url="url"
      :data.sync="model"
      :baseURL="baseURL"
      :cols="columns"
      :searchBarBg="false"
      :scroll="{ y: 360 }"
    >
      <template v-slot:filter>
        <div class="search-wrap">
          <cb-select
            width="180px"
            v-model="model.nodeIds"
            :options="hostOptions"
            :first="{ label: $t('rbt.allSourceHost'), value: '' }"
          />
          <cb-select
            width="180px"
            v-model="model.type"
            :options="typeOptions"
            :first="{ label: $t('rbt.allType'), value: '' }"
            @change="changeApply"
          />
          <cb-select
            width="180px"
            v-model="model.levels"
            :options="levelOptions"
            :first="{ label: $t('rbt.allLevel'), value: '' }"
          />
          <span class="time">
            <cb-date-picker
              v-model="startEndTime"
              type="daterange"
              :range-separator="$t('m.to')"
              :start-placeholder="$t('m.startTime')"
              :end-placeholder="$t('m.endTime')"
              @change="logTimeChange"
            >
            </cb-date-picker>
          </span>
          <cb-search-input
            width="130px"
            v-model="model.keyword"
            :placeholder="$t('rbt.enterDesc')"
          ></cb-search-input>
        </div>
      </template>
      <!-- 操作 -->
      <template v-slot:operate="scope">
        <cb-button type="text" @click="lookDetailFn(scope.data)">{{
          $t('rbt.view')
        }}</cb-button>
      </template>
    </cb-search-table>
    <!-- 点击查看详情弹框 -->
    <cb-dialog
      v-if="showDialog"
      :visible.sync="showDialog"
      :title="$t('rbt.view')"
      class="dialogView"
      height="600px"
    >
      <template>
        <!-- <cb-scrollbar> -->
        <json-viewer :value="jsonData" :expand-depth="expandDepth" />
        <!-- </cb-scrollbar> -->
      </template>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import moment from 'moment';
import { getHostListDataApi, getTypeAllDataApi } from '@/api/web/team-training';
import 'vue-json-viewer/style.css';
export default {
  components: {},
  props: {
    // 接收场景id
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      expandDepth: 0,
      jsonData: {},
      showDialog: false,
      hostAllData: [],
      url: '',
      // url: '/cscene/cscene_instances/list_host_events',
      baseURL: '/api/mp',
      model: {
        nodeIds: '',
        type: '',
        levels: '',
        keyword: '',
        startTime: '',
        endTime: '',
        id: '', //场景实例id
      },
      hostOptions: [],
      typeOptions: [],
      levelOptions: [
        {
          label: this.$t('test.high'),
          value: '10,11,12,13,14,15',
        },
        {
          label: this.$t('test.middle'),
          value: '5,6,7,8,9',
        },
        {
          label: this.$t('test.low'),
          value: '0,1,2,3,4',
        },
      ],
      startEndTime: '',
      flowStartTime: '',
      flowEndTime: '',
      columns: [
        {
          label: this.$t('rbt.host'),
          prop: 'node_name',
          width: '26%',
        },
        {
          label: this.$t('rbt.types'),
          prop: 'type',
          width: '13%',
        },
        {
          label: this.$t('rbt.level'),
          getData: (row) => {
            return this.getLevel(row.level);
          },
          width: '10%',
        },
        {
          label: this.$t('rbt.time'),
          prop: 'time',
          width: '19%',
        },
        {
          label: this.$t('rbt.desc'),
          prop: 'description',
          width: '23%',
        },
        {
          label: this.$t('rbt.operate'),
          slot: 'operate',
          width: '8%',
        },
      ],
      getLevel: (value) => {
        if (value >= 0 && value <= 4) {
          return this.$t('test.low');
        } else if (value >= 5 && value <= 9) {
          return this.$t('test.middle');
        } else if (value >= 10) {
          return this.$t('test.high');
        } else {
          return '-';
        }
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 获取全部类别下来框数据
    getTypeData() {
      getTypeAllDataApi({}).then((res) => {
        const data = _.get(res, 'data.data', []);
        if (data.length > 0) {
          data.forEach((item) => {
            this.typeOptions.push({
              label: item.name,
              value: item.value,
            });
          });
        }
      });
    },
    // 点击查看
    lookDetailFn(scope) {
      this.showDialog = true;
      try {
        const obj = JSON.parse(scope.content);
        if (typeof obj === 'object' && obj) {
          this.jsonData = JSON.parse(scope.content);
          this.expandDepth = 10;
        } else {
          this.jsonData = scope.content;
          this.expandDepth = 0;
        }
      } catch (error) {
        this.jsonData = scope.content;
        this.expandDepth = 10;
      }
    },
    changeApply() {},
    // 事件选择
    logTimeChange() {
      if (this.startEndTime) {
        this.flowStartTime = moment(this.startEndTime[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.flowEndTime = moment(this.startEndTime[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      } else {
        this.flowStartTime = null;
        this.flowEndTime = null;
      }
      this.model.startTime = this.flowStartTime;
      this.model.endTime = this.flowEndTime;
    },
    // 获取机器列表
    getMachineList() {
      getHostListDataApi(this.sceneId).then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        const list = data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.hostOptions = [...list];
      });
    },
  },
  created() {
    this.model.id = this.sceneId;
    // 场景启动获取探针采集
    if (this.sceneId) {
      this.url = '/cscene/cscene_instances/list_host_events';
      this.getMachineList();
    }

    this.getTypeData();
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.search-wrap {
  width: 100%;
  display: flex;
  .cb-select {
    margin-right: 8px;
  }
  .time {
    margin-right: 8px;
  }
}
.dialogView {
  ::v-deep .jv-container.jv-light {
    background: transparent !important;
  }
  ::v-deep .jv-container .jv-code {
    padding: 0 !important;
  }
  ::v-deep .jv-container.jv-light .jv-key,
  ::v-deep .jv-container.jv-light .jv-item.jv-array,
  ::v-deep .jv-container.jv-light .jv-item.jv-object {
    color: #fff !important;
  }
  ::v-deep .jv-container.jv-light .jv-ellipsis {
    background-color: #252c46;
  }
}
</style>
