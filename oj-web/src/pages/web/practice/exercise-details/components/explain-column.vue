<template>
  <!-- 我的笔记,题解,详情 -->
  <div class="explain">
    <div class="tab-header">
      <cb-tabs v-model="activeName" type="border-card">
        <cb-tab-pane :name="$t('m.exercise.myNotes')">
          <span slot="label">{{ $t('m.exercise.myNotes') }}</span>
          <my-notes
            ref="detailNotes"
            :mark-notes.sync="practiceNotes"
            :businessType="businessType"
            @submitNote="detailSubmitNote"
            :fileSize="1024 * 1024 * 1024"
          ></my-notes>
        </cb-tab-pane>
        <cb-tab-pane :name="$t('m.exercise.problemSolution')">
          <span slot="label">{{ $t('m.exercise.problemSolution') }}</span>
          <div
            class="problemSolution"
            v-if="activeName === $t('m.exercise.problemSolution')"
          >
            <CbMarkdown
              v-if="solvingContent"
              v-model="solvingContent"
              type="viewer"
            ></CbMarkdown>
            <div
              class="empty-div"
              v-if="!solvingContent"
              style="width: 100%; height: 420px"
            >
              <empty></empty>
            </div>
          </div>
        </cb-tab-pane>
        <cb-tab-pane :name="$t('m.exercise.leaveMessage')">
          <span slot="label">{{ $t('m.exercise.leaveMessage') }}</span>
          <leave-message
            class="leave-message"
            v-if="activeName === $t('m.exercise.leaveMessage')"
            :commentType="COMMENTYPE.Practice"
            :comments="comments"
            @sendComment="sendComment"
            @subLike="sendLike"
          ></leave-message>
        </cb-tab-pane>
      </cb-tabs>
    </div>
  </div>
</template>
<script>
import MyNotes from '@/components/notes/my-notes';
import leaveMessage from '@/components/leave-message/index';
import { TYPE, NOTETYPE, RESOURCETYPE, COMMENTYPE } from './../../constant';
import empty from '@/components/empty/index.vue';
import _ from 'lodash';
export default {
  name: '',
  components: { MyNotes, leaveMessage, empty },
  props: {
    questionDatas: {
      type: Object,
      default: () => {},
    },
    type: {
      type: Number,
      default: null,
    },
    resourceId: {
      type: String,
      default: '',
    },
    solvingContent: {
      // 题解
      type: String,
      default: '',
    },
    businessType: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      RESOURCETYPE,
      NOTETYPE,
      TYPE,
      COMMENTYPE,
      activeName: '',
      comments: [], // 评论
      practiceNotes: '', // 我的笔记
    };
  },
  computed: {},
  watch: {
    activeName: {
      handler(val, oldval) {
        if (val === this.$t('m.exercise.leaveMessage')) {
          this.getLeaveMessage();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getNotes();
    if (this.type === TYPE.CaptureFlag) {
      if (Number(this.$route.query.comment_type) === COMMENTYPE.Practice) {
        this.activeName = this.$t('m.exercise.leaveMessage');
      } else {
        this.activeName = this.$t('m.exercise.myNotes');
      }
    }
  },
  methods: {
    getLeaveMessage() {
      // 获取留言()
      this.$request
        .get(
          '/oj/comment/list',
          {
            businessId: this.resourceId,
            businessType: COMMENTYPE.Practice, //资源类型 1=课程 2=课时 3=实操题
            per_page: 1000,
            page: 1,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.comments = data.list;
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
      // TODO 还没对完
      // 评论&留言
      this.$request
        .post(
          '/oj/comment/',
          {
            business_id: this.resourceId,
            business_type: COMMENTYPE.Practice,
            theme_name: this.questionDatas.title,
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
      // 评论点赞
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
    getNotes() {
      // 获取我的笔记
      const that = this;
      this.$request
        .get(
          '/oj/note',
          {
            resource_id: this.resourceId,
            note_type: NOTETYPE.Note,
            resource_type: RESOURCETYPE.Practice,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data');
          that.practiceNotes = (data && data.content) || '';
        });
    },
    detailSubmitNote(val) {
      // 提交笔记
      const that = this;
      this.$request
        .post(
          '/oj/note',
          {
            business_id: that.resourceId,
            note_type: NOTETYPE.Note,
            business_type: RESOURCETYPE.Practice,
            content: val,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          that.$message.success(this.$t('m.tips.submitSuccess'));
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.explain {
  margin-top: 20px;
  .tab-content {
    min-height: 400px;
    border-radius: 0px 2px 2px 2px;
    padding-left: 20px;
    .my-notes {
      padding: 30px;
      .leave-message {
        padding: 30px;
      }
    }
  }
}
</style>
