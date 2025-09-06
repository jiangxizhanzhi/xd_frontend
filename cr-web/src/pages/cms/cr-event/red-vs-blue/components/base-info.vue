<template>
  <div class="scene-config-detail">
    <cb-form
      class="scene-steps-form"
      ref="base-info"
      :model="model"
      :rules="rules"
      :label-width="handlerWidth()"
    >
      <cb-form-item :label="$t('crEvent.sceneName')" prop="name">
        <cb-input v-model="model.name" @blur="removeBlank" />
      </cb-form-item>
      <cb-form-item :label="$t('crEvent.sceneDesc')" prop="description">
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
      <div>
        <div class="difficulty">
          <cb-form-item
            :label="$t('crEvent.trainDifficulty')"
            prop="difficult"
            style="display: inline"
          >
            <div style="display: flex; height: 36px">
              <cb-radio
                v-for="(diff, index) in $CONSTANT.LIST.CeBase.Difficult"
                :key="index"
                v-model="model.difficult"
                :label="diff.value"
                >{{ diff.name }}
              </cb-radio>
            </div>
          </cb-form-item>
        </div>
        <div class="team_category">
          <cb-form-item :label="$t('crEvent.trainCategory')" prop="category">
            <!-- 训练类型 -->
            <cb-select v-model="model.category" :options="categoryCom" />
          </cb-form-item>
        </div>
      </div>
      <div>
        <div class="team_time">
          <cb-form-item :label="$t('crEvent.adviceTime')" prop="duration_time">
            <cb-input v-model="model.duration_time">
              <template slot="append">{{
                lang === 'en' ? 'Hours' : '小时'
              }}</template>
            </cb-input>
          </cb-form-item>
        </div>
      </div>
      <div class="addLabel">
        <!-- 红蓝前置技能 -->
        <cb-form-item
          :label="$t('crEvent.prepositionSkill')"
          prop="pre_skill"
          class="padding"
        >
          <cb-form-tags
            ref="preTag"
            v-model="model.pre_skill"
            :listMaxLen="30"
            :customInputReg="customInputRegSkill"
          />
        </cb-form-item>
      </div>
      <div>
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
              :customInputReg="customInputRegTrain"
            />
          </cb-form-item>
        </div>
      </div>
      <!-- <cb-form-item :label="$t('crEvent.roleList')" prop="roleList">
          <config-roles ref="a" :roles="roleList" />
        </cb-form-item> -->
      <!--      </el-form>-->
    </cb-form>
    <cb-dialog :visible.sync="dialogVisible" :title="$t('common.courseUpload')">
      <span class="modal-style">
        <cutimg
          :businessType="BUSINESS_TYPE.CR_CMS_RED"
          @sendFormData="getImgUrl"
        ></cutimg>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import Cutimg from '@/components/cut-img/index-admin.vue';
