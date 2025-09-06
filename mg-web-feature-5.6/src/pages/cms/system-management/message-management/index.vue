<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      url="/oj/admin/comment/list/"
      :baseURL="baseURL"
      ref="messageListRef"
      :data="query"
      row-key="resource_id"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button
          hollow
          buttonType="delete"
          @click="deleteSelectMessage(selection, $event)"
          :disabled="selection.length === 0"
        />
      </template>
      <template v-slot:filter>
        <cb-select
          :placeholder="$t('systemManagement.message.plzChangeTheme')"
          v-model="query.business_type"
          :options="themeList"
        >
        </cb-select>
        <cb-search-input
          v-model="query.pattern"
          :placeholder="$t('systemManagement.message.plzInputKeyWord')"
        ></cb-search-input>
      </template>

      <template v-slot:username="scope">
        <span v-if="scope.data.user_name">
          {{ scope.data.user_name + '(' + scope.data.user_id + ')' }}
        </span>
        <span v-else>-</span>
      </template>

      <template v-slot:operate="scope">
        <cb-button @click="comment(scope.data)" type="text" mr>
          {{ $t('systemManagement.message.comment') }}
        </cb-button>
        <cb-button @click="lookComment(scope.data)" type="text" mr>
          {{ $t('systemManagement.message.lookComment') }}
        </cb-button>
      </template>
    </cb-search-table>
    <!-- 评论 -->
    <comment
      :visible-comment="visibleComment"
      :comment="commentContent"
      @update="handleUpdate"
      @cancel="handleCancel"
      commentType="first"
      v-if="visibleComment"
    />
    <!-- 查看被评论 -->
    <cb-dialog
      width="70%"
      height="400px"
      :visible.sync="visibleValue"
      :append-to-body="true"
    >
      <template slot="title">
        <div>{{ $t('systemManagement.message.lookComment') }}</div>
      </template>
      <div>
        <second-message :main-id="mainId" @update="handleUpdate" />
      </div>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import { reactive, toRefs, ref } from '@vue/composition-api';
import { getI18N, getLanguage } from '@cyber/helper';
import { deleteMessage } from '@/api/system';
import SecondMessage from './second-message.vue';
import Comment from './comment.vue';
export default {
  components: { SecondMessage, Comment },
  setup(props) {
    const i18n = getI18N();
    let language = getLanguage();
    let messageListRef = ref(null);
    const state = reactive({
      visibleValue: false,
      visibleComment: false,
      commentContent: null,
      query: {
        business_type: '',
        pattern: '',
      },
      mainId: '',
      themeList: [
        {
          label: i18n.t('systemManagement.message.allTheme'),
          value: '',
        },
        {
          label: i18n.t('systemManagement.message.course'),
          value: 1,
        },
        {
          label: i18n.t('systemManagement.message.class'),
          value: 2,
        },
        {
          label: i18n.t('systemManagement.message.practicalOperation'),
          value: 3,
        },
      ],
      cols: [
        {
          label: i18n.t('systemManagement.message.user'),
          slot: 'username',
        },
        {
          label: i18n.t('systemManagement.message.theme'),
          prop: 'business_type',
          getData(data) {
            if (data.business_type === 1) {
              return i18n.t('systemManagement.message.course');
            }
            if (data.business_type === 2) {
              return i18n.t('systemManagement.message.class');
            }
            if (data.business_type === 3) {
              return i18n.t('systemManagement.message.practicalOperation');
            }
          },
        },
        {
          label: i18n.t('systemManagement.message.name'),
          prop: 'theme_name',
          width: 300,
          resizable: true,
        },
        {
          label: i18n.t('systemManagement.message.content'),
          prop: 'content',
          width: 300,
          resizable: true,
        },
        {
          label: i18n.t('systemManagement.message.likeCount'),
          prop: 'likes_count',
        },
        {
          label: i18n.t('systemManagement.message.commentCount'),
          prop: 'reply_count',
        },
        {
          label: i18n.t('systemManagement.message.time'),
          prop: 'create_time',
        },

        {
          label: i18n.t('systemManagement.message.operate'),
          slot: 'operate',
          width: language === 'zh-CN' ? '150px' : '180px',
        },
      ],
      baseURL: '/api/ojj',
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
      messageListRef.value.reload();
    };
    const lookComment = (data) => {
      refData.mainId.value = data.resource_id;
      refData.visibleValue.value = true;
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
          messageListRef.value.reload();
        })
        .catch(() => {
          done(false);
        });
    };
    return {
      ...refData,
      messageListRef,
      comment,
      lookComment,
      handleCancel,
      handleUpdate,
      deleteSelectMessage,
    };
  },
};
</script>

<style lang="scss" scoped></style>
