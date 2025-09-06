<template>
  <div class="knowledge-table knowledge-system-list-box">
    <cb-scrollbar>
      <cb-search-table
        :cols="columns"
        rowKey="resource_id"
        :url="tableDataUrl"
        baseURL="/api/ojj"
        :background="true"
        :searchBarBg="false"
      >
        <template v-slot:type="scope">
          <div
            style="
              max-height: 200px;
              min-height: 48px;
              height: 100%;
              width: 100%;
            "
          >
            <cb-scrollbar>
              <div
                class="operate-content"
                v-for="(item, index) in scope.data.course_study_process_bo_list"
                :key="index"
              >
                <div class="course-name one-overflow" :title="item.course_name">
                  {{ item.course_name }}
                </div>
                <div class="course-progress">
                  <cb-progress
                    :percentage="item.process"
                    :color="formatColor(item.process)"
                  />
                </div>
              </div>
            </cb-scrollbar>
          </div>
        </template>
      </cb-search-table>
    </cb-scrollbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableDataUrl: '/rtks/training-plan/getKnowledgeCourseList',
      columns: [
        {
          label: this.$t('personal.num'),
          prop: 'resource_id',
        },
        {
          label: this.$t('personal.mastery'),
          getData(row) {
            return row.process + '%';
          },
        },
        {
          label: this.$t('personal.content'),
          prop: 'content',
        },
        {
          label: this.$t('personal.course'),
          slot: 'type',
          width: '300px',
        },
      ],
    };
  },
  mounted() {},
  methods: {
    formatColor(percentage) {
      return percentage === 100
        ? this.$themed('green-color')
        : this.$themed('orange-color');
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledge-table {
  height: 800px;
  .operate-content {
    display: flex;
    justify-content: space-between;
    .course-name,
    .course-progress {
      width: 50%;
    }
  }
}
</style>
<style lang="scss" scoped>
.knowledge-table {
  .course-name {
    color: var(--primary-color);
  }
}
</style>
<style lang="scss">
.knowledge-system-list-box {
  .cb-progress-line-slot-right {
    margin-left: 8px;
    width: 49px;
    text-align: right;
  }
}
</style>
