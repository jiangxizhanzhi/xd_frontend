<template>
  <div class="cene-config-detail">
    <cb-form
      :ref="ref"
      :model="model"
      :rules="rules"
      :label-width="handlerWidth()"
    >
      <cb-form-item
        :label="$t('crEvent.sceneName')"
        prop="name"
        class="padding"
      >
        <cb-input v-model="model.name" @blur="removeBlank" />
      </cb-form-item>
      <cb-form-item
        :label="$t('crEvent.sceneDesc')"
        prop="description"
        class="padding"
      >
        <cb-input
          v-model="model.description"
          type="textarea"
          @blur="removeBlank"
        />
      </cb-form-item>
      <cb-form-item :label="$t('crEvent.cover')" prop="logo" class="padding">
        <cb-input v-model="model.logo" style="display: none" />
        <cb-button color-type="hollow" icon="icon-daoru" @click="openUploadImg">
          {{ $t('common.import') }}
        </cb-button>
        <br />
        <img
          class="showImg"
          v-if="model.logo && model.logo !== ''"
          :src="model.logo"
        />
      </cb-form-item>
      <div class="category">
        <cb-form-item :label="$t('crEvent.trainCategory')" prop="category">
          <cb-select v-model="model.category" :options="trainCategoryCom" />
        </cb-form-item>
      </div>
      <cb-form-item :label="$t('crEvent.trainDifficulty')" prop="difficult">
        <div style="display: flex; height: 36px">
          <cb-radio
            v-for="(diff, index) in $CONSTANT.LIST.TeamTrain.Difficult"
            :key="index"
            v-model="model.difficult"
            :label="diff.value"
            >{{ diff.name }}
          </cb-radio>
        </div>
      </cb-form-item>
      <cb-form-item :label="$t('crEvent.adviceTime')" prop="duration_time">
        <cb-input style="width: auto" v-model="model.duration_time">
          <template slot="append">{{ $t('crEvent.hour') }}</template>
        </cb-input>
      </cb-form-item>
      <!-- 单兵前置技能-->
      <div class="addLabel">
        <cb-form-item
          :label="$t('crEvent.prepositionSkill')"
          prop="pre_skill"
          class="padding"
        >
          <cb-form-tags
            ref="preTag"
            v-model="model.pre_skill"
            :listMaxLen="30"
            :customInputReg="comValidatePre"
          />
        </cb-form-item>
      </div>
      <div class="addLabel trainLabel">
        <cb-form-item
          :label="$t('crEvent.trainSkill')"
          prop="train_skill"
          class="padding"
        >
          <cb-form-tags
            ref="trainTag"
            :value="model.train_skill"
            :listMaxLen="30"
            :customInputReg="comValidate"
          />
        </cb-form-item>
      </div>
    </cb-form>
    <cb-dialog :visible.sync="dialogVisible" :title="$t('common.courseUpload')">
      <span class="modal-style">
        <cutimg
          :businessType="BUSINESS_TYPE.CR_CMS_SINGLE"
          @sendFormData="getImgUrl"
        ></cutimg>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import Cutimg from '@/components/cut-img/index-admin.vue';
import {
  validateScenseDescriptionLength,
  validateTime,
  validateTrainTitleLength,
} from '@/utils/rules-cms';
import { validateLength } from '@/utils/validate-cms';
import { getI18n } from '@/lang/';
import { BUSINESS_TYPE } from '@/pages/cms/cr-event/constants.js';

