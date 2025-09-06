<template>
  <div>
    <cb-form
      ref="roleFormRef"
      label-position="right"
      label-width="80px"
      :model.sync="model"
      :rules="rules"
      :isBgColor="true"
    >
      <cb-form-item :label="$t('systemManagement.roleManage.role')" prop="name">
        <cb-input
          v-model.trim="model.name"
          :placeholder="$t('systemManagement.roleManage.enterRoleName')"
        ></cb-input>
      </cb-form-item>
      <cb-form-item
        :label="$t('systemManagement.roleManage.description')"
        prop="description"
      >
        <cb-input
          v-model.trim="model.description"
          type="textarea"
          :placeholder="$t('systemManagement.roleManage.enterRoleDesc')"
        ></cb-input>
      </cb-form-item>
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button buttonType="confirm" @click="submitForm" mr>{{
            $t('systemManagement.roleManage.nextStep')
          }}</cb-button>
          <cb-button buttonType="cancel" @click="resetForm"></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </div>
</template>

<script>
import _ from 'lodash';
import { editBack } from '@/api/role';
export default {
  name: 'TabMessage',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      model: {
        name: '',
        description: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('systemManagement.roleManage.enterRoleName'),
            trigger: 'blur',
          },
          {
            max: 60,
            message: this.$t('systemManagement.roleManage.roleNameLimit'),
            trigger: 'blur',
          },
        ],
        description: [
          {
            max: 1000,
            message: this.$t('systemManagement.roleManage.roleDescribeLimit'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  mounted() {
    if (this.id) {
      /* 编辑 */
      this.getRoleMessage();
    } else {
      this.$store.commit({
        type: 'role/setfirstStepFormValue',
        firstStepFormValue: {},
      });
      this.model = {
        name: '',
        description: '',
      };
    }
  },
  methods: {
    /* 编辑时回显角色信息 */
    getRoleMessage() {
      editBack(this.id).then((res) => {
        const data = _.get(res, 'data.data', {});
        const { name, description } = data;
        this.$store.commit({
          type: 'role/setfirstStepFormValue',
          firstStepFormValue: {
            name,
            description,
          },
        });
        this.model = {
          name,
          description,
        };
      });
    },
    /* 下一步 */
    submitForm() {
      this.$refs.roleFormRef.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          /* 存储第一步的name和description值 */
          const firstStepFormValue = { ...this.model };
          this.$store.commit({
            type: 'role/setfirstStepFormValue',
            firstStepFormValue,
          });
          /* 跳到第二步 */
          this.$store.commit({
            type: 'role/setCurrentTab',
            tabKey: 'permission',
          });
        }
      });
    },
    resetForm() {
      this.$router.push({ path: '/admin/system-management/role-management' });
    },
  },
};
</script>

<style></style>
