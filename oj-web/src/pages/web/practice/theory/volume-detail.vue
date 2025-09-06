<template>
  <!--  组卷详情页面 -->
  <cb-inner-page :background="false">
    <div v-if="loadingDetail" class="volume-detail-wrapper">
      <div class="top-box">
        <div class="name-box one-overflow">
          {{ volumeDetail && volumeDetail.paper_time }}
          {{ $t('practice.volume') }}
        </div>
        <div v-if="!(volumeDetail && volumeDetail.is_finish)" class="count-box">
          <LabelCount
            class="mr40"
            icon="icon-gou"
            circleColor="var(--green-color-2)"
            :label="$t('practice.right')"
            :count="volumeDetail && volumeDetail.right"
            countColor="--green-color"
          />
          <LabelCount
            class="mr40"
            icon="icon-guanbi"
            circleColor="var(--red-color-2)"
            :label="$t('practice.wrong')"
            :count="volumeDetail && volumeDetail.wrong"
            countColor="--red-color"
          />
          <LabelCount
            icon="icon-jianshao"
            circleColor="var(--yellow-color-2)"
            :label="$t('practice.notStart')"
            :count="volumeDetail && volumeDetail.not_start"
            countColor="--yellow-color"
          />
        </div>
        <div v-else class="count-box">
          <LabelCount
            class="mr40"
            icon="icon-tubiao"
            circleColor="var(--primary-color-2)"
            :label="$t('practice.accuracy')"
            :count="`${volumeDetail && volumeDetail.accuracy_rate}%`"
            countColor="--primary-color"
          />
          <LabelCount
            class="mr40"
            icon="icon-guanbi"
            circleColor="var(--red-color-2)"
            :label="$t('practice.wrong')"
            :count="volumeDetail && volumeDetail.wrong"
            countColor="--red-color"
          />
          <LabelCount
            icon="icon-gou"
            circleColor="var(--green-color-2)"
            :label="$t('practice.right')"
            :count="volumeDetail && volumeDetail.right"
            countColor="--green-color"
          />
        </div>
        <div class="btn-box">
          <cb-button
            v-if="!(volumeDetail && volumeDetail.is_finish)"
            hollow
            @click="continuePrac"
          >
            {{ $t('practice.keepPractice') }}
          </cb-button>
          <cb-button v-else hollow @click="pracAgain">
            {{ $t('practice.practiceAgain') }}
          </cb-button>
        </div>
      </div>
      <div class="line-box"></div>
      <div
        v-for="(item, index) in volumeDetail.practice_list"
        :key="index"
        class="topic-boxs"
      >
        <div class="headline">
          <basic-title-theory
            :id="item.resource_id"
            :difficultName="item.difficultName"
            :difficult="item.difficulty"
            :name="item.categoryName"
            :isCollection="item.is_collection"
            @collection-change="collection"
            :knowledgeDatas="item.knowledgeDatas"
            :solved="item.solved"
            :class="{
              'green-bg': item.solved === THEORYSTATUSTYPE.Solved,
              'red-bg': item.solved === THEORYSTATUSTYPE.Tried,
              'orange-bg': item.solved === THEORYSTATUSTYPE.NotStart,
            }"
          >
          </basic-title-theory>
        </div>
        <div class="topic-content topic-content-com">
          <div class="topic-title-box">
            <div class="topic-index">{{ index + 1 }}.</div>
            <TopicTitle
              class="topic-title"
              :name="item.topicType"
              :content="item.content"
            ></TopicTitle>
          </div>
          <div class="topic-options">
            <single-choice
              v-if="item.theory_type == QUESTIONTYPE.SingleChoice"
              ref="singleAnswerRules"
              :isRule="false"
              v-model="item.singleAnswer"
              :isSolved="item.solvedDisabled"
              :isDisabled="true"
              :data="item.singleList"
              :correct-data="
                item.solvedDetail && item.solvedDetail.correct_answer
                  ? item.solvedDetail.correct_answer
                  : ''
              "
              :isGroupDetail="true"
            ></single-choice>
            <multiple-choice
              v-else-if="item.theory_type == QUESTIONTYPE.MultipleChoice"
              ref="multipleAnswerRules"
              :isRule="false"
              v-model="item.multipleAnswer"
              :isSolved="item.solvedDisabled"
              :isDisabled="true"
              :data="item.multipleList"
              :correct-data="
                item.solvedDetail && item.solvedDetail.correct_answer
                  ? item.solvedDetail.correct_answer
                  : ''
              "
              :isGroupDetail="true"
            ></multiple-choice>
            <judgment-questions
              v-else-if="item.theory_type == QUESTIONTYPE.JudgmentQustion"
              ref="judgmentAnswerRules"
              :isRule="false"
              v-model="item.judgmentAnswer"
              :isSolved="item.solvedDisabled"
              :isDisabled="true"
              :data="judgmentList"
              :correct-data="
                item.solvedDetail && item.solvedDetail.correct_answer
                  ? item.solvedDetail.correct_answer
                  : ''
              "
              :isGroupDetail="true"
            ></judgment-questions>
            <completion
              v-else-if="item.theory_type == QUESTIONTYPE.Completion"
              ref="completionAnswerRules"
              :isRule="false"
              :isSolved="item.solvedDisabled"
              :isDisabled="true"
              :data="item.completionList"
              :changeTransfer="true"
            ></completion>
            <short-answer
              v-else-if="item.theory_type == QUESTIONTYPE.ShortAnswer"
              ref="shortAnswerRules"
              :isRule="false"
              v-model="item.shortAnswerList"
              :isSolved="item.solvedDisabled"
              :isDisabled="true"
              :changeTransfer="true"
            ></short-answer>
            <div
              class="keyWords"
              v-show="
                item.theory_type == QUESTIONTYPE.ShortAnswer &&
                item.shortAnswerKeyword.length > 0
              "
            >
              <div class="title ft14">
                {{ $t('m.exercise.keywords') }}
              </div>
              <div class="keyWordList">
                <div
                  class="keyWord bg321"
                  v-for="(itm, indexKey) in item.shortAnswerKeyword"
                  :key="indexKey"
                >
                  <span class="ft14">{{ itm }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import LabelCount from './components/label-count.vue';
import BasicTitleTheory from '@/components/exercise-select/basic-title-theory.vue';
import TopicTitle from '@/components/exercise-select/topic-title.vue';

import singleChoice from '@/components/exercise-select/single-choice-theory.vue';
import multipleChoice from '@/components/exercise-select/multiple-choice-theory.vue';
import judgmentQuestions from '@/components/exercise-select/judgment-questions-theory.vue';
import completion from '@/components/exercise-select/completion-theory.vue';
import shortAnswer from '@/components/exercise-select/short-answer-theory.vue';

import {
  getVolumeDetail,
  againVolume,
  getCategoryListsApi,
  collectionPaperTopic,
} from '@/api/practice.ts';
import { getComConstantsConfig } from '@/api/common.js';

import {
  TYPE,
  THEORYSTATUSTYPE,
  QUESTIONTYPE,
  COLLECTION_TYPE,
} from '../constant';
export default {
  name: 'VolumeDetail',
  components: {
    LabelCount,
    BasicTitleTheory,
    TopicTitle,
    singleChoice,
    multipleChoice,
    judgmentQuestions,
    completion,
    shortAnswer,
  },
  data() {
    return {
      TYPE,
      THEORYSTATUSTYPE,
      QUESTIONTYPE,
      COLLECTION_TYPE,
      resourceId: '',
      loadingDetail: false,
      volumeDetail: {},
      categorys: [],
      typeList: [],
      difficultList: [],
      judgmentList: [
        {
          name: this.$t('m.exercise.correct'), // '正确'
          label: 'A',
        },
        {
          name: this.$t('m.exercise.error'), // '错误'
          label: 'B',
        },
      ],
    };
  },
  created() {
    this.resourceId = this.$route.params && this.$route.params.id;
  },
  mounted() {
    Promise.all([
      this.getGuidList(),
      this.getTopicType(),
      this.getDifficultList(),
    ]).then(() => {
      this.getVolumeDetailTh();
    });
  },
  methods: {
    getName(list, id, key) {
      const data = list.filter((item) => item[key] === id);
      return data.length && data[0].name;
    },

    // 获取组卷详情
    getVolumeDetailTh() {
      this.loadingDetail = false;
      getVolumeDetail({
        paper_id: this.resourceId,
      }).then((res) => {
        const data = _.get(res, 'data.data');
        _.forEach(data.practice_list, (item) => {
          this.$set(
            item,
            'knowledgeDatas',
            JSON.parse(_.get(item, 'knowledge', '') || null),
          );
          this.$set(
            item,
            'topicType',
            this.getName(this.typeList, item.theory_type, 'code'),
          );
          this.$set(
            item,
            'difficultName',
            this.getName(this.difficultList, item.difficulty, 'code'),
          );
          this.$set(
            item,
            'categoryName',
            this.getName(this.categorys, item.category_id, 'resource_id'),
          );
          // this.knowledgeDatas = JSON.parse(_.get(val, 'knowledge', '') || null);
          // this.QuestionType = _.get(val, 'theory_type', ''); // 题型(0:单选,1:多选,2:判断,3:填空,4:简答)
          // const resolved_detail = _.get(val, 'resolved_detail', '');
          // this.topicSolved = _.get(val, 'solved', '');
          let resolved_detail = null;
          this.$set(
            item,
            'solvedDisabled',
            item.solved === THEORYSTATUSTYPE.Solved ? true : false,
          );
          if (item.solved === THEORYSTATUSTYPE.Solved) {
            resolved_detail = {
              correct_answer: _.get(item, 'answer', ''),
              is_solved: true,
              keyword: _.get(item, 'keyword', null),
              submit_answer: _.get(item, 'answer', ''),
            };
          } else if (item.solved === THEORYSTATUSTYPE.Tried) {
            resolved_detail = {
              is_solved: false,
              submit_answer: _.get(item, 'answer', ''), // 手动加的
            };
          }
          // this.isSolved = _.get(resolved_detail, 'is_solved', '') || false;
          this.$set(item, 'solvedDetail', resolved_detail);
          // this.solvedDetail = resolved_detail;
          const submit_answer = _.get(resolved_detail, 'submit_answer', '');
          const questionType = _.get(item, 'theory_type', '');
          if (questionType === QUESTIONTYPE.SingleChoice) {
            let arr = [];
            const data = JSON.parse(_.get(item, 'option'));
            for (const key in data) {
              const item = {
                name: `${data[key]}`,
                label: key,
              };
              arr.push(item);
            }
            this.$set(item, 'singleList', arr);
            // this.singleAnswer = submit_answer;
            this.$set(item, 'singleAnswer', submit_answer);
          } else if (questionType === QUESTIONTYPE.MultipleChoice) {
            let arr = [];
            const data = JSON.parse(_.get(item, 'option'));
            for (const key in data) {
              const item = {
                name: `${data[key]}`,
                label: key,
              };
              arr.push(item);
            }
            this.$set(item, 'multipleList', arr);
            // this.isSolved
            //   ? (this.multipleAnswer = submit_answer.split('|'))
            //   : (this.multipleAnswer = []);
            // this.multipleAnswer = submit_answer.split('|');
            this.$set(
              item,
              'multipleAnswer',
              submit_answer ? submit_answer.split('|') : null,
            );
          } else if (questionType === QUESTIONTYPE.JudgmentQustion) {
            // this.isSolved
            //   ? (this.judgmentAnswer = submit_answer)
            //   : (this.judgmentAnswer = '');
            // this.judgmentAnswer = submit_answer;
            this.$set(item, 'judgmentAnswer', submit_answer);
          } else if (questionType === QUESTIONTYPE.Completion) {
            const data = _.get(item, 'blank_count');
            let objCompletion = {};
            console.log(submit_answer);
            // if (this.isSolved) {
            if (submit_answer) {
              console.log(submit_answer);
              objCompletion = JSON.parse(submit_answer) || {};
            } else {
              _.times(data, (item) => {
                objCompletion[item] = '';
              });
            }
            this.$set(item, 'completionList', objCompletion);
          } else if (questionType === QUESTIONTYPE.ShortAnswer) {
            // this.isSolved
            //   ? (this.shortAnswerList = submit_answer)
            //   : (this.shortAnswerList = '');
            this.$set(item, 'shortAnswerList', submit_answer);
            this.$set(
              item,
              'shortAnswerKeyword',
              JSON.parse(_.get(resolved_detail, 'keyword', '') || '[]'),
            );
            // this.shortAnswerList = submit_answer;
            // this.shortAnswerKeyword = JSON.parse(
            //   _.get(resolved_detail, 'keyword', '') || '[]',
            // );
          }
        });
        this.volumeDetail = data;
        this.loadingDetail = true;
      });
    },
    continuePrac() {
      this.$router.push({
        path: `/practice/volume-exam/${this.resourceId}`,
        query: {
          from: 'volume-detail',
        },
      });
    },
    pracAgain() {
      againVolume({
        paper_id: this.resourceId,
      }).then((res) => {
        const data = _.get(res, 'data.data');
        this.$router.push({
          path: `/practice/volume-exam/${data.resource_id}`,
          query: {
            from: 'volume-detail',
          },
        });
      });
    },
    collection(val, id) {
      console.log(val, id, '=====');
      collectionPaperTopic({
        is_collection: !val,
        business_id: id,
        business_type: COLLECTION_TYPE.RELATION,
      }).then((res) => {
        const filterIndex = _.findIndex(
          this.volumeDetail.practice_list,
          (item) => {
            return item.resource_id === id;
          },
        );
        console.log(filterIndex);
        if (filterIndex > -1) {
          this.volumeDetail.practice_list[filterIndex].is_collection = !val;
        }
      });
    },
    // 获取难度
    getDifficultList() {
      return new Promise((resolve, reject) => {
        getComConstantsConfig({ type: 10 })
          .then((res) => {
            let arr = res.data.data;
            this.difficultList = arr;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getTopicType() {
      return new Promise((resolve, reject) => {
        getComConstantsConfig({ type: 21 })
          .then((res) => {
            let arr = res.data.data;
            this.typeList = arr;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 方向(类型)页签列表获取
    getGuidList() {
      return new Promise((resolve, reject) => {
        const that = this;
        // 分类类型 0=理论基础 2=实践操作
        getCategoryListsApi({ practice_type: TYPE.Rationale })
          .then((resp) => {
            that.categorys = _.get(resp, 'data.data');
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.green-bg {
  background: var(--green-color-2);
}
.red-bg {
  background: var(--red-color-2);
}
.orange-bg {
  background: var(--yellow-color-2);
}
.mr40 {
  margin-right: 40px;
}
.volume-detail-wrapper {
  padding: 24px 40px;
  background: var(--bg-color-2);
  border-radius: 4px;
  .top-box {
    position: relative;
    .name-box {
      font-size: 20px;
      font-weight: 600;
      color: var(--neutral8);
      line-height: 28px;
      margin-bottom: 16px;
      padding: 0 40px;
      text-align: center;
    }
    .count-box {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }
    .btn-box {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  .line-box {
    width: 100%;
    height: 1px;
    background: var(--neutral1);
    margin-bottom: 16px;
  }
  .topic-boxs {
    margin-bottom: 16px;
    .topic-content {
      // min-height: 260px;
      background: var(--bg-color-3);
      border-radius: 0px 0px 4px 4px;
      .topic-title-box {
        display: flex;
        padding-left: 8px;
        .topic-index {
          width: 25px;
          margin-top: 3px;
          height: 37px;
          line-height: 37px;
          font-size: 16px;
          font-weight: 600;
          color: var(--neutral8);
        }
        .topic-title {
          width: calc(100% - 25px);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.volume-detail-wrapper .topic-content {
  .single-choice-theory,
  .multiple-choice-theory,
  .judgment-questions-theory {
    .el-form .el-form-item {
      margin-bottom: 3px;
    }
  }
  .completion-groups-theory {
    padding-left: 8px;
    .el-form {
      padding-bottom: 0;
    }
    .el-form-item {
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
  .short-answer-theory {
    margin-bottom: 16px;
    .el-form-item {
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
  .keyWords {
    margin-bottom: 6px;
  }
}
</style>
