<template>
  <!--设备信息-->
  <div class="device-information">
    <cb-form
      ref="formRef"
      :model.sync="nodeForm"
      label-position="right"
      :label-width="labelWidth"
    >
      <cb-form-item :label="$tt('target.deviceName') + ' ：'" prop="name" :rules="FORM_RULES.basicInfo.name">
        <cb-input
          v-model="nodeForm.name"
          :placeholder="$tt('target.inputDeviceName')"
          type="text"
          size="small"
        ></cb-input>
      </cb-form-item>
      <cb-form-item :label="$tt('target.ipAddress') + ' ：'" prop='ip' :rules="FORM_RULES.networkConfig.ip">
        <cb-input
          v-model="nodeForm.ip"
          :placeholder="$tt('target.inputIpAddress')"
          type="text"
          size="small"
        ></cb-input>
      </cb-form-item>
      <cb-form-item
        prop="icon"
        :label="$tt('target.nodeIcon') + ' ：'"
        class="one-line"
      >
        <cb-upload-file
          accept=".jpg,.png,.jpeg"
          :fileSize="32000"
          :fetchPromise="fetchPromise"
          :showFileList="false"
          :limit="1"
        >
          <template v-slot:tip>{{ $tt('target.uploadTip') }}</template>
        </cb-upload-file>
        <div class="image-container">
          <img :src="nodeForm.icon" alt="" />
        </div>
      </cb-form-item>
      <cb-form-item label="协议类型 ：" prop='npc_protocol'>
        <cb-select
            v-model="nodeForm.npc_protocol"
            placeholder="请选择协议"
            size="small"
            :options="npc_protocol_options"
            clearable
            @change="changeProtocol($event)"
        >
        </cb-select>
      </cb-form-item>
      <template v-if="nodeForm.npc_protocol && (nodeForm.npc_protocol === 'https' || nodeForm.npc_protocol === 'http')">
        <cb-form-item label="URL：" prop='npc_url'>
          <cb-input
              v-model="nodeForm.npc_url"
              placeholder="请输入url"
              type="text"
              size="small"
          ></cb-input>
        </cb-form-item>
      </template>
      <template  v-if="nodeForm.npc_protocol && nodeForm.npc_protocol !== 'https' && nodeForm.npc_protocol !== 'http'">
        <cb-form-item label="端口号：" prop='npc_port'>
          <cb-input
              v-model="nodeForm.npc_port"
              placeholder="请输入端口号"
              type="text"
              size="small"
          ></cb-input>
        </cb-form-item>
        <cb-form-item label="用户名：" prop='npc_username'>
          <cb-input
              v-model="nodeForm.npc_username"
              placeholder="请输入用户名"
              type="text"
              size="small"
          ></cb-input>
        </cb-form-item>
        <cb-form-item label="密码：" prop='npc_password'>
          <cb-input
              v-model="nodeForm.npc_password"
              placeholder="请输入密码"
              type="text"
              size="small"
          ></cb-input>
        </cb-form-item>
      </template>
    </cb-form>
  </div>
</template>

<script>
import { computed, inject, reactive, ref } from '@vue/composition-api';
import _ from 'lodash';
import t from '../../../../utils/i18n';
import { FORM_RULES } from '../components/constant/form-rules';
import { useResetForm, useSubmitForm } from '../../../../utils/form/submit';
import { uploadIcon } from '../../../../api';

export default {
  name: 'Npc',
  components: {},
  props: {
    nodeInfo: {
      type: Object,
      default: () => {
      },
    },
    formData: {
      type: Object,
      default: () => {
      },
    },
    lang: {
      type: String,
      default: 'zh-CN',
    },
    topology: {
      type: Object,
      default: () => {
      },
    },
  },
  setup(props) {
    const labelWidth = computed(() => {
      return props.lang === 'zh-CN' ? '100px' : '160px';
    });
    const nodeFormData = computed(() => {
      return props.formData;
    });
    const formRef = ref(null);
    const $tt = t;

    let networkForm = reactive(
      _.cloneDeep(nodeFormData.value.networkConfig || { network: [] }),
    );
    let nodeForm = ref({
      name: nodeFormData.value.basicConfig.name,
      ip: networkForm.network[0].ip,
      icon: nodeFormData.value.basicConfig.icon,
      npc_protocol: nodeFormData.value.basicConfig.npc_protocol,
      npc_url: nodeFormData.value.basicConfig.npc_url,
      npc_username: nodeFormData.value.basicConfig.npc_username,
      npc_password: nodeFormData.value.basicConfig.npc_password,
      npc_port: nodeFormData.value.basicConfig.npc_port,
    });
    const npc_protocol_options = [
      {
        label: 'http',
        value: 'http'
      },
      {
        label: 'https',
        value: 'https'
      },
      {
        label: 'telnet',
        value: 'telnet'
      },
      {
        label: 'ssh',
        value: 'ssh'
      }
      ]
    return {
      npc_protocol_options,
      $tt,
      FORM_RULES,
      formRef,
      nodeForm,
      nodeFormData,
      labelWidth,
    };
  },
  methods: {
    changeProtocol(data) {
      if (data === 'https' || data === 'http') {
        this.nodeForm.npc_username = '';
        this.nodeForm.npc_password = '';
        this.nodeForm.npc_port = '';
      }else {
        this.nodeForm.npc_url = '';
      }
    },
    fetchPromise(file) {
      const formData = new FormData();
      formData.append('file', file);
      uploadIcon(formData).then((res) => {
        this.nodeForm.icon = _.get(res, 'data.data.http_url', '');
      });
    },
    submitForm() {
      let result = useSubmitForm(this.formRef, this.nodeForm);
      if (result.status) {
        if (this.nodeForm.name !== this.nodeFormData.basicConfig.name) {
          this.$emit('update-name', this.nodeForm.name);
        }
        if (this.nodeForm.icon !== this.nodeFormData.basicConfig.icon) {
          this.$emit('update-icon', this.nodeForm.icon);
        }
        const { name, ip, icon, npc_protocol, npc_url, npc_username, npc_password, npc_port } = this.nodeForm;
        this.nodeFormData.basicConfig.name = name;
        this.nodeFormData.networkConfig.network[0].ip = ip;
        this.nodeFormData.basicConfig.icon = icon;
        this.nodeFormData.basicConfig.npc_protocol = npc_protocol;
        this.nodeFormData.basicConfig.npc_url = npc_url;
        this.nodeFormData.basicConfig.npc_username = npc_username;
        this.nodeFormData.basicConfig.npc_password = npc_password;
        this.nodeFormData.basicConfig.npc_port = npc_port;
        this.$emit('update-node-data', this.nodeFormData);
      } else {
        this.$message.info(this.$tt('global.checkFormFailed'));
      }
      this.$emit('formCheck', result);
    },
    // 重置表单
    resetForm() {
      this.$emit('formCheck', useResetForm(this.formRef));
    },
  },
};
</script>
