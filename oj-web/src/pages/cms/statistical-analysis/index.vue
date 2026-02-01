<template>
  <cb-inner-page
    :background="true"
    title="统计分析"
    class="learn-wrap"
  >
    <div class="all-course">
      <div class="echarts-grid">
        <div class="study-td fl tabBg">
          <div class="th-head">
            <top-title :name="$t('训练场次统计')"></top-title>
            <div class="time-search">
              <cb-date-picker
                style="width: 100%"
                v-model="trainingSessionStatistics.date"
                type="datetimerange"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                value-format="yyyy-MM-dd"
                :clearable="false"
                popper-class="custom-range-picker"
                @change="trainingSessionStatisticsChange($event)"
                clearable
              >
              </cb-date-picker>
            </div>
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
            <top-title :name="$t('训练人数趋势')"></top-title>
            <div class="time-search">
              <cb-date-picker
                style="width: 100%"
                v-model="trainNumberTrend.date"
                type="datetimerange"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                value-format="yyyy-MM-dd"
                :clearable="false"
                popper-class="custom-range-picker"
                @change="trainNumberTrendChange($event)"
                clearable
              >
              </cb-date-picker>
            </div>
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
            <div class="time-search">
              <cb-date-picker
                style="width: 100%"
                v-model="trainingTotalScoreTop5.date"
                type="datetimerange"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                value-format="yyyy-MM-dd"
                :clearable="false"
                popper-class="custom-range-picker"
                @change="trainingTotalScoreTop5Change($event)"
                clearable
              >
              </cb-date-picker>
            </div>
          </div>
          <div class="th-echarts">
            <score-bar-chart
              v-if="score_all.xData.length"
              :score_data="score_all"
              :colorList="['#f59a23']"
            ></score-bar-chart>
            <no-data v-else></no-data>
          </div>
        </div>
        <div class="total-score-item">
          <div class="th-head">
            <top-title :name="$t('实验总分TOP5')"></top-title>
            <div class="time-search">
              <cb-date-picker
                style="width: 100%"
                v-model="experimentTotalScoreTop5.date"
                type="datetimerange"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                value-format="yyyy-MM-dd"
                :clearable="false"
                popper-class="custom-range-picker"
                @change="experimentTotalScoreTop5Change($event)"
                clearable
              >
              </cb-date-picker>
            </div>
          </div>
          <div class="th-echarts">
            <score-bar-chart
              v-if="score_sy.xData.length"
              :score_data="score_sy"
              :colorList="['#19ab76']"
            ></score-bar-chart>
            <no-data v-else></no-data>
          </div>
        </div>
        <div class="total-score-item">
          <div class="th-head">
            <top-title :name="$t('科目总分TOP5')"></top-title>
            <div class="time-search">
              <cb-date-picker
                style="width: 100%"
                v-model="subjectTotalScoreTop5.date"
                type="datetimerange"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                value-format="yyyy-MM-dd"
                :clearable="false"
                popper-class="custom-range-picker"
                @change="subjectTotalScoreTop5Change($event)"
                clearable
              >
              </cb-date-picker>
            </div>
          </div>
          <div class="th-echarts">
            <score-bar-chart
              v-if="score_km.xData.length"
              :score_data="score_km"
              :colorList="['#19bad1']"
            ></score-bar-chart>
            <no-data v-else></no-data>
          </div>
        </div>
        <div class="total-score-item">
          <div class="th-head">
            <top-title :name="$t('综合演训总分TOP5')"></top-title>
            <div class="time-search">
              <cb-date-picker
                style="width: 100%"
                v-model="comprehensiveTotalScoreTop5.date"
                type="datetimerange"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                value-format="yyyy-MM-dd"
                :clearable="false"
                popper-class="custom-range-picker"
                @change="comprehensiveTotalScoreTop5Change($event)"
                clearable
              >
              </cb-date-picker>
            </div>
          </div>
          <div class="th-echarts">
            <score-bar-chart
              v-if="score_zhyx.xData.length"
              :score_data="score_zhyx"
              :colorList="['#0d63c4']"
            ></score-bar-chart>
            <no-data v-else></no-data>
          </div>
        </div>
      </div>
      <!-- 训练学员统计 -->
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
            :show-search-btn="false"
            :data="traineeStatistics"
          >
            <template v-slot:search="scoped">
              <div class="time-search">
                <cb-date-picker
                  style="width: 100%"
                  v-model="traineeStatistics.date"
                  type="datetimerange"
                  :range-separator="$t('至')"
                  :start-placeholder="$t('开始日期')"
                  :end-placeholder="$t('结束日期')"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  popper-class="custom-range-picker"
                  clearable
                >
                </cb-date-picker>
              </div>
            </template>
            <template v-slot:roles="scoped">
              {{ computedRoles(scoped.data.roles) }}
            </template>
          </cb-search-table>
        </div>
      </div>
      <!-- 实验统计 -->
      <div class="table-grid tabBg">
        <div class="th-head">
          <top-title :name="$t('实验统计')"></top-title>
        </div>
        <div class="th-echarts">
          <cb-search-table
            ref="tableRef"
            url="/cr/out_interface/team_train_list"
            baseURL="/api/ojj"
            :cols="outInterfaceColumns"
            row-key="resource_id"
            :searchBarBg="false"
            :show-search-btn="false"
            :data="outInterfaceStatistics"
          >
            <template v-slot:search="scoped">
              <div class="time-search">
                <cb-date-picker
                  style="width: 100%"
                  v-model="outInterfaceStatistics.date"
                  type="datetimerange"
                  :range-separator="$t('至')"
                  :start-placeholder="$t('开始日期')"
                  :end-placeholder="$t('结束日期')"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  popper-class="custom-range-picker"
                  clearable
                >
                </cb-date-picker>
              </div>
            </template>
            <template v-slot:category="scoped">
              <div>{{ computedCategory(scoped.data.category) }}</div>
            </template>
            <template v-slot:difficult="scoped">
              <div>{{ computedDifficult(scoped.data.category) }}</div>
            </template>
            <template v-slot:operate="scoped">
              <cb-button
                type="text"
                @click="studentStatistics(scoped.data)"
              >学员统计</cb-button>
            </template>
          </cb-search-table>
        </div>
      </div>
    </div>
    <cb-dialog
      v-if="dialogVisible"
      :title="train_name + '学员统计'"
      :visible.sync="dialogVisible"
      width="1400px"
      @close="dialogVisible = false"
    >
      <div class="personnel-score">
        <personnel-score
          :score-info="scoreList"
          :resource_id="resource_id"
        ></personnel-score>
      </div>
    </cb-dialog>
  </cb-inner-page>
