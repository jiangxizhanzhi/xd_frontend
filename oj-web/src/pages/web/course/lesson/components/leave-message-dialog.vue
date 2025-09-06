<template>
  <cb-dialog
    class="message-dialog"
    :title="$t('m.message')"
    :visible.sync="dialogMessage"
    :before-close="beforeClose"
  >
    <cb-scrollbar>
      <leave-message
        :comment-type="commentTypeDialog"
        :comments="comments"
        @sendComment="sendComment"
        @subLike="sendLike"
      ></leave-message>
    </cb-scrollbar>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import LeaveMessage from '@/components/leave-message/index';
export default {
  components: {
    LeaveMessage,
  },
  props: {
    commentTypeDialog: {
      type: Number,
      default: null,
    },
    coureName: {
      type: String,
      default: '',
    },
    lessonName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogMessage: false,
      comments: [],
      isShowDialog: false,
      dialogContent: '',
      dialogType: '',
    };
  },
  methods: {
    beforeClose() {
      this.$emit('before-close', 'message');
      this.dialogMessage = false;
    },
    // 章节获取留言()
    getLeaveMessage() {
      this.$request
        .get(
          '/oj/comment/list',
          {
            business_id: this.$route.params && this.$route.params.lesson_id,
            business_type: 2,
            per_page: 1000,
            page: 1,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.comments = res.data.data.list;
          _.forEach(this.comments, (item) => {
            this.$set(item, 'inputShow', false);
            if (item.comment_reply) {
              _.forEach(item.comment_reply, (second) => {
                this.$set(second, 'inputShow', false);
              });
            }
          });
        });
    },
    sendComment(params) {
      const lessonId = this.$route.params && this.$route.params.lesson_id;
      this.$request
        .post(
          '/oj/comment/',
          {
            business_id: lessonId,
            business_type: this.commentTypeDialog,
            theme_name: this.coureName + '/' + this.lessonName,
            ...params,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getLeaveMessage();
        });
    },
    sendLike(val, isLike) {
      this.$request
        .post(
          '/oj/comment/is_like',
          {
            resource_id: val,
            is_like: !isLike,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getLeaveMessage();
        });
    },
  },
};
</script>

<style scoped lang="scss">
.message-dialog {
  ::v-deep .el-dialog {
    width: 940px;
    height: 65%;
    min-height: 612px;
    margin-right: 0;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
    height: calc(100% - 70px);
    .cb-dialog-body {
      height: 100%;
    }
  }
  .el-scrollbar {
    height: 100%;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-scrollbar__view {
      width: 100%;
    }
  }
  ::v-deep .leave-message-wrapper {
    padding: 25px;
  }
}
</style>
