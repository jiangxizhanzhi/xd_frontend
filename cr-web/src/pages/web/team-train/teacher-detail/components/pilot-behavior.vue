<template>
  <!-- 团队教员行为导调页面 -->
  <div class="behavior-teacher el-tabs__content cyber-scroll-bar-small">
    <!-- 流量仿真概况 -->
    <div class="traffic-simulation-general">
      <block fontSize="16" :title="$t('rbt.flowSimulationOverview')"></block>
      <div class="general-list">
        <!-- 仿真任务数 -->
        <div class="general-item">
          <div class="left-wrap">
            <div class="img-wrap task-num">
              <cb-iconfont
                :size="16"
                type="icon-renwufangan"
                class="general-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="right-wrap">
            <div class="num">{{ flowDataObj.task_num }}</div>
            <div class="name">{{ $t('rbt.simulationTasks') }}</div>
          </div>
        </div>
        <!-- 已执行次数 -->
        <div class="general-item">
          <div class="left-wrap">
            <div class="img-wrap runned-count">
              <cb-iconfont
                :size="16"
                type="icon-huifu"
                class="general-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="right-wrap">
            <div class="num">{{ flowDataObj.runned_count }}</div>
            <div class="name">{{ $t('rbt.executed') }}</div>
          </div>
        </div>
        <!-- 成功次数 -->
        <div class="general-item">
          <div class="left-wrap">
            <div class="img-wrap success-count">
              <cb-iconfont
                :size="16"
                type="icon-gou"
                class="general-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="right-wrap">
            <div class="num">{{ flowDataObj.success_count }}</div>
            <div class="name">{{ $t('rbt.successTasks') }}</div>
          </div>
        </div>
        <!-- 失败次数 -->
        <div class="general-item">
          <div class="left-wrap">
            <div class="img-wrap error-count">
              <cb-iconfont
                :size="16"
                type="icon-guanbi"
                class="general-icon"
              ></cb-iconfont>
            </div>
          </div>
          <!-- 失败次数 -->
          <div class="right-wrap">
            <div class="num">{{ flowDataObj.error_count }}</div>
            <div class="name">{{ $t('rbt.failTasks') }}</div>
          </div>
        </div>
        <!-- 目标设备数 -->
        <div class="general-item">
          <div class="left-wrap">
            <div class="img-wrap total-node">
              <cb-iconfont
                :size="16"
                type="icon-shitishebei"
                class="general-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="right-wrap">
            <div class="num">{{ flowDataObj.total_node }}</div>
            <div class="name">{{ $t('rbt.targetTasks') }}</div>
          </div>
        </div>
        <!-- 当前启动任务数 -->
        <div class="general-item">
          <div class="left-wrap">
            <div class="img-wrap running-task">
              <cb-iconfont
                :size="16"
                type="icon-ceshi1"
                class="general-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="right-wrap">
            <div class="num">{{ flowDataObj.running_task }}</div>
            <div class="name">{{ $t('rbt.startedTasks') }}</div>
          </div>
        </div>
        <!-- 当前执行目标数 -->
        <div class="general-item">
          <div class="left-wrap">
            <div class="img-wrap running-node">
              <cb-iconfont
                :size="16"
                type="icon-bianjiqiweb"
                class="general-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="right-wrap">
            <div class="num">{{ flowDataObj.running_node }}</div>
            <div class="name">{{ $t('rbt.executionTarget') }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 三个图表 -->
    <div class="rate-wrap">
      <!-- 环境总速率 -->
      <div class="environment-rate">
        <block fontSize="16" :title="$t('rbt.environmentalRate')"> </block>
        <div class="chart-wrap">
          <environment-rate
            :environmentXdata="environmentXdata"
            :environmentYdata="environmentYdata"
            :unit="unit"
            v-if="this.environmentXdata.length !== 0"
          ></environment-rate>
          <empty-page ref="emptyComp" v-else />
        </div>
        <div class="total-wrap" v-if="this.environmentXdata.length !== 0">
          <span class="total">{{ this.number }}</span>
          <span class="unit">Mbps</span>
        </div>
      </div>
      <!-- Top5实时速率 -->
      <div class="real-rate">
        <block fontSize="16" :title="$t('rbt.realRates')"></block>
        <div class="chart-wrap">
          <real-rate
            :xData="xData"
            :yData="yData"
            v-if="this.realData && this.realData.length !== 0"
          ></real-rate>
          <empty-page ref="emptyComp" v-else />
        </div>
      </div>
      <!-- Top5流量协议 -->
      <div class="traffic-protocol">
        <block fontSize="16" :title="$t('rbt.flowProtocols')"></block>
        <div class="chart-wrap">
          <traffic-protocol
            v-if="this.FlowData && this.FlowData.length !== 0"
            :yDataFlow="yDataFlow"
            :xDataFlow="xDataFlow"
          ></traffic-protocol>
          <empty-page ref="emptyComp" v-else />
        </div>
      </div>
    </div>
    <!-- 流量仿真统计 -->
    <div class="traffic-simulation-statistics">
      <block fontSize="16" :title="$t('rbt.flowSimulationStatistics')"> </block>
      <div class="statistics-category">
        <div
          class="statistics-item"
          :key="index"
          v-for="(item, index) in rateList"
        >
          <div class="statistics-wrap">
            <span class="rate">{{ item.value }}</span>
            <span class="unit">{{ item.mark }}</span>
          </div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
      <!-- 流量仿真图表 -->
      <div class="traffic-chart">
        <div class="single-chart">
          <div class="title-style">{{ $t('rbt.realRate') }}</div>
          <traffic-chart
            :titles="titleOne"
            :contentChart="contentChartOne"
            v-if="this.contentChartOne[0]"
          >
          </traffic-chart>

          <empty-page ref="emptyComp" v-else />
        </div>
        <div class="single-chart">
          <div class="title-style">TX PPS</div>
          <traffic-chart
            :titles="titleTwo"
            :contentChart="contentChartTwo"
            v-if="this.contentChartTwo[0]"
          ></traffic-chart>
          <empty-page ref="emptyComp" v-else />
        </div>
        <div class="single-chart">
          <div class="title-style">Total bytes</div>
          <traffic-chart
            :titles="titleThree"
            :contentChart="contentChartThree"
            v-if="this.contentChartThree[0]"
          ></traffic-chart>
          <empty-page ref="emptyComp" v-else />
        </div>
        <div class="single-chart">
          <div class="title-style">Total errors</div>
          <traffic-chart
            :titles="titleFour"
            :contentChart="contentChartFour"
            v-if="this.contentChartFour[0]"
          ></traffic-chart>
          <empty-page ref="emptyComp" v-else />
        </div>
      </div>
    </div>
    <!-- 仿真任务列表 -->
    <div class="task-list">
      <block fontSize="16" :title="$t('rbt.simulationTaskList')"> </block>
      <!-- :data-source="flowTableData" -->
      <!-- url="/cscene/cscene_flow/task/list"
         baseURL="/api/mp"/
         :data.sync="model"   -->
      <cb-search-table
        :cols.sync="columns"
        :data-source="flowTableData"
        showIndex
        row-key="id"
        ref="tableRef"
        :searchBarBg="true"
        type="index"
        :hidePaginOnDemand="true"
      >
        <!-- 搜索 -->
        <template v-slot:filter>
          <!-- v-model="model.interactiveType" -->
          <cb-select
            :options="typeOptions"
            :first="{ label: $t('rbt.allFlow'), value: '' }"
            @change="changeInput"
          >
          </cb-select>
          <!-- v-model="model.nodeId" -->
          <cb-select
            :options="targetData"
            titleField="node_name"
            valueField="node_id"
            :first="{ node_name: $t('rbt.allEquipment'), node_id: '' }"
            @change="changeSelect"
          />
        </template>
        <!-- 全部启动,新增任务按钮 -->
        <template slot="searchRightArea">
          <cb-button
            hollow
            @click="openAllFn"
            :disabled="flowTableData.length === 0"
            >{{ $t('rbt.allStart') }}</cb-button
          >
          <cb-button
            hollow
            @click="stopeAllFn"
            :disabled="flowTableData.length === 0"
            >{{ $t('rbt.allStop') }}</cb-button
          >
          <cb-button hollow @click="addTaskFn">{{
            $t('rbt.addTask')
          }}</cb-button>
        </template>
        <!-- 列表操作按钮 -->
        <template v-slot:operation="scope">
          <!-- 启动 -->
          <cb-button
            type="text"
            @click="openFlowFn(scope.data)"
            v-if="scope.data.task_status !== 1 && scope.data.task_status !== 6"
          >
            {{ $t('rbt.start') }}
          </cb-button>
          <!-- 初始化中不能启动 -->
          <cb-button type="text" disabled v-if="scope.data.task_status === 6">
            {{ $t('rbt.start') }}
          </cb-button>
          <!-- 停止(只有正在运行的可以停止) -->
          <cb-button
            type="text"
            @click="stopeFlowFn(scope.data)"
            v-if="scope.data.task_status === 1"
          >
            {{ $t('rbt.stop') }}
          </cb-button>
          <!-- 配置 -->
          <!-- 运行中,初始化中不能配置 -->
          <cb-button
            type="text"
            @click="attackConfigFn(scope.data)"
            v-if="scope.data.task_status === 1 || scope.data.task_status === 6"
            disabled
          >
            {{ $t('rbt.disposition') }}</cb-button
          >
          <cb-button
            type="text"
            @click="attackConfigFn(scope.data)"
            v-if="scope.data.task_status !== 1 && scope.data.task_status !== 6"
          >
            {{ $t('rbt.disposition') }}</cb-button
          >
          <!-- 删除 -->
          <!-- 运行中,初始化中不能删除 -->
          <cb-button
            type="text"
            @click="deleteFlowFn(scope.data)"
            v-if="scope.data.task_status === 1 || scope.data.task_status === 6"
            disabled
          >
            {{ $t('rbt.delete') }}</cb-button
          >
          <cb-button
            type="text"
            @click="deleteFlowFn(scope.data)"
            v-if="scope.data.task_status !== 1 && scope.data.task_status !== 6"
          >
            {{ $t('rbt.delete') }}</cb-button
          >
        </template>
        <!-- 实时速率图表 -->
        <template v-slot:real_time_rate_list="scope">
          <real-speed
            v-if="scope.data.real_time_rate_list !== null"
            :real-time-rate="scope.data.real_time_rate_list"
          ></real-speed>
          <span v-else>{{ '-' }}</span>
        </template>
        <!-- 状态 -->
        <template v-slot:task_status="scope">
          <!-- 0 初始化，1 运行中，2 异常， 3 已停止, 4 暂停 ,5准备中 ,6初始化中-->
          <span
            v-if="scope.data.task_status === 0"
            class="status-style status-one"
          >
            {{ $t('rbt.initialize') }}
          </span>
          <span
            v-else-if="scope.data.task_status === 1"
            class="status-style status-two"
          >
            {{ $t('rbt.running') }}
          </span>
          <span
            v-else-if="scope.data.task_status === 2"
            class="status-style status-three"
          >
            {{ $t('rbt.abnormal') }}
            <!-- 异常信息悬浮提示 -->
            <cb-tooltip
              placement="right-start"
              popper-class="time-line-tooltip"
            >
              <cb-iconfont
                :size="14"
                type="icon-shuoming"
                class="status-icon"
              ></cb-iconfont>
              <span slot="content">{{ scope.data.msg }}</span>
            </cb-tooltip>
          </span>
          <span
            v-else-if="scope.data.task_status === 3"
            class="status-style status-four"
          >
            {{ $t('rbt.stopped') }}
          </span>
          <span
            v-else-if="scope.data.task_status === 4"
            class="status-style status-five"
          >
            {{ $t('rbt.pause') }}
          </span>
          <span
            v-else-if="scope.data.task_status === 5"
            class="status-style status-six"
          >
            {{ $t('rbt.preparation') }}
          </span>
          <span
            v-else-if="scope.data.task_status === 6"
            class="status-style status-one"
          >
            {{ $t('rbt.initializing') }}
          </span>
        </template>
      </cb-search-table>
      <!-- 仿真任务列表分页 -->
      <cb-pagination
        v-if="pagination.total > 0"
        :total="pagination.total"
        :page-sizes="['10', '20', '30', '40', '50']"
        :current-page="pagination.currentPage"
        :page-size.sync="pagination.per_page"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></cb-pagination>
    </div>
    <!-- 新增任务弹框 -->
    <add-task
      v-if="addTaskShow"
      :add-task-show="addTaskShow"
      @closeTaskDialog="closeTaskDialog"
      :controlSceneId="controlSceneId"
      @upTable="upTable"
    ></add-task>
    <!-- 点击攻击流量的配置弹框 -->
    <attack-config
      :attack-show="attackShow"
      @closeAttackDialog="closeAttackDialog"
      :attackData="attackData"
      :attack_id="attack_id"
    ></attack-config>
    <!-- 点击背景流量的配置弹框 -->
    <background-config
      :background-show="backgroundShow"
      @closeBackgroundDialog="closeBackgroundDialog"
      :backData="backData"
    ></background-config>
  </div>
</template>

<script>
import block from '@/components/block';
import environmentRate from './behavior-content/environment-rate.vue'; //环境速率
import realRate from './behavior-content/real-rate.vue'; //实时速率
import trafficProtocol from './behavior-content/traffic-protocol.vue'; //流量协议
import trafficChart from './behavior-content/traffic-chart.vue'; //环境速率
import addTask from './behavior-content/add-task-dialog.vue'; //新增任务弹框
import attackConfig from './behavior-content/attack-config-dialog'; //攻击流量配置弹框
import realSpeed from './behavior-content/real-speed'; //table实时速率图表

import defaultLogo from '@/assets/img/addhost.png';
import utils from '@/utils/utils';
import wsutil from '@/utils/websocket';
import BackgroundConfig from './behavior-content/background-config-dialog.vue';
import EmptyPage from '@/pages/web/Empty/behavior-index.vue';
import {
  getFlowListApi,
  openFlowListApi,
  deleteFlowListApi,
  manyFlowListApi,
  getTargetApi,
  getCheckDataApi,
  stopFlowListApi,
  stopOneFlowListApi,
  totalFlowListApi,
  getStartStopIdsApi,
} from '@/api/web/team-training';
export default {
  components: {
    block,
    environmentRate,
    realRate,
    trafficChart,
    trafficProtocol,
    attackConfig,
    addTask,
    BackgroundConfig,
    EmptyPage,
    realSpeed,
  },
  props: {
    // 接收场景启动场景实例id
    controlSceneId: {
      type: String,
      default: '',
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        per_page: 10,
        total: 0,
      },
      timer: null,
      timer1: null,
      offsetUnitData: [],
      unit: '',
      number: '',
      attack_id: '',
      backData: {}, //背景流量
      attackData: [], //攻击流量配置
      // newArr:[],
      environmentXdata: [],
      environmentYdata: [],
      environmentData: [],
      targetData: [],
      typeOptions: [
        { label: this.$t('rbt.dynamicTraffic'), value: 1 },
        { label: this.$t('rbt.staticTraffic'), value: 0 },
      ],

      FlowData: [],
      contentChartOne: [this.latencyXdata, this.latencyYdata, this.latencyTime],
      contentChartTwo: [this.bpsXdata, this.bpsYdata, this.latencyTime],
      contentChartThree: [this.ppsXdata, this.ppsYdata, this.latencyTime],
      contentChartFour: [this.jitterXdata, this.jitterYdata, this.latencyTime],
      flowRealList: [],
      xData: [],
      yData: [],
      xDataFlow: [],
      yDataFlow: [],
      latencyYdata: [],
      latencyXdata: [],
      bpsXdata: [],
      bpsYdata: [],
      ppsYdata: [],
      ppsXdata: [],
      jitterXdata: [],
      jitterYdata: [],
      flowRealList: [],
      xData: [],
      yData: [],
      xDataFlow: [],
      yDataFlow: [],
      realData: [], // 实时速率数据
      task_ids_arr: [], //全部启动停止的ids
      flowDataObj: {}, // 流量仿真概况数据
      addTaskShow: false, //新增任务弹框
      attackShow: false, //攻击流量弹框
      backgroundShow: false, //背景流量弹框
      // 流量仿真统计图表单位
      titleOne: 'Mb/s',
      titleTwo: 'kpkt/s',
      titleThree: 'kb',
      titleFour: '',
      defaultLogo,
      // simulationTaskNum: 0,
      executedNum: 0,
      successNum: 0,
      failNum: 0,
      targetDeviceNum: 0,
      startupTaskNum: 0,
      currentExecutionNum: 0,
      rateList: [],
      flowTableData: [], //列表数据
      trafficListsCopy: [],
      columns: [
        {
          label: this.$t('rbt.name'),
          prop: 'title',
          width: 100,
        },
        // 流量类型
        {
          label: this.$t('m.trafficType'),
          getData: (row) => {
            const { interactive_type } = row;
            // 1是攻击,0是背景
            if (interactive_type == 1) {
              return this.$t('traffic.dynamicTraffic');
            } else if (interactive_type == 0) {
              return this.$t('traffic.staticTraffic');
            }
          },
          width: 110,
        },
        // 目标设备
        {
          label: this.$t('m.target'),
          prop: 'node_name',
        },
        {
          label: 'IP',
          prop: 'node_ip',
          width: 100,
        },
        {
          label: this.$t('rbt.duration'),
          prop: 'duration',
          width: 100,
        },
        {
          label: this.$t('rbt.size'),
          prop: 'pcap_size',
          width: 100,
        },
        {
          label: this.$t('rbt.packetNumber'),
          prop: 'pkt_num',
          width: 100,
        },
        {
          label: this.$t('rbt.protocolDistribution'),
          prop: 'protocols',
        },
        // 执行次数
        {
          label: this.$t('rbt.numberExecutions'),
          // getData: (row) => {
          //   const { count } = row;
          //   if (count) {
          //     return `${count}`;
          //   } else {
          //     return '0';
          //   }
          // },
          prop: 'total_count',
          width: 120,
        },
        // 状态 task_status
        {
          label: this.$t('m.status'),
          slot: 'task_status',
          // getData: (row) => {
          //   //  0 初始化，1 运行中，2 异常， 3 已停止, 4 暂停 ,5准备中
          //   const { task_status } = row;
          //   if (task_status === 4) {
          //     return this.$t('rbt.pause');
          //   } else if (task_status === 0) {
          //     return this.$t('rbt.initialize');
          //   } else if (task_status === 1) {
          //     return this.$t('rbt.running');
          //   } else if (task_status === 2) {
          //     return this.$t('rbt.abnormal');
          //   } else if (task_status === 3) {
          //     return this.$t('rbt.stopped');
          //   } else if (task_status === 5) {
          //     return this.$t('rbt.preparation');
          //   }
          // },
          width: 100,
        },
        // 实时速率
        {
          label: this.$t('rbt.realRate'),
          prop: 'real_time_rate_list',
          slot: 'real_time_rate_list',
        },
        // 操作
        {
          label: this.$t('m.action'),
          slot: 'operation',
        },
      ],
      model: {
        interactiveType: '',
        nodeId: '', //目标设备
        // per_page: 10000,
        // page: 1,
        id: this.controlSceneId,
      },
      cookie: '',
    };
  },
  watch: {},
  computed: {},
  beforeDestroy() {
    clearInterval(this.timer);
    clearTimeout(this.timer1);
  },
  destroyed() {
    clearInterval(this.timer);
    clearTimeout(this.timer1);
  },

  methods: {
    // 获取全部启动,全部停止的id列表
    getAllIds(flag) {
      getStartStopIdsApi({
        id: this.controlSceneId,
        interactiveType: this.model.interactiveType,
        nodeId: this.model.nodeId,
      }).then((res) => {
        this.task_ids_arr = res?.data?.data;
        if (flag === 'open') {
          manyFlowListApi({ task_ids: this.task_ids_arr }).then((res) => {});
        } else if (flag === 'close') {
          stopFlowListApi({ task_ids: this.task_ids_arr }).then((res) => {});
        }
      });
    },
    // 流量类型搜索
    changeInput(val) {
      this.model.interactiveType = val;
      this.pagination.currentPage = 1;
      this.initFlow();
    },
    // 设备搜索
    changeSelect(val) {
      this.model.nodeId = val;
      this.pagination.currentPage = 1;
      this.initFlow();
    },
    // 分页选择
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.initFlow();
    },
    // 分页数量选择
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.per_page = val;
      this.initFlow();
    },

    refresh() {
      this.getAllData();
      this.timer = setInterval(() => {
        this.initFlow();
        // this.getAllIds();
        // this.$refs.tableRef.reload();
      }, 2000);
    },

    // 获取上面所有数据
    getAllData() {
      totalFlowListApi(this.controlSceneId).then((res) => {
        this.flowDataObj = res.data.data.flow_summary; //流量仿真
        this.realData = res.data.data.top5_node_tx_bps_list; //top5实时速率数据
        this.xData = [];
        this.yData = [];
        this.realData.forEach((item, index) => {
          // Top5实时速率
          this.xData.push(item.node_name);
          // this.yData.push(item.tx_bps);
          // b转为Mbps
          this.yData.push(Math.round(item.tx_bps / 1024 / 1024));
        });

        this.FlowData = res.data.data.top5_protocols; //top5流量协议
        this.xDataFlow = [];
        this.yDataFlow = [];
        this.FlowData.forEach((item, index) => {
          this.xDataFlow.push(item.protocol);
          this.yDataFlow.push(item.rate);
        });

        this.environmentData = res.data.data.total_rate_list; //环境总速率

        this.environmentXdata = [];
        this.environmentYdata = [];
        this.environmentData.forEach((item, index) => {
          this.environmentXdata.push(item.offset_value);
          this.environmentYdata.push(item.value);
          this.offsetUnitData.push(item.offset_unit); //单位
        });
        if (this.environmentYdata?.length > 0) {
          this.number = this.environmentYdata[this.environmentYdata.length - 1];
          this.unit = this.offsetUnitData[this.offsetUnitData.length - 1];
        }

        // 流量仿真统计
        this.flowRealList = res.data.data.flow_statistics_info;
        // 流量仿真统计上面数据
        this.rateList = [
          {
            mark: 'Mbps',
            name: 'Total Tx L2',
            value:
              this.flowRealList.total_tx_l2 == null ||
              this.flowRealList.total_tx_l2 === 0
                ? 0
                : (this.flowRealList.total_tx_l2 / 1000 / 1000).toFixed(2),
          },
          {
            mark: 'Mbps',
            name: 'Total Tx L1',
            value:
              this.flowRealList.total_tx_l1 == null ||
              this.flowRealList.total_tx_l1 === 0
                ? 0
                : (this.flowRealList.total_tx_l1 / 1000 / 1000).toFixed(2),
          },
          {
            mark: 'kbt/s',
            name: 'Total PPS',
            value:
              this.flowRealList.total_pps == null ||
              this.flowRealList.total_pps === 0
                ? 0
                : (this.flowRealList.total_pps / 1024).toFixed(1),
          },
          {
            mark: 'kb/s',
            name: 'Total Rx',
            value:
              this.flowRealList.total_rx == null ||
              this.flowRealList.total_rx === 0
                ? 0
                : (this.flowRealList.total_rx / 1024).toFixed(1),
          },
          {
            mark: 'pkts',
            name: 'Queue Full',
            value:
              this.flowRealList.queue_full == null ||
              this.flowRealList.queue_full === 0
                ? 0
                : this.flowRealList.queue_full,
          },
          {
            mark: 'b/s',
            name: 'Drop Rate',
            value:
              this.flowRealList.drop_rate == null ||
              this.flowRealList.drop_rate === 0
                ? 0
                : this.flowRealList.drop_rate,
          },
        ];
        //Total erros第四个 oerrors_list
        if (this.flowRealList.oerrors_list) {
          this.jitterXdata = [];
          this.jitterYdata = [];
          this.flowRealList.oerrors_list.forEach((item, index) => {
            this.latencyTime = item.offset_unit;
            this.jitterXdata.push(item.offset_value);
            if (item.value == null) {
              item.value = 0;
            }
            this.jitterYdata.push(item.value);
            this.contentChartFour = [
              this.jitterXdata,
              this.jitterYdata,
              this.latencyTime,
            ];
          });
        }

        // Total bytes第三个 obytes_list
        if (this.flowRealList.obytes_list) {
          this.ppsXdata = [];
          this.ppsYdata = [];
          this.flowRealList.obytes_list.forEach((item, index) => {
            this.latencyTime = item.offset_unit;
            this.ppsXdata.push(item.offset_value);
            if (item.value == null) {
              item.value = 0;
            }
            // b转为kb
            this.ppsYdata.push(Math.round(item.value / 1024));
            this.contentChartThree = [
              this.ppsXdata,
              this.ppsYdata,
              this.latencyTime,
            ];
          });
        }

        // 流量仿真统计实时速率第一个 tx_bps_list
        if (this.flowRealList.tx_bps_list) {
          this.latencyXdata = [];
          this.latencyYdata = [];
          this.flowRealList.tx_bps_list.forEach((item, index) => {
            this.latencyTime = item.offset_unit;
            this.latencyXdata.push(item.offset_value);
            if (item.value == null) {
              item.value = 0;
            }
            // b转为Mb
            this.latencyYdata.push(Math.round(item.value / 1024 / 1024));
            this.contentChartOne = [
              this.latencyXdata,
              this.latencyYdata,
              this.latencyTime,
            ];
          });
        }
        //TX PPS 第二个 tx_pps_list
        if (this.flowRealList.tx_pps_list) {
          this.bpsXdata = [];
          this.bpsYdata = [];
          this.flowRealList.tx_pps_list.forEach((item, index) => {
            this.latencyTime = item.offset_unit;
            this.bpsXdata.push(item.offset_value);
            if (item.value == null) {
              item.value = 0;
            }
            // b转为kpkt
            this.bpsYdata.push(Math.round(item.value / 1024));
            this.contentChartTwo = [
              this.bpsXdata,
              this.bpsYdata,
              this.latencyTime,
            ];
          });
        }

        clearTimeout(this.timer1);
        this.timer1 = setTimeout(() => {
          if (this.active !== 2) {
            return false;
          }
          this.getAllData();
        }, 2000);
      });
    },
    //获取目标设备下拉框数据
    getTargetList() {
      // this.controlSceneId
      getTargetApi(this.controlSceneId).then((res) => {
        this.targetData = res.data.data;
      });
    },
    // 获取流量列表
    initFlow() {
      // per_page: 10000,
      // page: 1,
      // id: this.controlSceneId,
      // interactiveType: this.model.interactiveType,
      // nodeId: this.model.nodeId,
      //  ...this.model,
      getFlowListApi({
        per_page: this.pagination.per_page,
        page: this.pagination.currentPage,
        id: this.controlSceneId,
        interactiveType: this.model.interactiveType,
        nodeId: this.model.nodeId,
      }).then((res) => {
        this.pagination.total = res.data.data.total;
        const flowList = _.get(res, 'data.data.list', []) || [];
        this.flowTableData = flowList;
      });
    },
    // 全部启动流量
    openAllFn() {
      this.getAllIds('open');
    },
    // 全部停止流量
    stopeAllFn() {
      this.getAllIds('close');
    },
    //删除流量任务
    deleteFlowFn(data) {
      this.$confirm(this.$t('rbt.isDelete'), this.$t('common.info'), {
        type: 'warning',
      }).then(() => {
        deleteFlowListApi(data.id)
          .then((res) => {
            this.$message({
              message: this.$t('rbt.successDelete'),
              type: 'success',
            });
            // this.$refs.tableRef.reload();
            this.getAllIds();
          })
          .catch((error) => {});
      });
    },
    // 单个点击启动流量
    openFlowFn(data) {
      openFlowListApi(data.id)
        .then((res) => {
          // this.$refs.tableRef.reload();
        })
        .catch((error) => {});
    },
    // 单个停止 stopOneFlowListApi
    stopeFlowFn(data) {
      stopOneFlowListApi(data.id)
        .then((res) => {
          // this.$refs.tableRef.reload();
        })
        .catch((error) => {});
    },

    // 流量点击配置
    attackConfigFn(data) {
      getCheckDataApi(data.id).then((res) => {
        // 背景流量配置信息
        this.backData = res.data.data;
        // 攻击流量配置信息
        this.attackData = res.data.data.flow_task_conf.attack_confs || [];
        // resource_type为0 pcap包(配置三个开关)
        if (data.resource_type !== 0) {
          this.attackShow = true;
          this.backgroundShow = false;
          this.attack_id = data.id; //任务id
        } else {
          this.backgroundShow = true;
          this.attackShow = false;
          this.backData.task_id = data.id; //任务id
        }
      });
    },
    //接收关闭攻击流量配置弹框
    closeAttackDialog(data) {
      this.attackShow = data;
    },
    //接收关闭背景流量配置弹框
    closeBackgroundDialog(data) {
      this.backgroundShow = data;
    },
    // 新增任务
    addTaskFn() {
      this.addTaskShow = true;
    },
    // 接收关闭弹窗事件
    closeTaskDialog(data) {
      this.addTaskShow = data;
    },
    upTable(data) {
      if (data) {
        // this.$refs.tableRef.reload();
      }
    },
  },
  created() {
    this.model.id = this.controlSceneId;
    if (this.model.id) {
      this.refresh();
    }
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getAllData();
    this.getTargetList();
    this.getAllIds();
  },
};
</script>
<style lang="scss" scoped>
.status-style {
  position: relative;
  .status-icon {
    color: var(--neutral7);
  }
  &:before {
    content: ' ';
    display: inline-block;
    vertical-align: sub;
    left: -10px;
    top: 6px;
    position: absolute;
    content: ' ';
    clear: both;
    height: 6px;
    width: 6px;
    border-radius: 50%;
  }
}
.status-one {
  &:before {
    background: var(--primary-color);
  }
}
.status-two {
  &:before {
    background: var(--primary-color-4);
  }
}
.status-three {
  &:before {
    background: var(--red-color);
  }
}
.status-four {
  &:before {
    background: var(--neutral4);
  }
}
.status-five {
  &:before {
    background: var(--yellow-color);
  }
}
.status-six {
  &:before {
    background: var(--green-color);
  }
}
.behavior-teacher {
  width: 100%;
  height: calc(100% - 50px);
  // height: 100%;
  overflow-y: scroll;
  .traffic-simulation-general {
    background: var(--bg-color-2);
    height: 138px;
    padding: 16px;
    border-radius: 4px;
    .general-list {
      margin-top: 16px;
      height: 66px;
      display: flex;
      .general-item {
        border-radius: 2px;
        background: var(--bg-color-3);
        flex: 1;
        margin-right: 16px;
        display: flex;
        align-items: center;
        &:nth-child(7) {
          margin-right: 0;
        }
        .left-wrap {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--neutral0);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 16px;
          .img-wrap {
            width: 26px;
            height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            .general-icon {
              color: var(--white-color);
            }
          }
          .task-num {
            background: var(--cyan-color);
          }
          .runned-count {
            background: var(--blue-color);
          }
          .success-count {
            background: var(--green-color);
          }
          .error-count {
            background: var(--red-color);
          }
          .total-node {
            background: var(--orange-color);
          }
          .running-task {
            background: var(--yellow-color);
          }
          .running-node {
            background: var(--primary-color);
          }
        }
        .right-wrap {
          margin-left: 16px;
          .num {
            font-size: 20px;
            color: var(--neutral8);
          }
          .name {
            font-size: 14px;
            color: var(--neutral7);
          }
        }
      }
    }
  }

  .rate-wrap {
    height: 240px;
    margin-top: 16px;
    display: flex;

    .environment-rate {
      width: 35%;
      background: var(--bg-color-2);
      margin-right: 16px;
      border-radius: 4px;
      padding: 16px;
      position: relative;
      .chart-wrap {
        width: 100%;
        height: calc(100% - 40px);
      }
      .total-wrap {
        position: absolute;
        right: 10px;
        top: 20px;
        height: 24px;
        display: flex;
        align-items: center;
        .total {
          font-size: 20px;
          color: var(--neutral8);
          margin-right: 4px;
        }
        .unit {
          font-size: 12px;
          color: var(--neutral8);
        }
      }
    }
    .real-rate {
      width: 31%;
      background: var(--bg-color-2);
      margin-right: 16px;
      border-radius: 4px;
      padding: 16px;
      .chart-wrap {
        width: 100%;
        height: calc(100% - 40px);
      }
    }
    .traffic-protocol {
      width: 32%;
      background: var(--bg-color-2);
      border-radius: 4px;
      padding: 16px;
      .chart-wrap {
        width: 100%;
        height: calc(100% - 40px);
      }
    }
  }
  .traffic-simulation-statistics {
    margin-top: 16px;
    height: 312px;
    border-radius: 4px;
    background: var(--bg-color-2);
    padding: 16px;
    .statistics-category {
      border-radius: 2px;

      height: 56px;
      background: var(--bg-color-3);
      display: flex;
      .statistics-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .statistics-wrap {
          display: flex;
          align-items: center;
          margin: 3px 0;
          .rate {
            font-size: 16px;
            color: var(--neutral8);
            margin: 0 2px;
          }
          .unit {
            font-size: 12px;
            color: var(--neutral8);
            margin: 0 2px;
          }
        }
        .name {
          font-size: 12px;
          color: var(--neutral5);
          margin: 3px 0;
        }
      }
    }
    .traffic-chart {
      height: 176px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      .single-chart {
        border-radius: 2px;
        width: calc((100% - 48px) / 4);
        background: var(--bg-color-3);
        padding: 16px 16px 0 16px;
        position: relative;
        display: flex;
        justify-content: center;
        .title-style {
          position: absolute;
          top: 24px;
          font-size: 12px;
        }
      }
    }
  }
  .task-list {
    margin-top: 16px;
    padding: 16px;
    background: var(--bg-color-2);
  }
}
</style>
<style lang="scss" scoped>
::v-deep .cb-search-table .search-bar.search-bar-bg .top-filter {
  margin-bottom: 0px;
  padding: 0px 16px 0px 16px;
}
::v-deep .cb-search-table .cb-a-table-container-bg {
  padding: 0px 16px 16px 16px;
}
</style>
