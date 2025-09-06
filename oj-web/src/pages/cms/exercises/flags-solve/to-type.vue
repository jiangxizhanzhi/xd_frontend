<template>
  <cb-inner-page :background="false">
    <div class="content-table">
      <cb-search-table
        ref="flagsTypeRef"
        :baseURL="baseURL"
        :url="url"
        :record-ctg="$t('m.direction')"
        :cols="columns"
        :data.sync="query"
        :selection.sync="multipleSelection"
        row-key="resource_id"
      >
        <template v-slot:search>
          <cb-button button-type="add" @click="push"></cb-button>
          <cb-button
            button-type="delete"
            hollow
            :disabled="multipleSelection.length === 0"
            @click="deleteSelectedType(multipleSelection, $event)"
          ></cb-button>
        </template>
        <template v-slot:filter>
          <cb-search-input
            v-model="query.pattern"
            :placeholder="$t('m.titleNamePh')"
          ></cb-search-input>
        </template>
        <template v-slot:operate="scope">
          <cb-button
            button-type="edit"
            type="text"
            @click="edit(scope.data.resource_id)"
          ></cb-button>
        </template>
      </cb-search-table>
    </div>
  </cb-inner-page>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      baseURL: '/api/ojj',
      url: 'oj/admin/practice/category/list',
      query: {
        pattern: '',
        practice_type: '2',
      },
      typeData: [],
      multipleSelection: [],
    };
  },
  created() {
    this.columns = [
      {
        label: this.$t('m.title'),
        prop: 'name',
      },
      {
        label: this.$t('m.operation'),
        slot: 'operate',
        width: '200px',
      },
    ];
  },
  methods: {
    // 方向添加
    push() {
      this.$router.push({ name: 'flags-add-type' });
    },
    // 方向编辑
    edit(resource_id) {
      this.$router.push({
        name: 'flags-edit-type',
        params: {
          typeId: resource_id,
        },
      });
    },
    // 删除
    deleteSelectedType(data, done) {
      const that = this;
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.resource_id));
      } else {
        resource_ids.push(data.resource_id);
      }
      that.$request
        .delete(
          '/oj/admin/practice/category',
          { resource_ids },
          { baseURL: '/api/ojj' },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.flagsTypeRef.reload();
        })
        .catch((error) => {
          done(false);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.type-content {
  .header-box {
    height: 40px;
    margin-bottom: 20px;
  }
  .exam-botton {
    margin-top: 25px;
  }
}
</style>
