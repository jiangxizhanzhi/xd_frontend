<template>
  <cb-dialog
    class="report-dialog"
    :title="$t('m.experimentalReport')"
    :visible.sync="dialogReport"
    :before-close="beforeClose"
    :close-on-press-escape="false"
  >
    <!-- passed为true表示通过，passed为false表示未通过，passed未null表示未评分 -->
    <div class="my-pass-notes" v-if="passed" style="overflow: auto">
      <div class="my-notes-title">
        <div class="my-notes-comment ft16">
          <span class="color1">{{ $t('course.comment') }}：</span>
          <span class="color2">{{ comment }}</span>
        </div>
        <div class="my-notes-score">
          <span class="score color1">{{ score }}{{ $t('course.score') }}</span
          ><span class="passStatus color17 bg171 ft14">{{
            $t('course.passed')
          }}</span>
        </div>
      </div>
      <div class="my-notes cyber-scroll-bar markDownCommon bg26">
        <CbMarkdown v-model="lessonReport" type="viewer"></CbMarkdown>
      </div>
    </div>
    <experiment-markdown
      v-if="!passed"
      ref="noteCommon"
      :disabledDrafts="disabledDrafts"
      :mark-notes.sync="lessonReport"
      @submitNote="detailSubmitNote"
      @submitDrafts="submitDrafts"
      :businessType="BUSINESS_TYPE.OJ_WEB_COURSE"
      :comment="comment"
      :score="score"
      :scored="passed === false ? true : false"
    ></experiment-markdown>
  </cb-dialog>
</template>

<script>
import ExperimentMarkdown from './experiment-markdown';
import {
  NOTE_TYPE,
  RESOURCE_TYPE,
  BUSINESS_TYPE,
} from '@/pages/web/course/constant.js';
export default {
  name: 'Report',
  components: {
    ExperimentMarkdown,
  },
  data() {
    return {
      BUSINESS_TYPE,
      dialogReport: false,
      lessonReport: '',
      passed: null,
      comment: '',
      score: null,
      disabledDrafts: false,
    };
  },
  computed: {},
  watch: {
    // passed: {
    //   handler(val, oldval) {
    //     if (val === false) {
    //       const that = this;
    //       that.$nextTick(() => {
    //         that.$refs.noteCommon.$children[0].$refs.cbMarkdownRef.__vue__.$children[0].editor.$$.ctx[7].getSelection();
    //         that.$refs.noteCommon.$children[0].$refs.cbMarkdownRef.__vue__.$children[0].editor.$$.ctx[7].focus();
    //       });
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
  methods: {
    beforeClose() {
      const that = this;
      if (!that.passed) {
        // 获取光标位置
        const pos =
          that.$refs.noteCommon.$children[0].$refs.cbMarkdownRef.__vue__.$children[0].editor.$$.ctx[7].getCursor();
        // 设置选中文本
        if (pos.sticky === 'after') {
          that.$refs.noteCommon.$children[0].$refs.cbMarkdownRef.__vue__.$children[0].editor.$$.ctx[7].setSelection(
            pos,
            { line: pos.line },
          );
        }
        if (pos.sticky === 'before') {
          that.$refs.noteCommon.$children[0].$refs.cbMarkdownRef.__vue__.$children[0].editor.$$.ctx[7].setSelection(
            pos,
            { line: pos.line - 1 },
          );
        }
        // 获取选中文本
        const text =
          that.$refs.noteCommon.$children[0].$refs.cbMarkdownRef.__vue__.$children[0].editor.$$.ctx[7].getSelection();
        // that.$refs.noteCommon.$children[0].$refs.cbMarkdownRef.__vue__.$children[0].editor.$$.ctx[7].focus();
        that.$emit('pos', pos, text);
        that
          .$confirm(
            that.disabledDrafts
              ? that.$t('course.whetherSubmit')
              : that.$t('course.whetherSaveDraft') + '?',
            that.$t('common.info'),
            {
              confirmButtonText: that.$t('common.confirm'),
              cancelButtonText: that.$t('common.cancel'),
              type: 'warning',
            },
          )
          .then(async () => {
            if (!that.passed) {
              await that.submitCommon(
                that.$refs.noteCommon.markNotes,
                Math.random(),
              );
            }
            that.$emit('before-close', 'report');
            that.dialogReport = false;
          })
          .catch(() => {
            that.$emit('before-close', 'report');
            that.dialogReport = false;
          });
      } else {
        that.dialogReport = false;
      }
    },
    // 获取实验报告
    getLessonReport() {
      this.$request
        .get(
          '/oj/note',
          {
            resource_id: this.$route.params && this.$route.params.lesson_id,
            note_type: NOTE_TYPE.REPORT,
            resource_type: RESOURCE_TYPE.LESSON,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          if (res.data.data != null) {
            this.lessonReport = res.data.data.content || '';
            this.passed = res.data.data.passed;
            this.comment = res.data.data.evaluate_comment || '';
            this.score = res.data.data.score;
            // 判断存草稿是否可用
            this.disabledDrafts = _.get(res, 'data.data.is_submit', false);
            this.reportId = _.get(res, 'data.data.resource_id', '');
          }
        });
    },
    // 存草稿
    submitDrafts(val) {
      this.detailSubmitNoteCom(val, 'draft');
    },

    // 提交实验报告
    detailSubmitNote(val) {
      this.detailSubmitNoteCom(val, 'submit');
    },
    detailSubmitNoteCom(val, type) {
      this.$request
        .post(
          '/oj/note/report',
          {
            content: val,
            business_id: this.$route.params && this.$route.params.lesson_id,
            operate: type === 'submit' ? true : false,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message.success(this.$t('m.saveSuccessful'));
          this.getLessonReport();
        });
    },
    submitCommon(val, random) {
      this.$request
        .post(
          '/oj/note/report',
          {
            content: val,
            business_id: this.$route.params && this.$route.params.lesson_id,
            operate: this.disabledDrafts ? true : false,
            random,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {});
    },
  },
};
</script>

<style scoped lang="scss">
.my-pass-notes {
  padding: 15px 10px 0 25px;
  height: 500px;
  .my-notes-title {
    margin-bottom: 15px;
  }
  .my-notes-comment {
    width: calc(100% - 180px);
  }
  .my-notes-score {
    .passStatus {
      height: 32px;
      line-height: 32px;
      border-radius: 2px;
      padding: 0 12px;
      margin-left: 13px;
      color: var(--green-color);
      background: var(--green-color-2);
    }
    .score {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      font-family: Arial;
      font-weight: 400;
      color: var(--primary-color);
    }
  }
}
.my-pass-notes .my-notes-title,
.my-pass-notes .my-notes-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.report-dialog {
  ::v-deep {
    .el-dialog {
      width: 940px;
      height: 65%;
      min-height: 632px;
      margin-right: 0;
    }
  }
}
</style>
