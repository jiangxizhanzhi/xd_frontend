<template>
  <cb-inner-page :background="false">
    <div class="form-box" :style="commonMarginRightStyle">
      <cb-form
        class="elc-form"
        ref="formRef"
        :url="url"
        :model.sync="model"
        :rules="rules"
        :id="id && { resource_id: id }"
        :label-width="labelWidthForm"
        :contentType="contentType"
        baseURL="/api/ojj"
        :isBgColor="true"
      >
        <cb-form-item :label="$t('m.practiceName')" prop="name">
          <cb-input v-model="model.name"></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('m.type')" prop="practice_type">
          <cb-select
            v-model="model.practice_type"
            :options="exeType"
          ></cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('course.cover')" prop="Logo">
          <cb-button
            :hollow="true"
            buttonType="import"
            @click="openUploadImg"
            >{{ $t('m.import') }}</cb-button
          >
        </cb-form-item>
        <cb-form-item style="margin-bottom: 0">
          <img class="showImg" v-if="model.logo !== ''" :src="model.logo" />
          <cb-iconfont
            class="imgdel el-icon-circle-close"
            type="iconshanchu"
            v-if="model.logo !== ''"
            @click.native="delimg"
          ></cb-iconfont>
        </cb-form-item>
        <cb-form-item :label="$t('m.isPublic')" prop="public">
          <cb-switch
            active-color="#52c41a"
            v-model="model.is_public"
          ></cb-switch>
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button @click="apply" mr="mr">{{
            $t('button.confirm')
          }}</cb-button>
          <cb-button buttonType="cancel" @click="back">{{
            $t('button.cancel')
          }}</cb-button>
        </div>
      </cb-form>
    </div>
    <cb-dialog :visible.sync="dialogVisible" :title="$t('m.logoUpload')">
      <span class="modal-style">
        <cutimg
          :businessType="BUSINESS_TYPE.OJ_CMS_EXERCISE_GATHER"
          @sendFormData="getImgUrl"
        />
      </span>
    </cb-dialog>
  </cb-inner-page>
</template>
<script>
import Cutimg from '@/components/cut-img/index.vue';
import { EXERTYPE } from './exercise-constants.js';
import Validate from '@/utils/validate.js';
import { BUSINESS_TYPE } from '@/pages/cms/course-mod/course-constant.js';
export default {
  components: {
    Cutimg,
    Validate,
  },
  props: {
    id: {
      type: String,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      // 习题分类
      exeType: [],
      BUSINESS_TYPE,
      EXERTYPE,
      url: '/oj/admin/practice/set/',
      contentType: 'application/json',
      model: {
        name: '',
        practice_type: 0,
        logo: '',
        is_public: false,
      },
      error: '',
      rules: {
        // name: [{ required: true, validator: Validate.name, trigger: 'blur' }],
        name: [
          {
            required: true,
            validator: Validate.name,
            trigger: ['blur', 'change'],
          },
        ],
        practice_type: [
          {
            required: true,
            message: this.$t('m.pleaseSelectCategory'),
            trigger: 'change',
          },
        ],
      },
      dialogVisible: false,
    };
  },
  computed: {
    commonMarginRightStyle() {
      return {
        marginRight: `16px`,
      };
    },
    labelWidth() {
      return this.$store.state.app.labelWidth;
    },
    labelWidthForm() {
      return `${this.labelWidth}px`;
    },
  },
  mounted() {
    this.getExeType();
    const that = this;
    if (that.id) {
      that.$refs.formRef.getModelData();
    }
  },
  methods: {
    getExeType() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 12,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              value: item.code,
              label: item.name,
            };
          });
          this.exeType = arr;
        });
    },
    delimg() {
      this.model.logo = '';
    },
    getImgUrl(data) {
      // 图片获取
      this.model.logo = data;
      this.dialogVisible = false;
    },
    openUploadImg() {
      this.dialogVisible = true;
    },
    back() {
      this.$router.push({ name: 'exercises' });
    },
    apply() {
      const that = this;
      that.error = '';
      that.$refs.formRef
        .submit()
        .then(() => {
          that.$router.push({
            name: 'exercises',
          });
        })
        .catch((err) => {});
    },
  },
};
</script>
<style scoped lang="scss">
.form-box {
  padding: 12px 0 20px;
  .el-form-item {
    ::v-deep {
      &.el-form-item__label {
        font-weight: bold;
      }
    }
  }
}
.showImg {
  width: 380px;
  position: relative;
}
.imgdel {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: -7px;
  left: 375px;
  z-index: 99;
  cursor: pointer;
}
</style>
<style lang="scss">
.el-dialog__wrapper {
  .el-dialog__header {
    background: transparent !important;
  }
}
</style>
