<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      :url="url"
      baseURL="/api/ojj"
      row-key="eval_algorithm_id"
      :data.sync="model"
      ref="tableListRef"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="assessment-algorithm-create"
        ></cb-button>
        <cb-button
          hollow
          button-type="delete"
          @click="deleteSelectedRow(selection, $event)"
          :disabled="selection.length === 0"
        ></cb-button>
      </template>

      <template v-slot:filter>
        <cb-select
          v-model="model.type"
          :options="algorithmList"
          :first="{ label: $t('assessment.allAlgorithm'), value: '' }"
          clearable
        />
        <cb-search-input
          v-model="model.pattern"
          :placeholder="$t('assessment.searchName')"
        ></cb-search-input>
      </template>
      <!-- 算法类型 -->
      <template v-slot:type="scope">
        <span>{{ exchangeParamType[scope.data.type] }}</span>
      </template>
      <!-- 编辑 -->
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
      exchangeParamType: {},
      dataArr: [],
      // 评估算法列表
      url: '/cr/eval/algorithm/list',
      model: {
        type: '',
        pattern: '',
        type: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('assessment.algorithmName'),
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
          label: this.$t('assessment.parametersNum'),
          prop: 'params_num',
        },
        // 算法类型
        {
          label: this.$t('assessment.algorithmTYpe'),
          slot: 'type',
        },
        {
          label: this.$t('assessment.operation'),
          slot: 'operate',
        },
      ],
    };
  },
  computed: {
    algorithmList() {
      let arr = [];
      _.forEach(this.dataArr, (item) => {
        // 列表转化算法类型type
        this.exchangeParamType[item.code] = item.name;
        arr.push({
          label: item.name.toString(),
          value: item.code,
        });
      });
      return arr;
    },
  },
  created() {
    this.$request
      .get('/cr/common/constants_config', { type: 5 }, { baseURL: '/api/ojj' })
      .then((res) => {
        this.dataArr = res.data.data;
      });
  },
  methods: {
    /* 删除 */
    deleteSelectedRow(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.eval_algorithm_id);
        });
      }
      this.$request
        .delete('/cr/eval/algorithm', { ids }, { baseURL: '/api/ojj' })
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
      // const { resource_id } = data;
      const { eval_algorithm_id } = data;
      this.$router.push({
        // path: `/assessment-algorithm/edit/${resource_id}`,
        path: `/admin/assessment-algorithm/edit/${eval_algorithm_id}`,
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
