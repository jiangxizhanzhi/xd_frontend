<template>
  <cb-inner-page class="author-operation" :background="false">
    <cb-auth-operation
      :shareMode="shareMode"
      :selectData="selectUsers"
      :treeData="treeData"
      :props="props"
      :columns="columns"
      :query-name="queryName"
      :baseURL="'/api/mp'"
      url="/auth/org_users/page/byorg/"
      treeKey="id"
      rowKey="id"
      @onChange="selectData"
      @radioChange="radioChange"
    >
      <template v-slot:orgpaths="scope">
        <div class="org-content" :title="getLastList(scope.data).join('/')">
          <span
            v-for="(item, index) in getLastList(scope.data)"
            :key="index + Math.random()"
          >
            <span v-show="index">/</span>
            <span :style="{ color: setColor(colorMap, index) }">{{
              item
            }}</span>
          </span>
        </div>
      </template>
    </cb-auth-operation>
    <div class="foot-btn">
      <cb-button mr @click="handleShare"
        ><i v-show="iconLoading" class="el-icon-loading"></i
        >{{ $t('device.share') }}</cb-button
      ><cb-button button-type="cancel" mr @click="handleCancle">{{
        $t('common.cancel')
      }}</cb-button>
    </div>
  </cb-inner-page>
</template>
<script>
import _ from 'lodash';
import { getOrganization } from '@/api/common';
import { getAuthorisedUsers, imageAuth } from '@/api/device/image';

import Utils from '@/utils/util';

export default {
  name: 'AuthorUser',
  props: {
    ids: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      colorMap: [this.$themed('warning-color'), this.$themed('primary-color')],
      iconLoading: false,
      treeData: [],
      queryName: {
        treeName: 'org',
        tableSearchName: 'username',
      },
      props: {
        children: 'children',
        label: 'name',
      },
      columns: [
        {
          title: this.$t('device.username'),
          prop: 'username',
        },
        {
          title: this.$t('device.fullName'),
          prop: 'name',
        },
        {
          title: this.$t('device.orgpath'),
          // prop: 'organization_name_all',
          slot: 'orgpaths',
        },
        {
          none: true,
          title: this.$t('device.role'),
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
      selectUsers: [], // 选择的用户数据
      shareMode: 1,
    };
  },
  created() {
    // 授权模式  接口要求 2全部，1自定义 ；组件返回值是 2自定义，1全部
    let mode = this.$route.query.shareMode;
    if (mode === 2) {
      this.shareMode = 1;
    } else if (mode === 1) {
      this.shareMode = 2;
    } else {
      this.shareMode = 1;
    }

    // 获取树数据
    getOrganization().then((res) => {
      this.treeData = res.data.data;
    });
    // 获取已选择的用户
    if (_.get(this.$route, 'query.resource_id', '')) {
      const params = {
        uuid: this.$route.query.resource_id,
      };
      getAuthorisedUsers(params).then((res) => {
        const data = _.get(res, 'data.data', []);
        if (data && data.length > 0) {
          this.selectUsers = data;
        } else {
          this.selectUsers = [];
        }
      });
    }
  },
  computed: {},
  methods: {
    getLastList(data) {
      return Utils.getLastOrgList(data);
    },
    setColor(arr, index) {
      return Utils.setDifferentColor(arr, index);
    },
    // 取消
    handleCancle() {
      if (this.ids && this.ids.length > 0) {
        this.$emit('changeVisible', false);
      } else {
        this.$router.push({ name: 'image-manage' });
      }
    },
    // 获取表格选择的数据
    selectData(data) {
      this.selectUsers = data;
    },
    // 授权按钮
    handleShare() {
      const user_ids = this.filterUsers(this.selectUsers);
      let is_all_public = '1';
      if (this.shareMode === 1) {
        // 1代表所有
        is_all_public = '2';
      } else if (this.shareMode === 2 && user_ids.length > 0) {
        is_all_public = '1';
      } else if (this.shareMode === 2 && !user_ids.length) {
        is_all_public = '0';
      }
      this.iconLoading = true;
      const params = {
        uuids:
          this.ids && this.ids.length > 0
            ? this.ids
            : [this.$route.query.resource_id],
        is_all_public,
        user_ids: this.shareMode === 1 ? [] : user_ids,
      };
      imageAuth(params).then((res) => {
        this.iconLoading = false;
        this.$message.success(this.$t('device.athorSuccess'));
        this.handleCancle();
      });
    },
    // 获取授权模式
    radioChange(value) {
      this.shareMode = Number(value);
    },
    // 过滤用户组信息- 后端只接受resource_id
    filterUsers(usersData) {
      let users = [];
      _.isEmpty(usersData)
        ? ''
        : usersData.forEach((item) => {
            users.push(item.id);
          });
      return users;
    },
  },
};
</script>

<style lang="scss" scoped>
.foot-btn {
  text-align: center;
  margin-top: 20px;
}
.author-operation {
  .org-content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
