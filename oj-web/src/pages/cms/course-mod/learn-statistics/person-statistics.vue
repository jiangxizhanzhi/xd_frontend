<template>
  <div class="all-person">
    <div class="top-ranking tabBg">
      <div class="th-heard">
        <top-title :name="$t('personStatistics.pointsRanking')" />
      </div>
      <div class="top-rank-progress">
        <div class="top-rank">
          <wing-title :title="$t('personStatistics.TOP10InClassPoints')" />
          <bar-chart
            v-if="classTops.length !== 0"
            :barColor="'blue-color'"
            :dataList="classTops"
          ></bar-chart>
          <no-data v-else></no-data>
        </div>
        <div class="top-rank">
          <wing-title :title="$t('personStatistics.TOP10InIndividualPoints')" />
          <bar-chart
            v-if="personalTops.length !== 0"
            :barColor="'primary-color'"
            :dataList="personalTops"
          ></bar-chart>
          <no-data v-else></no-data>
        </div>
      </div>
    </div>
    <div class="ranking tabBg">
      <div class="th-heard">
        <top-title :name="$t('personStatistics.learningStatisticsRanking')" />
      </div>
      <div class="group-button-area">
        <cb-radio-group
          v-model="activeStatics"
          @change="changeStatics"
          class="radio-btn-person mb10"
        >
          <cb-radio-button
            :label="$t('personStatistics.personRanking')"
          ></cb-radio-button>
          <cb-radio-button
            :label="$t('personStatistics.organizationRanking')"
          ></cb-radio-button>
        </cb-radio-group>
      </div>
      <div class="rank-progress">
        <div class="study-rank">
          <div class="study-rank-title">
            {{ $t('learningStatistics.rankingOfTotalLearningCourses') }}
          </div>
          <div class="study-rank-content">
            <ranking-course
              v-if="studyRankName.length !== 0"
              :className="studyRankName"
              :data="studyRank"
              :showXLabel="true"
            />
            <no-data v-else></no-data>
          </div>
        </div>
        <div class="experiment-rank">
          <div class="experiment-rank-title">
            {{ $t('learningStatistics.rankingOfEndExperiment') }}
          </div>
          <div class="experiment-rank-content">
            <ranking-course
              v-if="experimentRankName.length !== 0"
              :className="experimentRankName"
              :data="experimentRank"
              :showXLabel="true"
            />
            <no-data v-else></no-data>
          </div>
        </div>
        <div class="exam-rank">
          <div class="exam-rank-title">
            {{ $t('personStatistics.rankingNumberTests') }}
          </div>
          <div class="exam-rank-content">
            <ranking-course
              v-if="examRank.length !== 0"
              :className="examRankName"
              :data="examRank"
              :showXLabel="true"
            />
            <no-data v-else></no-data>
          </div>
        </div>
        <div class="practice-rank">
          <div class="practice-rank-title">
            {{ $t('learningStatistics.completeCoursePracticeRanking') }}
          </div>
          <div class="practice-rank-content">
            <ranking-course
              v-if="practiceRankName.length !== 0"
              :className="practiceRankName"
              :data="practiceRank"
              :showXLabel="true"
            />
            <no-data v-else></no-data>
          </div>
        </div>
      </div>
    </div>
    <div class="course-statistics tabBg">
      <div class="th-head">
        <top-title :name="$t('personStatistics.studyData')" />
      </div>
      <div class="group-button-area">
        <cb-radio-group
          v-model="activeData"
          @change="changeData"
          class="radio-btn-person mb15"
        >
          <cb-radio-button
            :label="$t('personStatistics.allData')"
          ></cb-radio-button>
          <cb-radio-button
            :label="$t('personStatistics.orgData')"
          ></cb-radio-button>
        </cb-radio-group>
      </div>
      <div class="th-echarts">
        <cb-search-table
          ref="sdlRefb"
          :url="activeData === $t('personStatistics.allData') ? allUrl : orgUrl"
          baseURL="/api/ojj"
          :cols="
            activeData === $t('personStatistics.allData')
              ? columnsAll
              : columnsOrg
          "
          :data="query"
          row-key="resource_id"
          :background="true"
          :searchBarBg="false"
        >
          <template v-slot:filter>
            <cb-cascader
              class="mr20"
              v-model="organizationValue"
              :placeholder="$t('views.notice.validator.selectOrganization')"
              :clearable="true"
              :options="options"
              @change="handleOrganizationChange"
              :props="optionProps"
            ></cb-cascader>
            <cb-date-picker
              v-model="statisTime"
              type="daterange"
              align="right"
              unlink-panels
              :range-separator="$t('scene.To')"
              :start-placeholder="$t('m.starttime')"
              :end-placeholder="$t('m.endtime')"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            >
            </cb-date-picker>
            <cb-search-input
              v-if="activeData === $t('personStatistics.allData')"
              v-model="query.pattern"
              :placeholder="$t('user.pleaseInputSelectName')"
            ></cb-search-input>
            <!-- <cb-input
              v-model="query.pattern"
              :placeholder="$t('user.pleaseInputSelectName')"
              style="width: 300px"
              prefix-icon="el-icon-search"
            ></cb-input> -->
          </template>
          <template v-slot:search>
            <cb-button
              icon="icon-daochu"
              v-if="activeData === $t('personStatistics.allData')"
              :loading="loadingAll"
              hollow
              @click="exportAll()"
            >
              {{ $t('personStatistics.exportData') }}
            </cb-button>
            <cb-button
              v-else
              icon="icon-daochu"
              :loading="loadingOrg"
              hollow
              @click="exportOrg()"
            >
              {{ $t('personStatistics.exportData') }}
            </cb-button>
          </template>
          <template v-slot:Opeator="scope">
            <div class="column-clickable" @click="getPersonStatis(scope.data)">
              {{ $t('learningStatistics.viewPersonalDetails') }}
            </div>
          </template>
        </cb-search-table>
      </div>
    </div>
  </div>
