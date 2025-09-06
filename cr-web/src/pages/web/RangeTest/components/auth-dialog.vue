<template>
  <cb-dialog
    :visible.sync="dialogVisible"
    :title="$t('test.addParticipants')"
    :before-close="beforeClose"
    width="1600px"
    height="600px"
  >
    <cb-auth-operation
      class="ml20"
      ref="operation"
      :props="defalutProps"
      :tree-data="organizationOptions"
      treeKey="id"
      rowKey="id"
      baseURL="/api/mp"
      url="/auth/org_users/page/byorg/front"
      :queryName="queryName"
      :columns="columns"
      :shareMode="share_mode"
      :select-data="selectData"
      @onChange="handleTableChange"
      @radioChange="getShareMode"
      :private-data="privateData"
    >
      <template v-slot:orgpaths="scope">
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
      </template>
    </cb-auth-operation>
    <div slot="footer">
      <cb-button-group space="middle">
        <cb-button @click="onSubmit" button-type="confirm"></cb-button>
        <cb-button @click="onCancel" button-type="cancel"></cb-button>
      </cb-button-group>
    </div>
  </cb-dialog>
</template>

<script>
import { getOrganization } from '@/api/common';

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // 授权类型
    authType: {
      type: Number,
      default: 1,
    },
    // 授权用户
    authUsers: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    authType: {
      handler(nv, ov) {
        this.share_mode = nv;
      },
      immediate: true,
    },
  },
  data() {
    return {
      checkedPerson: [], // 当前选中的数据
      selectData: [], // 当前选中的数据
      organizationOptions: [],
      privateData: {}, // 授权组件当前的radio选中值以及选中数据的信息，回显的时候需要用到
      share_mode: 1,
      defalutProps: {
        children: 'children',
        label: 'name',
      },
      queryName: {
        treeName: 'org',
        tableSearchName: 'username',
      },
      columns: [
        {
          prop: 'username',
          title: this.$t('test.username'),
        },
        {
          prop: 'name',
          title: this.$t('test.name'),
        },
        {
          slot: 'orgpaths',
          title: this.$t('test.organization'),
        },
        {
          none: true,
          title: this.$t('test.role'),
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
      colorMap: [this.$themed('orange-color'), this.$themed('primary-color')],
    };
  },
  created() {
    this.fetchOrgs();
  },
  mounted() {
    // 选中数据的回显
    this.$nextTick(() => {
      if (this.authUsers && this.authUsers.length > 0) {
        this.selectData = this.authUsers.map((item) => {
          return {
            id: item.id,
            name: item.name,
            orgpaths: item.orgpaths,
            username: item.username,
          };
        });
        this.checkedPerson = this.authUsers.map((item) => {
          return {
            id: item.id,
            name: item.name,
            orgpaths: item.orgpaths,
            username: item.username,
          };
        });
      }
    });
  },
  methods: {
    handleTableChange(value) {
      this.checkedPerson = value;
    },
    // 改变授权模式 指定授权人员或授权所有
    getShareMode(value) {
      this.$emit('update:authType', Number(value));
    },
    // 提交按钮
    onSubmit() {
      const authUsers = this.checkedPerson.map((item) => {
        return {
          id: item.id,
          name: item.name,
          orgpaths: item.orgpaths,
          username: item.username,
        };
      });
      this.$emit('update:authUsers', authUsers);
      this.beforeClose();
    },
    // 取消提交
    onCancel() {
      this.beforeClose();
    },
    // 关闭弹窗触发事件
    beforeClose() {
      this.$emit('update:dialogVisible', false);
    },

    // 获取组织结构
    fetchOrgs() {
      getOrganization()
        .then((res) => {
          this.organizationOptions = _.get(res, 'data.data', []);
        })
        .catch((err) => {
          this.$serverError(err);
        });
    },
    // 获取用户组织数据
    getLastList(data) {
      let arrTmp = [],
        orgList = _.get(data, 'orgpaths', []);
      if (orgList.length > 0) {
        arrTmp = orgList[orgList.length - 1];
      }
      return arrTmp;
    },
    // 设置组织层级颜色
    setColor(arr, index) {
      if (index < arr.length) {
        return arr[index];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.org-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
