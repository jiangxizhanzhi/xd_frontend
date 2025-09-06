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
        <cb-button @click="handleClick" buttonType="cancel">{{
          $t('button.cancel')
        }}</cb-button>
      </cb-button-group>
    </div>
  </cb-inner-page>
</template>
<script>
import { ss } from '@/utils/storage.js';
import ExerciseConst from './exercise-constants.js';
import { getOrgData } from '@/api/organization.js';

export default {
  data() {
    return {
      authData: {
        auth_mode: 1,
      },
      manages: [],
    };
  },
  computed: {
    exerciseIds() {
      return ss.get(ExerciseConst.stashedExerciseIdKey);
    },
  },
  created() {
    if (!this.exerciseIds) {
      this.$router.push({ name: 'exercises' });
    }
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
          this.authData = res.data;
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
            resource_ids: this.exerciseIds,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          this.$emit('close', true);
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
</style>
