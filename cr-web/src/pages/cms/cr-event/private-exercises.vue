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
        <cb-button @click="onCnacle" buttonType="cancel">{{
          $t('common.cancel')
        }}</cb-button>
      </cb-button-group>
    </div>
  </cb-inner-page>
</template>
<script>
import _ from 'lodash';
import { getOrganization } from '@/api/common';
import Utils from '@/utils/util';

export default {
  components: {},
  data() {
    return {
      colorMap: [this.$themed('warning-color'), this.$themed('primary-color')],
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
  computed: {},
  created() {
    this.eventId = this.$route.params.eventId;
    this.resourceId = this.$route.params.resourceId;
    this.fetchOrgs();
    // this.getUser()
    this.getShares(this.$route.params.resourceId);
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
      this.share_mode = Number(value);
    },
    fetchOrgs() {
      getOrganization().then((res) => {
        this.organizationOptions = _.get(res, 'data.data', []);
      });
    },
    // 查询授权操作
    getShares(id) {
      this.$request
        .get(
          '/admin/ceBase/crEvents/getShares',
          { resource_id: id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.privateData = res.data.data;
          this.share_mode = res.data.data.share_mode;
          let data = _.get(res, 'data.data.teachers', []) || [];
          data.forEach((item) => {
            item.orgpaths = [];
            let organizationNameAll = item.organization_name_all;
            if (organizationNameAll) {
              organizationNameAll = organizationNameAll.split('/');
              item.orgpaths = [organizationNameAll];
            }
          });
          this.selectData = data;
          this.checkedPerson = _.map(data, (item) => {
            return item.id;
          });
        })
        .catch(() => {});
    },
    // 提交记录
    onSubmit() {
      // 修改授权之后提交
      //  this.$request
      //   .post('admin/ce_base/cr_events/batch_set_shares/', {
      //     share_mode: this.share_mode,
      //     share_teachers: this.checkedPerson,
      //     ids: [this.resourceId],
      //   })
      //   .then((res) => {
      //     this.$message({
      //       type: 'success',
      //       message: this.$t('common.operateSuccess'),
      //     });
      //     this.goto();
      //   })
      //   .catch((error) => {
      //     this.$message.error(error.response.data.name[0].message);
      //   });
      this.$request
        .post(
          '/admin/ceBase/crEvents/batchSetShares',
          {
            share_mode: this.share_mode,
            share_teachers: this.checkedPerson,
            ids: [this.resourceId],
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('common.operateSuccess'),
          });
          this.goto();
        })
        .catch((error) => {
          this.$message.error(error.response.data.name[0].message);
        });
    },
    // 取消删除
    onCnacle() {
      this.goto();
    },
    // 跳转
    goto() {
      if (this.$route.name === 'event-auth-single') {
        // 单兵训练
        this.$router.push({ path: '/admin/event/list-train-single' });
      } else if (this.$route.name === 'event-auth-team') {
        // 团队训练
        this.$router.push({ path: '/admin/event/list-train-team' });
      } else {
        // 红蓝对抗
        this.$router.push({ name: 'red-blue' });
      }
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
