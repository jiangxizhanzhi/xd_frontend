<template>
  <div class="create-template">
    <cb-dialog :visible="visible" width="600px" @close="handleClose" :modal-append-to-body="false">
      <template slot="title">
        <span>{{ $tt('stage.createSceneTemplate') }}</span>
      </template>
      <div class="content">
        <cb-form :rules="rules" :model.sync="formData" label-position="right" :label-width="labelWidth" ref="formRef">
          <cb-form-item
            :label="$tt('stage.templateName') + ':'"
            prop="templateName"
          >
            <cb-input
              v-model="formData.templateName"
              :placeholder="$tt('stage.placeInputTemplateName')"
            ></cb-input>
          </cb-form-item>
          <cb-form-item
            :label="$tt('stage.templateDescribe') + ':'"
            prop="templateDescribe"
          >
            <cb-input
              v-model="formData.templateDescribe"
              :placeholder="$tt('stage.placeInputTemplateDescribe')"
            ></cb-input>
          </cb-form-item>
        </cb-form>
      </div>
      <template slot="footer">
        <cb-button button-type="confirm" mr @click="handleSure"></cb-button>
        <cb-button button-type="cancel" mr @click="handleClose"></cb-button>
      </template>
    </cb-dialog>
  </div>
</template>

<script>
import t from '../../../../utils/i18n';
import {computed, inject} from '@vue/composition-api';

export default {
  name: 'CreateTemplate',
  setup() {
    const lang = inject('lang');
    const labelWidth = computed(() => {
      return lang === 'zh-CN' ? '100px' : '180px';
    });
    return {
      labelWidth
    }
  },
  data() {
    return {
      visible: false,
      rules: {
        templateName: [
          {
            required: true,
            message: this.$tt('stage.placeInputTemplateName'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      formData: {
        templateName: '',
        templateDescribe: '',
      },
    };
  },
  methods: {
    $tt: t,
    /**
     * 开启
     */
    handleOpen() {
      this.visible = true;
    },
    /**
     * 确定
     */
    handleSure() {
      this.$refs.formRef.validate((e) => {
        if (e) {
          this.$emit('createTemplate', this.formData);
          this.handleClose();
        }
      })
    },
    /**
     * 关闭
     */
    handleClose() {
      this.visible = false;
      this.formData = {
        templateName: '',
        templateDescribe: '',
      };
    },
  },
};
</script>

<style scoped></style>
