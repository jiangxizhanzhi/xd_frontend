<template>
  <div class="mission-create">
    <cb-form
      ref="form"
      :model="model"
      :id="id && { resource_id: id }"
      :rules="rules"
      :url="url"
      :baseURL="baseURL"
      label-width="160px"
      class="demo-model"
      json
      :method="method"
    >
      <cb-form-item
        :label="$t('table.name')"
        prop="title"
        style="margin-top: 20px"
      >
        <cb-input v-model="model.title" style="width: 85%" />
      </cb-form-item>

      <cb-form-item :label="$t('missions.description')" prop="description">
        <cb-input
          v-model="model.description"
          type="textarea"
          style="width: 85%"
        />
      </cb-form-item>

      <cb-form-item :label="$t('missions.category')" prop="category">
        <cb-select
          v-model="model.category"
          :options="categoryOption"
          titleField="name"
          valueField="resource_id"
        >
        </cb-select>
      </cb-form-item>

      <cb-form-item :label="$t('missions.score')" prop="score">
        <!-- <cb-input v-model="model.score" style="display: none" /> -->
        <cb-input-number
          v-model="model.score"
          :min="0"
          :max="500"
          :label="$t('missions.score')"
          @change="handleChange"
        />
        <!-- <div
          v-if="error"
          class="el-form-item__error"
          :title="filedError.score"
          type="error"
        >
          {{ filedError.score }}
        </div> -->
      </cb-form-item>

      <cb-form-item :label="$t('missions.skillPoints')">
        <div class="block" style="float: left; padding-top: 25px">
          <div class="wrapper-box">
            <span
              class="span-desc one-overflow"
              style="
                display: block;
                float: left;
                line-height: normal;
                width: 90px;
              "
              :title="skillLabels && skillLabels[0]"
              >{{ skillLabels && skillLabels[0] }}:</span
            >
            <cb-rate v-model="skillPointsOption[0]" />
          </div>
          <div class="wrapper-box">
            <span
              class="span-desc one-overflow"
              style="
                display: block;
                float: left;
                line-height: normal;
                width: 90px;
              "
              :title="skillLabels && skillLabels[1]"
              >{{ skillLabels && skillLabels[1] }}:</span
            >
            <cb-rate v-model="skillPointsOption[1]" />
          </div>
          <div class="wrapper-box">
            <span
              class="span-desc one-overflow"
              style="
                display: block;
                float: left;
                line-height: normal;
                width: 90px;
              "
              :title="skillLabels && skillLabels[2]"
              >{{ skillLabels && skillLabels[2] }}:</span
            >
            <cb-rate v-model="skillPointsOption[2]" />
          </div>
          <div class="wrapper-box">
            <span
              class="span-desc one-overflow"
              style="
                display: block;
                float: left;
                line-height: normal;
                width: 90px;
              "
              :title="skillLabels && skillLabels[3]"
              >{{ skillLabels && skillLabels[3] }}:</span
            >
            <cb-rate v-model="skillPointsOption[3]" />
          </div>
          <div class="wrapper-box">
            <span
              class="span-desc one-overflow"
              style="
                display: block;
                float: left;
                line-height: normal;
                width: 90px;
              "
              :title="skillLabels && skillLabels[4]"
              >{{ skillLabels && skillLabels[4] }}:</span
            >
            <cb-rate v-model="skillPointsOption[4]" />
          </div>
          <div class="wrapper-box">
            <span
              class="span-desc one-overflow"
              style="
                display: block;
                float: left;
                line-height: normal;
                width: 90px;
              "
              :title="skillLabels && skillLabels[5]"
              >{{ skillLabels && skillLabels[5] }}:</span
            >
            <cb-rate v-model="skillPointsOption[5]" />
          </div>
          <div class="wrapper-box">
            <span
              class="span-desc one-overflow"
              style="
                display: block;
                float: left;
                line-height: normal;
                width: 90px;
              "
              :title="skillLabels && skillLabels[6]"
              >{{ skillLabels && skillLabels[6] }}:</span
            >
            <cb-rate v-model="skillPointsOption[6]" />
          </div>
        </div>
        <div
          style="float: left; margin-left: 40px; width: 360px; height: 245px"
        >
          <cb-echart-radar
            v-if="load"
            radarShape="sharp"
            :indicator="indicatorData"
            :radarData="skillPointsOption"
            :radarRadius="radarRadius"
            :axisName="axisName"
          />
        </div>
      </cb-form-item>

      <cb-form-item :label="$t('missions.missionCategory')" prop="type">
        <cb-select
          v-model="model.type"
          :options="MissionsTypeCom"
          :placeholder="$t('common.pleaseInput')"
          @change="typeChange"
        >
        </cb-select>
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

      <cb-form-item :label="$t('missions.answerKey')">
        <cb-markdown
          ref="md"
          v-model="model.write_up"
          :uploadImages="_imgAdd"
          :uploadFile="uploadFile"
          :uploadZip="uploadZip"
          :exportFile="exportFile"
          @set-fullscreen="refreshMarkdown"
        >
        </cb-markdown>
      </cb-form-item>
      <!-- <slot>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button button-type="confirm" @click="submitReady" mr>
              {{ $t('common.submit') }}
            </cb-button>
            <cb-button button-type="cancel" @click="goBack">
              {{ $t('common.cancel') }}
            </cb-button>
          </cb-button-group>
        </div>
      </slot> -->
    </cb-form>
  </div>
