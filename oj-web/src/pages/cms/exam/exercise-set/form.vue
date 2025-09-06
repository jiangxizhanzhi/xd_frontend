<template>
  <cb-inner-page>
    <div class="exam-paper-form">
      <div class="left">
        <cb-form
          class="form-panel"
          label-position="right"
          label-width="80px"
          width="100%"
          json
          :rules="rules"
          ref="introForm"
          :model.sync="model"
        >
          <cb-form-item :label="$t('m.practiceName')" prop="name">
            <cb-input v-model="model.name"></cb-input>
          </cb-form-item>
          <cb-form-item :label="$t('m.desc')" prop="introduction">
            <cb-input type="textarea" v-model="model.introduction"></cb-input>
          </cb-form-item>
        </cb-form>
        <div class="table-panel">
          <blue-label class="mb20" :label="$t('m.questionBank')"></blue-label>
          <div class="tableTop">
            <cb-select
              class="inputright"
              clearable="clearable"
              v-loading="loading.practiceOptions"
              v-model="criteriaPracticeComputed"
              :options="options.practice"
              :placeholder="$t('m.choiceProblemSet')"
              title-field="name"
              value-field="resource_id"
            >
            </cb-select>
            <cb-select
              class="inputright"
              clearable="clearable"
              v-loading="loading.practiceCategoryOptions"
              v-model="query.category"
              :options="options.topic"
              :placeholder="$t('m.choiceDirectiont')"
              title-field="name"
              value-field="resource_id"
            >
            </cb-select>
            <cb-select
              class="inputright"
              clearable="clearable"
              v-loading="loading.practiceCategoryOptions"
              v-model="query.question_type"
              :options="options.type"
              :placeholder="$t('m.choiceQuestionType')"
              title-field="name"
              value-field="questionType"
            >
            </cb-select>
            <cb-search-input
              v-model="query.search"
              :placeholderName="$t('m.pleaseEnterName')"
            ></cb-search-input>
          </div>
          <cb-search-table
            class="mt20"
            ref="questionListRef"
            url="/admin/test_paper/test_papers/select_practice_info/"
            :cols="questionListColumns"
            :data="query"
            :selection.sync="practice_list"
            row-key="resource_id"
            show-less-items="show-less-items"
            :showQuickJumper="false"
            @data-loaded="questionListLoaded"
            ><template v-slot:search
              ><span class="importer-label mr10 ml10">{{
                $t('m.randomImport')
              }}</span>
              <cb-input-number
                class="number-input-width-5"
                :placeholder="$t('views.exam.paper.importer.randomImport')"
                :min="1"
                :max="100"
                v-model="subjectImporter.count"
                controls-position="right"
                size="small"
                :precision="0"
              ></cb-input-number
              ><span class="importer-label ml10">{{ $t('m.topic') }}</span
              ><span class="importer-label mr10 ml10">{{
                $t('m.subject')
              }}</span>
              <cb-input-number
                class="number-input-width-5"
                :placeholder="$t('m.grade')"
                :min="0.5"
                :max="100"
                v-model="subjectImporter.score"
                controls-position="right"
                :precision="1"
                size="small"
                :step="0.5"
              ></cb-input-number
              ><span class="importer-label ml10">{{
                $t('m.grade')
              }}</span> </template
            ><template v-slot:searchRightArea>
              <cb-button
                color-type="hollow"
                icon="icon-daoru"
                @click="importQuestion"
                >{{ $t('common.import') }}</cb-button
              > </template
            ><template v-slot:question_type="scope"
              ><span
                v-if="
                  scope.data.question_type === $CONSTANT.TaskType.SINGLE.value
                "
                >{{ $t('questionType.singleSelection') }}</span
              ><span
                v-if="
                  scope.data.question_type === $CONSTANT.TaskType.MULTIPLE.value
                "
                >{{ $t('questionType.multiSelection') }}</span
              ><span
                v-if="
                  scope.data.question_type === $CONSTANT.TaskType.JUDGE.value
                "
                >{{ $t('questionType.judge') }}</span
              ><span
                v-if="
                  scope.data.question_type === $CONSTANT.TaskType.BLANK.value
                "
                >{{ $t('questionType.blank') }}</span
              ><span
                v-if="
                  scope.data.question_type ===
                  $CONSTANT.TaskType.SHORTQUES.value
                "
                >{{ $t('questionType.shortAnswer') }}</span
              ><span
                v-if="
                  scope.data.question_type !==
                    $CONSTANT.TaskType.SINGLE.value &&
                  scope.data.question_type !==
                    $CONSTANT.TaskType.MULTIPLE.value &&
                  scope.data.question_type !== $CONSTANT.TaskType.JUDGE.value &&
                  scope.data.question_type !== $CONSTANT.TaskType.JUDGE.value &&
                  scope.data.question_type !== $CONSTANT.TaskType.BLANK.value &&
                  scope.data.question_type !==
                    $CONSTANT.TaskType.SHORTQUES.value
                "
                >{{ $t('questionType.operate') }}</span
              ></template
            ></cb-search-table
          >
        </div>
      </div>
      <div class="right">
        <blue-label class="mb20" :label="$t('m.testPaper')"></blue-label>
        <practice-set class="mb20" :practice-set="practice_list"></practice-set>
        <div class="form-button-bar">
          <cb-button-group>
            <cb-button @click="apply">{{ $t('button.confirm') }}</cb-button>
            <cb-button button-type="cancel" @click="cancel">{{
              $t('button.cancel')
            }}</cb-button>
          </cb-button-group>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import ImageSelector from '@/components/image-selector/index.vue';
