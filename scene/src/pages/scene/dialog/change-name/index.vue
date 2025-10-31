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
  name: 'ChangeName',
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
    let nodeForm = reactive(_.cloneDeep(Object.assign(
      {},
      nodeFormData.value.basicConfig,
    )));
    return {
      FORM_RULES,
      labelWidth,
      formRef,
      nodeForm,
      nodeFormData,
    };
  },
  methods: {
    $tt: t,
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
        const { name, icon } = this.nodeForm;
        this.nodeFormData.basicConfig.name = name;
        this.nodeFormData.basicConfig.icon = icon;
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
