<template>
  <cb-inner-page :background="true" title="用户管理" v-loading="loading">
    <div style="display: flex; height: 100%">
      <left-tree
        :url="treeUrl"
        :left-tree-style="leftTreeStyle"
        :tree-style="treeStyle"
        :scrollbar-style="scrollbarStyle"
        :default-props="defaultProps"
        :node-action-show="true"
        @getResourceId="getResourceId"
      >
      </left-tree>
      <cb-search-table
        :scroll="{ y: 550 }"
        :cols="cols"
        :selector="selector"
        :selection.sync="selection"
        :url="userUrl"
        :baseURL="baseURL"
        :data.sync="model"
        ref="userListRef"
        :searchBarBg="true"
      >
        <!--  -->
        <template v-slot:search>
          <cb-button
            button-type="add"
            link-name="user-add"
            :disabled="notAdminDisabled"
          ></cb-button>
          <cb-button
            button-type="delete"
            hollow
            @click="deleteSelectedUsers(selection, $event)"
            :disabled="selection.length === 0 || notAdminDisabled"
          ></cb-button>
          <cb-button
            button-type="disable"
            color-type="yellow"
            hollow
            :warnMsg="disabledWarnMsg"
            :completeMsg="disabledCompleteMsg"
            @click="disableSelectedUsers(selection, $event, 2)"
            :disabled="selection.length === 0 || notAdminDisabled"
            >{{ $t('systemManagement.userManage.disable') }}</cb-button
          >
          <cb-button
            icon="icon-shuaxin"
            hollow
            :warnMsg="recoverWarnMsg"
            :completeMsg="recoverCompleteMsg"
            @click="disableSelectedUsers(selection, $event, 3)"
            :disabled="selection.length === 0 || notAdminDisabled"
            >{{ $t('systemManagement.userManage.recover') }}</cb-button
          >
          <cb-upload
            accept=".xls,.xlsx"
            action=""
            :show-file-list="false"
            :http-request="importUser"
            :disabled="notAdminDisabled"
          >
            <cb-button
              button-type="import"
              hollow
              :disabled="notAdminDisabled"
            ></cb-button>
          </cb-upload>
          <cb-button
            @click="downloadTemp()"
            hollow
            :disabled="notAdminDisabled"
          >
            <cb-iconfont type="icon-xiazai"></cb-iconfont>
            {{ $t('systemManagement.userManage.downloadTemp') }}
          </cb-button>
          <cb-button
            :disabled="notAdminDisabled"
            hollow
            button-type="export"
            @click="exportUser(selection)"
          ></cb-button>
        </template>
        <template v-slot:filter>
          <cb-search-input
            v-model="model.username"
            :placeholder="$t('systemManagement.userManage.inputUserNameOrName')"
          ></cb-search-input>
        </template>
        <template v-slot:logo="scope">
          <img
            :src="scope.data.avatar"
            width="48"
            height="48"
            style="border-radius: 50%"
          />
        </template>
        <template v-slot:orgpaths="scope">
          <div class="span-content" :title="getLastList(scope.data).join('/')">
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
        <template v-slot:operate="scope">
          <cb-button
            :disabled="notAdminDisabled || isOtherAdmin(scope.data)"
            @click="editRow(scope.data)"
            type="text"
            buttonType="edit"
            mr
          ></cb-button>
          <cb-button
            :disabled="notAdminDisabled || isOtherAdmin(scope.data)"
            type="text"
            @click="resetPassword(scope.data)"
            mr
            >{{ $t('systemManagement.userManage.resetPasswords') }}</cb-button
          >
          <cb-button
            mr
            v-show="userCheck"
            :disabled="scope.data.is_audited === 1"
            type="text"
            @click="checkRow(scope.data)"
          >
            <!-- <cb-iconfont type="icon-piliangshouquanfangwen"></cb-iconfont> -->
            {{ $t('systemManagement.userManage.check') }}
          </cb-button>
          <cb-button type="text" @click="recentRow(scope.data)">
            {{ $t('systemManagement.userManage.recentOperation') }}
          </cb-button>
        </template>
      </cb-search-table>
    </div>

    <!-- 重置密码弹框 -->
    <cb-dialog
      :title="$t('systemManagement.userManage.enterPasswords')"
      center
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <cb-form :model="form" :rules="rules" ref="formRef">
        <cb-form-item
          :label="$t('systemManagement.userManage.newPasswords')"
          label-width="110px"
          prop="new_pwd"
        >
          <cb-input v-model="form.new_pwd" type="text"></cb-input>
        </cb-form-item>
      </cb-form>
      <div slot="footer" class="dialog-footer">
        <cb-button buttonType="confirm" @click="submitForm" mr></cb-button>
        <cb-button
          buttonType="cancel"
          @click="dialogFormVisible = false"
        ></cb-button>
      </div>
    </cb-dialog>
    <!-- 最近操作弹框 -->
    <cb-dialog
      width="800px"
      :title="recentName + $t('systemManagement.userManage.recentOperation')"
      center
      :visible.sync="dialogRecentVisible"
    >
      <cb-search-table
        :scroll="{ y: 480 }"
        :cols="colsOperation"
        :url="recentUrl"
        :baseURL="baseURL"
        :data="recentModel"
        show-less-items
        ref="recentOperationRef"
        :searchBarBg="false"
      >
        <template v-slot:recentAction="scope">
          {{ `${scope.data.op_type}：${scope.data.op_target}` }}
        </template>
      </cb-search-table>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import LeftTree from '@/components/left-tree';
