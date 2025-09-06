<template>
  <cb-inner-page :background="false">
    <cb-search-table
      class="content-bgc"
      :cols="cols"
      :url="url"
      baseURL="/api/vuln"
      :data="model"
      search-bar-bg
      ref="listRef"
    >
      <template v-slot:filter>
        <cb-search-input
          v-model="model.title"
          :placeholder="$t('ghdb.enterKeywords')"
        ></cb-search-input>
        <cb-search-input
          v-model="model.author"
          :placeholder="$t('exp.enterAuthor')"
        ></cb-search-input>
      </template>
      <template v-slot:keyword="scope">
        <span
          class="name-field"
          style="cursor: pointer"
          @click="detailRow(scope.data)"
        >
          {{ scope.data.title }}
        </span>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
export default {
  data() {
    return {
      url: '/web/vuln/tools/ghdb/list',
      model: {
        title: '',
        author: '',
      },
      cols: [
        {
          label: this.$t('ghdb.keywords'),
          slot: 'keyword',
          width: 500,
        },
        {
          label: this.$t('ghdb.content'),
          prop: 'content',
        },
        {
          label: this.$t('exp.author'),
          prop: 'author',
          width: 200,
        },
        {
          label: this.$t('exp.date'),
          prop: 'published',
          width: 120,
        },
      ],
      tableDate: [],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    detailRow(row) {
      this.$router.push({
        path: `/vuln/ghdb_library_detail/${row.id}/`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.name-field {
  cursor: pointer;
  color: var(--primary-color);
}
</style>
