<template>
  <div class="train-detail-wrap">
    <train-top-title
      v-if="id"
      :detail-title="$t('admin.editTraining')"
      @back="backHome"
    ></train-top-title>
    <div :class="[id ? 'main-wrap' : '']">
      <div class="basic-info">
        <block :title="$t('list.basicInfo')"></block>
        <cb-form
          ref="formRef"
          :model="ruleForm"
          :rules="rules"
          :label-width="language === 'en-US' ? '150px' : '100px'"
        >
          <div class="width36">
            <cb-form-item :label="$t('m.templateName')" prop="template_name">
              <cb-input
                v-model="ruleForm.template_name"
                disabled
                :placeholder="$t('m.templateNamePh')"
              />
            </cb-form-item>
            <cb-form-item :label="$t('m.trainingName')" prop="name">
              <cb-input
                v-model="ruleForm.name"
                :disabled="!isCreate"
                :placeholder="$t('m.trainingNamePh')"
                @blur="nameInpBlur"
              />
            </cb-form-item>
            <cb-form-item prop="dateTime" :label="$t('list.trainingTime')">
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
            <cb-form-item :label="$t('m.trainingCategroy')" prop="category">
              <cb-select
                style="width: 100%"
                v-model="ruleForm.category"
                :placeholder="$t('m.trainingCategroyPh')"
                :disabled="!isCreate"
                :options="categoryList"
              >
              </cb-select>
            </cb-form-item>
          </div>
          <cb-form-item :label="$t('m.cover')" prop="logo">
            <cb-input v-model="ruleForm.logo" style="display: none" />
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
          <cb-form-item :label="$t('m.frontSkills')" prop="pre_skill">
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
          <cb-form-item :label="$t('m.trainingSkills')" prop="train_skill">
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
          <cb-form-item :label="$t('m.taskDescription')" prop="description">
            <cb-input
              v-model="ruleForm.description"
              type="textarea"
              :disabled="!isCreate"
              :placeholder="$t('m.specificationPh')"
              @blur="descInpBlur"
            />
          </cb-form-item>
          <cb-form-item :label="$t('m.screenRecord')" prop="enable_recording">
            <cb-switch v-model="ruleForm.enable_recording" />
          </cb-form-item>
          <cb-form-item
            :label="$t('list.partialStartup')"
            prop="support_partial_start"
          >
            <cb-switch v-model="ruleForm.support_partial_start" />
          </cb-form-item>

          <div slot="fixedBottom">
            <cb-button-group space="middle">
              <cb-button button-type="confirm" @click="confirm"></cb-button>
              <cb-button button-type="cancel" @click="cancel"></cb-button>
            </cb-button-group>
          </div>
        </cb-form>
      </div>
      <div class="train-member">
        <block :title="$t('list.trainers')"></block>
        <div class="roles-group-comp">
          <div class="left-wrap">
            <div class="ungroup-roles">
              <user-drag-selector
                ref="modelDragSelector"
                :disabled-user-list="disabledUserList"
                @select-user="dragSelectRoleUser"
              />
            </div>
          </div>
          <div class="arrow-div">
            <cb-iconfont
              :size="30"
              type="icon-daorujiantou"
              class="icon-daoru"
            ></cb-iconfont>
          </div>
          <div class="right-wrap cyber-scroll-bar-small">
            <template v-for="(role, index) in rolesInfo">
              <div
                ref="roleUserList"
                :key="childIndex"
                v-for="(child, childIndex) in role.children"
                :data-key="index + '_' + childIndex"
              >
                <div class="grouped-item" v-if="role.role_group < 4">
                  <span class="tag green">{{ $t('list.white') }}</span>
                  <span class="role" :title="child.name">{{ child.name }}</span>
                  <div class="user-list">
                    <div
                      class="user-item"
                      v-for="(user, userindex) in child.children"
                      :key="user.resource_id"
                    >
                      <div class="logo-wrap">
                        <img :src="user.logo || defaultLogo" />
                      </div>
                      <div
                        class="user-name"
                        :title="user.name || user.username"
                      >
                        {{ user.name || user.username }}
                      </div>
                      <div
                        class="role-delete cursor"
                        v-show="
                          rolesInfo[0].children[0].children[0].resource_id !==
                          user.resource_id
                        "
                        @click="
                          removeRoleUser(
                            index,
                            childIndex,
                            userindex,
                            user.resource_id,
                          )
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
                    <div class="tip" v-if="child.children.length === 0">
                      {{ $t('list.bringAvatar') }}
                    </div>
                  </div>
                </div>
                <div class="grouped-item" v-if="role.role_group >= 4">
                  <span class="tag red" v-if="role.role_group === 4">{{
                    $t('list.red')
                  }}</span>
                  <span class="tag blue" v-else>{{ $t('list.blue') }}</span>
                  <span class="role" :title="child.name">{{ child.name }}</span>
                  <div class="user-list">
                    <div
                      class="user-item"
                      v-for="(user, userindex) in child.children"
                      :key="user.resource_id"
                    >
                      <div class="logo-wrap">
                        <img :src="user.logo || defaultLogo" />
                      </div>
                      <div
                        class="user-name"
                        :title="user.name || user.username"
                      >
                        {{ user.name || user.username }}
                      </div>
                      <div
                        class="role-delete cursor"
                        @click="
                          removeRoleUser(
                            index,
                            childIndex,
                            userindex,
                            user.resource_id,
                          )
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
                    <div class="tip" v-if="child.children.length === 0">
                      {{ $t('list.bringAvatar') }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTrainingCategory,
  getTemplateList,
  uploadImage,
  createTraining,
  getEditBack,
  editTraining,
} from '@/api/web/red-blue';
import block from '@/components/block';
import UserDragSelector from '@/components/App/Auth/UserDragSelector2';
import TrainTopTitle from '@/components/student-common-detail/train-top-title/index.vue';
import { getLanguage } from '@cyber/helper';
import Validate from '@/utils/validate.js';
import Utils from '@/utils/util';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';
import defaultLogo from '@/assets/img/userhead.png';
export default {
  components: {
    block,
    UserDragSelector,
    TrainTopTitle,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      defaultLogo,
      BUSINESS_TYPE,
      isCheck: true,
      isCheckValue: '',
      isChecks: true,
      isChecksValue: '',
      language: getLanguage(),
      templateId: '',
      business_template_id: '',
      templateInfo: '',
      ruleForm: {
        template_name: '',
        name: '',
        dateTime: '',
        category: '',
        difficult: '',
        logo: '',
        pre_skill: [],
        train_skill: [],
        description: '',
        enable_recording: true,
        support_partial_start: false,
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
        description: [
          {
            required: true,
            message: this.$t('m.pleaseInputDescription'),
            trigger: 'blur',
          },

          {
            validator: Validate.description2048,
            trigger: ['blur', 'change'],
          },
        ],
      },
      isCreate: true,
      categoryList: [],
      rolesInfo: [],
      lastUserDataId: [],
    };
  },
  watch: {},
  computed: {
    disabledUserList() {
      const { rolesInfo = [] } = this;
      return rolesInfo.reduce(
        (acc, curr = {}) => {
          const { children = [] } = curr;
          for (const ele of children) {
            acc.push(ele.resource_id);
            if (ele.children && ele.children instanceof Array) {
              for (const sub of ele.children) {
                acc.push(sub.resource_id);
              }
            }
          }
          return acc;
        },
        [1],
      );
    },
    userData() {
      this.$set(this.$store.state.user, 'logo', this.$store.state.user.avatar);
      this.$set(this.$store.state.user, 'name', this.$store.state.user.name);
      this.$set(
        this.$store.state.user,
        'resource_id',
        this.$store.state.user.id,
      );
      return this.$store.state.user;
    },
  },
  created() {
    if (!this.id) {
      this.templateId = this.$route.params.templateId;
      this.business_template_id = this.$route.params.business_template_id;
    }
  },
  mounted() {
    this.getTrainingCategory();
    if (this.id) {
      this.getEditBack();
    }
  },
  methods: {
    backHome() {
      this.$router.go(-1);
    },
    initData() {
      const {
        name,
        category,
        difficult,
        logo,
        pre_skill,
        train_skill,
        description,
      } = this.templateInfo.cr_event_info;
      this.ruleForm.template_name = name;
      this.ruleForm.category = category;
      this.ruleForm.difficult = difficult;
      this.ruleForm.logo = logo;
      this.ruleForm.pre_skill = pre_skill;
      this.ruleForm.train_skill = train_skill;
      this.ruleForm.description = description;
      // 获取拖拽的目标容器
      this.$nextTick(() => {
        this.$refs.modelDragSelector.targetContainers = this.$refs.roleUserList;
      });
      this.rolesInfo[0].children[0].children.push(this.userData);
      this.lastUserDataId.push(this.userData.resource_id);
    },
    getTrainingCategory() {
      getTrainingCategory({ type: 3 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.categoryList = data.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
      if (!this.id) {
        this.getTemplateList();
      }
    },
    getTemplateList() {
      getTemplateList({ ids: this.business_template_id }).then((res) => {
        const data = _.get(res, 'data.data.list', []);
        this.rolesInfo = [];
        this.lastUserDataId = [];
        this.rolesInfo = data[0].role_info;
        this.templateInfo = data[0];
        this.rolesInfo.forEach((item) => {
          if (
            item.role_group === 1 ||
            item.role_group === 2 ||
            item.role_group === 3
          ) {
            item.children.push({
              name: item.name,
              children: [],
            });
          }
        });
        this.initData();
      });
    },
    uploadFunc(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 5);
      uploadImage(formData).then((res) => {
        const data = _.get(res, 'data.data', '');
        this.ruleForm.logo = data.file_path;
      });
    },
    removeLogo() {
      this.ruleForm.logo = '';
    },
    // input去除空格
    nameInpBlur() {
      this.ruleForm.name = this.ruleForm.name.trim();
    },
    descInpBlur() {
      this.ruleForm.description = this.ruleForm.description.trim();
    },
    handlePreSkillConfirm(value) {
      if (value) {
        //校验和后台一样
        this.isCheckValue = '';
        this.isCheck = true;
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
    handleTrainSkillConfirm(value) {
      if (value) {
        this.isChecksValue = '';
        this.isChecks = true;
        // 校验和后台一样
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
          this.isChecks = true;
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
    // 用户选择
    dragSelectRoleUser(userData, pos, targetContainer) {
      const roleValue = targetContainer.getAttribute('data-key');
      if (!this.lastUserDataId.includes(userData.resource_id)) {
        let userPos = [];
        if (roleValue.indexOf('_')) {
          userPos = roleValue.split('_');
        }
        if (userPos.length === 2) {
          const firstIndex = userPos[0];
          const lastIndex = userPos[1];
          this.rolesInfo[firstIndex].children[lastIndex].children.push(
            userData,
          );
        } else {
          this.rolesInfo[roleValue].children.push(userData);
        }
        this.lastUserDataId.push(userData.resource_id);
      } else {
        return;
      }
    },
    removeRoleUser(index, childIndex, roleindex, id) {
      if (childIndex !== null) {
        this.rolesInfo[index].children[childIndex].children.splice(
          roleindex,
          1,
        );
      } else {
        this.rolesInfo[index].children.splice(roleindex, 1);
      }
      this.lastUserDataId.splice(this.lastUserDataId.indexOf(id), 1);
    },
    confirm() {
      if (this.id) {
        this.editConfirm();
      } else {
        this.createConfirm();
      }
    },
    validateUser() {
      const emptyRole = [];
      this.rolesInfo.forEach((item) => {
        item.children.forEach((child) => {
          if (!child.children.length) {
            emptyRole.push(child.children);
          }
        });
      });
      if (emptyRole.length) {
        return false;
      } else {
        return true;
      }
    },
    createConfirm() {
      const role_config = [];
      this.rolesInfo.forEach((item) => {
        if (
          item.role_group === 1 ||
          item.role_group === 2 ||
          item.role_group === 3
        ) {
          item.children.forEach((child) => {
            let users = [];
            child.children.forEach((user) => {
              users.push(user.resource_id);
            });
            role_config.push({
              users: users,
            });
          });
        }
      });
      role_config.push({ users: [] });
      role_config.push({ users: [] });
      this.rolesInfo.forEach((item) => {
        if (item.role_group === 4 || item.role_group === 5) {
          item.children.forEach((child) => {
            let users = [];
            child.children.forEach((user) => {
              users.push(user.resource_id);
            });
            role_config.push({
              users: users,
            });
          });
        }
      });
      const data = {
        template: this.templateId,
        name: this.ruleForm.name,
        start_time: this.ruleForm.dateTime[0],
        end_time: this.ruleForm.dateTime[1],
        category: this.ruleForm.category,
        difficult: this.ruleForm.difficult,
        logo: this.ruleForm.logo,
        pre_skill: JSON.stringify(this.ruleForm.pre_skill),
        train_skill: JSON.stringify(this.ruleForm.train_skill),
        description: this.ruleForm.description,
        enable_recording: this.ruleForm.enable_recording,
        support_partial_start: this.ruleForm.support_partial_start,
        role_config: JSON.stringify(role_config),
      };
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return false;
        } else if (this.validateUser()) {
          createTraining(data).then((res) => {
            this.$router.push({
              name: 'red-vs-blue',
            });
          });
        } else {
          this.$message.error(this.$t('m.roleCannotEmpty'));
          return false;
        }
      });
    },
    editConfirm() {
      const role_config = [];
      this.rolesInfo.forEach((item) => {
        if (
          item.role_group === 1 ||
          item.role_group === 2 ||
          item.role_group === 3
        ) {
          item.children.forEach((child) => {
            const users = [];
            child.children.forEach((user) => {
              users.push(user.resource_id);
            });
            role_config.push({
              resource_id: item.resource_id,
              users: users,
            });
          });
        }
      });
      role_config.push({
        resource_id: 'redResourceId',
        users: [],
      });
      role_config.push({
        resource_id: 'blueResourceId',
        users: [],
      });
      this.rolesInfo.forEach((item) => {
        if (item.role_group === 4 || item.role_group === 5) {
          item.children.forEach((child) => {
            const users = [];
            child.children.forEach((user) => {
              users.push(user.resource_id);
            });
            role_config.push({
              resource_id: child.resource_id,
              users: users,
            });
          });
        }
      });
      editTraining({
        resource_id: this.id,
        name: this.ruleForm.name,
        start_time: this.ruleForm.dateTime[0],
        end_time: this.ruleForm.dateTime[1],
        category: this.ruleForm.category,
        difficult: this.ruleForm.difficult,
        logo: this.ruleForm.logo,
        pre_skill: JSON.stringify(this.ruleForm.pre_skill),
        train_skill: JSON.stringify(this.ruleForm.train_skill),
        description: this.ruleForm.description,
        enable_recording: this.ruleForm.enable_recording,
        support_partial_start: this.ruleForm.support_partial_start,
        role_config: JSON.stringify(role_config),
      }).then((res) => {
        this.$router.go(-1);
      });
    },
    getEditBack() {
      getEditBack({ resource_id: this.id }).then((res) => {
        const data = _.get(res, 'data.data', []);
        const {
          template_name,
          name,
          start_time,
          end_time,
          category,
          difficult,
          logo,
          pre_skill,
          train_skill,
          description,
          enable_recording,
          support_partial_start,
          roles_data,
        } = data;
        this.ruleForm.template_name = template_name;
        this.ruleForm.name = name;
        this.ruleForm.category = category;
        this.ruleForm.difficult = difficult;
        this.ruleForm.logo = logo;
        if (logo) {
          this.list.push({ url: logo });
        }
        this.ruleForm.pre_skill = pre_skill;
        this.ruleForm.train_skill = train_skill;
        this.ruleForm.description = description;
        this.ruleForm.enable_recording = enable_recording;
        this.ruleForm.support_partial_start = support_partial_start;
        this.ruleForm.dateTime = [];
        this.ruleForm.dateTime[0] = start_time;
        this.ruleForm.dateTime[1] = end_time;
        this.rolesInfo = [];
        this.lastUserDataId = [];
        const tempArr = roles_data;
        tempArr.forEach((item) => {
          if (item.role_group <= 3) {
            item.children = [
              {
                name: item.name,
                children: [],
              },
            ];
            item.children[0].children.push(...item.users_data);
            this.lastUserDataId.push(...item.users);
          } else if (item.role_group > 3) {
            item.children.forEach((subitem) => {
              subitem.children.push(...subitem.users_data);
              this.lastUserDataId.push(...subitem.users);
            });
          }
        });
        this.rolesInfo.push(...tempArr);
        this.$nextTick(function () {
          this.$refs.modelDragSelector.targetContainers =
            this.$refs.roleUserList;
        });
        this.rolesInfo.forEach((item) => {
          item.children.forEach((child) => {
            child.children.forEach((schild) => {
              this.$set(schild, 'name', schild.rep_name);
            });
          });
        });
      });
    },
    back() {
      this.$router.go(-1);
    },
    cancel() {
      if (this.id) {
        // 编辑取消
        this.$router.go(-1);
      } else {
        // 新增取消
        if (this.$route.name === 'red-blue-add') {
          this.$router.push({
            name: 'red-blue-template-detail',
            params: {
              resource_id: this.$route.query.resource_id,
              template_id: this.$route.query.template_id,
            },
          });
        } else {
          this.$router.push({
            name: 'red-vs-blue',
            params: {
              templateId: true,
            },
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.train-detail-wrap {
  width: 100%;
  .main-wrap {
    margin-top: 16px;
    padding: 0 40px;
  }
  .basic-info {
    border-radius: 4px;

    padding: 16px;
    background: var(--bg-color-2);
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
    ::v-deep.cb-form-tags .cb-tag {
      margin-bottom: 10px;
    }
    ::v-deep.cb-button {
      margin-bottom: 10px;
    }
    ::v-deep.cb-input {
      margin-bottom: 10px;
    }
  }
  .train-member {
    border-radius: 4px;
    margin-top: 16px;
    height: 552px;
    padding: 16px;
    background: var(--bg-color-2);
    ::v-deep .cb-block {
      .cb-block-title-container {
        margin-bottom: 16px;
      }
    }
    .roles-group-comp {
      height: calc(100% - 80px);
      display: flex;
      .left-wrap {
        width: 41%;
        .ungroup-roles {
          height: 100%;
          padding: 0 10px 10px;
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
        .grouped-item {
          min-height: 80px;
          display: flex;
          margin-bottom: 8px;
          .tag {
            width: 40px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            font-size: 12px;
            margin-right: 8px;
            margin-top: 30px;
          }
          .green {
            background: var(--green-color-2);
            color: var(--green-color);
          }
          .red {
            background: var(--red-color-2);
            color: var(--red-color);
          }
          .blue {
            background: var(--primary-color-2);
            color: var(--primary-color);
          }
          .role {
            width: 90px;
            height: 22px;
            font-size: 14px;
            margin-right: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 32px;
          }
          .user-list {
            border-radius: 2px;
            flex: 1;
            background: var(--bg-color-3);
            position: relative;
            display: flex;
            flex-wrap: wrap;
            .tip {
              width: 150px;
              height: 22px;
              line-height: 22px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              font-size: 14px;
              color: var(--neutral5);
            }
            .user-item {
              width: 90px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 10px;
              position: relative;
              .logo-wrap {
                width: 40px;
                height: 40px;
                line-height: 40px;
                border-radius: 50%;
                background: var(--bg-color-3);
                outline: 1px solid var(--neutral1);

                img {
                  border-radius: 50%;
                  width: 100%;
                  height: 100%;
                }
              }
              .user-name {
                font-size: 12px;
                color: var(--neutral8);
                height: 20px;
                line-height: 20px;
                margin-top: 4px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                width: 100%;
                text-align: center;
              }
              .role-delete {
                display: none;
                position: absolute;
                width: 32px;
                height: 32px;
                position: absolute;
                top: 11px;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 50%;
                background: rgba(36, 44, 59, 0.8);
                margin: 0 auto;
                text-align: center;
                line-height: 70px;
                img {
                  vertical-align: middle;
                }
              }
              &:hover {
                .role-delete {
                  display: block;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
