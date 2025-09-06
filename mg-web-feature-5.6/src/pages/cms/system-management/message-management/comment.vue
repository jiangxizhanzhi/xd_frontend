<template>
  <cb-dialog
    width="70%"
    height="400px"
    :visible.sync="visible"
    :append-to-body="true"
    class="comment-dialog"
    @close="handleCancel"
  >
    <template slot="title">
      <div>{{ $t('systemManagement.message.comment') }}</div>
    </template>
    <div class="content" id="comment-dialog-content">
      <div class="message">
        <CbMarkdown v-model="commentValue" type="viewer" />
      </div>
      <div class="info">
        <div class="class-name">{{ comment && comment.theme_name }}</div>
        <div class="user">
          {{ comment && comment.user_name }}
          {{ comment && comment.create_time }}
        </div>
        <div class="count">
          <span
            >{{ $t('systemManagement.message.like') }}：{{
              comment && comment.likes_count
            }}</span
          >
          <span v-if="comment && comment.reply_count != null"
            >{{ $t('systemManagement.message.comment') }}：{{
              comment && comment.reply_count
            }}</span
          >
        </div>
      </div>
      <div class="comment-cotent" id="comment-cotent">
        <cb-form
          :model="formData"
          :rules="rules"
          :url="formUrl"
          :baseURL="baseURL"
          :content-type="contentType"
          ref="formRef"
          class="comment-form"
        >
          <cb-form-item prop="content">
            <cy-textarea
              :rows="5"
              :placeholder="$t('systemManagement.message.replyLength')"
              :length="250"
              v-model="formData.content"
              @change="handleChange"
            />
          </cb-form-item>
        </cb-form>
      </div>
    </div>
    <template slot="footer">
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button @click="submitComment()">{{
            $t('systemManagement.userManage.save')
          }}</cb-button>
          <cb-button hollow @click="handleCancel">{{
            $t('systemManagement.userManage.cancel')
          }}</cb-button>
        </cb-button-group>
      </div>
    </template>
  </cb-dialog>
</template>

<script>
import { reactive, ref, toRefs, watch } from '@vue/composition-api';
import Utils from '@/utils/utils';
import { getI18N } from '@cyber/helper';
export default {
  props: {
    commentType: {
      type: String,
      default: 'first',
    },
    visibleComment: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  setup(props, { emit, root }) {
    let formRef = ref(null);
    const i18n = getI18N();
    const state = reactive({
      commentValue: '',
      baseURL: '/api/ojj',
      formUrl: '/oj/admin/comment',
      contentType: 'application/json',
      visible: props.visibleComment,
      formData: {
        business_id: props.comment.business_id,
        business_type: props.comment.business_type,
        theme_name: props.comment.theme_name,
        root_id:
          props.commentType === 'first'
            ? props.comment.resource_id
            : props.comment.root_id,
        reply_id:
          props.commentType === 'second' ? props.comment.resource_id : null,
        content: '',
      },
      rules: {
        content: [
          {
            validator: Utils.checkReplyComment,
            trigger: ['blur', 'change'],
          },
        ],
      },
    });
    const refData = toRefs(state);
    const submitComment = () => {
      formRef.value.validate((valid) => {
        const formData = {
          ...refData.formData.value,
        };
        if (valid) {
          formRef.value.submit(formData).then(() => {
            formRef.value.resetFields();
            refData.formData.value.content = '';
            root.$message.success(
              i18n.t('systemManagement.message.replySuccess'),
            );
            emit('update');
          });
        }
      });
    };
    const handleCancel = () => {
      emit('cancel');
    };
    const handleChange = (value) => {
      refData.formData.value.content = value;
    };
    watch(
      props.comment,
      (nv, ov) => {
        if (nv) {
          refData.commentValue.value = nv.content;
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );

    return {
      ...refData,
      formRef,
      submitComment,
      handleCancel,
      handleChange,
    };
  },
};
</script>

<style lang="scss" scoped>
#comment-dialog-content {
  .info {
    display: flex;
    justify-content: space-between;
    color: var(--neutral8);
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
#comment-dialog-content {
  .cb-markdown .markdown-body {
    padding: 16px 0 !important;
  }
}
#comment-cotent {
  .el-form {
    padding-right: 0 !important;
  }
}
</style>
