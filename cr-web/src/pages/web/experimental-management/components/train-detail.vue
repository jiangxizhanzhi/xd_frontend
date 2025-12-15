<template>
  <div class="train-detail-wrap">
    <div
      v-if="id"
      class="header"
    >
      <div
        class="back"
        @click="backFn"
      >
        <cb-iconfont
          size="14"
          type="icon-fanhui"
        ></cb-iconfont>
        <span>{{ $t('admin.goBack') }}</span>
      </div>
      <div class="title">
        {{ $t('admin.editTraining') }}
      </div>
    </div>
    <div :class="[id ? 'main-wrap' : '']">
      <div class="basic-info">
        <!-- 基础信息 -->
        <div class="top-content">
          <block :title="$t('list.basicInfo')"></block>
          <cb-form
            ref="ruleForm"
            :model="ruleForm"
            size="mini"
            :rules="rules"
            class="demo-ruleForm"
            :label-width="language === 'en-US' ? '150px' : '86px'"
          >
            <div>
              <div class="width36">
                <!-- 模板名称,训练名称 -->
                <cb-form-item
                  :label="$t('m.templateName')"
                  prop="template_name"
                >
                  <cb-input
                    v-model="ruleForm.template_name"
                    disabled
                    :placeholder="$t('m.templateNamePh')"
                  />
                </cb-form-item>
                <cb-form-item
                  :label="$t('m.trainingName')"
                  prop="name"
                >
                  <cb-input
                    v-model="ruleForm.name"
                    :placeholder="$t('m.trainingNamePh')"
                    @blur="nameInpBlur"
                  />
                </cb-form-item>
                <!-- 训练时间 -->
                <cb-form-item
                  prop="dateTime"
                  :label="$t('list.trainingTime')"
                >
                  <cb-date-picker
                    style="width: 100%"
                    v-model="ruleForm.dateTime"
                    type="datetimerange"
                    :range-separator="$t('list.to')"
                    :start-placeholder="$t('list.startTime')"
                    :end-placeholder="$t('list.endTime')"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </cb-date-picker>
                </cb-form-item>
                <!-- 训练类别 -->
                <cb-form-item
                  :label="$t('m.trainingCategroy')"
                  prop="category"
                >
                  <cb-select
                    style="width: 100%"
                    v-model="ruleForm.category"
                    :placeholder="$t('m.trainingCategroyPh')"
                    :options="categoryList"
                  >
                  </cb-select>
                </cb-form-item>
              </div>
              <!-- 封面 -->
              <cb-form-item
                :label="$t('m.cover')"
                prop="logo"
              >
                <cb-input
                  v-model="ruleForm.logo"
                  style="display: none"
                />
                <cb-upload-file
                  v-model="list"
                  :fetch-promise="uploadFunc"
                  accept=".png,.jpg"
                  :tipText="$t('test.AdviceSize')"
                  :fileSize="10 * 1024 * 1024"
                  @delete="removeLogo"
                ></cb-upload-file>
              </cb-form-item>
              <!-- 前置技能 -->
              <cb-form-item
                :label="$t('m.frontSkills')"
                prop="pre_skill"
              >
                <div>
                  <cb-input
                    v-model="ruleForm.pre_skill.length"
                    style="display: none"
                  />
                  <cb-form-tags
                    :value="ruleForm.pre_skill"
                    button-type="add"
                    :listMaxLen="30"
                    :customInputReg="handlePreSkillConfirm"
                  ></cb-form-tags>
                </div>
              </cb-form-item>
              <!-- 训练技能 -->
              <cb-form-item
                :label="$t('m.trainingSkills')"
                prop="train_skill"
              >
                <div>
                  <cb-input
                    v-model="ruleForm.train_skill.length"
                    style="display: none"
                  />
                  <cb-form-tags
                    :value="ruleForm.train_skill"
                    button-type="add"
                    :listMaxLen="30"
                    :customInputReg="handleTrainSkillConfirm"
                  ></cb-form-tags>
                </div>
              </cb-form-item>
              <!-- 场景描述 -->
              <cb-form-item
                :label="$t('m.taskDescription')"
                prop="description"
              >
                <cb-input
                  v-model="ruleForm.description"
                  type="textarea"
                  :placeholder="$t('m.specificationPh')"
                  @blur="descInpBlur"
                />
              </cb-form-item>
              <!-- 录屏 -->
              <cb-form-item
                :label="$t('m.screenRecord')"
                prop="enable_recording"
              >
                <cb-switch v-model="ruleForm.enable_recording" />
              </cb-form-item>
            </div>
            <!-- 底部按钮 -->
            <div slot="fixedBottom">
              <cb-button-group space="middle">
                <cb-button
                  button-type="confirm"
                  @click="confirm"
                ></cb-button>
                <cb-button
                  button-type="cancel"
                  @click="cancel"
                ></cb-button>
              </cb-button-group>
            </div>
          </cb-form>
        </div>
        <!-- 训练人员 -->
        <div class="train-member">
          <block :title="$t('list.trainers')"></block>
          <!-- <cb-form-item :label="$t('m.trainingRoles')" prop="role_info"> -->
          <div class="roles-group-comp">
            <div class="left-wrap">
              <div class="ungroup-roles">
                <user-drag-selector
                  ref="modelDragSelector"
                  :disabled-user-list="disabledUserList"
                  @select-user="dragSelectRoleUser"
                  @click-user="handleClickUser"
                />
              </div>
            </div>
            <div class="arrow-div">
              <cb-iconfont
                type="icon-daorujiantou"
                class="icon-daoru"
              ></cb-iconfont>
            </div>
            <div class="right-wrap cyber-scroll-bar-small">
              <div
                v-for="(item, index) in rolesInfo"
                :key="index"
                class="group-content"
              >
                <div class="director">
                  <div class="rolename fl">
                    <span
                      class="common-span"
                      :title="item.name"
                    >
                      {{ item.name }}
                    </span>
                    <cb-button
                      v-if="showAddBtn"
                      hollow
                      size="small"
                      @click="addSelectUser(item, index)"
                    >添加</cb-button
                    >
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
                        removeRoleUser(index, roleindex, roleitem.resource_id)
                        "
                    >
                      <cb-iconfont
                        size="16"
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
                  <!-- 将头像拖至此处 -->
                  <div
                    class="tip"
                    v-if="item.users.length === 0"
                  >
                    {{ $t('list.bringAvatar') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- </cb-form-item> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
import UserDragSelector from '@/components/App/Auth/UserDragSelectorTeam';
import defaultUserLogo from '@/assets/img/userhead.png';
import Validate from '@/utils/validate.js';
import _ from 'lodash';
import Utils from '@/utils/util';
import { getLanguage } from '@cyber/helper';
import {
  getTemplateListApi,
  createTrainingApi,
  uploadImageApi,
  editTrainingApi,
  editTrainingCreateApi,
  getTrainingCategoryApi,
} from '@/api/web/team-training';
import { EXPERIMENTAL_SUBJECT_MANAGEMENT_TYPE, EXPERIMENTAL_SUBJECT_TEMPLATE_TYPE } from '../constants'

export default {
  name: 'WriteContent',
  components: {
    block,
    UserDragSelector,
  },
  props: {
    id: {
      type: String,
      default: '',
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
      templateInfo: {},
      isCheck: true,
      isCheckValue: '',
      isChecks: true,
      isChecksValue: '',
      language: getLanguage(),
      ruleForm: {
        template_name: '',
        name: '',
        dateTime: '',
        category: '',
        logo: '',
        pre_skill: [],
        train_skill: [],
        description: '',
        enable_recording: true,
        role_info: [],
      },
      list: [],
      rules: {
        name: [
          {
            required: true,
            validator: Validate.name255,
            trigger: ['blur', 'change'],
          },
        ],
        dateTime: [
          {
            required: true,
            message: this.$t('rbt.selectTime'),
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
      // 训练技能
      categoryList: [],
      manageDelete: false,
      dialogVisible: false,
      business_template_id: '',
      showAddBtn: false,
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
    this.templateId = this.$route.params.templateId;
    this.getTrainType();
    this.rolesInfo.splice(0);
    this.lastUserDataId.splice(0);
    if (!this.id) {
      this.business_template_id = this.$route.params.business_template_id;
      this.getTemplateList();
    }
  },
  mounted() {
    if (this.id) {
      this.getEditDetail();
    }
  },
  methods: {
    handleClickUser(count) {
      this.showAddBtn = !!count;
    },
    backFn() {
      this.$router.go(-1);
    },
    //确定创建训练
    confirm() {
      if (this.id) {
        // 编辑新增
        this.editEnsureCreate();
      } else {
        this.ensureCreate();
      }
    },
    // 取消创建训练
    cancel() {
      if (this.id) {
        // 编辑取消
        this.$router.go(-1);
      } else {
        // 新增取消
        if (this.$route.name === this.$route.meta.breadcrumb.parentName + '-add') {
          this.$router.go(-1);
        } else {
          this.$router.push({
            // name: 'group-training',
            name: this.$route.meta.breadcrumb.parentName,
            params: {
              templateId: true,
            },
          });
        }
      }
    },
    //获取训练类别
    getTrainType() {
      getTrainingCategoryApi({ type: 3 }).then((res) => {
        this.categoryList = res.data.data.map((item) => {
          return {
            label: item.name.toString(),
            value: item.code,
          };
        });
      });
    },

    // 上传封面
    uploadFunc(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 5);
      uploadImageApi(formData).then((res) => {
        const data = _.get(res, 'data.data', '');
        this.ruleForm.logo = data.file_path;
      });
    },
    // 移除封面
    removeLogo() {
      this.ruleForm.logo = '';
    },
    // 获取模板列表
    getTemplateList() {
      getTemplateListApi({ ids: this.business_template_id }).then((res) => {
        const data = _.get(res, 'data.data.records', []);
        this.rolesInfo = [];
        this.lastUserDataId = [];
        this.rolesInfo = data[0].role_structure;
        this.templateInfo = data[0];
        this.initData(this.templateInfo);
      });
    },
    openUploadImg() {
      this.dialogVisible = true;
    },
    getImgUrl(data) {
      this.ruleForm.logo = data;
      this.dialogVisible = false;
    },
    initData(val) {
      this.originData = JSON.parse(JSON.stringify(val));
      const tempCrEventInfo = JSON.parse(JSON.stringify(val.base_info));
      this.ruleForm.category = tempCrEventInfo.category;
      this.ruleForm.description = tempCrEventInfo.description;
      this.ruleForm.logo = tempCrEventInfo.logo;
      this.ruleForm.pre_skill = tempCrEventInfo.pre_skill;
      this.ruleForm.train_skill = tempCrEventInfo.train_skill;
      this.ruleForm.template_name = tempCrEventInfo.name;
      this.ruleForm.enable_recording = true;
      // this.rolesInfo.splice(0);
      // this.rolesInfo.push(...JSON.parse(JSON.stringify(val.role_structure)));
      this.rolesInfo.forEach((item) => {
        this.$set(item, 'users', []);
      });

      this.$nextTick(function () {
        this.$refs.modelDragSelector.targetContainers = this.$refs.roleUserList;
      });

      // this.lastUserDataId.splice(0);
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
    // 确定新增训练
    ensureCreate() {
      this.ruleForm.role_info = this.rolesInfo;
      const params = {};
      params.template = this.originData.resource_id; // 模板的resource_id
      params.name = this.ruleForm.name;
      params.start_time = this.ruleForm.dateTime[0];
      params.end_time = this.ruleForm.dateTime[1];
      params.category = this.ruleForm.category;

      params.logo = this.ruleForm.logo;
      params.pre_skill = JSON.stringify(this.ruleForm.pre_skill);
      params.train_skill = JSON.stringify(this.ruleForm.train_skill);
      params.difficult = this.originData.base_info.difficult;
      params.description = this.ruleForm.description;
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
      params.xd_type = EXPERIMENTAL_SUBJECT_MANAGEMENT_TYPE[this.$route.meta?.breadcrumb?.parentName]
      const _this = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          _this.createdFlag = true;
          createTrainingApi(params).then((res) => {
            _this.$message.success(this.$t('m.saveSuccess'));
            _this.createdFlag = false;
            _this.$emit('createFormSuccess');
            this.$router.push({
              // name: 'group-training',
              name: this.$route.meta.breadcrumb.parentName,
            });
          });
        } else {
          return false;
        }
      });
    },
    // 编辑新增训练
    editEnsureCreate() {
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
      params.resource_id = this.id;
      const _this = this;
      params.start_time = this.ruleForm.dateTime[0];
      params.end_time = this.ruleForm.dateTime[1];
      params.xd_type = EXPERIMENTAL_SUBJECT_MANAGEMENT_TYPE[this.$route.meta?.breadcrumb?.parentName]
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          _this.createdFlag = true;
          editTrainingCreateApi(params).then((res) => {
            _this.$message.success(this.$t('m.saveSuccess'));
            _this.createdFlag = false;
            _this.$emit('createFormSuccess');
            this.backFn();
            // this.$router.push({
            //   name: 'group-training',
            // });
          });
        } else {
          return false;
        }
      });
    },
    // 编辑训练详情
    getEditDetail() {
      editTrainingApi({ resource_id: this.id }).then((res) => {
        const crEventData = _.get(res, 'data.data', []);
        this.ruleForm.category = crEventData.category;
        this.ruleForm.name = crEventData.name;
        this.ruleForm.logo = crEventData.logo;
        if (this.ruleForm.logo) {
          this.list.push({ url: this.ruleForm.logo });
        }
        this.ruleForm.pre_skill = crEventData.pre_skill;
        this.ruleForm.train_skill = crEventData.train_skill;
        this.ruleForm.dateTime = [];
        this.ruleForm.dateTime[0] = crEventData.start_time;
        this.ruleForm.dateTime[1] = crEventData.end_time;
        this.ruleForm.description = crEventData.description;
        this.ruleForm.template_name = crEventData.template_name;
        this.ruleForm.enable_recording = crEventData.enable_recording;
        this.originData = JSON.parse(JSON.stringify(this.ruleForm));
        this.rolesInfo.splice(0);
        this.lastUserDataId.splice(0);
        const tempArr = crEventData.roles_data;
        tempArr.forEach((item) => {
          this.lastUserDataId.push(...item.users);
          item.users.splice(0);
          item.users.push(...item.users_data);
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
    addSelectUser(data, index) {
      const roleValue = index;
      let userData = this.$refs.modelDragSelector?.selectUser || [];
      userData?.forEach((item) => {
        if (!this.lastUserDataId.includes(item.resource_id)) {
          this.$set(this.rolesInfo, roleValue, {
            ...this.rolesInfo[roleValue],
            users: [...this.rolesInfo[roleValue].users, item],
          });
          this.lastUserDataId.push(item.resource_id);
        }
      });
      this.$refs.modelDragSelector.clearSelect();
    },
  },
};
</script>

<style scoped lang="scss">
.role-delete {
  width: 32px;
  height: 32px;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  margin: 0 auto;
  text-align: center;
  line-height: 32px;
  display: none;

  img {
    vertical-align: middle;
  }
}

.item {
  cursor: pointer;
  position: relative;
  width: 90px;
  min-height: 80px;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    .role-delete {
      display: block;
    }
  }
}

.arrow-div {
  .icon-daoru {
    color: var(--neutral6);
    font-size: 30px !important;
  }
}

.userimg {
  display: block;
  width: 40px;
  margin: 0 auto;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-color-3);
  outline: 1px solid var(--neutral1);
}

.username {
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  margin-top: 4px;
  color: var(--neutral8);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}

.manage-group {
  width: 100%;
  box-sizing: border-box;
  border-radius: 2px 0 0 2px;
}

.group-content {
  margin-bottom: 8px;
  box-sizing: border-box;
  clear: left;
  display: flex;

  .roles-list {
    box-sizing: border-box;
    border-radius: 2px;
    overflow: hidden;
    min-height: 80px;
    width: calc(100% - 85px);
    background: var(--bg-color-3);
    position: relative;

    .tip {
      position: absolute;
      width: 150px;
      height: 22px;
      line-height: 22px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      color: var(--neutral5);
    }
  }

  .common-span {
    font-size: 14px;
    width: 90px;
    display: inline-block;
    height: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 20px;
    margin-top: 8px;
  }
}

.train-detail-wrap {
  width: 100%;

  .header {
    height: 56px;
    line-height: 56px;
    background: var(--bg-color-2);
    position: relative;
    margin-bottom: 16px;

    .back {
      padding: 0 8px;
      position: absolute;
      left: 8px;
      top: 8px;
      height: 40px;
      line-height: 40px;
      background: var(--neutral0);
      text-align: center;
      border-radius: 2px;
      cursor: pointer;

      span {
        font-size: 14px;
        color: var(--primary-color);
      }
    }

    .title {
      position: absolute;
      left: 100px;
      top: 0;
      font-size: 24px;
    }

    .header-right {
      position: absolute;
      right: 16px;
      top: 0px;
    }
  }

  .main-wrap {
    padding: 0 40px;
  }

  .top-content {
    background: var(--bg-color-2);
    padding: 16px;
    border-radius: 4px;
  }

  .basic-info {
    ::v-deep.cb-form-tags {
      .cb-tag {
        margin-bottom: 10px;
      }

      .cb-button {
        margin-bottom: 10px;
      }

      .cb-input {
        margin-bottom: 10px;
      }
    }

    ::v-deep.el-form {
      padding: 0;
    }

    .width36 {
      width: 36%;
    }

    .showImg {
      margin-top: 10px;
      width: 200px;
      height: 100px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .train-member {
    background: var(--bg-color-2);
    margin-top: 16px;
    height: 552px;
    padding: 16px;

    ::v-deep .cb-block {
      .cb-block-title-container {
        margin-bottom: 16px !important;
      }
    }

    .roles-group-comp {
      height: calc(100% - 80px);
      display: flex;

      .left-wrap {
        width: 41%;

        .ungroup-roles {
          height: 100%;
          box-sizing: border-box;

          ::v-deep .elc-user-drag-selector {
            .filter-container {
              .filter-group {
                margin-top: 0px !important;
                margin-bottom: 16px;

                .el-cascader {
                  margin-right: 4px;
                }
              }
            }
          }
        }
      }

      .arrow-div {
        width: 4%;

        display: flex;
        justify-content: center;
        align-items: center;

        .cb-iconfont {
          color: var(--neutral6);
        }
      }

      .right-wrap {
        width: 55%;
        margin-top: 60px;
        overflow-y: scroll;
      }
    }
  }
  .rolename {
    display: flex;
    align-items: baseline;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
