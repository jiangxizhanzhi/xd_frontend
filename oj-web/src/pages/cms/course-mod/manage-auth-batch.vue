<template>
  <cb-inner-page class="mange-content">
    <manage-auth ref="auth" :authData="authData"></manage-auth>
    <div class="form-button-bar">
      <cb-button-group space="middle">
        <cb-button type="primary" @click="onSubmit">{{
          $t('m.warrant')
        }}</cb-button>
        <cb-button button-type="cancel" @click="cancelAuthBatch">{{
          $t('button.cancel')
        }}</cb-button>
      </cb-button-group>
    </div>
  </cb-inner-page>
</template>
<script>
import ManageAuth from '@/components/auth/manage-auth.vue';

export default {
  props: {
    AuthAccessIds: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ManageAuth,
  },
  data() {
    return {
      authData: {
        auth_mode: 1,
      },
    };
  },
  computed: {
    courseIds() {
      return this.AuthAccessIds;
    },
  },
  created() {},
  methods: {
    cancelAuthBatch() {
      this.$emit('closeAuthBatch');
    },
    onSubmit() {
      this.$request
        .patch(
          '/oj/admin/course/batch-auth',
          {
            read_auth_type: this.$refs.auth.authData.auth_mode,
            read_auth_ids: this.$refs.auth.authData.auth_organization,
            resource_ids: this.courseIds,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          this.$emit('closeAuthBatch', true);
        });
    },
  },
};
</script>
<style scoped lang="scss">
.form-button-bar {
  margin-top: 20px;
}
.mange-content {
  padding-left: 12px;
}
</style>
