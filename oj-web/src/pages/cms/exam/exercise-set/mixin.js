import http from '@/utils/http.js';
import _ from 'lodash';
import Constant from '@/constants';
import msger from '@/utils/message.js';
export default {
  data() {
    return {
      query: {
        practice_set: '',
        category: '',
        question_type: '',
        search: '',
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
    };
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
  },
  computed: {
    questionListSelectionComputed: {
      get() {
        const that = this;
        const {
          questionList = [],
          practiceSetComputed = [],
          sameQuestion,
        } = that;
        const arr = [];
        for (const practiceChoosen of practiceSetComputed) {
          const selected = _.find(questionList, (question) =>
            sameQuestion(question, practiceChoosen),
          );
          if (selected) {
            arr.push(selected);
          } else {
          }
        }
        return arr;
      },
      set(selection) {
        const that = this;
        const { questionListSelectionComputed, sameQuestion } = that;
        if (questionListSelectionComputed.length > selection.length) {
          // 删除了元素
          const removal = [];
          for (const q1 of questionListSelectionComputed) {
            const found = _.find(selection, (sel) => sameQuestion(sel, q1));
            if (!found) {
              removal.push(q1);
            }
          }
          const { practice_list: practiceList = [] } = that.model;
          const arr = [];
          for (const ele of practiceList) {
            const found = _.find(removal, (remo) => {
              const flag = sameQuestion(ele, remo);
              return flag;
            });
            if (!found) {
              arr.push(ele);
            }
          }
          that.model.practice_list = arr;
        } else if (questionListSelectionComputed.length < selection.length) {
          // 添加了元素
          const delta1 =
            selection.length - questionListSelectionComputed.length;
          let amount = 0;
          for (const sel of selection) {
            const found = _.find(that.model.practice_list, (q1) =>
              sameQuestion(sel, q1),
            );
            if (!found) {
              that.model.practice_list.push(
                Object.assign({}, sel, {
                  score: 1,
                }),
              );
              amount++;
            }
          }
          if (delta1 > amount) {
            msger.error(that.$t('views.exam.sameQuestion'), that);
          }
        }
      },
    },

    practiceSetComputed: {
      get() {
        const { sameQuestion } = this;
        const { practice_list: practiceList = [] } = this.model;
        const filtered = [];
        for (const ele of practiceList) {
          const found = _.find(filtered, (practice) =>
            sameQuestion(practice, ele),
          );
          if (!found) {
            filtered.push(ele);
          }
        }
        return filtered;
      },
      set(ps) {
        this.model.practice_list = ps;
      },
    },

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
  methods: {
    questionListLoaded({ tableData }) {
      this.questionList = tableData;
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
          const arr = that.model.practice_list;

          generatedTestPaperSource.forEach((item) => {
            const result = arr.find((it) => that.sameQuestion(it, item));
            if (!result) {
              arr.push(item);
            }
          });
          that.model.practice_list = arr;
          that.loading.importFlag = false;
        })
        .catch((error) => {
          msger.serverError(error, that);
          that.loading.importFlag = false;
        });
    },
  },
};
