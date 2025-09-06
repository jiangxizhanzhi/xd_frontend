<template>
  <cb-inner-page>
    <cb-auth-operation
      class="ml20"
      ref="operation"
      :props="defalutProps"
      :tree-data="organizationOptions"
      treeKey="id"
      rowKey="id"
      :url="url"
      :queryName="queryName"
      baseURL="/api/mp"
      :columns="columns"
      :shareMode="share_mode"
      :select-data="selectData"
      @onChange="handleTableChange"
      @radioChange="getShareMode"
      :private-data="privateData"
      ><template v-slot:orgpaths="scope">
        <div class="org-content" :title="getLastList(scope.data).join('/')">
          <span
            v-for="(item, index) in getLastList(scope.data)"
            :key="index + Math.random()"
            ><span v-show="index">/</span
            ><span :style="{ color: setColor(colorMap, index) }">{{
              item
            }}</span></span
          >
        </div>
      </template></cb-auth-operation
    >
    <div class="form-button-bar">
      <cb-button-group space="middle">
        <cb-button mr="mr" @click="onSubmit">{{ $t('m.warrant') }}</cb-button>
        <cb-button @click="onCnacle" buttonType="cancel">{{
          $t('button.cancel')
        }}</cb-button>
      </cb-button-group>
    </div>
  </cb-inner-page>
</template>
<script>
import Http from '@/utils/http.js';
import _ from 'lodash';
import { getOrganization } from '@/api/common';
import Utils from '@/utils/utils';

export default {
  components: {},
  data() {
    return {
      colorMap: [this.$themed('orange-color'), this.$themed('primary-color')],
      privateData: {},
      selectData: [],
      url: '',
      queryName: {
        treeName: 'org',
        tableSearchName: 'username',
      },
      share_mode: 1,
      organizationOptions: [],
      checkedPerson: [],
      defalutProps: {
        children: 'children',
        label: 'name',
      },
      columns: [
        {
          prop: 'username',
          title: this.$t('m.username'),
        },
        {
          prop: 'name',
          title: this.$t('m.name'),
        },
        {
          slot: 'orgpaths',
          title: this.$t('m.organization'),
        },
        {
          none: true,
          title: this.$t('m.role'),
          getData: (row) => {
            const { roles } = row;
            const list = [];
            roles.forEach((item) => {
              list.push(item.name);
            });
            return list.join('/');
          },
        },
      ],
    };
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params.exercisesId;
    this.fetchOrgs();
    // this.getUser()
    this.getShares();
    this.url = `/auth/org_users/page/byorg/`;
  },
  methods: {
    getLastList(data) {
      return Utils.getLastOrgList(data);
    },
    setColor(arr, index) {
      return Utils.setDifferentColor(arr, index);
    },
    handleTableChange(value) {
      const arr = [];
      value.map((item) => {
        arr.push(item.id);
      });
      this.checkedPerson = arr;
    },
    getShareMode(value) {
      this.share_mode = value;
    },
    fetchOrgs() {
      getOrganization()
        .then((res) => {
          this.organizationOptions = _.get(res, 'data.data', []);
        })
        .catch((err) => {
          this.$serverError(err);
        });
    },
    // 查询授权操作
    getShares() {
      this.$request
        .get(
          '/oj/admin/practice/set/get_share',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.privateData = _.get(res, 'data.data', {});
          this.share_mode = _.get(res, 'data.data.operation_auth_type', 1);
          this.selectData =
            _.get(res, 'data.data.operation_auth_ids', []) == null
              ? []
              : _.get(res, 'data.data.operation_auth_ids', []);
          this.checkedPerson = this.selectData.map((item) => item.id);
        });
    },
    // 提交记录
    onSubmit() {
      this.$request
        .patch(
          '/oj/admin/practice/set/batch-share',
          {
            operation_auth_type: this.share_mode,
            operation_auth_ids: this.checkedPerson,
            resource_ids: [this.resource_id],
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          this.$router.push({ name: 'exercises' });
        });
    },
    // 取消删除
    onCnacle() {
      this.$router.push({ name: 'exercises' });
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .cb-search-table .ant-table .ant-table-thead > tr > th {
  padding: 12px 5px !important;
}
.form-button-bar {
  margin-top: 20px;
}
.org-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
