<template>
  <div />
</template>
<script>
import { getData, apiActor } from '@/api/common';

export default {
  name: 'DeviceConsole',
  data() {
    return {
      deviceId: this.$route.params.id,
    };
  },
  mounted() {
    if (!this.deviceId) {
      return;
    }
    const consoleUrl = `/admin/scene/devices/${this.deviceId}/image_scene_console_url/`;
    apiActor.handleRequester.call(
      this,
      () => getData(consoleUrl),
      (data) => {
        if (!data.url) {
          this.$message({
            message: this.$t('scene.GetConnectionFailed'),
            type: 'error',
          });
          return false;
        }
        window.location.href = data.url;
      },
    );
  },
};
</script>
