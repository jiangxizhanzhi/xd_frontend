<template>
  <div class="write-content">
    <!-- <cb-scrollbar> -->
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
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('m.startTimePh')"
                  style="width: 100%"
                  class="form-time elc-date-picker"
                />
              </cb-form-item>
            </cb-col>
            <cb-col class="line-to" :span="2" style="text-align: center">{{
              $t('m.to')
            }}</cb-col>
            <cb-col :span="11">
              <cb-form-item prop="end_time">
                <cb-date-picker
                  v-model="ruleForm.end_time"
                  type="datetime"
                  :picker-options="pickerBirthdayBefore"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('m.endTimePh')"
                  style="width: 100%"
                  class="form-time elc-date-picker"
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
            v-if="ruleForm.logo && ruleForm.logo !== ''"
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
            type="textarea"
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
                <div class="manage-group" v-if="rolesInfo.length">
                  <div
                    v-for="(item, index) in rolesInfo"
                    :key="index"
                    class="group-content"
                  >
                    <div class="director">
                      <div class="rolename fl">
                        <span class="green-color common-circle">•</span>
                        <span class="common-span one-overflow green-color">
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
                          :title="roleitem.name"
                        >
                          {{ roleitem.name }}
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
    <!-- </cb-scrollbar> -->
  </div>
</template>

<script>
import Cutimg from '@/components/cut-img/index-web.vue';
import UserDragSelector from '@/components/App/Auth/UserDragSelector';
import defaultUserLogo from '@/assets/img/userhead.png';
import Validate from '@/utils/validate.js';
import _ from 'lodash';
// import { mapGetters } from 'vuex'
import moment from 'moment';
import Utils from '@/utils/util';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';
import { getLanguage } from '@cyber/helper';

