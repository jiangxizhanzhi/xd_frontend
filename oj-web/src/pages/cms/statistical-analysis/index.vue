<template>
  <cb-inner-page
    :background="true"
    title="统计分析"
  >
    <div class="all-course">
      <div class="echarts-grid">
        <div class="study-td fl tabBg">
          <div class="th-head">
            <top-title :name="$t('训练场次统计')"></top-title>
          </div>
          <div class="th-echarts">
            <bar-chart
              v-if="team_times_data.xData.length"
              :team_times_data="team_times_data"
            ></bar-chart>
            <no-data v-else></no-data>
          </div>
        </div>
        <div
          id="bottomBg"
          class="direction-td fl tabBg"
        >
          <div class="th-head">
            <top-title :name="$t(
              '训练人数趋势',
            )
              "></top-title>
          </div>
          <div class="th-echarts">
            <line-chart
              v-if="team_person_num_data.xData.length"
              :team_person_num_data="team_person_num_data"
            ></line-chart>
            <no-data v-else></no-data>
          </div>
        </div>
      </div>

      <div class="total-score-wrap">
        <div class="total-score-item">
          <div class="th-head">
            <top-title :name="$t('训练总分TOP5')"></top-title>
          </div>
          <div class="th-echarts">
            <score-bar-chart
              v-if="score_all.xData.lenghth"
              :score_data="score_all"
              :colorList="['#f59a23']"
            ></score-bar-chart>
            <no-data v-else></no-data>
          </div>
        </div>
        <div class="total-score-item">
          <div class="th-head">
            <top-title :name="$t('实验总分TOP5')"></top-title>
          </div>
          <div class="th-echarts">
            <score-bar-chart
              v-if="score_sy.xData.lenghth"
              :score_data="score_sy"
              :colorList="['#19ab76']"
            ></score-bar-chart>
            <no-data v-else></no-data>
          </div>
        </div>
        <div class="total-score-item">
          <div class="th-head">
            <top-title :name="$t('科目总分TOP5')"></top-title>
          </div>
          <div class="th-echarts">
            <score-bar-chart
              v-if="score_km.xData.lenghth"
              :score_data="score_km"
              :colorList="['#19bad1']"
            ></score-bar-chart>
            <no-data v-else></no-data>
          </div>
        </div>
        <div class="total-score-item">
          <div class="th-head">
            <top-title :name="$t('综合演训总分TOP5')"></top-title>
          </div>
          <div class="th-echarts">
            <score-bar-chart
              v-if="score_zhyx.xData.lenghth"
              :score_data="score_zhyx"
              :colorList="['#0d63c4']"
            ></score-bar-chart>
            <no-data v-else></no-data>
          </div>
        </div>
      </div>
      <div class="table-grid tabBg">
        <div class="th-head">
          <top-title :name="$t('训练学员统计')"></top-title>
        </div>
        <div class="th-echarts">
          <cb-search-table
            ref="tableRef"
            url="/cr/admin/xd_statistics/detail"
            baseURL="/api/ojj"
            :cols="columns"
            row-key="user_id"
            :searchBarBg="false"
          >
          </cb-search-table>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import {
  getXdTeamTimesApi,
  getXdTeamPersonNumApi,
  getXdTeamScoreAllApi,
  getXdTeamScoreSyApi,
  getXdTeamScoreKmApi,
  getXdTeamScoreZhyxApi
} from '@/api/statistical-analysis.js'
import topTitle from './components/top-title.vue';
import BarChart from './components/bar-chart.vue';
import ScoreBarChart from './components/score-bar-chart.vue';
import LineChart from './components/line-chart.vue';
import NoData from './components/no-data.vue';
export default {
  components: {
    topTitle,
    BarChart,
    ScoreBarChart,
    LineChart,
    NoData,
  },
  data() {
    return {
      columns: [
        {
          label: this.$t('用户名'),
          prop: 'username',
        },
        {
          label: this.$t('姓名'),
          prop: 'name',
        },
        {
          label: this.$t('组织'),
          prop: 'organization_data',
        },
        {
          label: this.$t('角色'),
          prop: 'roles',
        },
        {
          label: this.$t('完成训练'),
          prop: 'train_times',
        },
        {
          label: this.$t('完成实验'),
          prop: 'sy_times',
        },
        {
          label: this.$t('完成科目'),
          prop: 'km_times',
        },
        {
          label: this.$t('完成演训'),
          prop: 'zhyx_times',
        },
        {
          label: this.$t('完成任务'),
          prop: 'task_num',
        },
        {
          label: this.$t('任务正确率'),
          prop: 'task_accuracy',
        },
        {
          label: this.$t('累计得分'),
          prop: 'total_score',
        },
        {
          label: this.$t('综合排名'),
          prop: 'overall_rank',
        },
      ],
      team_times_data: {
        xData: [],
        seriesData: [],
      },
      team_person_num_data: {
        xData: [],
        seriesData: [],
      },
      score_all: {
        xData: [],
        seriesData: [],
      },
      score_sy: {
        xData: [],
        seriesData: [],
      },
      score_km: {
        xData: [],
        seriesData: [],
      },
      score_zhyx: {
        xData: [],
        seriesData: [],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      // 训练场次统计
      this.getXdTeamTimesData();
      // 训练人数趋势
      this.getXdTeamPersonNumData();
      // 训练总分TOP5
      this.getXdScoreAllTop5()
      // 实验总分TOP5
      this.getXdScoreSyTop5()
      // 科目总分TOP5
      this.getXdScoreKmTop5()
      // 综合演训总分TOP5
      this.getXdScoreZhyxTop5()
    },
    // 训练场次统计
    getXdTeamTimesData() {
      this.team_times_data.xData = [];
      this.team_times_data.seriesData = [];
      getXdTeamTimesApi().then(res => {
        const data = _.get(res, 'data.data', [])
        const sy_num_data = [];
        const km_num_data = [];
        const zhyx_num_data = [];
        data.forEach(item => {
          this.team_times_data.xData.push(item.month + '月')
          sy_num_data.push(item.sy_num)
          km_num_data.push(item.km_num)
          zhyx_num_data.push(item.zhyx_num)
        })
        this.team_times_data.seriesData = [
          {
            name: '单元实验',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: sy_num_data
          },
          {
            name: '科目训练',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: km_num_data
          },
          {
            name: '综合演训',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: zhyx_num_data
          },
        ]
      })
    },
    // 训练人数趋势
    getXdTeamPersonNumData() {
      getXdTeamPersonNumApi().then(res => {
        const data = _.get(res, 'data.data', [])
        const sy_num_data = [];
        const km_num_data = [];
        const zhyx_num_data = [];
        data.forEach(item => {
          this.team_person_num_data.xData.push(item.month + '月')
          sy_num_data.push(item.sy_num)
          km_num_data.push(item.km_num)
          zhyx_num_data.push(item.zhyx_num)
        })
        this.team_person_num_data.seriesData = [
          {
            name: '单元实验',
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            data: sy_num_data
          },
          {
            name: '科目训练',
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            data: km_num_data
          },
          {
            name: '综合演训',
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            data: zhyx_num_data
          },
        ]
      })
    },
    // 训练总分TOP5
    getXdScoreAllTop5() {
      getXdTeamScoreAllApi().then(res => {
        this.score_all.xData = [];
        this.score_all.seriesData = [];
        const data = _.get(res, 'data.data', [])
        data.forEach(item => {
          this.score_all.xData.push(item.username)
          this.score_all.seriesData.push(item.total_score)
        })
      })
    },
    // 实验总分TOP5
    getXdScoreSyTop5() {
      getXdTeamScoreSyApi().then(res => {
        this.score_sy.xData = [];
        this.score_sy.seriesData = [];
        const data = _.get(res, 'data.data', [])
        data.forEach(item => {
          this.score_sy.xData.push(item.username)
          this.score_sy.seriesData.push(item.total_score)
        })
      })
    },
    // 科目总分TOP5
    getXdScoreKmTop5() {
      getXdTeamScoreKmApi().then(res => {
        this.score_km.xData = [];
        this.score_km.seriesData = [];
        const data = _.get(res, 'data.data', [])
        data.forEach(item => {
          this.score_km.xData.push(item.username)
          this.score_km.seriesData.push(item.total_score)
        })
      })
    },
    // 综合演训总分TOP5
    getXdScoreZhyxTop5() {
      getXdTeamScoreZhyxApi().then(res => {
        this.score_zhyx.xData = [];
        this.score_zhyx.seriesData = [];
        const data = _.get(res, 'data.data', [])
        data.forEach(item => {
          this.score_zhyx.xData.push(item.username)
          this.score_zhyx.seriesData.push(item.total_score)
        })
      })
    },
  },
};
</script>
<style scoped lang="scss">
.all-course {
  .tabBg {
    position: relative;
    background-color: var(--bg-color-2);
  }

  .echarts-grid {
    .study-td {
      background: var(--bg-color-3);

      .th-head {
        color: var(--font-color-primary);
      }
    }

    .direction-td {
      background: var(--bg-color-3);

      .th-head {
        color: var(--font-color-primary);
      }
    }
  }
}
</style>
<style scoped lang="scss">
.all-course {
  width: 100%;
  padding-right: 16px;
  box-sizing: border-box;

  .echarts-grid {
    width: 100%;
    height: 250px;
    margin-bottom: 16px;
    display: flex;

    .study-td {
      width: 40%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .th-head {
        width: 100%;
        height: 30px;
        font-size: 14px;
      }

      .th-echarts {
        position: relative;
        width: 100%;
        height: calc(100% - 30px);
        z-index: 999;
      }
    }

    .direction-td {
      width: 60%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .th-head {
        width: 100%;
        height: 30px;
        font-size: 14px;
      }

      .th-echarts {
        position: relative;
        width: 100%;
        height: calc(100% - 30px);
        z-index: 999;
      }
    }

    .study-td {
      margin-right: 16px;
    }

    .direction-td {}
  }

  .total-score-wrap {
    width: 100%;
    height: 250px;
    margin-bottom: 16px;
    display: flex;

    .total-score-item {
      width: calc(25% - 12px);
      height: 100%;
      margin-right: 16px;
      background: var(--bg-color-3);

      .th-head {
        width: 100%;
        height: 30px;
        font-size: 14px;
      }

      .th-echarts {
        position: relative;
        width: 100%;
        height: calc(100% - 30px);
        z-index: 999;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .table-grid {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .th-head {
      padding-bottom: 10px;
    }

    .th-echarts {
      position: relative;
      z-index: 999;
    }

    // height: 570px;
  }
}
</style>
