<template>
  <div class="leave-message-wrapper oj-web-leave-message">
    <div class="main-message">
      <cb-form :model="formData" :rules="rule" ref="formData">
        <cb-form-item prop="replyComment">
          <cy-textarea
            v-model="formData.replyComment"
            :length="250"
            @change="change"
            :placeholder="$t('m.exercise.replyLength')"
            :rows="5"
          ></cy-textarea>
        </cb-form-item>
      </cb-form>
      <div class="sub-bt flex-end">
        <!-- 留言 -->
        <cb-button
          class="reply cursor flex-center"
          @click="sendComment('formData')"
          icon="icon-pinglun"
        >
          {{ $t('m.exercise.comment') }}</cb-button
        >
      </div>
    </div>
    <div class="reply-father" v-for="(item, i) in comments" :key="i">
      <div class="line"></div>
      <div class="author-title">
        <cb-avatar
          class="left"
          :size="40"
          :src="item.avatar || defaultLogo"
        ></cb-avatar>
        <div class="right">
          <div class="author-info-title">
            <span class="author-name"
              ><span>{{ item.user_name }}</span></span
            ><span class="author-comment">{{ item.content }}</span>
          </div>
          <div class="author-info flex-between">
            <span class="author-time">{{ item.create_time }}</span>
            <div class="icon-btn">
              <span @click="showInput(i)" class="cursor">
                <cb-iconfont type="icon-comment" themedColor="--neutral8" />
              </span>
              <span @click="sendLike(i, undefined, item)" class="cursor">
                <cb-iconfont
                  :type="item.is_like ? 'icon-yizan' : 'icon-dianzan'"
                  themedColor="--neutral8"
                />
                <span class="ft14">{{ item.likes_count }}</span>
              </span>
            </div>
          </div>
          <div class="my-reply my-comment-reply" v-show="item.inputShow">
            <div class="reply-info">
              <cb-form
                :model="makeData[i].formModel"
                :rules="rule"
                :ref="makeData[i].formRef"
              >
                <cb-form-item prop="replyComment">
                  <cy-textarea
                    v-model="makeData[i].formModel.replyComment"
                    :length="250"
                    @change="replayChange(arguments, i)"
                    :placeholder="$t('m.exercise.replyLength')"
                    :rows="5"
                  ></cy-textarea>
                </cb-form-item>
              </cb-form>
              <div class="sub-bt flex-end">
                <!-- 回复 -->
                <cb-button
                  class="reply cursor flex-center"
                  @click="sendReply(i, item)"
                  icon="icon-pinglun"
                >
                  {{ $t('m.exercise.reply') }}</cb-button
                >
                <!-- 取消 -->
                <cb-button
                  class="reply cursor flex-center"
                  @click="sendCancel(i)"
                  icon="icon-cuowu1"
                >
                  {{ $t('m.cancel') }}</cb-button
                >
              </div>
            </div>
          </div>
          <div
            class="reply-box"
            v-show="item && item.comment_reply && item.comment_reply.length > 0"
          >
            <div
              class="author-title"
              v-for="(reply, j) in item.comment_reply"
              :key="j"
            >
              <cb-avatar
                class="left"
                :size="40"
                :src="reply.avatar || defaultLogo"
              ></cb-avatar>
              <div class="right">
                <div class="author-info-title">
                  <span class="author-name"
                    ><span class="author-from">{{ reply.user_name }}</span>
                    <div class="author-reply">{{ $t('m.exercise.reply') }}</div>
                    <span class="author-to">{{
                      reply.reply_username
                    }}</span></span
                  ><span class="author-comment">{{ reply.content }}</span>
                </div>
                <div class="author-info flex-between">
                  <span class="author-time">{{ reply.create_time }}</span>
                  <div class="icon-btn">
                    <span @click="showInput(i, j)" class="cursor">
                      <cb-iconfont
                        type="icon-comment"
                        themedColor="--neutral8"
                      />
                    </span>
                    <span @click="sendLike(i, j, reply)" class="cursor">
                      <cb-iconfont
                        :type="reply.is_like ? 'icon-yizan' : 'icon-dianzan'"
                        themedColor="--neutral8"
                      />
                      <span class="ft14 message-zan-span">{{
                        reply.likes_count
                      }}</span>
                    </span>
                  </div>
                </div>
                <div class="my-reply my-comment-reply" v-show="reply.inputShow">
                  <div class="reply-info">
                    <cb-form
                      :model="makeData[i].againReply[j].formModel"
                      :rules="rule"
                      :ref="makeData[i].againReply[j].formRef"
                    >
                      <cb-form-item prop="replyComment">
                        <cy-textarea
                          v-model="
                            makeData[i].againReply[j].formModel.replyComment
                          "
                          :length="250"
                          @change="againReplyChange(arguments, i, j)"
                          :placeholder="$t('m.exercise.replyLength')"
                          :rows="5"
                        ></cy-textarea>
                      </cb-form-item>
                    </cb-form>
                    <div class="sub-bt flex-end">
                      <cb-button
                        @click="sendAgainReply(i, j, reply, item)"
                        mr="mr"
                        ><span>{{ $t('m.exercise.reply') }}</span></cb-button
                      >
                      <cb-button @click="sendCancel(i, j)" buttonType="cancel"
                        ><span>{{ $t('m.cancel') }}</span></cb-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Default from '../../assets/img/userhead.png';
