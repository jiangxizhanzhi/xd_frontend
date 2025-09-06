<template>
  <cb-inner-page :background="false">
    <cb-auth-operation
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
      style="margin-left: 20px"
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
        <cb-button mr="mr" @click="onSubmit">{{
          $t('common.warrant')
        }}</cb-button>
        <cb-button @click="handleClick" buttonType="cancel">{{
          $t('common.cancel')
        }}</cb-button>
      </cb-button-group>
    </div>
  </cb-inner-page>
</template>
<script>
import { getOrganization } from '@/api/common';
import _ from 'lodash';
import Utils from '@/utils/util';
export default {
  components: {},
  props: {
    authIds: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      colorMap: [this.$themed('warning-color'), this.$themed('primary-color')],
      privateData: {},
      organizationOptions: [],
      defalutProps: {
        children: 'children',
        label: 'name',
      },
      url: '',
      queryName: {
        treeName: 'org',
        tableSearchName: 'username',
      },
      share_mode: 1,
      checkedPerson: [],
      selectData: [],
      columns: [
        {
          prop: 'username',
          title: this.$t('crEvent.uername'),
        },
        {
          prop: 'name',
          title: this.$t('crEvent.name'),
        },
        {
          slot: 'orgpaths',
          title: this.$t('crEvent.groupName'),
        },
        {
          none: true,
          title: this.$t('crEvent.role'),
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

  created() {
    this.url = `/auth/org_users/page/byorg/`;
    this.fetchOrgs();
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
      this.share_mode = Number(value);
    },
    fetchOrgs() {
      getOrganization().then((res) => {
        this.organizationOptions = _.get(res, 'data.data', []);
      });
    },
    // 查询授权操作
    getShares(id) {
      const that = this;
      this.$request
        .get('/admin/ce_base/cr_events/' + id + '/get_shares/')
        .then((res) => {
          const privateData = res.data;
          for (const ele of privateData.teachers) {
            ele.share = 0;
          }
          // privateData.share_mode = 1;
          // that.privateData = privateData;
          this.share_mode = res.data.share_mode;
          this.selectData = res.data.teachers;
        })
        .catch((ex) => {
          // msger.serverError(ex, this);
        });
    },
    // 提交记录
    onSubmit() {
      // debugger
      // this.$request
      //   .post('admin/ce_base/cr_events/batch_set_shares/', {
      //     share_mode: this.share_mode,
      //     share_teachers: this.checkedPerson,
      //     ids: this.authIds,
      //   })
      //   .then((res) => {
      //     this.$message({
      //       type: 'success',
      //       message: this.$t('common.operateSuccess'),
      //     });
      //     this.$emit('close', true);
      //   })
      //   .catch((error) => {
      //     // msger.serverError(error, this);
      //   });
      // 点击按钮授权操作之后的提交
      this.$request
        .post(
          '/admin/ceBase/crEvents/batchSetShares',
          {
            share_mode: this.share_mode,
            share_teachers: this.checkedPerson,
            ids: this.authIds,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('common.operateSuccess'),
          });
          this.$emit('close', true);
        })
        .catch((error) => {
          // msger.serverError(error, this);
        });
    },
    handleClick() {
      this.$emit('close', true);
    },
  },
};
</script>
<style scoped lang="scss">
.form-button-bar {
  margin-top: 20px;
}
.org-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
