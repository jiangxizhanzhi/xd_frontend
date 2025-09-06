<template>
  <cb-dialog :title="$t('device.saveSnapshot')" :visible.sync="visible">
    <cb-form
      ref="formRef"
      :model.sync="model"
      :rules="rules"
      label-width="100px"
      :fetchPromise="fetchForm"
    >
      <cb-form-item :label="$t('device.name')" prop="name">
        <cb-input v-model="model.name" autocomplete="off" />
      </cb-form-item>
      <cb-form-item :label="$t('device.description')" prop="description">
        <cb-input
          v-model="model.description"
          type="textarea"
          autocomplete="off"
        />
      </cb-form-item>
    </cb-form>
    <div slot="footer" class="dialog-footer">
      <cb-button button-type="confirm" @click="submitForm" mr>
        {{ $t('common.confirm') }}
      </cb-button>
      <cb-button button-type="cancel" @click="visible = false">
        {{ $t('common.cancel') }}
      </cb-button>
    </div>
  </cb-dialog>
</template>

<script>
import { createSnapshot } from '@/api/device/image';
import { validateTitleLength219, validateDescription } from '@/utils/rules-cms';
export default {
  name: 'SnapshotFormModal',
  props: {
    device: {
      type: Object,
      default: {},
    },
  },
  data() {
    const validateName = (rule, value, callback) => {
      // 仅可由英文字母、数字、特殊字符点、短横以及下划线组成, 不能以特殊字符开始或结束
      const valid = /^[a-z0-9]+(?:(?:(?:[._]|__|[-]*)[a-z0-9]+)+)?$/;
      if (valid.test(value)) {
        callback();
      } else {
        callback(new Error(this.$t('device.containNameRule')));
      }
    };
    return {
      visible: false,
      model: {
        name: '',
        description: '',
      },
      validateName: {
        validator: validateName,
        trigger: 'blur',
        container: true,
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('device.nameInput'),
            trigger: 'blur',
          },
          { validator: validateTitleLength219, trigger: 'blur' },
        ],
        description: [{ validator: validateDescription, trigger: 'blur' }],
      },
    };
  },
  watch: {},
  methods: {
    show() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.formRef.resetFields();
      });
    },

    // 保存
    fetchForm() {
      const model = _.cloneDeep(this.model);
      const params = {
        name: model.name,
        description: model.description,
        uuid: this.device.uuid,
        image_type: this.device.image_type,
      };
      this.visible = false;
      this.$emit('closeAccessInfoDialog'); // 关闭’连接信息’弹框
      this.model.name = '';
      this.model.description = '';

      return createSnapshot(params).then((res) => {});
    },

    submitForm() {
      let nameValidateList = this.rules.name;
      if (this.device.image_type === 'container') {
        nameValidateList[1] = this.validateName;
      }
      this.$refs.formRef.submit();
    },
  },
};
</script>
