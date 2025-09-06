<template>
  <cb-inner-page :background="false">
    <cb-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <cb-tab-pane
        :label="$t('systemManagement.system.baseConfig')"
        name="baseConfig"
        ><base-config
      /></cb-tab-pane>
      <cb-tab-pane
        :label="$t('systemManagement.system.advanceConfig')"
        name="advanceConfig"
        ><advance-config
      /></cb-tab-pane>
      <cb-tab-pane
        :label="$t('systemManagement.system.authInfo')"
        name="authInfo"
        class="auth-info"
        ><auth-info
      /></cb-tab-pane>
      <cb-tab-pane
        :label="$t('configuration.configurationIp')"
        name="configurationIp"
        v-if="getSingleIpTh && isSuperUser && !showConfigurationIp"
      >
        <configuration-ip />
      </cb-tab-pane>
    </cb-tabs>
  </cb-inner-page>
</template>

<script>
import BaseConfig from './components/base-config';
import AdvanceConfig from './components/advance-config';
import AuthInfo from './components/auth-info';
import ConfigurationIp from './components/configuration-ip';
export default {
  components: {
    BaseConfig,
    AdvanceConfig,
    AuthInfo,
    ConfigurationIp,
  },
  data() {
    return {
      activeName: 'baseConfig',
      showConfigurationIp: false,
      getSingleIpTh: false,
    };
  },
  computed: {
    isSuperUser() {
      return _.get(this.$store, 'state.user.is_super_user', 0);
    },
  },
  created() {
    this.getSingleIp();
  },
  methods: {
    handleClick() {},
    getSingleIp() {
      this.$request
        .get('/config/single_ip', null, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          this.showConfigurationIp = _.get(
            res,
            'data.data.public_net_proxy',
            false,
          );
          this.getSingleIpTh = true;
        });
    },
  },
};
</script>
