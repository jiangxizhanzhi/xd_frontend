<template>
  <cb-inner-page :background="false">
    <div class="lesson-list">
      <div class="td-top">{{ $t('m.course') }}：{{ courseName }}</div>
      <div class="td-list">
        <cb-search-table
          ref="sdlRef"
          :cols="columns"
          url="/oj/admin/statistic/lesson_statistics_list"
          baseURL="/api/ojj"
          :data="query"
          row-key="resource_id"
          :background="true"
          :searchBarBg="false"
        >
          <template v-slot:search>
            <cb-select
              class="mr10"
              v-model="query.type"
              :options="exeType"
              :first="{
                value: '',
                label: $t('m.allType'),
              }"
              clearable
            />
            <cb-search-input
              :placeholder="$t('m.inputName')"
              v-model="query.search"
            />
          </template>
          <template v-slot:difficulty="scope">
            <span v-if="scope.data.difficulty === 0">
              {{ $t('careerSystem.primary') }}
            </span>
            <span v-else-if="scope.data.difficulty === 1">
              {{ $t('careerSystem.middle') }}
            </span>
            <span v-else>
              {{ $t('careerSystem.advanced') }}
            </span>
          </template>
          <template v-slot:type="scope">
            <div v-show="scope.data.type === '0'">
              {{ $t('m.theory') }}
            </div>
            <div v-show="scope.data.type === '1'">
              {{ $t('m.LABS') }}
            </div>
          </template>
          <template v-slot:Opeator="scope">
            <cb-button
              button-type="view"
              type="text"
              @click="viewLesson(scope.data)"
            ></cb-button>
          </template>
        </cb-search-table>
      </div>
    </div>
    <study-details
      ref="viewDetailsDialog"
      :lesson="lessonID"
      :type="lessonType"
    />
  </cb-inner-page>
</template>
<script>
import studyDetails from './components/study-details.vue';
export default {
  components: {
    studyDetails,
  },
  data() {
    return {
      courseId: '',
      query: {
        search: '',
        type: '',
        courseId: this.$route.params.courseId,
      },
      exeType: [
        {
          label: this.$t('m.theory'),
          value: 0,
        },
        {
          label: this.$t('m.LABS'),
          value: 1,
        },
      ],
      columns: [
        {
          title: this.$t('m.courseName'),
          prop: 'name',
        },
        {
          title: this.$t('m.difficulty'),
          slot: 'difficulty',
        },
        {
          title: this.$t('m.type'),
          prop: 'type',
          slot: 'type',
        },
        {
          title: this.$t('m.numberOfLearners'),
          prop: 'heat',
          sorter: 'heat',
        },
        {
          title: this.$t('m.numberOfReportsSubmitted'),
          prop: 'finish_report_count',
          sorter: 'finish_report_count',
        },
        {
          title: this.$t('learningStatistics.numberOfExercisesCompleted'),
          prop: 'practice_count',
          sorter: 'practice_count',
        },
        {
          label: this.$t('m.operation'),
          slot: 'Opeator',
          width: 220,
        },
      ],
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      selector: {
        maxSelect: 0,
      },
      tableSelector: {},
      multipleSelection: [],
      lessonID: '',
      lessonType: 0,
    };
  },
  created() {},
  computed: {
    // url() {
    //   // return `/admin/course/courses/course_lesson_detail/?course=${this.$route.params.courseId}`;
    // },
    courseName() {
      return this.$route.params.courseName;
    },
  },
  methods: {
    viewLesson(row) {
      this.lessonID = row.resource_id;
      // this.lessonType = row.type;
      this.lessonType = parseInt(row.type);
      this.$refs.viewDetailsDialog.visibleValue = true;
    },
  },
};
</script>
<style scoped lang="scss">
.lesson-list {
  .td-top {
    margin-bottom: 20px;
    font-size: 16px;
    color: var(--neutral8);
    text-indent: 8px;
  }
}
</style>
