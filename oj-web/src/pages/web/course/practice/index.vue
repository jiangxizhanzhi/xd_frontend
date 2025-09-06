<template>
  <cb-inner-page :background="false">
    <cb-breadcrumb
      v-if="$route.path.indexOf('all-course') != -1"
      @select="goCoursePath"
      :data="breadcrumbData"
      :active="active"
    ></cb-breadcrumb>
    <div class="after-exercises">
      <div class="exercise-header"></div>
      <div class="exercise-content">
        <div class="lesson-box">
          <span class="qt-info">
            <span
              >{{ $t('m.totalPractice') }} {{ total_count }}
              {{ $t('m.qt') }}，{{ $t('m.qz') }}{{ $t('m.objectiveQuestion') }}
              {{ object_count }} {{ $t('m.qt') }}
              <span v-if="isFinish"
                >( {{ $t('m.oqCorrectRate') }}：<span class="right-count">{{
                  getRightCount(accuracy)
                }}</span
                >/{{ getTotalCount(accuracy) }})，</span
              >
              {{ $t('m.subjectiveQuestion') }} {{ subject_count }}
              {{ $t('m.qt') }}</span
            >
          </span>
          <span class="lesson-desc">{{ lessonName }}</span
          ><span class="right-score-info"> </span>

          <span class="level-box">
            <div
              v-if="!level && isFinish"
              class="no-level"
              :class="language === 'zh-CN' ? 'no-level-zh' : 'no-level-en'"
            >
              <CircleModule />
            </div>
            <div
              :class="language === 'zh-CN' ? 'level-box-zh' : 'level-box-en'"
            >
              <div v-if="level && level === 1" class="level">
                <cb-iconfont
                  type="icon-yuejuanwancheng1"
                  :size="90"
                  class="good-color"
                  themedColor="green-color"
                ></cb-iconfont>
                <span class="text-good text-level">{{
                  $t('course.good')
                }}</span>
              </div>
              <div v-if="level && level === 2" class="level">
                <cb-iconfont
                  type="icon-yuejuanwancheng1"
                  :size="90"
                  class="well-color"
                  themedColor="yellow-color"
                ></cb-iconfont>
                <span class="text-well text-level">{{
                  $t('course.well')
                }}</span>
              </div>
              <div v-if="level && level === 3" class="level">
                <cb-iconfont
                  type="icon-yuejuanwancheng1"
                  :size="90"
                  class="middle-color"
                  themedColor="orange-color"
                ></cb-iconfont>
                <span class="text-middle text-level">{{
                  $t('course.middle')
                }}</span>
              </div>
              <div v-if="level && level === 4" class="level">
                <cb-iconfont
                  type="icon-yuejuanwancheng1"
                  :size="90"
                  class="bad-color"
                  themedColor="red-color"
                ></cb-iconfont>
                <span class="text-bad text-level">{{ $t('course.bad') }}</span>
              </div>
            </div>
          </span>
        </div>
        <div class="topic-box">
          <div v-for="(value, key, i) in formatPracticeList" :key="i">
            <exercise-title
              :name="getTopicTitle(key)"
              :topic-length="value.count"
              :score="value.total_score"
            ></exercise-title>
            <div class="big-box">
              <div
                class="common-topic"
                v-for="(item, index) in value.practice_bos"
                :key="index"
              >
                <operation-title
                  v-if="key === 'operation'"
                  :catagoryName="item.direction_name"
                  :difficutlyName="item.difficutyName"
                  :score="item.score"
                  :num="index + 1"
                  :content="item.title"
                  :desc="item.content"
                  :enclosure="item.enclosure"
                ></operation-title>
                <basic-title
                  v-else
                  :name="item.direction_name"
                  :num="index + 1"
                  :content="item.content"
                  :score="item.score"
                ></basic-title>
                <div
                  class="common-option"
                  :class="key === 'operation' ? 'common-operation' : ''"
                >
                  <single-choice
                    v-if="key === 'single'"
                    ref="singleAnswerRules"
                    :value="item.singleAnswer"
                    :exercise-id="item.resource_id"
                    :isSolved="isFinish"
                    :data="item.singleList"
                    @sendSingleChoice="getBasicAnswer"
                  ></single-choice>
                  <multiple-choice
                    v-else-if="key === 'multiple'"
                    ref="multipleAnswerRules"
                    :value="item.multipleAnswer"
                    :exercise-id="item.resource_id"
                    :isSolved="isFinish"
                    :data="item.multipleList"
                    @sendMultiple="getBasicAnswer"
                  ></multiple-choice>
                  <judgment-questions
                    v-else-if="key === 'judgment'"
                    ref="judgmentAnswerRules"
                    v-model="item.judgmentAnswer"
                    :exercise-id="item.resource_id"
                    :isSolved="isFinish"
                    :data="item.judgmentList"
                    @sendJudgment="getBasicAnswer"
                  ></judgment-questions>
                  <completion
                    v-else-if="key === 'fill_blank'"
                    ref="completionAnswerRules"
                    :data="item.completionList"
                    :exercise-id="item.resource_id"
                    :isSolved="isFinish"
                    @sendCompletion="getBasicAnswer"
                  ></completion>
                  <short-answer
                    class="course-practice-short-answer"
                    v-else-if="key === 'short_answer'"
                    ref="shortAnswerRules"
                    :exercise-id="item.resource_id"
                    v-model="item.shortAnswerList"
                    :isSolved="isFinish"
                    @sendShortAnswer="getBasicAnswer"
                  ></short-answer>
                  <operation
                    v-else-if="key === 'operation'"
                    ref="operationRules"
                    v-model="item.operationAnswer"
                    :crEventDatas="item"
                    :isSolved="isFinish"
                    :exercise-id="item.resource_id"
                    :examResource="item.resource_id"
                    @sendOperation="getBasicAnswer"
                    :content="item.title"
                    :lesson-id="lessonId"
                    :shareMode="item.scene_share_mode"
                  ></operation>
                  <div class="right-answer-box" v-if="isFinish">
                    <span v-if="key !== 'fill_blank'"
                      >{{ $t('m.correctAnswer') }}： {{ item.answer }}</span
                    ><span v-else
                      >{{ $t('m.correctAnswer') }}：<span
                        v-for="(item, index) in item.rightAnswer"
                        :key="index"
                        >{{ item + '、' }}</span
                      ></span
                    >
                  </div>
                </div>
                <div class="right-wrong-box" v-if="isFinish">
                  <template v-if="key == 'short_answer' || key == 'fill_blank'">
                    <template v-if="!level">
                      <cb-tooltip
                        :content="
                          key == 'short_answer'
                            ? $t('course.shortAnswerWarn')
                            : $t('course.fillBankNoJudge')
                        "
                        popper-class="tool-tip"
                      >
                        <span class="warning-info">
                          <cb-iconfont
                            type="icon-caozuoshuoming1"
                            themedColor="primary-color"
                            size="18"
                          ></cb-iconfont>
                        </span>
                      </cb-tooltip>
                    </template>

                    <div v-else class="success-info">
                      <cb-tooltip :content="$t('course.hasRed')">
                        <cb-iconfont
                          type="icon-xuanze1"
                          themedColor="green-color"
                        ></cb-iconfont>
                      </cb-tooltip>
                    </div>
                  </template>
                  <template v-else>
                    <div>
                      <cb-iconfont
                        v-if="
                          item.resolved_detail && item.resolved_detail.solved
                        "
                        type="icon-chenggong"
                        themedColor="--green-color"
                      />
                      <cb-iconfont
                        v-else
                        type="icon-shibai"
                        themedColor="--red-color"
                      />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="topic-submit" v-if="!isFinish">
          <status-btn
            class="submit-button"
            :icon-name="'icon-xiafa'"
            :btn-name="$t('m.exercise.submit')"
            :status-class="'submit-btn'"
            @click.native="submitPractice"
          ></status-btn>
        </div>
      </div>
      <div class="solved-idea">
        <div class="solved-title">
          <div class="title-square fl"></div>
          <div class="title-span fl">{{ $t('m.solvedIdea') }}</div>
        </div>
        <div class="solved-box">
          <my-notes
            :mark-notes.sync="solvedIdea"
            @submitNote="submitSolvedIdea"
            :businessType="BUSINESS_TYPE.OJ_WEB_COURSE"
            :restType="4"
            :fileSize="1024 * 1024 * 1024"
          ></my-notes>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import Utils from '@/utils/util';
