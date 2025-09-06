<template>
  <cb-inner-page :background="false">
    <cb-search-table
      rowKey="resource_id"
      :cols.sync="cols"
      :selection.sync="selection"
      :url="url"
      :baseURL="baseURL"
      :data.sync="query"
      ref="tableRef"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="custom-probe-create"
        ></cb-button>
        <cb-button
          hollow
          button-type="delete"
          @click="deleteSelected(selection, $event)"
          :disabled="selection.length === 0"
        ></cb-button>
      </template>
      <template v-slot:filter>
        <cb-select
          v-model="query.probe_categories"
          :placeholder="$t('common.pleaseChoose')"
          :options="probesTypes"
          titleField="name"
          valueField="code"
          :first="{ name: $t('probes.allType'), code: '' }"
        />
        <cb-select
          v-model="query.os_types"
          :placeholder="$t('common.pleaseChoose')"
          :options="applicableSystems"
          titleField="name"
          valueField="code"
          :first="{ name: $t('probes.allOs'), code: '' }"
        />
        <cb-search-input
          v-model="query.name"
          :placeholder="$t('probes.inputProbeName')"
        ></cb-search-input>
      </template>

      <template v-slot:probeCate="scope">
        <span>{{ types[scope.data.probe_category] }}</span>
      </template>

      <template v-slot:scriptType="scope">
        <span v-if="scope.data.script_type == '0'">shell</span>
        <span v-else-if="scope.data.script_type == '1'">python</span>
        <span v-else>bat</span>
      </template>

      <template v-slot:operation="scope">
        <cb-button
          :link-name="{
            name: 'custom-probe-edit',
            params: { id: scope.data.id },
          }"
          type="text"
          button-type="edit"
          mr
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import { SCRIPTTYPELISTS } from '../constant';
import { getProbes, getProbeSystems } from '@/api/gather/probe';

export default {
  data() {
    return {
      url: `/probes/page/?types=${1}`,
      baseURL: '/api/mp',
      probesTypes: [],
      types: {}, //存储探针类型的集合，value是键，label是值
      applicableSystems: [],
      osTypes: {}, //存储操作系统类型的集合，value是键，label是值
      scriptTypes: SCRIPTTYPELISTS,
      selection: [],
      categories: [],
      system: [],
      query: {
        probe_categories: '',
        os_types: '',
        name: '',
      },
      cols: [
        {
          label: this.$t('probes.name'),
          prop: 'name',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('probes.describe'),
          prop: 'description',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('probes.type'),
          slot: 'probeCate',
        },
        {
          label: this.$t('probes.applicableSystem'),
          getData: (data) => {
            const OsTypes = data.os_types;
            const types = _.map(OsTypes, (index) => this.osTypes[index]);
            return types.join(', ');
          },
        },
        {
          label: this.$t('probes.codeLang'),
          slot: 'scriptType',
        },
        {
          label: this.$t('common.creator'),
          prop: 'creator_name',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.getProbesList();
    this.getProbeSystemsList();
  },
  methods: {
    deleteSelected(selection, done) {
      let ids = [];
      if (selection?.length) {
        selection.forEach((item) => {
          ids.push(item.id);
        });
      }
      this.$request
        .delete(`/probes/?ids=${ids}`, null, { baseURL: '/api/mp' })
        .then((res) => {
          done();
          this.$refs.tableRef.reload();
          this.selection = [];
        })
        .catch(() => {});
    },
    //获取探针或者系统分类
    getTypes(arr) {
      let newArr = {};
      for (let i = 0; i < arr.length; i++) {
        newArr[arr[i].code] = arr[i].name;
      }
      return newArr;
    },
    getProbesList() {
      getProbes().then((res) => {
        this.probesTypes = _.get(res, 'data.data', []);
        this.types = this.getTypes(this.probesTypes);
      });
    },
    getProbeSystemsList() {
      getProbeSystems().then((res) => {
        this.applicableSystems = _.get(res, 'data.data', []);
        this.osTypes = this.getTypes(this.applicableSystems);
      });
    },
  },
};
</script>
<style scoped></style>
