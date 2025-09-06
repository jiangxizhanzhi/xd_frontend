<template>
  <!-- 评估指标列表页 -->
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      :url="url"
      baseURL="/api/ojj"
      row-key="resource_id"
      :data.sync="model"
      ref="tableListRef"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="assessment-indicators-create"
        ></cb-button>
        <cb-button
          hollow
          button-type="delete"
          @click="deleteSelectedRow(selection, $event)"
          :disabled="selection.length === 0"
        ></cb-button>
      </template>

      <template v-slot:filter>
        <cb-search-input
          v-model="model.pattern"
          :placeholder="$t('assessment.searchIndicators')"
        ></cb-search-input>
      </template>
      <template v-slot:operate="scope">
        <cb-button
          type="text"
          @click="editRow(scope.data)"
          button-type="edit"
          mr
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import '@/lang/all-lang/index';
export default {
  name: 'TrafficList',
  data() {
    return {
      url: '/cr/eval/system/list',
      model: {
        algorithm: '',
        pattern: '',
        interactive_type: 1,
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('assessment.indicatorsName'),
          prop: 'name',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('assessment.description'),
          prop: 'description',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('assessment.firstIndicatorsNum'),
          prop: 'first_index_num',
        },
        {
          label: this.$t('assessment.secondIndicatorsNum'),
          prop: 'second_index_num',
        },
        {
          label: this.$t('assessment.thirdIndicatorsNum'),
          prop: 'third_index_num',
        },
        {
          label: this.$t('assessment.operation'),
          slot: 'operate',
        },
      ],
    };
  },
  computed: {},
  methods: {
    /* 删除 */
    deleteSelectedRow(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.resource_id);
        });
      }
      this.$request
        .delete('/cr/eval/system', { ids }, { baseURL: '/api/ojj' })
        .then(() => {
          done();
          this.selection = [];
          this.$refs.tableListRef.reload();
        })
        .catch((err) => {
          done(false);
        });
    },
    /* 编辑 */
    editRow(data) {
      const { resource_id } = data;
      this.$router.push({
        path: `/admin/assessment-indicators/edit/${resource_id}`,
      });
    },
  },
};
</script>

<style scoped>
::v-deep .ant-pagination {
  float: right;
}
</style>
