<template>
  <cb-inner-page :background="false">
    <div class="question-content">
      <cb-form>
        <div class="exam-paper-form">
          <div class="left pr30">
            <div class="table-panel">
              <blue-label
                class="mb20"
                :label="$t('m.questionBank')"
              ></blue-label>
              <div class="tableTop">
                <div class="select-btn">
                  <cb-select
                    class="input-right"
                    clearable="clearable"
                    v-loading="loading.practiceOptions"
                    v-model="criteriaPracticeComputed"
                    :options="options.practice"
                    :placeholder="$t('m.choiceProblemSet')"
                    title-field="name"
                    value-field="resource_id"
                    :popper-append-to-body="false"
                    popper-class="setSelect"
                  ></cb-select>
                  <cb-select
                    class="input-right"
                    clearable="clearable"
                    v-loading="loading.practiceCategoryOptions"
                    v-model="query.category_id"
                    :options="options.topic"
                    :placeholder="$t('m.choiceDirectiont')"
                    title-field="name"
                    value-field="resource_id"
                    :popper-append-to-body="false"
                    popper-class="setSelect"
                  ></cb-select>
                  <cb-select
                    class="input-right"
                    clearable="clearable"
                    v-loading="loading.practiceCategoryOptions"
                    v-model="query.question_type"
                    :options="options.type"
                    :placeholder="$t('m.choiceQuestionType')"
                    title-field="name"
                    value-field="questionType"
                  ></cb-select>
                </div>
                <cb-search-input
                  v-model="query.pattern"
                  :placeholder="$t('m.namePh')"
                  style="width: 100%"
                ></cb-search-input>
              </div>
              <cb-search-table
                class="mt20"
                ref="questionListRef"
                url="/oj/admin/paper/practice/list"
                baseURL="/api/ojj"
                :cols="questionListColumns"
                :data="query"
                :selector="questionListSelector"
                :selection.sync="practice_list"
                row-key="resource_id"
                @data-loaded="questionListLoaded"
                show-less-items="show-less-items"
                :showQuickJumper="false"
              >
                <template v-slot:search>
                  <div
                    style="
                      display: flex;
                      width: 100%;
                      justify-content: space-between;
                      margin-right: 0px;
                    "
                  >
                    <div>
                      <span class="importer-label mr10">{{
                        $t('m.randomImport')
                      }}</span>
                      <cb-input-number
                        class="number-input-width-5"
                        :placeholder="
                          $t('views.exam.paper.importer.randomImport')
                        "
                        :min="1"
                        :max="100"
                        v-model="subjectImporter.count"
                        controls-position="right"
                        size="small"
                        :precision="0"
                      ></cb-input-number>
                      <span class="importer-label ml10">{{
                        $t('m.topic')
                      }}</span>
                    </div>
                    <div>
                      <cb-button
                        color-type="hollow"
                        icon="icon-daoru"
                        @click="importQuestion"
                        >{{ $t('common.import') }}</cb-button
                      >
                    </div>
                  </div>
                </template>
                <template v-slot:question_type="scope"
                  ><span
                    v-if="
                      scope.data.question_type ===
                      $CONSTANT.TaskType.SINGLE.value
                    "
                    >{{ $t('questionType.singleSelection') }}</span
                  ><span
                    v-if="
                      scope.data.question_type ===
                      $CONSTANT.TaskType.MULTIPLE.value
                    "
                    >{{ $t('questionType.multiSelection') }}</span
                  ><span
                    v-if="
                      scope.data.question_type ===
                      $CONSTANT.TaskType.JUDGE.value
                    "
                    >{{ $t('questionType.judge') }}</span
                  ><span
                    v-if="
                      scope.data.question_type ===
                      $CONSTANT.TaskType.BLANK.value
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
                      scope.data.question_type !==
                        $CONSTANT.TaskType.JUDGE.value &&
                      scope.data.question_type !==
                        $CONSTANT.TaskType.JUDGE.value &&
                      scope.data.question_type !==
                        $CONSTANT.TaskType.BLANK.value &&
                      scope.data.question_type !==
                        $CONSTANT.TaskType.SHORTQUES.value
                    "
                    >{{ $t('questionType.operate') }}</span
                  ></template
                >
              </cb-search-table>
            </div>
          </div>
          <div class="right">
            <blue-label :label="$t('m.testPaper')"></blue-label>
            <practice-set
              v-if="partic_list_new.length != 0"
              :practice-set.sync="practice_list"
            ></practice-set>
            <practice-set
              v-else
              :practice-set.sync="practice_list"
            ></practice-set>
          </div>
        </div>
        <!-- 确定取消底部按钮 -->
        <template slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button mr="mr" @click="apply">{{
              $t('button.confirm')
            }}</cb-button>
            <cb-button button-type="cancel" @click="cancel"></cb-button>
          </cb-button-group>
        </template>
      </cb-form>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import ImageSelector from '@/components/image-selector/index.vue';