import ExerciseTitle from './components/exercise-title';
import basicTitle from '@/components/exercise-select/basic-title.vue';
import operationTitle from '@/components/exercise-select/operation-title.vue';
import statusBtn from '@/components/button/status-btn.vue';
import singleChoice from '@/components/exercise-select/single-choice.vue';
import multipleChoice from '@/components/exercise-select/multiple-choice.vue';
import judgmentQuestions from '@/components/exercise-select/judgment-questions.vue';
import completion from '@/components/exercise-select/completion.vue';
import shortAnswer from '@/components/exercise-select/short-answer.vue';
import Operation from './components/operation.vue';
import MyNotes from '@/components/notes/my-notes';
import Http from '@/utils/http.js';
import _ from 'lodash';
import { setBreadcrumbTitle } from '@cyber/ui';
import { getLanguage } from '@cyber/helper';
import CircleModule from './components/circle.vue';

import {
  DIFFICULTY,
  NOTE_TYPE,
  BUSINESS_TYPE,
} from '@/pages/web/course/constant.js';

export default {
  name: 'Index',
  components: {
    ExerciseTitle,
    basicTitle,
    operationTitle,
    statusBtn,
    singleChoice,
    multipleChoice,
    judgmentQuestions,
    completion,
    shortAnswer,
    Operation,
    MyNotes,
    CircleModule,
  },
  data() {
    return {
      BUSINESS_TYPE,
      language: getLanguage(),
      lessonId: '',
      exerciseId: '',
      courseName: '',
      coursePath: '',
      lessonName: '',
      lessonPath: '',
      totalScore: '',
      userScore: '',
      isFinish: null,
      solvedIdea: '',
      practiceList: {},
      localRecord: [], // 本地存储的答案
      localRecordNew: {}, // 本地存储的新答案
      accuracy: '',
      level: '',
      object_count: 0,
      subject_count: 0,
      total_count: 0,
      breadcrumbData: [
        {
          name: 'course',
          path: `course`,
          meta: { title: this.$t('practiseBreadcrumbs.classroom') },
        },
      ],
      active: {},
      room_id: '',
    };
  },
  computed: {
    // ...mapGetters(['user_id']),
    user_id() {
      return this.$store.state.user.id;
    },

    judgmentList() {
      return [
        {
          name: this.$t('m.correct'),
          label: 'A',
        },
        {
          name: this.$t('m.error'),
          label: 'B',
        },
      ];
    },
    difficultList() {
      return [
        {
          id: DIFFICULTY.PRIMARY,
          name: this.$t('m.lowLevel'),
        },
        {
          id: DIFFICULTY.MEDIUM,
          name: this.$t('m.middleLevel'),
        },
        {
          id: DIFFICULTY.ADVANCED,
          name: this.$t('m.highLevel'),
        },
      ];
    },
    breadList() {
      return [
        {
          title: this.$t('m.course'),
          path: '/course',
        },
        {
          title: this.courseName,
          path: this.coursePath,
        },
        {
          title: this.lessonName,
          path: this.lessonPath,
        },
        {
          title: this.$t('m.homework'),
        },
      ];
    },
    formatPracticeList: {
      get() {
        if (!_.isEmpty(this.practiceList)) {
          const that = this;
          for (const x in this.practiceList) {
            if (x === 'single') {
              _.forEach(this.practiceList[x].practice_bos, (item) => {
                if (that.isFinish) {
                  this.$set(
                    item,
                    'singleAnswer',
                    item.resolved_detail && item.resolved_detail.user_answer
                      ? item.resolved_detail.user_answer
                      : '',
                  );
                } else {
                  let flag = 0;
                  for (let i = 0; i < that.localRecord.length; i++) {
                    if (that.localRecord[i].practice_id == item.resource_id) {
                      this.$set(
                        item,
                        'singleAnswer',
                        that.localRecord[i].submit_answer,
                      );
                      flag = 1;
                      break;
                    }
                  }
                  if (flag == 0) {
                    this.$set(item, 'singleAnswer', '');
                  }
                }
                const choiceList = [];
                const data = JSON.parse(_.get(item, 'option'));
                for (const key in data) {
                  const item = {
                    name: `${key}. ${data[key]}`,
                    label: key,
                  };
                  choiceList.push(item);
                }
                this.$set(item, 'singleList', choiceList);
              });
            } else if (x === 'multiple') {
              _.forEach(this.practiceList[x].practice_bos, (item) => {
                if (that.isFinish) {
                  this.$set(
                    item,
                    'multipleAnswer',
                    item.resolved_detail && item.resolved_detail.user_answer
                      ? item.resolved_detail.user_answer.split('|')
                      : [],
                  );
                } else {
                  let flag = 0;
                  for (let i = 0; i < that.localRecord.length; i++) {
                    if (that.localRecord[i].practice_id == item.resource_id) {
                      this.$set(
                        item,
                        'multipleAnswer',
                        that.localRecord[i].submit_answer.split('|'),
                      );
                      flag = 1;
                      break;
                    }
                  }
                  if (flag == 0) {
                    this.$set(item, 'multipleAnswer', []);
                  }
                }

                const choiceList = [];
                const data = JSON.parse(_.get(item, 'option'));
                for (const key in data) {
                  const item = {
                    name: `${key}. ${data[key]}`,
                    label: key,
                  };
                  choiceList.push(item);
                }
                this.$set(item, 'multipleList', choiceList);
              });
            } else if (x === 'judgment') {
              // 判断题A是正确，B是错误
              _.forEach(this.practiceList[x].practice_bos, (item) => {
                if (item.answer === 'A') {
                  item.answer = this.$t('m.correct');
                } else if (item.answer === 'B') {
                  item.answer = this.$t('m.error');
                }
              });
              _.forEach(this.practiceList[x].practice_bos, (item) => {
                if (that.isFinish) {
                  this.$set(
                    item,
                    'judgmentAnswer',
                    item.resolved_detail && item.resolved_detail.user_answer
                      ? item.resolved_detail.user_answer
                      : '',
                  );
                } else {
                  let flag = 0;
                  for (let i = 0; i < that.localRecord.length; i++) {
                    if (that.localRecord[i].practice_id == item.resource_id) {
                      this.$set(
                        item,
                        'judgmentAnswer',
                        that.localRecord[i].submit_answer,
                      );
                      flag = 1;
                      break;
                    }
                  }
                  if (flag == 0) {
                    this.$set(item, 'judgmentAnswer', '');
                  }
                }
                this.$set(item, 'judgmentList', that.judgmentList);
              });
            } else if (x === 'fill_blank') {
              _.forEach(this.practiceList[x].practice_bos, (item) => {
                if (that.isFinish) {
                  this.$set(
                    item,
                    'completionList',
                    item.resolved_detail && item.resolved_detail.user_answer
                      ? JSON.parse(item.resolved_detail.user_answer)
                      : {},
                  );
                  this.$set(
                    item,
                    'rightAnswer',
                    _.map(JSON.parse(item.answer), 'value'),
                  );
                } else {
                  let flag = 0;
                  for (let i = 0; i < that.localRecord.length; i++) {
                    if (that.localRecord[i].practice_id == item.resource_id) {
                      this.$set(
                        item,
                        'completionList',
                        JSON.parse(that.localRecord[i].submit_answer),
                      );
                      flag = 1;
                      break;
                    }
                  }
                  if (flag == 0) {
                    const data = _.get(item, 'blank_count');
                    const fillList = {};
                    _.times(data, (item) => {
                      fillList[item] = '';
                    });
                    this.$set(item, 'completionList', fillList);
                  }
                }
              });
            } else if (x === 'short_answer') {
              _.forEach(this.practiceList[x].practice_bos, (item) => {
                if (that.isFinish) {
                  this.$set(
                    item,
                    'shortAnswerList',
                    (item.resolved_detail &&
                      item.resolved_detail.user_answer) ||
                      '',
                  );
                } else {
                  let flag = 0;
                  for (let i = 0; i < that.localRecord.length; i++) {
                    if (that.localRecord[i].practice_id == item.resource_id) {
                      this.$set(
                        item,
                        'shortAnswerList',
                        that.localRecord[i].submit_answer,
                      );
                      flag = 1;
                      break;
                    }
                  }
                  if (flag == 0) {
                    this.$set(item, 'shortAnswerList', '');
                  }
                }
              });
            } else if (x === 'operation') {
              _.forEach(this.practiceList[x].practice_bos, (item) => {
                const enclosure = item.file_path
                  ? item.file_path +
                    '?attname=' +
                    encodeURIComponent(item.file_name)
                  : '';
                this.$set(item, 'enclosure', enclosure);
                this.$set(
                  item,
                  'difficutyName',
                  _.find(
                    this.difficultList,
                    (ele) => ele.id === item.difficulty,
                  ).name,
                );
                if (that.isFinish) {
                  this.$set(
                    item,
                    'operationAnswer',
                    (item.resolved_detail &&
                      item.resolved_detail.user_answer) ||
                      '',
                  );
                } else {
                  let flag = 0;
                  for (let i = 0; i < that.localRecord.length; i++) {
                    if (that.localRecord[i].practice_id == item.resource_id) {
                      this.$set(
                        item,
                        'operationAnswer',
                        that.localRecord[i].submit_answer,
                      );
                      flag = 1;
                      break;
                    }
                  }
                  if (flag == 0) {
                    this.$set(item, 'operationAnswer', '');
                  }
                }
              });
            }
          }
          return this.practiceList;
        }
        return null;
      },
    },
  },
  created() {
    this.lessonId = this.$route.params && this.$route.params.lesson_id;
    this.exerciseId = this.$route.params && this.$route.params.exercise_id;
    this.room_id = this.$route.query && this.$route.query.room_id;
  },
  mounted() {
    this.getPracticeInfo();
    this.getSolvedIdea();
    // console.log(this.localRecord, 'mountedLocalRecord')
  },
  methods: {
    // 处理正确率
    getRightCount(str) {
      if (str) {
        let ipos = str.indexOf('/');
        let str1 = str.substring(0, ipos);
        return str1;
      }
    },
    getTotalCount(str) {
      if (str) {
        let ipos = str.indexOf('/');
        let str2 = str.substring(ipos + 1, str.length);
        return str2;
      }
    },
    // 获取课后习题信息
    getPracticeInfo() {
      this.$request
        .get(
          '/oj/lesson/practice_after_class',
          {
            course_id: this.$route.params && this.$route.params.resource_id,
            resource_id: this.lessonId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          // console.log(res, '获取课后习题信息')
          this.courseName = _.get(res, 'data.data.lesson_info.course_name', '');
          this.lessonName = _.get(res, 'data.data.lesson_info.lesson_name', '');
          this.accuracy = _.get(res, 'data.data.practice_info.accuracy', '');
          this.level = _.get(res, 'data.data.practice_info.level', '');
          this.object_count = _.get(
            res,
            'data.data.practice_info.object_count',
            '',
          );
          this.subject_count = _.get(
            res,
            'data.data.practice_info.subject_count',
            '',
          );
          this.total_count = _.get(
            res,
            'data.data.practice_info.total_count',
            '',
          );
          if (this.$route.path.indexOf('all-course') != -1) {
            this.setBreadcrumb(this.lessonName);
          } else {
            setBreadcrumbTitle(this.lessonName);
          }
          this.coursePath =
            '/course/detail/' + res.data.data.lesson_info.course_id + '/';
          if (this.$route.path.indexOf('all-course') != -1) {
            this.lessonPath =
              '/all-course/lesson/' +
              res.data.data.lesson_info.course_id +
              '/' +
              res.data.data.lesson_info.lesson_id +
              '/';
          } else if (this.$route.path.indexOf('knowledge-course') != -1) {
            this.lessonPath =
              '/knowledge-course/lesson/' +
              res.data.lesson_info.course +
              '/' +
              res.data.lesson_info.resource_id +
              '/';
          } else {
            this.lessonPath =
              '/course/lesson/' +
              res.data.data.lesson_info.course_id +
              '/' +
              res.data.data.lesson_info.lesson_id +
              '/';
          }

          this.isFinish = _.get(res, 'data.data.evaluate_result.solved', null);
          this.totalScore = _.get(
            res,
            'data.data.evaluate_result.total_score',
            0,
          );
          this.userScore = _.get(res, 'data.data.evaluate_result.score', 0);
          this.practiceList = _.get(res, 'data.data.practice_list', {});
          if (!this.isFinish) {
            const records = localStorage.getItem(
              this.exerciseId + this.user_id + '-exercise',
            );
            let localRecordBackup = records ? JSON.parse(records) : [];
            // 遍历本地存储的题目是否有需要删除更新的
            const practiceListBackup = _.cloneDeep(this.practiceList);
            let localRecordBackupNew = [];
            if (localRecordBackup.length != 0) {
              Object.keys(practiceListBackup).forEach((property) => {
                practiceListBackup[property].practice_bos.forEach((item) => {
                  for (let i = 0; i < localRecordBackup.length; i++) {
                    if (item.resource_id == localRecordBackup[i].practice_id) {
                      localRecordBackupNew.push(localRecordBackup[i]);
                      break;
                    }
                  }
                });
              });
              localStorage.removeItem(
                this.exerciseId + this.user_id + '-exercise',
              );
              localStorage.setItem(
                this.exerciseId + this.user_id + '-exercise',
                JSON.stringify(localRecordBackupNew),
              );
              this.localRecord = _.cloneDeep(localRecordBackupNew);
              console.log(this.localRecord, 'localRecordBackupNew');
            } else {
              this.localRecord = _.cloneDeep(localRecordBackup);
              console.log(this.localRecord, 'localRecordBackup');
            }
          }
        });
    },
    // 获取题目类型
    getTopicTitle(val) {
      if (val === 'single') {
        return this.$t('subject.radioTopic');
      } else if (val === 'multiple') {
        return this.$t('subject.multipleSelectionTopic');
      } else if (val === 'judgment') {
        return this.$t('subject.judgeTopic');
      } else if (val === 'fill_blank') {
        return this.$t('subject.fillPositionTopic');
      } else if (val === 'short_answer') {
        return this.$t('subject.questionAnswerTopic');
      } else if (val === 'operation') {
        return this.$t('subject.operateTopic');
      }
    },
    // 单个答题
    getBasicAnswer(val, exerciseId, type, flag) {
      let localItem = {};
      localItem.practice_id = exerciseId;
      localItem.question_type = type;
      localItem.submit_answer = val;
      // 实操题
      if (typeof flag != 'undefined' && flag == 1) {
        localItem.practice_type = 2;
      } else {
        localItem.practice_type = 0;
      }
      let exitFlag = 0;
      let exitFlagIndex = 1;
      for (let i = 0; i < this.localRecord.length; i++) {
        if (this.localRecord[i].practice_id == exerciseId) {
          exitFlag = 1;
          exitFlagIndex = i;
          break;
        }
      }
      if (exitFlag == 0) {
        this.localRecord.push(localItem);
      } else {
        this.localRecord.splice(exitFlagIndex, 1, localItem);
      }
      localStorage.setItem(
        this.exerciseId + this.user_id + '-exercise',
        JSON.stringify(this.localRecord),
      );
    },
    submitPractice() {
      // console.log('提交课后练习', this.localRecord);
      this.$request
        .post(
          '/oj/lesson/submit_answer',
          {
            answers: this.localRecord,
            course_id: this.$route.params && this.$route.params.resource_id,
            lesson_id: this.lessonId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message.success(this.$t('m.tips.submitSuccess'));
          setTimeout(() => {
            this.$router.go(0);
          }, 1500);
        });
    },
    submitSolvedIdea(value) {
      //校验解题思路长度最大2048
      const len = Utils.getByteLen(value);
      if (len > 2048) {
        this.$message.error(this.$t('m.solveIdeas'));
        return false;
      } else {
        this.$request
          .post(
            '/oj/note',
            {
              business_id: this.lessonId,
              note_type: NOTE_TYPE.NOTE,
              business_type: 4,
              content: this.solvedIdea,
            },
            {
              baseURL: '/api/ojj',
            },
          )
          .then((res) => {
            this.$message.success(this.$t('m.saveSuccessful'));
          });
      }
    },
    // 获取解题思路
    getSolvedIdea() {
      this.$request
        .get(
          '/oj/note',
          {
            resource_id: this.lessonId,
            note_type: 1,
            resource_type: 4,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.solvedIdea = res.data.data != null ? res.data.data.content : '';
        });
    },
    // 回到课堂
    goCoursePath() {
      this.$router.push({
        path: this.lessonPath,
        query: {
          room_id: `${this.room_id}`,
        },
      });
    },
    // 设置当前面包屑
    setBreadcrumb(data) {
      this.active = {
        meta: {
          title: `${this.$t('practiseBreadcrumbs.practice')} - ${data}`,
          breadcrumb: {
            parentName: 'course',
          },
        },
      };
    },
  },
};
</script>

