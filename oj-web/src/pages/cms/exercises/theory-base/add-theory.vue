<template>
  <cb-inner-page :background="false">
    <div class="add-content">
      <div class="box-card add-content" :style="commonMarginRightStyle">
        <cb-form
          ref="form"
          :model="formData"
          :rules="addFormRules"
          :label-width="labelWidthForm"
          :isBgColor="true"
        >
          <cb-form-item :label="$t('m.problemSet')" prop="practice_set_id">
            <cb-select
              v-model="formData.practice_set_id"
              :options="practice_type"
              titleField="name"
              valueField="resource_id"
            ></cb-select>
          </cb-form-item>
          <cb-form-item :label="$t('m.difficulty')" prop="difficulty">
            <cb-select v-model="formData.difficulty">
              <cb-option
                v-for="item in difficultyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></cb-option>
            </cb-select>
          </cb-form-item>
          <cb-form-item :label="$t('m.direction')" prop="category_id">
            <cb-select
              v-model="formData.category_id"
              :options="categorybox"
              titleField="name"
              valueField="resource_id"
            ></cb-select>
          </cb-form-item>
          <cb-form-item :label="$t('m.knowledgePoint')">
            <cy-tags
              v-model="formData.knowledge"
              ref="cyTags"
              :max="5"
              :ctg="$t('m.knowledgePoint')"
            >
              <cb-button slot="trigger" icon="icon-xinzeng" :hollow="true">{{
                $t('m.add')
              }}</cb-button>
            </cy-tags>
          </cb-form-item>
          <cb-form-item :label="$t('m.taskDesc')" prop="content">
            <mavon-editor
              :mavon-data.sync="formData.content"
              :businessType="BUSINESS_TYPE.OJ_CMS_THEROR"
              :attachmentType="ATTACHMENT_TYPE.OJ_ADMIN_THEORY"
              :fileSize="1024 * 1024 * 1024"
            ></mavon-editor>
          </cb-form-item>
          <cb-form-item :label="$t('m.questionType')" prop="theory_type">
            <cb-select
              v-model="formData.theory_type"
              @change="select"
              :options="categoryList"
            ></cb-select>
          </cb-form-item>
          <cb-form-item
            :label="$t('m.numberOfOptions')"
            v-if="options === TaskType.SINGLE || options === TaskType.MULTIPLE"
          >
            <cb-input-number
              v-model="num"
              :step="1"
              :min="2"
              :precision="0"
              :max="26"
              @change="changeOptionNumber"
            ></cb-input-number>
          </cb-form-item>
          <cb-form-item
            :label="$t('m.numberOfSpaces')"
            v-if="options === TaskType.BLANK"
          >
            <cb-input-number
              v-model="numblank"
              @change="handleChangeBlank"
              :step="1"
              :min="1"
              :precision="0"
              :max="10"
            ></cb-input-number>
          </cb-form-item>
          <cb-form-item
            :label="$t('m.options')"
            v-if="options === TaskType.SINGLE || options === TaskType.MULTIPLE"
            prop="everyoption"
          >
            <div class="repeat" :key="number" v-for="number in num">
              <div class="lab">{{ mavenArray[--number] }}</div>
              <mavon-editor
                :mavon-data.sync="formData.everyoption[number]"
                :businessType="BUSINESS_TYPE.OJ_CMS_THEROR"
                :attachmentType="ATTACHMENT_TYPE.OJ_ADMIN_THEORY"
                :fileSize="1024 * 1024 * 1024"
              ></mavon-editor>
            </div>
          </cb-form-item>
          <cb-form-item
            v-if="options === TaskType.BLANK"
            :label="$t('m.fillPosition')"
            prop="blankList"
            key="1"
          >
            <cb-row v-for="(item, index) in formData.blankList" :key="index">
              <cb-col class="color-cy2 rightSpan" :span="2"
                >{{ $t('questionType.blank') }}{{ index + 1 }}<i>*</i></cb-col
              >
              <cb-col :span="8">
                <cb-input v-model="item.value"></cb-input>
              </cb-col>
              <cb-col class="color-cy2 rightSpan" :span="2" :offset="2"
                >{{ $t('m.weights') }}<i>*</i></cb-col
              >
              <cb-col :span="10">
                <cb-input-number
                  v-model="item.weight"
                  :step="5"
                  :min="0"
                  :precision="0"
                  :max="100"
                ></cb-input-number>
              </cb-col>
            </cb-row>
          </cb-form-item>
          <cb-form-item
            v-if="options === TaskType.SINGLE"
            :label="$t('m.answer')"
            prop="answering"
          >
            <div class="btn-radio special-radio-box">
              <cb-radio-group v-model="formData.answering">
                <cb-radio
                  :label="mavenArray[number - 1]"
                  :key="number"
                  v-for="number in num"
                  >{{ mavenArray[number - 1] }}</cb-radio
                >
              </cb-radio-group>
            </div>
          </cb-form-item>
          <cb-form-item
            v-if="options === TaskType.MULTIPLE"
            :label="$t('m.answer')"
            prop="Reply"
          >
            <div class="btn-check special-radio-box">
              <cb-checkbox-group v-model="formData.Reply">
                <cb-checkbox
                  :label="mavenArray[number - 1]"
                  :key="number"
                  v-for="number in num"
                  >{{ mavenArray[number - 1] }}</cb-checkbox
                >
              </cb-checkbox-group>
            </div>
          </cb-form-item>
          <cb-form-item
            v-if="options === TaskType.JUDGE"
            :label="$t('m.answer')"
            prop="answering"
          >
            <div class="btn-right">
              <cb-radio-group v-model="formData.answering">
                <cb-radio label="A">
                  <cb-iconfont
                    type="icon-chenggong"
                    themedColor="font-color-primary"
                  ></cb-iconfont>
                </cb-radio>
                <cb-radio label="B">
                  <cb-iconfont
                    type="icon-cuowu1"
                    themedColor="font-color-primary"
                  ></cb-iconfont>
                </cb-radio>
              </cb-radio-group>
            </div>
          </cb-form-item>
          <cb-form-item
            v-if="options === TaskType.SHORTQUES"
            :label="$t('m.keyword')"
          >
            <cy-tags
              v-model="formData.keyword"
              ref="cyTags"
              :max="5"
              :ctg="$t('m.keyword')"
            >
              <cb-button slot="trigger" :hollow="true" icon="icon-xinzeng">{{
                $t('m.add')
              }}</cb-button>
            </cy-tags>
          </cb-form-item>
          <cb-form-item
            v-if="options === TaskType.SHORTQUES"
            :label="$t('m.answer')"
            prop="texting"
            key="2"
          >
            <cb-input
              type="textarea"
              :rows="2"
              v-model="formData.texting"
            ></cb-input>
          </cb-form-item>
          <cb-form-item :label="$t('m.isPublic')" prop="is_public">
            <cb-switch
              v-model="formData.is_public"
              active-color="#52c41a"
            ></cb-switch>
          </cb-form-item>
          <template slot="fixedBottom">
            <cb-button-group space="middle">
              <cb-button button-type="confirm" @click="onSubmit" mr="mr">{{
                $t('button.confirm')
              }}</cb-button>
              <cb-button button-type="cancel" @click="onCnacle">{{
                $t('button.cancel')
              }}</cb-button>
            </cb-button-group>
          </template>
        </cb-form>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import Utils from '@/utils/util';
