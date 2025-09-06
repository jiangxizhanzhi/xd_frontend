<template>
  <div class="mark-down-content">
    <div class="my-pass-notes" style="overflow: auto" v-if="scored">
      <div class="my-notes-title">
        <div class="my-notes-comment ft16">
          <span class="color1">{{ $t('course.comment') }}：</span>
          <span class="color2">{{ comment }}</span>
        </div>
        <div class="my-notes-score">
          <span class="score color1">{{ score }}{{ $t('course.score') }}</span
          ><span class="passStatus color17 bg171 ft14">{{
            $t('course.notPass')
          }}</span>
        </div>
      </div>
    </div>
    <div style="height: 440px">
      <cb-markdown
        v-model="markNotesComputed"
        :uploadImages="uploadImages"
        :uploadFile="uploadFile"
        :uploadZip="showZip ? uploadZip : null"
        :exportFile="showZip ? exportFile : null"
      />
    </div>
    <div :class="[isFullscreen ? 'save-btn-full' : 'saveNotes']">
      <cb-button
        @click.native="saveDrafts"
        icon="icon-baocun"
        :disabled="disabledDrafts"
      >
        {{ $t('course.saveDraft') }}
      </cb-button>
      <cb-button @click.native="saveNotes" icon="icon-baocun">
        {{ $t('course.submit') }}
      </cb-button>
    </div>
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
    restType: {
      type: Number,
      default: 1,
    },
    businessType: {
      type: [String, Number],
      default: '',
    },
    disabledDrafts: {
      type: Boolean,
      default: false,
    },
    // 评语内容
    comment: {
      type: String,
      default: '',
    },
    // 评分
    score: {
      type: [String, Number],
      default: '',
    },
    // 是否已评分, 为false表示未提交实验报告，不显示评分及评语
    scored: {
      type: Boolean,
      default: false,
    },
  },
  // 监听是否全屏加类名判断样式
  data() {
    return {
      fileSize: 1024 * 1024 * 1024,
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
    saveDrafts() {
      if (!this.disabledDrafts) {
        this.$emit('submitDrafts', this.markNotes);
      }
    },
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
        if (item[0].size > this.fileSize) {
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
        if (file.size > this.fileSize) {
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
  max-height: 540px;
  overflow: auto;
  padding-right: 20px;

  .saveNotes {
    float: right;
    margin-top: 15px;
    z-index: 1000;
    position: relative;
    margin-left: 10px;
  }
  .save-btn-full {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
}
.my-pass-notes {
  .my-notes-title {
    margin-bottom: 15px;
  }
  .my-notes-comment {
    width: calc(100% - 180px);
  }
  .my-notes-score {
    .passStatus {
      height: 32px;
      line-height: 32px;
      border-radius: 2px;
      padding: 0 12px;
      margin-left: 13px;
      color: var(--red-color);
      background: var(--red-color-2);
    }
    .score {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      font-family: Arial;
      font-weight: 400;
      color: var(--primary-color);
    }
  }
}
.my-pass-notes .my-notes-title,
.my-pass-notes .my-notes-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
