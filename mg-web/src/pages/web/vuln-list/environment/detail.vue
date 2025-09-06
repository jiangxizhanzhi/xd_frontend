<template>
  <cb-inner-page v-loading="loading" :background="false" class="vuln-detail">
    <div class="detail-top">
      <env-top-info :itemData="detailInfo" :resourceId="resourceId" />
    </div>
    <div class="detail-bottom">
      <content-info :detailInfo="detailInfo"></content-info>
    </div>
  </cb-inner-page>
</template>

<script>
import { setBreadcrumbTitle } from '@cyber/ui';
import _ from 'lodash';
import EnvTopInfo from './components/env-top-info.vue';
import ContentInfo from './components/content-info.vue';
import { getVulnDetail } from '@/api/vuln';

export default {
  components: {
    ContentInfo,
    EnvTopInfo,
  },
  name: 'AnalysisBaseInfo',
  data() {
    return {
      activeName: 'base-info',
      loading: false,
      resourceId: '',
      detailInfo: {},
    };
  },
  created() {
    this.resourceId = this.$route.params.resource_id;
    if (this.resourceId) {
      this.getVulnDetailInfo();
    }
  },
  methods: {
    getVulnDetailInfo() {
      this.loading = true;
      this.detailInfo = {};
      getVulnDetail(this.resourceId)
        .then((res) => {
          this.detailInfo = _.get(res, 'data.data') || {};
          setBreadcrumbTitle(_.get(res, 'data.data.name', ''));
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.vuln-detail {
  height: inherit;
  overflow: auto;
  border-radius: 4px;
  .detail-top {
    margin-bottom: 16px;
    width: 100%;
    min-height: 206px;
    background: var(--bg-color-2);
    border-radius: 4px;
  }
  .detail-bottom {
    border-radius: 4px;
    ::v-deep.el-tabs {
      height: 100%;
      background: none;
      .el-tabs__content {
        background: var(--bg-color-2);
        box-sizing: content-box;
      }
    }
  }
}
</style>
