<template>
  <!--课程学习-->
  <div class="box course">
    <div class="title">
      {{ index }}. {{ $t('intelligence.report.course.title') }}
    </div>
    <div class="sub-box">
      <div class="card table">
        <cb-search-table
          :cols="courseCols"
          :data-source="data.course_list"
          :hidePaginOnDemand="true"
          :searchBarBg="false"
        >
          <template v-slot:status="scope">
            <span
              class="status"
              :style="{
                color: scope.data.finished
                  ? 'var(--green-color)'
                  : 'var(--orange-color)',
              }"
              >{{
                scope.data.finished
                  ? $t('intelligence.report.course.status')[0]
                  : $t('intelligence.report.course.status')[1]
              }}</span
            >
          </template>
        </cb-search-table>
      </div>
      <div class="card chart">
        <course-chart :data="data.study_statistics"></course-chart>
      </div>
      <div class="sub-box">
        <div class="sub-title">
          {{ index }}.1 {{ $t('intelligence.report.course.titleList')[0] }}
        </div>
        <div class="card table">
          <cb-search-table
            :cols="knowledgePointCols"
            :data-source="data.knowledge_points"
            :hidePaginOnDemand="true"
            :searchBarBg="false"
          >
          </cb-search-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CourseChart from './course-chart';

export default {
  name: 'course-card',
  components: {
    CourseChart,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      courseCols: [
        {
          label: this.$t('intelligence.report.course.courseCols')[0],
          prop: 'name',
        },
        {
          label: this.$t('intelligence.report.course.courseCols')[1],
          prop: 'module_name',
          width: 180,
        },
        {
          label: this.$t('intelligence.report.course.courseCols')[2],
          slot: 'status',
        },
        {
          label: this.$t('intelligence.report.course.courseCols')[3],
          prop: 'duration',
          getData: (row) => {
            return row.duration + this.$t('intelligence.report.course.hour');
          },
        },
        {
          label: this.$t('intelligence.report.course.courseCols')[4],
          prop: 'finish_date',
        },
      ],
      knowledgePointCols: [
        {
          label: this.$t('intelligence.report.course.knowledgePointCols')[0],
          prop: 'content',
        },
        {
          label: this.$t('intelligence.report.course.knowledgePointCols')[1],
          prop: 'mastery',
          getData: (data) => {
            return data.mastery + '%';
          },
          width: 150,
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.box {
  font-size: 14px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-color);
  }
  .sub-box {
    margin-bottom: 16px;
    .card {
      margin: 8px 0;
      padding: 8px 16px;
      line-height: 1.8;
      background-color: var(--neutral0);
      &.chart {
        display: flex;
        height: 204px;
        align-items: center;
        justify-content: space-between;
      }
      &.table {
        padding: 0;
      }
    }
  }
}
</style>
