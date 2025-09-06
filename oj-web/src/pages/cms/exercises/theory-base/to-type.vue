<template>
  <cb-inner-page :background="false">
    <div class="content-table">
      <cb-search-table
        ref="theoryTypeRef"
        :baseURL="baseURL"
        :url="url"
        :record-ctg="$t('m.direction')"
        :cols="columns"
        :data.sync="query"
        :selector="tableSelector"
        :selection.sync="multipleSelection"
        row-key="resource_id"
      >
        <template v-slot:search>
          <cb-button button-type="add" @click="push" mr="mr">{{
            $t('m.add')
          }}</cb-button>
          <cb-button
            :disabled="multipleSelection.length === 0"
            hollow
            button-type="delete"
            @click="deleteSelectedType(multipleSelection, $event)"
            mr="mr"
            >{{ $t('m.delete') }}</cb-button
          >
        </template>
        <template v-slot:filter>
          <cb-search-input
            v-model="query.pattern"
            :placeholder="$t('m.titleNamePh')"
          ></cb-search-input>
        </template>
        <template v-slot:operate="scope">
          <cb-button type="text" @click="edit(scope.data.resource_id)">{{
            $t('button.edit')
          }}</cb-button>
        </template>
      </cb-search-table>
    </div>
  </cb-inner-page>
</template>
<script>
import SearchInput from '@/components/search-condition/search-input.vue';
export default {
  components: {
    SearchInput,
  },
  data() {
    return {
      baseURL: '/api/ojj',
      url: 'oj/admin/practice/category/list',
      pagination: {
        current_page: 1,
        per_page: 15,
        total: 0,
      },
      query: {
        pattern: '',
        practice_type: '0',
      },
      typeData: [],
      multipleSelection: [],
    };
  },
  created() {
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('m.title'),
        prop: 'name',
      },
      {
        label: this.$t('m.operation'),
        slot: 'operate',
      },
    ];
  },
  methods: {
    push() {
      this.$router.push({ name: 'theory-add-type' });
    },
    edit(resource_id) {
      this.$router.push({
        name: 'theory-edit-type',
        params: {
          typeId: resource_id,
        },
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除提示
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
          that.$refs.theoryTypeRef.reload();
        })
        .catch((error) => {
          that.$serverError(error);
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
