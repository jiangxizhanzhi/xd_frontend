<template>
  <div class="mission-create">
    <cb-form
      ref="form"
      :model="model"
      :rules="rules"
      label-width="150px"
      class="demo-model"
    >
      <cb-form-item :label="$t('m.missionTitle')" prop="title">
        <cb-input v-model="model.title" class="elc-input" />
      </cb-form-item>

      <cb-form-item :label="$t('m.taskDesc')" prop="description">
        <cb-input
          v-model="model.description"
          type="textarea"
          class="elc-input"
          @blur="removeBlank"
        />
      </cb-form-item>

      <cb-form-item :label="$t('m.category')" prop="category">
        <cb-select
          v-model="model.category"
          :options="categoryOption"
          titleField="name"
          valueField="resource_id"
        />
      </cb-form-item>

      <cb-form-item :label="$t('m.fraction')" prop="score">
        <cb-input-number
          v-model="model.score"
          :min="0"
          :precision="0"
          :max="500"
          :label="$t('m.fraction')"
          class="elc-input-number"
        />
        <span class="num-title"
          >( {{ $t('m.pleaseEnterIntegerBetween0And500') }} )</span
        >
      </cb-form-item>

      <cb-form-item :label="$t('m.skillPoints')">
        <div
          class="add-skill-box"
          style="float: left; padding-top: 10px; width: 210px"
        >
          <div class="wrapper-box">
            <span
              class="common-left-span one-overflow"
              :title="pieLabelData[0].name"
            >
              {{ pieLabelData[0].name }}
            </span>
            <cb-rate v-model="skillPointsOption[0]" class="elc-rate" />
          </div>
          <div class="wrapper-box">
            <span
              class="common-left-span one-overflow"
              :title="pieLabelData[1].name"
            >
              {{ pieLabelData[1].name }}
            </span>
            <cb-rate v-model="skillPointsOption[1]" class="elc-rate" />
          </div>
          <div class="wrapper-box">
            <span
              class="common-left-span one-overflow"
              :title="pieLabelData[2].name"
            >
              {{ pieLabelData[2].name }}
            </span>
            <cb-rate v-model="skillPointsOption[2]" class="elc-rate" />
          </div>
          <div class="wrapper-box">
            <span
              class="common-left-span one-overflow"
              :title="pieLabelData[3].name"
            >
              {{ pieLabelData[3].name }}
            </span>
            <cb-rate v-model="skillPointsOption[3]" class="elc-rate" />
          </div>
          <div class="wrapper-box">
            <span
              class="common-left-span one-overflow"
              :title="pieLabelData[4].name"
            >
              {{ pieLabelData[4].name }}
            </span>
            <cb-rate v-model="skillPointsOption[4]" class="elc-rate" />
          </div>
          <div class="wrapper-box">
            <span
              class="common-left-span one-overflow"
              :title="pieLabelData[5].name"
            >
              {{ pieLabelData[5].name }}
            </span>
            <cb-rate v-model="skillPointsOption[5]" class="elc-rate" />
          </div>
          <div class="wrapper-box">
            <span
              class="common-left-span one-overflow"
              :title="pieLabelData[6].name"
            >
              {{ pieLabelData[6].name }}
            </span>
            <cb-rate v-model="skillPointsOption[6]" class="elc-rate" />
          </div>
        </div>
        <div
          style="float: left; margin-left: 20px; width: 420px; height: 245px"
        >
          <cb-echart-radar
            v-if="pieLabelData.length > 0"
            ref="rader"
            radarShape="sharp"
            :indicator="pieLabelData"
            :radarData="skillPointsOption"
            :axisName="axisName"
          ></cb-echart-radar>
          <!-- <chart-com
            :skill-points="skillPointsOption"
            :pieLabelData="pieLabelData"
          /> -->
        </div>
      </cb-form-item>

      <cb-form-item :label="$t('m.missionCategory')" prop="type">
        <cb-select
          v-model="model.type"
          :placeholder="$t('common.pleaseInput')"
          :options="tastTypeCom"
          @change="typeChange"
        />
      </cb-form-item>

      <cb-form-item class="judge">
        <component-judge-mission
          v-if="model.type === 0"
          :correct-answer="model.answer"
          @answer="answerUpdate"
        />
        <components-radio-mission
          v-else-if="model.type === 1"
          :option="optionSet"
          :correct-answer="model.answer"
          @answer="answerUpdate"
          @option="optionsUpdate"
        />
        <component-multiple-mission
          v-else-if="model.type === 2"
          :option="optionSet"
          :correct-answer="model.answer"
          @answer="answerUpdate"
          @option="optionsUpdate"
        />
        <components-fill-blank-mission
          v-else-if="model.type === 3"
          :correct-answer="model.answer"
          @answer="answerUpdate"
        />
        <components-question-answer-mission
          v-else-if="model.type === 4"
          :correct-answer="model.answer"
          @answer="answerUpdate"
        />
        <components-attack-mission
          v-else-if="model.type === 5"
          :correct-answer="model.answer"
          @answer="answerUpdate"
        />
        <components-defense-mission
          v-else-if="model.type === 6"
          :correct-answer="model.answer"
          @answer="answerUpdate"
        />
        <components-file-mission
          v-else-if="model.type === 7"
          :correct-answer="model.answer"
          @answer="answerUpdate"
        />
      </cb-form-item>

      <cb-form-item
        :label="$t('m.answerKey')"
        class="markDownCommon write-mavon"
      >
        <CbMarkdown
          v-model="model.write_up"
          :uploadImages="uploadImages"
          :uploadFile="uploadFile"
        />
      </cb-form-item>
      <div v-if="roleSelect">
        <cb-form-item :label="$t('m.roleSelect')" prop="role_resource_id">
          <cb-select
            v-model="model.role_resource_id"
            class="role-select"
            :placeholder="$t('m.pleaseInputSelectRole')"
            :options="roleOptionList"
            titleField="label"
            valueField="value"
          />
        </cb-form-item>
      </div>
    </cb-form>
  </div>
