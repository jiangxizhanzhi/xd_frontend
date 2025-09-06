<template>
  <div class="write-content">
    <!-- <el-scrollbar> -->
    <cb-form
      ref="ruleForm"
      :model="ruleForm"
      size="mini"
      :rules="rules"
      class="demo-ruleForm"
      :label-width="language === 'en-US' ? '150px' : '86px'"
    >
      <div class="common-form-div">
        <div class="input-div-left fl">
          <cb-form-item
            :label="$t('m.templateName')"
            prop="template_name"
            class="fl"
          >
            <cb-input
              v-model="ruleForm.template_name"
              disabled
              class="train-input forbidden"
              :placeholder="$t('m.templateNamePh')"
            />
          </cb-form-item>
        </div>
        <div class="input-div-left fl">
          <cb-form-item
            :label="$t('m.trainingName')"
            prop="name"
            class="fl"
            :label-width="language === 'en-US' ? '150px' : '86px'"
          >
            <cb-input
              v-model="ruleForm.name"
              :disabled="!isCreate"
              :placeholder="$t('m.trainingNamePh')"
              @blur="nameInpBlur"
            />
          </cb-form-item>
        </div>
      </div>
      <div class="common-form-div">
        <div class="input-div-left fl">
          <cb-form-item :label="$t('m.trainingCategroy')" prop="category">
            <cb-select
              style="width: 100%"
              v-model="ruleForm.category"
              :placeholder="$t('m.trainingCategroyPh')"
              :options="categoryList"
              :disabled="!isCreate"
            >
            </cb-select>
          </cb-form-item>
        </div>
        <div class="input-div-left fl">
          <cb-form-item
            :label="$t('m.trainingTime')"
            style="margin-bottom: 0"
            :label-width="language === 'en-US' ? '150px' : '86px'"
          >
            <label slot="label">
              <span class="red-start">*</span>
              <span>{{ $t('m.trainingTime') }}</span>
            </label>
            <cb-col :span="11">
              <cb-form-item prop="start_time">
                <cb-date-picker
                  v-model="ruleForm.start_time"
                  type="datetime"
                  :disabled="!isCreate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('m.startTimePh')"
                  style="width: 100%"
                  class="form-time"
                />
              </cb-form-item>
            </cb-col>
            <cb-col class="line-to" :span="2" style="text-align: center">
              {{ $t('m.to') }}
            </cb-col>
            <cb-col :span="11">
              <cb-form-item prop="end_time">
                <cb-date-picker
                  v-model="ruleForm.end_time"
                  type="datetime"
                  :picker-options="pickerBirthdayBefore"
                  :disabled="!isCreate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('m.endTimePh')"
                  style="width: 100%"
                  class="form-time"
                />
              </cb-form-item>
            </cb-col>
          </cb-form-item>
        </div>
      </div>
      <div class="common-form-div">
        <cb-form-item :label="$t('m.cover')" class="common-skill" prop="logo">
          <cb-button
            color-type="hollow"
            icon="icon-daoru"
            @click="openUploadImg"
          >
            {{ $t('common.import') }}
          </cb-button>
          <br />
          <img
            class="showImg"
            v-if="ruleForm.logo !== ''"
            :src="ruleForm.logo"
          />
        </cb-form-item>
      </div>
      <div class="common-form-div">
        <cb-form-item
          :label="$t('m.frontSkills')"
          class="common-skill"
          prop="pre_skill"
        >
          <div class="tagsbox elc-tags">
            <cb-input
              v-model="ruleForm.pre_skill.length"
              style="display: none"
            />
            <cb-form-tags
              :value="ruleForm.pre_skill"
              button-type="add"
              :listMaxLen="4"
              :customInputReg="handlePreSkillConfirm"
            ></cb-form-tags>
          </div>
        </cb-form-item>
      </div>
      <div class="common-form-div">
        <cb-form-item
          :label="$t('m.trainingSkills')"
          class="common-skill"
          prop="train_skill"
        >
          <div class="tagsbox elc-tags">
            <cb-input
              v-model="ruleForm.train_skill.length"
              style="display: none"
            />
            <cb-form-tags
              :value="ruleForm.train_skill"
              button-type="add"
              :listMaxLen="4"
              :customInputReg="handleTrainSkillConfirm"
            ></cb-form-tags>
          </div>
        </cb-form-item>
      </div>
      <div class="common-form-div">
        <cb-form-item :label="$t('m.taskDescription')" prop="description">
          <cb-input
            v-model="ruleForm.description"
            class="elc-input"
            type="textarea"
            :disabled="!isCreate"
            :placeholder="$t('m.specificationPh')"
            @blur="descInpBlur"
          />
        </cb-form-item>
      </div>
      <div class="common-form-div">
        <cb-form-item :label="$t('m.screenRecord')" prop="enable_recording">
          <cb-switch v-model="ruleForm.enable_recording"> </cb-switch>
        </cb-form-item>
      </div>
      <div class="common-form-div">
        <cb-form-item :label="$t('m.trainingRoles')" prop="role_info">
          <div class="roles-group-comp">
            <div class="ungroup-roles">
              <user-drag-selector
                ref="modelDragSelector"
                :disabled-user-list="disabledUserList"
                @select-user="dragSelectRoleUser"
              />
            </div>
            <div class="arrow-div">
              <cb-iconfont
                type="icon-daorujiantou"
                class="icon-daoru"
              ></cb-iconfont>
            </div>
            <div class="grouped-roles">
              <cb-scrollbar style="heigth: 100%">
                <div class="manage-group">
                  <div
                    v-for="(item, index) in rolesInfo"
                    :key="index"
                    class="group-content"
                  >
                    <div class="director">
                      <div class="rolename fl">
                        <span class="green-color common-circle">•</span>
                        <span class="common-span green-color">
                          {{ item.name }}
                        </span>
                      </div>
                    </div>
                    <div
                      ref="roleUserList"
                      class="roles-list fl"
                      :data-key="index"
                    >
                      <div
                        v-for="(roleitem, roleindex) in item.users"
                        :key="roleitem.resource_id"
                        class="item fl"
                        style="margin: 0"
                      >
                        <img
                          class="userimg"
                          :src="roleitem.logo || helper.defaultUserLogo"
                          alt
                        />
                        <div
                          class="username one-overflow white-color"
                          :title="roleitem.name || roleitem.username"
                        >
                          {{ roleitem.name || roleitem.username }}
                        </div>
                        <div
                          v-show="userData.resource_id !== roleitem.resource_id"
                          class="role-delete cursor"
                          @click="
                            removeRoleUser(
                              index,
                              roleindex,
                              roleitem.resource_id,
                            )
                          "
                        >
                          <cb-iconfont
                            size="22"
                            class="color-sky-blue fl"
                            type="icon-shanchu"
                            style="
                              position: absolute;
                              top: 50%;
                              left: 50%;
                              transform: translate(-50%, -50%);
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </cb-scrollbar>
            </div>
          </div>
        </cb-form-item>
      </div>
    </cb-form>
    <cb-dialog
      :visible.sync="dialogVisible"
      :title="$t('m.courseUpload')"
      append-to-body
    >
      <span class="modal-style">
        <cutimg
          :businessType="BUSINESS_TYPE.CR_WEB_TEAM"
          @sendFormData="getImgUrl"
        ></cutimg>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import Cutimg from '@/components/cut-img/index-web.vue';
