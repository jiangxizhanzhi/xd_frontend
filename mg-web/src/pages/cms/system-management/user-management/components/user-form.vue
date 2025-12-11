<template>
  <cb-inner-page :background="true" title="用户管理">
    <cb-form
      ref="elFormRef"
      label-position="right"
      label-width="100px"
      :model.sync="model"
      :rules="rules"
      :fetchPromise="fetchUserForm"
      :isBgColor="true"
    >
      <cb-form-item
        :label="$t('systemManagement.userManage.userName')"
        prop="username"
      >
        <cb-input
          :disabled="actionType === 2"
          v-model="model.username"
        ></cb-input>
      </cb-form-item>
      <cb-form-item :label="$t('systemManagement.userManage.name')" prop="name">
        <cb-input v-model="model.name"></cb-input>
      </cb-form-item>
      <cb-form-item
        v-if="actionType !== 2"
        :label="$t('systemManagement.userManage.password')"
        prop="password"
      >
        <cb-input
          class="password-box"
          v-model="model.password"
          type="password"
          show-password
        >
        </cb-input>
      </cb-form-item>
      <cb-form-item
        :label="$t('systemManagement.userManage.organization')"
        prop="org_ids"
      >
        <cb-cascader
          style="width: 420px"
          v-model="organizationSet"
          :options="organizationOptions"
          :props="optionProps"
          @change="handleChange"
          clearable
        />
      </cb-form-item>
      <cb-form-item
        :label="$t('systemManagement.userManage.headPortrait')"
        prop="avatar"
        style="margin-bottom: 10px"
      >
        <cb-upload
          class="image-upload"
          action=""
          :show-file-list="false"
          :http-request="upLoad"
          accept=".png,.jpg,.jpeg"
        >
          <div>
            <div class="logo">
              <img v-show="model.avatar" :src="model.avatar" alt="" />
              <cb-button :hollow="true" button-type="import"></cb-button>
            </div>
          </div>
        </cb-upload>
      </cb-form-item>
      <cb-form-item>
        <div class="list-all">
          <span class="default-header">{{
            $t('systemManagement.userManage.chooseDefaultLogo')
          }}</span>
          <div class="logo-list">
            <div class="logo-item" v-for="item in defaultImgs" :key="item.id">
              <img
                class="default-logos"
                :src="item.url"
                @click.stop="changeLogo(item.url)"
              />
            </div>
          </div>
        </div>
      </cb-form-item>
      <cb-form-item
        v-if="!editOneself"
        :label="$t('systemManagement.roleManage.role')"
        prop="role_ids"
      >
        <cb-select
          style="width: 100%"
          v-model="roleIdList"
          :options="roleList"
          multiple
          filterable
        />
      </cb-form-item>
      <cb-form-item
        v-if="editOneself"
        :label="$t('systemManagement.roleManage.role')"
      >
        <span class="disabled-role-list">{{ disabledRoleList }}</span>
      </cb-form-item>
      <cb-form-item
        :label="$t('systemManagement.userManage.signature')"
        prop="description"
      >
        <cb-input v-model="model.description" type="textarea"></cb-input>
      </cb-form-item>
      <cb-form-item
        :label="$t('systemManagement.userManage.userOverdueDate')"
        prop="expired_time"
      >
        <cb-date-picker
          v-model="model.expired_time"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('systemManagement.userManage.chooseDate')"
        >
        </cb-date-picker>
      </cb-form-item>
      <template slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button
            v-if="actionType !== 2"
            buttonType="confirm"
            @click="submitForm"
          ></cb-button>
          <cb-button
            v-if="actionType === 2"
            buttonType="confirm"
            @click="submitForm"
            >{{ $t('systemManagement.userManage.approved') }}</cb-button
          >
          <cb-button buttonType="cancel" @click="resetForm"></cb-button>
        </cb-button-group>
      </template>
    </cb-form>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import {
  getOrgData,
  getRoleData,
  addEditUser,
  avatarUpload,
  echoUserMessage,
  getDefaultLogo,
} from '@/api/user';
import { encryptPsw } from '@cyber/helper';
import Utils from '@/utils/utils';

