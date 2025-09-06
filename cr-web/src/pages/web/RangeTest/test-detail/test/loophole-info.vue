<template>
  <div class="loophole-info">
    <div class="left-area">
      <cb-scrollbar>
        <div class="tree-data">
          <cb-tree
            class="tree"
            :data="treeData"
            ref="treeList"
            :props="defaultProps"
            default-expand-all
            show-checkbox
            node-key="id"
            highlight-current
            :empty-text="$t('m.noData')"
            @check="handleCheckChange"
          >
            <span class="host-name" slot-scope="{ node, data }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </cb-tree>
        </div>
      </cb-scrollbar>
    </div>
    <div class="right-area">
      <cb-scrollbar>
        <div class="chart">
          <div class="service-area">
            <p class="title">
              <i></i>
              <span>{{ $t('test.serviceVulnTop') }}</span>
            </p>
            <div style="width: 100%; height: 300px">
              <div
                v-show="!topShow"
                style="width: 100%; height: 300px"
                ref="barCharts"
              ></div>
              <div v-show="topShow" class="no-data">
                <div class="info">
                  <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
                  <div>{{ $t('flowEmulation.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="cvss-area">
            <p class="title">
              <i></i>
              <span>{{ $t('test.cvss') }}</span>
            </p>
            <div style="width: 100%; height: 300px">
              <div
                v-show="!pieShow"
                style="width: 100%; height: 300px"
                ref="pieCharts"
              ></div>
              <div v-show="pieShow" class="no-data">
                <div class="info">
                  <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
                  <div>{{ $t('flowEmulation.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="loop-list-area">
          <p class="title">
            <i></i>
            <span>{{ $t('test.vulnList') }}</span>
          </p>
          <div class="table">
            <cb-search-table
              ref="loopTable"
              :cols.sync="loopColumns"
              :data="tableModel"
              :url="loopUrl"
              baseURL="/api/mp"
              :searchBarBg="false"
            >
              <template v-slot:grade="scope">
                <span class="icon icon-one" v-if="scope.data.severity === 'low'"
                  >&nbsp&nbsp</span
                >
                <span
                  class="icon icon-two"
                  v-if="scope.data.severity === 'medium'"
                  >&nbsp&nbsp</span
                >
                <span
                  class="icon icon-three"
                  v-if="scope.data.severity === 'high'"
                  >&nbsp&nbsp</span
                >
                <span
                  class="icon icon-four"
                  v-if="scope.data.severity === 'critical'"
                  >&nbsp&nbsp</span
                >
                <span>{{ getLevel(scope.data.severity) }}</span>
              </template>
            </cb-search-table>
          </div>
        </div>
      </cb-scrollbar>
    </div>
  </div>
</template>

<script>
import * as Echarts from 'echarts';
import {
  getMainInfoList,
  getVulTop10Data,
  getCVSSData,
} from '@/api/web/loophole-info.js';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
export default {
  components: {},
  props: {
    sceneId: {
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
      topShow: true,
      pieShow: true,
      flowValue: null,
      sourceIp: '',
      DestinationIp: '',
      flowOptions: '',
      port: '',
      loopUrl: '',
      flowFirstOption: {
        label: this.$t('test.totalFlow'),
        value: null,
      },
      barWidth: '30px',
      name: [],
      xAxisLineShow: true,
      xData: [],
      barData: [],
      labelShow: false,
      double: true,
      gapShow: false,
      legendLocation: 'right',
      radius: ['60%', '70%'],
      titleText: '1268',
      titleShow: true,
      treeData: [
        {
          id: 1,
          name: this.$t('test.allHosts'),
          children: [],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      loopColumns: [
        {
          label: this.$t('test.hostName'),
          prop: 'node_name',
          width: 200,
          resizable: true,
        },
        {
          label: this.$t('test.cve'),
          prop: 'cve',
        },
        {
          label: this.$t('test.title'),
          prop: 'title',
          width: 200,
          resizable: true,
        },
        {
          label: this.$t('test.grade'),
          slot: 'grade',
        },
        {
          label: this.$t('test.releaseTime'),
          prop: 'published',
        },
        {
          label: this.$t('test.reference'),
          width: 200,
          prop: 'references',
          resizable: true,
        },
        {
          label: this.$t('test.reason'),
          prop: 'rationale',
          width: 200,
          resizable: true,
        },
      ],
      barCharts: null,
      optionsBar: {
        tooltip: {
          //背景颜色
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          //tooltip的文本颜色
          textStyle: {
            color: this.$themed('neutral8'),
          },
          //toolTip显示时,线的显示样式
          axisPointer: {
            lineStyle: {
              color: this.$themed('neutral4'),
              width: 1,
              type: 'solid',
            },
          },
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            inside: false,
            rotate: 40,
            showMinLabel: true,
            showMaxLabel: true,
            verticalAlign: 'top',
            color: this.$themed('neutral4'),
          },
          data: [],
        },
        yAxis: {
          /* name: '(数)',
          nameTextStyle: {
            color: '#7988A6',
          }, */
          axisLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            color: this.$themed('neutral4'),
          },
          splitLine: {
            lineStyle: {
              color: this.$themed('neutral0'),
              width: 1,
            },
          },
        },
        color: [this.$themed('primary-color')],
        series: [
          {
            type: 'bar',
            barWidth: '14',
            data: [],
          },
        ],
        grid: {
          left: 40,
          right: 40,
          bottom: 10,
          containLabel: true,
        },
      },
      // 饼图配置
      pieCharts: null,
      optionsPie: {
        color: [
          this.$themed('yellow-color'),
          this.$themed('orange-color'),
          this.$themed('red-color'),
          '#000000',
        ],
        legend: {
          show: true,
        },
        legend: {
          bottom: 5,
          left: 'center',
          orient: 'horizontal',
          textStyle: {
            color: this.$themed('neutral8'),
          },
          formatter: '{name}',
        },
        grid: {
          left: 40,
          right: 40,
          bottom: 10,
          containLabel: true,
        },
        tooltip: {
          //背景颜色
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          //tooltip的文本颜色
          textStyle: {
            color: this.$themed('neutral8'),
          },
          //toolTip显示时,线的显示样式
          axisPointer: {
            lineStyle: {
              color: this.$themed('neutral4'),
              width: 1,
              type: 'solid',
            },
          },
        },
        series: [
          {
            type: 'pie',

            label: {
              formatter: '{b} {d}%',
              color: this.$themed('neutral8'),
              fontSize: 14,
            },
            labelLine: {
              lineStyle: {
                color: this.$themed('neutral0'),
              },
            },
            radius: ['45%', '60%'],
            center: ['50%', '45%'],
            data: [],
          },
        ],
      },
      tableModel: {
        element_ids: [],
        scene_id: '',
      },
      currentNodeKey: '',
      defaultKey: [],
    };
  },
  watch: {
    // 监听场景id
    sceneId: {
      handler: function (val, oldval) {
        if (val) {
          this.getHostInfo(val);
        } else {
          this.treeData = [
            {
              id: 1,
              name: this.$t('test.allHosts'),
              children: [],
            },
          ];
          this.topShow = true;
          this.pieShow = true;
          this.loopUrl = '';
          this.tableModel.scene_id = '';
          this.$nextTick(() => {
            this.$refs.loopTable.empty();
          });
        }
      },
      immediate: true,
    },
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.listen.createListen();
  },
  mounted() {
    this.initCharts();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      const barTooltip = {
        backgroundColor: this.$themed('bg-color-1'),
        borderWidth: 0,
        show: true,
        textStyle: {
          color: this.$themed('neutral8'),
        },
        axisPointer: {
          lineStyle: {
            color: this.$themed('neutral4'),
            width: 1,
            type: 'solid',
          },
        },
      };
      const barXLable = {
        fontSize: 14,
        inside: false,
        rotate: 40,
        showMinLabel: true,
        showMaxLabel: true,
        verticalAlign: 'top',
        color: this.$themed('neutral4'),
      };
      const barYLable = {
        fontSize: 14,
        color: this.$themed('neutral4'),
      };
      const splitLine = {
        lineStyle: {
          color: this.$themed('neutral0'),
          width: 1,
        },
      };
      const pieTooltip = {
        backgroundColor: this.$themed('bg-color-1'),
        borderWidth: 0,
        show: true,
        textStyle: {
          color: this.$themed('neutral8'),
        },
        axisPointer: {
          lineStyle: {
            color: this.$themed('neutral4'),
            width: 1,
            type: 'solid',
          },
        },
      };
      const pieLengend = {
        bottom: 10,
        left: 'center',
        orient: 'horizontal',
        textStyle: {
          color: this.$themed('neutral8'),
        },
        formatter: '{name}',
      };
      const pieLable = {
        formatter: '{b} {d}%',
        color: this.$themed('neutral8'),
        fontSize: 16,
      };
      const pieLableLine = {
        lineStyle: {
          color: this.$themed('neutral0'),
        },
      };
      this.optionsBar.tooltip = barTooltip;
      this.optionsBar.xAxis.axisLabel = barXLable;
      this.optionsBar.yAxis.axisLabel = barYLable;
      this.optionsBar.yAxis.splitLine = splitLine;
      this.optionsBar.color = [this.$themed('primary-color')];
      this.optionsPie.tooltip = pieTooltip;
      this.optionsPie.legend = pieLengend;
      this.optionsPie.series[0].label = pieLable;
      this.optionsPie.series[0].labelLine = pieLableLine;
      this.optionsPie.color = [
        this.$themed('yellow-color'),
        this.$themed('orange-color'),
        this.$themed('red-color'),
        '#000000',
      ];
      this.barCharts.setOption(this.optionsBar);
      this.pieCharts.setOption(this.optionsPie);
    },
    getLevel(level) {
      switch (level) {
        case 'low': {
          return this.$t('test.lowRisk');
        }
        case 'medium': {
          return this.$t('test.mediumRisk');
        }
        case 'high': {
          return this.$t('test.highRisk');
        }
        case 'critical': {
          return this.$t('test.extremelyRisk');
        }
      }
    },

    // 获取主机信息
    getHostInfo(id) {
      getMainInfoList(id).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        if (list.length) {
          const tempList = [];
          list.forEach((item) => {
            tempList.push({
              id: item.id,
              name: item.name,
            });
          });
          this.treeData[0].children = tempList;
          this.$nextTick(() => {
            //默认选中全部主机
            if (this.$refs.treeList != undefined) {
              this.$refs.treeList.setCheckedNodes(this.treeData);
              const element_ids = this.$refs.treeList
                .getCheckedKeys()
                .filter((item) => item != 1);
              this.getVulnerabilityTop10(element_ids);
              this.getCVSS(element_ids);
              this.getVluTable(element_ids);
            }
          });
        } else {
          this.handleCheckChange();
        }
      });
    },

    // echarts初始化
    initCharts() {
      this.barCharts = Echarts.init(this.$refs.barCharts);
      this.barCharts.setOption(this.optionsBar);
      this.pieCharts = Echarts.init(this.$refs.pieCharts);
      this.pieCharts.setOption(this.optionsPie);
    },

    handleCheckChange() {
      if (!this.sceneId) {
        return;
      }
      const list = this.$refs.treeList.getCheckedNodes(false, false);
      const element_ids = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === 1) {
          continue; // 过滤掉主机"全部主机"这个假id
        }
        element_ids.push(list[i].id);
      }
      this.getVulnerabilityTop10(element_ids);
      this.getCVSS(element_ids);
      this.getVluTable(element_ids);
    },

    // top10柱状图
    getVulnerabilityTop10(ids) {
      const params = {
        element_ids: ids,
        scene_id: this.sceneId,
      };
      getVulTop10Data(params).then((res) => {
        const list = _.get(res, 'data.data.list', []) || [];
        if (list.length) {
          this.topShow = false;
          this.$nextTick(() => this.barCharts.resize());
          const xAxisList = [],
            yAxisList = [];
          list.forEach((item) => {
            xAxisList.push(item.package_name);
            yAxisList.push(item.count);
          });
          this.optionsBar.xAxis.data = xAxisList;
          this.optionsBar.series[0].data = yAxisList;
          this.barCharts.setOption(this.optionsBar);
        } else {
          this.topShow = true;
          this.emptyCharts();
        }
      });
    },

    emptyCharts() {
      this.optionsBar.xAxis.data = [];
      this.optionsBar.series[0].data = [];
      this.barCharts.setOption(this.optionsBar);
    },
    // 饼图
    getCVSS(ids) {
      const params = {
        element_ids: ids,
        scene_id: this.sceneId,
      };
      getCVSSData(params).then((res) => {
        const list = _.get(res, 'data.data.list', []) || [];
        if (list.length) {
          this.pieShow = false;
          this.$nextTick(() => this.pieCharts.resize());
          const tempList = list.map((item) => {
            return {
              name: this.getCVSSName(item.severity),
              value: item.percent,
            };
          });
          this.optionsPie.series[0].data = tempList;
          this.pieCharts.setOption(this.optionsPie);
        } else {
          this.pieShow = true;
          this.optionsPie.series[0].data = [];
          this.pieCharts.setOption(this.optionsPie);
        }
      });
    },

    getCVSSName(level) {
      if (level === 'unknown') {
        return this.$t('test.unknown');
      } else if (level === 'low') {
        return this.$t('test.lowRisk');
      } else if (level === 'medium') {
        return this.$t('test.mediumRisk');
      } else if (level === 'high') {
        return this.$t('test.highRisk');
      } else if (level === 'critical') {
        return this.$t('test.extremelyRisk');
      }
    },

    // 漏洞列表
    getVluTable(ids) {
      this.loopUrl = '/cscene/monitor/scene/element/get_vulnerability_list';
      this.tableModel = {
        element_ids: ids,
        scene_id: this.sceneId,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.tree ::v-deep .el-tree-node.is-current > .el-tree-node__content {
  background-color: transparent !important;
}
.loophole-info {
  display: flex;
  width: 100%;
  height: 100%;
  .left-area {
    width: 15%;
    border-right: 1px solid var(--neutral3);
    padding: 5px 10px 5px 15px;
    font-size: 14px;
    .host-name {
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    ::v-deep .el-tree-node {
      margin-top: 8px;
    }
  }
  .right-area {
    width: 85%;
    padding: 15px 10px 15px 15px;
    .chart {
      display: flex;
      justify-content: space-between;
      .service-area {
        width: 50%;
        padding: 15px 10px;
        background-color: var(--neutral0);
      }
      .cvss-area {
        width: 50%;
        margin-left: 15px;
        padding: 15px 10px;
        background-color: var(--neutral0);
      }
    }
    .loop-list-area {
      margin-top: 15px;
      background-color: var(--neutral0);
      padding: 15px 10px;
      .table {
        margin-top: 20px;
        padding: 0px 10px;
      }
    }
    .title {
      color: var(--neutral8);
      margin: 0 0 0 10px;
      line-height: 14px;
      font-size: 16px;
      i {
        display: inline-block;
        width: 6px;
        height: 8px;
        margin-right: 5px;
        margin-bottom: 2px;
        background: var(--primary-color);
      }
    }
  }
  ::v-deep .el-tree-node__expand-icon {
    display: none;
  }
  ::v-deep .el-tree-node__content {
    padding-left: 0px !important;
  }
  .icon {
    display: inline-block;
    height: 8px;
    height: 8px;
    border-radius: 8px;
    position: relative;
    top: 6px;
    right: 2px;
  }
  .icon-one {
    background: var(--yellow-color);
  }
  .icon-two {
    background: var(--orange-color);
  }
  .icon-three {
    background: var(--red-color);
  }
  .icon-four {
    background: #000000;
  }
  .no-data {
    height: 100%;
    width: 100%;
    text-align: center;
    position: relative;
    .info {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
    }
  }
}
</style>
