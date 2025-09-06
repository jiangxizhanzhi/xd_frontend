<template>
  <div class="cropper-component">
    <div class="info-item">
      <div class="img-con">
        <div class="operation-box img-left">
          <div class="cropper">
            <vue-cropper
              ref="cropper"
              :img="option.img"
              :output-size="option.size"
              :output-type="option.outputType"
              :info="option.info"
              :full="option.full"
              :can-move="option.canMove"
              :can-move-box="option.canMoveBox"
              :original="option.original"
              :auto-crop="option.autoCrop"
              :auto-crop-width="imgSize.width"
              :auto-crop-height="imgSize.height"
              :fixed-box="option.fixedBox"
              :center-box="true"
              @realtime="realTime"
              @imgload="imgLoad"
            ></vue-cropper>
          </div>
        </div>
        <input
          id="file_input"
          style="margin-left: 20px; margin-top: 15px"
          type="file"
          capture="camera"
          hidden=""
        />
      </div>
      <div class="btn-box" style="text-align: right">
        <label class="btn" for="uploads" style="float: left"
          >&#x9009;&#x62E9;&#x56FE;&#x7247;</label
        >
        <input
          id="uploads"
          type="file"
          :value="imgFile"
          style="position: absolute; clip: rect(0 0 0 0); width: 1px"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="uploadImg($event, 1)"
        />
        <div class="btn" @click="compressImg()">
          &#x4E0A;&#x4F20;&#x56FE;&#x7247;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Https from '@/utils/http.js';
import { VueCropper } from 'vue-cropper';

export default {
  name: 'Cropper',
  components: {
    VueCropper,
  },
  props: {
    uploadType: {
      type: String,
      default: null,
    },
    imgSize: {
      default: function () {
        return {
          width: 300,
          height: 170,
        };
      },
      type: Object,
    },
  },
  data() {
    return {
      // 剪切图片上传
      crap: false,
      previews: {},
      option: {
        img: '', // 裁剪图片的地址
        aspectRatio: 500 / 300, // 默认比例
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: false, // 输出原图比例截图 props名full
        outputType: 'png', // 裁剪生成额图片的格式
        canMove: true, // 能否拖动图片
        original: false, // 上传图片是否显示原始宽高
        canMoveBox: true, // 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        resizable: false,
        autoCropWidth: 500,
        autoCropHeight: 300,
        fixedBox: true,
      },
      fileName: '', // 本机文件地址
      downImg: '#',
      imgFile: '',
      fixed: true,
      uploadImgRelaPath: '', // 上传后的图片的地址（不带服务器域名）
    };
  },
  computed: {},
  methods: {
    // 放大/缩小
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 坐旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    // 下载图片
    down(type) {
      var aLink = document.createElement('a');
      aLink.download = 'author-img';
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          this.downImg = window.URL.createObjectURL(data);
          aLink.href = window.URL.createObjectURL(data);
          aLink.click();
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.downImg = data;
          aLink.href = data;
          aLink.click();
        });
      }
    },
    // 选择本地图片
    uploadImg(e, num) {
      var _this = this;
      // 上传图片
      var file = e.target.files[0];
      _this.fileName = file.name;
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
        return false;
      }
      var reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          _this.option.img = data;
        } else if (num === 2) {
          _this.example2.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },
    imgLoad(msg) {},
    compressImg() {
      const _self = this;
      // this.$refs.cropper.startCrop()
      this.$refs.cropper.getCropData((data) => {
        const file = _self.convertBase64UrlToBlob(data);
        file.name = 'head.jpg';
        _self.uploadAction(file);
      });
    },
    uploadAction(file) {
      const param = new FormData(); // 创建form对象
      param.append('image', file, file.name); // 通过append向form对象添加数据
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      // 添加请求头
      Https.postAxios('/public/image_upload/', param, config).then((res) => {
        this.$emit('onSelect', res.data.url); // 传值
      });
    },
    // 将base64的图片转换为file文件
    convertBase64UrlToBlob(urlData) {
      const bytes = window.atob(urlData.split(',')[1]); // 去掉url的头，并转换为byte
      // 处理异常,将ascii码小于0的转换为大于0
      const ab = new ArrayBuffer(bytes.length);
      const ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/jpeg' });
    },
  },
};
</script>

<style scoped>
.modal-style {
  width: 100%;
}

.cropper-component {
  width: 100%;
  margin: 0 auto;
  position: relative;
}
.btn-box {
  margin: 20px 0;
}
.btn {
  padding: 4px 12px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(58, 117, 239, 1);
  box-shadow: 0px 0px 6px 0px rgba(107, 197, 255, 0.56);
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  border-radius: 30px;
}
.btn:hover {
  background-color: rgba(50, 107, 226, 1);
}
.operation-btn {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #eaeaea;
  cursor: pointer;
  display: inline-block;
  font-size: 20px;
  color: #333;
  padding: 0;
  margin: 0 10px;
}
.operation-box {
  display: inline-block;
}
.cropper {
  width: 100%;
  height: 400px;
}
.preview-box {
  top: 60px;
  right: 10px;
}
.preview {
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
  background-color: #ccc;
  margin: 5px;
  overflow: hidden;
}

.img-con {
  display: flex;
}

.img-left {
  flex: 0 0 100%;
}
auto .img-right {
  flex: 0 0 auto;
}
</style>