import {
  deleteUser,
  disableUser,
  importExcelUser,
  downloadExcelTemplate,
  exportExcelUser,
  resetPassword,
} from '@/api/user';
import Utils from '@/utils/utils';
import { encryptPsw, getSysSettings } from '@cyber/helper';

export default {
  name: 'UserList',
  components: {
    LeftTree,
  },
  data() {
    // 重置密码校验
    const validatePassword = (rule, value, callback) => {
      const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/g;
      if (valid.test(value)) {
        callback();
      } else {
        callback(new Error(this.$t('systemManagement.userManage.passwordLen')));
      }
    };
    return {
      treeUrl: '/auth/orgs/tree',
      userUrl: '/auth/org_users/page/byorg',
      baseURL: '/api/mp',
      disableUrl: '/auth/users/disable',
      enableUrl: '/auth/users/enable',
      userCheck: false,
      loading: false,
      leftTreeStyle: {
        marginRight: '16px',
      },
      treeStyle: {
        width: '200px',
      },
      scrollbarStyle: {
        height: '765px',
      },
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      model: {
        username: '',
        org: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('systemManagement.userManage.headPortrait'),
          slot: 'logo',
          width: 110,
        },
        {
          label: this.$t('systemManagement.userManage.userName'),
          prop: 'username',
          width: 110,
        },
        {
          label: this.$t('systemManagement.userManage.name'),
          prop: 'name',
          width: 110,
        },
        {
          label: this.$t('systemManagement.userManage.orgnizationName'),
          slot: 'orgpaths',
        },
        {
          label: this.$t('systemManagement.userManage.role'),
          getData: (row) => {
            const { roles } = row;
            const list = [];
            roles.forEach((item) => {
              list.push(item.name);
            });
            return list.join('/');
          },
        },
        {
          label: this.$t('systemManagement.userManage.status'),
          getData: (row) => {
            /* 优先级：禁用->过期->待审核->正常 */
            const { is_enabled, is_audited, is_expired } = row;
            if (!is_enabled) {
              return this.$t('systemManagement.userManage.disable');
            }
            if (is_expired) {
              return this.$t('systemManagement.userManage.stale');
            }
            if (!is_audited) {
              return this.$t('systemManagement.userManage.checkPending');
            }
            if (is_enabled) {
              return this.$t('systemManagement.userManage.normal');
            }
          },
          width: 80,
        },
        {
          label: this.$t('systemManagement.userManage.action'),
          slot: 'operate',
          width: '330px',
        },
      ],
      disabledWarnMsg: this.$t(
        'systemManagement.userManage.disableSelectedName',
      ),
      recoverWarnMsg: this.$t(
        'systemManagement.userManage.recoverSelectedUser',
      ),
      disabledCompleteMsg: this.$t(
        'systemManagement.userManage.disableSuccessfully',
      ),
      recoverCompleteMsg: this.$t(
        'systemManagement.userManage.recoverSuccessfully',
      ),
      dialogFormVisible: false,
      recentName: '',
      dialogRecentVisible: false,
      form: {
        new_pwd: '',
      },
      rules: {
        new_pwd: [
          {
            required: true,
            message: this.$t('systemManagement.userManage.enterPasswords'),
            trigger: 'blur',
          },
          { validator: validatePassword, trigger: 'blur' },
        ],
      },
      colsOperation: [
        {
          label: this.$t('systemManagement.userManage.action'),
          slot: 'recentAction',
        },
        {
          label: this.$t('systemManagement.userManage.actionTime'),
          prop: 'op_time',
          width: 180,
        },
      ],
      recentUrl: '',
      recentModel: {
        userId: '',
        modulesIgnored: 4,
      },
      user_id: '',
      colorMap: [this.$themed('orange-color'), this.$themed('primary-color')],
      orgStrHint: '',
      roleList: [],
      notAdminDisabled: false,
    };
  },
  created() {
    // 判断用户审核权限
    getSysSettings().then((res) => {
      const resData = _.get(res, 'data.data', []);
      let user_audit = (_.find(resData, { key_name: 'user_audit' }) || {})
        .value;
      if (user_audit === '1') {
        this.userCheck = true;
      } else {
        this.userCheck = false;
      }
    });
  },
  mounted() {
    // 普通用户没有新增、删除、禁用等操作
    let is_admin = _.get(this.$store.state.user, 'is_admin', 1),
      is_super_user = _.get(this.$store.state.user, 'is_super_user', 1);
    if (is_admin === 0 && is_super_user === 0) {
      this.notAdminDisabled = true;
    }
  },
  methods: {
    // 当前登录用户是管理员不能操作其他管理员，如：编辑、重置密码
    isOtherAdmin(data) {
      const { is_admin, is_super_user, id } = data;
      let is_admin_self = _.get(this.$store.state.user, 'is_admin', 1),
        is_super_user_self = _.get(this.$store.state.user, 'is_super_user', 1),
        id_self = _.get(this.$store.state.user, 'id', '');
      if (is_admin_self && !is_super_user_self && id !== id_self && is_admin) {
        return true;
      }
    },
    /* 点击左侧树获取id */
    getResourceId(v) {
      this.model.org = v;
    },

    // 删除所选用户
    deleteSelectedUsers(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.id);
        });
        // 部分操作权限设置
        let index = data.findIndex((item) => {
          return item.is_super_user;
        });
        if (index > -1) {
          this.$message.error(
            this.$t('systemManagement.userManage.otherAdmin'),
          );
          done(false);
          return;
        }
      }
      deleteUser([...ids])
        .then(() => {
          done();
          this.selection = [];
          this.$refs.userListRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 禁用、恢复
    disableSelectedUsers(data, done, type) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.id);
        });
        // 部分操作权限限制
        let index = data.findIndex((item) => {
          return item.is_super_user;
        });
        if (index > -1) {
          this.$message.error(
            this.$t('systemManagement.userManage.otherAdmin'),
          );
          done(false);
          return;
        }
      }
      let url = '';
      if (type === 2) {
        url = this.disableUrl;
      } else if (type === 3) {
        url = this.enableUrl;
      }
      disableUser(url, [...ids])
        .then(() => {
          done();
          this.selection = [];
          this.$refs.userListRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 导入
    importUser(file) {
      this.loading = true;
      const formData = new FormData();
      formData.append('file', file.file);
      importExcelUser(formData)
        .then((_) => {
          this.loading = false;
          this.$message.success(
            this.$t('systemManagement.userManage.uploadSuccess'),
          );
          this.$refs.userListRef.reload();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 下载模板
    downloadTemp() {
      downloadExcelTemplate().then((res) => {
        this.$request.download(
          new Blob([res.data]),
          `${this.$t('systemManagement.userManage.userList')}.xlsx`,
        );
      });
    },
    // 导出
    exportUser(selection) {
      const ids = [];
      if (selection.length > 0) {
        selection.forEach((item) => {
          ids.push(item.id);
        });
      }
      const params = {
        ids,
        ...this.model,
      };
      exportExcelUser(params).then((res) => {
        this.$request.download(
          new Blob([res.data]),
          `${this.$t('systemManagement.userManage.userList')}.xlsx`,
        );
      });
    },
    // 编辑
    editRow(data) {
      const { id } = data;
      this.$router.push({
        path: '/admin/user-management/edit',
        query: {
          id,
        },
      });
    },
    // 审核
    checkRow(data) {
      const { id } = data;
      this.$router.push({
        path: '/admin/user-management/check',
        query: {
          id,
        },
      });
    },
    // 重置密码弹框
    resetPassword(data) {
      this.user_id = data.id;
      this.form.new_pwd = '';
      this.dialogFormVisible = true;
    },
    // 最近操作
    recentRow(data) {
      this.recentName = data.username;
      this.dialogRecentVisible = true;
      this.recentModel.userId = data.id;
      this.recentUrl = '/devops/log/operate/page';
    },
    // 重置密码提交
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let { new_pwd } = this.form;
          new_pwd = encryptPsw(new_pwd);
          const params = {
            new_pwd,
            user_id: this.user_id,
          };
          resetPassword(params).then(() => {
            this.$message.success(
              this.$t('systemManagement.userManage.resetPasswordsSuc'),
            );
            this.dialogFormVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    getLastList(data) {
      return Utils.getLastOrgList(data);
    },

    setColor(arr, index) {
      return Utils.setDifferentColor(arr, index);
    },
  },
};
</script>

<style lang="scss" scoped>
.span-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cb-dialog {
  .cb-form {
    .el-form-item {
      ::v-deep .el-form-item__error {
        word-break: keep-all;
      }
    }
  }
}
</style>