import _ from 'lodash';
import Validate from '@/utils/validate.js';
export default {
  name: 'ArticleComment',
  components: {},
  props: {
    comments: {
      type: Array,
      default: () => [],
    },
    commentType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      // total: 250,
      formData: {
        replyComment: '',
      },
      rule: {
        replyComment: [
          {
            validator: Validate.checkReplyComment,
            trigger: ['blur', 'change'],
          },
        ],
      },
      defaultLogo: Default,
      index: '0',
      replyComment: '',
      makeData: [],
    };
  },
  watch: {
    comments: {
      handler(val, oldval) {
        this.makeData = []; // 评论表单数据
        const that = this;
        _.times(that.comments.length, (item) => {
          const againReply = [];
          _.times(that.comments[item].comment_reply.length, (index) => {
            againReply.push({
              formRef: `formAgainReply${item}_${index}`,
              formModel: { replyComment: '' },
            });
          });
          that.makeData.push({
            formRef: `formReply${item}`,
            formModel: { replyComment: '' },
            againReply,
          });
        });
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  methods: {
    change(val) {
      this.formData.replyComment = val;
    },
    replayChange(val, i) {
      this.makeData[i].formModel.replyComment = val[0];
    },
    againReplyChange(val, i, j) {
      this.makeData[i].againReply[j].formModel.replyComment = val[0];
    },
    sendComment(formName, val) {
      // 主留言
      const that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            content: that.formData.replyComment,
          };
          that.$refs[formName].resetFields();
          this.formData.replyComment = '';
          that.$emit('sendComment', params);
        } else {
          return false;
        }
      });
    },
    sendReply(i, item) {
      // 对主留言的一级评论
      const that = this;
      const formName = this.makeData[i].formRef;
      that.$refs[formName][0].validate((valid) => {
        if (valid) {
          const params = {
            content: this.makeData[i].formModel.replyComment,
            root_id: item.resource_id,
          };
          that.$refs[formName][0].resetFields();
          that.$emit('sendComment', params);
          this.showInput(i);
        } else {
          return false;
        }
      });
    },
    sendAgainReply(i, j, reply, item) {
      // 对评论的评论
      const that = this;
      const formName = this.makeData[i].againReply[j].formRef;
      that.$refs[formName][0].validate((valid) => {
        if (valid) {
          const params = {
            content: this.makeData[i].againReply[j].formModel.replyComment,
            root_id: item.resource_id,
            reply_id: reply.resource_id,
          };
          this.$emit('sendComment', params);
          this.showInput(i, j);
          that.$refs[formName][0].resetFields();
        } else {
          return false;
        }
      });
    },
    showInput(i, j) {
      if (j !== undefined && j !== null) {
        this.$refs[this.makeData[i].againReply[j].formRef][0].resetFields();
        this.comments[i].comment_reply[j].inputShow =
          !this.comments[i].comment_reply[j].inputShow;
      } else {
        this.$refs[this.makeData[i].formRef][0].resetFields();
        this.comments[i].inputShow = !this.comments[i].inputShow;
      }
    },
    sendLike(i, j) {
      let id = null;
      let isLisk = null;
      if (j !== undefined && j !== null) {
        id = this.comments[i].comment_reply[j].resource_id;
        isLisk = this.comments[i].comment_reply[j].is_like;
      } else {
        id = this.comments[i].resource_id;
        isLisk = this.comments[i].is_like;
      }
      this.$emit('subLike', id, isLisk);
    },
    sendCancel(i, j) {
      this.showInput(i, j);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-form {
    padding-right: 0 !important;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form--inline {
    .el-form-item {
      width: 100%;
    }
  }
  .el-form-item__content {
    padding-right: 20px;
    width: 100%;
    .el-form-item__error {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
  }
  .el-textarea {
    .el-textarea__inner {
      height: 160px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
  }
}
.reply-info {
  margin: 8px 0 0px;
  ::v-deep {
    .el-textarea {
      .el-textarea__inner {
        height: 80px;
      }
    }
  }
}

.leave-message-wrapper {
  .sub-bt {
    margin-top: 10px;
    .cb-button {
      margin-right: 18px;
    }
  }
  .reply-father {
    margin-right: 20px;
    margin-bottom: 15px;
    .reply-box {
      .author-title {
        margin: 0px;
        margin-bottom: 30px;
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
    .author-title {
      margin-top: 18px;
    }
    .el-avatar {
      & > img {
        width: 42px;
        height: 42px;
      }
    }
    .line {
      height: 1px;
      background: var(--neutral1);
    }
  }
  .reply-box {
    margin-top: 12px;
    padding: 20px 20px 15px;
  }
  .main-message {
    margin-bottom: 20px;
  }
  .author-title {
    display: flex;

    .left {
      margin-right: 9px;
    }

    .right {
      width: calc(100% - 49px);

      .author-info {
        span {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
      }

      .author-info-title {
        margin-bottom: 8px;
        min-height: 20px;

        span {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          word-wrap: break-word;
          word-break: break-all;
        }
      }

      .author-comment {
        display: flex;
      }
      .author-name {
        float: left;
        margin-right: 8px;
      }

      .author-reply {
        display: inline;
        padding: 0 10px;
      }

      .icon-btn i {
        margin-left: 20px;
      }
    }
  }
}
</style>

<style lang="scss">
.author-name span {
  color: var(--primary-color);
}
.author-time {
  color: var(--neutral5);
}
.reply-box {
  background: var(--bg-color-1);
}
.icon-btn i {
  color: var(--neutral8);
}
.message-zan-span {
  color: var(--neutral7);
}
</style>