import UserDragSelector from '@/components/App/Auth/UserDragSelector';
import defaultUserLogo from '@/assets/img/userhead.png';
import Validate from '@/utils/validate.js';
import _ from 'lodash';
import moment from 'moment';
import Utils from '@/utils/util';
import { getLanguage } from '@cyber/helper';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';

export default {
  name: 'WriteContent',
  components: {
    UserDragSelector,
    Cutimg,
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    var validateUser = (rule, value, callback) => {
      const fliterData = _.filter(value, (item) => {
        return item.role_group === 2 && item.users.length === 0;
      });
      if (fliterData.length > 0) {
        callback(this.$t('m.roleCannotEmpty'));
      } else {
        callback();
      }
    };
    return {
      BUSINESS_TYPE,
      isCheck: true,
      isCheckValue: '',
      isChecks: true,
      isChecksValue: '',
      language: getLanguage(),
      ruleForm: {
        name: '',
        category: '',
        logo: '',
        pre_skill: [],
        train_skill: [],
        description: '',
        enable_recording: false,
        start_time: '',
        end_time: '',
        template_name: '',
        role_info: [],
        enable_recording: false,
      },
      pickerBirthdayBefore: {
        disabledDate: (time) => {
          const beginDateVal = this.ruleForm.start_time;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).setHours(0, 0, 0, 0);
          }
        },
      },
      rules: {
        name: [
          {
            required: true,
            validator: Validate.name255,
            trigger: ['blur', 'change'],
          },
        ],
        description: [
          {
            required: true,
            message: this.$t('m.pleaseInputDescription'),
            trigger: 'blur',
          },
          {
            validator: Validate.description2048,
            trigger: 'blur',
          },
        ],
        category: [
          {
            required: true,
            message: this.$t('m.selectTrainingType'),
            trigger: ['blur', 'change'],
          },
        ],
        start_time: [
          {
            required: true,
            validator: Validate.startTime,
            trigger: 'change',
            message: this.$t('m.startTimePh'),
          },
        ],
        end_time: [
          {
            required: true,
            validator: Validate.endTime,
            trigger: 'change',
            message: this.$t('m.endTimePh'),
          },
        ],
        pre_skill: [
          {
            required: true,
            message: this.$t('m.setPreSkillLabel'),
            trigger: ['blur', 'change'],
          },
        ],
        train_skill: [
          {
            required: true,
            message: this.$t('m.setTrainSkillLabel'),
            trigger: ['blur', 'change'],
          },
        ],
        role_info: [
          {
            required: true,
            validator: validateUser,
            trigger: ['blur', 'change'],
          },
        ],
        // logo: [
        //   {
        //     required: true,
        //     message: this.$t('m.plzUploadCover'),
        //     trigger: 'blur',
        //   },
        // ],
      },
      helper: {
        defaultUserLogo,
      },
      rolesInfo: [],
      lastUserDataId: [],
      isAdd: true,
      originData: null,
      createdFlag: false,
      selectorUser: [],
      isCreate: false,
      // 训练技能
      categoryList: [
        // { label: this.$t('m.penetrationTest'), value: 1 },
        // { label: this.$t('m.operationalProtection'), value: 2 },
        // // { label: this.$t('m.simulationSystem'), value: 3 },
        // // { label: this.$t('m.adversarialTraining'), value: 4 },
        // { label: this.$t('m.others'), value: 5 },
      ],
      manageDelete: false,
      dialogVisible: false,
    };
  },
  computed: {
    disabledUserList() {
      const { rolesInfo = [] } = this;
      return rolesInfo.reduce(
        (acc, curr = {}) => {
          const { users = [] } = curr;
          for (const user of users) {
            acc.push(user.resource_id);
          }
          return acc;
        },
        [1],
      );
    },

    userData() {
      this.$set(this.$store.state.user, 'logo', this.$store.state.user.avatar);
      this.$set(
        this.$store.state.user,
        'resource_id',
        this.$store.state.user.id,
      );
      return this.$store.state.user;
    },
  },
  watch: {
    'ruleForm.start_time'(nv, ov) {
      if (nv) {
        const tempTime = moment(this.ruleForm.start_time.valueOf())
          .add(this.originData.base_info.duration_time, 'hours')
          .format('YYYY-MM-DD HH:mm:ss');
        this.$set(this.ruleForm, 'end_time', tempTime);
      }
    },

    formInfo: {
      handler(nv, ov) {
        // if (nv !== ov) {
        if (!_.isEmpty(nv)) {
          this.initData(nv);
        }
        // }
      },
      immediate: true,
      deep: true,
    },
    isCheck: {
      immediate: true,
      handler(val) {
        this.$emit('sendVal', val);
      },
    },
    isCheckValue: {
      immediate: true,
      handler(val) {
        this.$emit('checkValue', val);
      },
    },
    isChecks: {
      immediate: true,
      handler(val) {
        this.$emit('sendVals', val);
      },
    },
    isChecksValue: {
      immediate: true,
      handler(val) {
        this.$emit('checksValue', val);
      },
    },
  },
  created() {
    // 红蓝训练类别请求
    this.$request
      .get('/cr/common/constants_config', { type: 3 }, { baseURL: '/api/ojj' })
      .then((res) => {
        this.categoryList = res.data.data.map((item) => {
          return {
            label: item.name.toString(),
            value: item.code,
          };
        });
      });
  },
  methods: {
    openUploadImg() {
      this.dialogVisible = true;
    },
    getImgUrl(data) {
      this.ruleForm.logo = data;
      this.dialogVisible = false;
    },
    initData(val) {
      this.isCreate = true;
      this.originData = JSON.parse(JSON.stringify(val));
      const tempCrEventInfo = JSON.parse(JSON.stringify(val.base_info));
      this.ruleForm.category = tempCrEventInfo.category;
      this.ruleForm.description = tempCrEventInfo.description;
      this.ruleForm.logo = tempCrEventInfo.logo;
      this.ruleForm.pre_skill = tempCrEventInfo.pre_skill;
      this.ruleForm.train_skill = tempCrEventInfo.train_skill;
      this.ruleForm.template_name = tempCrEventInfo.name;
      this.ruleForm.enable_recording = tempCrEventInfo.enable_recording;
      this.rolesInfo.splice(0);
      this.rolesInfo.push(...JSON.parse(JSON.stringify(val.role_structure)));
      this.rolesInfo.forEach((item) => {
        this.$set(item, 'users', []);
      });
      this.$nextTick(function () {
        this.$refs.modelDragSelector.targetContainers = this.$refs.roleUserList;
      });
      this.lastUserDataId.splice(0);
      this.rolesInfo[0].users.push(this.userData);
      this.lastUserDataId.push(this.userData.resource_id);
    },
    // 前置技能
    preSkillClose(tag) {
      this.ruleForm.pre_skill.splice(this.ruleForm.pre_skill.indexOf(tag), 1);
    },
    handlePreSkillConfirm(value) {
      if (value) {
        this.isCheckValue = '';
        this.isCheck = true;
        //  和后台保持一致
        if (!/^[(\u4E00-\u9FA5)A-Za-z0-9_-\s]+$/.test(value)) {
          this.$message.error(this.$t('m.contentError'));
          this.isCheckValue = this.$t('m.contentError');
          this.isCheck = false;
          return false;
        }
        this.isCheckValue = '';
        this.isCheck = true;
        const inputValue = value;
        const isValid =
          Utils.getByteLen(inputValue) >= 1 &&
          Utils.getByteLen(inputValue) <= 255;
        if (!isValid) {
          this.$message.error(this.$t('m.validataTagsTip'));
          this.isCheckValue = this.$t('m.validataTagsTip');
          this.isCheck = false;
          return false;
        }
        this.isCheckValue = '';
        this.isCheck = true;
        if (this.ruleForm.pre_skill.includes(inputValue)) {
          this.$message.error(this.$t('m.tagDuplicated'));
          this.isCheckValue = this.$t('m.tagDuplicated');
          this.isCheck = false;
          return false;
        }
        this.isCheckValue = '';
        this.isCheck = true;
        return true;
      } else {
        this.isCheckValue = '';
        this.isCheck = true;
        return true;
      }
    },
    // 训练技能
    trainSkillClose(tag) {
      this.ruleForm.train_skill.splice(
        this.ruleForm.train_skill.indexOf(tag),
        1,
      );
    },
    handleTrainSkillConfirm(value) {
      if (value) {
        this.isChecksValue = '';
        this.isChecks = true;
        //和后台保持一致
        if (!/^[(\u4E00-\u9FA5)A-Za-z0-9_-\s]+$/.test(value)) {
          this.$message.error(this.$t('m.contentError'));
          this.isChecksValue = this.$t('m.contentError');
          this.isChecks = false;
          return false;
        }
        this.isChecksValue = '';
        this.isChecks = true;
        const inputValue = value;

        const isValid =
          Utils.getByteLen(inputValue) >= 1 &&
          Utils.getByteLen(inputValue) <= 255;
        if (!isValid) {
          this.$message.error(this.$t('m.validataTagsTip'));
          this.isChecksValue = this.$t('m.validataTagsTip');
          this.isChecks = false;
          return false;
        }
        this.isChecksValue = '';
        this.isChecks = true;
        if (this.ruleForm.train_skill.includes(inputValue)) {
          this.$message.error(this.$t('m.tagDuplicated'));
          this.isChecksValue = this.$t('m.tagDuplicated');
          this.isChecks = false;
          return false;
        }
        this.isChecksValue = '';
        this.isChecks = true;
        return true;
      } else {
        this.isChecksValue = '';
        this.isChecks = true;
        return true;
      }
    },

    // 获得输入框中字符长度
    fucCheckLength(strTemp) {
      var i, sum;
      sum = 0;
      for (i = 0; i < strTemp.length; i++) {
        if (strTemp.charCodeAt(i) >= 0 && strTemp.charCodeAt(i) <= 255) {
          sum = sum + 1;
        } else {
          sum = sum + 2;
        }
      }
      return sum;
    },
    // input去除空格
    nameInpBlur() {
      this.ruleForm.name = this.ruleForm.name.trim();
    },
    descInpBlur() {
      this.ruleForm.description = this.ruleForm.description.trim();
    },
    // 用户选择
    dragSelectRoleUser(userData, pos, targetContainer) {
      const roleValue = targetContainer.getAttribute('data-key');
      if (!this.lastUserDataId.includes(userData.resource_id)) {
        this.rolesInfo[roleValue].users.push(userData);
        this.lastUserDataId.push(userData.resource_id);
      } else {
        return;
      }
    },
    removeRoleUser(index, roleindex, id) {
      this.rolesInfo[index].users.splice(roleindex, 1);
      this.lastUserDataId.splice(this.lastUserDataId.indexOf(id), 1);
    },
    ensureCreate() {
      // if (this.createdFlag) return;
      this.ruleForm.role_info = this.rolesInfo;
      const params = {};
      params.template = this.originData.resource_id; // 模板的resource_id
      params.category = this.ruleForm.category;
      params.name = this.ruleForm.name;
      params.logo = this.ruleForm.logo;
      params.pre_skill = JSON.stringify(this.ruleForm.pre_skill);
      params.train_skill = JSON.stringify(this.ruleForm.train_skill);
      params.difficult = this.originData.base_info.difficult;
      params.start_time = this.ruleForm.start_time;
      params.end_time = this.ruleForm.end_time;
      params.description = this.ruleForm.description;
      params.enable_recording = this.ruleForm.enable_recording;
      params.scene_config = this.originData.scene_config;
      params.enable_recording = this.ruleForm.enable_recording;
      const role_config = JSON.parse(JSON.stringify(this.rolesInfo));
      role_config.forEach((item) => {
        delete item.name;
        const roleId = [];
        const roleData = JSON.parse(JSON.stringify(item.users));
        roleData.forEach((role) => {
          roleId.push(role.resource_id);
        });
        item.users = roleId;
      });
      params.role_config = role_config;
      const _this = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          _this.createdFlag = true;
          _this.$request
            .post('/cr/team_train/room', params, {
              baseURL: '/api/ojj',
            })
            .then((res) => {
              _this.$message.success(this.$t('m.saveSuccess'));
              _this.createdFlag = false;
              _this.$emit('createFormSuccess');
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.write-content {
  width: 100%;
  height: 100%;
  ::v-deep .el-form {
    padding-right: 5px !important;
  }
  .common-form-div {
    clear: left;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    .input-div-left {
      width: 48%;
    }

    ::v-deep .el-form-item {
      width: 100%;
    }

    ::v-deep .el-input__icon {
      margin: 0 5px 0 5px;
      font-size: 14px;
    }
    ::v-deep .el-select {
      margin-right: 0 !important;
      ::v-deep .el-input__inner {
        height: 36px !important;
      }
      ::v-deep .el-input__icon {
        margin: -1px 5px 0 5px;
      }
    }
    .form-time {
      ::v-deep .el-input__inner {
      }
    }
  }
  .common-circle {
    font-size: 27px;
    margin-right: 5px;
    line-height: 15px;
    display: inherit;
    float: left;
  }
  .roles-group-comp {
    height: 460px;
    display: flex;
    justify-content: space-between;
    border-radius: 2px;
  }
  .arrow-div {
    width: 30px;
    height: 52px;
    position: absolute;
    left: calc(47% - 30px);
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    .icon-daoru {
      color: var(--neutral6);
      font-size: 30px !important;
    }
  }
  .item {
    position: relative;
    width: 86px;
    .role-delete {
      display: none;
    }
    &:hover {
      .role-delete {
        display: block;
      }
    }
    .userimg {
      display: block;
      width: 70px;
      margin: 0 auto;
      height: 70px;
      border-radius: 50%;
    }
    .username {
      width: 90%;
      padding-left: 5%;
      text-align: center;
      white-space: nowrap;
      font-size: 14px;
    }

    .role-delete {
      width: 70px;
      height: 70px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      margin: 0 auto;
      text-align: center;
      line-height: 70px;
      img {
        vertical-align: middle;
      }
    }
  }
  .ungroup-roles {
    width: calc(50% - 100px);
    height: 100%;
    padding: 0 10px 10px;
    box-sizing: border-box;
  }
  $borderColor: rgba(67, 76, 110, 0.76);
  .grouped-roles {
    color: #fff;
    font-size: 12px;
    width: 50%;
    height: 100%;
    float: left;
    padding: 8px;
    box-sizing: border-box;
    .common-span {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 19px;
      width: calc(100% - 20px);
      display: inline-block;
    }
    .white-color {
      color: rgba(255, 255, 255, 1);
    }
    .manage-group {
      width: 100%;
      box-sizing: border-box;
      border-radius: 2px 0 0 2px;
      .group-title {
        width: 33%;
        overflow: hidden;
        padding: 5px;
        box-sizing: border-box;
        border-bottom: 1px solid $borderColor;
      }
      .director {
        width: 100%;
        .rolename {
          width: 85px;
          margin-top: 15px;
          padding-top: 22px;
          line-height: 0px;
        }
      }
    }
    .group-content {
      box-sizing: border-box;
      clear: left;
      .roles-list {
        box-sizing: border-box;
        // background:rgba(36,44,60,1);
        border-radius: 2px;
        margin-bottom: 12px;
        padding: 5px 10px 2px;
        overflow: hidden;
        min-height: 108px;
        width: calc(100% - 85px);
      }
    }
  }
  .el-scrollbar {
    overflow: hidden;
    position: relative;
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}
label {
  font-weight: normal !important;
}
</style>
<style lang="scss">
.write-content {
  .input-div-left {
    .el-input .el-input__inner {
      height: 36px !important;
    }
  }
}
</style>
