<template>
  <cb-inner-page v-loading="loading" :background="false">
    <div class="vuln-detail ct-g-scrollbar">
      <div class="detail-top">
        <top-base-info :itemData="detailInfo" />
      </div>
      <div class="detail-bottom">
        <cb-tabs type="border-card" v-model="activeName">
          <!-- 基本信息 -->
          <cb-tab-pane :label="$t('vulnDetail.baseInfo')" name="base-info">
            <base-info
              v-if="activeName === 'base-info'"
              :detailInfo="detailInfo"
            ></base-info>
          </cb-tab-pane>
          <!-- 相关Paper -->
          <cb-tab-pane :label="$t('vulnDetail.paperInfo')" name="paper">
            <paper :resourceId="resourceId"></paper>
          </cb-tab-pane>
        </cb-tabs>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import TopBaseInfo from './components/top-base-info.vue';
import BaseInfo from './components/base-info.vue';
import Paper from './components/paper.vue';
import { setBreadcrumbTitle } from '@cyber/ui';
import _ from 'lodash';
import { getVulnDetail } from '@/api/vuln';
export default {
  components: {
    TopBaseInfo,
    BaseInfo,
    Paper,
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
  .detail-top {
    margin-bottom: 10px;
    width: 100%;
    min-height: 360px;
    background: var(--bg-color-2);
  }
  .detail-bottom {
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
