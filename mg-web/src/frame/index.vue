<template>
  <div
    class="cb-iframe-container"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
<!--    <micro-app-->
<!--    :name="appName"-->
<!--    :url="`//localhost:8001/page${baseRoute}`"-->
<!--    :baseroute="-->
<!--        pathIncludesAdmin-->
<!--          ? `/dev/mg/admin${baseRoute}`-->
<!--          : `/dev/mg${baseRoute}`-->
<!--      "-->
<!--  ></micro-app>-->
    <micro-app
      :name="appName"
      :url="`//${host}/page${baseRoute}`"
      :baseroute="
        pathIncludesAdmin
          ? `/page/mg/admin${baseRoute}`
          : `/page/mg${baseRoute}`
      "
    ></micro-app>
  </div>
</template>

<script>
import _ from 'lodash';
import { getAppByPath } from './apps.js';
import utils from '@/utils/utils';

export default {
  data() {
    return {
      appName: '',
      baseRoute: '',
      loading: false,
      host: location.host,
      pathIncludesAdmin: false,
    };
  },
  created() {
    const path = this.$route.path;
    const curApp = getAppByPath(path);
    this.pathIncludesAdmin = path.includes('admin');
    this.baseRoute = curApp.baseRoute;
    this.$nextTick(() => {
      this.appName = curApp.name;
    });
  },
  mounted() {
    // 加载配置化主题样式文件
    // utils.loadCss('dark');
    utils.loadCss('light');
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.cb-iframe-container {
  width: 100%;
  min-height: 100%;
  position: relative;
  .cb-iframe-layout {
    width: 100%;
    min-height: inherit;
    position: absolute;
  }
  & > ::v-deep.el-loading-mask {
    z-index: 99;
  }
}
</style>