import PracticeSet from './components/exam-paper-practice-set.vue';
import PrivateConstant from './constant.js';
import BlueLabel from './components/blue-label.vue';
import Constant from '@/constants';

export default {
  components: {
    PracticeSet,
    ImageSelector,
    BlueLabel,
  },
  props: {
    partic_list_new: {
      type: Array,
      default: () => [],
    },
    lesson_id_edit: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      len: 0, //用来记录选中的条数
      questionSelectionBackup: [], //备份选中的题目，用于删除
      query: {
        practice_set_id: '',
        category_id: '',
        question_type: '',
        pattern: '',
      },
      practice_setlist: [],
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
      model: {
        practice_list: [],
      },
      show: {
        logoUploader: false,
      },
      practice_list: [],
      practice_list1: [],
    };
  },
  computed: {
    $CONSTANT() {
      return Constant;
    },
    criteriaPracticeComputed: {
      get() {
        return this.query.practice_set_id;
      },
      set(val) {
        this.query.practice_set_id = val;
        this.query.category_id = '';
        this.query.question_type = '';
        this.fetchPracticeCtg(val);
      },
    },
    lessonId() {
      return _.get(this, '$route.params.lessonId');
    },
    courseId() {
      return _.get(this, '$route.params.courseId');
    },
  },
  created() {
    const that = this;
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
    that.$bus.on(PrivateConstant.eventKey.removePracticeFromList, (obj) => {
      let index = this.practice_list.indexOf(obj);
      this.practice_list.splice(index, 1);
    });
  },
  mounted() {
    this.fetchPractice();
    const { lessonId } = this;

    //lessonId是undefined说明是新增的,不是undefined说明是点击练习进来的
    if (typeof lessonId !== 'undefined') {
      //如果传入了lessonId参数有两种情况，分别是点击列表页的练习和编辑详情页面添加题目
      if (this.$route.name === 'lessons-edit') {
        this.practice_list = _.cloneDeep(this.partic_list_new);
      } else {
        this.fetchPaper();
      }
    } else {
      // 点击新增进来的
      if (this.partic_list_new.length !== 0) {
        // this.practice_list = this.partic_list_new;
        this.practice_list = _.cloneDeep(this.partic_list_new);
      }
    }
  },
  methods: {
    dataLoaded() {},
    questionListLoaded({ tableData }) {
      this.questionList = tableData;
      //遍历表格查看是否有和右边已选题目一样的题目,如果有,选中
      // this.questionList.forEach((element) => {
      //   this.practice_list.forEach((item) => {
      //     if (
      //       item.content === element.content &&
      //       item.practice_type === element.practice_type &&
      //       item.resource_id === element.resource_id
      //     ) {
      //       item.resource_id = element.resource_id;
      //     }
      //   });
      // });
    },
    sameQuestion(q1, q2) {
      return (
        q1.content === q2.content &&
        q1.question_type === q2.question_type &&
        q1.category_id === q2.category_id &&
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
      // 获取习题集
      this.$request
        .get('/oj/admin/paper/select_info', null, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          that.options.practice = _.get(res, 'data.data.practice_set');
        })
        .finally(() => {
          that.loading.practiceOptions = false;
        });
    },
    // 获取方向，题型

    fetchPracticeCtg(practiceSetId) {
      const that = this;
      that.loading.practiceCategoryOptions = true;
      this.$request
        .get(
          '/oj/admin/paper/select_info',
          {
            practice_set_id: practiceSetId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          that.options.topic =
            _.get(resp, 'data.data.category') == null
              ? []
              : _.get(resp, 'data.data.category');
          that.options.type = (
            _.get(resp, 'data.data.question_type', []) == null
              ? []
              : _.get(resp, 'data.data.question_type', [])
          ).map((questionType) => {
            return {
              name: that.translateQuestionType(questionType),
              questionType,
            };
          });
        })
        .finally(() => {
          that.loading.practiceCategoryOptions = false;
        });
    },
    //导入
    importQuestion() {
      const that = this;
      that.loading.importFlag = true;
      const { practice_set_id, category_id, question_type, pattern } =
        that.query;

      if (!practice_set_id) {
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
      let resource_ids = [];
      resource_ids = this.practice_list.reduce((prev, item) => {
        prev.push(item.resource_id);
        return prev;
      }, []);
      this.$request
        .post(
          '/oj/admin/paper/random/practice',
          {
            practice_set_id,
            category_id,
            question_type,
            pattern,
            count,
            score,
            resource_ids,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          const generatedTestPaperSource = _.get(resp, 'data.data', []);
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
          that.loading.importFlag = false;
        });
    },
    // 回显
    fetchPaper() {
      const that = this;
      that.loading.paper = true;
      const { lessonId } = that;

      that.$request
        .get(
          '/oj/admin/lesson/practice',
          {
            lesson_id: lessonId,

            course_id: this.courseId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          that.practice_list = resp.data.data ? resp.data.data : [];
          //遍历之前已选择的题目与表格的题目对比,相同的话把表格的resource id 传给已选题目的resource id
          that.questionList.forEach((element) => {
            that.practice_list.forEach((item) => {
              if (
                item.content === element.content &&
                item.practice_type === element.practice_type
              ) {
                item.resource_id = element.resource_id;
              }
            });
          });
        })
        .finally(() => {
          that.loading.paper = false;
        });
    },
    apply() {
      //点击确定按钮
      const that = this;
      that.loading.view = true;
      const { lessonId, model, courseId } = that;
      const practice_list = that.practice_list.map((item) => {
        return {
          // practice_type: item.practice_type,
          // resource_id: item.resource_id,
          // score: item.score,
          ...item,
        };
      });
      //typeof(lessonId) == 'undefined'说明是新增的
      //新增
      if (typeof lessonId == 'undefined') {
        that.$emit('addP', practice_list);
      } else if (this.lesson_id_edit != '') {
        //编辑
        that.$emit('addP', practice_list);
      } else {
        // 判断是勾选数据是否有ref_id字段,没有的话传空
        practice_list.forEach((item) => {
          if (!item.ref_id) {
            item['ref_id'] = '';
          }
        });

        this.$request
          .patch(
            '/oj/admin/lesson/practice',
            { practice_list: practice_list, resource_id: lessonId },
            {
              baseURL: '/api/ojj',
            },
          )
          .then(() => {
            this.$router.push({
              name: 'lessons-manage',
              params: {
                courseId,
              },
            });
          })
          .finally(() => {
            that.loading.view = false;
          });
      }
    },
    cancel() {
      const that = this;
      const { courseId, lessonId } = that;
      // 三个入口 add edit（弹框） practice（页面）
      if (that.$route.path.includes('practice')) {
        that.$router.push({
          name: 'lessons-manage',
          params: {
            courseId,
          },
        });
      } else {
        this.$emit('closeNewP');
      }
    },
  },
};
</script>
<style scoped lang="scss">
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
::v-deep .cb-search-bar .search {
  width: 80%;
}
::v-deep .cb-search-bar .right-area {
  align-items: flex-start;
}
.input-right {
  margin-bottom: 5px;
}
::v-deep .setSelect {
  width: 40px;
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
.question-content {
  width: 100%;
  padding-right: 24px;
  ::v-deep .el-form {
    padding-right: 0;
    padding: 20px 16px;
    background: var(--bg-color-2);
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
.select-btn {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  width: 100%;
  flex-wrap: nowrap;
  .input-right {
    width: calc((100% - 20px) / 3) !important;
  }
}
</style>
