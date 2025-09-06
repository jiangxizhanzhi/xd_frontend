<template>
  <!-- 评估详情弹框 -->
  <div class="assess-detail-dialog">
    <div class="item-group">
      <div
        :class="['item-title', { active: index === clickIndex }]"
        v-for="(item, index) in variableGroup"
        :key="item.id"
        @click="itemClick(index, item)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="item-content">
      <div class="tab-btn">
        <span
          :class="['tab-title', { tab: index === tabIndex }]"
          v-for="(item, index) in tabGroup"
          :key="item.id"
          @click="tabClick(index)"
          >{{ item.name }}</span
        >
      </div>
      <div v-show="!tabIndex" class="main-content">
        <div
          v-show="!tabIndex"
          style="height: 450px"
          ref="line"
          class="echart-content"
        ></div>
      </div>
      <div class="no_data" v-if="this.noData">
        <div class="info">
          <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
          {{ this.$t('m.noData') }}
        </div>
      </div>
      <div v-if="tabIndex" class="main-content2">
        <cb-search-table
          :scroll="{ y: 400 }"
          :cols="columns"
          :url="tableUrl"
          :baseURL="baseURL"
          :data="model"
          :searchBarBg="false"
        ></cb-search-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as Echarts from 'echarts';
import {
  getVariableList,
  getGraphData,
  getTableData,
} from '@/api/web/assess-detail.js';
export default {
  name: 'assessDetailDialog',
  props: {
    indexId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      noData: false,
      detailDialogVisible: true,
      variableGroup: [],
      clickIndex: 0,
      variable_id: '0',
      tabIndex: 0,
      tabGroup: [
        {
          id: 0,
          name: this.$t('test.lineChart'),
        },
        {
          id: 1,
          name: this.$t('test.originalData'),
        },
      ],
      columns: [
        {
          label: this.$t('test.collectHost'),
          prop: 'node_ip',
          width: 150,
        },
        {
          label: this.$t('test.collectTime'),
          prop: 'collection_time',
          width: 150,
        },
        {
          label: this.$t('test.originalData'),
          prop: 'content',
        },
      ],
      tableData: [],
      chart: null,
      options: {
        tooltip: {
          show: true,
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
            color: '#7988A6',
          },
          data: [],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            color: '#7988A6',
          },
          splitLine: {
            lineStyle: {
              color: '#ffffff',
              width: 0.1,
            },
          },
        },
        color: ['#0BDAFF'],
        series: [
          {
            type: 'line',
            data: [],
            symbol: 'circle',
          },
        ],
        grid: {
          left: 40,
          right: 40,
          bottom: 10,
          containLabel: true,
        },
      },
      tableUrl: '', // /cr/eval/record/variables/data
      baseURL: '/api/ojj',
      model: {
        variable_id: '',
      },
    };
  },
  mounted() {
    this.initLine();
    this.getVariable(this.indexId);
  },
  methods: {
    // 获取三级指标项下全部变量项
    getVariable(id) {
      getVariableList({ index_id: id }).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        if (list.length) {
          this.variableGroup = list;
          this.variable_id = this.variableGroup[0].id;
          this.getGraph(this.variable_id);
        }
      });
    },

    // 折线图初始化
    initLine() {
      this.chart = Echarts.init(this.$refs.line);
      this.chart.setOption(this.options);
    },

    getGraph(id) {
      getGraphData({ variable_id: id }).then((res) => {
        const data = _.get(res, 'data.data', {});
        if (data) {
          if (data.time.length) {
            this.noData = false;
            const xTimeList = data.time.map((item) =>
              item.substring(5, item.length - 3),
            );
            const yValueList = data.value;
            // TODO: is_matched处理
            const matchedList = data.is_matched;
            this.options.visualMap = this.getVisualMap(matchedList);
            this.options.xAxis.data = xTimeList;
            this.options.series[0].data = yValueList;
            this.chart.setOption(this.options);
          } else {
            this.emptyLine();
            this.noData = true;
          }
        }
      });
    },

    getVisualMap(matchedList) {
      let pieces = [];
      matchedList.forEach((item, index) => {
        if (item) {
          if (matchedList[index + 1]) {
            pieces.push({
              gte: index,
              lt: index + 1,
              color: '#FF3045',
            });
          } else if (!matchedList[index + 1]) {
            pieces.push({
              gte: index,
              lte: index,
              color: '#FF3045',
            });
            if (index + 1 <= matchedList.length - 1) {
              pieces.push({
                gt: index,
                lt: index + 1,
                color: '#0BDAFF',
              });
            } else {
              pieces.push({
                gt: index,
                color: '#0BDAFF',
              });
            }
          }
        } else {
          pieces.push({
            gte: index,
            lt: index + 1,
            color: '#0BDAFF',
          });
        }
      });
      return {
        show: false,
        dimension: 0,
        pieces: pieces,
      };
    },

    getTable() {
      /* getTableData({ variable_id: this.variable_id }).then((res) => {
        const list = _.get(res, 'data.data.list', []) || [];
        this.tableData = list;
      }); */
      this.model.variable_id = this.variable_id;
      this.tableUrl = '/cr/eval/record/variables/data';
    },
    itemClick(index, item) {
      this.emptyLine();
      this.clickIndex = index;
      this.variable_id = item.id;
      if (this.tabIndex) {
        this.getTable();
      } else {
        this.getGraph(this.variable_id);
      }
    },

    emptyLine() {
      this.options.xAxis.data = [];
      this.options.series[0].data = [];
      this.chart.setOption(this.options);
    },

    tabClick(index) {
      this.emptyLine();
      this.tabIndex = index;
      if (!index) {
        this.getGraph(this.variable_id);
      } else {
        this.noData = false;
        this.getTable();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.item-group::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.item-group::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color);
  border-radius: 4px;
}
.item-group {
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  border-bottom: 1px solid var(--neutral3);
  margin-bottom: 16px;
  .item-title {
    margin-right: 24px;
    padding: 12px 0;
    cursor: pointer;
    display: inline-block;
  }
  .active {
    border-bottom: solid 2px var(--primary-color);
  }
}
.item-content {
  position: relative;
  .no_data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%);
    transform: translateY(-50%);
    .info {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
    }
  }
  .tab-btn {
    display: flex;
    justify-content: end;
    margin-bottom: 8px;
    span.tab-title {
      padding: 0 10px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: var(--neutral8);
      background-color: var(--bg-color-3);
      cursor: pointer;
      font-size: 14px;
      width: 96px;
    }
    span.tab {
      background-color: var(--bg-color-4);
      color: var(--primary-color);
    }
  }
  .main-content {
    padding: 10px;
    .echart-content {
      position: relative;
      top: -30px;
    }
  }
}
</style>
