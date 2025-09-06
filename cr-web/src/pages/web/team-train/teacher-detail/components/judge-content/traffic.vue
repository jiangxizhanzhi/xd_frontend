<template>
  <!-- 教员任务裁决流量分析页面 -->
  <cb-inner-page :background="false">
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
            v-model="model.sourceNodeIds"
            :options="hostOptions"
            :first="{ label: $t('rbt.allSourceHost'), value: '' }"
          />
          <cb-select
            width="180px"
            v-model="model.targetNodeIds"
            :options="hostOptions"
            :first="{ label: $t('rbt.allDestinationHost'), value: '' }"
          />
          <cb-select
            width="180px"
            v-model="model.attackTypes"
            :options="typeOptions"
            :first="{ label: $t('rbt.allType'), value: '' }"
          />
          <span class="time">
            <cb-date-picker
              v-model="startEndTime"
              type="daterange"
              :range-separator="$t('m.to')"
              :start-placeholder="$t('m.startTime')"
              :end-placeholder="$t('m.endTime')"
              @change="timeChange"
            >
            </cb-date-picker>
          </span>
          <cb-search-input
            width="130px"
            v-model="model.port"
            :placeholder="$t('rbt.enterPort')"
          ></cb-search-input>
        </div>
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
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import moment from 'moment';
import {
  getTypeListDataApi,
  getHostListDataApi,
} from '@/api/web/team-training';
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
      url: '',
      // url: '/cscene/monitor/flow/page',
      baseURL: '/api/mp',
      model: {
        sourceNodeIds: '', //源主机
        targetNodeIds: '', //目的主机
        attackTypes: '', //全部类型
        port: '', //端口
        id: '', //场景实例id
        startTime: '',
        endTime: '',
      },
      hostOptions: [], //主机数据
      typeOptions: [], //全部类型数据
      startEndTime: '',
      flowStartTime: '',
      flowEndTime: '',
      columns: [
        {
          label: this.$t('rbt.sourceHost'),
          prop: 'source_node_name',
        },
        {
          label: this.$t('rbt.sourcePort'),
          prop: 'source_port',
        },
        {
          label: this.$t('rbt.destinationHost'),
          prop: 'target_node_name',
        },
        {
          label: this.$t('rbt.destinationPort'),
          prop: 'target_port',
        },
        {
          label: this.$t('rbt.type'),
          slot: 'attack_type',
        },
        {
          //告警等级(1:高,2:中,3:低,4:低)
          label: this.$t('rbt.alarmSeverity'),
          slot: 'severity',
        },
        {
          label: this.$t('rbt.time'),
          prop: 'time',
        },
      ],
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 获取全部类型下来框数据
    getTypeData() {
      getTypeListDataApi({}).then((res) => {
        const data = _.get(res, 'data.data.types', []);
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
    timeChange() {
      if (!this.sceneId) {
        return;
      }
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
    if (this.sceneId) {
      this.url = '/cscene/monitor/flow/page';
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
</style>
