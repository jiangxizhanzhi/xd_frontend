<template>
  <div class="mark-down-content">
    <div style="height: 440px">
      <cb-markdown
        v-model="markNotesComputed"
        :uploadImages="uploadImages"
        :uploadFile="uploadFile"
        :uploadZip="showZip ? uploadZip : null"
        :exportFile="showZip ? exportFile : null"
      />
    </div>
    <cb-button
      @click.native="saveNotes"
      :class="[isFullscreen ? 'save-btn-full' : 'saveNotes']"
      icon="icon-baocun"
    >
      {{ $t('m.save') }}</cb-button
    >
  </div>
</template>
<script>
import { saveImageCommonWeb, uploadMd } from '@/api/common.js';
export default {
  props: {
    markNotes: {
      type: String,
      default: '',
    },
    showZip: {
      type: Boolean,
      default: true,
    },
    // 资源类型 1=课程 2=课时 3=练习 4=课后练习
    restType: {
      type: Number,
      default: 1,
    },
    businessType: {
      type: [String, Number],
      default: '',
    },
    // 上传文件最大的大小,单位B
    fileSize: {
      type: Number | String,
      default: '',
    },
  },
  // 监听是否全屏加类名判断样式
  data() {
    return {
      isFullscreen: false,
    };
  },
  mounted() {
    const targetNode = document.getElementsByClassName('bytemd')[0];
    const config = { attributes: true };
    const callback = function (mutationsList, observer) {
      // console.log(this);
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          if (mutation.target.className.indexOf('bytemd-fullscreen') !== -1) {
            // console.log(
            //   'mutation',
            //   this.isFullscreen,
            //   mutation.target.className,
            // );
            this.isFullscreen = true;
          } else {
            this.isFullscreen = false;
          }
        }
      }
    };
    const observer = new MutationObserver(callback.bind(this));
    observer.observe(targetNode, config);
  },
  computed: {
    markNotesComputed: {
      get() {
        return this.markNotes || '';
      },
      set(val) {
        this.$emit('update:markNotes', val);
      },
    },
  },
  methods: {
    saveNotes() {
      this.$emit('submitNote', this.markNotes);
    },
    //上传图片
    uploadImages(item) {
      return new Promise((resolve, reject) => {
        var formdata = new FormData();
        formdata.append('file', item[0]);
        formdata.append('type', this.businessType);
        saveImageCommonWeb(formdata).then((res) => {
          resolve([
            {
              url: res.data.data.file_path,
            },
          ]);
        });
      });
    },
    //上传文件
    uploadFile(item) {
      return new Promise((resolve, reject) => {
        if (!item || item.length < 1) return;
        //校验文件大小
        if (item[0].size > this.fileSize && this.fileSize != '') {
          this.$message.warning(
            this.$t('m.fileSizeLimit', {
              size: (this.fileSize / 1024 / 1024).toFixed(2),
            }),
          );
          return false;
        }
        const params = new FormData();
        params.append('file', item[0]);
        params.append('note_type', 1);
        params.append('type', 7);
        params.append('resource_type', this.restType);
        const config = {
          headers: { 'Content-type': 'multipart/form-data' },
        };
        this.$request
          .post('/common/web/attachment_upload', params, {
            baseURL: '/api/ojj',
          })
          .then((res) => {
            resolve([
              {
                name: item[0].name,
                url: res.data.data.file_path,
              },
            ]);
          });
      });
    },
    // 上传可解析md的zip
    uploadZip(file) {
      return new Promise((resolve, reject) => {
        //校验文件大小
        if (file.size > this.fileSize && this.fileSize != '') {
          this.$message.warning(
            this.$t('m.fileSizeLimit', {
              size: (this.fileSize / 1024 / 1024).toFixed(2),
            }),
          );
          return false;
        }
        const formdata = new FormData();
        formdata.append('md', file);
        uploadMd(formdata).then((res) => {
          const data = _.get(res, 'data.data', []);
          const is_extract = data.is_extract;
          if (is_extract) {
            this.$emit('update:markNotes', data.content);
          }
        });
      });
    },
    // 下载文件
    exportFile() {
      this.$request.download('/cpms/built_in/Demo.zip');
    },
  },
};
</script>
<style lang="scss" scoped>
.mark-down-content {
  max-height: 500px;
  overflow: auto;
  padding-right: 20px;

  .saveNotes {
    float: right;
    margin-top: 15px;
    z-index: 1000;
    position: relative;
  }
  .save-btn-full {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
}
</style>

<style lang="scss">
.mark-down-content {
  &::-webkit-scrollbar {
    width: 8px;
    background: var(--bg-color-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--bg-color-sixth);
  }
}
</style>
