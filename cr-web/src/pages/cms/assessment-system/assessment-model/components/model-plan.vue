<template>
  <div class="diagram-box">
    <div id="container">
      <div class="assessment-item col flex">
        <div class="title">
          <span>{{ $t('assessment.indicators') }}</span>
        </div>
        <div class="diagram-detail">
          <!-- 指标项 -->
          <div
            v-for="item in eval_indicators"
            :id="item.eval_indicator_id"
            :key="item.eval_indicator_id"
            class="diagram-detail-item"
            name="programme-item"
          >
            <div
              class="diagram-detail-item-content one-overflow"
              round
              @click="editAssessment(item)"
            >
              <span :title="item.name"> {{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 第一个算法 -->
      <div class="estimate_scheme flex">
        <div
          class="estimate_scheme_key"
          v-for="item in eval_indicators"
          :key="item.aggregating_algorithm_id"
          @click="handleClick(item, 'indicator')"
        >
          <span
            :id="item.aggregating_algorithm_id + '-' + item.name"
            :key="item.aggregating_algorithm_id"
            @mouseover="mouseOver($event)"
            @mouseleave="mouseLeave($event)"
            class="algorithm-style one-overflow"
            >{{
              item.aggregation_ids.length > 0
                ? exchangeAggAlgorithmOption(item.aggregating_algorithm_id)
                : ''
            }}</span
          >
        </div>
      </div>
      <!-- 聚合项 -->

      <div class="indicators-item col flex">
        <div class="title">
          <span>{{ $t('assessment.aggregate') }}</span>
          <span v-if="status" @click="addIndicators" style="cursor: pointer">
            <cb-iconfont type="icon-xinzeng"></cb-iconfont
          ></span>
        </div>
        <div class="diagram-detail">
          <div
            v-for="item in estimateIndexes"
            :id="item.eval_aggregation_id"
            :key="item.eval_aggregation_id"
            class="diagram-detail-item"
            name="programme-item"
          >
            <div
              class="diagram-detail-item-content one-overflow"
              round
              @click="editIndicators(item)"
            >
              <span :title="item.name"> {{ item.name }}</span>

              <span
                v-if="status"
                @click.stop="deleteIndicators(item)"
                class="icon"
              >
                <cb-iconfont type="icon-shanchu"></cb-iconfont
              ></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 第二个算法 -->

      <div class="estimate_scheme flex">
        <div
          class="estimate_scheme_key"
          v-for="(item, index) in estimateIndexes"
          @click="handleClick(item, 'estimate')"
          :key="item.aggregating_algorithm_id + '-' + item.name + '-2'"
        >
          <span
            :id="item.aggregating_algorithm_id + '-' + item.name + '-2'"
            :key="item.aggregating_algorithm_id + '-' + item.name + '-2'"
            @mouseover="mouseOver($event)"
            @mouseleave="mouseLeave($event)"
            class="algorithm-style one-overflow"
            >{{
              item.aggregation_ids.length > 0
                ? exchangeAggAlgorithmOption(item.aggregating_algorithm_id)
                : ''
            }}</span
          >
        </div>
      </div>

      <div class="variable-item col flex">
        <div class="title">
          <!-- 变量项 -->
          <span>{{ $t('assessment.variable') }}</span>
          <span v-if="status" @click="addVariable" style="cursor: pointer">
            <cb-iconfont type="icon-xinzeng"></cb-iconfont
          ></span>
        </div>
        <div class="diagram-detail">
          <div
            v-for="item in estimateVariables"
            :id="item.eval_collection_id"
            :key="item.eval_collection_id"
            class="diagram-detail-item"
            name="programme-item"
          >
            <div
              class="one-overflow diagram-detail-item-content"
              round
              @click="editVariable(item)"
            >
              <span :title="item.name">{{ item.name }}</span>
              <span
                v-if="status"
                @click.stop="deleteVariable(item)"
                class="icon"
              >
                <cb-iconfont type="icon-shanchu"></cb-iconfont
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <variable-dialog ref="vardialogref" @variable-change="getVariableDialog" />
    <indicators-dialog
      ref="indicatorsdialogref"
      @indicators-change="getIndicatorsDialog"
    />
    <assessment-dialog
      ref="assessmentdialogref"
      :agg-algorithm-option="aggAlgorithmOption"
      @assessment-change="getAssessmentDialog"
    />
    <ahp-dialog
      ref="ahpDialog"
      @update="updateData"
      :rows.sync="rows"
      :columns.sync="columns"
      :type="type"
      :current="current"
    ></ahp-dialog>
  </div>
</template>
<script>
import './jsplumb.js';
import variableDialog from './variable-dialog.vue';
import indicatorsDialog from './indicators-dialog.vue';
import assessmentDialog from './assessment-dialog.vue';
import AhpDialog from '../../components/ahp-dialog';
import _ from 'lodash';
import U from '@/utils/utils';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';

export default {
  name: 'IndexList',
  components: { variableDialog, indicatorsDialog, assessmentDialog, AhpDialog },
  props: {
    status: {
      type: Boolean,
      default: true,
    },
    connlistOragin: {
      type: Array,
      default: () => [],
    },
    estimateVariablesOragin: {
      type: Array,
      default: () => [],
    },
    estimateIndexesOragin: {
      type: Array,
      default: () => [],
    },
    estimateItemsOragin: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      screenWidth: document.body.clientWidth,
      formAlgorithmOption: [], // 格式化算法option
      modelAlgorithmOption: [], // 检测模型算法option
      scoreAlgorithmOption: [], // 评分算法option
      aggAlgorithmOption: [], // 聚合算法option
      allAlgorithmOption: [], //所有算法的option
      estimateVariables: this.estimateVariablesOragin, // 变量项数据
      estimateIndexes: this.estimateIndexesOragin, // 指标项数据
      eval_indicators: this.estimateItemsOragin, // 评估项数据
      columns: [],
      rows: [],
      type: '',
      current: {},
      connlist: [], // 连线数组
      jsplumbTargetOptions: {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        filter: '.flow-node-drag',
        filterExclude: false,
        anchor: 'Left',
        allowLoopback: false,
        dropOptions: { hoverClass: 'ef-drop-hover' },
      },
      jsplumbSourceOptions: {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        filter: '.flow-node-drag',
        filterExclude: false,
        anchor: 'Right',
        allowLoopback: false,
        maxConnections: -1,
        onMaxConnections: function (info, e) {},
      },
      jsplumbSetting: {
        Container: 'container', // 选择器id
        EndpointStyle: ['Blank', { Overlays: '' }],
        LabelStyle: {
          // color: "#EDF2FF",
          // font: 14,
          // location: 0.25,
          // cssClass: "diagram-flow-label",
        },
        // HoverPaintStyle: { stroke: "red", strokeWidth: 2 },
        EndpointHoverStyle: ['Blank', { Overlays: '' }],
        ConnectionsDetachable: false,
        Connector: ['Straight', { gap: 1 }], // 要使用的默认连接器的类型：折线，流程等
        DrapOptions: { cursor: 'crosshair', zIndex: 2000 },
        Anchor: 'LeftCenter', // 锚点
        Overlays: [
          [
            'Label',
            {
              label: '',
              location: 1,
              cssClass: 'aLabel',
            },
          ],
        ],
      },
      jsPlumb: null, // jsPlumb 实例
      easyFlowVisible: true, // 控制画布销毁
      activeElement: {
        // 可选值 node 、line
        type: undefined,
        // 节点ID
        nodeId: undefined,
        // 连线ID
        sourceId: undefined,
        targetId: undefined,
      },
    };
  },
  watch: {
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        setTimeout(() => {
          this.timer = false;
          this.jsPlumb.repaintEverything();
        }, 100);
      }
    },
  },
  mounted() {
    this.reloadData();
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
      })();
    };
    const _that = this;
    window.addEventListener('resize', function () {
      _that.jsPlumb.deleteEveryEndpoint();
      _that.reloadData();
    });
  },
  created() {
    this.getDialogOption();
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    updateData(data, type, current) {
      if (type === 'estimate') {
        this.estimateIndexes.map((estimate) => {
          if (estimate.eval_aggregation_id === current.eval_aggregation_id) {
            estimate.matrix_data = JSON.stringify(data);
          }
        });
      }
      if (type === 'indicator') {
        this.eval_indicators.map((indicator) => {
          if (indicator.eval_indicator_id === current.eval_indicator_id) {
            indicator.matrix_data = JSON.stringify(data);
          }
        });
      }
    },
    // 深浅色换肤
    listenFunc() {
      const algorithmAll = document.getElementsByClassName('algorithm-style');
      for (let i = 0; i < algorithmAll.length; i++) {
        algorithmAll[i].style.color = this.$themed('--neutral4');
      }
    },
    //鼠标移入事件
    mouseOver(e) {
      const id = document.getElementById(e.currentTarget.id);
      id.style.color = this.$themed('primary-color');
      var connectionList = this.jsPlumb.getAllConnections();
      connectionList.map((item) => {
        if (
          item.sourceId === e.currentTarget.id ||
          item.targetId === e.currentTarget.id
        ) {
          item.setPaintStyle({
            stroke: this.$themed('primary-color'),
            strokeWidth: 1,
          });
        } // 重新绘制线颜色为红色
      });
    },
    //鼠标移出事件
    mouseLeave(e) {
      const id = document.getElementById(e.currentTarget.id);
      id.style.color = this.$themed('neutral4');
      var connectionList = this.jsPlumb.getAllConnections();
      connectionList.map((item) => {
        if (
          item.sourceId === e.currentTarget.id ||
          item.targetId === e.currentTarget.id
        ) {
          item.setPaintStyle({
            stroke: 'var(--neutral4)',
            strokeWidth: 1,
          });
        }
      });
    },
    handleClick(item, type) {
      this.current = item;
      this.type = type;
      this.rows = [];
      this.columns = [];
      const mode = this.getAggAlgorithmMode(item.aggregating_algorithm_id);
      if (type === 'estimate') {
        this.estimateVariables.map((child) => {
          item.aggregation_ids.map((id) => {
            if (child.eval_collection_id === id) {
              this.columns.push({
                key: child.eval_collection_id,
                label: child.name,
              });

              this.rows.push({
                key: child.eval_collection_id,
                label: child.name,
                data: {},
              });
            }
          });
        });
        item.aggregation_ids.map((id) => {
          this.rows.map((row) => {
            if (!row.data[id]) {
              row.data[id] = 1;
            }
          });
        });
        // this.estimateVariables.map((child) => {
        //   console.log(child, this.rows, 555);
        //   this.rows.map((row) => {
        //     if (row.key === child.name) {
        //       row.data[child.name] = 1;
        //     }
        //   });
        // });
        this.estimateIndexes.map((estimate) => {
          if (estimate.eval_aggregation_id === item.eval_aggregation_id) {
            if (estimate.matrix_data) {
              const matrix_data = JSON.parse(estimate.matrix_data);
              if (matrix_data.length === this.rows.length) {
                this.rows = matrix_data;
              } else {
                estimate.matrix_data = JSON.stringify(this.rows);
              }
            } else {
              estimate.matrix_data = JSON.stringify(this.rows);
            }
          }
        });
      }
      if (type === 'indicator') {
        this.estimateIndexes.map((child) => {
          item.aggregation_ids.map((id) => {
            if (child.eval_aggregation_id === id) {
              this.columns.push({
                key: child.eval_aggregation_id,
                label: child.name,
              });

              this.rows.push({
                key: child.eval_aggregation_id,
                label: child.name,
                data: {},
              });
            }
          });
        });
        item.aggregation_ids.map((id) => {
          this.rows.map((row) => {
            if (!row.data[id]) {
              row.data[id] = 1;
            }
          });
        });
        // this.estimateIndexes.map((child) => {
        //   this.rows.map((row) => {
        //     row.data[child.name] = 1;
        //   });
        // });
        this.eval_indicators.map((indicator) => {
          if (indicator.eval_indicator_id === item.eval_indicator_id) {
            if (indicator.matrix_data) {
              const matrix_data = JSON.parse(indicator.matrix_data);
              if (matrix_data.length === this.rows.length) {
                this.rows = matrix_data;
              } else {
                indicator.matrix_data = JSON.stringify(this.rows);
              }
            } else {
              indicator.matrix_data = JSON.stringify(this.rows);
            }
          }
        });
      }

      if (mode === 1) {
        this.$refs.ahpDialog.pre_name = item.name;
        this.$refs.ahpDialog.visible = true;
      }
    },
    change() {
      this.$nextTick(() => {
        this.jsPlumb.repaintEverything();
      });
    },
    reloadData() {
      this.datareload();
      this.$nextTick(() => {
        this.initAll();
        this.connection(this.connlist);
        this.switchContainer(true, true, false);
        window.addEventListener('resize', this.change());
      });
    },
    getDialogOption() {
      //获取全部算法
      this.$request
        .get('/cr/eval/algorithm/getAll', null, { baseURL: '/api/ojj' })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.allAlgorithmOption = data;
        })
        .catch(() => {});
      //格式化算法 type=2
      this.$request
        .get('/cr/eval/algorithm/type', { type: 2 }, { baseURL: '/api/ojj' })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.formAlgorithmOption = data;
        })
        .catch(() => {});
      // 检测算法 type=3
      this.$request
        .get('/cr/eval/algorithm/type', { type: '3' }, { baseURL: '/api/ojj' })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.modelAlgorithmOption = data;
        })
        .catch(() => {});
      // 评分算法type =1
      this.$request
        .get('/cr/eval/algorithm/type', { type: '1' }, { baseURL: '/api/ojj' })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.scoreAlgorithmOption = data;
        })
        .catch(() => {});
      // // 聚合算法 type=4
      this.$request
        .get('/cr/eval/algorithm/type', { type: '4' }, { baseURL: '/api/ojj' })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.$nextTick(() => {
            this.aggAlgorithmOption = data;
          });
        })
        .catch(() => {});
    },
    exchangeAggAlgorithmOption(id) {
      if (this.aggAlgorithmOption.length > 0) {
        let obj = this.aggAlgorithmOption.find(function (item) {
          return item.eval_algorithm_id === id;
        });
        if (!obj) {
          obj = this.allAlgorithmOption.find(function (item) {
            return item.eval_algorithm_id === id;
          });
        }
        return obj?.name ? obj?.name : '暂未获取到算法';
      }
    },
    getAggAlgorithmMode(id) {
      if (this.aggAlgorithmOption.length > 0) {
        let obj = this.aggAlgorithmOption.find(function (item) {
          return item.eval_algorithm_id === id;
        });
        if (!obj) {
          obj = this.allAlgorithmOption.find(function (item) {
            return item.eval_algorithm_id === id;
          });
        }
        return obj?.mode ? obj?.mode : null;
      }
    },

    datareload() {
      const option = this.jsplumbSetting;
      this.jsPlumb = jsPlumb.getInstance(option);
    },
    initAll() {
      const rl = this.estimateVariables;
      for (let i = 0; i < rl.length; i++) {
        this.init(rl[i].eval_collection_id);
      }
      const rl2 = this.estimateIndexes;
      for (let i = 0; i < rl2.length; i++) {
        this.init(rl2[i].eval_aggregation_id);
        this.init(rl2[i].aggregating_algorithm_id + '-' + rl2[i].name + '-2');
      }
      const rl3 = this.eval_indicators;
      for (let i = 0; i < rl3.length; i++) {
        this.init(rl3[i].eval_indicator_id);
        this.init(rl3[i].aggregating_algorithm_id + '-' + rl3[i].name);
      }
    },
    // 初始化规则使其可以连线
    init(id) {
      const ins = this.jsPlumb;
      const elem = document.getElementById(id);
      ins.makeSource(elem, this.jsplumbSourceOptions);
      ins.makeTarget(elem, this.jsplumbTargetOptions);
    },
    connection(connlist) {
      const ins = this.jsPlumb;
      ins.ready(() => {
        for (let i = 0; i < connlist.length; i++) {
          const conn = connlist[i];
          const connectNode = ins.connect({
            source: conn.sourceNodeId,
            target: conn.targetNodeId,
          });
          connectNode.setPaintStyle({
            stroke: 'var(--neutral3)',
            strokeWidth: 1,
          });
          //重新绘制
          this.jsPlumb.repaintEverything();
        }
      });
    },
    switchContainer(target, source, draggable) {
      const elem = document.getElementsByName('programme-item');
      const ins = this.jsPlumb;
      ins.setSourceEnabled(elem, source);
      ins.setTargetEnabled(elem, target);
      // ins.setDraggable(elem, draggable);
    },
    addnode(elem, list) {
      // 新增画线和节点
      this.jsPlumb.makeSource(elem, this.jsplumbSourceOptions);
      this.jsPlumb.makeTarget(elem, this.jsplumbTargetOptions);

      if (list) {
        this.connection();
      }
    },
    addVariable() {
      // 新增变量项
      this.$refs.vardialogref.edit = false;
      const fetchRedHostReqId = U.guid();
      this.$refs.vardialogref.model = {
        eval_collection_id: fetchRedHostReqId,
        name: '',
        format_algorithm_id: '',
        detection_algorithm_id: '',
        score_algorithm_id: '',
        format_algorithm_params: '',
        detection_algorithm_params: '',
        score_algorithm_params: '',
        eval_indicator_id: '',
      };
      this.varRelatedOptions();
    },
    varRelatedOptions() {
      this.$refs.vardialogref.dataFormatOption = JSON.parse(
        JSON.stringify(this.formAlgorithmOption),
      ); //格式化算法
      this.$refs.vardialogref.detectionModelOption = JSON.parse(
        JSON.stringify(this.modelAlgorithmOption),
      ); //检测算法
      this.$refs.vardialogref.scoringModelOption = JSON.parse(
        JSON.stringify(this.scoreAlgorithmOption),
      ); //评分算法
      //全部算法
      this.$refs.vardialogref.allAlgorithmOption = JSON.parse(
        JSON.stringify(this.allAlgorithmOption),
      );
      this.$refs.vardialogref.dialogVisible = true;
    },
    addIndicators() {
      // 新增指标项
      this.$refs.indicatorsdialogref.edit = false;
      const fetchRedHostReqId = U.guid();
      this.$refs.indicatorsdialogref.model = {
        eval_aggregation_id: fetchRedHostReqId,
        name: '',
        aggregating_algorithm_id: '',
        aggregating_algorithm_params: '',
        aggregation_ids: [],
        eval_indicator_id: '',
      };
      this.indRelatedOptions();
    },
    indRelatedOptions() {
      const option = _.map(this.estimateVariables, (row) => {
        const label = _.get(row, 'name', '');
        const value = _.get(row, 'eval_collection_id', '');
        return _.assign({}, { label, value });
      });
      this.$refs.indicatorsdialogref.assVariableOption = _.cloneDeep(option);
      this.$refs.indicatorsdialogref.aggAlgorithmOption = JSON.parse(
        JSON.stringify(this.aggAlgorithmOption),
      );
      this.$refs.indicatorsdialogref.allAlgorithmOption = JSON.parse(
        JSON.stringify(this.allAlgorithmOption),
      );

      this.$refs.indicatorsdialogref.dialogVisible = true;
    },

    assRelatedOptions() {
      const option = _.map(this.estimateIndexes, (row) => {
        const label = _.get(row, 'name', '');
        const value = _.get(row, 'eval_aggregation_id', '');
        return _.assign({}, { label, value });
      });
      this.$refs.assessmentdialogref.assVariableOption = _.cloneDeep(option);
      this.$refs.assessmentdialogref.aggAlgorithmOption = JSON.parse(
        JSON.stringify(this.aggAlgorithmOption),
      );
      this.$refs.assessmentdialogref.allAlgorithmOption = JSON.parse(
        JSON.stringify(this.allAlgorithmOption),
      );

      this.$refs.assessmentdialogref.dialogVisible = true;
    },
    editVariable(item) {
      // 编辑变量项
      if (this.status) {
        this.$refs.vardialogref.model = { ...item };
        this.$refs.vardialogref.edit = true;
        this.varRelatedOptions();
      }
    },
    editIndicators(item) {
      // 编辑指标项
      if (this.status) {
        this.$refs.indicatorsdialogref.model = { ...item };
        this.$refs.indicatorsdialogref.originalAggregation =
          item.aggregation_ids;
        this.$refs.indicatorsdialogref.edit = true;
        this.indRelatedOptions();
      }
    },
    editAssessment(item) {
      // 编辑评估项
      if (this.status) {
        this.$refs.assessmentdialogref.edit = true;
        this.$refs.assessmentdialogref.originalAggregation =
          item.aggregation_ids;
        this.$refs.assessmentdialogref.model = { ...item };
        this.assRelatedOptions();
      }
    },
    deleteVariable(item) {
      // 删除变量项指标
      const data = _.filter(this.connlist, (ele) => {
        return ele.targetNodeId === item.eval_collection_id;
      });
      if (data.length > 0) {
        this.$message.warning(this.$t('assessment.nodeMsg'));
      } else {
        this.estimateVariables = _.filter(this.estimateVariables, (ele) => {
          return ele.eval_collection_id !== item.eval_collection_id;
        });
        this.requireNewConnectionList(
          this.eval_indicators,
          this.estimateIndexes,
        );
      }
    },
    deleteIndicators(item) {
      //删除聚合项

      if (item.aggregation_ids.length > 0) {
        this.$message.warning(this.$t('assessment.nodeMsg'));
      } else {
        const data = _.cloneDeep(this.estimateIndexes);
        const data1 = _.cloneDeep(this.eval_indicators);
        this.estimateIndexes = _.filter(data, (ele) => {
          return ele.eval_aggregation_id !== item.eval_aggregation_id;
        });
        this.eval_indicators = _.map(data1, (ele) => {
          return {
            ...ele,
            aggregation_ids: ele.aggregation_ids.filter((i) => {
              return i !== item.eval_aggregation_id;
            }),
          };
        });
        this.requireNewConnectionList(
          this.eval_indicators,
          this.estimateIndexes,
        );
      }
    },

    deleteNode(nodeId) {
      this.$nextTick(function () {
        this.jsPlumb.removeAllEndpoints(nodeId);
        this.jsPlumb.repaintEverything(); // 重绘制
      });
    },
    getVariableDialog(edit, item) {
      // 获取变量项弹框的配置内容
      if (!edit) {
        if (this.judgeSameName(this.estimateVariables, item)) {
          this.$message.error(this.$t('assessment.duplicateName'));
          return;
        }
        this.estimateVariables.push(item);
        this.$nextTick(function () {
          this.addnode(item.eval_collection_id);
        });
      } else {
        const nowEstimateVariables = [...this.estimateVariables].filter(
          (ele) => {
            return ele.eval_collection_id !== item.eval_collection_id;
          },
        );
        if (this.judgeSameName(nowEstimateVariables, item)) {
          this.$message.error(this.$t('assessment.duplicateName'));
          return;
        }
        // _.unionBy([item], this.estimateVariables, 'eval_collection_id');
        this.estimateVariables = this.estimateVariables.map((ele) => {
          if (ele.eval_collection_id === item.eval_collection_id) {
            return {
              ...item,
            };
          } else {
            return {
              ...ele,
            };
          }
        });
        this.requireNewConnectionList(
          this.eval_indicators,
          this.estimateIndexes,
        );
        // this.jsPlumb.repaint();
      }
    },
    judgeSameName(data, item) {
      let result = false;
      data.forEach((ele) => {
        if (ele.name === item.name) {
          result = true;
        }
      });

      return result;
    },
    getIndicatorsDialog(edit, item) {
      const mode = this.getAggAlgorithmMode(item.aggregating_algorithm_id);
      if (!mode) {
        item.matrix_data = null;
      }
      // 如果是层次分析法默认值
      if (mode) {
        const matrix_data = [];
        this.estimateVariables.map((child) => {
          item.aggregation_ids.map((id) => {
            if (child.eval_collection_id === id) {
              matrix_data.push({
                key: child.eval_collection_id,
                label: child.name,
                data: {},
              });
            }
          });
        });
        item.aggregation_ids.map((id) => {
          matrix_data.map((row) => {
            if (!row.data[id]) {
              row.data[id] = 1;
            }
          });
        });
        item.matrix_data = JSON.stringify(matrix_data);
      }
      // 获取指标项的配置内容
      if (!edit) {
        // 新增新代码
        if (this.judgeSameName(this.estimateIndexes, item)) {
          this.$message.error(this.$t('assessment.duplicateName'));
          return;
        }
        this.estimateIndexes.push(item);
        this.requireNewConnectionList(
          this.eval_indicators,
          this.estimateIndexes,
        );
      } else {
        //编辑新代码
        //判斷名字是不是相同的,要把修改的自己去掉
        const nowEstimateIndexes = [...this.estimateIndexes].filter((ele) => {
          return ele.eval_aggregation_id !== item.eval_aggregation_id;
        });
        if (this.judgeSameName(nowEstimateIndexes, item)) {
          this.$message.error(this.$t('assessment.duplicateName'));
          return;
        }
        this.estimateIndexes = this.estimateIndexes.map((ele) => {
          if (ele.eval_aggregation_id === item.eval_aggregation_id) {
            return {
              ...item,
            };
          } else {
            return {
              ...ele,
            };
          }
        });
        this.requireNewConnectionList(
          this.eval_indicators,
          this.estimateIndexes,
        );
      }
    },

    getAssessmentDialog(edit, item) {
      const mode = this.getAggAlgorithmMode(item.aggregating_algorithm_id);
      if (!mode) {
        item.matrix_data = null;
      }
      //如果是层次分析法默认值
      if (mode) {
        const matrix_data = [];
        this.estimateIndexes.map((child) => {
          item.aggregation_ids.map((id) => {
            if (child.eval_aggregation_id === id) {
              matrix_data.push({
                key: child.eval_aggregation_id,
                label: child.name,
                data: {},
              });
            }
          });
        });
        item.aggregation_ids.map((id) => {
          matrix_data.map((row) => {
            if (!row.data[id]) {
              row.data[id] = 1;
            }
          });
        });
        item.matrix_data = JSON.stringify(matrix_data);
      }
      if (!edit) {
        //新增新代码
        this.eval_indicators.push(item);
        this.requireNewConnectionList(
          this.eval_indicators,
          this.estimateIndexes,
        );
      } else {
        this.eval_indicators = this.eval_indicators.map((ele) => {
          if (ele.eval_indicator_id === item.eval_indicator_id) {
            return {
              ...item,
            };
          } else {
            return {
              ...ele,
            };
          }
        });
        this.requireNewConnectionList(
          this.eval_indicators,
          this.estimateIndexes,
        );
      }
    },
    //每次变化处理连线封装
    requireNewConnectionList(eval_indicators, estimateIndexes) {
      const list = [];
      if (estimateIndexes.length > 0) {
        eval_indicators.forEach((element) => {
          if (element.aggregation_ids.length > 0) {
            list.push({
              sourceNodeId: element.eval_indicator_id,
              targetNodeId:
                element.aggregating_algorithm_id + '-' + element.name,
            });
          }
          element.aggregation_ids.forEach((item) => {
            list.push({
              sourceNodeId:
                element.aggregating_algorithm_id + '-' + element.name,
              targetNodeId: item,
            });
          });
        });
      }
      estimateIndexes.forEach((element) => {
        if (element.aggregation_ids.length > 0) {
          list.push({
            sourceNodeId: element.eval_aggregation_id,
            targetNodeId:
              element.aggregating_algorithm_id + '-' + element.name + '-2',
          });
        }
        element.aggregation_ids.forEach((item) => {
          list.push({
            sourceNodeId:
              element.aggregating_algorithm_id + '-' + element.name + '-2',
            targetNodeId: item,
          });
        });
      });
      this.connlist = list;

      // return list
      this.$nextTick(() => {
        this.jsPlumb.deleteEveryEndpoint();
        this.initAll();
        this.connection(list);
      });
    },
  },
};
</script>
<style lang="scss">
#container {
  display: flex;
  justify-content: space-between;
  .diagram-flow-label {
    margin-top: -10px;
  }
}
</style>
<style lang="scss" scoped>
.flex {
  width: 20%;
  min-width: 266px;
}
#container {
  position: relative;
  background: transparent;
  width: 100%;
  min-height: 320px;
}
.diagram-detail {
  .diagram-detail-item {
    width: 100%;
    height: 40px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    background-color: var(--bg-color-3);
    position: relative;
    color: var(--neutral8);
    border: 0px;
    z-index: 9;
    cursor: pointer;
    &:hover {
      .diagram-detail-item-content {
        background-color: var(--neutral0);
      }
    }
    &:after {
    }
    .diagram-detail-item-content {
      padding-left: 12px;
      padding-right: 16px;
      width: 100%;
      height: 100%;
      min-width: 266px;
      height: 40px;
      line-height: 40px;
      color: var(--neutral8);
    }
    &:hover {
      .icon {
        opacity: 1;
      }
    }
    .icon {
      opacity: 0;
      position: absolute;
      top: 0px;
      right: 6px;
      font-size: 18px;
      font-weight: 400;
    }
    & > span {
      position: relative;
      display: block;
    }
  }
}
.col {
  min-width: 266px;
  min-height: 320px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  &:last-child {
    margin-right: 0;
  }

  .title {
    color: var(--neutral8);
    font-size: 14px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border: 0;
    background-color: var(--bg-color-3);
    margin-bottom: 8px;
    .cb-iconfont {
      float: right;
      width: 12px;
      margin-right: 16px;
      margin-top: 12px;
    }
  }
}
.diagram-detail {
  .diagram-detail-item {
    margin: 8px 0;
  }
}
.estimate_scheme {
  // 算法位置
  height: 40px;
  line-height: 40px;
  margin-top: 48px;
  position: relative;
  text-align: center;
}
.estimate_scheme_key {
  display: block;
  padding: 0px 2px;
  text-align: center;
  width: 100%;
  margin: 0px auto 8px;
  height: 40px;
  position: relative;
  span {
    color: var(--neutral4); //算法颜色
    font-size: 12px;
    position: absolute;
    left: 10%;
    padding: 0 2px;
    display: inline-block;
    max-width: 60%;
    height: 40px;
    margin: 0px 30% 8px 0;
    cursor: pointer;
    overflow: hidden;
  }
}
</style>
