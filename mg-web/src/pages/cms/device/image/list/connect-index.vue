<template>
  <div class="connect-content">
    <iframe
      :src="connectUrl"
      scrolling="no"
      width="100%"
      height="100%"
      class="link"
      style="border: none"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      connectUrl: '',
    };
  },
  created() {
    this.connectUrl = this.$route?.query?.connectUrl;
  },
  mounted() {},
  methods: {},
  watch: {},
};
</script>

<style scoped lang="scss">
.connect-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
