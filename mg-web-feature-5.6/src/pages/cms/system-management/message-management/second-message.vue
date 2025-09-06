<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols="cols"
      :selector="selector"
      :selection.sync="selection"
      url="/oj/admin/comment/children_list/"
      :baseURL="baseURL"
      ref="secondMessageListRef"
      :data="query"
      row-key="resource_id"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <cb-button
          hollow
          buttonType="delete"
          @click="deleteSelectMessage(selection, $event)"
          :disabled="selection.length === 0"
        />
      </template>

      <template v-slot:operate="scope">
        <cb-button @click="comment(scope.data)" type="text" mr>
          {{ $t('systemManagement.message.comment') }}
        </cb-button>
      </template>
    </cb-search-table>
    <!-- 评论 -->
    <comment
      :visible-comment="visibleComment"
      :comment="commentContent"
      commentType="second"
      @update="handleUpdate"
      @cancel="handleCancel"
      v-if="visibleComment"
    />
  </cb-inner-page>
</template>

<script>
import { reactive, toRefs, ref } from '@vue/composition-api';
import { getI18N } from '@cyber/helper';
import { deleteMessage } from '@/api/system';

import Comment from './comment.vue';
export default {
  props: {
    mainId: {
      type: String,
      default: '',
    },
  },
  components: { Comment },
  setup(props, { emit }) {
    const i18n = getI18N();
    let secondMessageListRef = ref(null);
    const state = reactive({
      commentContent: null,
      query: {
        resource_id: props.mainId,
      },
      cols: [
        {
          label: i18n.t('systemManagement.message.content'),
          prop: 'content',
        },
        {
          label: i18n.t('systemManagement.message.replyName'),
          getData: (data) => {
            if (data.user_id) {
              return data.user_name + '(' + data.user_id + ')';
            } else {
              return data.user_name;
            }
          },
        },
        {
          label: i18n.t('systemManagement.message.beReplyName'),
          getData: (data) => {
            if (data.reply_user_id) {
              return data.reply_username + '(' + data.reply_user_id + ')';
            } else {
              return data.reply_username;
            }
          },
        },
        {
          label: i18n.t('systemManagement.message.likeCount'),
          prop: 'likes_count',
        },
        {
          label: i18n.t('systemManagement.message.time'),
          prop: 'create_time',
        },

        {
          label: i18n.t('systemManagement.message.operate'),
          slot: 'operate',
        },
      ],
      baseURL: '/api/ojj',

      visibleComment: false,
      selector: {
        maxSelect: 0,
      },
      selection: [],
    });
    const refData = toRefs(state);
    const comment = (data) => {
      refData.commentContent.value = data;
      refData.visibleComment.value = true;
    };
    const handleCancel = () => {
      refData.visibleComment.value = false;
    };
    const handleUpdate = () => {
      refData.visibleComment.value = false;
      secondMessageListRef.value.reload();
      emit('update');
    };
    const deleteSelectMessage = (data, done) => {
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      deleteMessage({ ids })
        .then(() => {
          done(true);
          refData.selection.value = [];
          secondMessageListRef.value.reload();
          emit('update');
        })
        .catch(() => {
          done(false);
        });
    };
    return {
      ...refData,
      secondMessageListRef,
      comment,
      deleteSelectMessage,
      handleCancel,
      handleUpdate,
    };
  },
};
</script>

<style lang="scss" scoped></style>
