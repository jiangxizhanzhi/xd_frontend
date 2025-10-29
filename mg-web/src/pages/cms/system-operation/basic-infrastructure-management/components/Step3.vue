<template>
  <div>
    <cb-form
      ref="formRef"
      label-position="right"
      v-loading="loading"
      :model.sync="model"
      :rules="rules"
      :fetchPromise="fetchForm"
      :label-width="getI18Nn().locale == 'en-US' ? '165px' : '120px'"
      :isBgColor="true"
    >
      <cb-form-item
        style="margin-bottom: 0"
        :label="$t('device.snmp')"
        prop="snmp_configuration"
      >
        <cb-col :span="moreSnmpSpan">
          <cb-select
            style="width: 100%"
            v-model="model.snmp_version"
            :options="snmpList"
            :placeholder="$t('device.plzChangeVision')"
            @change="snmpChange"
          />
        </cb-col>
        <template v-if="groupWordsVisible">
          <cb-col :span="moreSnmpSpan" :offset="1">
            <cb-input
              v-model="model.snmp_config.community_name"
              :placeholder="$t('device.ReadCommunityWord')"
            ></cb-input>
          </cb-col>
          <cb-col :span="moreSnmpSpan + 1" :offset="1">
            <cb-form-item
              style="margin-bottom: 0"
              prop="snmp_config.ip"
              :rules="rules.ip"
            >
              <cb-input
                v-model="model.snmp_config.ip"
                :placeholder="$t('device.IP')"
              ></cb-input>
            </cb-form-item>
          </cb-col>
        </template>
        <template v-if="userMessageVisible">
          <cb-col :span="lessSnmpSpan" :offset="1">
            <cb-input
              v-model="model.snmp_config.priv_key"
              :placeholder="$t('device.userGroupname')"
            ></cb-input>
          </cb-col>
          <cb-col :span="lessSnmpSpan" :offset="1">
            <cb-input
              v-model="model.snmp_config.username"
              :placeholder="$t('device.username')"
            ></cb-input>
          </cb-col>
          <cb-col :span="lessSnmpSpan" :offset="1">
            <cb-input
              v-model="model.snmp_config.auth_key"
              :placeholder="$t('device.authenticationPassword')"
            ></cb-input>
          </cb-col>
          <cb-col :span="lessSnmpSpan" :offset="1">
            <cb-form-item
              style="margin-bottom: 0"
              prop="snmp_config.ip"
              :rules="rules.ip"
            >
              <cb-input
                v-model="model.snmp_config.ip"
                :placeholder="$t('device.IP')"
              ></cb-input>
            </cb-form-item>
          </cb-col>
        </template>
        <cb-col style="margin-top: 20px" :span="24">
          <cb-col :span="7">
            <cb-form-item
              :label="$t('device.cpuOid')"
              label-width="70px"
              prop="snmp_cpu_oid"
            >
              <cb-input
                v-model="model.snmp_cpu_oid"
                :placeholder="$t('device.cpuUsage')"
              ></cb-input>
            </cb-form-item>
          </cb-col>
          <cb-col :span="7" :offset="1">
            <cb-form-item
              :label="$t('device.ramOid')"
              label-width="70px"
              prop="snmp_mem_oid"
            >
              <cb-input
                v-model="model.snmp_mem_oid"
                :placeholder="$t('device.ramUsage')"
              ></cb-input>
            </cb-form-item>
          </cb-col>
          <cb-col :span="8" :offset="1">
            <cb-form-item
              :label="$t('device.diskOid')"
              label-width="70px"
              prop="disk"
            >
              <cb-input
                v-model="model.snmp_disk_oid"
                :placeholder="$t('device.diskUsage')"
              ></cb-input>
            </cb-form-item>
          </cb-col>
        </cb-col>
      </cb-form-item>
      <div slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button
            :disabled="loading"
            button-type="confirm"
            mr
            @click="back"
            >{{ $t('device.prev') }}</cb-button
          >
          <cb-button
            :disabled="loading"
            button-type="confirm"
            mr
            @click="submitForm"
            >{{ $t('device.save') }}</cb-button
          >
          <cb-button button-type="cancel" @click="cancel"></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </div>
</template>