</template>
<script>
import SearchInput from '@/components/search-condition/search-input';
import { getOrgData } from '@/api/organization.js';
import rankingCourse from './components/ranking-course-chart.vue';
import wingTitle from '@/components/wing-title/index.vue';
import topTitle from '@/components/Title/index.vue';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
import BarChart from './components/bar-chart.vue';
import NoData from './components/no-data.vue';
import { getLanguage } from '@cyber/helper';
export default {
  components: {
    SearchInput,
    rankingCourse,
    wingTitle,
    topTitle,
    BarChart,
    NoData,
  },
  data() {
    return {
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      language: getLanguage(),
      // 表示是否是浅色系
      light: true,
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      query: {
        pattern: '',
        organization: '',
        startTime: '',
        endTime: '',
      },
      statisTime: '',
      organizationValue: [], // 保存级联选择器数据
      options: [], // cascader 数据源
      orgColorMap: [
        this.$themed('--yellow-color'),
        this.$themed('--primary-color'),
      ],
      studyRank: [],
      studyRankName: [],
      experimentRank: [],
      experimentRankName: [],
      practiceRank: [],
      practiceRankName: [],
      examRank: [],
      examRankName: [],
      classTops: [], // 班级积分Top10
      personalTops: [], // 个人积分Top10
      activeStatics: this.$t('personStatistics.personRanking'),
      activeData: this.$t('personStatistics.allData'),
      pickerOptions: {
        disabledDate(time) {
          // 设置禁用状态，参数为当前日期，要求返回 Boolean
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: this.$t('personStatistics.lastMonth'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: this.$t('personStatistics.lastTwoYears'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 730);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      comCols: [
        {
          label: this.$t('m.classCompletedTime'),
          prop: 'lesson_record_count',
          width: this.language === 'zh-CN' ? '80px' : '90px',
        },
        {
          label: this.$t('m.experimentCompleted'),
          prop: 'finish_report_count',
          width: this.language === 'zh-CN' ? '80px' : '100px',
        },
        {
          label: this.$t('m.exerciseCompleted'),
          prop: 'finish_practice_count',
          width: this.language === 'zh-CN' ? '80px' : '110px',
        },
        {
          label: this.$t('personStatistics.NumberOfTestsCompleted'),
          prop: 'finish_exam_count',
          width: this.language === 'zh-CN' ? '80px' : '90px',
        },
        {
          label: this.$t('m.averageLaboratoryScore'),
          prop: 'report_average',
          width: this.language === 'zh-CN' ? '112px' : '102px',
        },
      ],
      columnsAll: [],
      columnsOrg: [],
      allUrl: '/oj/admin/course/personal-stats/person-stats',
      orgUrl: '/oj/admin/course/personal-stats/org-stats-data',
      loadingAll: false,
      loadingOrg: false,
    };
  },
  computed: {},
  watch: {
    statisTime: {
      handler(nv, ov) {
        if (nv) {
          this.query.startTime = _.get(nv, '[0]', '');
          this.query.endTime = _.get(nv, '[1]', '');
        } else {
          this.query.startTime = '';
          this.query.endTime = '';
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.columnsAll = [
      {
        label: this.$t('user.username'),
        prop: 'username',
        width: 112,
      },
      {
        label: this.$t('m.name'),
        prop: 'name',
        width: 112,
      },
      {
        label: this.$t('m.organization'),
        prop: 'organization_data',
        width: this.language === 'zh-CN' ? '216px' : '176px',
      },
      {
        label: this.$t('m.role'),
        getData: (row) => {
          const { roles } = row;
          const list = [];
          if (roles) {
            roles.forEach((item) => {
              list.push(item.name);
            });
            return list.join('/');
          }
        },
        width: this.language === 'zh-CN' ? '216px' : '176px',
      },
      ...this.comCols,
      {
        label: this.$t('m.operation'),
        slot: 'Opeator',
        width: this.language === 'zh-CN' ? '112px' : '132px',
      },
    ];
    this.columnsOrg = [
      {
        label: this.$t('m.organization'),
        prop: 'organization_data',
        width: '20%',
      },
      {
        label: this.$t('m.peopleNum'),
        prop: 'org_user_count',
      },
      {
        label: this.$t('m.classCompletedTime'),
        prop: 'lesson_record_count',
      },
      {
        label: this.$t('m.experimentCompleted'),
        prop: 'finish_report_count',
      },
      {
        label: this.$t('m.exerciseCompleted'),
        prop: 'finish_practice_count',
      },
      {
        label: this.$t('personStatistics.NumberOfTestsCompleted'),
        prop: 'finish_exam_count',
      },
      {
        label: this.$t('m.averageLaboratoryScore'),
        prop: 'report_average',
      },
    ];
    this.getOrganization();
    this.rankData();
    this.classTopTen();
    this.personTopTen();
  },

  mounted() {
    this.listenFunc();
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 班级积分top10
    classTopTen() {
      this.$request
        .get('/oj/admin/course/personal-stats/class_integral', null, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const tempdata = _.get(res, 'data.data', []);
          for (let i = 0; i < tempdata.xnames.length; i++) {
            const item = {
              name: tempdata.xnames[i],
              value: tempdata.yvalues[i],
            };
            this.$set(this.classTops, i, item);
          }
        });
    },
    // 个人积分top10
    personTopTen() {
      this.$request
        .get('/oj/admin/course/personal-stats/personal-integral', null, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const tempdata = _.get(res, 'data.data', []);
          for (let i = 0; i < tempdata.xnames.length; i++) {
            const item = {
              name: tempdata.xnames[i],
              value: tempdata.yvalues[i],
            };
            this.$set(this.personalTops, i, item);
          }
        });
    },
    // 导出数据
    exportAll(done) {
      this.loadingAll = true;
      let params = {};
      if (this.query.startTime) {
        params = {
          startTime: this.query.startTime,
          endTime: this.query.endTime,
        };
      }
      this.$request
        .binaryDownload(
          'get',
          '/oj/admin/course/personal-stats/user-stats-data-export',
          params,
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          this.loadingAll = false;
        })
        .catch(() => {
          this.loadingAll = false;
        });
    },
    exportOrg(done) {
      this.loadingOrg = true;
      let params = {};
      if (this.query.startTime) {
        params = {
          startTime: this.query.startTime,
          endTime: this.query.endTime,
        };
      }
      this.$request
        .binaryDownload(
          'get',
          '/oj/admin/course/personal-stats/org-stats-data-export',
          params,
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          this.loadingOrg = false;
        })
        .catch(() => {
          this.loadingOrg = false;
        });
    },
    changeStatics() {
      this.rankData();
    },
    changeData() {
      this.statisTime = '';
      this.query.pattern = '';
      this.query.organization = '';
      this.query.startTime = '';
      this.query.endTime = '';
      this.organizationValue = [];
      this.$refs.sdlRefb.reload();
    },
    // 学习统计排名
    rankData() {
      let axiosUrl = '';
      if (this.activeStatics === this.$t('personStatistics.personRanking')) {
        axiosUrl = '/oj/admin/course/personal-stats/person-stats-rank';
      } else {
        axiosUrl = '/oj/admin/course/personal-stats/org-stats-rank';
      }
      this.$request
        .get(axiosUrl, null, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const rankingData = res.data.data;
          this.practiceRank = this.polish(rankingData.finish_practice_count, 5);
          this.practiceRankName = this.polish(
            rankingData.finish_practice_user,
            5,
          );
          this.studyRank = this.polish(rankingData.lesson_record_count, 5);
          this.studyRankName = this.polish(rankingData.lesson_record_user, 5);
          this.experimentRank = this.polish(rankingData.finish_report_count, 5);
          this.experimentRankName = this.polish(
            rankingData.finish_report_user,
            5,
          );
          this.examRank = this.polish(rankingData.attend_exam_count || [], 5);
          this.examRankName = this.polish(
            rankingData.attend_exam_user || [],
            5,
          );
        })
        .catch((err) => {
          this.$serverError(err);
        });
    },
    polish(arr, len) {
      if (arr.length >= len || arr.length === 0) {
        return arr;
      } else {
        const residue = len - arr.length;
        const cloneArr = _.clone(arr);
        for (var i = 0; i < residue; i++) {
          cloneArr.push('');
        }
        return cloneArr;
      }
    },
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.light = false;
      } else {
        this.light = true;
      }
      this.orgColorMap = [
        this.$themed('--yellow-color'),
        this.$themed('--primary-color'),
      ];
    },
    getOrganizationDis(org) {
      let orgArr = org && org.split('/');
      let orgArrDisplay = '';
      if (orgArr == null) {
        return orgArrDisplay;
      }
      orgArr.forEach((element, index) => {
        if (index == 0 || index == 1) {
          orgArrDisplay += `<span style="color:${this.orgColorMap[index]}">${element}</span>`;
          if (index != orgArr.length - 1) {
            orgArrDisplay += '/';
          }
        } else {
          orgArrDisplay += `<span>${element}</span>`;
          if (index != orgArr.length - 1) {
            orgArrDisplay += '/';
          }
        }
      });
      return orgArrDisplay;
    },
    // 点击进入个人学习统计页面
    getPersonStatis(row) {
      let roleName = '';
      if (row.roles) {
        const { roles } = row;
        const list = [];
        roles.forEach((item) => {
          list.push(item.name);
        });
        roleName = list.join('/');
      }
      this.$router.push({
        name: 'user-info',
        params: {
          userId: row.resource_id,
        },
        query: {
          name: row.name,
          username: row.username,
          role: roleName,
          organization_data: row.organization_data,
          avatar: row.avatar,
        },
      });
    },

    // 根据组织架构去查询数据
    handleOrganizationChange(val) {
      const { length } = val;
      this.query.organization = val[length - 1];
    },
    // 获取 组织架构 的 tree 结构，并做处理
    getOrganization() {
      // Api.getOrfanizations()
      //   .then((res) => {
      //     if (res.status !== 200) return;
      //     this.options = res.data;
      //   })
      //   .catch(() => {});
      getOrgData().then((res) => {
        this.options = _.get(res, 'data.data', []);
      });
    },
  },
};
</script>
<style scoped lang="scss">
.time-range {
  color: var(--neutral8);
  font-size: 14px;
  margin-left: 10px;
}

