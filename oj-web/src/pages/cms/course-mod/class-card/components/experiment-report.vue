<template>
  <div class="class-learn-content">
    <cb-search-table
      ref="sdlRefb"
      :url="tableurl()"
      :cols="columns"
      row-key="user"
      :data="query"
      baseURL="/api/ojj"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <cb-search-input
          v-model="query.pattern"
          :placeholder="$t('user.pleaseInputSelectName')"
        ></cb-search-input>
        <cb-button
          class="export-button"
          button-type="export"
          hollow
          @click="exportReport()"
        >
          {{ $t('m.allExport') }}
        </cb-button>
      </template>
      <template v-slot:content="scope">
        <cb-button
          @click="edit(scope.data)"
          type="text"
          v-if="scope.data.content"
          >{{ $t('m.viewReport') }}</cb-button
        >
        <div class="nullSubmit" v-if="!scope.data.content">
          {{ $t('m.unsubmitted') }}
        </div>
      </template>
    </cb-search-table>
    <cb-dialog
      :title="$t('m.experimentReport')"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <cb-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
      >
        <cb-form-item :label="$t('m.experimentReport')">
          <mavon-read
            :mavonData="mavonContent"
            :autofocus="false"
            :editable="false"
            :toolbars-flag="true"
            :subfield="false"
            default-open="preview"
          ></mavon-read>
        </cb-form-item>
        <cb-form-item :label="$t('m.reportScore')" prop="score">
          <cb-input-number
            class="number-input-training"
            v-model="ruleForm.score"
            :min="0"
            :max="100"
            controls-position="right"
            size="small"
          ></cb-input-number>
        </cb-form-item>
        <cb-form-item :label="$t('m.whetherToPass')" prop="passed">
          <cb-switch
            v-model="ruleForm.passed"
            active-color="#52c41a"
          ></cb-switch>
        </cb-form-item>
        <cb-form-item :label="$t('m.reportReviews')" prop="evaluate_comment">
          <cb-input
            type="textarea"
            v-model="ruleForm.evaluate_comment"
          ></cb-input>
        </cb-form-item>
        <cb-form-item class="btn" label="">
          <div class="btn-groups">
            <cb-button mr="mr" @click="addSubmit('ruleForm')">{{
              $t('m.submit')
            }}</cb-button>
            <cb-button button-type="cancel" @click="onCnacle">{{
              $t('m.cancel')
            }}</cb-button>
          </div>
        </cb-form-item>
      </cb-form>
    </cb-dialog>
  </div>
</template>
<script>
import MavonRead from '@/components/markdown/mavon-read.vue';
import { exportExperimentReport } from '@/api/class-schedule';
import { validateSkillTitleLength } from '@/utils/rules.js';
export default {
  components: {
    MavonRead,
  },
  data() {
    return {
      mavonContent: '',
      ruleForm: {
        note_id: '',
        score: 0,
        passed: false,
        evaluate_comment: '',
      },
      rules: {
        score: [
          {
            required: true,
            message: this.$t('m.enterScore'),
            trigger: 'blur',
          },
        ],
        evaluate_comment: [
          {
            required: true,
            message: this.$t('m.enterComment'),
            trigger: 'blur',
          },
          { validator: validateSkillTitleLength, trigger: ['blur', 'change'] },
        ],
      },
      dialogVisible: false,
      query: {
        pattern: '',
        classroomId: this.$route.params.lessonId,
      },
    };
  },
  computed: {},
  created() {
    this.columns = [
      {
        label: this.$t('m.name') + '(' + this.$t('user.username') + ')',
        sorter: 'userName',
        getData(row) {
          const { name = null, user_name = null } = row;
          return `${name}(${user_name})`;
        },
      },
      {
        label: this.$t('m.unit'),
        prop: 'organization_name',
        sorter: 'organizationName',
      },
      {
        label: this.$t('m.experimentReport'),
        slot: 'content',
        prop: 'content',
        minWidth: 120,
      },
      {
        label: this.$t('m.experimentalScore'),
        prop: 'score',
        sorter: 'score',
        minWidth: 140,
      },
      {
        label: this.$t('m.gradeTeacher'),
        prop: 'evaluator_name',
        sorter: 'evaluatorName',
        minWidth: 115,
      },
      {
        label: this.$t('m.reportUpdateTime'),
        prop: 'submit_time',
        sorter: 'submitTime',
        minWidth: 145,
      },
      {
        label: this.$t('m.scoringTime'),
        prop: 'evaluate_time',
        sorter: 'evaluateTime',
        minWidth: 105,
      },
    ];
  },
  mounted() {},
  methods: {
    // 导出报告
    exportReport() {
      const params = {
        classroom_id: this.$route.params.lessonId,
      };
      exportExperimentReport(params).then(() => {});
    },
    edit(data) {
      this.dialogVisible = true;
      this.mavonContent = data.content;
      this.ruleForm = {
        note_id: data.note_id,
        score: data.score,
        passed: data.passed,
        evaluate_comment: data.evaluate_comment,
      };
    },
    tableurl() {
      // return `/admin/course/course_schedules/${this.$route.params.lessonId}/get_classroom_report/`;
      return `/oj/admin/course/classroom/classroom_report`;
    },
    refresh() {
      this.$refs.sdlRefb.reload();
    },
    monitor() {
      this.$router.push({ name: 'learn-monitor' });
    },
    addSubmit(formName) {
      const that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request
            .patch('/oj/admin/note/evaluate', this.ruleForm, {
              baseURL: '/api/ojj',
            })
            .then((res) => {
              that.dialogVisible = false;
              this.refresh();
            });
        } else {
          return false;
        }
      });
    },
    onCnacle() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .v-note-wrapper {
  background-color: transparent !important;
  .v-note-op {
    background-color: transparent !important;
  }
}
::v-deep .el-input--small .el-input__inner {
  height: 36px;
  line-height: 36px;
}
.btn-groups {
  display: flex;
  justify-content: center;
}
</style>
<style scoped lang="scss">
.class-learn-content {
  .search-wrapper-box {
    width: 200px;
    display: inline-block;
    margin-bottom: 20px;
  }
  ::v-deep .cb-search__search {
    position: relative;
  }
  .export-button {
    position: absolute;
    right: 0px;
    margin-right: 0px;
  }
}
</style>
