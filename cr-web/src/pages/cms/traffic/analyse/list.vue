<template>
  <cb-inner-page :background="false">
    <!-- :selector="selector"
    :selection.sync="selection" -->
    <cb-search-table
      :cols.sync="cols"
      row-key="resource_id"
      url="/suricata/rule/page"
      baseURL="/api/mp"
      :data.sync="model"
      ref="tableListRef"
      :searchBarBg="true"
    >
      <!-- <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="traffic-analyse-create"
        ></cb-button>
        <cb-button
          hollow
          button-type="delete"
          @click="deleteSelectedRow(selection, $event)"
          :disabled="selection.length === 0"
        ></cb-button>
      </template> -->
      <template v-slot:filter>
        <cb-select
          v-model="model.protocol"
          :placeholder="$t('analyse.plzSelectAgreement')"
          :first="{
            value: '',
            label: $t('analyse.allAgreement'),
          }"
          :options="options"
          clearable
        />
        <cb-search-input
          v-model="model.ruleName"
          :placeholder="$t('analyse.plzEnterRuleName')"
        ></cb-search-input>
        <cb-search-input
          v-model="model.attck"
          :placeholder="$t('analyse.plzEnterAttack')"
        ></cb-search-input>
      </template>
      <!-- <template slot="searchRightArea">
        <cb-button
          hollow
          @click="toType"
        >{{
            $t('traffic.typeManage')
          }}</cb-button>
      </template> -->

      <!-- <template v-slot:operate="scope">
        <cb-button
          type="text"
          @click="editRow(scope.data)"
          button-type="edit"
          mr
        ></cb-button>
      </template> -->
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { getRuleProtocol } from '@/api/traffic/traffic';
export default {
  name: 'TrafficAnalyseList',
  data() {
    return {
      options: [],
      tagNames: {},
      model: {
        attck: '',
        ruleName: '',
        protocol: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('analyse.ruleName'),
          prop: 'rule_name',
          width: 380,
          resizable: true,
        },
        {
          label: this.$t('analyse.agreement'),
          prop: 'protocol',
          width: 80,
        },
        {
          label: 'SID',
          prop: 'sid',
          width: 100,
        },
        {
          label: this.$t('analyse.sourceIP'),
          prop: 'source',
          width: 150,
        },
        {
          label: this.$t('analyse.sourcePort'),
          prop: 'source_ports',
          width: 100,
        },
        {
          label: this.$t('analyse.category'),
          prop: 'direction',
          width: 100,
        },
        {
          label: this.$t('analyse.destIP'),
          prop: 'destination',
          width: 150,
        },
        {
          label: this.$t('analyse.destPort'),
          prop: 'destination_ports',
          width: 100,
        },
        {
          label: this.$t('analyse.regularBody'),
          prop: 'rule_msg',
        },
        {
          label: 'Att&ck',
          prop: 'attck',
          width: 100,
        },
        // {
        //   label: this.$t('common.operation'),
        //   slot: 'operate',
        // },
      ],
    };
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    // 删除
    deleteSelectedRow(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.resource_id);
        });
      }
      this.$request
        .delete('/flow/info/batch_delete', [...ids], { baseURL: '/api/mp' })
        .then(() => {
          done();
          this.selection = [];
          this.$refs.tableListRef.reload();
        })
        .catch((err) => {
          done(false);
        });
    },
    // 编辑
    editRow(data) {
      const { resource_id } = data;
      this.$router.push({
        path: `/admin/traffic/analyse/edit/${resource_id}`,
      });
    },
    //获取列表名称集合
    getTagNames(arr) {
      let newTagName = {};
      for (let i = 0; i < arr.length; i++) {
        newTagName[arr[i].code] = arr[i].name;
      }
      return newTagName;
    },
    //获取列表数据
    getOptions() {
      getRuleProtocol().then((res) => {
        const data = _.get(res, 'data.data', []);
        const arr = [];
        _.forEach(data, (item) => {
          if (item) {
            arr.push({
              label: item,
              value: item,
            });
          }
        });
        this.options = arr;
        // console.log(this.options, ' this.options');
        // this.tagNames = this.getTagNames(this.options);
      });
    },
    //跳转到类型管理
    toType() {
      this.$router.push({ name: 'traffic-analyse-type-list' });
    },
  },
};
</script>
