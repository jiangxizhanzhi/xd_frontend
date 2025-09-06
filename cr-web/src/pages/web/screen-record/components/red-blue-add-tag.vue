<template>
  <cb-dialog
    :title="$t('m.addTags')"
    :visible="visible"
    class="tag-dialog"
    :before-close="beforeClose"
    :close-on-press-escape="false"
  >
    <div class="tag-dialog-content">
      <cb-form
        ref="form"
        :rules="rules"
        :model.sync="model"
        label-width="150px"
      >
        <cb-form-item :label="$t('m.tagName')" prop="name">
          <cb-input v-model="model.name" />
        </cb-form-item>
        <cb-form-item :label="$t('m.tagDesc')" prop="description">
          <cb-input type="textarea" v-model="model.description" />
        </cb-form-item>
        <cb-form-item :label="$t('m.evidenceDescription')" prop="evidence">
          <cb-upload-file
            v-model="list"
            :fetch-promise="uploadFunc"
            accept=".jpg"
            :tipText="$t('m.uploadFileTipText')"
            @delete="removeLogo"
          ></cb-upload-file>
        </cb-form-item>
      </cb-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <cb-button button-type="confirm" @click="submitForm" mr />
      <cb-button button-type="cancel" @click="closeForm" />
    </div>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import { uploadImage } from '@/api/web/red-blue';
export default {
  components: {},
  props: {
    resourceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      list: [],
      visible: false,
      resource_id: this.resourceId,
      rules: {
        name: [
          {
            required: true,
            message: this.$t('m.pleaseInputTagName'),
            trigger: 'blur',
          },
        ],
      },
      model: {
        name: '',
        description: '',
      },
    };
  },
  created() {},
  methods: {
    uploadFunc(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 5);
      uploadImage(formData).then((res) => {
        const data = _.get(res, 'data.data', '');
        this.model.evidence = [
          {
            filename: data.file_name,
            path: data.file_path,
            resource_id: data.resource_id,
          },
        ];
      });
    },
    removeLogo() {
      this.list = [];
      this.model.evidence = [];
    },
    beforeClose() {
      this.$emit('before-close', 'tag');
      this.visible = false;
      this.list = [];
      this.$refs.form.resetFields();
    },
    // 提交新增标记
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          this.model.room_id = this.resource_id;
          this.$request
            .post(
              '/cr/red_vs_blue/user/mark',
              { ...this.model },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              this.visible = false;
              this.list = [];
              this.$refs.form.resetFields();
            });
        }
      });
    },
    closeForm() {
      this.visible = false;
      this.list = [];
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-dialog {
  ::v-deep .el-dialog {
    margin-right: 0;
  }
  &-content {
    min-height: 300px;
  }
}
</style>
