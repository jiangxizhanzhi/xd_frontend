<template>
  <cb-inner-page v-loading="loading" :background="false" class="vuln-detail">
    <!--    <div class="vuln-detail ct-g-scrollbar">-->
    <div class="detail-top">
      <top-base-info :itemData="detailInfo" :resourceId="resourceId" />
    </div>
    <div class="impact-top">
      <top-impact-info :itemData="detailInfo"></top-impact-info>
    </div>
    <div class="detail-bottom">
      <base-info
        v-if="activeName === 'base-info'"
        :detailInfo="detailInfo"
      ></base-info>
    </div>
    <!--    </div>-->
  </cb-inner-page>
</template>

<script>
import TopBaseInfo from './components/top-base-info.vue';
import BaseInfo from './components/base-info.vue';
// import Paper from './components/paper.vue';
import { setBreadcrumbTitle } from '@cyber/ui';
import _ from 'lodash';
import TopImpactInfo from './components/top-impact-info.vue';
import { getVulnDetail } from '@/api/vuln';
export default {
  components: {
    TopImpactInfo,
    TopBaseInfo,
    BaseInfo,
    // Paper,
  },
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
  color: var(--neutral8);
  .detail-top {
    margin-bottom: 16px;
    width: 100%;
    min-height: 208px;
    background: var(--bg-color-2);
    border-radius: 4px;
  }
  .impact-top {
    width: 100%;
    min-height: 208px;
    background: var(--bg-color-2);
    border-radius: 4px;
  }
  .detail-bottom {
    background: var(--bg-color-2);
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
