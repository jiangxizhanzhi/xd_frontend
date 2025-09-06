<template>
  <div class="train-new-detail" ref="train-new-detail">
    <div class="header" ref="header">
      <span @click="goBack">
        <cb-iconfont type="icon-xiangyou"></cb-iconfont>
      </span>
      {{ create_time }}
      {{ $t('m.trainDetail') }}
      <cb-button
        size="medium"
        hollow
        style="float: right; position: relative; top: -10px"
        @click="exportTemplate"
        :loading="btnLoading"
        >{{ $t('m.export') }}</cb-button
      >
    </div>
    <div class="content">
      <div class="total-score" ref="total-score">
        <span>{{ $t('m.trainscore') }}:</span>
        <span class="score">{{ score }}</span>
        <span class="color">{{ $t('m.totalScore') }}:</span>
        <span class="color total">{{ total_score }} </span>
      </div>
      <div class="statistics" ref="statistics">
        <div class="statistics-train common">
          <Block :title="$t('m.trainingStatistics')"></Block>
          <div class="echart">
            <train-echarts
              v-if="totalAssgin"
              :id="'meber'"
              ref="trainEcharts"
              :init-data="opinionData"
              :lazy="true"
              :task-total="totalAssgin"
              :theme="theme"
            />
          </div>
        </div>
        <div class="statistics-skill common">
          <Block :title="$t('m.skillScore')"></Block>
          <div class="echart">
            <cb-echart-radar
              v-if="load && indicator.length > 0"
              :radarShape="radarShape"
              :indicator="indicator"
              :radarData="radarData"
              :radarRadius="radarRadius"
              :axisName="axisName"
            ></cb-echart-radar>
          </div>
        </div>
      </div>
      <div class="train-record-list">
        <Block :title="$t('m.trainRecord')" ref="title"></Block>
        <div :style="`height: ${overflowHeight}px`">
          <train-record
            ref="trainRecord"
            :show-tree-file="showTreeFile"
            :missionData="missionData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Block from '@/components/block';
import TrainRecord from '@/components/TrainCommon/module/trainRecord.vue';
import TrainEcharts from '@/pages/web/team-train/components/echart.vue';
import { getRadarLabels } from '@/api/common';
import validateUtils from '@/utils/validate';
import { cutStr } from '@/utils/index.js';

export default {
  components: {
    Block,
    TrainRecord,
    TrainEcharts,
  },
  props: {
    historyId: {
      type: [String, Number],
      default: '',
    },
    resource: {
      type: String,
      default: 'detail',
    },
  },
  watch: {
    historyId: {
      handler(val, oldval) {
        if (val) {
          this.getRecordDetail(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      theme: '',
      overflowHeight: 255,
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      btnLoading: false,
      create_time: '',
      score: 0,
      total_score: 0,
      radarRadius: ['0%', '55%'],
      showTreeFile: true,
      missionData: [],
      opinionData: [
        {
          name: this.$t('m.completionNumber'),
          statistical_state: 0,
          value: 0,
        },
        {
          name: this.$t('m.trainRunning'),
          statistical_state: 1,
          value: 0,
        },
      ],
      totalAssgin: 0,
      indicator: [],
      load: false,
      radarShape: 'sharp',
      //数据，区域块的颜色等
      radarData: [],
    };
  },
  computed: {
    axisName() {
      return {
        formatter: (text) => {
          var strlength = validateUtils.validateLength(text);
          var maxlength = 10;
          if (strlength > maxlength) {
            text = cutStr(text, maxlength) + '...';
          }
          return text;
        },
      };
    },
  },
  mounted() {
    this.listen.createListen();
    this.getRadarLabelsList();
    this.getContentHeight();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    getContentHeight() {
      this.$nextTick(() => {
        let totalHeight = this.$refs['train-new-detail'].offsetHeight;
        let headerHeight = this.$refs['header'].offsetHeight;
        let totalScoreheight = this.$refs['total-score'].offsetHeight;
        let statisticsHeight = this.$refs['statistics'].offsetHeight;
        this.overflowHeight =
          totalHeight -
          headerHeight -
          totalScoreheight -
          statisticsHeight -
          19 -
          30 -
          20 -
          32 -
          15 -
          8 -
          2;
      });
    },
    // 监听换肤，动态reload echarts
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.theme = 'dark';
      } else {
        this.theme = 'light';
      }
      this.load = false;
      if (this.indicator.length) {
        this.indicator[0].axisLabel.color = this.$themed('neutral5');
      }
      this.$nextTick(() => {
        this.load = true;
      });
    },
    // 导出pdf
    exportTemplate() {
      this.btnLoading = true;
      this.$request
        .binaryDownload(
          'get',
          '/cr/single_train/single_train/train2pdf',
          { room_id: this.historyId },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.btnLoading = false;
        })
        .catch(() => {
          this.btnLoading = false;
        });
    },
    // 获取技能标签
    getRadarLabelsList() {
      getRadarLabels().then((res) => {
        const data = _.get(res, 'data.data.labels', []);
        this.load = true;
        data.map((item) => {
          this.indicator.push({
            max: 100,
            name: `${item}`,
          });
        });
        this.indicator[0].axisLabel = {
          align: 'center',
          verticalAlign: 'top',
          show: true,
          fontSize: 8,
          color: this.$themed('neutral5'),
          showMaxLabel: true, //不显示最大值，即外圈不显示数字30
          showMinLabel: true, //显示最小数字，即中心点显示0
        };
      });
    },
    // 获取详情
    getRecordDetail(id) {
      this.$request
        .get(
          '/cr/single_train/single_train/history_detail/',
          {
            resource_id: id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          this.create_time = data.create_time;
          this.total_score = data.total_score;
          this.score = data.score;
          this.radarData = data.radar;
          this.opinionData[0].value = data.task_count[0];
          this.opinionData[1].value = data.task_count[1];
          this.totalAssgin = data.task_count[0] + data.task_count[1];
          this.missionData = data.stages;
        });
    },
    handleClick() {},
    goBack() {
      if (this.resource === 'detail') {
        this.$emit('showList', false);
      }
      if (this.resource === 'list') {
        this.$emit('showList', true);
      }
      this.$emit('showDetail', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.train-new-detail {
  background: var(--bg-color-3);
  height: 100%;
  width: 100%;
  position: absolute;
  right: 0;
  box-sizing: border-box;
  padding: 15px;
  z-index: 10;
  .header {
    padding: 10px;
    border-bottom: 1px solid var(--neutral1);
    .cb-iconfont {
      cursor: pointer;
    }
  }
  .content {
    .total-score {
      height: 36px;
      margin-bottom: 32px;
      color: var(--neutral8);
      .score {
        font-size: 32px;
        color: var(--primary-color);
        font-weight: 400;
        padding-right: 40px;
      }
      .color {
        color: var(--neutral8);
      }
    }
    .statistics {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      .common {
        width: 49%;
        .echart {
          height: 200px;
          border: 1px solid var(--neutral1);
          padding: 20px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.train-new-detail {
  .cb-block-title {
    padding-left: 8px !important;
  }
  .cb-block-title-container {
    margin-bottom: 8px;
  }
}
</style>
