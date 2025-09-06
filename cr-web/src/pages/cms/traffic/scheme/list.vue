<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      url="/flow/collection/page"
      baseURL="/api/mp"
      :data.sync="model"
      row-key="id"
      ref="tableListRef"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="traffic-scheme-create"
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
          v-model="model.category"
          :placeholder="$t('traffic.selectCategory')"
          :first="{
            code: '',
            name: $t('traffic.allCategories'),
          }"
          titleField="name"
          valueField="code"
          :options="options"
          clearable
        />
        <cb-search-input
          v-model="model.search"
          :placeholder="$t('traffic.pleaseInputScheme')"
        ></cb-search-input>
      </template>

      <template v-slot:searchRightArea>
        <cb-button @click="toType" hollow>{{
          $t('traffic.typeManage')
        }}</cb-button>
      </template>

      <template v-slot:category="scope">
        <span>{{ tagNames[scope.data.category] }}</span>
      </template>

      <template v-slot:operate="scope">
        <cb-button
          type="text"
          @click="editRow(scope.data)"
          button-type="edit"
          mr
        ></cb-button>
        <!-- <cb-button type="text" @click="manageRow(scope.data)" mr>
          {{ $t('traffic.trafficManagement') }}
        </cb-button> -->
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import '@/lang/all-lang/index';
import { trans } from '@/lang';
import { getOptionList } from '@/api/traffic/traffic';

export default {
  name: 'List',
  data() {
    return {
      options: [],
      tagNames: {},
      model: {
        category: '',
        search: '',
        search_fields: ['title'],
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('traffic.name'),
          prop: 'title',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('traffic.description'),
          prop: 'description',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('traffic.schemeCategory'),
          slot: 'category',
        },
        {
          label: this.$t('traffic.staticTraffic'),
          prop: 'background_flow_count',
        },
        {
          label: this.$t('traffic.dynamicTraffic'),
          prop: 'attack_flow_count',
        },
        {
          label: this.$t('common.createTime'),
          prop: 'create_time',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operate',
          width: 200,
        },
      ],
    };
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    /* 删除 */
    deleteSelectedRow(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.id);
        });
      }
      this.$request
        .delete('flow/collection/bulk_delete', [...ids], { baseURL: '/api/mp' })
        .then(() => {
          done();
          this.selection = [];
          this.$refs.tableListRef.reload();
        })
        .catch((err) => {
          this.$serverError(err);
        });
    },
    /* 编辑 */
    editRow(data) {
      const { id } = data;
      this.$router.push({
        path: `/admin/traffic/scheme/edit/${id}`,
      });
    },
    /* 流量管理 */
    manageRow(data) {
      const { id } = data;
      this.$router.push({
        path: `/admin/traffic/scheme/traffic/${id}`,
      });
    },
    trans,
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
      getOptionList().then((res) => {
        this.options = _.get(res, 'data.data', []);
        this.tagNames = this.getTagNames(this.options);
      });
    },
    //跳转到类型管理
    toType() {
      this.$router.push({ name: 'scheme-traffic-type-list' });
    },
  },
};
</script>