import MavonEditor from '@/components/markdown/mavon-editor.vue';
import { errorMessage } from '@/utils/index.js';
import _ from 'lodash';
import { TaskType, THEORY_DIFF } from '../exercise-constants.js';
import { BUSINESS_TYPE } from '@/pages/cms/course-mod/course-constant.js';
import { ATTACHMENT_TYPE } from '@/constants/attachment.js';

export default {
  components: {
    MavonEditor,
  },
  data() {
    var validateOption = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(this.$t('m.plzOptionBeValue')));
      } else {
        const valueArr = _.filter(value, (item) => {
          return item !== '' && item !== undefined;
        });
        if (valueArr.length !== this.num) {
          callback(new Error(this.$t('m.plzOptionBeValue')));
        }
      }

      value.length = this.num;
      const lenValidate = _.filter(value, (item) => {
        const len = Utils.getByteLen(item);
        return item.trim() === '' || len > 2048;
      });
      if (lenValidate.length > 0) {
        callback(new Error(this.$t('m.pleaseFillInEachContent')));
      }
      const trimArr = _.map(value, (item) => {
        return item.trim();
      });
      if (Array.from(new Set(trimArr)).length < trimArr.length) {
        callback(new Error(this.$t('m.theOptionsCannotBeRepeated')));
      } else {
        callback();
      }
    };
    var validateTask = (rule, value, callback) => {
      const len = Utils.getByteLen(value);
      if (value.trim() === '' || len > 960) {
        this.task = true;
      } else {
        this.task = false;
      }
      if (this.task === true) {
        callback(new Error(this.$t('m.plaeaseFillTheory')));
      } else {
        callback();
      }
    };
    var validateBlank = (rule, value, callback) => {
      let sum = 0;
      value.forEach((item) => {
        if (item.weight > 0) {
          sum += item.weight;
        }
      });
      if (sum !== 100) {
        callback(new Error(this.$t('m.weightAccumulationMust')));
      } else {
        const lenValidate = _.filter(value, (item) => {
          const len = Utils.getByteLen(item.value);
          return item.value.trim() === '' || len > 255;
        });
        if (lenValidate.length > 0) {
          callback(new Error(this.$t('m.pleaseFillInEachBlank')));
        } else {
          callback();
        }
      }
    };
    var ShortAnswer = (rule, value, callback) => {
      if (this.options === this.TaskType.SHORTQUES) {
        if (!value) {
          return callback(new Error(this.$t('m.theInputAnswerCannotBeEmpty')));
        }
        const len = Utils.getByteLen(value);
        if (value.trim() === '' || len < 0 || len > 2048) {
          return callback(new Error(this.$t('m.pleaseFillInEachAnswer')));
        } else {
          callback();
        }
      }
      callback();
    };
    return {
      BUSINESS_TYPE,
      ATTACHMENT_TYPE,
      TaskType,
      THEORY_DIFF,
      difficultyOptions: [],
      formData: {
        category_id: '', // 习题方向
        practice_set_id: '', // 习题集
        knowledge: [], // 知识点
        difficulty: 0,
        is_public: 1, // 0 隐藏 1 公开
        answer: '', // 答案
        keyword: [], // 简答关键字
        theory_type: 0, // 题型
        content: '', // 题目名称
        option: {}, // 选项
        blank: [],
        blankList: [{ weight: '', value: '' }],
        answering: 'A',
        Reply: [],
        texting: '',
        everyoption: [],
      },
      err: false,
      addPreTagsStatus: true,
      addTrainTagsStatus: true,
      addFormRules: {
        difficulty: [
          {
            required: true,
            message: this.$t('m.pleaseChooseDifficulty'),
            trigger: 'change',
          },
        ],
        category_id: [
          {
            required: true,
            message: this.$t('m.pleaseChooseDirection'),
            trigger: 'blur',
          },
        ],
        practice_set_id: [
          {
            required: true,
            message: this.$t('m.choiceProblemSet'),
            trigger: 'change',
          },
        ],
        theory_type: [
          {
            required: true,
            message: this.$t('m.pleaseSelectQuestion'),
            trigger: 'change',
          },
        ],
        everyoption: [
          {
            required: true,
            validator: validateOption,
            trigger: ['blur', 'change'],
          },
        ],
        content: [
          { required: true, validator: validateTask, trigger: 'change' },
        ],
        answering: [
          {
            required: true,
            message: this.$t('m.theAnswerCannotBeEmpty'),
            trigger: ['blur', 'change'],
          },
        ],
        Reply: [
          {
            required: true,
            message: this.$t('m.theAnswerCannotBeEmpty'),
            trigger: ['blur', 'change'],
          },
        ],
        // texting: [{ required: true, message: this.$t('m.theAnswerCannotBeEmpty'), trigger: 'blur' }],
        texting: [
          {
            required: true,
            validator: ShortAnswer,
            trigger: ['blur', 'change'],
          },
        ],
        blankList: [
          {
            required: true,
            validator: validateBlank,
            trigger: ['blur', 'change'],
          },
        ],
      },
      error: false,
      task: false,
      flg: false,
      blanking: false,
      categorybox: [],
      practice_type: [],
      preTipsVisible: false,
      keywordVisible: false,
      preValidateTips: '',
      num: 4,
      numblank: 1,
      inputVisible: false,
      keywordinputVisible: false,
      inputValue: '',
      keywordValue: '',
      option: [],
      options: 0,
      mavenArray: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ],
    };
  },
  computed: {
    commonMarginRightStyle() {
      return {
        marginRight: `16px`,
      };
    },
    labelWidth() {
      return this.$store.state.app.labelWidth;
    },
    labelWidthForm() {
      return `${this.labelWidth}px`;
    },
    categoryList() {
      return [
        {
          label: this.$t('m.radio'),
          value: this.TaskType.SINGLE,
        }, // 0 1
        {
          label: this.$t('m.multipleSelection'),
          value: this.TaskType.MULTIPLE,
        }, // 1 2
        {
          label: this.$t('m.judge'),
          value: this.TaskType.JUDGE,
        }, // 2 3
        {
          label: this.$t('m.fillPosition'),
          value: this.TaskType.BLANK,
        }, // 3 4
        {
          label: this.$t('m.questionAnswer'),
          value: this.TaskType.SHORTQUES,
        }, // 4 5
      ];
    },
  },
  // watch: {
  //   'formData.knowledge'(nv, ov) {
  //     if (nv.length > 4) {
  //       this.addPreTagsStatus = false
  //       return
  //     } else {
  //       this.addPreTagsStatus = true
  //     }
  //   },
  //   'formData.keyword'(nv, ov) {
  //     if (nv.length > 4) {
  //       this.addTrainTagsStatus = false
  //       return
  //     } else {
  //       this.addTrainTagsStatus = true
  //     }
  //   },
  // },
  created() {
    this.exercisesGuidData();
    this.rationaleGuidData();
    this.getDifficultyOptions();
  },
  methods: {
    select(val) {
      this.options = val;
      this.formData.theory_type = this.options;
    },
    getDifficultyOptions() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 10,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              value: item.code,
              label: item.name,
            };
          });
          this.difficultyOptions = arr;
        });
    },
    rationaleGuidData() {
      // 理论基础-类型
      const that = this;
      that.$request
        .get(
          'oj/admin/practice/category/list/?page=1&per_page=999&practice_type=0',
          {},
          { baseURL: '/api/ojj' },
        )
        .then((resp) => {
          const newData = _.get(resp, 'data.data.list');
          newData.forEach((item) => {
            if (item.resource_id !== null) {
              that.categorybox.push(item);
            }
          });
          if (newData && newData.length) {
            that.$nextTick(() => {
              that.formData.category_id = newData[0].resource_id;
            });
          }
        });
    },
    exercisesGuidData() {
      // 理论基础-习题集类型
      const that = this;
      that.$request
        .get(
          'oj/admin/practice/set/list/?page=1&per_page=999&practice_type=0',
          {},
          { baseURL: '/api/ojj' },
        )
        .then((resp) => {
          const newData = _.get(resp, 'data.data.list');
          newData.forEach((item) => {
            if (item.resource_id !== null) {
              that.practice_type.push(item);
            }
          });
          if (newData && newData.length) {
            that.$nextTick(() => {
              that.formData.practice_set_id = newData[0].resource_id;
            });
          }
        });
    },
    changeOptionNumber(value, oldValue) {
      if (value < oldValue) {
        if (
          this.formData.theory_type === this.TaskType.SINGLE ||
          this.formData.theory_type === this.TaskType.MULTIPLE
        ) {
          this.formData.everyoption = _.slice(
            this.formData.everyoption,
            0,
            value,
          );
        }
      }
    },
    handleChangeBlank(value) {
      if (value !== Math.floor(value)) {
        this.$message({ message: this.$t('请输入正整数！'), type: 'error' });
        return;
      }
      const _s = value - this.formData.blankList.length;
      if (_s > 0) {
        for (let i = 0; i < _s; i++) {
          const child = { weight: '', value: '' };
          this.formData.blankList.push(child);
        }
      } else {
        for (var i = _s; i < 0; i++) {
          this.formData.blankList.pop();
        }
      }
    },
    // 表单提交
    onSubmit() {
      if (this.options === 0 || this.options === 1) {
        for (let i = 0; i < this.num; i++) {
          const lab = this.mavenArray[i];
          this.formData.option[lab] = this.formData.everyoption[i];
        }
      }
      if (this.options === 0) {
        // 单选需要删除无用的选项
        if (
          !Object.keys(this.formData.option)?.includes(this.formData.answering)
        ) {
          this.formData.answering = '';
        }
      }
      if (this.options === 1) {
        this.formData.Reply = this.formData.Reply?.filter((item) =>
          Object.keys(this.formData.option)?.includes(item),
        );
      }
      this.$refs['form'].validate((valid) => {
        if (!valid) return false;
        if (this.$refs.cyTags.inputError !== '') return;
        if (this.options === 0 || this.options === 2) {
          this.formData.answer = this.formData.answering;
        } else if (this.options === 1) {
          this.formData.answer = this.formData.Reply.join('|');
        } else if (this.options === 3) {
          this.formData.answer = JSON.stringify(this.formData.answering);
        } else {
          this.formData.answer = this.formData.texting;
        }
        const params = {};
        params.answer = this.formData.answer;
        params.knowledge = JSON.stringify(this.formData.knowledge);
        params.keyword = JSON.stringify(this.formData.keyword);
        params.option = JSON.stringify(this.formData.option);
        params.blank = JSON.stringify(this.formData.blankList);
        params.content = this.formData.content;
        params.category_id = this.formData.category_id;
        params.practice_set_id = this.formData.practice_set_id;
        params.theory_type = this.formData.theory_type;
        params.is_public = this.formData.is_public;
        params.difficulty = this.formData.difficulty;

        this.$request
          .post('/oj/admin/theory', params, { baseURL: '/api/ojj' })
          .then(() => {
            this.$router.push({ name: 'theory-base' });
          })
          .catch((error) => {
            errorMessage(error, this);
          });
      });
    },
    onCnacle() {
      this.$router.push({ name: 'theory-base' });
    },
  },
};
</script>
<style scoped lang="scss">
.rightSpan {
  text-align: right;
  padding-right: 10px;
}
.add-content {
  .el-form {
    width: 100%;
  }
  .el-form-item {
    ::v-deep {
      &.el-form-item__label {
        font-weight: bold;
      }
    }
  }
  .lab {
    width: 30px;
    height: 30px;
    background-color: var(--primary-color);
    text-align: center;
    color: var(--white-color);
    font-size: 20px;
    line-height: 30px;
    margin: 20px 0 10px;
  }
  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
  .repeat {
    &:first-child {
      .lab {
        margin-top: 4px;
      }
    }
  }
}
.el-row {
  margin-bottom: 15px;
}
.el-col-3 {
  width: 10.5%;
  margin-left: 10px;
}
i {
  color: var(--red-color);
}
.tags_error {
  color: var(--red-color);
  font-size: 12px;
}
.el-select {
  width: 367px;
}
::v-deep .cb-radio-group {
  height: 36px;
}
</style>
<style lang="scss">
.color-cy2 {
  color: var(--neutral8);
}
.special-radio-box {
  display: flex;
  flex-wrap: wrap;
  .cb-radio-group {
    height: auto;
  }
  .cb-radio-horizontal,
  .cb-checkbox-horizontal {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
