<template>
  <cb-inner-page :background="false">
    <manage-auth ref="auth" :authData="authData"></manage-auth>
    <div class="form-button-bar">
      <cb-button-group space="middle">
        <cb-button @click="onSubmit">{{ $t('m.warrant') }}</cb-button>
        <cb-button @click="onCnacel" button-type="cancel"></cb-button>
      </cb-button-group>
    </div>
  </cb-inner-page>
</template>
<script>
import Http from '@/utils/http.js';
import ManageAuth from '@/components/auth/manage-auth.vue';
export default {
  components: {
    ManageAuth,
  },
  data() {
    return {
      authData: {},
    };
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.courseId;
    this.getShares();
  },
  methods: {
    // 查询授权
    getShares() {
      this.$request
        .get(
          '/oj/admin/course/get_auth',
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
    onSubmit() {
      this.$request
        .patch(
          '/oj/admin/course/batch-auth',
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
          this.$message({ type: 'success', message: this.$t('m.successful') });
          this.$router.push({ name: 'courses' });
        });
    },
    onCnacel() {
      this.$router.push({ name: 'courses' });
    },
  },
};
</script>
<style lang="scss" scoped>
.mange-content {
  margin-left: 10px;
}
</style>
<style scoped lang="scss">
.form-button-bar {
  margin-top: 20px;
}
</style>
