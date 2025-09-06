<template>
  <cb-inner-page :background="false">
    <cb-search-table
      ref="tableRef"
      url="/rtks/task/list"
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
          <cb-button button-type="add" link-name="job-database-add"></cb-button>
          <cb-button
            buttonType="delete"
            hollow
            :disabled="multipleSelection.length === 0"
            @click="deleteListItem(multipleSelection, $event, 1)"
          ></cb-button>
        </cb-button-group>
      </template>
      <template v-slot:filter>
        <cb-search-input
          :placeholder="$t('careerSystem.plzEnterKeywords')"
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
          <cb-button
            button-type="delete"
            type="text"
            @click="deleteListItem(scope.data, $event, 2)"
          ></cb-button>
        </cb-button-group>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>
<script>
import { deleteJobResponsibility } from '@/api/career-framework';
export default {
  name: 'JobDatabaseList',
  components: {},
  data() {
    return {
      query: {
        pattern: '',
      },
      multipleSelection: [],
      columns: [],
    };
  },
  created() {
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('careerSystem.number'),
        prop: 'resource_id',
        width: 150,
      },
      {
        label: this.$t('careerSystem.content'),
        prop: 'content',
        width: 900,
        resizable: true,
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
    deleteListItem(data, done, type) {
      const ids = [];
      if (type === 1) {
        if (data?.length) {
          data.forEach((item) => {
            ids.push(item.resource_id);
          });
        }
      } else if (type === 2) {
        ids.push(data.resource_id);
      }
      deleteJobResponsibility({ ids })
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
        name: 'job-database-edit',
        params: {
          jobId: row.resource_id,
        },
      });
    },
  },
};
</script>
