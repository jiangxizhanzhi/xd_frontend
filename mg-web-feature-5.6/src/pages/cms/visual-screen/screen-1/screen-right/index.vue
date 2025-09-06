<template>
  <div class="visual-screen-right">
    <div class="visual-screen-right-top">
      <Header :level="1" title="资产监控" />
      <div class="content">
        <div class="colDiv">
          <total-assets></total-assets>
        </div>
        <div class="colDiv"><log-warning></log-warning></div>
      </div>
    </div>
    <div class="visual-screen-right-center">
      <Header :level="1" title="威胁发现" />
      <div class="content">
        <div class="colDiv">
          <threat-level></threat-level>
        </div>
        <div class="colDiv" style="flex: 4.5">
          <threat-classify></threat-classify>
        </div>
        <div class="colDiv" style="flex: 6">
          <threat-info></threat-info>
        </div>
      </div>
    </div>
    <div class="visual-screen-right-bottom">
      <Header :level="1" title="主机统计" />
      <div class="content">
        <host-info-all></host-info-all>
        <div class="colDiv">
          <lost-hosts></lost-hosts>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TotalAssets from './components/asset/total-assets.vue';
import LogWarning from './components/asset/log-warning.vue';
import ThreatLevel from './components/threat/threat-level.vue';
import ThreatClassify from './components/threat/threat-classify.vue';
import ThreatInfo from './components/threat/threat-info.vue';
import LostHosts from './components/host/lost-hosts.vue';
import HostInfoAll from './components/host/host-info-all.vue';
import Header from '../components/header';
export default {
  components: {
    TotalAssets,
    LogWarning,
    ThreatLevel,
    ThreatClassify,
    ThreatInfo,
    LostHosts,
    HostInfoAll,
    Header,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.visual-screen-right {
  &-top {
    flex: 1;
    height: 0;
    margin-bottom: var(--header-margin-top-30);
    display: flex;
    flex-direction: column;
  }

  &-center {
    flex: 1;
    height: 0;
    margin-bottom: var(--header-margin-top-30);
    display: flex;
    flex-direction: column;
  }

  &-bottom {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    flex: 1;
    height: 0;
    margin-top: var(--header-1-content-space);
    margin-left: var(--margin-left-20);

    .colDiv {
      flex: 1.5;
      width: 0;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
