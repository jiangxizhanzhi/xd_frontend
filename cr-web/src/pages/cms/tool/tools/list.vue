<template>
  <cb-inner-page class="app-container" :background="false">
    <cb-search-table
      ref="toolTableRef"
      :baseURL="baseURL"
      :url="url"
      :cols.sync="columns"
      :data.sync="query"
      :selection.sync="selection"
      :searchBarBg="true"
    >
      <template v-slot:filter>
        <cb-search-input
          v-model="query.pattern"
          :placeholder="$t('tools.enterName')"
        />
      </template>
      <template v-slot:search>
        <cb-button button-type="add" link-name="tool-create"></cb-button>
        <cb-button
          hollow
          button-type="delete"
          :disabled="selection.length === 0"
          @click="deleteSelectedTools(selection, $event)"
        ></cb-button>
      </template>
      <template v-slot:searchRightArea>
        <cb-button
          icon="icon-shezhi"
          hollow
          :link-name="{
            name: 'tool-category-list',
            query: { source: sourceRoute() },
          }"
          >{{ $t('tool.toolCategoryManagement') }}</cb-button
        >
      </template>
      <template v-slot:toolType="scope">
        <span>{{
          +scope.data.tool_type === $CONSTANT.Tools.ToolTypes.OFFLINE_TOOL.value
            ? $t('tools.offlineTool')
            : $t('tools.onlineTool')
        }}</span>
      </template>
      <template v-slot:category="scope">
        <span class="tool-category" :title="scope.data.category_i18n_name">{{
          scope.data.category_i18n_name
        }}</span>
      </template>
      <template v-slot:operation="scope">
        <cb-button
          button-type="edit"
          type="text"
          :link-name="{
            name: 'tool-update',
            params: { id: scope.data.resource_id },
          }"
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
export default {
  name: 'List',
  data() {
    const that = this;
    return {
      categoryList: [],
      url: '/cr/admin/tools/list',
      baseURL: '/api/ojj',
      query: {
        pattern: '',
      },
      selection: [],
      columns: [
        {
          label: this.$t('table.name'),
          prop: 'name',
          width: 200,
          resizable: true,
        },
        {
          label: this.$t('tools.category'),
          slot: 'category',
          prop: 'category',
          width: 200,
          resizable: true,
        },
        {
          label: this.$t('tools.platforms'),
          prop: 'platforms',
        },
        {
          label: this.$t('tools.visible'),
          getData: (row) => {
            return row.visible ? this.$t('tools.yes') : this.$t('tools.no');
          },
        },
        {
          label: this.$t('tools.language'),
          getData(row) {
            return that.formatters.language(row, '', row.language);
          },
        },
        {
          label: this.$t('tools.toolType'),
          slot: 'toolType',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
      formatters: {
        crack: (row, column, cellValue, index) => {
          return cellValue ? this.$t('tools.yes') : this.$t('tools.no');
        },
        language: (row, column, cellValue, index) => {
          const languageArray = [];
          this.$_.forEach(cellValue, (lang) => {
            if (lang) {
              languageArray.push(
                this.$CONSTANT.DICT.Tools.Language[lang].toString(),
              );
            }
          });
          return this.$_.join(languageArray, ',');
        },
      },
    };
  },
  created() {},
  methods: {
    sourceRoute() {
      return this.$route.name;
    },
    deleteSelectedTools(data, done) {
      const arr = data.map((i) => {
        return i.resource_id;
      });
      this.$request
        .delete('/cr/admin/tools', { ids: arr }, { baseURL: '/api/ojj' })
        .then(() => {
          done();
          this.$refs.toolTableRef.reload();
          this.selection = [];
        })
        .catch(() => {
          done(false);
        });
    },
  },
};
</script>

<style scoped>
.el-table .cell {
  white-space: pre-line;
}
.tool-category {
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
