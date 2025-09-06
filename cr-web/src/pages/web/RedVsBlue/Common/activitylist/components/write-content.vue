<template>
  <div class="write-content">
    <!-- <el-scrollbar> -->
    <cb-form
      ref="ruleForm"
      :model="ruleForm"
      size="mini"
      :rules="rules"
      class="demo-ruleForm"
      :label-width="language === 'en-US' ? '150px' : '100px'"
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
              class="train-input forbidden elc-input"
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
              class="elc-input"
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
              v-model="ruleForm.category"
              class="elc-select"
              :placeholder="$t('m.trainingCategroyPh')"
              :disabled="!isCreate"
            >
              <!-- 训练类别 -->
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
                  type="datetime"
                  :disabled="!isCreate"
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
                  :disabled="!isCreate"
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
            v-if="ruleForm.logo !== ''"
            :src="ruleForm.logo"
          />
        </cb-form-item>
      </div>
      <!-- 前置技能 -->
      <div class="common-form-div">
        <cb-form-item
          :label="$t('m.frontSkills')"
          class="common-skill"
          prop="pre_skill"
        >
          <label slot="label">
            <!-- <span class="red-start">*</span> -->
            <span>{{ $t('m.frontSkills') }}</span>
          </label>
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
      <!-- 训练技能 -->
      <div class="common-form-div">
        <cb-form-item
          :label="$t('m.trainingSkills')"
          class="common-skill"
          prop="train_skill"
        >
          <label slot="label">
            <!-- <span class="red-start">*</span> -->
            <span>{{ $t('m.trainingSkills') }}</span>
          </label>
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
          <cb-switch v-model="ruleForm.enable_recording" />
        </cb-form-item>
      </div>
      <div class="common-form-div">
        <cb-form-item :label="$t('crEvent.partialStart')">
          <cb-switch v-model="ruleForm.support_partial_start" />
        </cb-form-item>
      </div>
      <div class="common-form-div">
        <cb-form-item :label="$t('m.trainingRoles')" prop="role_info">
          <!-- <label slot="label">
            <span class="red-start">*</span>
            <span>{{ $t('m.trainingRoles') }}</span>
          </label> -->
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
                            <span class="common-span green-color">
                              {{ $t('m.managementGroup') + ' - ' }}
                            </span>
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
                            style="margin-bottom: 0"
                          >
                            <img
                              class="userimg"
                              :src="user.logo || helper.defaultUserLogo"
                              alt
                            />
                            <div
                              class="username one-overflow white-color"
                              :title="user.name || user.username"
                            >
                              {{ user.name || user.username }}
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
                              <!-- <img src="@/assets/img/home/delete_drag.png"> -->
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
                                  : 'color-blue'
                              "
                              class="common-circle"
                              >•</span
                            >
                            <span
                              :class="
                                role.role_group === 4
                                  ? 'red-color'
                                  : 'color-blue'
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
                          >
                            {{ child.name }}
                          </span>
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
                            style="margin-bottom: 0"
                          >
                            <img
                              class="userimg"
                              :src="user.logo || helper.defaultUserLogo"
                              alt
                            />
                            <div
                              class="username one-overflow white-color"
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
  name: 'WriteContent',
  components: {
    // Search,
    // ListCommon,
    // emptyPage,
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
      // 获取导演裁判组user
      const fliterData = _.filter(value, (item) => {
        return item.role_group !== 1 && item.children.length === 0;
      });
      const redblueArr = [];
      _.forEach(value, (item) => {
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
      // language: this.$store.getters.language,
      language: getLanguage(),
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
        enable_recording: false,
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
      // 训练类别
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
  watch: {
    'ruleForm.start_time'(nv, ov) {
      if (nv) {
        const tempTime = moment(this.ruleForm.start_time.valueOf())
          .add(this.originData.cr_event_info.duration_time, 'hours')
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
    //标签验证
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
      const tempCrEventInfo = JSON.parse(JSON.stringify(val.cr_event_info));
      this.ruleForm.category = tempCrEventInfo.category;
      this.ruleForm.description = tempCrEventInfo.description;
      this.ruleForm.logo = tempCrEventInfo.logo;
      this.ruleForm.pre_skill = tempCrEventInfo.pre_skill;
      this.ruleForm.train_skill = tempCrEventInfo.train_skill;
      this.ruleForm.template_name = tempCrEventInfo.name;
      this.rolesInfo.splice(0);
      this.rolesInfo.push(...JSON.parse(JSON.stringify(val.role_info)));
      this.$nextTick(function () {
        this.$refs.modelDragSelector.targetContainers = this.$refs.roleUserList;
      });
      this.lastUserDataId.splice(0);
      this.rolesInfo[0].children.push(this.userData);
      this.lastUserDataId.push(this.userData.resource_id);
    },
    // 前置技能
    preSkillClose(tag) {
      this.ruleForm.pre_skill.splice(this.ruleForm.pre_skill.indexOf(tag), 1);
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
    ensureCreate() {
      this.ruleForm.role_info = this.rolesInfo;
      const params = {};
      params.template = this.originData.resource_id; // 模板的resource_id
      params.category = this.ruleForm.category;
      params.enable_recording = this.ruleForm.enable_recording;
      params.name = this.ruleForm.name;
      params.logo = this.ruleForm.logo;
      params.pre_skill = JSON.stringify(this.ruleForm.pre_skill);
      params.train_skill = JSON.stringify(this.ruleForm.train_skill);
      params.difficult = this.originData.cr_event_info.difficult;
      params.start_time = this.ruleForm.start_time;
      params.end_time = this.ruleForm.end_time;
      params.description = this.ruleForm.description;
      params.enable_recording = this.ruleForm.enable_recording;
      params.support_partial_start = this.ruleForm.support_partial_start;
      params.scene_config = this.originData.scene_config;
      const role_config = JSON.parse(JSON.stringify(this.rolesInfo));
      role_config.forEach((item) => {
        delete item.id;
        delete item.name;
        delete item.cr_event;
        delete item.description;
        delete item.missions_scheme;
        delete item.missions_scheme;
        delete item.parent;
        delete item.nodes;
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
        delete item.missions_scheme;
        delete item.parent;
        delete item.nodes;
        delete item.children;
        delete item.role_group;
      });
      params.role_config = JSON.stringify(role_config);
      const _this = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          _this.createdFlag = true;
          _this.$request
            .post('/cr/red_vs_blue/red_vs_blue/', params, {
              baseURL: '/api/ojj',
            })
            .then((res) => {
              _this.$message.success(this.$t('m.saveSuccess'));
              _this.createdFlag = false;
              _this.$emit('createFormSuccess');
            })
            .catch((error) => {});
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

    ::v-deep .el-form-item {
      width: 100%;
    }

    ::v-deep .el-form-item__label {
      // color: $input-textarea-placeholder;
      line-height: 36px;
    }

    ::v-deep .el-input__inner {
      height: 36px !important;
      border-radius: 2px;
      width: 100% !important;
    }

    ::v-deep .el-input__icon {
      color: $input-textarea-placeholder;
      margin: 0 5px 0 5px;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
    }
    ::v-deep .el-textarea__inner {
      font-size: 14px;
    }
    ::v-deep .el-select {
      width: 100%;
      ::v-deep .el-input__inner {
        height: 36px !important;
      }
      ::v-deep .el-input__icon {
        margin: 0 5px 0 5px;
      }
    }
    ::v-deep .el-input--suffix .el-input__inner {
      margin-top: 0;
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
        // background:rgba(36,44,60,1);
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
  ::v-deep.el-scrollbar__view {
    height: 100%;
    padding: 0 10px;
  }
}
label {
  font-weight: normal !important;
}
</style>