export default {
  name: 'Edit',
  components: { UserDragSelector, Cutimg },
  data() {
    var validateUser = (rule, value, callback) => {
      if (this.rolesInfo && this.rolesInfo.length > 0) {
        const fliterData = _.filter(this.rolesInfo, (item) => {
          return item.role_group === 2 && item.users.length === 0;
        });
        if (fliterData.length > 0) {
          callback(this.$t('m.roleCannotEmpty'));
        } else {
          callback();
        }
      } else {
        callback(this.$t('m.roleCannotEmpty'));
      }
    };
    return {
      BUSINESS_TYPE,
      isCheck: true,
      isCheckValue: '',
      isChecks: true,
      isChecksValue: '',
      url: '/cr_scene/cr_scene_cases/',
      language: getLanguage(),
      endTimeTips: false,
      loading: true,
      trainList: [],
      choosedScene: '',
      selectorUser: [],
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 3,
      },
      // 训练技能
      categoryList: [],
      trainSkillVisible: false,
      trainSkillValue: '',
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
            message: '请选择训练类型',
            trigger: ['blur', 'change'],
          },
        ],
        start_time: [
          { required: true, validator: Validate.startTime, trigger: 'change' },
        ],
        end_time: [
          { required: true, validator: Validate.endTime, trigger: 'change' },
        ],
        pre_skill: [
          {
            required: true,
            validator: Validate.preSkill,
            trigger: ['change'],
          },
        ],
        train_skill: [
          {
            required: true,
            validator: Validate.trainSkill,
            trigger: ['change'],
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
      searchCondition: {},
      lastUserDataId: [],
      isAdd: true,
      originData: null,
      createdFlag: false,
      originUserInfo: [],
      dialogVisible: false,
    };
  },
  computed: {
    // ...mapGetters(['language']),
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
      return this.$store.state.user;
    },
  },
  watch: {
    'ruleForm.pre_skill': {
      deep: true,
      handler(newVal, oldVal) {
        this.$refs.ruleForm.validateField('pre_skill');
      },
    },
    'ruleForm.train_skill': {
      deep: true,
      handler(newVal, oldVal) {
        this.$refs.ruleForm.validateField('train_skill');
      },
    },
    //校验tags
    isCheck: {
      immediate: true,
      handler(val) {
        this.$emit('sendVal', val);
      },
    },
    isCheckValue: {
      immediate: true,
      handler(val) {
        this.$emit('checkValue', val, 'check');
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
        this.$emit('checksValue', val, 'checks');
      },
    },
  },
  created() {
    // 团队编辑靶场训练类别请求
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
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getSceneDetil();
  },
  methods: {
    openUploadImg() {
      this.dialogVisible = true;
    },
    getImgUrl(data) {
      this.ruleForm.logo = data;
      this.dialogVisible = false;
    },
    setEndTime() {
      if (this.ruleForm.start_time) {
        const tempTime = moment(this.ruleForm.start_time.valueOf())
          .add(this.originData.duration_time, 'hours')
          .format('YYYY-MM-DD HH:mm:ss');
        this.$set(this.ruleForm, 'end_time', tempTime);
      } else {
        return;
      }
    },
    getSceneDetil() {
      this.$request
        .get(
          '/cr/team_train/room',
          {
            resource_id: this.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          // const crEventData = res.data.data;
          const crEventData = _.get(res, 'data.data', []);
          this.ruleForm.category = crEventData.category;
          this.ruleForm.name = crEventData.name;
          this.ruleForm.logo = crEventData.logo;
          this.ruleForm.pre_skill = crEventData.pre_skill;
          this.ruleForm.train_skill = crEventData.train_skill;
          this.ruleForm.start_time = crEventData.start_time;
          this.ruleForm.end_time = crEventData.end_time;
          this.ruleForm.description = crEventData.description;
          this.ruleForm.template_name = crEventData.template_name;
          this.ruleForm.enable_recording = crEventData.enable_recording;
          this.originData = JSON.parse(JSON.stringify(this.ruleForm));
          // this.originData.duration_time = crEventData.duration_time
          // this.originData.duration_time = 4
          this.rolesInfo.splice(0);
          this.lastUserDataId.splice(0);
          const tempArr = crEventData.roles_data;
          tempArr.forEach((item) => {
            this.lastUserDataId.push(...item.users);
            item.users.splice(0);
            item.users.push(...item.users_data);
            // if (item.role_group <= 3) {
            //   item.children.push(...item.users_data)
            //   this.lastUserDataId.push(...item.users)
            // } else if (item.role_group > 3) {
            //   item.children.forEach(subitem => {
            //     subitem.children.push(...subitem.users_data)
            //     this.lastUserDataId.push(...subitem.users)
            //   })
            // }
          });
          this.rolesInfo.push(...tempArr);
          this.originUserInfo = JSON.parse(JSON.stringify(this.rolesInfo));
          this.$nextTick(function () {
            this.$refs.modelDragSelector.targetContainers =
              this.$refs.roleUserList;
            _.forEach(this.rolesInfo, (item) => {
              _.forEach(item.users_data, (child) => {
                this.$set(child, 'name', child.rep_name);
              });
            });
          });
        });
    },
    // 创建训练实例
    submitForm() {
      const params = {};
      for (const key in this.ruleForm) {
        if (
          JSON.stringify(this.ruleForm[key]) !==
          JSON.stringify(this.originData[key])
        ) {
          if (typeof this.ruleForm[key] === 'object') {
            params[key] = this.ruleForm[key];
          } else {
            params[key] = this.ruleForm[key];
          }
        }
      }
      if (
        JSON.stringify(this.rolesInfo) !== JSON.stringify(this.originUserInfo)
      ) {
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
        params.role_config = JSON.stringify(role_config);
      }
      params.resource_id = this.resource_id;
      const _this = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          _this.createdFlag = true;
          this.$request
            .put(`/cr/team_train/room`, params, {
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
    resetForm(formName) {
      this.$refs.ruleForm.resetFields();
      this.$router.push({ path: `/team_train/${this.resource_id}` });
    },
    // 前置技能
    preSkillClose(tag) {
      this.ruleForm.pre_skill.splice(this.ruleForm.pre_skill.indexOf(tag), 1);
    },
    handlePreSkillConfirm(value) {
      if (value) {
        this.isCheckValue = '';
        this.isCheck = true;
        //和后台校验保持一致
        if (!/^[(\u4E00-\u9FA5)A-Za-z0-9_-\s]+$/.test(value)) {
          this.$message.error(this.$t('m.contentError'));
          this.isCheckValue = this.$t('m.contentError');
          this.isCheck = false;
          return false;
        }
        this.isCheckValue = '';
        this.isCheck = true;

        const inputValue = value;
        // 判断tag标签是否符合要求No展示输入框
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
        if (!/^[(\u4E00-\u9FA5)A-Za-z0-9_-\s]+$/.test(value)) {
          this.$message.error(this.$t('m.contentError'));
          this.isChecksValue = this.$t('m.contentError');
          this.isChecks = false;
          return false;
        }
        this.isChecksValue = '';
        this.isChecks = true;
        const inputValue = value;
        // 判断tag标签是否符合要求No展示输入框
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
    // 错误信息弹窗
    error(res) {
      const datas = res.response.data;
      _.forEach(datas, (value, key) => {
        if (_.isArray(value)) {
          this.$message.error(value[0].message);
        } else {
          this.$message.error(value.message);
        }
      });
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
  },
};
</script>

<style scoped lang="scss">
.write-content {
  width: 100%;
  height: 100%;
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
      width: 100% !important;
    }

    ::v-deep .el-form-item__label {
      // color: $input-textarea-placeholder!important;
      text-align: right !important;
      line-height: 36px;
    }

    ::v-deep .el-input__inner {
      // background-color: #273041!important;
      // color: $input-textarea!important;
      width: 100% !important;
      height: 36px;
      border-radius: 2px;
      // border-color:transparent!important;
    }
    // ::v-deep input::-webkit-input-placeholder,
    // ::v-deep textarea::-webkit-input-placeholder{
    //   color: $input-textarea-placeholder!important;
    // }
    // ::v-deep input::-moz-input-placeholder,
    // ::v-deep textarea::-moz-input-placeholder{
    //   color: $input-textarea-placeholder!important;
    // }
    // ::v-deep input::-ms-input-placeholder,
    // ::v-deep textarea::-ms-input-placeholder{
    //   color: $input-textarea-placeholder!important;
    // }
    // ::v-deep .el-input__icon{
    //   color: $input-textarea-placeholder!important;
    // }
    ::v-deep .el-textarea__inner {
      /*<!--background-color: #273041!important;-->*/
      /*<!--border: none!important;-->*/
      /*<!--color: $input-textarea!important;-->*/
      font-size: 14px !important;
    }
    ::v-deep .el-select {
      width: 100% !important;
      margin-right: 0 !important;
      ::v-deep .el-input__inner {
        height: 36px !important;
      }
      ::v-deep .el-input__icon {
        margin: 0 5px 0 5px;
        line-height: 36px;
        font-size: 14px;
      }
    }
    ::v-deep .el-input--suffix .el-input__inner {
      margin-top: 0 !important;
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
    /*margin-top: 5px;*/
    display: inherit;
    float: left;
  }
  .roles-group-comp {
    height: 460px;
    display: flex;
    justify-content: space-between;
    /*height: 400px;*/
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
    width: 87px;
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
      color: #8b94b1;
      text-align: center;
      white-space: nowrap;
      font-size: 14px;
    }
    .close-icon {
      position: absolute;
      right: 3px;
      top: -10px;
      color: #96122b;
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
    width: calc(47% - 30px);
    height: 100%;
    padding: 0 10px 10px;
    box-sizing: border-box;
  }
  .grouped-roles {
    color: var(--neutral8);
    font-size: 12px;
    width: 53%;
    height: 100%;
    float: left;
    padding: 8px;
    box-sizing: border-box;
    .common-span {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 22px;
      width: calc(100% - 20px);
      display: inline-block;
    }
    .white-color {
      color: var(--neutral8);
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
      }
      .director {
        width: 100%;
        .rolename {
          width: 80px;
          margin-top: 15px;
          padding-top: 22px;
        }
      }
    }
    .group-content {
      box-sizing: border-box;
      clear: left;
      .roles-list {
        box-sizing: border-box;
        border-radius: 2px;
        margin-bottom: 12px;
        padding: 5px 10px 2px;
        overflow: hidden;
        min-height: 108px;
        width: calc(100% - 80px);
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
.error-tags {
  color: #f56c6c;
}
label {
  font-weight: normal !important;
}
</style>