export default {
  name: 'CrEventsingleTrainDetail',
  components: {
    Cutimg,
  },
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    editId: {
      type: [Number, String],
      default: 0,
    },
    questionType: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      ref: 'form',
      BUSINESS_TYPE,
      dataArr: [],
      dialogVisible: false,
      value: '',
      isCheck: true,
      isSkillFormat: true,
      isCheckOne: true,
      isSkillFormatOne: true,
      noRepeat: true,
      noRepeatOne: true,
      cur_step: 1,
      model: this.baseInfo,
      rules: {
        name: [
          {
            required: true,
            message: this.$t('crEvent.inputSceneName'),
            trigger: 'blur',
          },
          //验证名称1-255字符
          {
            validator: validateTrainTitleLength(this.editId, this.questionType),
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: this.$t('crEvent.pleaseInputDescription'),
            trigger: 'blur',
          },
          //描述字数无限制
          { validator: validateScenseDescriptionLength, trigger: 'blur' },
        ],
        // logo: [
        //   {
        //     required: true,
        //     message: this.$t('crEvent.plzUploadCover'),
        //     trigger: ['blur', 'change'],
        //   },
        // ],
        category: [{ required: true }],
        difficult: [{ required: true }],
        duration_time: [
          {
            required: true,
            message: this.$t('crEvent.pleaseInputTime'),
            trigger: 'blur',
          },
          { validator: validateTime, trigger: 'blur' },
        ],
        pre_skill: [
          {
            required: true,
            message: this.$t('crEvent.enterPreSkills'),
            trigger: 'blur',
          },
        ],
        train_skill: [
          {
            required: true,
            message: this.$t('crEvent.enterTrainingObject'),
            trigger: 'blur',
          },
        ],
      },
      labels: {
        name: this.$t('table.name'),
      },
      activeName: 'base',
    };
  },
  computed: {
    $form() {
      return this.$refs[this.ref];
    },
    lang() {
      if (getI18n().locale !== 'zh-CN') {
        var language = 'en';
      } else {
        language = 'zh-CN';
      }
      return language;
    },
    // trainCategoryCom() {
    //   let arr = [];
    //   const datas = this.$CONSTANT.LIST.TrainCategory;
    //   _.forEach(datas, (item) => {
    //     arr.push({
    //       label: item.name.toString(),
    //       value: item.value,
    //     });
    //   });
    //   return arr;
    // },
    trainCategoryCom() {
      let arr = [];
      _.forEach(this.dataArr, (item) => {
        arr.push({
          label: item.name.toString(),
          value: item.code,
        });
      });
      return arr;
    },
  },
  watch: {
    noRepeat: {
      immediate: true,
      handler(val) {
        this.$emit('sendRepeat', val);
      },
    },
    noRepeatOne: {
      immediate: true,
      handler(val) {
        this.$emit('sendRepeatOne', val);
      },
    },
    error() {
      if (this.error) {
        this.$message({
          message: this.error,
          type: 'error',
        });
      }
    },
    baseInfo: function (value) {
      this.model = value;
    },
    isCheck: {
      immediate: true,
      handler(val) {
        this.$emit('sendVal', val);
      },
    },
    isCheckOne: {
      immediate: true,
      handler(val) {
        this.$emit('sendValOne', val);
      },
    },
    isSkillFormat: {
      immediate: true,
      handler(val) {
        this.$emit('sendFormat', val);
      },
    },
    isSkillFormatOne: {
      immediate: true,
      handler(val) {
        this.$emit('sendFormatOne', val);
      },
    },
  },
  created() {
    // 单兵训练类别请求
    this.$request
      .get('/cr/common/constants_config', { type: 3 }, { baseURL: '/api/ojj' })
      .then((res) => {
        this.dataArr = res.data.data;
      });
  },
  methods: {
    openUploadImg() {
      this.dialogVisible = true;
    },
    getImgUrl(data) {
      this.model.logo = data;
      this.dialogVisible = false;
    },
    // 训练目标
    comValidate(value) {
      // 如果为全部空格,不让新增
      this.value = value;
      if (this.value.length === 0) {
        this.isCheckOne = true;
        this.isSkillFormatOne = true;
        this.noRepeatOne = true;
        return true;
      }
      if (value) {
        const num = validateLength(value);
        if (this.model.train_skill.includes(value)) {
          this.noRepeatOne = false;
          this.isCheckOne = true;
          this.isSkillFormatOne = true;
          this.$message.error(this.$t('crEvent.repeatMsg'));
          return false;
        } else if (!/^[(\u4E00-\u9FA5)A-Za-z0-9_-\s]+$/.test(value)) {
          this.$message.error(this.$t('crEvent.contentError'));
          this.isSkillFormatOne = false;
          this.noRepeatOne = true;
          this.isCheckOne = true;
          return false;
        } else if (num < 1 || num > 255) {
          this.$message.error(this.$t('crEvent.lengthLint255'));
          this.isCheckOne = false;
          this.noRepeatOne = true;
          this.isSkillFormatOne = true;
          return false;
        } else {
          this.noRepeatOne = true;
          this.isCheckOne = true;
          this.isSkillFormatOne = true;
          return true;
        }
      }
    },

    // 前置技能
    comValidatePre(value) {
      // 如果为全部空格,不让新增
      this.value = value;
      if (this.value.length === 0) {
        this.isCheck = true;
        this.isSkillFormat = true;
        this.noRepeat = true;
        return true;
      }
      if (value) {
        const num = validateLength(value);
        if (this.model.pre_skill.includes(value)) {
          this.noRepeat = false;
          this.isSkillFormat = true;
          this.isCheck = true;
          this.$message.error(this.$t('crEvent.repeatMsg'));
          return false;
        } else if (!/^[(\u4E00-\u9FA5)A-Za-z0-9_-\s]+$/.test(value)) {
          this.$message.error(this.$t('crEvent.contentError'));
          this.isSkillFormat = false;
          this.noRepeat = true;
          this.isCheck = true;
          return false;
        } else if (num < 1 || num > 255) {
          this.$message.error(this.$t('crEvent.lengthLint255'));
          this.isCheck = false;
          this.noRepeat = true;
          this.isSkillFormat = true;
          return false;
        } else {
          this.noRepeat = true;
          this.isCheck = true;
          this.isSkillFormat = true;
          return true;
        }
      }
    },
    handlerWidth() {
      if (this.lang === 'en') {
        return 120 + 'px';
      } else {
        return 80 + 'px';
      }
    },
    // 输入数据处理去空格
    removeBlank() {
      this.model.name = this.model.name.trim();
      this.model.description = this.model.description.trim();
    },
    to_next_step() {
      this.cur_step += 1;
    },
    to_pre_step() {
      this.cur_step -= 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.cb-form-tags {
  ::v-deep.cb-tag {
    margin-bottom: 10px;
  }
  ::v-deep.cb-button {
    margin-bottom: 10px;
  }
  ::v-deep.cb-input {
    margin-bottom: 10px;
  }
}

.addLabel {
  ::v-deep.el-form-item__error {
    top: 80%;
  }
}
.trainLabel {
  margin-top: -20px;
}
.app-container .scene-config-detail {
  padding: 0;
}
.padding {
  padding-bottom: 15px;
}
.scene-config-detail {
  position: relative;
  .help-doc,
  .help-doc:focus,
  .help-doc:hover {
    color: #409eff;
  }
  .config-saver {
    position: absolute;
    right: 26px;
    top: 66px;
    z-index: 100;
  }
  .markdown-body {
    .v-note-op {
      button.op-icon.fa-mavon-floppy-o {
        display: none;
      }
    }
  }
  .scene-config-editor {
    height: 600px;
  }
  .scene-file {
    position: absolute;
    left: 205px;
    top: 25px;
  }
  .config-card {
    & > .el-tabs__content {
      overflow: hidden;
    }
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .button-pre-next {
    padding-left: 40%;
    margin-top: 15%;
  }
  .difficulty {
    display: inline-block;
  }
  .category {
    display: inline-block;
    padding-bottom: 15px;
  }
  .time {
    display: inline-block;
    padding-left: 100px;
  }
  .nav {
    width: 28%;
    background-color: #f5f5f5;
  }
  .nav-first-item-cur-step {
    margin-top: 3%;
    margin-bottom: 3%;
    margin-left: 12%;
    font-size: 15px;
    .el-breadcrumb__inner {
      color: #409eff;
    }
  }
  .nav-first-item {
    margin-top: 3%;
    margin-bottom: 3%;
    margin-left: 12%;
    font-size: 15px;
  }
  .nav-item-cur-step {
    margin-top: 3%;
    margin-bottom: 3%;
    font-size: 15px;
    .el-breadcrumb__inner {
      color: #409eff;
    }
  }
  .nav-item {
    margin-top: 3%;
    margin-bottom: 3%;
    font-size: 15px;
  }
  .tips {
    font-size: 12px;
    color: #f56c6c;
    line-height: 3px;
  }
  .addIcon {
    // margin-right: 4px;
    color: #f56c6c;
    display: inline-block;
  }

  .custom-input-error {
    width: 220px;
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
</style>
