<template>
  <div class="knowledge-table">
    <cb-scrollbar>
      <cb-search-table
        :cols="columns"
        rowKey="resource_id"
        :url="tableDataUrl"
        baseURL="/api/ojj"
        :background="true"
        :searchBarBg="false"
      >
        <template v-slot:task="scope">
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
                v-for="(item, index) in scope.data.missions"
                :key="index"
              >
                <div
                  class="course-name one-overflow"
                  :title="`${item.title}/${item.scene_name}`"
                >
                  {{ item.title }}/{{ item.scene_name }}
                </div>
                <div class="course-progress">
                  <span
                    v-if="item.status === SKILL_COMPLETE_STATUS.completed"
                    class="completed"
                  >
                    {{ $t('personal.completed') }}
                  </span>
                  <span v-else class="unfinished">
                    {{ $t('personal.unfinished') }}
                  </span>
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
import { SKILL_COMPLETE_STATUS } from '../../constant.ts';
export default {
  data() {
    return {
      SKILL_COMPLETE_STATUS,
      tableDataUrl: '/rtks/training-plan/role_evaluation/skill_list',
      columns: [
        {
          label: this.$t('personal.num'),
          prop: 'resource_id',
        },
        {
          label: this.$t('personal.skillCompleteness'),
          getData(row) {
            return row.process + '%';
          },
        },
        {
          label: this.$t('personal.content'),
          prop: 'content',
        },
        {
          label: this.$t('personal.trainTask'),
          slot: 'task',
          width: '300px',
        },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.knowledge-table {
  height: 800px;
  .operate-content {
    display: flex;
    justify-content: space-between;
    .course-name {
      width: 64%;
    }
    .course-progress {
      width: 35%;
    }
  }
  .completed {
    color: var(--green-color);
  }
  .unfinished {
    color: var(--neutral8);
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