.tabBg {
  position: relative;
  background-color: var(--bg-color-2);
}
.search-top {
  display: flex;
}
.table-grid {
  margin-top: 20px;
}
.column-clickable {
  cursor: pointer;
  color: var(--primary-color);
}
.all-person {
  width: 100%;
  // height: 340px;
  padding-right: 16px;
  box-sizing: border-box;
  .top-ranking {
    width: 100%;
    height: 340px;
    display: flex;
    flex-direction: column;
    padding: 10px 20px 20px;
    margin-bottom: 16px;
    box-sizing: border-box;
    .top-rank-progress {
      width: 100%;
      height: calc(100% - 80px);
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-around;
      .top-rank {
        flex: 1;
        height: calc(260px - 30px);
        color: var(--neutral8);
        text-align: center;
      }
    }
  }
  .th-heard {
    width: 100%;
    height: 30px;
    margin-bottom: 15px;
    box-sizing: border-box;
    color: var(--neutral8);
    font-size: 14px;
  }
  .center {
    position: relative;
    z-index: 3;
    text-align: center;
    line-height: 230px;
    color: var(--neutral6);
  }
  .ranking {
    width: 100%;
    height: 360px;
    display: flex;
    flex-direction: column;
    padding: 10px 20px 20px;
    margin-bottom: 16px;
    box-sizing: border-box;

    .group-button-area {
      display: flex;
      flex-direction: row-reverse;
      position: relative;
      margin-bottom: 10px;
      .cb-radio-group {
        position: absolute;
        top: -40px;
      }
    }

    .rank-progress {
      width: 100%;
      height: calc(100% - 10px);
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-around;
      .study-rank,
      .experiment-rank,
      .exam-rank,
      .practice-rank {
        // width: 32%;
        padding: 16px 0px;
        flex: 1;
        height: 100%;
        color: var(--neutral8);
        text-align: center;
        background: var(--neutral0);
        &-title {
          font-size: 14px;
          font-weight: 'Semibold';
        }
        &-content {
          height: 98%;
        }
      }
      .study-rank,
      .experiment-rank,
      .exam-rank {
        margin-right: 24px;
      }
      .experiment-rank {
      }
      .practice-rank {
      }
    }
  }
  .course-statistics {
    width: 100%;
    padding: 10px 20px 20px;
    .th-head {
      padding-bottom: 10px;
    }
    .group-button-area {
      display: flex;
      flex-direction: row-reverse;
      position: relative;
      .cb-radio-group {
        position: absolute;
        top: -40px;
      }
    }
    .th-echarts {
      position: relative;
      z-index: 999;
    }
  }
}
</style>
