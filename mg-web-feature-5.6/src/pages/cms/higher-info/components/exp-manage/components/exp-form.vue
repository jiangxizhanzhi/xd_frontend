<template>
  <cb-form
    ref="formRef"
    :model.sync="form"
    :rules="rules"
    :url="`/admin/vuln/${resourceId}/exp/`"
    baseURL="/api/vuln"
    :json="true"
    width="100%"
    label-position="right"
    label-width="auto"
  >
    <template>
      <cb-form-item
        :label="$t('common.vulName') + $t('common.colon')"
        prop="name"
      >
        <cb-input
          v-input-trim
          v-model="form.name"
          :placeholder="$t('higherInfo.enterName')"
          type="text"
        >
        </cb-input>
      </cb-form-item>
      <cb-form-item
        :label="$t('higherInfo.author') + $t('common.colon')"
        prop="creator"
      >
        <cb-input
          v-input-trim
          v-model="form.creator"
          :placeholder="$t('higherInfo.enterAuthor')"
          type="text"
        ></cb-input>
      </cb-form-item>
      <cb-form-item
        :label="$t('higherInfo.isVerify') + $t('common.colon')"
        prop="isVerify"
      >
        <cb-switch v-model="form.isVerify"> </cb-switch>
      </cb-form-item>
      <cb-form-item
        :label="$t('higherInfo.file') + $t('common.colon')"
        prop="file"
      >
        <cb-input style="display: none" v-model="form.file"></cb-input>
        <cb-upload-file
          drag
          type="file"
          accept=".zip"
          fileSize="104857600"
          v-model="list"
          :fetch-promise="uploadFunc"
          @delete="deleteFile"
        >
          <cb-iconfont type="icon-xinzeng" size="25"></cb-iconfont>
          <div
            class="el-upload__text"
            style="font-size: 14px; margin-bottom: 4px"
          >
            {{ $t('higherInfo.uploadInfo') }}
          </div>
          <div style="color: var(--neutral5); font-size: 12px">
            {{
              $t('higherInfo.uploadTip', {
                type: '.zip',
                fileSize: '100MB',
              })
            }}
          </div>
        </cb-upload-file>
      </cb-form-item>
    </template>
  </cb-form>
</template>
<script>
import _ from 'lodash';
export default {
  props: {
    resourceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {
        name: '',
        creator: '',
        isVerify: false,
        file: '',
      },
      list: [],
      file: null,
    };
  },
  created() {
    this.rules = {
      name: [
        {
          required: true,
          message: this.$t('higherInfo.enterName'),
          trigger: ['blur', 'change'],
        },
        {
          max: 255,
          message: this.$t('common.lengthLimit255'),
          trigger: 'blur',
        },
      ],
      creator: [
        {
          required: true,
          message: this.$t('higherInfo.enterAuthor'),
          trigger: ['blur', 'change'],
        },
        {
          max: 255,
          message: this.$t('common.lengthLimit255'),
          trigger: 'blur',
        },
      ],
      file: [
        {
          required: true,
          message: this.$t('higherInfo.pleaseUploadFile'),
          trigger: ['blur', 'change'],
        },
      ],
    };
  },
  methods: {
    expConfirm(done) {
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('name', this.form.name);
      formData.append('isVerify', this.form.isVerify);
      formData.append('creator', this.form.creator);
      this.$refs.formRef
        .submit(formData)
        .then((res) => {
          this.$emit('cancel');
        })
        .finally(() => {
          done();
        });
    },
    uploadFunc(file) {
      this.form.file = file.toString();
      this.file = file;
    },
    deleteFile(file) {
      this.list = this.list.filter((item) => item.url !== file.url);
      this.form.file = '';
      this.file = null;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .cb-upload-file {
  & > div {
    display: flex;
  }
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
  .prompt-msg {
    display: none;
  }
}
</style>
