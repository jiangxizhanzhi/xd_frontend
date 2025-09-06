<template>
  <!--红蓝对抗新增-->
  <cb-dialog
    class="red-blue-add"
    :visible.sync="dialogAddVisible"
    center
    width="68.13%"
    style="padding: 0 50px"
    @close="resetDialog"
  >
    <div slot="title" class="header-title">
      <div class="external-div">
        <div
          class="common-div"
          :class="currentIndex === 0 ? 'current' : 'normal'"
        >
          <div class="number fl">1</div>
          <span>{{ $t('m.changeTemplate') }}</span>
        </div>
        <div>
          <span class="line-color">------------------------------</span>
        </div>
        <div
          class="common-div"
          :class="currentIndex === 1 ? 'current' : 'normal'"
        >
          <div class="number fl">2</div>
          <span>{{ $t('m.writeContent') }}</span>
        </div>
      </div>
      <!-- <div class="external-div">
        <div class="common fl" :class="currentIndex === 0?'current': 'normal'">
          <span>1.{{ $t('m.changeTemplate') }}</span>
        </div>
        <div class="common fl" :class="currentIndex === 1?'current': 'normal'">
          <span>2.{{ $t('m.writeContent') }}</span>
        </div>
      </div> -->
    </div>
    <div class="content">
      <cb-scrollbar>
        <div v-show="currentIndex === 0" class="change-template">
          <slot name="changeTemplate" />
        </div>
        <div v-if="currentIndex === 1" class="enter-content resource-list">
          <slot name="writeContent" />
        </div>
      </cb-scrollbar>
    </div>
    <div slot="footer" class="dialog-footer">
      <cb-button v-show="currentIndex === 1" mr @click="nextStep('pre')">
        {{ this.$t('m.previous') }}
      </cb-button>
      <cb-button
        v-show="currentIndex === 1"
        mr
        button-type="confirm"
        @click="ensureCreate"
      >
        {{ this.$t('m.ensure') }}
      </cb-button>
      <cb-button
        v-show="currentIndex === 0 || currentIndex === 1"
        button-type="cancel"
        @click="resetDialog"
      >
        {{ this.$t('common.cancel') }}
      </cb-button>
    </div>
  </cb-dialog>
</template>