</template>

<script>
import { fetchCategoryList, getRadarLabels } from '@/api/missions/mission';
import { validateLength } from '@/utils/validate-cms';
import ChartCom from './chart';
import ComponentJudgeMission from './components-judge';
import ComponentsRadioMission from './components-radio';
import ComponentMultipleMission from './components-multiple';
import ComponentsFillBlankMission from './components-fill-blank';
import ComponentsQuestionAnswerMission from './components-questions-answer';
import ComponentsAttackMission from './components-attack';
import ComponentsDefenseMission from './components-defense';
import ComponentsFileMission from './components-file';
import { saveImageAdmin, uploadAttachmentAdmin, uploadMd } from '@/api/common';
import { cutStr } from '@/utils/index.js';

import { validateTrainTaskLength } from '@/utils/rules-cms';
import _ from 'lodash';

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
    id: {
      type: [String, Number],
      default: '',
    },
    stageList: {
      type: Array,
      default() {
        return [];
      },
    },
    hideSelect: {
      type: Boolean,
      default() {
        return false;
      },
    },
    templateMsg: {
      type: Object,
      default() {
        return null;
      },
    },
    moduleName: {
      type: String,
      default: '',
    },
    businessType: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    const positivenumber = (rule, value, callback) => {
      if (typeof value === 'number' && isNaN(value)) {
        callback(new Error(this.$t('missions.inputScore')));
      }
      if (value < 0) {
        callback(new Error(this.$t('sceneMission.PositiveNumber')));
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
        callback(new Error(this.$t('sceneMission.optionIsEmpty')));
      } else if (new Set(keyArr).size !== data.length) {
        callback(new Error(this.$t('sceneMission.optionContentRepeated')));
      } else {
        callback();
      }
    };
    const answer = (rule, value, callback) => {
      const newValue = value.replace(/\s+/g, '');
      const sumNewValue = validateLength(value);
      if (
        this.model.type === 2 &&
        (value === '[]' || value === '' || value === null)
      ) {
        callback(new Error(this.$t('sceneMission.answerIsEmpty')));
      } else if (newValue === '' || newValue === null) {
        callback(new Error(this.$t('sceneMission.answerIsEmpty')));
      } else if (sumNewValue > 4096) {
        callback(
          new Error(
            this.$t('sceneMission.answerLengthCannotExceed4096Characters'),
          ),
        );
      } else {
        callback();
      }
    };
    return {
      method: 'post',
      fileSize: 1024 * 1024 * 1024,
      skillLabels: [],
      radarRadius: ['0%', '60%'],
      load: false,
      indicatorData: [],
      url: '/cr/admin/mission/missions',
      baseURL: '/api/ojj',
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
        category: '05b739fc686a073756399f79c34039b5',
        answer: '',
        option: [],
        description: '',
        write_up: '',
        id: '',
        missionStage: 0,
      },
      missionStage: '',
      rules: {
        title: [
          {
            required: true,
            message: this.$t('missions.inputMissionName'),
            trigger: 'blur',
          },
          //校验1-255字符
          { validator: validateTrainTaskLength, trigger: 'blur' },
        ],
        description: [
          {
            required: true,
            message: this.$t('missions.pleaseInputDescription'),
            trigger: 'blur',
          },
          //描述字符不做限制
          // { validator: validateDescriptionLength, trigger: 'blur' },
        ],
        score: [
          {
            required: true,
            message: this.$t('missions.inputScore'),
            trigger: ['change', 'blur'],
          },
          { validator: positivenumber, trigger: ['change', 'blur'] },
        ],
        category: [
          {
            required: true,
            message: this.$t('missions.selectCategory'),
            trigger: 'blur',
          },
        ],
        type: [{ required: true }],
        answer: [
          { required: true, validator: answer, trigger: ['change', 'blur'] },
        ],
        option: [{ required: true, validator: option, trigger: ['blur'] }],
        missionStage: [
          {
            required: true,
            message: this.$t('missions.missionStageValid'),
            trigger: 'blur',
          },
        ],
      },
      labels: { score: this.$t('missions.score') },
    };
  },
  computed: {
    MissionsTypeCom() {
      const singleData = _.cloneDeep(this.$CONSTANT.Missions.MissionsType);
      delete singleData.ATTACK;
      delete singleData.DEFENSE;
      delete singleData.FILL_IN_THE_BLANK;
      delete singleData.QUESTION_ANSWER;
      let arr = [];
      if (this.moduleName === 'single') {
        _.forEach(singleData, (item) => {
          arr.push({
            label: item.name.toString(),
            value: item.value,
          });
        });
      } else {
        _.forEach(this.$CONSTANT.Missions.MissionsType, (item) => {
          arr.push({
            label: item.name.toString(),
            value: item.value,
          });
        });
      }
      return arr;
    },
    axisName() {
      return {
        formatter: (text) => {
          var strlength = validateLength(text);
          var maxlength = 10;
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
    this.getRadarLabelsList();
    fetchCategoryList().then((res) => {
      this.categoryOption = res.data.data;
    });
    this.getTemplateMsg();
  },
  mounted() {
    if (this.id) {
      this.method = 'put';
    } else {
      this.method = 'post';
    }
    if (this.id != '') {
      this.$refs.form.getModelData().then((data) => {
        this.initData(data);
      });
    }
  },
  methods: {
    // 获取技能点
    getRadarLabelsList() {
      getRadarLabels().then((res) => {
        const data = _.get(res, 'data.data.labels', []);
        this.skillLabels = data;
        this.load = true;
        data.map((item, index) => {
          if (index === 0) {
            this.indicatorData.push({
              max: 5,
              name: `${item}`,
              axisLabel: {
                align: 'center',
                verticalAlign: 'top',
                show: true,
                fontSize: 12,
                color: '#B8C4DF',
                showMaxLabel: true, //不显示最大值，即外圈不显示数字30
                showMinLabel: true, //显示最小数字，即中心点显示0
              },
            });
          } else {
            this.indicatorData.push({
              max: 5,
              name: `${item}`,
            });
          }
        });
      });
    },
    handleChange(value) {
      const that = this;
      const reg = /^[0-9]+$/;
      if (!reg.test(value)) {
        this.$nextTick(() => {
          that.model.score = parseInt(value);
        });
      }
    },
    initData(data) {
      if (!_.isEmpty(data)) {
        this.model = data;
        // this.skillPointsOption = JSON.parse(data.skill_points);
        this.skillPointsOption = data.skill_points;
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
      // 判断是否为创建新任务
      if (this.hideSelect) {
        this.$emit('createAMission', this.missionStage);
      } else {
        this.$emit('editMission');
      }
      // 表单提交后清空表单, write_up不在form里
      this.model.write_up = '';
      this.$refs.form.resetFields();
      this.skillPointsOption = [1, 1, 1, 1, 1, 1, 1];
      this.$emit('closeDialog');
    },
    submitReady() {
      this.model.skill_points = this.skillPointsOption;
      if (this.model.type === 1 || this.model.type === 2) {
        this.model.option = JSON.stringify(this.optionSet);
      } else {
        // this.model.option = null;
        this.model.option = 'null';
      }
      // 清除标题前后空格
      this.model.title.trim();
      // 将阶段索引赋给其他变量，避免表单清空无法获取索引
      this.missionStage = this.model.missionStage;
      this.submit();
    },
    submit() {
      // 提交
      this.percent = 0;
      this.error = '';

      let data;
      let currentMd5Model;
      if (this.isDiffCheck) {
        currentMd5Model = util.getMd5Model(this.model);
        const diffFields = util.getDiffFields(
          this.auxiliary.initMd5Model,
          currentMd5Model,
        );
        data = this.$_.pick(
          this.model,
          this.$_.union(diffFields, this.noDiffCheckFields),
        );
      } else {
        data = this.model;
      }

      if (this.$_.isEmpty(data)) {
        if (this.emptySubmit) {
          this.percent = 100;
          this.submitSuccess({});
        }
        this.submitWithoutData();
        return;
      }

      const submitData = this.generateSubmitData(data);
      this.$refs.form.submit(submitData).then((res) => {
        this.submitSuccess(res.data);
      });
    },
    generateSubmitData(data) {
      // const submitData = _.cloneDeep(data);
      // const _data = new FormData();
      // _.forEach(submitData, (value, key) => {
      //   if (Array.isArray(value)) {
      //     _.forEach(value, (val) => {
      //       _data.append(key, val);
      //     });
      //   } else {
      //     _data.append(key, value);
      //   }
      // });
      // console.log(_data, '333');
      return data;
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
      this.model.skill_points = this.skillPointsOption;
      if (this.model.type === 1 || this.model.type === 2) {
        this.model.option = JSON.stringify(this.optionSet);
      } else {
        this.model.option = null;
      }
      this.$emit('missionData', this.model);
    },
    _imgAdd(file) {
      if (file && file[0]) {
        //单兵,团队,红蓝,任务markdown上传图片
        const formdata = new FormData();
        formdata.append('file', file[0]);
        formdata.append('type', this.businessType);
        return new Promise((resolve, reject) => {
          saveImageAdmin(formdata).then((res) => {
            resolve([
              {
                // url: res.data.url,
                url: res.data.data.file_path,
              },
            ]);
          });
        });
      }
    },
    uploadFile($file) {
      return new Promise((resolve) => {
        //校验文件大小
        if ($file[0].size > this.fileSize) {
          this.$message.warning(
            this.$t('m.fileSizeLimit', {
              size: (this.fileSize / 1024 / 1024).toFixed(2),
            }),
          );
          return false;
        }
        const formdata = new FormData();
        formdata.append('type', '8');
        formdata.append('file', $file[0]);
        uploadAttachmentAdmin(formdata).then((res) => {
          const data = _.get(res, 'data.data', []);
          resolve([
            {
              name: data.file_name,
              url: data.file_path,
            },
          ]);
        });
      });
    },
    uploadZip(file) {
      return new Promise((resolve, reject) => {
        //校验文件大小
        if (file.size > this.fileSize) {
          this.$message.warning(
            this.$t('m.fileSizeLimit', {
              size: (this.fileSize / 1024 / 1024).toFixed(2),
            }),
          );
          return false;
        }
        const formdata = new FormData();
        formdata.append('md', file);
        uploadMd(formdata).then((res) => {
          const data = _.get(res, 'data.data', []);
          const is_extract = data.is_extract;
          if (is_extract) {
            this.model.write_up = data.content;
          }
        });
      });
    },
    exportFile() {
      this.$request.download('/cpms/built_in/Demo.zip');
    },
    // 全屏后markdown光标位置问题
    refreshMarkdown() {
      let bakData = this.model.write_up;
      this.model.write_up = bakData + '\n';
      setTimeout(() => {
        this.model.write_up = bakData;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  .wrapper-box {
    display: flex;
    .span-desc {
      width: 120px;
      flex: 1;
    }
  }
}
.traffic-create {
  margin-top: 2%;
  margin-bottom: 2%;
}
.traffic-create,
.el-select.el-select--medium {
  width: 10%;
}

.hr-line-dashed {
  border-top: 1px dashed #e7eaec;
  color: #fff;
  background-color: #fff;
  height: 1px;
  margin: 20px 0;
}

.el-form-item {
  /*margin: 0 6% 0 6%;*/
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
// .el-form-item__error{
//   margin-left: 12%;
// }
.judge {
  .subassembly {
    margin-left: -160px;
  }
}
.v-note-wrapper {
  width: 85%;
}
::v-deep .v-show-content {
  white-space: normal;
}
</style>
