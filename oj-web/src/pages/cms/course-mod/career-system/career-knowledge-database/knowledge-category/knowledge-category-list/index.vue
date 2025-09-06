<template>
  <cb-inner-page :background="false">
    <cb-search-table
      ref="tableRef"
      url="/rtks/knowledge-category/list"
      baseURL="/api/ojj"
      :cols="columns"
      :data.sync="query"
      :selector="tableSelector"
      :selection.sync="multipleSelection"
      row-key="resource_id"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button-group>
          <cb-button
            button-type="add"
            link-name="knowledge-category-add"
          ></cb-button>
          <cb-button
            buttonType="delete"
            hollow
            :disabled="multipleSelection.length === 0"
            @click="deleteListItem(multipleSelection, $event)"
          ></cb-button>
        </cb-button-group>
      </template>
      <template v-slot:filter>
        <cb-search-input
          :placeholder="$t('careerSystem.enterName')"
          v-model="query.pattern"
        ></cb-search-input>
      </template>
      <template v-slot:operate="scope">
        <cb-button-group>
          <cb-button
            button-type="edit"
            type="text"
            @click="edit(scope.data)"
          ></cb-button>
        </cb-button-group>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>
<script>
import { deleteKnowledgeCategory } from '@/api/career-framework';
export default {
  name: 'KnowledgeCategoryList',
  data() {
    return {
      query: {
        pattern: '',
      },
      multipleSelection: [],
    };
  },
  created() {
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('careerSystem.name'),
        prop: 'content',
      },
      {
        label: this.$t('careerSystem.operate'),
        slot: 'operate',
        width: 200,
      },
    ];
  },
  mounted() {},
  methods: {
    // 删除
    deleteListItem(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.resource_id);
        });
      }
      deleteKnowledgeCategory({ ids })
        .then(() => {
          done();
          this.multipleSelection = [];
          this.$refs.tableRef.reload();
        })
        .catch((res) => {
          done(false);
          if (res.data.code == '100003') {
            this.$message({
              type: 'warning',
              message: this.$t('careerSystem.bindPointsCategoryOut'),
            });
          }
        });
    },
    // 编辑
    edit(row) {
      this.$router.push({
        name: 'knowledge-category-edit',
        params: {
          id: row.resource_id,
        },
      });
    },
  },
};
</script>
