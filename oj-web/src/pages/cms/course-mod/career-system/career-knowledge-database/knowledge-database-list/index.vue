<template>
  <cb-inner-page :background="false">
    <cb-search-table
      ref="tableRef"
      url="/rtks/knowledge/list"
      baseURL="/api/ojj"
      :cols.sync="columns"
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
            link-name="knowledge-database-add"
          ></cb-button>
          <cb-button
            button-type="delete"
            hollow
            :disabled="multipleSelection.length === 0"
            @click="deleteListItem(multipleSelection, $event)"
          ></cb-button>
        </cb-button-group>
      </template>
      <template v-slot:filter>
        <cb-select
          v-model="query.category_id"
          :options="categoryList"
          :placeholder="$t('careerSystem.selectknowledgeCategory')"
          clearable
        />
        <cb-search-input
          :placeholder="$t('careerSystem.enterNumberContent')"
          v-model="query.pattern"
        ></cb-search-input>
      </template>
      <template v-slot:searchRightArea>
        <cb-button
          icon="icon-ziyuanguanli"
          link-name="knowledge-category-list"
          >{{ $t('careerSystem.knowledgeCategory') }}</cb-button
        >
      </template>
      <template v-slot:course_list="scope">
        <div v-if="scope.data.show">
          <div
            class="spanover"
            :title="item.name"
            v-for="item in scope.data.course_list"
            :key="item.resource_id"
          >
            {{ item.name }}
          </div>
        </div>
        <div v-else>
          <div
            class="spanover"
            :title="item.name"
            v-for="item in getKnowledge(scope.data)"
            :key="item.resource_id"
          >
            {{ item.name }}
          </div>
        </div>
        <cb-button
          v-if="scope.data.course_list.length > 20 && !scope.data.show"
          @click="getAllKnowledge(scope.data)"
          color-type="primary"
          type="text"
          >{{ $t('careerSystem.seeMore') }}</cb-button
        >
        <cb-button
          v-if="scope.data.course_list.length > 20 && scope.data.show"
          @click="hideKnowledge(scope.data)"
          color-type="primary"
          type="text"
          >{{ $t('careerSystem.close') }}</cb-button
        >
      </template>
      <template v-slot:operate="scope">
        <cb-button
          button-type="edit"
          type="text"
          @click="edit(scope.data)"
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>
<script>
import { KnowledgeCategoryList, deleteKnowledge } from '@/api/career-framework';
export default {
  name: 'KnowledgeDatabaseList',
  data() {
    return {
      query: {
        category_id: '',
        pattern: '',
      },
      categoryList: [],
      tableSelector: {
        maxSelect: 0,
      },
      multipleSelection: [],
      columns: [],
    };
  },
  created() {
    this.columns = [
      {
        label: this.$t('careerSystem.number'),
        prop: 'resource_id',
      },
      {
        label: this.$t('careerSystem.knowledgeCategory'),
        prop: 'category',
        width: 350,
        resizable: true,
      },
      {
        label: this.$t('careerSystem.content'),
        prop: 'content',
        width: 500,
        resizable: true,
      },
      {
        label: this.$t('careerSystem.relatedCourses'),
        slot: 'course_list',
      },
      {
        label: this.$t('careerSystem.operate'),
        slot: 'operate',
        width: 120,
      },
    ];
  },
  mounted() {
    this.getCategory();
  },
  methods: {
    getAllKnowledge(data) {
      this.$set(data, 'show', true);
    },
    hideKnowledge(data) {
      this.$set(data, 'show', false);
    },
    getKnowledge(data) {
      if (data.course_list.length <= 20) {
        return data.course_list;
      } else {
        return data.course_list.slice(0, 20);
      }
    },
    // 获取知识类别
    getCategory() {
      KnowledgeCategoryList().then((res) => {
        const data = _.get(res, 'data.data.list', []);
        const list = data.map((item) => {
          return {
            label: item.content,
            value: item.resource_id,
          };
        });
        this.categoryList = [...list];
      });
    },
    // 删除
    deleteListItem(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.resource_id);
        });
      }
      deleteKnowledge({ ids })
        .then(() => {
          done();
          this.multipleSelection = [];
          this.$refs.tableRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 编辑
    edit(row) {
      this.$router.push({
        name: 'knowledge-database-edit',
        params: {
          libraryId: row.resource_id,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.spanover {
  color: var(--neutral8);
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
