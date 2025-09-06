<template>
  <!-- 此页面可封装成组件 -->
  <cb-inner-page :background="false">
    <div class="custom-table">
      <div class="search-wrapper">
        <cb-select
          v-model="studyModel.plan_status"
          :placeholder="$t('m.statusph')"
          class="mr20"
          style="width: 300px"
          :options="statusList"
          clearable
          @change="planStatusChange"
        >
        </cb-select>
        <cb-search-input
          style="width: 300px"
          v-model="studyModel.pattern"
          :placeholder="$t('course.enterCourseLessonName')"
          @change="getSearchPattern"
          clearable
        ></cb-search-input>
      </div>
      <div class="table-wrapper">
        <div class="table-header">
          <div
            class="header-item"
            v-for="item in tableHeader"
            :key="item.label"
            :style="{ width: item.width }"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="table-content" v-if="tableData.length">
          <div
            class="table-tr"
            v-for="item in tableData"
            :key="item.resource_id"
          >
            <div class="table-tr-content">
              <div class="table-tr-th" style="width: 60%">
                <div class="th-expand-icon">
                  <div class="th-expand-icon-group" @click="iconClick(item)">
                    <cb-iconfont
                      type="icon-quanbuzhankai"
                      v-if="!item.checked"
                      :size="16"
                      color="var(--neutral5)"
                    ></cb-iconfont>
                    <cb-iconfont
                      type="icon-quanbushouqi"
                      v-if="item.checked"
                      :size="16"
                      color="var(--neutral5)"
                    ></cb-iconfont>
                  </div>
                  <div class="th-title" :title="item.name">{{ item.name }}</div>
                </div>
              </div>
              <div class="table-tr-th" style="width: 10%">
                {{ item.mission_count_total }}
              </div>
              <div class="table-tr-th" style="width: 10%">
                {{
                  `${item.course_practice_count}/${item.course_practice_count_total}`
                }}
              </div>
              <div class="table-tr-th" style="width: 10%">
                {{
                  `${item.experiment_report_count}/${item.experiment_report_count_total}`
                }}
              </div>
              <div
                class="table-tr-th"
                style="width: 10%"
                :style="{
                  color: scheduleStatusStyle(item.plan_status),
                }"
              >
                {{ scheduleStatus(item.plan_status) }}
              </div>
            </div>

            <div class="expand-content" v-if="item.checked">
              <div class="expand-table">
                <div class="expand-table-header">
                  <div
                    class="expand-table-header-item"
                    v-for="itemInner in expandInnerHeader"
                    :key="itemInner.label"
                    :style="{ width: itemInner.width }"
                  >
                    {{ itemInner.label }}
                  </div>
                </div>
                <div class="expand-table-content">
                  <div
                    class="expand-table-tr"
                    v-for="(item3, index3) in item.lessons"
                    :key="item3.lesson_id + index3"
                  >
                    <div
                      class="expand-table-tr-th expand-table-tr-overflow"
                      style="width: 30%"
                    >
                      {{ item3.lesson_name }}
                    </div>
                    <div class="expand-table-tr-th" style="width: 15%">
                      {{ item3.start_time }}
                    </div>
                    <div class="expand-table-tr-th" style="width: 15%">
                      {{ item3.end_time }}
                    </div>
                    <div class="expand-table-tr-th" style="width: 10%">
                      {{
                        item3.lesson_type === 0 ? $t('m.theory') : $t('m.LABS')
                      }}
                    </div>
                    <div
                      class="expand-table-tr-th"
                      style="width: 10%"
                      :style="{ color: practiceStatusStyle(item3) }"
                    >
                      {{ practiceStatus(item3) }}
                    </div>
                    <div
                      class="expand-table-tr-th"
                      style="width: 10%"
                      :style="{ color: reportStatusStyle(item3) }"
                    >
                      {{ reportStatus(item3) }}
                    </div>
                    <div
                      class="expand-table-tr-th"
                      :style="{
                        width: '10%',
                        color: 'var(--primary-color)',
                        cursor: 'pointer',
                      }"
                      @click="gotoDetail(item3)"
                    >
                      {{ $t('course.detail') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-wrapper" v-else>
          <empty></empty>
        </div>
      </div>
      <div class="pagination-wrapper" v-if="tableData.length">
        <cb-pagination
          :total="total"
          :current-page="studyModel.page"
          :current="studyModel.page"
          :page-size.sync="studyModel.per_page"
          @current-change="planPageChange"
          @size-change="planPageSizeChange"
        ></cb-pagination>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import Empty from '@/components/empty/index.vue';
import { mineStudyPlanList } from '@/api/course';
import { getComConstantsConfig } from '@/api/common';
import _ from 'lodash';
export default {
  components: { Empty },
  data() {
    return {
      tableHeader: [
        {
          label: this.$t('course.schedule'),
          prop: 'name',
          width: '60%',
        },
        {
          label: this.$t('course.taskNumber'),
          prop: 'mission_count_total',
          width: '10%',
        },
        {
          label: this.$t('course.practiceNumber'),
          prop: 'course_practice_count_total',
          width: '10%',
        },
        {
          label: this.$t('course.reportNumber'),
          prop: 'experiment_report_count_total',
          width: '10%',
        },
        {
          label: this.$t('course.status'),
          prop: 'plan_status',
          width: '10%',
        },
      ],
      tableData: [],

      expandInnerHeader: [
        {
          label: this.$t('course.lessonName'),
          prop: 'lesson_name',
          width: '30%',
        },
        {
          label: this.$t('m.starttime'),
          prop: 'start_time',
          width: '15%',
        },
        {
          label: this.$t('m.endtime'),
          prop: 'end_time',
          width: '15%',
        },
        {
          label: this.$t('m.type'),
          prop: 'lesson_type',
          width: '10%',
        },
        {
          label: this.$t('course.practiceEvaluation'),
          prop: 'practice_dec',
          width: '10%',
        },
        {
          label: this.$t('course.reportEvaluation'),
          prop: 'report_dec',
          width: '10%',
        },
        {
          label: this.$t('course.operation'),
          prop: 'operate',
          width: '10%',
        },
      ],
      studyModel: { page: 1, per_page: 10, plan_status: '', pattern: '' },
      total: 0,
      statusList: [],
      // 练习和报告状态常量
      submitStatusList: [],
      // 练习水平常量
      levelStatusList: [],
    };
  },
  mounted() {
    this.getMineLearnList();
    this.getStatusConfig();
    this.getPracticeReportConfig();
    this.getLevelStatusConfig();
  },
  methods: {
    // 获取教学课程状态
    getStatusConfig() {
      getComConstantsConfig({ type: 45 }).then((res) => {
        const result = _.get(res, 'data.data', []) || [];
        this.statusList = result.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },

    // 教学课程状态处理
    scheduleStatus(status) {
      const item = this.statusList.find((item) => item.value === status);
      if (item) {
        return item.label;
      } else {
        return '-';
      }
    },

    // 教学课程状态样式
    scheduleStatusStyle(status) {
      if (status === 1) {
        return 'var(--orange-color)';
      } else if (status === 2) {
        return 'var(--green-color)';
      } else if (status === 3) {
        return 'var(--neutral6)';
      } else {
        return 'var(--neutral6)';
      }
    },

    // 我的教学课程
    getMineLearnList() {
      const params = {
        ...this.studyModel,
      };
      mineStudyPlanList(params).then((res) => {
        const result = _.get(res, 'data.data.list', []) || [];
        const total = _.get(res, 'data.data.total', 0);
        result.forEach((item) => {
          item.checked = false;
        });
        this.tableData = result;
        this.total = total;
      });
    },

    iconClick(itemData) {
      /* this.tableData.forEach((item) => {
        if (itemData.resource_id != item.resource_id) {
          item.checked = false;
        }
      }); */
      itemData.checked = !itemData.checked;
    },

    planPageChange(val) {
      this.studyModel.page = val;
      this.getMineLearnList();
    },

    planPageSizeChange(val) {
      this.studyModel.page = 1;
      this.studyModel.per_page = val;
      this.getMineLearnList();
    },

    planStatusChange() {
      this.getMineLearnList();
    },

    getSearchPattern() {
      this.getMineLearnList();
    },

    // 获取练习和报告状态常量
    getPracticeReportConfig() {
      getComConstantsConfig({ type: 46 }).then((res) => {
        const result = _.get(res, 'data.data', []) || [];
        this.submitStatusList = result.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },

    // 获取练习水平常量
    getLevelStatusConfig() {
      getComConstantsConfig({ type: 47 }).then((res) => {
        const result = _.get(res, 'data.data', []) || [];
        this.levelStatusList = result.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },

    practiceStatusStyle(item) {
      if (item.level_status) {
        if (item.level_status === 1) {
          return 'var(--yellow-color)';
        } else if (item.level_status === 2) {
          return 'var(--orange-color)';
        } else {
          return 'var(--neutral6)';
        }
      } else {
        return 'var(--neutral6)';
      }
    },

    practiceStatus(row) {
      const levelStatusItem = this.submitStatusList.find(
        (item) => item.value === row.level_status,
      );
      const levelItem = this.levelStatusList.find(
        (item) => item.value === row.level,
      );
      if (levelStatusItem) {
        if (levelStatusItem.value === 1 || levelStatusItem.value === 2) {
          return levelStatusItem.label;
        } else {
          if (levelItem) {
            return levelItem.label;
          } else {
            return '-';
          }
        }
      } else {
        return '-';
      }
    },

    reportStatusStyle(item) {
      if (item.report_status) {
        if (item.report_status === 1) {
          return 'var(--yellow-color)';
        } else if (item.report_status === 2) {
          return 'var(--orange-color)';
        } else {
          if (item.report_passed_status) {
            return 'var(--green-color)';
          } else {
            return 'var(--red-color)';
          }
        }
      } else {
        return 'var(--neutral6)';
      }
    },

    reportStatus(row) {
      const reportStatusItem = this.submitStatusList.find(
        (item) => item.value === row.report_status,
      );
      if (reportStatusItem) {
        if (reportStatusItem.value === 1 || reportStatusItem.value === 2) {
          return reportStatusItem.label;
        } else {
          if (row.report_passed_status) {
            return this.$t('course.passedReport');
          } else {
            return this.$t('course.notPass');
          }
        }
      } else {
        return '-';
      }
    },

    gotoDetail(data) {
      this.$router.push({
        name: 'oj-all-course-lesson',
        params: {
          resource_id: data.course_id,
          lesson_id: data.lesson_id,
        },
        query: {
          room_id: data.classroom_id,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.empty-wrapper {
  width: 100%;
  height: 300px;
}
@mixin ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-wrapper {
  display: flex;
  margin-bottom: 20px;
}
.custom-table {
  background-color: var(--bg-color-2);
  padding: 16px;
  color: var(--neutral8);
  font-size: 14px;
  .table-header {
    background-color: var(--neutral0);
    display: flex;
    width: 100%;
    .header-item {
      padding: 12px 8px 12px 10px;
      position: relative;
      text-align: left;
    }
  }
  .table-content {
    display: flex;
    flex-direction: column;
    .table-tr {
      display: flex;
      flex-direction: column;
      border-bottom: solid 1px var(--neutral1);
      .table-tr-content {
        display: flex;
        flex-direction: row;
        .table-tr-th {
          padding: 10px;
          min-height: 48px;
          display: flex;
          align-items: center;
          .th-expand-icon {
            display: flex;
            align-items: center;
            width: 100%;
            .th-expand-icon-group {
              cursor: pointer;
              //border: solid 1px var(--primary-color);
              //border-radius: 2px;
            }
            .th-title {
              width: calc(100% - 30px);
              margin-left: 8px;
              @include ellipsis;
            }
          }
        }
      }
      .expand-content {
        display: flex;
        width: 100%;
        .expand-table {
          width: 100%;
          .expand-table-header {
            display: flex;
            flex-direction: row;
            background-color: var(--bg-color-1);
            .expand-table-header-item {
              padding: 12px 8px 12px 10px;
              position: relative;
              text-align: left;
            }
          }
          .expand-table-content {
            .expand-table-tr {
              display: flex;
              border-bottom: solid 1px var(--neutral1);
              .expand-table-tr-th {
                padding: 0 10px;
                height: 48px;
                line-height: 48px;
                background-color: var(--bg-color-3);
              }
              .expand-table-tr-overflow {
                @include ellipsis;
              }
            }
          }
        }
      }
    }
    .table-tr:hover {
      background-color: var(--neutral0);
    }
  }
  .pagination-wrapper {
    margin-top: 16px;
  }
}
</style>
