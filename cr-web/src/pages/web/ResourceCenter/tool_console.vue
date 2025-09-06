<template>
  <div id="toolConsole" />
</template>

<script>
import { openConsole } from '@/api/web/tool_magazine.js';

export default {
  data() {
    return {};
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    const serveId = localStorage.getItem('serveId');
    openConsole(this.resource_id, { id: serveId }).then((res) => {
      if (!res.data.url) {
        this.$message({
          message: this.$t('scene.GetConnectionFailed'),
          type: 'error',
        });
        return false;
      }
      window.location.href = res.data.url;
    });
  },
  methods: {},
};
</script>

<style lang="scss">
#toolConsole {
  width: 100%;
  height: 100%;
}
</style>
