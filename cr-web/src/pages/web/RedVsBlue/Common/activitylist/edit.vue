<template>
  <div class="redvsblue_edit_page write-content">
    <cb-form
      ref="ruleForm"
      :model="ruleForm"
      size="mini"
      :rules="rules"
      :label-width="language === 'en-US' ? '150px' : '100px'"
      class="demo-ruleForm"
    >
      <div class="common-form-div">
        <div class="input-div-left fl">
          <cb-form-item :label="$t('m.templateName')" prop="template_name">
            <cb-input
              v-model="ruleForm.template_name"
              disabled
              class="train-input forbidden elc-input"
              :placeholder="$t('m.templateNamePh')"
            />
          </cb-form-item>
        </div>
        <div class="input-div-left fl">
          <cb-form-item
            :label="$t('m.trainingName')"
            prop="name"
            :label-width="language === 'en-US' ? '150px' : '86px'"
          >
            <cb-input
              v-model="ruleForm.name"
              class="elc-input"
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
              v-model="ruleForm.category"
              class="elc-select"
              :placeholder="$t('m.trainingCategroyPh')"
              style="width: 50%; height: auto"
            >
              <cb-option
                v-for="item in categoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
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
                  class="form-time elc-date-picker"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('m.startTimePh')"
                  style="width: 100%"
                  @change="setEndTime"
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
            type="textarea"
            class="elc-input"
            :placeholder="$t('m.specificationPh')"
            @blur="descInpBlur"
          />
        </cb-form-item>
      </div>
      <div class="common-form-div">
        <cb-form-item :label="$t('m.screenRecord')" prop="enable_recording">
          <cb-switch v-model="ruleForm.enable_recording" />
        </cb-form-item>
      </div>
      <div class="common-form-div">
        <cb-form-item
          :label="$t('crEvent.partialStart')"
          prop="support_partial_start"
        >
          <cb-switch v-model="ruleForm.support_partial_start" />
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
                <template v-if="rolesInfo.length">
                  <div class="manage-group">
                    <div
                      v-for="(role, index) in rolesInfo"
                      :key="role.resource_id"
                      class="group-content"
                    >
                      <div
                        v-if="role.role_group < 4"
                        ref="roleUserList"
                        class="director fl"
                        :data-key="index"
                      >
                        <div class="rolename fl">
                          <div style="display: flex; align-items: center">
                            <span class="green-color common-circle">•</span>
                            <span class="common-span green-color">{{
                              $t('m.managementGroup') + ' - '
                            }}</span>
                          </div>
                          <span
                            class="common-span one-overflow white-color"
                            style="padding-left: 16px"
                          >
                            <template
                              v-if="
                                role.role_group ===
                                $CONSTANT.Role.RedVsBlue.ADMIN.value
                              "
                            >
                              {{ $t('common.admin') }}
                            </template>
                            <template
                              v-else-if="
                                role.role_group ===
                                $CONSTANT.Role.RedVsBlue.DIRECTOR.value
                              "
                            >
                              {{ $t('common.director') }}
                            </template>
                            <template
                              v-else-if="
                                role.role_group ===
                                $CONSTANT.Role.RedVsBlue.REFEREE.value
                              "
                            >
                              {{ $t('common.referee') }}
                            </template>
                          </span>
                        </div>
                        <div class="roles-list fl">
                          <div
                            v-for="(user, userindex) in role.children"
                            :key="user.resource_id"
                            class="item fl"
                            style="margin-bottom: 0px"
                          >
                            <img
                              class="userimg"
                              :src="user.logo || helper.defaultUserLogo"
                              alt
                            />
                            <div
                              class="username one-overflow white-color"
                              :title="user.name"
                            >
                              {{ user.name }}
                            </div>
                            <div
                              v-show="userData.resource_id !== user.resource_id"
                              class="role-delete cursor"
                              @click="
                                removeRoleUser(
                                  index,
                                  null,
                                  userindex,
                                  user.resource_id,
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
                              <!-- <img src="@/assets/img/home/delete_drag.png"> -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-for="(role, index) in rolesInfo">
                  <div
                    v-if="role.role_group >= 4"
                    :key="role.value"
                    class="manage-group"
                  >
                    <div v-if="role.children.length > 0" class="director fl">
                      <div
                        v-for="(child, childIndex) in role.children"
                        :key="childIndex"
                        class="group-content"
                      >
                        <div class="rolename fl" :title="child.name">
                          <div style="display: flex; align-items: center">
                            <span
                              :class="
                                role.role_group === 4
                                  ? 'red-color'
                                  : 'blue-color'
                              "
                              class="common-circle"
                              >•</span
                            >
                            <span
                              :class="
                                role.role_group === 4
                                  ? 'red-color'
                                  : 'blue-color'
                              "
                              class="common-span"
                            >
                              <template
                                v-if="
                                  role.role_group ===
                                  $CONSTANT.Role.RedVsBlue.REDUSER.value
                                "
                              >
                                {{ $t('common.redUser') + ' - ' }}
                              </template>
                              <template v-else>
                                {{ $t('common.blueUser') + ' - ' }}
                              </template>
                            </span>
                          </div>
                          <span
                            class="common-span one-overflow white-color"
                            style="padding-left: 16px"
                            >{{ child.name }}</span
                          >
                        </div>
                        <div
                          ref="roleUserList"
                          class="roles-list fl"
                          :data-key="index + '_' + childIndex"
                        >
                          <div
                            v-for="(user, userindex) in child.children"
                            :key="user.resource_id"
                            class="item fl"
                            style="margin-bottom: 0px"
                          >
                            <img
                              class="userimg"
                              :src="user.logo || helper.defaultUserLogo"
                              alt
                            />
                            <div
                              class="username one-overflow white-color"
                              :title="user.name"
                            >
                              {{ user.name }}
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
                              <!-- <img src="@/assets/img/home/delete_drag.png"> -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
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
          :businessType="BUSINESS_TYPE.CR_WEB_RED"
          @sendFormData="getImgUrl"
        ></cutimg>
      </span>
    </cb-dialog>
    <!-- </el-scrollbar> -->
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
  name: 'GruopModelList',
  components: { UserDragSelector, Cutimg },
  data() {
    var validateUser = (rule, value, callback) => {
      // 获取导演裁判组user
      const fliterData = _.filter(this.rolesInfo, (item) => {
        return item.role_group !== 1 && item.children.length === 0;
      });
      const redblueArr = [];
      _.forEach(this.rolesInfo, (item) => {
        if (item.role_group === 4 || item.role_group === 5) {
          _.forEach(item.children, (child) => {
            if (child.children.length === 0) {
              redblueArr.push(child);
            }
          });
        }
      });
      const fliterAll = _.concat(fliterData, redblueArr);
      if (fliterAll.length > 0) {
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
        start_time: '',
        end_time: '',
        template_name: '',
        enable_recording: true,
        role_info: [],
        support_partial_start: false,
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
        start_time: [
          { required: true, validator: Validate.startTime, trigger: 'change' },
        ],
        end_time: [
          { required: true, validator: Validate.endTime, trigger: 'change' },
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
      searchCondition: {},
      lastUserDataId: [],
      isAdd: true,
      originData: null,
      createdFlag: false,
      resource_id: '',
      originUserInfo: [],
      dialogVisible: false,
    };
  },
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
    // 红蓝编辑靶场训练类别请求
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
    // 前置技能
    preSkillClose(tag) {
      this.ruleForm.pre_skill.splice(this.ruleForm.pre_skill.indexOf(tag), 1);
    },
    handlePreSkillConfirm(value) {
      if (value) {
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
    // 编辑训练实例
    submitForm() {
      // if (this.createdFlag) return;
      const params = {};
      for (const key in this.ruleForm) {
        if (
          JSON.stringify(this.ruleForm[key]) !==
          JSON.stringify(this.originData[key])
        ) {
          if (typeof this.ruleForm[key] === 'object') {
            params[key] = JSON.stringify(this.ruleForm[key]);
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
          const roleId = [];
          const roleData = JSON.parse(JSON.stringify(item.children));
          if (item.role_group <= 3) {
            roleData.forEach((role) => {
              roleId.push(role.resource_id);
            });
            item.users = roleId;
          } else {
            item.users = [];
            roleData.forEach((role) => {
              const childData = JSON.parse(JSON.stringify(role.children));
              const childId = [];
              childData.forEach((child) => {
                childId.push(child.resource_id);
              });
              role.users = childId;
            });
            role_config.push(...roleData);
          }
        });
        role_config.forEach((item) => {
          delete item.id;
          delete item.name;
          delete item.cr_event;
          delete item.description;
          delete item.missions_scheme;
          delete item.parent;
          delete item.nodes;
          delete item.children;
          delete item.role_group;
          delete item.exercise_paper;
          delete item.users_data;
          delete item.exercise_paper;
          delete item.parent_hash;
          delete item.red_vs_blue;
        });
        params.role_config = JSON.stringify(role_config);
      }
      const _this = this;

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          _this.createdFlag = true;
          // 红蓝管理员编辑靶场确认
          this.$request
            .put(
              '/cr/red_vs_blue/red_vs_blue/',
              { ...params, resource_id: this.resource_id },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              _this.$message.success(this.$t('m.saveSuccess'));
              // _this.$router.push({
              //   path: `/scenario_home/${this.resource_id}`,
              // });
              // _this.$router.push('/red_vs_blue')
              _this.createdFlag = false;
              this.$emit('closed');
            })
            .catch((error) => {
              _this.createdFlag = false;
              _this.error(error);
            });
        } else {
          return false;
        }
      });
    },

    close() {
      this.$emit('closed');
      this.$refs.ruleForm.resetFields();
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
    // 移除用户
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
    getSceneDetil() {
      //管理员登录点击编辑靶场
      this.$request
        .get(
          '/cr/red_vs_blue/red_vs_blue/',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const crEventData = res.data.data;
          this.ruleForm.category = crEventData.category;
          this.ruleForm.name = crEventData.name;
          this.ruleForm.logo = crEventData.logo;
          this.ruleForm.pre_skill = crEventData.pre_skill;
          this.ruleForm.train_skill = crEventData.train_skill;
          this.ruleForm.start_time = crEventData.start_time;
          this.ruleForm.end_time = crEventData.end_time;
          this.ruleForm.description = crEventData.description;
          this.ruleForm.enable_recording = crEventData.enable_recording;
          this.ruleForm.template_name = crEventData.template_name;
          this.ruleForm.enable_recording = crEventData.enable_recording;
          this.ruleForm.support_partial_start =
            crEventData.support_partial_start;
          // this.ruleForm.template_name =
          //   crEventData.scene_config_data.topology_config.scene.name;
          this.originData = JSON.parse(JSON.stringify(this.ruleForm));
          this.originData.duration_time = crEventData.duration_time;
          this.rolesInfo.splice(0);
          this.lastUserDataId.splice(0);
          const tempArr = crEventData.roles_data;
          tempArr.forEach((item) => {
            if (item.role_group <= 3) {
              item.children.push(...item.users_data);
              this.lastUserDataId.push(...item.users);
            } else if (item.role_group > 3) {
              item.children.forEach((subitem) => {
                subitem.children.push(...subitem.users_data);
                this.lastUserDataId.push(...subitem.users);
              });
            }
          });
          this.rolesInfo.push(...tempArr);
          this.originUserInfo = JSON.parse(JSON.stringify(this.rolesInfo));
          this.$nextTick(function () {
            this.$refs.modelDragSelector.targetContainers =
              this.$refs.roleUserList;
          });
          _.forEach(this.rolesInfo, (item) => {
            _.forEach(item.children, (child) => {
              if (!child.children) {
                this.$set(child, 'name', child.rep_name);
              } else {
                _.forEach(child.children, (rchild) => {
                  this.$set(rchild, 'name', rchild.rep_name);
                });
              }
            });
          });
        });
    },
  },
};
</script>
<style scoped lang="scss">
.redvsblue_edit_page {
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
    $input-textarea-placeholder: rgba(192, 204, 231, 0.5);
    $input-textarea: rgba(192, 204, 231, 1);

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
    // ::v-deep textarea::-webkit-input-placeholder {
    //   color: $input-textarea-placeholder!important;
    // }
    // ::v-deep input::-moz-input-placeholder,
    // ::v-deep textarea::-moz-input-placeholder {
    //   color: $input-textarea-placeholder!important;
    // }
    // ::v-deep input::-ms-input-placeholder,
    // ::v-deep textarea::-ms-input-placeholder {
    //   color: $input-textarea-placeholder!important;
    // }
    ::v-deep .el-input__icon {
      margin: 0 5px 0 5px;
      font-size: 14px;
      line-height: 36px;
      // color: $input-textarea-placeholder!important;
    }
    ::v-deep .el-textarea__inner {
      font-size: 14px !important;
    }
    ::v-deep .el-select {
      width: 100% !important;
      ::v-deep .el-input__inner {
        height: 36px !important;
      }
      ::v-deep .el-input__icon {
        margin: 0 5px 0 5px;
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
    line-height: 23px;
  }
  .roles-group-comp {
    height: 400px;
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
      background: rgba(36, 44, 59, 0.8);
      /*background:rgba(150,18,43,.8);*/
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
  $borderColor: rgba(67, 76, 110, 0.76);
  .grouped-roles {
    color: #fff;
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
      width: 100%;
      display: inline-block;
      box-sizing: border-box;
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
          width: 105px;
          margin-top: 15px;
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
        width: calc(100% - 105px);
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
