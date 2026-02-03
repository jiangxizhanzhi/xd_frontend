<template>
  <div class="cb-upload-image">
    <!-- 图片列表 -->
    <div
      v-show="fileList.length > 0"
      class="cb-upload-image__list single-image-upload"
    >
      <section
        :style="imageStyle"
        v-for="(item, index) in fileList"
        :key="'cb-img-list-' + index"
      >
        <cb-image :style="imageStyle" :src="item.url" :fit="fit"></cb-image>
        <div class="img-hover">
          <cb-button-group>
            <cb-button type="text" @click="previewItem(item, index)"
              >{{ $t('g.preview') }}
            </cb-button>
            <cb-button
              v-if="!disabled"
              type="text"
              button-type="delete"
              @click="deleteItem(item, index, true, $event)"
            ></cb-button>
          </cb-button-group>
        </div>
      </section>
    </div>
    <cb-upload
      v-if="!disabled"
      drag
      :action="action"
      :limit="listNumber"
      :accept="acceptType"
      :multiple="multipleCustom"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :show-file-list="false"
      class="single-image-upload"
    >
      <div class="upload-icon">
        <cb-iconfont
          class="upload-icon__plus"
          type="icon-xinzeng"
          themed-color="--neutral5"
          size="32"
        ></cb-iconfont>
      </div>
      <cb-image-preview
        :url-list="imgList"
        :initial-index="imageIndex"
        v-model="isShow"
      ></cb-image-preview>
    </cb-upload>
    <div slot="tip" class="prompt-msg" v-if="!$slots.tip && tip">
      {{ tip }}
    </div>
    <div slot="tip" class="prompt-msg" v-if="$slots.tip">
      <!-- @slot message 提示信息插槽 -->
      <slot name="tip"> </slot>
    </div>
  </div>
</template>

<script>
import CbIconfont from '../../iconfont';
import { Image } from 'element-ui'
import CbImagePreview from '../../image-preview'
/**
 * @displayName cb-upload-image 图片上传
 * @classify Form/表单
 */
export default {
  name: 'CbUploadImage',
  components: {
    CbIconfont,
    'cb-image':Image,
    CbImagePreview
   },
  props: {
    /**
     * 图片填充方式
     * @values fill / contain / cover / none / scale-down
     */
    fit: {
      type: String,
      default: 'cover',
    },
    /**
     * 接受文件类型
     * @values '.jpg,.png,.jpeg,.gif,.svg'
     */
    accept: {
      type: String,
      default: '',
    },
    /**
     * 上传文件个数限制
     *
     */
    limit: {
      type: Number,
      default: 1,
    },
    /**
     * 上传文件地址
     *
     */
    action: {
      type: String,
      default: '',
    },
    /**
     * 自定义上传
     */
    fetchPromise: {
      type: Function,
      default: null,
    },
    /**
     * 上传文件最大的大小,单位B
     */
    fileSize: {
      type: Number | String,
      default: '',
    },
    /**
     * 绑定值
     */
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    /**
     * 临时api
     */
    rename: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 预览图片大小
     */
    imageWidth: {
      type: Number | String,
      default: 100,
    },
    /**
     * 控制是否支持多选文件
     */
    multiple: {
      type: null,
      default: null,
    },
    /**
     * 文字提示信息
     */
    tip: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fileList: [],
      isShow: false,
      imageIndex: 0,
      acceptType: '',
    };
  },
  computed: {
    imgList() {
      const arr = [];
      this.fileList.forEach((element) => {
        arr.push(element.url);
      });
      return arr;
    },
    listNumber() {
      let num = 0;
      this.limit !== 1 ? (num = this.limit) : (num = 1000);
      return num;
    },
    multipleCustom() {
      if (this.multiple !== null) {
        return this.multiple;
      } else {
        return this.limit > 1;
      }
    },
    imageStyle() {
      return {
        width: this.imageWidth + 'px',
      };
    },
  },
  mounted() {
    this.fileList = this.value;
    this.acceptType = this.accept || '.jpg,.png,.jpeg,.gif,.svg';
  },
  watch: {
    value(val) {
      this.fileList = val;
    },
  },
  methods: {
    /**
     * 清除已上传文件列表
     * this.$refs[xxx].clearFiles()调用
     * @event success
     * @type {object}
     */
    clearFiles() {
      this.fileList = [];
      this.$refs.uploads.clearFiles();
    },
    requestData(bool) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (bool) {
            resolve();
          } else {
            reject();
          }
        }, 500);
      });
    },
    //文件上传之前的钩子
    beforeUpload(file) {
      // 文件上传的大小限制
      if (file.size === 0) {
        this.$message.warning(this.$t('g.notNullFile'));
        return false;
      }
      // 过大限制
      if (file.size > this.fileSize && this.fileSize != '') {
        this.$message.warning(
          this.$t('g.outofFileSizeLimit', {
            size: (this.fileSize / 1024 / 1024).toFixed(2),
          }),
        );
        return false;
      }
      // 文件上传类型再次校验
      const fileType =
        '.' + file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      const typeArr = this.acceptType.split(',');
      const isType = typeArr.includes(fileType);
      if (!isType && this.acceptType !== '') {
        this.$message.error(this.$t('g.errorFileType'));
        return false;
      }
      if (this.limit === 1) {
        this.fileList.splice(0, this.fileList.length);
      }
      if (this.rename) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.fileList.push({ name: file.name, url: e.target.result });
          this.$emit('input', this.fileList);
        };
      }
      if (this.fetchPromise) {
        this.fetchPromise(file);
      }
      return !this.fetchPromise;
    },
    //删除
    deleteItem(item, index, bool, done) {
      this.fileList.splice(index, 1);
      this.requestData(bool)
        .then(() => {
          done();
        })
        .catch(() => {
          // 不弹出成功提示
          done(false);
        });
      /**
       * 删除方法
       * @event delete
       * @property {object} 删除子项的信息
       */
      this.$emit('delete', item);
    },
    // 预览
    previewItem(item, index) {
      this.imageIndex = index;
      this.isShow = true;
      /**
       * 预览方法
       * @event preview
       * @property {object} 预览的详细信息
       */
      this.$emit('preview', item);
    },
    onSuccess(response, file, fileList) {
      //多文件上传
      if (Array.isArray(response)) {
        this.fileList = this.fileList.concat(response);
      } else {
        this.fileList.push(response);
      }
      /**
       * 上传成功的回调
       * @event input
       * @property {Array} 文件列表
       */
      this.$emit('input', this.fileList);
    },
    //文件超过限制
    handleExceed(files, fileList) {
      if (files.length + fileList.length > this.limit) {
        this.$message.warning(
          this.$t('g.outLimitCount', { limit: this.limit }),
        );
      }
    },
  },
};
</script>
