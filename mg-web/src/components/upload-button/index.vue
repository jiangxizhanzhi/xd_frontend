<template>
  <div class="upload-button-component">
    <span v-if="$slots.default">
      <slot></slot>
    </span>
    <cb-button v-else button-type="import" :hollow="hollow" @click="trigger">{{
      text
    }}</cb-button>
    <input
      :accept="accept"
      type="file"
      ref="fileInputRef"
      @change="change"
      hidden
    />
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'UploadButton',
  components: {},
  props: {
    text: String,
    accept: {
      type: String,
      default: '',
    },
    autoPost: {
      type: Boolean,
      default: true,
    },
    fileSize: {
      type: String,
      default: '',
    },
    hollow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    resetInputValue() {
      this.$refs.fileInputRef.value = '';
    },
    trigger() {
      this.$refs.fileInputRef.click();
    },
    change() {
      const file = this.$refs.fileInputRef.files[0];
      if (!file) {
        return;
      }
      let str = this.fileSize.substring(this.fileSize.length - 2).toLowerCase();
      let size = this.fileSize.substring(0, this.fileSize.length - 2);
      let isLimitFileSize = true;
      if (str === 'mb') {
        isLimitFileSize = file.size / 1024 / 1024 < size;
      } else if (str === 'kb') {
        isLimitFileSize = file.size / 1024 < size;
      }
      // 过大限制
      if (!isLimitFileSize) {
        this.$message.error(
          `${this.$t('components.fileLoad.sizeError')}${this.fileSize}`,
        );
        this.resetInputValue();
        return;
      }
      // 文件上传类型校验
      const fileType =
        '.' + file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      const typeArr = this.accept.split(',');
      const isType = typeArr.includes(fileType);
      if (!isType && this.accept !== '') {
        this.$message.error(this.$t('components.fileLoad.typeError'));
        this.resetInputValue();
        return;
      }
      if (!this.autoPost) {
        this.$emit('change', file, this.resetInputValue);
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      this.$request
        .post('/base/file/upload', formData, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          this.$emit('change', _.get(res, 'data.data') || {});
        })
        .finally(() => {
          this.resetInputValue();
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