<style scoped lang="scss">
.after-exercises {
  .exercise-content {
    min-height: 200px;
    border-radius: 2px;
    margin-top: 20px;
    background: var(--bg-color-third);
    .lesson-box {
      width: 100%;
      text-align: center;
      height: 60px;
      line-height: 60px;
      position: relative;
      .qt-info {
        font-size: 14px;
        position: absolute;
        left: 14px;
        .right-count {
          color: var(--green-color);
        }
      }
      .no-level {
        position: absolute;
        top: -20px;
        .text {
          color: var(--orange-color);
          transform: rotate(325deg);
          display: inline-block;
          position: relative;
        }
        .text-zh {
          font-size: 13px;
          top: -30px;
          right: 71px;
        }
        .text-en {
          font-size: 12px;
          top: -31px;
          right: 81px;
        }
      }
      .no-level-zh {
        right: 6px;
      }
      .no-level-en {
        right: 4px;
      }

      .level {
        position: absolute;
        right: -20px;
        top: -14px;
        .good-color {
          color: var(--green-color);
        }
        .well-color {
          color: var(--yellow-color);
        }
        .middle-color {
          color: var(--orange-color);
        }
        .bad-color {
          color: var(--red-color);
        }
        .text-level {
          font-size: 14px;

          transform: rotate(340deg);
          display: inline-block;
          position: relative;
          top: -26px;
          right: 55px;
        }
        .text-good {
          color: var(--green-color);
        }
        .text-well {
          color: var(--yellow-color);
        }
        .text-middle {
          color: var(--orange-color);
        }
        .text-bad {
          color: var(--red-color);
        }
      }
      .level-box-zh {
        .level {
          right: -20px;
        }
      }
      .level-box-en {
        .level {
          right: -15px;
        }
      }

      .score-info {
        padding-right: 25px;
        font-size: 14px;
        float: right;
        .iconlianxidefen {
          margin-right: 10px;
        }
      }
      .right-score-info {
        padding-right: 25px;
        font-size: 14px;
        float: right;
        .iconzongfen {
          margin-right: 10px;
        }
      }
    }
    .topic-submit {
      padding: 40px 0;
      text-align: center;
      display: flex;
      justify-content: center;
      .submit-button {
        width: 70px;
      }
    }
  }
  .solved-idea {
    margin-top: 20px;
    background: var(--bg-color-third);
    border-radius: 2px;
    .solved-title {
      height: 25px;
      line-height: 25px;
      padding: 15px 0 0 15px;
      .title-square {
        width: 6px;
        height: 8px;
        margin-top: 9px;
      }
      .title-span {
        font-size: 16px;
        padding-left: 10px;
      }
    }
    .solved-box {
      padding: 20px 30px;
    }
  }
  .big-box {
    padding: 10px 0;
  }
  .common-topic {
    padding: 10px 36px 10px 20px;
    position: relative;
  }
  .common-operation {
    padding-left: 20px !important;
  }
  .common-option {
    padding-left: 133px;
    margin-top: -3px;
    .right-answer-box {
      font-size: 14px;
      margin-top: -14px;
    }
  }
  .right-wrong-box {
    // width: 20px;
    // height: 20px;
    position: absolute;
    right: 25px;
    top: 20px;
  }
}
</style>
<style lang="scss">
.course-practice-short-answer {
  .el-form-item__label {
    width: 35px !important;
  }
  .el-form-item__content {
    margin-left: 35px !important;
  }
}
</style>
<style lang="scss">
.score-info,
.right-score-info,
.qt-info {
  color: var(--neutral8);
}

.after-exercises,
.solved-idea {
  background: var(--bg-color-2);
}

.right-wrong-box {
  color: var(--red-color);
}
.right-answer-box,
.title-span,
.exercise-title,
.lesson-desc {
  color: var(--neutral8);
}
.success-info {
  color: var(--green-color);
}
.warning-info {
  &:hover {
    svg {
      color: var(--primary-color-8) !important;
    }
  }
}
</style>

<style lang="scss">
.tool-tip {
  min-width: 130px;
}
</style>
