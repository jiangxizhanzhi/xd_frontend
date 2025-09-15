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
              v-if="true"
              :dataList="courseLearnRank"
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
            <line-chart v-if="true"></line-chart>
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
              v-if="true"
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
              v-if="true"
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
              v-if="true"
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
              v-if="true"
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
            ref="sdlRef"
            url="/oj/admin/statistic/course_statistics_list"
            baseURL="/api/ojj"
            :cols="columns"
            :data="query"
            row-key="resource_id"
            :searchBarBg="false"
          >
            <template v-slot:search>
              <cb-select
                v-model="query.direction"
                clearable="clearable"
                :first="{
                  value: '',
                  label: $t('m.allDirection'),
                }"
                :options="typesOptions"
              ></cb-select>
              <cb-select
                v-model="query.difficulty"
                clearable="clearable"
                :first="{
                  value: '',
                  label: $t('m.allDifficulty'),
                }"
                :options="difficultyOptions"
              ></cb-select>
              <cb-search-input
                v-model="query.pattern"
                :placeholder="$t('m.pleaseEnterName')"
              ></cb-search-input>
            </template>
            <template v-slot:lesson_count="scope">
              <span>{{ scope.data.lesson_count }}</span>
            </template>
            <template v-slot:difficulty="scope">
              <div>
                <span v-if="scope.data.difficulty % 3 === 0">{{
                  computedDifficulty(scope.data.difficulty)
                }}</span>
                <span v-if="scope.data.difficulty % 3 === 1">{{
                  computedDifficulty(scope.data.difficulty)
                }}</span>
                <span v-if="scope.data.difficulty % 3 === 2">{{
                  computedDifficulty(scope.data.difficulty)
                }}</span>
              </div>
            </template>
            <template v-slot:operation="scope">
              <cb-button
                type="text"
                @click="goToLesson(scope.data)"
              >{{
                $t('courseStatistics.viewingClassHourStatistics')
              }}</cb-button>
            </template>
          </cb-search-table>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import topTitle from './components/top-title.vue';
import BarChart from './components/bar-chart.vue';
import ScoreBarChart from './components/score-bar-chart.vue';
import LineChart from './components/line-chart.vue';
import NoData from './components/no-data.vue';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
import { DIFFICULTY, TYPE } from './contant.js';
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
      DIFFICULTY,
      TYPE,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      // 表示是否是浅色系
      light: true,
      expandArr: {},
      tableData: [],
      query: {
        direction: '',
        difficulty: '',
        search_text: '',
      },
      typesOptions: [],
      multipleSelection: [],
      courseLearnRank: [], // 课程学习人次排名
      courseDirectionRank: [], // 课程方向学习人次排名
      difficultyOptions: [],
    };
  },
  created() {
    const that = this;
    this.columns = [
      {
        label: this.$t('m.courseName'),
        prop: 'name',
        sorter: 'name',
        width: '300px',
      },
      {
        label: this.$t('m.direction'),
        getData(row) {
          const { category_name = '', type = null } = row;
          if (category_name) {
            return category_name;
          } else {
            if (type === that.TYPE.THEORY) {
              return that.$t('m.theory');
            } else if (type === that.TYPE.LABSTYPE) {
              return that.$t('m.LABS');
            }
          }
        },
      },
      {
        label: this.$t('m.difficulty'),
        slot: 'difficulty',
        sorter: 'difficulty',
      },
      {
        label: this.$t('m.classHours'),
        prop: 'lesson_count',
        slot: 'lesson_count',
      },
      {
        label: this.$t('m.numberOfLearners'),
        prop: 'heat',
        sorter: 'heat',
      },
      {
        label: this.$t('m.numberOfReportsSubmitted'),
        prop: 'finish_report_count',
        sorter: 'finish_report_count',
        minWidth: 125,
      },
      {
        label: this.$t('m.creator'),
        prop: 'create_user',
      },
      {
        label: this.$t('m.operation'),
        slot: 'operation',
        width: '150px',
      },
    ];
  },
  mounted() {
    this.listenFunc();
    this.listen.createListen();
    this.getDirectionOptions();
    this.getEchartsData();
    this.getDifficultyOptions();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 课程学习人次排名 - 课程方向学习人次排名
    getEchartsData() {
      // 课程学习人次排名
      this.$request
        .get('/oj/admin/statistic/course_histogram', null, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const tempdata = _.get(res, 'data.data', []);
          for (let i = 0; i < tempdata.xnames.length; i++) {
            const tempItem = {
              name: tempdata.xnames[i],
              value: tempdata.yvalues[i],
            };
            this.$set(this.courseLearnRank, i, tempItem);
          }
        })
        .catch((err) => {
          this.$serverError(err);
        });
      // 课程方向学习人次排名
      this.$request
        .get('/oj/admin/statistic/direction_histogram', null, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const tempdata = _.get(res, 'data.data', []);
          for (let i = 0; i < tempdata.xnames.length; i++) {
            const tempItem = {
              name: tempdata.xnames[i],
              value: tempdata.yvalues[i],
            };
            this.$set(this.courseDirectionRank, i, tempItem);
          }
        })
        .catch((err) => {
          this.$serverError(err);
        });
    },
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.light = false;
      } else {
        this.light = true;
      }
    },
    // 查询出所有的课程方向
    getDirectionOptions() {
      this.$request
        .get(
          '/oj/admin/course/direction/list',
          {
            children: false,
            page: 1,
            per_page: 9999,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const typesOptions = this.typesOptions.concat(res.data.data.list);
          for (let item of typesOptions) {
            item.label = item.name;
            item.value = item?.resource_id;
          }
          this.typesOptions = typesOptions;
        })
        .catch(() => { });
    },
    //获取难度列表数据
    getDifficultyOptions() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 37,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              value: item.code,
              label: item.name,
            };
          });
          this.difficultyOptions = arr;
        });
    },
    //根据难度值获取难度标签
    computedDifficulty(difficulty) {
      const data = this.difficultyOptions.filter(
        (item) => item.value === difficulty,
      );
      if (data.length) {
        return data[0].label;
      }
    },
    goToLesson(row) {
      this.$router.push({
        name: 'period-statistics',
        params: {
          courseId: row.resource_id,
          courseName: row.name,
        },
      });
    },
    leranCount(row) {
      if (row.type === this.TYPE.THEORY) {
        this.$router.push({
          name: 'theory-learn-count',
          params: {
            lessonId: row.resource_id,
          },
        });
      } else if (row.type === this.TYPE.LABSTYPE) {
        this.$router.push({
          name: 'learn-count',
          params: {
            lessonId: row.resource_id,
          },
        });
      }
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
