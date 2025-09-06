<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      :url="url"
      baseURL="/api/mp"
      row-key="resource_id"
      :data.sync="model"
      ref="tableListRef"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="dynamic-traffic-create"
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
          :placeholder="$t('traffic.pleaseInput')"
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
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import '@/lang/all-lang/index';
import { trans } from '@/lang';
import { getOptionList } from '@/api/traffic/traffic';
export default {
  name: 'TrafficList',
  data() {
    return {
      options: [],
      tagNames: {},
      url: '/flow/info/page',
      model: {
        category: '',
        search: '',
        interactive_type: 1,
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
          prop: 'introduction',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('table.type'),
          slot: 'category',
        },
        {
          label: this.$t('common.createTime'),
          prop: 'create_time',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operate',
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
    /* 编辑 */
    editRow(data) {
      const { resource_id } = data;
      this.$router.push({
        path: `/admin/traffic/intelligent/edit/${resource_id}`,
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
      this.$router.push({ name: 'dynamic-traffic-type-list' });
    },
  },
};
</script>

<style scoped></style>
