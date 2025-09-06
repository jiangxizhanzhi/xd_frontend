<template>
  <div class="colDiv">
    <div class="flex-column">
      <Header :level="3" title="主机状态" />
      <host-state :assetItem="assetItem"></host-state>
    </div>
    <div class="flex-column">
      <Header :level="3" title="受攻击主机TOP5" />
      <div class="top5">
        <host-top5 :assetInfo="assetInfo"></host-top5>
      </div>
    </div>
  </div>
</template>
<script>
import HostState from './host-state.vue';
import HostTop5 from './host-top5.vue';
import Header from '../../../components/header';

export default {
  components: {
    HostState,
    HostTop5,
    Header,
  },
  props: {},
  data() {
    return {
      assetItem: [
        {
          name: '资产总数',
          num: 78,
        },
        {
          name: 'IP总数',
          num: 79,
        },
      ],

      assetInfo: [
        {
          name: '操作系统',
          num: 78,
        },
        {
          name: '应用系统',
          num: 79,
        },
        {
          name: '安全设备',
          num: 78,
        },
        {
          name: '网络设备',
          num: 79,
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.host {
  margin-top: var(--header-3-content-space);
}
.top5 {
  margin-top: var(--header-3-content-space);
}
</style>
