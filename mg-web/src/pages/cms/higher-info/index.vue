<template>
  <cb-inner-page class="vuln-higher-info" :background="false">
    <cb-tabs
      type="border-card"
      v-model="activeName"
      class="vuln-higher-info__tab"
    >
      <!-- POC管理 -->
      <cb-tab-pane
        :label="$t('common.POC') + $t('higherInfo.mgr')"
        name="poc-mgr"
        class="vuln-higher-info__tab-panel ct-g-scrollbar"
      >
        <poc-manage v-if="activeName === 'poc-mgr'"></poc-manage>
      </cb-tab-pane>
      <!-- EXP管理 -->
      <cb-tab-pane
        :label="$t('common.EXP') + $t('higherInfo.mgr')"
        name="exp-mgr"
        class="vuln-higher-info__tab-panel ct-g-scrollbar"
      >
        <exp-manage v-if="activeName === 'exp-mgr'"></exp-manage>
      </cb-tab-pane>
      <!-- 复现环境 -->
      <cb-tab-pane
        :label="$t('common.reproduceEnvironment')"
        name="reproduction-environment"
        class="vuln-higher-info__tab-panel ct-g-scrollbar"
      >
        <reproduction-environment
          v-if="activeName === 'reproduction-environment'"
        ></reproduction-environment>
      </cb-tab-pane>
    </cb-tabs>
  </cb-inner-page>
</template>

<script>
// POC管理
import PocManage from './components/poc-manage';
import ExpManage from './components/exp-manage';
import ReproductionEnvironment from './components/reproduction-environment';
import { setBreadcrumbTitle } from '@cyber/ui';
import _ from 'lodash';
import { getVulnDetail } from '@/api/vuln-cms';

export default {
  components: {
    PocManage,
    ExpManage,
    ReproductionEnvironment,
  },
  data() {
    return {
      activeName: 'poc-mgr',
      resourceId: '',
      vulnName: '',
    };
  },
  watch: {
    activeName: {
      handler: function (val) {
        this.changeTabQuery(val);
      },
    },
  },
  created() {
    this.resourceId = this.$route.params.resource_id;
    this.activeName = this.$route.query.tabs || 'poc-mgr';
    if (this.resourceId) {
      this.getVulnDetail();
    }
  },
  methods: {
    getVulnDetail() {
      getVulnDetail(this.resourceId).then((res) => {
        this.vulnName = _.get(res, 'data.data.name', '');
        setBreadcrumbTitle(_.get(res, 'data.data.name', ''));
      });
    },
    // 获取详情
    changeTabQuery(val) {
      this.$router.push({
        name: '',
        params: {
          resource_id: this.resourceId,
        },
        query: {
          tabs: val,
          name: this.vulnName,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.vuln-higher-info {
  .vuln-higher-info__tab {
    height: inherit;
    ::v-deep.el-tabs {
      height: 100%;
      background: none;
      .el-tabs__content {
        padding: 15px;
        margin-bottom: 20px;
        box-sizing: content-box;
        height: calc(100% - 15px - 20px - 40px);
        width: calc(100% - 30px);
        .vuln-higher-info__tab-panel {
          height: 100%;
          width: 100%;
          overflow: auto;
        }
      }
    }
  }
}
</style>