import PracticeSet from './components/exam-paper-practice-set.vue';
import Validate from '@/utils/validate.js';
import PrivateConstant from './constant.js';
import BlueLabel from './components/blue-label.vue';
import SearchInput from '@/components/search-condition/search-input.vue';
import http from '@/utils/http.js';
import Constant from '@/constants';
import msger from '@/utils/message.js';
import _ from 'lodash';

export default {
  components: {
    PracticeSet,
    ImageSelector,
    BlueLabel,
    SearchInput,
  },
  mixins: [],
  props: {
    id: {
      type: String,
      default() {
        return undefined;
      },
    },
  },
  data() {
    return {
      model: {
        name: '',
        introduction: '',
      },
      url: '/admin/test_paper/test_papers/',
      practice_list: [],
      query: {
        practice_set: '',
        category: '',
        question_type: '',
        search: '',
      },
      subjectImporter: {
        count: 1,
        score: 1,
      },
      options: {
        practice: [],
        topic: [],
        type: [],
      },
      loading: {
        practiceOptions: false,
        practiceCategoryOptions: false,
        importFlag: false,
      },
      questionList: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('m.titleNamePh'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    $CONSTANT() {
      return Constant;
    },
    criteriaPracticeComputed: {
      get() {
        return this.query.practice_set;
      },
      set(val) {
        this.query.practice_set = val;
        this.query.category = '';
        this.query.question_type = '';
        this.fetchPracticeCtg(val);
      },
    },
  },
  created() {
    const that = this;
    that.logSize = {
      width: 120,
      height: 120,
    };
    that.$bus.on(PrivateConstant.eventKey.removePracticeFromList, (obj) => {
      let index = this.practice_list.indexOf(obj);
      this.practice_list.splice(index, 1);
    });
    that.questionListSelector = {
      maxSelect: 0,
    };

    that.questionListColumns = [
      {
        label: this.$t('m.courseName'),
        getData(row) {
          if (row.practice_type === 0) {
            return row.content;
          } else if (row.practice_type === 2) {
            return row.title;
          }
        },
      },
      {
        label: this.$t('m.direction'),
        prop: 'category_name',
        width: '100',
      },
      {
        label: this.$t('m.type'),
        slot: 'question_type',
        width: '100',
      },
    ];

    that.questionTypeSet = [
      {
        name: that.$t('questionType.singleSelection'),
        questionType: Constant.TaskType.SINGLE.value,
      },
      {
        name: that.$t('questionType.multiSelection'),
        questionType: Constant.TaskType.MULTIPLE.value,
      },
      {
        name: that.$t('questionType.judge'),
        questionType: Constant.TaskType.JUDGE.value,
      },
      {
        name: that.$t('questionType.blank'),
        questionType: Constant.TaskType.BLANK.value,
      },
      {
        name: that.$t('questionType.shortAnswer'),
        questionType: Constant.TaskType.SHORTQUES.value,
      },
      {
        name: that.$t('questionType.operate'),
        questionType: Constant.TaskType.OPERATE.value,
      },
    ];

    that.validateRules = {
      practiseList: [
        {
          required: true,
          validator(rule, value, callback) {
            const { practice_list } = that.model;
            if (practice_list.length > 300) {
              callback(that.$t('views.exam.validation.practiceListOversize'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      name: [{ required: true, validator: Validate.name, trigger: 'blur' }],
      introduction: [{ validator: Validate.description, trigger: 'blur' }],
      practice_list: [
        {
          validator(rule, value, callback) {
            const { practice_list: practiceList = [] } = that.model;
            if (practiceList.length === 0) {
              // callback(that.$message.error(that.$t('views.exam.paper.validate.practiceListPlease')))
              that.$message.error(
                that.$t('views.exam.paper.validate.practiceListPlease'),
              );
            } else {
              callback();
            }
          },
        },
      ],
    };
  },
  mounted() {
    const { id } = this;
    this.fetchPractice();
    if (typeof id !== 'undefined') {
      this.fetchPaper();
    }
  },
  watch() {},
  methods: {
    questionListLoaded({ tableData }) {
      this.questionList = tableData;
      //遍历表格查看是否有和右边已选题目一样的题目,如果有,选中
      this.questionList.forEach((element) => {
        this.practice_list.forEach((item) => {
          if (item.content === element.content) {
            item.resource_id = element.resource_id;
          }
        });
      });
    },
    sameQuestion(q1, q2) {
      return (
        q1.content === q2.content &&
        q1.question_type === q2.question_type &&
        q1.category === q2.category &&
        q1.option === q2.option &&
        q1.practice_type === q2.practice_type &&
        q1.title === q2.title
      );
    },
    translateQuestionType(qt) {
      const found = _.find(
        this.questionTypeSet,
        (item) => item.questionType === qt,
      );
      if (found) {
        return found.name;
      }
      return `未定义 ${qt}`;
    },
    fetchPractice() {
      const that = this;
      that.loading.practiceOptions = true;
      http
        .getAxios('/admin/practice/practice_sets/select_practice_set/')
        .then((resp) => {
          that.options.practice = _.get(resp, 'data');
        })
        .finally(() => {
          that.loading.practiceOptions = false;
        });
    },
    fetchPracticeCtg(practiceSetId) {
      const that = this;
      that.loading.practiceCategoryOptions = true;
      http
        .getAxios(
          '/admin/test_paper/test_papers/get_category_by_practice_set/',
          {
            practice_set: practiceSetId,
          },
        )
        .then((resp) => {
          that.options.topic = _.get(resp, 'data.category');
          that.options.type = _.get(resp, 'data.question_type', []).map(
            (questionType) => {
              return {
                name: that.translateQuestionType(questionType),
                questionType,
              };
            },
          );
        })
        .finally(() => {
          that.loading.practiceCategoryOptions = false;
        });
    },
    importQuestion() {
      const that = this;
      that.loading.importFlag = true;
      const { practice_set, category, question_type, search } = that.query;

      if (!practice_set) {
        that.loading.importFlag = false;
        this.$message.error(this.$t('m.choicePracticeSet'));
        return;
      }

      const { count, score } = that.subjectImporter;

      if (!count) {
        that.loading.importFlag = false;
        this.$message.error(
          this.$t('views.exam.paper.validate.practiceListPlease'),
        );
        return;
      } else if (count > 100) {
        that.loading.importFlag = false;
        this.$message.error(
          this.$t('views.exam.paper.validate.chooseLessPracticeList'),
        );
        return;
      }

      if (score === '') {
        that.loading.importFlag = false;
        this.$message.error(this.$t('m.inputSubjectScore'));
        return;
      }

      http
        .getAxios('/admin/test_paper/test_papers/generate_test_paper/', {
          practice_set,
          category,
          question_type,
          search,
          count,
          score,
        })
        .then((resp) => {
          const generatedTestPaperSource = _.get(resp, 'data', []);
          const arr = that.practice_list;

          generatedTestPaperSource.forEach((item) => {
            const result = arr.find((it) => that.sameQuestion(it, item));
            if (!result) {
              arr.push(item);
            }
          });
          that.practice_list = arr;
          that.loading.importFlag = false;
        })
        .catch((error) => {
          msger.serverError(error, that);
          that.loading.importFlag = false;
        });
    },
    fetchPaper() {
      const that = this;
      that.loading.paper = true;
      const { id } = that;
      http
        .apiAxios('get', `/admin/test_paper/test_papers/${id}/`, {}, {})
        .then((resp) => {
          that.practice_list = resp.data.practice_list;
          this.model.name = resp.data.name;
          this.model.introduction = resp.data.introduction;
          //遍历之前已选择的题目与表格的题目对比,相同的话把表格的resource id 传给已选题目的resource id
          that.questionList.forEach((element) => {
            that.practice_list.forEach((item) => {
              if (item.content === element.content) {
                item.resource_id = element.resource_id;
              }
            });
          });
        })
        .catch((ex) => {
          msger.serverError(ex, that);
        })
        .finally(() => {
          that.loading.paper = false;
        });
    },
    apply() {
      const that = this;
      const { url, id, model } = that;
      const practice_list = that.practice_list;
      let patchUrl = id ? `${url}${id}/` : url;
      let method = id ? 'patch' : 'post';
      this.$refs.introForm.validate((valid) => {
        if (valid) {
          http
            .apiAxios(method, patchUrl, {
              practice_list: practice_list,
              name: model.name,
              introduction: model.introduction,
            })
            .then(() => {
              this.$router
                .push({
                  name: 'exercise-set',
                })
                .catch((ex) => {
                  msger.serverError(ex, that);
                })
                .finally(() => {
                  that.loading.view = false;
                });
            });
        }
      });
    },
    cancel() {
      this.$router.push({
        name: 'exercise-set',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.exam-paper-form {
  .importer-label {
    color: var(--neutral8);
  }
}

.exam-paper-form {
  .importer-label {
    font-size: 14px;
  }
}

.inputright {
  margin-right: 10px;
  margin-bottom: 5px;
}

::v-deep .cb-search-bar .search {
  width: 80%;
}
::v-deep .cb-search-bar .right-area {
  align-items: flex-start;
}

::v-deep .cb-markdown {
  .markdown-body {
    padding: 0 !important;
  }
}
</style>
<style scoped lang="scss">
.practice-importer {
  display: flex;
  justify-content: space-between;
  & > .button {
    flex: 0 0 auto;
  }
  & > .left {
    justify-content: flex-start;
    align-items: center;
    display: flex;
    & > .importer-input {
      justify-content: flex-start;
      align-items: center;
      display: flex;
      & > .importer-label {
        display: inline-block;
        font-size: 14px;
        color: #fff;
      }
    }
  }
}
.practice-criteria-group {
  display: flex;
  & > .practice-criteria {
    flex: 0 0 24%;
  }
}
.exam-paper-form {
  display: flex;
  & > .left,
  & > .right {
    flex: 0 0 50%;
    width: 50%;
    box-sizing: border-box;
  }
}
</style>
