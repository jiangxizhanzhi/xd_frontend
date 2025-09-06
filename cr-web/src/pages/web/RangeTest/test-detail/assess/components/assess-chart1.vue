<template>
  <!-- 评估详情弹框 -->
  <div class="assess-detail-dialog">
    <div class="item-group">
      <div
        :class="currentClickNumber > 0 ? 'arrow' : 'arrow arrowOpacity'"
        @click="fnPrev()"
      >
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="fixed-box" ref="fixedBox">
        <div
          class="item-warp"
          ref="centerScrollRef"
          :style="`width:${centerScrollWidth}px;transform:translate(${scrollResultWidth}px,0);transition:1s;`"
        >
          <div
            :class="['item-title', { active: index === clickIndex }]"
            v-for="(item, index) in variableGroup"
            :key="item.id"
            @click="itemClick(index, item)"
            :title="item.label"
          >
            <span class="title-one">{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div
        :class="noScrollRight ? 'arrow' : 'arrow arrowOpacity'"
        @click="fnNext(activeName)"
      >
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="border-style"></div>
    <div class="item-content">
      <div class="tab-btn">
        <cb-radio-group v-model="tabIndex" @change="handleChange">
          <cb-radio-button :label="0">{{
            $t('test.lineChart')
          }}</cb-radio-button>
          <cb-radio-button :label="1">{{
            $t('assessment.originalData')
          }}</cb-radio-button>
        </cb-radio-group>
      </div>
      <div v-show="!tabIndex" class="main-content">
        <!-- <div
          v-show="!tabIndex"
          style="height: 450px"
          ref="line"
          class="echart-content"
        ></div> -->
        <iframe
          v-show="!tabIndex"
          style="width: 100%; height: 450px"
          :src="iframeURL"
          frameborder="0"
        ></iframe>
      </div>
      <!-- <div class="no_data" v-if="this.noData">
        <div
          style="
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page ref="emptyComp" />
        </div>
      </div> -->
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
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
import EmptyPage from '@/pages/web/Empty';
import { getToken } from '@cyber/helper';

export default {
  name: 'assessDetailDialog',
  components: {
    EmptyPage,
  },
  props: {
    indexId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      jwtToken: getToken(),
      iframeURL: '',
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      centerScrollWidth: '',
      scrollResultWidth: 0, //transform滚动的距离
      currentClickNumber: 0,
      noScrollRight: true,
      activeName: 0,
      noData: false,
      detailDialogVisible: true,
      variableGroup: [],
      clickIndex: 0,
      variable_id: '0',
      tabIndex: 0,
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
            color: this.$themed('neutral5'),
          },
          data: [],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            color: this.$themed('--neutral5'),
          },
          splitLine: {
            lineStyle: {
              color: this.$themed('--neutral6'),
              width: 0.1,
            },
          },
        },
        color: ["this.$themed('--primary-color')"],
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
  created() {
    this.listen.createListen();
    this.$nextTick(() => {
      setTimeout(() => {
        this.initgoRightArrow();
      });
    });
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },

  watch: {
    indexId(val) {
      if (val) {
        this.tabIndex = 0;
        this.getVariable(this.indexId);
      }
    },
  },
  mounted() {
    // this.initLine();
    this.getVariable(this.indexId);
    const centerScrollWidth = this.$refs.centerScrollRef.style.width;
    // console.log(centerScrollWidth, 'aaaa', this.$refs.centerScrollRef);
    this.$nextTick(() => {
      this.centerScrollWidth = centerScrollWidth;
    });
    // 获取token
    this.iframeURL = `http://10.100.6.2:8088/login/?token=${this.jwtToken}&redirect_uri=/superset/explore/p/wXO6edXr57o/?standalone=1%26height=500%26variable_id=${this.variable_id}`;
  },
  methods: {
    //初始化判断是否可以向右滚动
    initgoRightArrow() {
      const currentScrollWidth = this.$refs[`fixedBox`].clientWidth;
      const centerScrollWidth = this.$refs.centerScrollRef.clientWidth;
      // console.log(centerScrollWidth);
      if (centerScrollWidth >= currentScrollWidth) {
        this.noScrollRight = true;
      } else {
        this.noScrollRight = false;
      }
    },
    //点击上一个
    fnPrev() {
      //如果右点击的次数大于0，才可以左滚
      const currentScrollWidth = this.$refs[`fixedBox`].clientWidth;
      const centerScrollWidth = this.$refs.centerScrollRef.clientWidth;
      // console.log(
      //   centerScrollWidth + this.scrollResultWidth >= currentScrollWidth,
      // );

      if (this.currentClickNumber > 0) {
        this.currentClickNumber -= 1;
        this.noScrollRight = true;
        this.fnScrollWidth('reduce');
      } else {
        return false;
      }
    },
    //点击下一个
    fnNext() {
      const currentScrollWidth = this.$refs[`fixedBox`].clientWidth;
      const centerScrollWidth = this.$refs.centerScrollRef.clientWidth;
      // console.log(
      //   centerScrollWidth - currentScrollWidth + this.scrollResultWidth - 200,
      // );
      if (centerScrollWidth + this.scrollResultWidth >= currentScrollWidth) {
        this.currentClickNumber += 1;
        this.noScrollRight = true;
        this.fnScrollWidth('add');
      } else {
        this.noScrollRight = false;
      }
    },
    //translate的宽度
    fnScrollWidth(type) {
      let result = 0;
      if (type === 'reduce') {
        result = 200;
      } else if (type === 'add') {
        result = -200;
      } else {
        result = 0;
      }
      this.scrollResultWidth += result;
    },
    // 获取三级指标项下全部变量项
    getVariable(id) {
      getVariableList({ index_id: id }).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        if (list.length) {
          this.variableGroup = list;

          this.$nextTick(() => {
            const aa = document.getElementsByClassName('item-title');
            const arr = Array.from(aa);
            let totalWidth = 0;
            arr.forEach((item) => {
              totalWidth += item.clientWidth;
            });
            this.centerScrollWidth = totalWidth + arr.length * 24;
            this.initgoRightArrow();
          });

          this.variable_id = this.variableGroup[0].id;
          this.getGraph(this.variable_id);
        }
      });
    },

    // 折线图初始化
    // initLine() {
    //   this.chart = Echarts.init(this.$refs.line);
    //   this.chart.setOption(this.options);
    // },

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
            const matchedList = data.is_matched;
            this.options.visualMap = this.getVisualMap(matchedList);
            this.options.xAxis.data = xTimeList;
            this.options.series[0].data = yValueList;
            // this.chart.setOption(this.options);
            this.iframeURL = `http://10.100.6.2:8088/login/?token=${this.jwtToken}&redirect_uri=/superset/explore/p/wXO6edXr57o/?standalone=1%26height=500%26variable_id=${id}`;
          } else {
            // this.emptyLine();
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
              color: this.$themed('--red-color'),
            });
          } else if (!matchedList[index + 1]) {
            pieces.push({
              gte: index,
              lte: index,
              color: this.$themed('--red-color'),
            });
            if (index + 1 <= matchedList.length - 1) {
              pieces.push({
                gt: index,
                lt: index + 1,
                color: this.$themed('--primary-color'),
              });
            } else {
              pieces.push({
                gt: index,
                color: this.$themed('--primary-color'),
              });
            }
          }
        } else {
          pieces.push({
            gte: index,
            lt: index + 1,
            color: this.$themed('--primary-color'),
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
      this.model.variable_id = this.variable_id;
      this.tableUrl = '/cr/eval/record/variables/data';
    },
    itemClick(index, item) {
      // this.emptyLine();
      this.clickIndex = index;
      this.variable_id = item.id;
      this.iframeURL = `http://10.100.6.2:8088/login/?token=${this.jwtToken}&redirect_uri=/superset/explore/p/wXO6edXr57o/?standalone=1%26height=500%26variable_id=${this.variable_id}`;

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

    //handleChange 切换折线图和原始数据
    handleChange(value) {
      // this.emptyLine();
      this.tabIndex = value;
      if (!value) {
        this.getGraph(this.variable_id);
      } else {
        this.noData = false;
        this.getTable();
      }
    },
    listenFunc() {
      const tooltips = {
        show: true,
      };
      const splitLines = {
        lineStyle: {
          color: this.$themed('--neutral6'),
          width: 0.1,
        },
      };
      const axisLabelX = {
        fontSize: 14,
        inside: false,
        rotate: 40,
        showMinLabel: true,
        showMaxLabel: true,
        verticalAlign: 'top',
        color: this.$themed('neutral5'),
      };
      const axisLabelY = {
        fontSize: 14,
        color: this.$themed('--neutral5'),
      };
      this.options.tooltip = tooltips;
      this.options.xAxis.axisLabel = axisLabelX;
      this.options.yAxis.axisLabel = axisLabelY;
      this.options.yAxis.splitLine = splitLines;
      // this.initLine();
      // this.options.xAxis.axisLabel.color = this.$themed('neutral5');
      // this.options.yAxis.axisLabel.color = this.$themed('neutral5');
      // this.options.yAxis.splitLine.lineStyle.color = this.$themed('neutral5');
      this.getGraph(this.variable_id);
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
.arrow {
  cursor: pointer;
  position: relative;
  z-index: 100;
  .el-icon-arrow-left {
    width: 30px;
  }
  .el-icon-arrow-right {
    width: 30px;
  }
}
.arrowOpacity {
  cursor: default;
  opacity: 0.4;
}
.item-group {
  width: 97.5%;
  white-space: nowrap;
  overflow-x: auto;
  margin-bottom: 16px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 16px;
  margin-left: 16px;
  .fixed-box {
    flex: 1;
    overflow: hidden;
  }
  .item-warp {
  }
  .item-title {
    line-height: 18px;
    margin-right: 24px;
    padding: 12px 0;
    cursor: pointer;
    white-space: nowrap;
    display: inline-block;
    font-size: 14px;
    max-width: 360px;
    height: 43px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .active {
    border-bottom: solid 2px var(--primary-color);
    color: var(--primary-color);
  }
}
.item-content {
  position: relative;
  .no_data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    .info {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
    }
  }
  .tab-btn {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-bottom: 8px;
    label:last-child {
      ::v-deep span {
        margin-right: 16px;
      }
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
.main-content2 {
  padding-right: 16px;
  padding-left: 16px;
}
.border-style {
  border-bottom: 1px solid var(--neutral1);
  position: relative;
  top: -21px;
  margin-left: 16px;
  margin-right: 16px;
}
.title-one:hover {
  color: var(--primary-color-8);
}
</style>