<script>
import defaultUserLogo from '@/assets/img/userhead.png';
import Validate from '@/utils/validate.js';
import _ from 'lodash';
import moment from 'moment';
export default {
  name: 'AddDialog',
  components: {},
  props: {
    isCheck: {
      type: Boolean,
      default: true,
    },
    isChecks: {
      type: Boolean,
      default: true,
    },
    isCheckValue: {
      type: String,
      default: '',
    },
    isChecksValue: {
      type: String,
      default: '',
    },
    editId: {
      type: String,
      default: () => {},
    },
    createForm: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogAddVisible: false,
      currentIndex: 0,
      choosedScene: '',
      language: this.$store.getters.language,
      ruleForm: {
        name: '',
        category: '',
        pre_skill: [],
        train_skill: [],
        description: '',
        start_time: '',
        end_time: '',
        template_name: '',
        role_info: [],
      },
      pickerBirthdayBefore: {
        disabledDate: (time) => {
          const beginDateVal = this.ruleForm.start_time;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime();
          }
        },
      },
      rules: {
        name: [{ required: true, validator: Validate.name, trigger: 'blur' }],
        description: [
          { required: true, validator: Validate.description, trigger: 'blur' },
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
      addPreTagsStatus: false,
      addTrainTagsStatus: false,
      endTimeTips: false,
      trainTipsVisible: false,
      trainValidateTips: '',
      trainSkillVisible: false,
      trainSkillValue: '',
      preTipsVisible: false,
      preValidateTips: '',
      preSkillVisible: false,
      preSkillValue: '',
      isCreate: false,
      // 训练技能
      categoryList: [
        { label: this.$t('m.penetrationTest'), value: 1 },
        { label: this.$t('m.operationalProtection'), value: 2 },
        { label: this.$t('m.simulationSystem'), value: 3 },
        { label: this.$t('m.adversarialTraining'), value: 4 },
        { label: this.$t('m.others'), value: 5 },
      ],
      manageDelete: false,
    };
  },
  computed: {
    userData() {
      return this.$store.getters.user_data;
    },
  },
  watch: {
    createForm: {
      handler(nv, ov) {
        if (!_.isEmpty(nv)) {
          this.choosedScene = nv;
          this.currentIndex += 1;
        }
      },
      immediate: true,
      deep: true,
    },
    'ruleForm.start_time'(nv, ov) {
      if (nv) {
        const tempTime = moment(this.ruleForm.start_time.valueOf())
          .add(this.originData.cr_event_info.duration_time, 'hours')
          .format('YYYY-MM-DD HH:mm:ss');
        this.$set(this.ruleForm, 'end_time', tempTime);
      }
    },
    'ruleForm.pre_skill'(nv, ov) {
      if (nv.length > 3) {
        this.addPreTagsStatus = false;
        return;
      } else {
        this.addPreTagsStatus = true;
      }
    },
    'ruleForm.train_skill'(nv, ov) {
      if (nv.length > 3) {
        this.addTrainTagsStatus = false;
        return;
      } else {
        this.addTrainTagsStatus = true;
      }
    },
    trainList: {
      handler(nv, ov) {
        if (nv !== ov) {
          if (!_.isEmpty(nv)) {
            if (JSON.parse(localStorage.getItem('redPaginationInfo'))) {
              this.createScene(
                this.trainList[this.paginationInfo.indexNumber],
                this.paginationInfo.indexNumber,
              );
              localStorage.setItem('redPaginationInfo', null);
            }
          }
        }
      },
      immidiate: true,
      deep: true,
    },
  },
  methods: {
    resetDialog() {
      this.choosedScene = '';
      this.currentIndex = 0;
      this.$emit('prevChange');
      this.dialogAddVisible = false;
    },
    nextStep(val) {
      if (val === 'next') {
        this.currentIndex += 1;
      } else if (val === 'pre') {
        this.choosedScene = '';
        this.currentIndex -= 1;
        this.$emit('prevChange');
      }
    },
    chooseTemplate(val) {
      this.isCreate = true;
      this.addPreTagsStatus = true;
      this.addTrainTagsStatus = true;
      this.endTimeTips = false;
      this.originData = JSON.parse(JSON.stringify(this.createForm));
      const tempCrEventInfo = JSON.parse(
        JSON.stringify(this.createForm.cr_event_info),
      );
      this.ruleForm.category = tempCrEventInfo.category;
      this.ruleForm.description = tempCrEventInfo.description;
      this.ruleForm.pre_skill = tempCrEventInfo.pre_skill;
      this.ruleForm.train_skill = tempCrEventInfo.train_skill;
      this.ruleForm.template_name = tempCrEventInfo.template_name;
      this.rolesInfo.splice(0);
      this.rolesInfo.push(
        ...JSON.parse(JSON.stringify(this.createForm.role_info)),
      );
      this.$nextTick(function () {
        this.$refs.modelDragSelector.targetContainers = this.$refs.roleUserList;
      });
      this.lastUserDataId.splice(0);
      this.rolesInfo[0].children.push(this.userData);
      this.lastUserDataId.push(this.userData.id);
    },
    ensureCreate() {
      // 点击确定按钮
      if (!this.isCheck || !this.isChecks) {
        if (this.isCheckValue) {
          return this.$message.error(this.isCheckValue);
        } else {
          return this.$message.error(this.isChecksValue);
        }
      }
      this.choosedScene = '';
      this.$emit('createSuccess');
    },
  },
};
</script>

<style lang="scss" scoped>
.red-blue-add {
  .line-color {
    color: var(--neutral1);
  }
  .elc-dialog-btn-cancel {
    margin-left: 0;
  }
  .elc-dialog-btn-ensure {
    margin: 0 10px;
  }
  ::v-deep .el-dialog__header {
    padding: 15px 0 0 0;
  }
  ::v-deep .el-dialog__body {
    height: 580px;
    padding: 0 40px 0 40px !important;
  }
  ::v-deep .el-scrollbar__wrap {
    margin-right: -11px;
  }
  .header-title {
    height: 60px;
    .external-div {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 396px;
      height: 100%;
      border-radius: 21px 21px 0 0;
    }
    .common {
      min-width: 198px;
      height: 100%;
      position: relative;
      white-space: nowrap;
      span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .content {
    margin-top: 20px;
    width: 100%;
    height: 580px;
    .change-template {
      height: 100%;
      width: 100%;
      .search-condition {
        padding-left: 0;
      }
    }
  }
  .enter-content {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
