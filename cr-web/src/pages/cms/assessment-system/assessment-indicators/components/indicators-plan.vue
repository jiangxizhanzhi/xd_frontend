<template>
  <div class="diagram-box">
    <div id="container">
      <div class="assessment-item col flex">
        <div class="title">
          <!-- 一级指标 -->
          <span>{{ $t('assessment.firstIndicators') }}</span>
        </div>
        <div class="diagram-detail">
          <div
            v-for="item in first_indexes"
            :id="item.index_id"
            :key="item.index_id"
            class="diagram-detail-item"
            name="programme-item"
          >
            <div
              class="diagram-detail-item-content one-overflow"
              round
              @click="editAssessment(item)"
            >
              <span :title="item.name"> {{ item.name }} </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 第一个算法 -->
      <div class="estimate_scheme flex">
        <div
          class="estimate_scheme_key"
          v-for="(item, index) in first_indexes"
          :key="item.algorithm_id"
          @click="handleClick(item, 'first')"
        >
          <span
            :id="item.algorithm_id + '-' + item.name"
            :key="item.algorithm_id"
            @mouseover="mouseOver($event)"
            @mouseleave="mouseLeave($event)"
            class="algorithm-style one-overflow"
            >{{
              item.children_ids.length > 0
                ? exchangeAggAlgorithmOption(item.algorithm_id)
                : ''
            }}</span
          >
        </div>
      </div>
      <!-- 二级指标 -->

      <div class="indicators-item col flex">
        <div class="title">
          <span>{{ $t('assessment.secondIndicators') }}</span>
          <span v-if="status" @click="addIndicators" style="cursor: pointer">
            <cb-iconfont type="icon-xinzeng"></cb-iconfont
          ></span>
        </div>
        <div class="diagram-detail">
          <div
            v-for="item in second_indexes"
            :id="item.index_id"
            :key="item.index_id"
            class="diagram-detail-item"
            name="programme-item"
          >
            <div
              class="diagram-detail-item-content one-overflow"
              round
              @click="editIndicators(item)"
            >
              <span :title="item.name"> {{ item.name }}</span>
              <!-- 删除按钮 -->
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
          :key="item.algorithm_id + '-' + item.name + '-2'"
          v-for="(item, index) in second_indexes"
          @click="handleClick(item, 'second')"
        >
          <span
            :id="item.algorithm_id + '-' + item.name + '-2'"
            :key="item.algorithm_id + '-' + item.name + '-2'"
            @mouseover="mouseOver($event)"
            @mouseleave="mouseLeave($event)"
            class="algorithm-style one-overflow"
            >{{
              item.children_ids.length > 0
                ? exchangeAggAlgorithmOption(item.algorithm_id)
                : ''
            }}</span
          >
        </div>
      </div>

      <div class="variable-item col flex">
        <div class="title">
          <!-- 三级指标 -->
          <span>{{ $t('assessment.thirdIndicators') }}</span>
          <span v-if="status" @click="addVariable" style="cursor: pointer">
            <cb-iconfont type="icon-xinzeng"></cb-iconfont
          ></span>
        </div>
        <div class="diagram-detail">
          <div
            v-for="item in third_indexes"
            :id="item.index_id"
            :key="item.index_id"
            class="diagram-detail-item"
            name="programme-item"
          >
            <div class="one-overflow diagram-detail-item-content" round>
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
    <variable-dialog
      ref="vardialogref"
      @variable-change="getVariableDialog"
      :third_indexes="third_indexes"
      :thirdList="thirdList"
    />
    <indicators-dialog
      ref="indicatorsdialogref"
      @indicators-change="getIndicatorsDialog"
    />
    <assessment-dialog
      ref="assessmentdialogref"
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
    third_indexesOragin: {
      type: Array,
      default: () => [],
    },
    second_indexesOragin: {
      type: Array,
      default: () => [],
    },
    estimateItemsOragin: {
      type: Array,
      default: () => [],
    },
    resourceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      thirdList: [],
      screenWidth: document.body.clientWidth,
      formAlgorithmOption: [], // 格式化算法option
      modelAlgorithmOption: [], // 检测模型算法option
      scoreAlgorithmOption: [], // 评分算法option
      aggAlgorithmOption: [], // 聚合算法option
      allAlgorithmOption: [], //所有算法的option
      third_indexes: [], // 变量项数据
      second_indexes: [], // 指标项数据
      first_indexes: [],
      connlist: [], // 连线数组
      connectedThreeIds: [], //已经连上三级的id数组
      columns: [],
      rows: [],
      type: '',
      current: {},
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
      if (type === 'first') {
        this.first_indexes.map((first) => {
          if (first.index_id === current.index_id) {
            first.matrix_data = JSON.stringify(data);
          }
        });
      }
      if (type === 'second') {
        this.second_indexes.map((second) => {
          if (second.index_id === current.index_id) {
            second.matrix_data = JSON.stringify(data);
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
      const mode = this.getAggAlgorithmMode(item.algorithm_id);
      if (mode == 1) {
        this.$refs.ahpDialog.pre_name = item.name;
        this.$refs.ahpDialog.visible = true;
      }
      this.current = item;
      this.type = type;
      this.rows = [];
      this.columns = [];
      if (type === 'first') {
        this.second_indexes.map((second) => {
          item.children_ids.map((id) => {
            if (second.index_id === id) {
              this.columns.push({
                key: second.index_id,
                label: second.name,
              });
              this.rows.push({
                key: second.index_id,
                label: second.name,
                data: {},
              });
            }
          });
        });
        item.children_ids.map((id) => {
          this.rows.map((row) => {
            if (!row.data[id]) {
              row.data[id] = 1;
            }
          });
        });
        this.first_indexes.map((first) => {
          if (first.index_id === item.index_id) {
            if (first.matrix_data) {
              const matrix_data = JSON.parse(first.matrix_data);
              if (matrix_data.length === this.rows.length) {
                this.rows = matrix_data;
              } else {
                first.matrix_data = JSON.stringify(this.rows);
              }
            } else {
              first.matrix_data = JSON.stringify(this.rows);
            }
          }
        });
      }
      if (type === 'second') {
        this.third_indexes.map((third) => {
          item.children_ids.map((id) => {
            if (third.index_id === id) {
              this.columns.push({
                key: third.index_id,
                label: third.name,
              });
              this.rows.push({
                key: third.index_id,
                label: third.name,
                data: {},
              });
            }
          });
        });
        item.children_ids.map((id) => {
          this.rows.map((row) => {
            if (!row.data[id]) {
              row.data[id] = 1;
            }
          });
        });
        this.second_indexes.map((second) => {
          if (second.index_id === item.index_id) {
            if (second.matrix_data) {
              const matrix_data = JSON.parse(second.matrix_data);
              if (matrix_data.length === this.rows.length) {
                this.rows = matrix_data;
              } else {
                second.matrix_data = JSON.stringify(this.rows);
              }
            } else {
              second.matrix_data = JSON.stringify(this.rows);
            }
          }
        });
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
        .get('/cr/eval/algorithm/getAll', {}, { baseURL: '/api/ojj' })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.allAlgorithmOption = data;
        })
        .catch(() => {});
      //聚合算法 type=4
      this.$request
        .get('/cr/eval/algorithm/type', { type: 4 }, { baseURL: '/api/ojj' })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.aggAlgorithmOption = data;
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
      const rl3 = this.first_indexes;
      for (let i = 0; i < rl3.length; i++) {
        this.init(rl3[i].index_id);
        this.init(rl3[i].algorithm_id + '-' + rl3[i].name);
      }

      const rl = this.third_indexes;
      for (let i = 0; i < rl.length; i++) {
        this.init(rl[i].index_id);
      }
      const rl2 = this.second_indexes;
      for (let i = 0; i < rl2.length; i++) {
        this.init(rl2[i].index_id);
        this.init(rl2[i].algorithm_id + '-' + rl2[i].name + '-2');
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
      // 获取三级指标的数据请求
      let arr = [];
      this.second_indexes.forEach((item) => {
        item.children_ids.forEach((ele) => {
          arr.push(ele);
        });
      });
      this.connectedThreeIds = [...new Set(arr)];
      this.$request
        .get(
          'cr/eval/indicator/list',
          { per_page: 5000 },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.thirdList = res.data.data.list.map((item) => {
            return {
              ...item,
              index_id: item.eval_indicator_id,
              disabled: this.connectedThreeIds.includes(item.eval_indicator_id),
            };
          });
        });

      // 新增变量项
      this.$refs.vardialogref.edit = false;
      this.varRelatedOptions();
    },
    varRelatedOptions() {
      this.$refs.vardialogref.dataFormatOption = this.formAlgorithmOption;
      this.$refs.vardialogref.detectionModelOption = this.modelAlgorithmOption;
      this.$refs.vardialogref.scoringModelOption = this.scoreAlgorithmOption;
      this.$refs.vardialogref.dialogVisible = true;
    },
    addIndicators() {
      // 新增指标项
      this.$refs.indicatorsdialogref.edit = false;
      const fetchRedHostReqId = U.guid();
      this.$refs.indicatorsdialogref.model = {
        index_id: fetchRedHostReqId,
        name: '',
        algorithm_id: '',
        params: '',
        children_ids: [],
      };
      this.indRelatedOptions();
    },
    indRelatedOptions() {
      const option = _.map(this.third_indexes, (row) => {
        const label = _.get(row, 'name', '');
        const value = _.get(row, 'index_id', '');
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
      const option = _.map(this.second_indexes, (row) => {
        const label = _.get(row, 'name', '');
        const value = _.get(row, 'index_id', '');
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
        this.$refs.vardialogref.model = item;
        this.$refs.vardialogref.edit = true;
        this.varRelatedOptions();
      }
    },
    editIndicators(item) {
      // 编辑指标项
      if (this.status) {
        this.$refs.indicatorsdialogref.model = { ...item };
        this.$refs.indicatorsdialogref.originalAggregation = item.children_ids;
        this.$refs.indicatorsdialogref.edit = true;
        this.indRelatedOptions();
      }
    },
    editAssessment(item) {
      // 编辑评估项
      if (this.status) {
        this.$refs.assessmentdialogref.edit = true;
        this.$refs.assessmentdialogref.originalAggregation = item.children_ids;
        this.$refs.assessmentdialogref.model = { ...item };
        this.assRelatedOptions();
      }
    },
    deleteVariable(item) {
      // 删除变量项指标
      const data = _.filter(this.connlist, (ele) => {
        return ele.targetNodeId === item.index_id;
      });
      if (data.length > 0) {
        this.$message.warning(this.$t('assessment.nodeMsg'));
      } else {
        this.third_indexes = _.filter(this.third_indexes, (ele) => {
          return ele.index_id !== item.index_id;
        });
        this.requireNewConnectionList(this.first_indexes, this.second_indexes);
      }
    },
    deleteIndicators(item) {
      //删除新代码

      if (item.children_ids.length > 0) {
        this.$message.warning(this.$t('assessment.nodeMsg'));
      } else {
        const data = _.cloneDeep(this.second_indexes);
        const data1 = _.cloneDeep(this.first_indexes);
        this.second_indexes = _.filter(data, (ele) => {
          return ele.index_id !== item.index_id;
        });
        this.first_indexes = _.map(data1, (ele) => {
          return {
            ...ele,
            children_ids: ele.children_ids.filter((i) => {
              return i !== item.index_id;
            }),
          };
        });
        this.requireNewConnectionList(this.first_indexes, this.second_indexes);
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
        this.third_indexes = [...item];
        //重新渲染连线
        this.requireNewConnectionList(this.first_indexes, this.second_indexes);
      } else {
        // _.unionBy([item], this.third_indexes, 'index_id');
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
      const mode = this.getAggAlgorithmMode(item.algorithm_id);
      if (!mode) {
        item.matrix_data = null;
      }
      // 如果是层次分析法默认值
      if (mode) {
        const matrix_data = [];
        this.third_indexes.map((child) => {
          item.children_ids.map((id) => {
            if (child.index_id === id) {
              matrix_data.push({
                key: child.index_id,
                label: child.name,
                data: {},
              });
            }
          });
        });
        item.children_ids.map((id) => {
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
        if (this.judgeSameName(this.second_indexes, item)) {
          this.$message.error(this.$t('assessment.duplicateName'));
          return;
        }
        this.second_indexes.push(item);
        this.requireNewConnectionList(this.first_indexes, this.second_indexes);
      } else {
        //编辑新代码
        //判斷名字是不是相同的,要把修改的自己去掉
        const nowsecond_indexes = [...this.second_indexes].filter((ele) => {
          return ele.index_id !== item.index_id;
        });
        if (this.judgeSameName(nowsecond_indexes, item)) {
          this.$message.error(this.$t('assessment.duplicateName'));
          return;
        }
        this.second_indexes = [...this.second_indexes].map((ele) => {
          if (ele.index_id === item.index_id) {
            return {
              ...item,
            };
          } else {
            return {
              ...ele,
            };
          }
        });
        this.requireNewConnectionList(this.first_indexes, this.second_indexes);
      }
    },

    getAssessmentDialog(edit, item) {
      const mode = this.getAggAlgorithmMode(item.algorithm_id);
      if (!mode) {
        item.matrix_data = null;
      }
      //如果是层次分析法默认值
      if (mode) {
        const matrix_data = [];
        this.second_indexes.map((child) => {
          item.children_ids.map((id) => {
            if (child.index_id === id) {
              matrix_data.push({
                key: child.index_id,
                label: child.name,
                data: {},
              });
            }
          });
        });
        item.children_ids.map((id) => {
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
        this.first_indexes.push(item);
        this.requireNewConnectionList(this.first_indexes, this.second_indexes);
      } else {
        this.first_indexes = this.first_indexes.map((ele) => {
          if (ele.index_id === item.index_id) {
            return {
              ...item,
            };
          } else {
            return {
              ...ele,
            };
          }
        });
        this.requireNewConnectionList(this.first_indexes, this.second_indexes);
      }
    },
    //每次变化处理连线封装
    requireNewConnectionList(first_indexes, second_indexes) {
      const list = [];
      if (second_indexes.length > 0) {
        first_indexes.forEach((element, index) => {
          if (element.children_ids.length > 0) {
            list.push({
              sourceNodeId: element.index_id,
              targetNodeId: element.algorithm_id + '-' + element.name,
            });
          }
          element.children_ids.forEach((item) => {
            list.push({
              sourceNodeId: element.algorithm_id + '-' + element.name,
              targetNodeId: item,
            });
          });
        });
      }
      second_indexes.forEach((element, index) => {
        if (element.children_ids.length > 0) {
          list.push({
            sourceNodeId: element.index_id,
            targetNodeId: element.algorithm_id + '-' + element.name + '-2',
          });
        }
        element.children_ids.forEach((item, index) => {
          list.push({
            sourceNodeId: element.algorithm_id + '-' + element.name + '-2',
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
  min-height: 400px;
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
  min-height: 400px;
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
    position: absolute;
    left: 10%;
    color: var(--neutral4); //算法颜色
    font-size: 12px;
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