</template>

<script>
import { fetchCategoryList, uploadMissionMd } from '@/api/web/task_editor';
import ChartCom from './chart';
import ComponentJudgeMission from './components-judge';
import ComponentsRadioMission from './components-radio';
import ComponentMultipleMission from './components-multiple';
import ComponentsFillBlankMission from './components-fill-blank';
import ComponentsQuestionAnswerMission from './components-questions-answer';
import ComponentsAttackMission from './components-attack';
import ComponentsDefenseMission from './components-defense';
import ComponentsFileMission from './components-file';
import { validateTitleLength255 } from '@/utils/rules';
import _ from 'lodash';
import validateUtils from '@/utils/validate';
import { cutStr } from '@/utils/index.js';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';

export default {
  name: 'MissionDetail',
  components: {
    ChartCom,
    ComponentJudgeMission,
    ComponentsRadioMission,
    ComponentMultipleMission,
    ComponentsFillBlankMission,
    ComponentsQuestionAnswerMission,
    ComponentsAttackMission,
    ComponentsDefenseMission,
    ComponentsFileMission,
  },
  props: {
    pieLabelData: {
      type: Array,
      default() {
        return [];
      },
    },
    stageList: {
      type: Array,
      default() {
        return [];
      },
    },
    roleSelect: {
      type: Boolean,
      default() {
        return false;
      },
    },
    roleOptionList: {
      type: Array,
      default() {
        return [];
      },
    },
    submitUrl: {
      type: String,
      default() {
        return '';
      },
    },
    templateMsg: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    const positivenumber = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error(this.$t('m.PositiveNumber')));
      } else {
        callback();
      }
    };
    const option = (rule, value, callback) => {
      const data = this.optionSet;
      const array = _.filter(data, function (o) {
        const newValue = o.optionValue.replace(/\s+/g, '');
        return newValue === '';
      });
      const keyArr = [];
      data.forEach((element, index) => {
        keyArr.push(element.optionValue); // 通过key来判断
      });
      if (array.length > 0) {
        callback(new Error(this.$t('m.optionIsEmpty')));
      } else if (new Set(keyArr).size !== data.length) {
        callback(new Error(this.$t('m.optionContentRepeated')));
      } else {
        callback();
      }
    };
    const answer = (rule, value, callback) => {
      const newValue = value.replace(/\s+/g, '');
      if (
        this.model.type === 2 &&
        (value === '[]' || value === '' || value === null)
      ) {
        callback(new Error(this.$t('m.answerIsEmpty')));
      } else if (newValue === '' || newValue === null) {
        callback(new Error(this.$t('m.answerIsEmpty')));
      } else {
        callback();
      }
    };
    return {
      BUSINESS_TYPE,
      // language: this.$store.state.app.language,
      url: this.submitUrl || '/admin/mission/missions/',
      noDiffCheckFields: [
        'first_level',
        'seconds_level',
        'type',
        'answer',
        'option',
      ],
      categoryOption: [],
      skillPointsOption: [1, 1, 1, 1, 1, 1, 1],
      model: {
        title: '',
        type: 0,
        score: 0,
        skill_points: '',
        category: '',
        answer: '',
        option: [],
        description: '',
        write_up: '',
        // resource_id: '',
        id: '',
        // missionStage: 0,
        mission_stage: 0,
        role_resource_id: '',
        // 需要传个room_id
        room_id: this.$route.params && this.$route.params.resource_id,
      },
      missionStage: '',
      rules: {
        title: [
          {
            required: true,
            message: this.$t('m.inputMissionName'),
            trigger: 'blur',
          },
          { validator: validateTitleLength255, trigger: 'blur' },
        ],
        description: [
          {
            required: true,
            message: this.$t('m.pleaseInputDescription'),
            trigger: 'blur',
          },
          // { validator: validateDescriptionLength, trigger: 'blur' },
        ],
        score: [
          { required: true, message: this.$t('m.inputScore'), trigger: 'blur' },
          { validator: positivenumber, trigger: 'blur' },
        ],
        category: [
          {
            required: true,
            message: this.$t('m.selectCategory'),
            trigger: 'blur',
          },
        ],
        role_resource_id: [
          {
            required: true,
            message: this.$t('m.pleaseInputSelectRole'),
            trigger: ['change', 'blur'],
          },
        ],
        answer: [
          { required: true, validator: answer, trigger: ['change', 'blur'] },
        ],
        option: [{ required: true, validator: option, trigger: ['blur'] }],
        missionStage: [
          {
            required: true,
            message: this.$t('m.missionStageValid'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    tastTypeCom() {
      const arrs = [];
      _.forEach(this.$CONSTANT.Mission.TastType, (item) => {
        arrs.push({
          label: item.name.toString(),
          value: item.value,
        });
      });
      return arrs;
    },
    axisName() {
      return {
        formatter: (text) => {
          var strlength = validateUtils.validateLength(text);
          var maxlength = 12;
          if (strlength > maxlength) {
            text = cutStr(text, maxlength) + '...';
          }
          return text;
        },
      };
    },
  },
  watch: {
    id(val) {
      this.action = 'patch';
      this.url = `/admin/missions/missions/${val}/`;
      this.getData((data) => {
        _.forEach(this.model, (value, key) => {
          if (_.has(data, key)) {
            this.$set(this.model, key, this.dataToModel(data, key));
          }
        });
      });
    },
    templateMsg(val) {
      if (val) {
        this.model.title = this.templateMsg.title;
        this.model.description = this.templateMsg.description;
      }
    },
  },
  created() {
    fetchCategoryList().then((res) => {
      // this.categoryOption = res.data;
      // this.model.category = res.data[0].resource_id;
      this.categoryOption = res.data.data;
      this.model.category = res.data.data[0].resource_id;
    });
    this.getTemplateMsg();
  },
  methods: {
    // 上传图片
    uploadImages(item) {
      var formdata = new FormData();
      // 导演角色新增任务上传图片
      formdata.append('file', item[0]);
      formdata.append('type', this.BUSINESS_TYPE.CR_WEB_RED);
      return this.$request
        .post('/common/web/image_upload/', formdata, { baseURL: '/api/ojj' })
        .then((res) => {
          return [
            {
              url: res.data.data.file_path,
            },
          ];
        })
        .catch((res) => {});
    },
    //上传文件
    uploadFile($file) {
      return new Promise((resolve) => {
        const formdata = new FormData();
        formdata.append('missionId', '');
        formdata.append('md', $file[0]);
        uploadMissionMd(formdata).then((res) => {
          const data = _.get(res, 'data.data', []);
          const is_extract = data.is_extract;
          if (is_extract) {
            this.model.write_up = data.content;
          } else {
            resolve([
              {
                name: data.file_name,
                url: '/cpms/' + data.file_path,
              },
            ]);
          }
        });
      });
    },
    initData(data) {
      if (!_.isEmpty(data)) {
        this.model = data;
        this.skillPointsOption = JSON.parse(data.skill_points);
        this.optionSet = data.option === '' ? '' : JSON.parse(data.option);
        this.model.answer = data.answer;
      }
    },
    answerUpdate(val) {
      this.model.answer = val;
    },
    optionsUpdate(val) {
      this.optionSet = val;
    },
    typeChange() {
      this.optionSet = [];
      this.model.answer = '';
    },
    // 加载空模板数据
    getTemplateMsg() {
      if (this.templateMsg) {
        this.model.title = this.templateMsg.title;
        this.model.description = this.templateMsg.description;
      }
    },
    submitSuccess(response) {
      this.$emit('missionResponse', response);
      // 表单提交后清空表单, write_up不在form里
      // this.model.write_up = '';
      // this.$refs.form.resetFields();
      // this.skillPointsOption = [1, 1, 1, 1, 1, 1];
      this.$emit('closeDialog');
    },
    submitReady() {
      // this.model.skill_points = JSON.stringify(this.skillPointsOption);
      this.model.skill_points = this.skillPointsOption;
      if (this.model.type === 1 || this.model.type === 2) {
        this.model.option = JSON.stringify(this.optionSet);
      } else {
        this.model.option = null;
      }
      // 清除标题前后空格
      this.model.title.trim();
      // 将阶段索引赋给其他变量，避免表单清空无法获取索引
      this.missionStage = this.model.missionStage;
      this.submit();
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return;
        }
        this.$request
          .post(this.url, this.model, {
            baseURL: '/api/ojj',
          })
          .then((res) => {
            this.submitSuccess(res);
          });
      });
    },
    // 重写goBack(),避免任务编排弹框提交跳页
    goBack() {},
    // 创建表单验证（）
    missionFormValid() {
      let flag = false;
      this.$refs['form'].validate((valid) => {
        flag = valid;
      });
      return flag;
    },
    returnData() {
      this.model.skill_points = JSON.stringify(this.skillPointsOption);
      if (this.model.type === 1 || this.model.type === 2) {
        this.model.option = JSON.stringify(this.optionSet);
      } else {
        this.model.option = null;
      }
      this.$emit('missionData', this.model);
    },
    removeBlank() {
      this.model.description = this.model.description.trim();
    },
  },
};
</script>

