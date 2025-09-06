<template>
  <cb-inner-page>
    <cb-auth-access
      class="ml20"
      ref="auth"
      :auth-data="authData"
      :org-data="manages"
    ></cb-auth-access>
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
import ManageAuth from '@/components/auth/manage-auth.vue';
import { getOrgData } from '@/api/organization.js';
export default {
  components: {
    ManageAuth,
  },
  data() {
    return {
      authData: {},
      manages: [],
    };
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params.exercisesId;
    this.getShares();
    this.getOrganization();
  },
  methods: {
    getOrganization() {
      let managesArray;
      getOrgData().then((res) => {
        managesArray = _.get(res, 'data.data', []);
        this.manages = managesArray;
        this.setOrganization(managesArray);
      });
    },
    setOrganization(managesArr) {
      managesArr.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        if (item.children && item.children.length > 0) {
          this.setOrganization(item.children);
        }
      });
    },
    // 查询授权访问
    getShares() {
      this.$request
        .get(
          '/oj/admin/practice/set/get_auth',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.authData = {
            auth_mode: _.get(res, 'data.data.read_auth_type', 1),
            auth_organization: _.get(res, 'data.data.read_auth_ids', ''),
          };
        });
    },
    // 提交记录
    onSubmit() {
      this.$request
        .patch(
          '/oj/admin/practice/set/batch-auth',
          {
            read_auth_type: this.$refs.auth.authData.auth_mode,
            read_auth_ids: this.$refs.auth.authData.auth_organization,
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
    // 取消提交
    onCnacle() {
      this.$router.push({ name: 'exercises' });
    },
  },
};
</script>
<style scoped lang="scss">
.form-button-bar {
  margin-top: 20px;
}
</style>
