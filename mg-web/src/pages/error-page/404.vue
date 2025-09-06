<template>
  <div class="error-page">
    <div>
      <div>
        <img :src="ErrorPage" alt="" />
      </div>
      <cb-button style="margin-top: 80px" @click="backFunc">返回</cb-button>
    </div>
  </div>
</template>

<script>
import ErrorPage from '@/assets/404.png';
import _ from 'lodash';
export default {
  props: {},
  data() {
    return {
      ErrorPage,
      userCmsPermission: true,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.userCmsPermission = _.get(
      this.$store.state,
      'user.user_cms_permission',
    );
  },
  watch: {},
  methods: {
    backFunc() {
      if (this.userCmsPermission) {
        this.$router.push({ path: '/' });
      } else {
        const base = this.$router.options.base;
        window.open(`${base}/`, '_self');
        // window.open('/page/mg', '_self');
      }
    },
  },
  components: {},
};
</script>
<style lang="scss" scoped>
.error-page {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    text-align: center;
  }
}
</style>