import { validateLength } from '@/utils/validate-cms';
import { validateTime, validateTrainTitleLength } from '@/utils/rules-cms';
import { validateScenseDescriptionLength } from '@/utils/rules-cms';
import { getI18n } from '@/lang/';
import { BUSINESS_TYPE } from '@/pages/cms/cr-event/constants.js';
export default {
  name: 'CrEventTramTrainDetail',
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
    roleList: {
      type: Array,
      default() {
        return [];
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
    support_partial_start: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    // 校验输入人数
    const validatePeopleNum = (rule, value, callback) => {
      const number = /^[1-9][0-9]*$/;
      if (!number.test(value)) {
        callback(this.$t('crEvent.validateTrainees'));
      } else if (value > 100) {
        callback(this.$t('crEvent.validateTraineesNum'));
      } else {
        callback();
      }
    };

    return {
      BUSINESS_TYPE,
      dataArr: [],
      dialogVisible: false,
      value: '',
      isCheck: true,
      isSkillFormat: true,
      noRepeat: true,
      noRepeatOne: true,
      isCheckOne: true,
      isSkillFormatOne: true,
      url: '/admin/cr_scene/cr_scene_configs/',
      inputRoleNameErrorType: '',
      inputRoleDescErrorType: '',
      inputRoleInfoError: false,
      cur_step: 1,
      addRoleVisible: false,
      deleteVisible: false,
      slotVisible: true,
      roleKey: [],
      model: this.baseInfo,
      roleName: '',
      roleDescription: '',
      rules: {
        name: [
          {
            required: true,
            message: this.$t('crEvent.inputSceneName'),
            trigger: 'blur',
          },
          // 名称1-255字符
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
          // 描述不做校验
          { validator: validateScenseDescriptionLength, trigger: 'blur' },
        ],
        difficult: [
          {
            required: true,
            message: this.$t('crEvent.pleaseInputDescription'),
            trigger: 'blur',
          },
        ],
        // logo: [
        //   {
        //     required: true,
        //     message: this.$t('crEvent.plzUploadCover'),
        //     trigger: ['blur', 'change'],
        //   },
        // ],
        category: [
          {
            required: true,
            message: this.$t('crEvent.pleaseInputDescription'),
            trigger: 'blur',
          },
        ],
        duration_time: [
          {
            required: true,
            message: this.$t('crEvent.pleaseInputTime'),
            trigger: 'blur',
          },
          { validator: validateTime, trigger: 'blur' },
        ],
        people_number: [
          {
            required: true,
            message: this.$t('crEvent.pleaseInputNumber'),
            trigger: 'blur',
          },
          { validator: validatePeopleNum, trigger: 'blur' },
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
    lang() {
      if (getI18n().locale !== 'zh-CN') {
        var language = 'en';
      } else {
        language = 'zh-CN';
      }
      return language;
    },
    // 红蓝训练类型选择
    // categoryCom() {
    //   let arr = [];
    //   const datas = this.$CONSTANT.LIST.CeBase.Category;
    //   _.forEach(datas, (item) => {
    //     arr.push({
    //       label: item.name.toString(),
    //       value: item.value,
    //     });
    //   });
    //   return arr;
    // },
    categoryCom() {
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
    baseInfo(val) {
      this.model = val;
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
  mounted() {},
  created() {
    // 训练类别请求
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
    customInputRegSkill(value) {
      return this.customInputReg(value);
    },
    customInputRegTrain(value) {
      return this.customInputRegTrain(value);
    },
    // 训练目标
    customInputRegTrain(value) {
      this.value = value;
      // 如果为全部空格,不让新增
      if (this.value.length === 0) {
        this.isCheckOne = true;
        this.isSkillFormatOne = true;
        this.noRepeatOne = true;
        return true;
      }
      if (value) {
        if (this.model.train_skill.includes(value)) {
          this.$message.error(this.$t('crEvent.repeatMsg'));
          this.noRepeatOne = false;
          this.isSkillFormatOne = true;
          this.isCheckOne = true;
          return false;
        } else if (!/^[(\u4E00-\u9FA5)A-Za-z0-9_-\s]+$/.test(value)) {
          this.$message.error(this.$t('crEvent.contentError'));
          this.isSkillFormatOne = false;
          this.noRepeatOne = true;
          this.isCheckOne = true;
          return false;
        } else if (validateLength(value) < 1 || validateLength(value) > 255) {
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
    // 前置技能验证
    customInputReg(value) {
      this.value = value;
      // 如果为全部空格,不让新增
      if (this.value.length === 0) {
        this.isCheck = true;
        this.isSkillFormat = true;
        this.noRepeat = true;
        return true;
      }
      if (value) {
        if (this.model.pre_skill.includes(value)) {
          this.$message.error(this.$t('crEvent.repeatMsg'));
          this.noRepeat = false;
          this.isSkillFormat = true;
          this.isCheck = true;
          return false;
        } else if (!/^[(\u4E00-\u9FA5)A-Za-z0-9_-\s]+$/.test(value)) {
          this.$message.error(this.$t('crEvent.contentError'));
          this.isSkillFormat = false;
          this.noRepeat = true;
          this.isCheck = true;
          return false;
        } else if (validateLength(value) < 1 || validateLength(value) > 255) {
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
    ab() {
      return this.$refs.a.validateValue;
    },
    // 输入数据处理去空格
    removeBlank() {
      // this.model.name = this.model.name.trim();
      // this.model.description = this.model.description.trim();
    },

    // 展示添加角色内容
    addRole() {
      this.addRoleVisible = true;
    },
    // 取消添加角色的操作
    addRoleCancel() {
      this.roleName = '';
      this.roleDescription = '';
      this.inputRoleNameErrorType = '';
      this.inputRoleDescErrorType = '';
      this.inputRoleInfoError = false;
      this.$refs['base-info'].clearValidate(['roleName', 'roleDescription']);
      this.addRoleVisible = false;
    },
    // 校验输入的角色信息
    validateInputRoleName() {
      const roleName = this.roleName;
      if (roleName === '') {
        this.inputRoleNameErrorType =
          this.$CONSTANT.ValidateErrorType.inputRoleNameErrorType.RoleNameEmptyError.value;
      } else if (!validateLength(roleName)) {
        this.inputRoleNameErrorType =
          this.$CONSTANT.ValidateErrorType.inputRoleNameErrorType.RoleNameError.value;
      } else if (
        validateLength(roleName) < 4 ||
        validateLength(roleName) > 40
      ) {
        this.inputRoleNameErrorType =
          this.$CONSTANT.ValidateErrorType.inputRoleNameErrorType.RoleNameLengthError.value;
      } else if (this.roleKey.includes(roleName.replace(/^\s*|\s*$/g, ''))) {
        this.inputRoleNameErrorType =
          this.$CONSTANT.ValidateErrorType.inputRoleNameErrorType.RoleNameExistError.value;
      } else {
        this.inputRoleNameErrorType = '';
        return true;
      }
    },
    // 校验输入的角色描述信息
    validateInputRoleDesc() {
      const roleDescription = this.roleDescription;
      if (roleDescription === '') {
        this.inputRoleDescErrorType =
          this.$CONSTANT.ValidateErrorType.inputRoleDescErrorType.DescEmptyError.value;
      } else if (!validateLength(roleDescription)) {
        this.inputRoleDescErrorType =
          this.$CONSTANT.ValidateErrorType.inputRoleDescErrorType.DescError.value;
      } else if (
        validateLength(roleDescription) < 4 ||
        validateLength(roleDescription) > 280
      ) {
        this.inputRoleDescErrorType =
          this.$CONSTANT.ValidateErrorType.inputRoleDescErrorType.DescLengthError.value;
      } else {
        this.inputRoleDescErrorType = '';
        return true;
      }
    },
    handlerWidth() {
      if (this.lang === 'en') {
        return 140 + 'px';
      } else {
        return 100 + 'px';
      }
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

.app-container {
  overflow: auto;
}
.app-container .scene-config-detail {
  padding: 0;
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
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }
  .button-pre-next {
    padding-left: 40%;
    margin-top: 15%;
  }
  .difficulty {
    min-width: 327px;
    display: inline-block;
  }
  .team_category {
    display: inline-block;
    margin-left: 10%;
  }
  .team_time {
    display: inline-block;
  }
  .trainees {
    display: inline-block;
    margin-left: 10%;
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
  .add—role-table {
    margin-bottom: 3%;
  }
  .add-role {
    margin-left: 42%;
  }
  .role-first {
    width: 20%;
    height: 16%;
    margin-left: 80px;
    float: left;
  }
  .role {
    width: 20%;
    height: 16%;
    margin-left: 2%;
    float: left;
  }
  .addIcon {
    color: #f56c6c;
    display: inline-block;
    // margin-right: 5px;
  }
  .addLabel {
    display: inline-block;
    width: 100%;
    ::v-deep.el-form-item__error {
      top: 80%;
    }
  }
  .trainLabel {
    margin-top: -7px;
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