export default {
  name: 'UserForm',
  props: {
    id: {
      type: String,
      default: '',
    },
    actionType: {
      type: Number,
      default: 2,
    },
  },
  computed: {},
  data() {
    /* 验证title字符串的长度(包含'_','-') */
    const validateLength = (str) => {
      let sum = 0;
      const value = str.trim();
      const cn_re = /[\u4e00-\u9fa5]/;
      for (let s = 0; s < value.length; s++) {
        if (cn_re.test(value[s])) {
          sum = sum + 1;
        } else {
          sum = sum + 1;
        }
      }
      return sum;
    };
    /* 验证title字段的长度在[2，20]之间 */
    const validateTitleLength = (rule, value, callback) => {
      const sum = validateLength(value);
      if (sum < 2 || sum > 20) {
        callback(
          new Error(this.$t('systemManagement.userManage.inputNameLength')),
        );
      } else {
        callback();
      }
    };
    /* 禁止空格输入 */
    const forbiddenSpaces = (rule, value, callback) => {
      if (/\s/.test(value)) {
        callback(new Error());
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (this.id && !value) {
        callback();
      } else {
        if (value === '') {
          callback(
            new Error(this.$t('systemManagement.userManage.passwordInput')),
          );
        } else {
          const valid = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/g;
          if (valid.test(value)) {
            callback();
          } else {
            callback(
              new Error(this.$t('systemManagement.userManage.passwordLen')),
            );
          }
        }
      }
    };

    return {
      roleIdList: [],
      roleListEdit: [],
      disabledRoleList: '',
      defaultImgs: [],
      model: {
        username: '',
        name: '',
        password: '',
        org_ids: [],
        avatar: '',
        role_ids: [],
        description: '',
        expired_time: null,
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('systemManagement.userManage.usernameInput'),
            trigger: 'blur',
          },
          {
            min: 2,
            max: 20,
            message: '用户名长度在2-20之间',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: this.$t('systemManagement.userManage.nameInput'),
            trigger: 'blur',
          },
          {
            min: 2,
            max: 20,
            message: '姓名长度在2-20之间',
            trigger: 'blur',
          },
        ],
        role_ids: [
          {
            required: true,
            message: this.$t('systemManagement.userManage.validateRole'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: !this.id,
            message: this.$t('systemManagement.userManage.passwordInput'),
            trigger: 'blur',
          },
          { validator: validatePassword, trigger: 'blur' },
          {
            validator: forbiddenSpaces,
            message: this.$t('systemManagement.userManage.containSpaces'),
            trigger: 'blur',
          },
        ],
        org_ids: [
          {
            required: true,
            message: this.$t(
              'systemManagement.userManage.organizationCannotBeEmpty',
            ),
            trigger: 'blur, change',
          },
        ],

        description: [
          {
            min: 0,
            max: 1000,
            message: this.$t('systemManagement.userManage.signatureLength'),
            trigger: 'blur',
          },
        ],
      },
      organizationSet: [],
      organizationOptions: [],
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      url: '',
      roleList: [],
      editOneself: false, // 编辑自己时，角色不可修改
    };
  },
  watch: {
    organizationSet(val) {
      if (val && val.length > 0) {
        this.model.org_ids = [val[val.length - 1]];
      } else {
        this.model.org_ids = [];
      }
    },
  },
  mounted() {
    let userId = _.get(this.$store.state.user, 'id', '');
    if (userId === this.id) {
      this.editOneself = true;
    }
    this.getDefaultHeader();
    this.getUserData();
  },
  methods: {
    // 获取默认头像列、组织树、角色列数据及编辑时的回显数据
    getUserData() {
      Promise.all([getRoleData('name'), getOrgData()]).then(
        ([roleData, orgData]) => {
          this.getRoleList(roleData);
          this.fetchOrgs(orgData);
          if (this.id) {
            echoUserMessage(this.id).then((res) => {
              this.editBack(res);
            });
          }
        },
      );
    },
    /* 获取角色 */
    getRoleList(res) {
      const data = _.get(res, 'data.data', []);
      const list = data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      this.roleList = [...list];
    },
    /* 获取组织 */
    fetchOrgs(res) {
      this.organizationOptions = _.get(res, 'data.data', []);
    },
    /* 编辑回显 */
    editBack(resp) {
      let data = _.get(resp, 'data.data', {});
      let {
        username,
        name,
        org_ids,
        avatar,
        roles: role_ids,
        description,
        expired_time,
      } = data;
      let roleIdList = [],
        roleNameList = [];
      role_ids.forEach((item) => {
        roleIdList.push(item.id);
        roleNameList.push(item.name);
      });
      this.disabledRoleList = roleNameList.join('，');
      if (org_ids.length > 0) {
        this.organizationSet = Utils.buildCascaderValue(
          this.organizationOptions,
          org_ids[org_ids.length - 1],
        );
      } else {
        org_ids = [];
      }

      this.roleIdList = roleIdList;
      this.model.role_ids = roleIdList;
      this.model = {
        username,
        name,
        password: '',
        org_ids,
        avatar,
        role_ids,
        description,
        expired_time,
      };
    },

    handleChange(value) {
      if (value && value.length > 0) {
        this.model.org_ids = [value[value.length - 1]];
      } else {
        this.model.org_ids = [];
      }
    },

    // 获取默认头像列表
    getDefaultHeader() {
      getDefaultLogo().then((res) => {
        const list = res.data.data;
        const logoList = list.map((item) => {
          return {
            url: item,
            name: item,
            key: item,
          };
        });
        this.defaultImgs = logoList;
      });
    },

    /* 变更头像 */
    changeLogo(url) {
      this.model.avatar = url;
    },
    upLoad(file) {
      const size = file.file.size / (1024 * 1024);
      if (size <= 0 || size > 2) {
        this.$error(this.$t('systemManagement.system.uploadImageSize'));
        return false;
      }
      const formData = new FormData();
      formData.append('file', file.file);
      avatarUpload(formData).then((res) => {
        this.model.avatar = _.get(res, 'data.data', '') || '';
      });
    },
    fetchUserForm() {
      const model = _.cloneDeep(this.model);
      model.expired_time = model.expired_time
        ? model.expired_time.replace(/00:00:00/g, '23:59:59')
        : null;
      if (model.password) {
        model.password = encryptPsw(model.password);
      }
      if (this.id) {
        let params = {};
        if (this.actionType === 1) {
          /* 编辑 */
          params = { ...model, id: this.id };
        } else if (this.actionType === 2) {
          /* 审核 */
          delete model.password;
          params = {
            ...model,
            id: this.id,
            is_audited: 1,
          };
        }
        this.url = '/auth/users/modify';
        return addEditUser(this.url, params).then(() => {
          this.$router.push({
            path: '/admin/system-management/user-management',
          });
        });
      } else {
        /* 新增 */
        let params = { ...model };
        this.url = '/auth/users/add';
        return addEditUser(this.url, params).then(() => {
          this.$router.push({
            path: '/admin/system-management/user-management',
          });
        });
      }
    },
    // 新增、编辑、审核提交
    submitForm() {
      this.model.role_ids = [...this.roleIdList];
      this.$refs.elFormRef.submit();
    },
    resetForm() {
      this.$router.push({ path: '/admin/system-management/user-management' });
    },
  },
};
</script>
<style scoped>
.image-upload /deep/ .el-upload {
  text-align: left;
}
</style>
<style lang="scss" scoped>
.logo {
  img {
    width: 70px;
    height: 70px;
    margin-right: 20px;
    border-radius: 35px;
    background-color: var(--bg-color-3);
  }
}
.list-all {
  background-color: var(--bg-color-2);
  padding: 12px 20px 22px 20px;
}
.logo-list {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 10px;
  margin-top: 5px;
  .logo-item {
    width: 70px;
    height: 70px;
    margin-right: 35px;
    cursor: pointer;
    border-radius: 35px;
    background-color: var(--bg-color-3);
    .default-logos {
      width: 100%;
      height: 100%;
      border-radius: 35px;
    }
  }
}
.default-header {
  color: var(--neutral5);
  text-align: left;
}
.disabled-role-list {
  color: var(--neutral5);
}
::v-deep .password-box .el-input__suffix-inner i {
  color: var(--primary-color);
  line-height: 34px;
}
</style>