</template>
<script>
import {
  getXdTeamTimesApi,
  getXdTeamPersonNumApi,
  getXdTeamScoreAllApi,
  getXdTeamScoreSyApi,
  getXdTeamScoreKmApi,
  getXdTeamScoreZhyxApi,
  getXdOutInterfaceApi,
  trainReportApi
} from '@/api/statistical-analysis.js'
import { getConstantsConfig } from '@/api/course.js'
import topTitle from './components/top-title.vue';
import BarChart from './components/bar-chart.vue';
import ScoreBarChart from './components/score-bar-chart.vue';
import LineChart from './components/line-chart.vue';
import NoData from './components/no-data.vue';
import PersonnelScore from './components/personnel-score.vue'
export default {
  components: {
    topTitle,
    BarChart,
    ScoreBarChart,
    LineChart,
    NoData,
    PersonnelScore,
  },
  data() {
    return {
      dialogVisible: false,
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
          slot: 'roles',
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
      outInterfaceColumns: [
        {
          label: this.$t('名称'),
          prop: 'name',
        },
        {
          label: this.$t('类别'),
          slot: 'category',
        },
        {
          label: this.$t('难度'),
          slot: 'difficult',
        },
        {
          label: this.$t('训练类型'),
          prop: 'train_xd_sub_type',
        },
        {
          label: this.$t('开始时间'),
          prop: 'start_time',
        },
        {
          label: this.$t('结束时间'),
          prop: 'end_time',
        },
        {
          label: this.$t('操作'),
          slot: 'operate',
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
      trainingSessionStatistics: {
        date: [],
      },
      trainNumberTrend: {
        date: [],
      },
      trainingTotalScoreTop5: {
        date: [],
      },
      experimentTotalScoreTop5: {
        date: [],
      },
      subjectTotalScoreTop5: {
        date: [],
      },
      comprehensiveTotalScoreTop5: {
        date: [],
      },
      traineeStatistics: {
        date: [],
      },
      outInterfaceStatistics: {
        date: [],
      },
      categoryList: [],
      difficultList: [],
      train_name: '',
      resource_id: '',
      scoreList: [],
    };
  },
  mounted() {
    this.getData();
    // 获取类别
    this.getCategory();
    // 获取难度
    this.getDifficult();
  },
  methods: {
    studentStatistics(data) {
      this.train_name = data.name
      this.resource_id = data.resource_id;
      this.dialogVisible = true;
      trainReportApi({
        resource_id: this.resource_id,
        scoreCount: 10,
      }).then((res) => {
        const data = _.get(res, 'data.data');
        console.log(data, 65666);

        this.scoreList = data.get_score_rsps;
      });
    },
    getCategory() {
      getConstantsConfig({
        type: 3
      }).then(res => {
        this.categoryList = res.data.data;
      })
    },
    getDifficult() {
      getConstantsConfig({
        type: 24
      }).then(res => {
        this.difficultList = res.data.data;
      })
    },
    computedCategory(category) {
      const data = this.categoryList.filter(item => {
        return item.code === category
      })
      if (data?.length) {
        return data[0]?.name;
      } else {
        return '-'
      }
    },
    computedDifficult(difficult) {
      const data = this.difficultList.filter(item => {
        return item.code === difficult
      })
      if (data?.length) {
        return data[0]?.name;
      } else {
        return '-'
      }
    },
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
      // 实验统计
      this.getXdOutInterface();
    },
    // 训练场次统计
    getXdTeamTimesData(timerange) {
      this.team_times_data.xData = [];
      this.team_times_data.seriesData = [];
      const params = {};
      if (timerange?.length) {
        params.startTime = timerange[0];
        params.endTime = timerange[1];
      }
      getXdTeamTimesApi(params).then(res => {
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
    getXdTeamPersonNumData(timerange) {
      const params = {};
      if (timerange?.length) {
        params.startTime = timerange[0];
        params.endTime = timerange[1];
      }
      getXdTeamPersonNumApi(params).then(res => {
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
    getXdScoreAllTop5(timerange) {
      const params = {};
      if (timerange?.length) {
        params.startTime = timerange[0];
        params.endTime = timerange[1];
      }
      getXdTeamScoreAllApi(params).then(res => {
        this.score_all.xData = [];
        this.score_all.seriesData = [];
        const data = _.get(res, 'data.data', [])
        // console.log(data);

        data.forEach(item => {
          this.score_all.xData.push(item.name)
          this.score_all.seriesData.push(item.total_score)
        })
      })
    },
    // 实验总分TOP5
    getXdScoreSyTop5(timerange) {
      const params = {};
      if (timerange?.length) {
        params.startTime = timerange[0];
        params.endTime = timerange[1];
      }
      getXdTeamScoreSyApi(params).then(res => {
        this.score_sy.xData = [];
        this.score_sy.seriesData = [];
        const data = _.get(res, 'data.data', [])
        data.forEach(item => {
          this.score_sy.xData.push(item.name)
          this.score_sy.seriesData.push(item.total_score)
        })
      })
    },
    // 科目总分TOP5
    getXdScoreKmTop5(timerange) {
      const params = {};
      if (timerange?.length) {
        params.startTime = timerange[0];
        params.endTime = timerange[1];
      }
      getXdTeamScoreKmApi(params).then(res => {
        this.score_km.xData = [];
        this.score_km.seriesData = [];
        const data = _.get(res, 'data.data', [])
        data.forEach(item => {
          this.score_km.xData.push(item.name)
          this.score_km.seriesData.push(item.total_score)
        })
      })
    },
    // 综合演训总分TOP5
    getXdScoreZhyxTop5(timerange) {
      const params = {};
      if (timerange?.length) {
        params.startTime = timerange[0];
        params.endTime = timerange[1];
      }
      getXdTeamScoreZhyxApi(params).then(res => {
        this.score_zhyx.xData = [];
        this.score_zhyx.seriesData = [];
        const data = _.get(res, 'data.data', [])
        data.forEach(item => {
          this.score_zhyx.xData.push(item.name)
          this.score_zhyx.seriesData.push(item.total_score)
        })
      })
    },
    // 实验统计
    getXdOutInterface(timerange) {
      const params = {};
      if (timerange?.length) {
        params.startTime = timerange[0];
        params.endTime = timerange[1];
      }
      getXdOutInterfaceApi(params).then(res => {
        console.log(res);
      })
    },
    computedRoles(roles) {
      const arr = [];
      if (roles.length) {
        roles.forEach(item => {
          arr.push(item.name)
        })
        return arr.join(',')
      } else {
        return '-'
      }

    },
    trainingSessionStatisticsChange(value) {
      this.getXdTeamTimesData(value);
    },
    trainNumberTrendChange(value) {
      this.getXdTeamPersonNumData(value);
    },
    trainingTotalScoreTop5Change(value) {
      this.getXdScoreAllTop5(value);
    },
    experimentTotalScoreTop5Change(value) {
      this.getXdScoreSyTop5(value);
    },
    subjectTotalScoreTop5Change(value) {
      this.getXdScoreKmTop5(value);
    },
    comprehensiveTotalScoreTop5Change(value) {
      this.getXdScoreZhyxTop5(value);
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
      background: var(--bg-color-1);

      .th-head {
        height: 40px !important;
        color: var(--font-color-primary);
        position: relative;

        .time-search {
          height: 40px;
          line-height: 40px;
          position: absolute;
          right: 8px;
          top: 0;
        }
      }
    }

    .direction-td {
      background: var(--bg-color-1);

      .th-head {
        height: 40px !important;
        color: var(--font-color-primary);
        position: relative;

        .time-search {
          height: 40px;
          line-height: 40px;
          position: absolute;
          right: 8px;
          top: 0;
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
.learn-wrap {
  margin-top: 16px;
  padding-left: 0;
  margin-bottom: 24px;

  ::v-deep .header-decorate {
    padding-left: 16px;
    margin-top: -12px;
    border-bottom: 1px solid var(--bg-color-1);
    margin-bottom: 12px;
  }
}

.all-course {
  width: 100%;
  //padding-right: 16px;
  box-sizing: border-box;
  background-color: var(--bg-color-1);

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
      background: var(--white-color);

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
      background: var(--white-color);

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
      background: var(--white-color);


      .th-head {
        font-size: 14px;
        height: 40px !important;
        color: var(--font-color-primary);
        position: relative;

        .time-search {
          width: calc(100% - 165px);
          height: 40px;
          line-height: 40px;
          position: absolute;
          right: 8px;
          top: 0;
        }
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
    margin-bottom: 16px;

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

.personnel-score {
  width: 100%;
  height: 600px;
  overflow-y: auto;
}
</style>
