<template>
  <cb-inner-page>
    <cb-search-table
      :cols="cols"
      :dataSource="scoreInfo"
      :hidePaginOnDemand="true"
      :searchBarBg="false"
    >
      <template v-slot:missionCompleted="scope">
        <span>{{ scope.data.finish_task_count }}</span>
        /
        {{ scope.data.all_task_count }}
      </template>
      <template v-slot:trainRecord="scope">
        <cb-button
          type="text"
          icon="icon-chakan"
          @click="viewRecord(scope.data)"
          >{{ $t('m.check') }}</cb-button
        >
      </template>
    </cb-search-table>
    <cb-dialog
      :visible.sync="showRecordDialog"
      width="66%"
      class="task-answer-dialog"
      :append-to-body="true"
      center
    >
      <div slot="title" class="header-title">
        <span class="title-name">{{ $t('m.trainRecord') }}</span>
      </div>
      <training-record
        ref="trainRecord"
        :task-lists="taskLists"
        style="height: 500px"
      />
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import TrainingRecord from './training-record.vue';
export default {
  components: {
    TrainingRecord,
  },
  props: {
    scoreInfo: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      showRecordDialog: false,
      taskLists: [],
      cols: [
        {
          label: this.$t('m.ranking'),
          prop: 'index',
        },
        {
          label: this.$t('m.member'),
          prop: 'name',
        },
        {
          label: this.$t('m.role'),
          prop: 'role_name',
        },
        {
          label: this.$t('m.taskComplete'),
          prop: 'mission_completed',
          slot: 'missionCompleted',
        },
        {
          label: this.$t('m.subjectiveQuestionScore'),
          prop: 'subjective_score',
        },
        {
          label: this.$t('m.objectiveQuestionScore'),
          prop: 'objective_score',
        },
        {
          label: this.$t('m.abilityScore'),
          prop: 'ability_score',
        },
        {
          label: this.$t('m.comprehensiveScore'),
          prop: 'synthesis_score',
        },

        {
          label: this.$t('m.trainRecord'),
          prop: 'trainRecord',
          slot: 'trainRecord',
        },
      ],
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    viewRecord(row) {
      this.showRecordDialog = true;
      // 查看训练记录
      this.$request
        .get(
          '/cr/training_team/training_team/get_training_record',
          {
            resource_id: this.$route.params.resource_id,
            user_hash: row.user_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )

        // 查看训练记录
        .then((res) => {
          _.forEach(res.data.data, (item) => {
            this.$set(item, 'level', 1);
            this.$set(item, 'name', item.stage);
            this.$set(item, 'children', item.missions);
            _.forEach(item.children, (list) => {
              this.$set(list, 'name', list.title);
              this.$set(list, 'level', 2);
              this.$set(list, 'state', 1);
            });
          });
          this.taskLists = res.data.data;
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
