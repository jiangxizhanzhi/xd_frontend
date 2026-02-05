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
            ref="tableStudentRef"
            url="/cr/admin/xd_statistics/detail"
            baseURL="/api/ojj"
            :cols="columns"
            row-key="user_id"
            :searchBarBg="false"
            :show-search-btn="false"
            :data.sync="queryStudent"
          >
            <template v-slot:search="scoped">
              <div class="time-search export">
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
                  @change="changeStudentTime"
                >
                </cb-date-picker>
                <cb-button ml mr @click="handleStudentSearch">搜索</cb-button>
                <cb-button mr @click="handleStudentReset" hollow>重置</cb-button>
                <cb-button @click="handleStudentExport">导出Excel</cb-button>
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
            :data.sync="query"
          >
            <template v-slot:search="scoped">
              <div class="time-search export">
                <cb-date-picker
                  style="width: 100%"
                  v-model="outInterfaceStatistics.date"
                  @change="changeTime"
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
                <cb-button ml mr @click="handleSearch">搜索</cb-button>
                <cb-button mr @click="handleReset" hollow>重置</cb-button>
                <cb-button @click="handleExport">导出Excel</cb-button>
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
  getXdStatisticsDetailApi,
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
          width: 380,
          resize: true,
        },
        {
          label: this.$t('类别'),
          slot: 'category',
          width: 120,
        },
        {
          label: this.$t('难度'),
          slot: 'difficult',
          width: 120,
        },
        {
          label: this.$t('训练类型'),
          prop: 'train_xd_sub_type',
          width: 120,
        },
        {
          label: this.$t('拓扑节点数'),
          prop: 'nodes_count',
          width: 120,
        },
        {
          label: this.$t('参与人数'),
          prop: 'user_count',
          width: 120,
        },
        {
          label: this.$t('提交任务数'),
          prop: 'submit_mission_count',
          width: 120,
        },
        {
          label: this.$t('开始时间'),
          prop: 'start_time',
          width: 220,
        },
        {
          label: this.$t('结束时间'),
          prop: 'end_time',
          width: 220,
        },
        {
          label: this.$t('操作'),
          slot: 'operate',
          width: 120,
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
      query: {
        startTime: '',
        endTime: '',
      },
      queryStudent: {
        startTime: '',
        endTime: '',
      }
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
    handleExport() {
      const params = {
        page: 1,
        per_page: 99999,
      };
      if (
        this.outInterfaceStatistics.date &&
        this.outInterfaceStatistics.date.length
      ) {
        params.startTime = this.outInterfaceStatistics.date[0];
        params.endTime = this.outInterfaceStatistics.date[1];
      }
      getXdOutInterfaceApi(params).then((res) => {
        const data = _.get(res, 'data.data', []);
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.data)) {
          list = data.data;
        } else if (data && Array.isArray(data.list)) {
          list = data.list;
        }

        if (!list.length) {
          this.$message.warning(this.$t('暂无数据导出'));
          return;
        }
        this.exportToExcel(list);
      });
    },
    handleStudentExport() {
      const params = {
        page: 1,
        per_page: 99999,
      };
      if (
        this.traineeStatistics.date &&
        this.traineeStatistics.date.length
      ) {
        params.startTime = this.traineeStatistics.date[0];
        params.endTime = this.traineeStatistics.date[1];
      }
      getXdStatisticsDetailApi(params).then((res) => {
        const data = _.get(res, 'data.data', []);
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.data)) {
          list = data.data;
        } else if (data && Array.isArray(data.list)) {
          list = data.list;
        }

        if (!list.length) {
          this.$message.warning(this.$t('暂无数据导出'));
          return;
        }
        this.exportStudentToExcel(list);
      });
    },
    exportStudentToExcel(list) {
      let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]><xml>
            <x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
              <x:Name>Sheet1</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
          </xml><![endif]-->
        </head>
        <body>
          <table border="1" style="font-family: '宋体';">
            <colgroup>
              <col width="120">
              <col width="100">
              <col width="150">
              <col width="100">
              <col width="100">
              <col width="100">
              <col width="100">
              <col width="100">
              <col width="100">
              <col width="100">
              <col width="100">
              <col width="100">
            </colgroup>
            <thead>
              <tr style="font-family: '宋体';">
                <th>${this.$t('用户名')}</th>
                <th>${this.$t('姓名')}</th>
                <th>${this.$t('组织')}</th>
                <th>${this.$t('角色')}</th>
                <th>${this.$t('完成训练')}</th>
                <th>${this.$t('完成实验')}</th>
                <th>${this.$t('完成科目')}</th>
                <th>${this.$t('完成演训')}</th>
                <th>${this.$t('完成任务')}</th>
                <th>${this.$t('任务正确率')}</th>
                <th>${this.$t('累计得分')}</th>
                <th>${this.$t('综合排名')}</th>
              </tr>
            </thead>
            <tbody>`;

      list.forEach((item) => {
        excelContent += `
              <tr style="font-family: '宋体';">
                <td style="mso-number-format:'\\@'">${item.username || ''}</td>
                <td>${item.name || ''}</td>
                <td>${item.organization_data || ''}</td>
                <td>${this.computedRoles(item.roles) || ''}</td>
                <td>${item.train_times || 0}</td>
                <td>${item.sy_times || 0}</td>
                <td>${item.km_times || 0}</td>
                <td>${item.zhyx_times || 0}</td>
                <td>${item.task_num || 0}</td>
                <td>${item.task_accuracy || ''}</td>
                <td>${item.total_score || 0}</td>
                <td>${item.overall_rank || ''}</td>
              </tr>`;
      });

      excelContent += `
            </tbody>
          </table>
        </body>
        </html>`;

      const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', '训练学员统计.xls');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportToExcel(list) {
      let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]><xml>
            <x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
              <x:Name>Sheet1</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
          </xml><![endif]-->
        </head>
        <body>
          <table border="1" style="font-family: '宋体';">
            <colgroup>
              <col width="200">
              <col width="120">
              <col width="80">
              <col width="120">
              <col width="160">
              <col width="160">
            </colgroup>
            <thead>
              <tr style="font-family: '宋体';">
                <th>${this.$t('名称')}</th>
                <th>${this.$t('类别')}</th>
                <th>${this.$t('难度')}</th>
                <th>${this.$t('训练类型')}</th>
                <th>${this.$t('开始时间')}</th>
                <th>${this.$t('结束时间')}</th>
              </tr>
            </thead>
            <tbody>`;

      list.forEach((item) => {
        excelContent += `
              <tr style="font-family: '宋体';">
                <td>${item.name || ''}</td>
                <td>${this.computedCategory(item.category) || ''}</td>
                <td>${this.computedDifficult(item.category) || ''}</td>
                <td>${item.train_xd_sub_type || ''}</td>
                <td style="mso-number-format:'\\@'">${item.start_time || ''}</td>
                <td style="mso-number-format:'\\@'">${item.end_time || ''}</td>
              </tr>`;
      });

      excelContent += `
            </tbody>
          </table>
        </body>
        </html>`;

      const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', '实验统计.xls');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    handleReset() {
      this.outInterfaceStatistics = ['', ''];
      this.query.startTime = '';
      this.query.endTime = '';
      this.$refs.tableRef.reload();
    },
    handleStudentReset() {
      this.traineeStatistics = ['', ''];
      this.queryStudent.startTime = '';
      this.queryStudent.endTime = '';
      this.$refs.tableStudentRef.reload();
    },
    studentStatistics(data) {
      this.train_name = data.name
      this.resource_id = data.resource_id;
      this.dialogVisible = true;
      this.scoreList = [];
      trainReportApi({
        resource_id: this.resource_id,
        scoreCount: 10,
      }).then((res) => {
        const data = _.get(res, 'data.data');
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
    handleSearch() {
      this.$refs.tableRef.reload();
    },
    handleStudentSearch() {
      this.$refs.tableStudentRef.reload();
    },
    // 时间选择
    changeTime($event) {
      if ($event) {
        this.query.startTime = $event[0];
        this.query.endTime = $event[1];
      } else {
        this.query.startTime = '';
        this.query.endTime = '';
      }
    },
    changeStudentTime($event) {
      if ($event) {
        this.queryStudent.startTime = $event[0];
        this.queryStudent.endTime = $event[1];
      } else {
        this.queryStudent.startTime = '';
        this.queryStudent.endTime = '';
      }
    }
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
.export {
  display: flex;
  padding-left: 8px;
}
</style>
