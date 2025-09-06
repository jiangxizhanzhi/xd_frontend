<template>
  <div class="record-list">
    <div class="echart-line" v-loading="loading">
      <cb-echart-line
        v-if="echartData.xAxisData.length > 0"
        :xData="echartData.xAxisData"
        :yAxisIndex="yAxisIndex"
        :lineData="lineData"
        :name="name"
        :color="color"
        :areaStyle="true"
        :legendShow="true"
        legendLocation="right"
        :axisLineShow="true"
      />
      <div v-else class="cb-table-no-data">
        <div class="cb-table-no-data-icon">
          <cb-iconfont type="icon-zanwuziyuan" :size="56"></cb-iconfont>
          <div>{{ $t('personal.dataEmpty') }}</div>
        </div>
      </div>
    </div>

    <div
      class="learn-list"
      v-loading="positionLoading"
      v-if="positionList && positionList.length"
    >
      <cb-scrollbar>
        <div
          v-for="item in positionList"
          :key="item.resource_id"
          class="learn-item"
        >
          <cb-row>
            <cb-col :span="6"
              ><div class="learn-item-name" :title="item.name">
                {{ item.name }}
              </div></cb-col
            >
            <cb-col :span="4"
              >{{ item.theory_count }}{{ $t('personal.theory') }}+{{
                item.exercise_count
              }}{{ $t('personal.experiment') }}</cb-col
            >
            <cb-col :span="4"
              ><div class="learn-item-name learn-item-i">
                <i
                  v-for="cItem in getPoint(item.knowledges)"
                  :title="cItem"
                  :key="cItem"
                  >{{ cItem }}</i
                >
              </div></cb-col
            >
            <cb-col :span="4">
              <div class="progress-box">
                <cb-progress
                  :percentage="item.process"
                  :color="formatColor(item.process)"
                />
              </div>
            </cb-col>
            <cb-col :span="6">{{ item.last_study_time || '' }}</cb-col>
          </cb-row>
        </div>
      </cb-scrollbar>
    </div>
    <div v-else class="cb-table-no-data">
      <div class="cb-table-no-data-icon">
        <cb-iconfont type="icon-zanwuziyuan" :size="56"></cb-iconfont>
        <div>{{ $t('personal.dataEmpty') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import { getLearnData } from '@/api/evaluation';
import dayjs from 'dayjs';
export default {
  props: {
    positionList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      echartData: {
        xAxisData: [],
        courseData: [],
        reportData: [],
        scoreData: [],
      },
      name: [this.$t('personal.course'), this.$t('personal.lesson')],
      yAxisIndex: [0, 1],
      lineData: [],
      color: ['primary-color', 'green-color'],
      loading: false,
      positionLoading: false,
    };
  },
  mounted() {
    this.getStudyRecordEcharts();
  },
  methods: {
    getPoint(data) {
      return [...data.map((item) => item.related_id)];
    },
    formatColor(percentage) {
      return percentage === 100
        ? this.$themed('green-color')
        : this.$themed('orange-color');
    },
    // 获取学习记录
    getStudyRecordEcharts() {
      const time = {
        start_time: dayjs(new Date() - 60000 * 60 * 24 * 6).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        end_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      this.loading = true;
      getLearnData(time)
        .then((resp) => {
          const data = _.get(resp, 'data.data', '') || null;
          this.echartData = {
            xAxisData: _.get(data, 'xdates', '') || [],
            courseData: _.get(data, 'ycourses', '') || [],
            reportData: _.get(data, 'ylessons', '') || [],
          };
          this.lineData = [
            this.echartData.courseData,
            this.echartData.reportData,
          ];
          this.loading = false;
        })
        .catch((err) => {
          /* that.$serverError(err); */
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.record-list {
  height: 100%;
  .echart-line {
    height: 250px;
  }
  .learn-list {
    margin-top: 20px;
    font-size: 14px;
    height: 500px;
    .learn-item {
      width: 100%;
      line-height: 40px;
      padding: 10px 4px;
      &-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        i {
          padding: 0 2px;
          font-style: normal;
        }
      }
      &-i {
        color: var(--neutral8);
      }
      .progress-box {
        padding-right: 10px;
        ::v-deep.cb-progress__text {
          font-size: 12px !important;
        }
      }
    }
  }
  .cb-table-no-data {
    text-align: center;
    height: 80px;
    color: var(--neutral5);
  }
}
</style>
<style lang="scss" scoped>
.learn-list {
  .learn-item {
    color: var(--neutral8);
    &:nth-child(odd) {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--bg-color-3);
        z-index: 1;
        opacity: 0.2;
      }

      ::v-deep .el-row {
        position: relative;
        z-index: 2;
      }
    }
    &:nth-child(even) {
      background: var(--bg-color-3);
    }
    &-name {
      color: var(--primary-color);
    }
  }
}
</style>
