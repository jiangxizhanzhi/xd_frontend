<template>
  <cb-inner-page :background="false" class="category-list-container">
    <cb-search-table
      ref="CategoryTableRef"
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
          style="width: 300px"
        />
      </template>
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="tool-category-create"
        ></cb-button>
        <cb-button
          button-type="delete"
          hollow
          :disabled="selection.length === 0"
          @click="deleteCategory(selection, $event)"
        ></cb-button>
      </template>
      <template v-slot:searchRightArea>
        <cb-button icon="icon-shezhi" @click="returnTrafficList" hollow>{{
          $t('tool.returnToolList')
        }}</cb-button>
      </template>
      <template v-slot:cnname="scope">
        <span>{{ scope.data.cn_name }}</span>
      </template>
      <template v-slot:enname="scope">
        <span>{{ scope.data.en_name }}</span>
      </template>
      <template v-slot:operation="scope">
        <cb-button
          button-type="edit"
          type="text"
          :link-name="{
            name: 'tool-category-update',
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
    return {
      url: '/cr/admin/tool/category/list',
      baseURL: '/api/ojj',
      query: {
        pattern: '',
      },
      selection: [],
      columns: [
        {
          label: this.$t('trafficCategory.cn_name'),
          slot: 'cnname',
          prop: 'cnname',
          width: 400,
          resizable: true,
        },
        {
          label: this.$t('trafficCategory.en_name'),
          slot: 'enname',
          prop: 'enname',
          width: 400,
          resizable: true,
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
          width: 120,
        },
      ],
    };
  },
  methods: {
    returnTrafficList() {
      this.$router.push({ name: 'tool' });
    },
    deleteCategory(data, done) {
      const arr = data.map((i) => {
        return i.resource_id;
      });
      this.$request
        .delete(
          '/cr/admin/tool/category',
          { ids: arr },
          { baseURL: '/api/ojj' },
        )
        .then(() => {
          done();
          this.$refs.CategoryTableRef.reload();
          this.selection = [];
        })
        .catch(() => {
          done(false);
        });
    },
  },
};
</script>
