<template>
  <cb-dialog
    class="note-dialog"
    :title="$t('m.myNotes')"
    :visible.sync="dialogNotes"
    :before-close="beforeClose"
    :close-on-press-escape="false"
  >
    <my-notes
      ref="noteCommon"
      :mark-notes.sync="lessonNotes"
      :businessType="BUSINESS_TYPE.OJ_WEB_COURSE"
      @submitNote="detailSubmitNote"
      :restType="2"
      :fileSize="1024 * 1024 * 1024"
    ></my-notes>
  </cb-dialog>
</template>

<script>
import MyNotes from '@/components/notes/my-notes';
import {
  NOTE_TYPE,
  RESOURCE_TYPE,
  BUSINESS_TYPE,
} from '@/pages/web/course/constant.js';
export default {
  components: {
    MyNotes,
  },
  data() {
    return {
      BUSINESS_TYPE,
      dialogNotes: false,
      lessonNotes: '',
    };
  },
  computed: {},
  methods: {
    beforeClose() {
      this.$confirm(this.$t('common.isSave') + '?', this.$t('common.info'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning',
      })
        .then(() => {
          this.submitCommon(this.$refs.noteCommon.markNotes, Math.random());
          this.$emit('before-close', 'notes');
          this.dialogNotes = false;
        })
        .catch(() => {
          this.$emit('before-close', 'notes');
          this.dialogNotes = false;
        });
    },
    // 获取章节笔记
    getLessonNotes() {
      this.$request
        .get(
          '/oj/note',
          {
            resource_id: this.$route.params && this.$route.params.lesson_id,
            note_type: NOTE_TYPE.NOTE,
            resource_type: RESOURCE_TYPE.LESSON,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.lessonNotes = res.data.data == null ? '' : res.data.data.content;
        });
    },
    // 提交笔记
    detailSubmitNote(val) {
      this.$request
        .post(
          '/oj/note',
          {
            business_id: this.$route.params && this.$route.params.lesson_id,
            note_type: NOTE_TYPE.NOTE,
            business_type: RESOURCE_TYPE.LESSON,
            content: val,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message.success(this.$t('m.saveSuccessful'));
        });
    },
    submitCommon(val, random) {
      this.$request
        .post(
          '/oj/note',
          {
            business_id: this.$route.params && this.$route.params.lesson_id,
            note_type: NOTE_TYPE.NOTE,
            business_type: RESOURCE_TYPE.LESSON,
            content: val,
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
.note-dialog {
  ::v-deep .el-dialog {
    width: 940px;
    height: 65%;
    min-height: 612px;
    margin-right: 0;
  }
}
</style>