<script>
import {
  getEditBackData,
  addRealEquipment,
  editRealEquipment,
  getPortList,
} from '@/api/device/real';
import { SNMPLIST } from '../constant';
import { getI18n } from '@/lang/';
export default {
  name: 'Step3',
  props: {
    id: {
      type: String,
      default: '',
    },
    roleSet: {
      type: Array,
      default: [],
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const validateIP = (rule, value, callback) => {
      const valid =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g;
      if (value && valid.test(value)) {
        callback();
      } else if (!value) {
        callback();
      } else {
        callback(new Error(this.$t('device.plzInputCorrectIp')));
      }
    };
    return {
      loading: false,
      moreSnmpSpan: 7,
      lessSnmpSpan: 4,
      model: {
        snmp_version: null, // 版本V1...
        snmp_config: {
          community_name: null, // 团体字
          priv_key: null, // 用户组名
          username: null, // 用户名
          auth_key: null, // 认证密码
          ip: null, // ip地址
        },

        snmp_cpu_oid: null,
        snmp_mem_oid: null,
        snmp_disk_oid: null,
      },
      rules: {
        ip: [{ validator: validateIP, trigger: ['blur', 'change'] }],
      },
      // SNMP配置数据
      snmpList: SNMPLIST,
      groupWordsVisible: true,
      userMessageVisible: false,
    };
  },
  watch: {
    // 监听snmp版本
    'model.snmp_version': {
      handler(value) {
        this.snmpChange(value);
      },
      immediate: true,
    },
    // 表单数据
    formData: {
      handler(value) {
        value && this.id && this.editBack(value);
      },
      immediate: true,
    },
  },
  created() {},
  beforeDestroy() {
    this.$store.commit({
      type: 'real/setActive',
      active: 1,
    });
  },
  methods: {
    getI18Nn() {
      return getI18n();
    },

    // 编辑回显
    editBack(res) {
      let data = _.get(res, 'data.data', {});
      const { ext_entity } = data;
      if (ext_entity) {
        this.model.snmp_version = ext_entity.snmp_version;
        this.model.snmp_config = ext_entity.snmp_config;

        this.model.snmp_cpu_oid = ext_entity.snmp_cpu_oid;
        this.model.snmp_mem_oid = ext_entity.snmp_mem_oid;
        this.model.snmp_disk_oid = ext_entity.snmp_disk_oid;

        this.model.ccm_port = ext_entity.ccm_port;
        this.model.ccm_username = ext_entity.ccm_username;
        this.model.ccm_password = ext_entity.ccm_password;
        this.model.ccm_server_name = ext_entity.ccm_server_name;
      }
    },

    // 保存
    fetchForm() {
      let params = {};
      let ext_entity = this.model;
      if (ext_entity.snmp_version === 'V3') {
        ext_entity.snmp_config.community_name = null;
      } else {
        ext_entity.snmp_config.priv_key = null;
        ext_entity.snmp_config.username = null;
        ext_entity.snmp_config.auth_key = null;
      }
      const { firstStepFormValue, secondStepFormValue } =
        this.$store.state.real; // 第一步的 数据

      params = {
        ext_entity_access: secondStepFormValue.ext_entity_access,
        ...firstStepFormValue,
        ext_entity: {
          ...firstStepFormValue.ext_entity,
          ...ext_entity,
          ...secondStepFormValue.ccmPortSet,
        },
        ext_entity_usb: {},
      };

      if (this.id) {
        let editParams = {
          uuid: this.id,
          ...params,
        };
        return editRealEquipment(editParams).then(() => {
          this.$router.push({ name: 'basic-infrastructure-management' });
        });
      } else {
        return addRealEquipment(params).then(() => {
          this.$router.push({ name: 'basic-infrastructure-management' });
        });
      }
    },

    submitForm() {
      this.$refs.formRef.submit();
    },
    back() {
      this.$store.commit({
        type: 'real/setActive',
        active: 2,
      });
    },

    cancel() {
      this.$router.push({ name: 'basic-infrastructure-management' });
    },

    // SNMP值切换
    snmpChange(value) {
      if (value === 'V3') {
        this.moreSnmpSpan = 4;
        this.groupWordsVisible = false;
        this.userMessageVisible = true;
      } else {
        this.moreSnmpSpan = 7;
        this.groupWordsVisible = true;
        this.userMessageVisible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
