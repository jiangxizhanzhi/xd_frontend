<template>
  <cb-inner-page :background="false">
    <cb-search-table
      ref="sdlRef"
      :selector="selector"
      :selection.sync="selection"
      url="/oj/admin/course/direction/list"
      :data.sync="query"
      :cols="columns"
      baseURL="/api/ojj"
    >
      <template v-slot:search>
        <cb-button-group>
          <cb-button
            button-type="add"
            @click="$router.push({ name: 'courses-aspect-add' })"
          ></cb-button>
          <cb-button
            hollow
            buttonType="delete"
            :disabled="selection.length === 0"
            :warnMsg="deleteMsg"
            :completeMsg="deleteSuccessMsg"
            @click="deleteCourse(selection, $event)"
            >{{ $t('m.delete') }}</cb-button
          >
        </cb-button-group>
      </template>
      <template v-slot:filter>
        <cb-search-input
          v-model="query.pattern"
          :placeholder="$t('m.namePh')"
        ></cb-search-input>
      </template>

      <template v-slot:opeator="scope">
        <cb-button
          type="text"
          @click="gotoEditor(scope.data)"
          button-type="edit"
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>
<script>
import CommonUtils from '@/utils/utils.js';

export default {
  data() {
    return {
      selector: {
        maxSelect: 0,
      },
      selection: [],
      query: {
        pattern: '',
        // java 接口 先传false
        children: false,
      },
    };
  },
  computed: {
    deleteMsg() {
      const that = this;
      const recordCtg = that.$t('common.record');
      return CommonUtils.formatString(
        that.$t('common.confirmDeleteMsg'),
        recordCtg,
      );
    },
    deleteSuccessMsg() {
      const that = this;
      const recordCtg = that.$t('common.record');
      return CommonUtils.formatString(
        that.$t('common.deleteSuccess'),
        recordCtg,
      );
    },
  },
  created() {
    const that = this;
    that.selector = {
      maxSelect: 0,
    };

    that.columns = [
      {
        label: this.$t('views.course.aspect.Name'),
        prop: 'name',
        sort: 'name',
      },
      {
        label: this.$t('common.Operate'),
        slot: 'opeator',
        width: '200px',
      },
    ];
  },
  methods: {
    // 删除
    deleteCourse(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      that.$request
        .delete(
          '/oj/admin/course/direction/batch',
          {
            resource_ids: ids,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          done();
          that.selection = [];
          that.$refs.sdlRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    gotoEditor(aspect) {
      this.$router.push({
        name: 'courses-aspect-edit',
        params: {
          aspectId: aspect.resource_id,
        },
      });
    },
  },
};
</script>