<style lang="scss" scoped>
.traffic-create {
  margin-top: 2%;
  margin-bottom: 2%;
}
.traffic-create,
.el-select.el-select--medium {
  width: 10%;
}
.el-form-item {
  white-space: nowrap;
}
.el-rate {
  height: 30px;
}

.el-form-item__content {
  margin-left: 0 !important;
}
.subassembly {
  .el-form-item {
    margin: 0 0 0 0 !important;
    white-space: normal !important;
  }
  .el-form-item__content {
    float: left;
    width: 42%;
  }
}
.el-form-item__content {
  width: 85%;
}
.el-form-item__error {
  margin-left: 12%;
}
@media screen and (max-width: 1366px) {
  .el-form-item__error {
    margin-left: 16% !important;
  }
}
.judge {
  .subassembly {
    margin-left: -150px;
  }
}
.v-note-wrapper {
  width: 100%;
  height: 450px;
}
::v-deep .v-show-content {
  white-space: normal;
}

.add-skill-box {
  .common-left-span {
    text-align: right;
    display: block;
    float: left;
    line-height: normal;
    width: 80px;
    margin-right: 10px;
    color: var(--neutral8);
    font-size: 14px;
  }
}
.num-title {
  color: var(--neutral8);
}
.wrapper-box {
  clear: both;
}
</style>
<style lang="scss">
.el-select-dropdown__list {
  padding: 15px 0 !important;
}
</style>
